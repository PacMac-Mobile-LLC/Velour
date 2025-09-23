const express = require('express');
const router = express.Router();
const multer = require('multer');
const { body, validationResult } = require('express-validator');
const { authenticateToken, requireCreator, requireSubscription, optionalAuth } = require('../middleware/auth');
const Content = require('../models/Content');
const User = require('../models/User');

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow video, image, and audio files
    const allowedTypes = /jpeg|jpg|png|gif|mp4|mov|avi|mkv|webm|mp3|wav|m4a/;
    const extname = allowedTypes.test(file.originalname.toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only video, image, and audio files are allowed'));
    }
  }
});

// Upload content
router.post('/upload', authenticateToken, requireCreator, upload.single('media'), [
  body('title')
    .isLength({ min: 1, max: 100 })
    .withMessage('Title is required and must be less than 100 characters'),
  body('description')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Description must be less than 1000 characters'),
  body('type')
    .isIn(['video', 'image', 'text'])
    .withMessage('Type must be video, image, or text'),
  body('access.type')
    .isIn(['free', 'subscription', 'pay_per_view'])
    .withMessage('Access type must be free, subscription, or pay_per_view'),
  body('access.price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array')
], async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const creator = req.user;
    const { title, description, type, access, tags, category } = req.body;

    // For now, we'll simulate file upload to a cloud service
    // In production, you'd upload to AWS S3, Cloudinary, etc.
    let mediaData = null;
    if (req.file) {
      mediaData = {
        url: `https://example-cdn.com/uploads/${Date.now()}-${req.file.originalname}`,
        thumbnail: type === 'video' ? `https://example-cdn.com/thumbnails/${Date.now()}-thumb.jpg` : null,
        size: req.file.size,
        format: req.file.mimetype.split('/')[1]
      };
    }

    // Create content
    const content = new Content({
      creator: creator._id,
      title,
      description,
      type,
      media: mediaData,
      access: {
        type: access.type,
        price: access.price || 0,
        tier: access.tier || 'basic'
      },
      tags: tags || [],
      category: category || 'entertainment',
      isPublished: true
    });

    await content.save();

    res.status(201).json({
      success: true,
      message: 'Content uploaded successfully',
      content: content.getPublicData()
    });
  } catch (error) {
    console.error('Upload content error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload content'
    });
  }
});

// Get creator's content
router.get('/creator/:creatorId', optionalAuth, async (req, res) => {
  try {
    const { creatorId } = req.params;
    const { page = 1, limit = 20, type, category } = req.query;
    const user = req.user;

    // Build query
    const query = {
      creator: creatorId,
      isPublished: true,
      isDeleted: false
    };

    if (type) query.type = type;
    if (category) query.category = category;

    // Get content
    const content = await Content.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('creator', 'username profile');

    // Check if user has subscription access
    const hasAccess = user && user.role === 'subscriber' && 
      await checkSubscriptionAccess(user._id, creatorId);

    const contentData = content.map(item => {
      const publicData = item.getPublicData();
      
      // Hide media URL if user doesn't have access
      if (!hasAccess && item.access.type !== 'free') {
        publicData.media.url = null;
      }
      
      return publicData;
    });

    res.json({
      success: true,
      content: contentData,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: await Content.countDocuments(query)
      }
    });
  } catch (error) {
    console.error('Get creator content error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get content'
    });
  }
});

// Get specific content
router.get('/:contentId', optionalAuth, async (req, res) => {
  try {
    const { contentId } = req.params;
    const user = req.user;

    const content = await Content.findById(contentId)
      .populate('creator', 'username profile creatorSettings');

    if (!content || content.isDeleted) {
      return res.status(404).json({
        success: false,
        message: 'Content not found'
      });
    }

    // Check access
    const hasAccess = await checkContentAccess(user, content);
    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'Subscription or payment required to access this content'
      });
    }

    // Increment view count
    content.stats.views += 1;
    await content.save();

    res.json({
      success: true,
      content: content.getPublicData()
    });
  } catch (error) {
    console.error('Get content error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get content'
    });
  }
});

// Get user's own content (for creators)
router.get('/my-content', authenticateToken, requireCreator, async (req, res) => {
  try {
    const creator = req.user;
    const { page = 1, limit = 20, status } = req.query;

    const query = {
      creator: creator._id,
      isDeleted: false
    };

    if (status === 'published') query.isPublished = true;
    if (status === 'draft') query.isPublished = false;

    const content = await Content.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    res.json({
      success: true,
      content: content.map(item => item.getPublicData()),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: await Content.countDocuments(query)
      }
    });
  } catch (error) {
    console.error('Get my content error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get content'
    });
  }
});

// Update content
router.put('/:contentId', authenticateToken, requireCreator, [
  body('title')
    .optional()
    .isLength({ min: 1, max: 100 })
    .withMessage('Title must be between 1 and 100 characters'),
  body('description')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Description must be less than 1000 characters'),
  body('access.type')
    .optional()
    .isIn(['free', 'subscription', 'pay_per_view'])
    .withMessage('Access type must be free, subscription, or pay_per_view'),
  body('access.price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number')
], async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { contentId } = req.params;
    const creator = req.user;
    const updates = req.body;

    const content = await Content.findOne({
      _id: contentId,
      creator: creator._id
    });

    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Content not found'
      });
    }

    // Update fields
    Object.keys(updates).forEach(key => {
      if (key === 'access' && typeof updates[key] === 'object') {
        content.access = { ...content.access, ...updates[key] };
      } else if (updates[key] !== undefined) {
        content[key] = updates[key];
      }
    });

    await content.save();

    res.json({
      success: true,
      message: 'Content updated successfully',
      content: content.getPublicData()
    });
  } catch (error) {
    console.error('Update content error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update content'
    });
  }
});

// Delete content
router.delete('/:contentId', authenticateToken, requireCreator, async (req, res) => {
  try {
    const { contentId } = req.params;
    const creator = req.user;

    const content = await Content.findOne({
      _id: contentId,
      creator: creator._id
    });

    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Content not found'
      });
    }

    // Soft delete
    content.isDeleted = true;
    await content.save();

    res.json({
      success: true,
      message: 'Content deleted successfully'
    });
  } catch (error) {
    console.error('Delete content error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete content'
    });
  }
});

// Like content
router.post('/:contentId/like', authenticateToken, async (req, res) => {
  try {
    const { contentId } = req.params;
    const user = req.user;

    const content = await Content.findById(contentId);
    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Content not found'
      });
    }

    // Check if user has access
    const hasAccess = await checkContentAccess(user, content);
    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'Access required to like content'
      });
    }

    // For simplicity, we'll just increment the like count
    // In production, you'd track individual likes to prevent duplicate likes
    content.stats.likes += 1;
    await content.save();

    res.json({
      success: true,
      message: 'Content liked successfully',
      stats: content.stats
    });
  } catch (error) {
    console.error('Like content error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to like content'
    });
  }
});

// Helper function to check subscription access
async function checkSubscriptionAccess(userId, creatorId) {
  const Subscription = require('../models/Subscription');
  const subscription = await Subscription.findOne({
    subscriber: userId,
    creator: creatorId,
    status: 'active',
    isActive: true
  });
  
  return subscription && subscription.isValid;
}

// Helper function to check content access
async function checkContentAccess(user, content) {
  if (!user) return content.access.type === 'free';
  if (content.access.type === 'free') return true;
  if (content.access.type === 'subscription') {
    return await checkSubscriptionAccess(user._id, content.creator);
  }
  if (content.access.type === 'pay_per_view') {
    // Check if user has paid for this specific content
    // This would require a separate Payment model to track individual purchases
    return false; // Simplified for now
  }
  return false;
}

module.exports = router;
