const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Comment = require('../models/Comment');
const Post = require('../models/Post');
const { authenticateToken } = require('../middleware/auth');

// Configure multer for comment media uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../uploads/comments');
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
    fileSize: 10 * 1024 * 1024, // 10MB limit for comments
    files: 3 // Maximum 3 files per comment
  },
  fileFilter: fileFilter
});

// @route   POST /api/comments
// @desc    Create a new comment
// @access  Private
router.post('/', authenticateToken, upload.array('media', 3), async (req, res) => {
  try {
    const {
      postId,
      text,
      parentCommentId
    } = req.body;

    // Validate required fields
    if (!postId || !text) {
      return res.status(400).json({
        success: false,
        message: 'Post ID and text are required'
      });
    }

    // Check if post exists and allows comments
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    if (!post.privacy.allowComments) {
      return res.status(403).json({
        success: false,
        message: 'Comments are not allowed on this post'
      });
    }

    // Process uploaded media files
    const mediaFiles = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const mediaItem = {
          type: file.mimetype.startsWith('image/') ? 'image' : 
                file.mimetype.startsWith('video/') ? 'video' : 'audio',
          url: `/uploads/comments/${file.filename}`,
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

        mediaFiles.push(mediaItem);
      }
    }

    // Create comment object
    const commentData = {
      author: req.user.id,
      post: postId,
      content: {
        text,
        media: mediaFiles
      },
      parentComment: parentCommentId || undefined
    };

    const comment = new Comment(commentData);
    await comment.save();

    // Add comment to post
    post.engagement.comments.push(comment._id);
    await post.save();

    // If this is a reply, add it to parent comment
    if (parentCommentId) {
      const parentComment = await Comment.findById(parentCommentId);
      if (parentComment) {
        parentComment.engagement.replies.push(comment._id);
        await parentComment.save();
      }
    }

    // Populate author information
    await comment.populate('author', 'name handle avatar verified');

    res.status(201).json({
      success: true,
      message: 'Comment created successfully',
      data: comment
    });

  } catch (error) {
    console.error('Error creating comment:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating comment',
      error: error.message
    });
  }
});

// @route   GET /api/comments/post/:postId
// @desc    Get comments for a post
// @access  Private
router.get('/post/:postId', authenticateToken, async (req, res) => {
  try {
    const { postId } = req.params;
    const { page = 1, limit = 20, includeReplies = true } = req.query;

    const skip = (page - 1) * limit;

    const comments = await Comment.findByPost(postId, {
      limit: parseInt(limit),
      skip,
      includeReplies: includeReplies === 'true'
    });

    // Add user engagement status to each comment
    const commentsWithEngagement = comments.map(comment => {
      const commentObj = comment.toObject();
      commentObj.userEngagement = {
        isLiked: comment.isLikedBy(req.user.id),
        userReaction: comment.getUserReaction(req.user.id)
      };
      return commentObj;
    });

    res.json({
      success: true,
      data: commentsWithEngagement,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: comments.length
      }
    });

  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching comments',
      error: error.message
    });
  }
});

// @route   GET /api/comments/:id
// @desc    Get a specific comment
// @access  Private
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id)
      .populate('author', 'name handle avatar verified')
      .populate('post', 'content.text type')
      .populate('replies');

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    const commentObj = comment.toObject();
    commentObj.userEngagement = {
      isLiked: comment.isLikedBy(req.user.id),
      userReaction: comment.getUserReaction(req.user.id)
    };

    res.json({
      success: true,
      data: commentObj
    });

  } catch (error) {
    console.error('Error fetching comment:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching comment',
      error: error.message
    });
  }
});

// @route   PUT /api/comments/:id
// @desc    Update a comment
// @access  Private
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { text } = req.body;
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    // Check if user is the author
    if (!comment.author.equals(req.user.id)) {
      return res.status(403).json({
        success: false,
        message: 'You can only edit your own comments'
      });
    }

    // Update comment text
    if (text !== undefined) {
      comment.content.text = text;
    }

    await comment.save();

    res.json({
      success: true,
      message: 'Comment updated successfully',
      data: comment
    });

  } catch (error) {
    console.error('Error updating comment:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating comment',
      error: error.message
    });
  }
});

// @route   DELETE /api/comments/:id
// @desc    Delete a comment
// @access  Private
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    // Check if user is the author
    if (!comment.author.equals(req.user.id)) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own comments'
      });
    }

    // Delete associated media files
    if (comment.content.media && comment.content.media.length > 0) {
      for (const media of comment.content.media) {
        const filePath = path.join(__dirname, '..', media.url);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
    }

    // Remove comment from post
    const post = await Post.findById(comment.post);
    if (post) {
      post.engagement.comments = post.engagement.comments.filter(
        commentId => !commentId.equals(comment._id)
      );
      await post.save();
    }

    // Remove from parent comment if it's a reply
    if (comment.parentComment) {
      const parentComment = await Comment.findById(comment.parentComment);
      if (parentComment) {
        parentComment.engagement.replies = parentComment.engagement.replies.filter(
          replyId => !replyId.equals(comment._id)
        );
        await parentComment.save();
      }
    }

    // Delete the comment
    await Comment.findByIdAndDelete(comment._id);

    res.json({
      success: true,
      message: 'Comment deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting comment',
      error: error.message
    });
  }
});

// @route   POST /api/comments/:id/like
// @desc    Like/unlike a comment
// @access  Private
router.post('/:id/like', authenticateToken, async (req, res) => {
  try {
    const { reaction = 'like' } = req.body;
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    const isLiked = comment.isLikedBy(req.user.id);

    if (isLiked) {
      await comment.removeLike(req.user.id);
    } else {
      await comment.addLike(req.user.id, reaction);
    }

    res.json({
      success: true,
      message: isLiked ? 'Comment unliked' : 'Comment liked',
      data: {
        isLiked: !isLiked,
        reaction: !isLiked ? reaction : null,
        likeCount: comment.engagement.likes.length
      }
    });

  } catch (error) {
    console.error('Error liking comment:', error);
    res.status(500).json({
      success: false,
      message: 'Error liking comment',
      error: error.message
    });
  }
});

// @route   GET /api/comments/user/:userId
// @desc    Get comments by a specific user
// @access  Private
router.get('/user/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const skip = (page - 1) * limit;

    const comments = await Comment.findByAuthor(userId, {
      limit: parseInt(limit),
      skip
    });

    // Add user engagement status to each comment
    const commentsWithEngagement = comments.map(comment => {
      const commentObj = comment.toObject();
      commentObj.userEngagement = {
        isLiked: comment.isLikedBy(req.user.id),
        userReaction: comment.getUserReaction(req.user.id)
      };
      return commentObj;
    });

    res.json({
      success: true,
      data: commentsWithEngagement,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: comments.length
      }
    });

  } catch (error) {
    console.error('Error fetching user comments:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user comments',
      error: error.message
    });
  }
});

module.exports = router;
