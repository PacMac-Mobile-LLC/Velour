const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const User = require('../models/User');
const { authenticateToken } = require('../middleware/auth');
const photoFilterService = require('../services/photoFilterService');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../uploads/posts');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  // Allow images, videos, and audio files
  if (file.mimetype.startsWith('image/') || 
      file.mimetype.startsWith('video/') || 
      file.mimetype.startsWith('audio/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image, video, and audio files are allowed'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
    files: 10 // Maximum 10 files per request
  },
  fileFilter: fileFilter
});

// Initialize photo filter service
photoFilterService.initialize();

// @route   POST /api/posts
// @desc    Create a new post
// @access  Private
router.post('/', authenticateToken, upload.array('media', 10), async (req, res) => {
  try {
    const {
      text,
      type = 'text',
      category = 'general',
      privacy = 'public',
      allowComments = true,
      allowShares = true,
      allowReactions = true,
      ageRestricted = false,
      location,
      scheduledFor,
      hashtags = [],
      mentions = []
    } = req.body;

    // Validate required fields
    if (!text && (!req.files || req.files.length === 0)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Post must contain text or media' 
      });
    }

    // Process uploaded media files
    const mediaFiles = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const mediaItem = {
          type: file.mimetype.startsWith('image/') ? 'image' : 
                file.mimetype.startsWith('video/') ? 'video' : 'audio',
          url: `/uploads/posts/${file.filename}`,
          size: file.size,
          metadata: {
            originalName: file.originalname,
            mimeType: file.mimetype,
            uploadedAt: new Date()
          }
        };

        // Get image dimensions if it's an image
        if (mediaItem.type === 'image') {
          try {
            const sharp = require('sharp');
            const metadata = await sharp(file.path).metadata();
            mediaItem.width = metadata.width;
            mediaItem.height = metadata.height;
          } catch (error) {
            console.error('Error getting image metadata:', error);
          }
        }

        // Get video duration if it's a video
        if (mediaItem.type === 'video') {
          try {
            const ffprobe = require('ffprobe-static');
            const ffprobePath = ffprobe.path;
            const { exec } = require('child_process');
            const util = require('util');
            const execAsync = util.promisify(exec);
            
            const { stdout } = await execAsync(
              `${ffprobePath} -v quiet -print_format json -show_format -show_streams "${file.path}"`
            );
            const videoInfo = JSON.parse(stdout);
            const videoStream = videoInfo.streams.find(s => s.codec_type === 'video');
            
            if (videoStream) {
              mediaItem.width = videoStream.width;
              mediaItem.height = videoStream.height;
              mediaItem.duration = parseFloat(videoInfo.format.duration);
            }
          } catch (error) {
            console.error('Error getting video metadata:', error);
          }
        }

        mediaFiles.push(mediaItem);
      }
    }

    // Create post object
    const postData = {
      author: req.user.id,
      content: {
        text: text || '',
        media: mediaFiles,
        hashtags: Array.isArray(hashtags) ? hashtags : [],
        mentions: Array.isArray(mentions) ? mentions : []
      },
      type: mediaFiles.length > 0 ? (mediaFiles.length === 1 ? mediaFiles[0].type : 'mixed') : 'text',
      category,
      privacy: {
        visibility: privacy,
        allowComments,
        allowShares,
        allowReactions,
        ageRestricted
      },
      location: location ? JSON.parse(location) : undefined,
      scheduledFor: scheduledFor ? new Date(scheduledFor) : undefined,
      status: scheduledFor ? 'scheduled' : 'published'
    };

    const post = new Post(postData);
    await post.save();

    // Populate author information
    await post.populate('author', 'name handle avatar verified');

    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      data: post
    });

  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating post',
      error: error.message
    });
  }
});

// @route   GET /api/posts
// @desc    Get posts feed
// @access  Private
router.get('/', authenticateToken, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      type,
      category,
      author,
      hashtag,
      search,
      trending = false
    } = req.query;

    const skip = (page - 1) * limit;
    let posts;

    if (trending === 'true') {
      posts = await Post.findTrending({ limit: parseInt(limit) });
    } else if (hashtag) {
      posts = await Post.findByHashtag(hashtag, { limit: parseInt(limit), skip });
    } else if (search) {
      posts = await Post.searchPosts(search, { limit: parseInt(limit), skip, type, category });
    } else if (author) {
      posts = await Post.findByAuthor(author, { limit: parseInt(limit), skip, type, category });
    } else {
      // Get feed posts (following + public posts)
      const user = await User.findById(req.user.id).populate('following');
      const followingIds = user.following.map(follow => follow._id);
      
      const query = {
        status: 'published',
        $or: [
          { 'privacy.visibility': 'public' },
          { 'privacy.visibility': 'followers', author: { $in: followingIds } },
          { author: req.user.id }
        ]
      };

      if (type) query.type = type;
      if (category) query.category = category;

      posts = await Post.find(query)
        .populate('author', 'name handle avatar verified')
        .populate('engagement.comments')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));
    }

    // Add user engagement status to each post
    const postsWithEngagement = posts.map(post => {
      const postObj = post.toObject();
      postObj.userEngagement = {
        isLiked: post.isLikedBy(req.user.id),
        isSaved: post.isSavedBy(req.user.id),
        isShared: post.isSharedBy(req.user.id),
        userReaction: post.getUserReaction(req.user.id)
      };
      return postObj;
    });

    res.json({
      success: true,
      data: postsWithEngagement,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: posts.length
      }
    });

  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching posts',
      error: error.message
    });
  }
});

// @route   GET /api/posts/:id
// @desc    Get a specific post
// @access  Private
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'name handle avatar verified')
      .populate('engagement.comments')
      .populate('relationships.originalPost')
      .populate('relationships.repostOf');

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Check if user can view this post
    const canView = post.privacy.visibility === 'public' || 
                   post.author._id.equals(req.user.id) ||
                   (post.privacy.visibility === 'followers' && 
                    await User.findById(req.user.id).then(user => 
                      user.following.some(follow => follow._id.equals(post.author._id))
                    ));

    if (!canView) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to view this post'
      });
    }

    // Add view tracking
    await post.addView(req.user.id);

    const postObj = post.toObject();
    postObj.userEngagement = {
      isLiked: post.isLikedBy(req.user.id),
      isSaved: post.isSavedBy(req.user.id),
      isShared: post.isSharedBy(req.user.id),
      userReaction: post.getUserReaction(req.user.id)
    };

    res.json({
      success: true,
      data: postObj
    });

  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching post',
      error: error.message
    });
  }
});

// @route   PUT /api/posts/:id
// @desc    Update a post
// @access  Private
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Check if user is the author
    if (!post.author.equals(req.user.id)) {
      return res.status(403).json({
        success: false,
        message: 'You can only edit your own posts'
      });
    }

    const {
      text,
      category,
      privacy,
      allowComments,
      allowShares,
      allowReactions,
      ageRestricted
    } = req.body;

    // Update allowed fields
    if (text !== undefined) post.content.text = text;
    if (category !== undefined) post.category = category;
    if (privacy !== undefined) post.privacy.visibility = privacy;
    if (allowComments !== undefined) post.privacy.allowComments = allowComments;
    if (allowShares !== undefined) post.privacy.allowShares = allowShares;
    if (allowReactions !== undefined) post.privacy.allowReactions = allowReactions;
    if (ageRestricted !== undefined) post.privacy.ageRestricted = ageRestricted;

    await post.save();

    res.json({
      success: true,
      message: 'Post updated successfully',
      data: post
    });

  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating post',
      error: error.message
    });
  }
});

// @route   DELETE /api/posts/:id
// @desc    Delete a post
// @access  Private
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Check if user is the author or admin
    if (!post.author.equals(req.user.id)) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own posts'
      });
    }

    // Delete associated media files
    if (post.content.media && post.content.media.length > 0) {
      for (const media of post.content.media) {
        const filePath = path.join(__dirname, '..', media.url);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
    }

    // Soft delete by changing status
    post.status = 'deleted';
    await post.save();

    res.json({
      success: true,
      message: 'Post deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting post',
      error: error.message
    });
  }
});

// @route   POST /api/posts/:id/like
// @desc    Like/unlike a post
// @access  Private
router.post('/:id/like', authenticateToken, async (req, res) => {
  try {
    const { reaction = 'like' } = req.body;
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    const isLiked = post.isLikedBy(req.user.id);

    if (isLiked) {
      await post.removeLike(req.user.id);
    } else {
      await post.addLike(req.user.id, reaction);
    }

    res.json({
      success: true,
      message: isLiked ? 'Post unliked' : 'Post liked',
      data: {
        isLiked: !isLiked,
        reaction: !isLiked ? reaction : null,
        likeCount: post.engagement.likes.length
      }
    });

  } catch (error) {
    console.error('Error liking post:', error);
    res.status(500).json({
      success: false,
      message: 'Error liking post',
      error: error.message
    });
  }
});

// @route   POST /api/posts/:id/share
// @desc    Share a post
// @access  Private
router.post('/:id/share', authenticateToken, async (req, res) => {
  try {
    const { shareType = 'share', shareText = '' } = req.body;
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    if (!post.privacy.allowShares) {
      return res.status(403).json({
        success: false,
        message: 'Sharing is not allowed for this post'
      });
    }

    await post.addShare(req.user.id, shareType, shareText);

    res.json({
      success: true,
      message: 'Post shared successfully',
      data: {
        shareCount: post.engagement.shares.length
      }
    });

  } catch (error) {
    console.error('Error sharing post:', error);
    res.status(500).json({
      success: false,
      message: 'Error sharing post',
      error: error.message
    });
  }
});

// @route   POST /api/posts/:id/save
// @desc    Save/unsave a post
// @access  Private
router.post('/:id/save', authenticateToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    const isSaved = post.isSavedBy(req.user.id);

    if (isSaved) {
      await post.removeSave(req.user.id);
    } else {
      await post.addSave(req.user.id);
    }

    res.json({
      success: true,
      message: isSaved ? 'Post unsaved' : 'Post saved',
      data: {
        isSaved: !isSaved,
        saveCount: post.engagement.saves.length
      }
    });

  } catch (error) {
    console.error('Error saving post:', error);
    res.status(500).json({
      success: false,
      message: 'Error saving post',
      error: error.message
    });
  }
});

// @route   POST /api/posts/:id/apply-filter
// @desc    Apply filter to post media
// @access  Private
router.post('/:id/apply-filter', authenticateToken, async (req, res) => {
  try {
    const { mediaIndex, filterType, filterOptions = {} } = req.body;
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Check if user is the author
    if (!post.author.equals(req.user.id)) {
      return res.status(403).json({
        success: false,
        message: 'You can only edit your own posts'
      });
    }

    if (!post.content.media || mediaIndex >= post.content.media.length) {
      return res.status(400).json({
        success: false,
        message: 'Invalid media index'
      });
    }

    const media = post.content.media[mediaIndex];
    
    if (media.type !== 'image') {
      return res.status(400).json({
        success: false,
        message: 'Filters can only be applied to images'
      });
    }

    // Apply filter using photo filter service
    const imagePath = path.join(__dirname, '..', media.url);
    const imageBuffer = fs.readFileSync(imagePath);
    
    const filteredBuffer = await photoFilterService.applyFilter(
      imageBuffer, 
      filterType, 
      filterOptions
    );

    // Save filtered image
    const filteredFilename = `filtered-${Date.now()}-${Math.round(Math.random() * 1E9)}.jpg`;
    const filteredPath = path.join(__dirname, '../uploads/posts', filteredFilename);
    fs.writeFileSync(filteredPath, filteredBuffer);

    // Update media URL and add filter to applied filters
    media.url = `/uploads/posts/${filteredFilename}`;
    if (!media.filters) {
      media.filters = [];
    }
    media.filters.push(filterType);

    await post.save();

    res.json({
      success: true,
      message: 'Filter applied successfully',
      data: {
        media: media,
        filterType: filterType
      }
    });

  } catch (error) {
    console.error('Error applying filter:', error);
    res.status(500).json({
      success: false,
      message: 'Error applying filter',
      error: error.message
    });
  }
});

// @route   GET /api/posts/filters/available
// @desc    Get available filters
// @access  Public
router.get('/filters/available', async (req, res) => {
  try {
    const filters = photoFilterService.getAvailableFilters();
    const isFaceDetectionAvailable = photoFilterService.isFaceDetectionAvailable();

    res.json({
      success: true,
      data: {
        filters,
        faceDetectionAvailable: isFaceDetectionAvailable
      }
    });

  } catch (error) {
    console.error('Error fetching available filters:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching available filters',
      error: error.message
    });
  }
});

module.exports = router;
