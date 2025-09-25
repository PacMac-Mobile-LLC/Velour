const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { authenticateToken } = require('../middleware/auth');
const Vault = require('../models/Vault');

// Configure multer for vault uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../uploads/vault');
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
  // Allow all file types for vault
  cb(null, true);
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit for vault files
    files: 1
  },
  fileFilter: fileFilter
});

// @route   GET /api/vault
// @desc    Get user's vault content
// @access  Private
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 20, type = 'all', search } = req.query;

    let vaultItems;
    
    if (search && search.trim().length > 0) {
      vaultItems = await Vault.searchVault(userId, search.trim(), type);
    } else {
      vaultItems = await Vault.getUserVault(userId, type, parseInt(page), parseInt(limit));
    }

    const total = await Vault.countDocuments({ userId });

    res.json({
      success: true,
      data: vaultItems.map(item => ({
        id: item._id,
        title: item.title,
        description: item.description,
        type: item.type,
        fileUrl: item.fileUrl,
        fileName: item.fileName,
        fileSize: item.fileSize,
        fileSizeFormatted: item.fileSizeFormatted,
        mimeType: item.mimeType,
        thumbnailUrl: item.thumbnailUrl,
        duration: item.duration,
        durationFormatted: item.durationFormatted,
        dimensions: item.dimensions,
        tags: item.tags,
        isPrivate: item.isPrivate,
        isFavorite: item.isFavorite,
        metadata: item.metadata,
        stats: item.stats,
        collections: item.collections,
        createdAt: item.createdAt.toISOString().split('T')[0],
        updatedAt: item.updatedAt.toISOString().split('T')[0]
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

// @route   POST /api/vault/upload
// @desc    Upload file to vault
// @access  Private
router.post('/upload', authenticateToken, upload.single('file'), async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, description, tags, isPrivate = true, metadata } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    if (!title || title.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Title is required'
      });
    }

    // Determine file type
    let fileType = 'other';
    if (req.file.mimetype.startsWith('image/')) {
      fileType = 'image';
    } else if (req.file.mimetype.startsWith('video/')) {
      fileType = 'video';
    } else if (req.file.mimetype.startsWith('audio/')) {
      fileType = 'audio';
    } else if (req.file.mimetype.includes('pdf') || req.file.mimetype.includes('document')) {
      fileType = 'document';
    }

    // Parse tags if provided
    let parsedTags = [];
    if (tags) {
      try {
        parsedTags = typeof tags === 'string' ? JSON.parse(tags) : tags;
      } catch (e) {
        parsedTags = tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
      }
    }

    // Parse metadata if provided
    let parsedMetadata = {};
    if (metadata) {
      try {
        parsedMetadata = typeof metadata === 'string' ? JSON.parse(metadata) : metadata;
      } catch (e) {
        console.warn('Failed to parse metadata:', e);
      }
    }

    const vaultItem = new Vault({
      userId,
      title: title.trim(),
      description: description?.trim() || '',
      type: fileType,
      fileUrl: `/uploads/vault/${req.file.filename}`,
      fileName: req.file.originalname,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
      tags: parsedTags,
      isPrivate: isPrivate === 'true' || isPrivate === true,
      metadata: parsedMetadata
    });

    await vaultItem.save();

    res.status(201).json({
      success: true,
      data: {
        id: vaultItem._id,
        title: vaultItem.title,
        description: vaultItem.description,
        type: vaultItem.type,
        fileUrl: vaultItem.fileUrl,
        fileName: vaultItem.fileName,
        fileSize: vaultItem.fileSize,
        fileSizeFormatted: vaultItem.fileSizeFormatted,
        mimeType: vaultItem.mimeType,
        tags: vaultItem.tags,
        isPrivate: vaultItem.isPrivate,
        isFavorite: vaultItem.isFavorite,
        metadata: vaultItem.metadata,
        createdAt: vaultItem.createdAt.toISOString().split('T')[0]
      }
    });

  } catch (error) {
    console.error('Error uploading to vault:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload file to vault'
    });
  }
});

// @route   GET /api/vault/favorites
// @desc    Get user's favorite vault items
// @access  Private
router.get('/favorites', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 20 } = req.query;

    const favorites = await Vault.getFavorites(userId, parseInt(page), parseInt(limit));

    res.json({
      success: true,
      data: favorites.map(item => ({
        id: item._id,
        title: item.title,
        description: item.description,
        type: item.type,
        fileUrl: item.fileUrl,
        fileName: item.fileName,
        fileSizeFormatted: item.fileSizeFormatted,
        thumbnailUrl: item.thumbnailUrl,
        durationFormatted: item.durationFormatted,
        tags: item.tags,
        stats: item.stats,
        collections: item.collections,
        createdAt: item.createdAt.toISOString().split('T')[0]
      }))
    });

  } catch (error) {
    console.error('Error fetching favorites:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch favorites'
    });
  }
});

// @route   PUT /api/vault/:id/favorite
// @desc    Toggle favorite status of vault item
// @access  Private
router.put('/:id/favorite', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const vaultId = req.params.id;

    const vaultItem = await Vault.findOne({ _id: vaultId, userId });

    if (!vaultItem) {
      return res.status(404).json({
        success: false,
        message: 'Vault item not found'
      });
    }

    await vaultItem.toggleFavorite();

    res.json({
      success: true,
      data: {
        id: vaultItem._id,
        isFavorite: vaultItem.isFavorite
      }
    });

  } catch (error) {
    console.error('Error toggling favorite:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to toggle favorite status'
    });
  }
});

// @route   GET /api/vault/:id
// @desc    Get specific vault item
// @access  Private
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const vaultId = req.params.id;

    const vaultItem = await Vault.findOne({ _id: vaultId, userId })
      .populate('collections', 'name');

    if (!vaultItem) {
      return res.status(404).json({
        success: false,
        message: 'Vault item not found'
      });
    }

    // Increment view count
    await vaultItem.incrementViewCount();

    res.json({
      success: true,
      data: {
        id: vaultItem._id,
        title: vaultItem.title,
        description: vaultItem.description,
        type: vaultItem.type,
        fileUrl: vaultItem.fileUrl,
        fileName: vaultItem.fileName,
        fileSize: vaultItem.fileSize,
        fileSizeFormatted: vaultItem.fileSizeFormatted,
        mimeType: vaultItem.mimeType,
        thumbnailUrl: vaultItem.thumbnailUrl,
        duration: vaultItem.duration,
        durationFormatted: vaultItem.durationFormatted,
        dimensions: vaultItem.dimensions,
        tags: vaultItem.tags,
        isPrivate: vaultItem.isPrivate,
        isFavorite: vaultItem.isFavorite,
        metadata: vaultItem.metadata,
        stats: vaultItem.stats,
        collections: vaultItem.collections,
        createdAt: vaultItem.createdAt.toISOString().split('T')[0],
        updatedAt: vaultItem.updatedAt.toISOString().split('T')[0]
      }
    });

  } catch (error) {
    console.error('Error fetching vault item:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch vault item'
    });
  }
});

// @route   PUT /api/vault/:id
// @desc    Update vault item
// @access  Private
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const vaultId = req.params.id;
    const { title, description, tags, isPrivate, metadata } = req.body;

    const vaultItem = await Vault.findOne({ _id: vaultId, userId });

    if (!vaultItem) {
      return res.status(404).json({
        success: false,
        message: 'Vault item not found'
      });
    }

    // Update fields if provided
    if (title !== undefined) vaultItem.title = title.trim();
    if (description !== undefined) vaultItem.description = description.trim();
    if (isPrivate !== undefined) vaultItem.isPrivate = isPrivate;
    if (tags !== undefined) {
      const parsedTags = typeof tags === 'string' ? JSON.parse(tags) : tags;
      vaultItem.tags = parsedTags.filter(tag => tag.trim().length > 0);
    }
    if (metadata !== undefined) {
      const parsedMetadata = typeof metadata === 'string' ? JSON.parse(metadata) : metadata;
      vaultItem.metadata = { ...vaultItem.metadata, ...parsedMetadata };
    }

    await vaultItem.save();

    res.json({
      success: true,
      data: {
        id: vaultItem._id,
        title: vaultItem.title,
        description: vaultItem.description,
        tags: vaultItem.tags,
        isPrivate: vaultItem.isPrivate,
        metadata: vaultItem.metadata,
        updatedAt: vaultItem.updatedAt.toISOString().split('T')[0]
      }
    });

  } catch (error) {
    console.error('Error updating vault item:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update vault item'
    });
  }
});

// @route   DELETE /api/vault/:id
// @desc    Delete vault item
// @access  Private
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const vaultId = req.params.id;

    const vaultItem = await Vault.findOne({ _id: vaultId, userId });

    if (!vaultItem) {
      return res.status(404).json({
        success: false,
        message: 'Vault item not found'
      });
    }

    // Delete the physical file
    const filePath = path.join(__dirname, '..', vaultItem.fileUrl);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Delete the database record
    await Vault.findByIdAndDelete(vaultId);

    res.json({
      success: true,
      message: 'Vault item deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting vault item:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete vault item'
    });
  }
});

// @route   GET /api/vault/stats/storage
// @desc    Get storage statistics
// @access  Private
router.get('/stats/storage', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const storageStats = await Vault.getStorageStats(userId);

    res.json({
      success: true,
      data: storageStats
    });

  } catch (error) {
    console.error('Error fetching storage stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch storage statistics'
    });
  }
});

module.exports = router;
