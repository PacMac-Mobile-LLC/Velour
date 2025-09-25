const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { authenticateToken } = require('../middleware/auth');
const Video = require('../models/Video');
const VideoLike = require('../models/VideoLike');
const Comment = require('../models/Comment');
const User = require('../models/User');

const router = express.Router();

// Configure multer for video uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads/videos');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Only video files are allowed'), false);
    }
  }
});

// GET /api/videos - Get all public videos
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 20, category, sort = 'recent' } = req.query;
    const skip = (page - 1) * limit;

    let query = { is_public: true, status: 'ready' };
    if (category && category !== 'all') {
      query.category = category;
    }

    let sortOptions = {};
    switch (sort) {
      case 'trending':
        sortOptions = { likes: -1, views: -1, created_at: -1 };
        break;
      case 'popular':
        sortOptions = { views: -1, created_at: -1 };
        break;
      default:
        sortOptions = { created_at: -1 };
    }

    const videos = await Video.find(query)
      .sort(sortOptions)
      .limit(parseInt(limit))
      .skip(skip)
      .lean();

    // Get user information for each video
    const videosWithUsers = await Promise.all(
      videos.map(async (video) => {
        try {
          const user = await User.findOne({ auth0Id: video.user_id }).lean();
          return {
            ...video,
            user: user ? {
              username: user.username || user.nickname || 'unknown',
              display_name: user.displayName || user.name || 'Unknown User',
              avatar_url: user.picture
            } : {
              username: 'unknown',
              display_name: 'Unknown User',
              avatar_url: null
            }
          };
        } catch (error) {
          console.error('Error fetching user for video:', error);
          return {
            ...video,
            user: {
              username: 'unknown',
              display_name: 'Unknown User',
              avatar_url: null
            }
          };
        }
      })
    );

    res.json(videosWithUsers);
  } catch (error) {
    console.error('Error fetching videos:', error);
    res.status(500).json({ error: 'Failed to fetch videos' });
  }
});

// GET /api/videos/:id - Get specific video
router.get('/:id', async (req, res) => {
  try {
    const video = await Video.findById(req.params.id).lean();
    
    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }

    if (!video.is_public) {
      return res.status(403).json({ error: 'Video is private' });
    }

    // Get user information
    const user = await User.findOne({ auth0Id: video.user_id }).lean();
    const videoWithUser = {
      ...video,
      user: user ? {
        username: user.username || user.nickname || 'unknown',
        display_name: user.displayName || user.name || 'Unknown User',
        avatar_url: user.picture
      } : {
        username: 'unknown',
        display_name: 'Unknown User',
        avatar_url: null
      }
    };

    res.json(videoWithUser);
  } catch (error) {
    console.error('Error fetching video:', error);
    res.status(500).json({ error: 'Failed to fetch video' });
  }
});

// POST /api/videos/upload - Upload new video
router.post('/upload', authenticateToken, upload.single('video'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No video file provided' });
    }

    const { title, description, userId } = req.body;

    if (!title || !userId) {
      return res.status(400).json({ error: 'Title and userId are required' });
    }

    // Create video record
    const video = new Video({
      title: title.trim(),
      description: description ? description.trim() : '',
      video_url: `/uploads/videos/${req.file.filename}`,
      user_id: userId,
      file_size: req.file.size,
      mime_type: req.file.mimetype,
      status: 'ready' // For now, mark as ready immediately
    });

    await video.save();

    res.status(201).json({
      message: 'Video uploaded successfully',
      video: {
        id: video._id,
        title: video.title,
        description: video.description,
        video_url: video.video_url,
        user_id: video.user_id,
        created_at: video.createdAt
      }
    });
  } catch (error) {
    console.error('Error uploading video:', error);
    
    // Clean up uploaded file if database save fails
    if (req.file) {
      const filePath = path.join(__dirname, '../../uploads/videos', req.file.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    
    res.status(500).json({ error: 'Failed to upload video' });
  }
});

// POST /api/videos/:id/like - Toggle like on video
router.post('/:id/like', authenticateToken, async (req, res) => {
  try {
    const videoId = req.params.id;
    const userId = req.user.sub;

    // Check if video exists
    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }

    // Toggle like
    const result = await VideoLike.toggleLike(videoId, userId);
    
    // Get updated like count
    const updatedVideo = await Video.findById(videoId);
    
    res.json({
      isLiked: result.isLiked,
      likeCount: updatedVideo.likes
    });
  } catch (error) {
    console.error('Error toggling like:', error);
    res.status(500).json({ error: 'Failed to toggle like' });
  }
});

// GET /api/videos/:id/comments - Get comments for video
router.get('/:id/comments', async (req, res) => {
  try {
    const { limit = 50, skip = 0 } = req.query;
    const comments = await Comment.getByVideo(req.params.id, parseInt(limit), parseInt(skip));
    
    // Get user information for each comment
    const commentsWithUsers = await Promise.all(
      comments.map(async (comment) => {
        try {
          const user = await User.findOne({ auth0Id: comment.user_id }).lean();
          return {
            ...comment,
            user: user ? {
              username: user.username || user.nickname || 'unknown',
              display_name: user.displayName || user.name || 'Unknown User',
              avatar_url: user.picture
            } : {
              username: 'unknown',
              display_name: 'Unknown User',
              avatar_url: null
            }
          };
        } catch (error) {
          console.error('Error fetching user for comment:', error);
          return {
            ...comment,
            user: {
              username: 'unknown',
              display_name: 'Unknown User',
              avatar_url: null
            }
          };
        }
      })
    );

    res.json(commentsWithUsers);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
});

// POST /api/videos/:id/comments - Add comment to video
router.post('/:id/comments', authenticateToken, async (req, res) => {
  try {
    const { content, userId } = req.body;

    if (!content || !userId) {
      return res.status(400).json({ error: 'Content and userId are required' });
    }

    // Check if video exists
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }

    // Create comment
    const comment = new Comment({
      content: content.trim(),
      video_id: req.params.id,
      user_id: userId
    });

    await comment.save();

    // Increment comment count on video
    await video.incrementComments();

    // Get user information
    const user = await User.findOne({ auth0Id: userId }).lean();
    const commentWithUser = {
      ...comment.toObject(),
      user: user ? {
        username: user.username || user.nickname || 'unknown',
        display_name: user.displayName || user.name || 'Unknown User',
        avatar_url: user.picture
      } : {
        username: 'unknown',
        display_name: 'Unknown User',
        avatar_url: null
      }
    };

    res.status(201).json(commentWithUser);
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ error: 'Failed to add comment' });
  }
});

// POST /api/videos/:id/view - Increment view count
router.post('/:id/view', async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }

    await video.incrementViews();
    res.json({ views: video.views + 1 });
  } catch (error) {
    console.error('Error incrementing views:', error);
    res.status(500).json({ error: 'Failed to increment views' });
  }
});

module.exports = router;
