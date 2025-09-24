const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { authenticateToken } = require('../middleware/auth');
const Content = require('../models/Content');
const User = require('../models/User');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  // Allow images, videos, and documents
  const allowedTypes = /jpeg|jpg|png|gif|mp4|mov|avi|pdf|doc|docx|txt/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only images, videos, and documents are allowed.'));
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB limit
  },
  fileFilter: fileFilter
});

// Upload content to vault
router.post('/vault', authenticateToken, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const { title, description, isPrivate, tags } = req.body;
    const userId = req.user.id;

    // Determine file type
    const fileExtension = path.extname(req.file.originalname).toLowerCase();
    let contentType = 'document';
    if (['.jpg', '.jpeg', '.png', '.gif'].includes(fileExtension)) {
      contentType = 'image';
    } else if (['.mp4', '.mov', '.avi'].includes(fileExtension)) {
      contentType = 'video';
    }

    const newContent = new Content({
      userId: userId,
      title: title || req.file.originalname,
      description: description || '',
      filename: req.file.filename,
      originalName: req.file.originalname,
      filePath: req.file.path,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
      contentType: contentType,
      isPrivate: isPrivate === 'true',
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      uploadedAt: new Date()
    });

    await newContent.save();

    res.json({
      success: true,
      message: 'File uploaded successfully',
      data: {
        id: newContent._id,
        title: newContent.title,
        description: newContent.description,
        type: newContent.contentType,
        size: newContent.fileSize,
        isPrivate: newContent.isPrivate,
        uploadedAt: newContent.uploadedAt
      }
    });

  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload file'
    });
  }
});

// Upload profile avatar
router.post('/avatar', authenticateToken, upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No avatar uploaded'
      });
    }

    const userId = req.user.id;

    // Check if file is an image
    const fileExtension = path.extname(req.file.originalname).toLowerCase();
    if (!['.jpg', '.jpeg', '.png', '.gif'].includes(fileExtension)) {
      return res.status(400).json({
        success: false,
        message: 'Avatar must be an image file'
      });
    }

    // Update user avatar
    const user = await User.findByIdAndUpdate(
      userId,
      { 
        avatar: req.file.filename,
        avatarPath: req.file.path
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'Avatar uploaded successfully',
      data: {
        avatar: user.avatar,
        avatarPath: user.avatarPath
      }
    });

  } catch (error) {
    console.error('Error uploading avatar:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload avatar'
    });
  }
});

// Get uploaded files
router.get('/vault', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 20, type = 'all' } = req.query;

    let query = { userId: userId };
    if (type !== 'all') {
      query.contentType = type;
    }

    const content = await Content.find(query)
      .sort({ uploadedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Content.countDocuments(query);

    res.json({
      success: true,
      data: content.map(item => ({
        id: item._id,
        title: item.title,
        description: item.description,
        type: item.contentType,
        size: item.fileSize,
        isPrivate: item.isPrivate,
        uploadedAt: item.uploadedAt,
        views: item.views || 0,
        likes: item.likes || 0,
        comments: item.comments || 0
      })),
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total: total
      }
    });

  } catch (error) {
    console.error('Error fetching vault content:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch vault content'
    });
  }
});

// Delete uploaded file
router.delete('/vault/:id', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const contentId = req.params.id;

    const content = await Content.findOne({ _id: contentId, userId: userId });
    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Content not found'
      });
    }

    // Delete file from filesystem
    if (fs.existsSync(content.filePath)) {
      fs.unlinkSync(content.filePath);
    }

    // Delete from database
    await Content.findByIdAndDelete(contentId);

    res.json({
      success: true,
      message: 'Content deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting content:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete content'
    });
  }
});

module.exports = router;
