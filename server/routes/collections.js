const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const Collection = require('../models/Collection');
const User = require('../models/User');

// @route   GET /api/collections
// @desc    Get user's collections
// @access  Private
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 20, type = 'all' } = req.query;

    let query = { userId };
    if (type === 'private') {
      query.isPrivate = true;
    } else if (type === 'public') {
      query.isPrivate = false;
    }

    const collections = await Collection.find(query)
      .populate('creators.userId', 'name handle avatar isOnline')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Collection.countDocuments(query);

    res.json({
      success: true,
      data: collections.map(collection => ({
        id: collection._id,
        name: collection.name,
        description: collection.description,
        isPrivate: collection.isPrivate,
        creatorCount: collection.creators.length,
        creators: collection.creators.map(creator => ({
          id: creator.userId._id,
          name: creator.userId.name,
          handle: creator.userId.handle,
          avatar: creator.userId.avatar,
          isOnline: creator.userId.isOnline,
          addedAt: creator.addedAt
        })),
        stats: collection.stats,
        tags: collection.tags,
        createdAt: collection.createdAt.toISOString().split('T')[0],
        updatedAt: collection.updatedAt.toISOString().split('T')[0]
      })),
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total: total
      }
    });

  } catch (error) {
    console.error('Error fetching collections:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch collections'
    });
  }
});

// @route   POST /api/collections
// @desc    Create a new collection
// @access  Private
router.post('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, description, isPrivate = false, tags = [] } = req.body;

    if (!name || name.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Collection name is required'
      });
    }

    // Check if collection with same name already exists for user
    const existingCollection = await Collection.findOne({ 
      userId, 
      name: { $regex: new RegExp(`^${name}$`, 'i') } 
    });

    if (existingCollection) {
      return res.status(400).json({
        success: false,
        message: 'A collection with this name already exists'
      });
    }

    const collection = new Collection({
      name: name.trim(),
      description: description?.trim() || '',
      userId,
      isPrivate,
      tags: tags.filter(tag => tag.trim().length > 0)
    });

    await collection.save();

    res.status(201).json({
      success: true,
      data: {
        id: collection._id,
        name: collection.name,
        description: collection.description,
        isPrivate: collection.isPrivate,
        creatorCount: 0,
        creators: [],
        stats: collection.stats,
        tags: collection.tags,
        createdAt: collection.createdAt.toISOString().split('T')[0]
      }
    });

  } catch (error) {
    console.error('Error creating collection:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create collection'
    });
  }
});

// @route   GET /api/collections/:id
// @desc    Get a specific collection
// @access  Private
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const collectionId = req.params.id;

    const collection = await Collection.findOne({ 
      _id: collectionId, 
      userId 
    }).populate('creators.userId', 'name handle avatar bio isOnline');

    if (!collection) {
      return res.status(404).json({
        success: false,
        message: 'Collection not found'
      });
    }

    res.json({
      success: true,
      data: {
        id: collection._id,
        name: collection.name,
        description: collection.description,
        isPrivate: collection.isPrivate,
        creatorCount: collection.creators.length,
        creators: collection.creators.map(creator => ({
          id: creator.userId._id,
          name: creator.userId.name,
          handle: creator.userId.handle,
          avatar: creator.userId.avatar,
          bio: creator.userId.bio,
          isOnline: creator.userId.isOnline,
          addedAt: creator.addedAt
        })),
        stats: collection.stats,
        tags: collection.tags,
        settings: collection.settings,
        createdAt: collection.createdAt.toISOString().split('T')[0],
        updatedAt: collection.updatedAt.toISOString().split('T')[0]
      }
    });

  } catch (error) {
    console.error('Error fetching collection:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch collection'
    });
  }
});

// @route   PUT /api/collections/:id
// @desc    Update a collection
// @access  Private
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const collectionId = req.params.id;
    const { name, description, isPrivate, tags, settings } = req.body;

    const collection = await Collection.findOne({ 
      _id: collectionId, 
      userId 
    });

    if (!collection) {
      return res.status(404).json({
        success: false,
        message: 'Collection not found'
      });
    }

    // Update fields if provided
    if (name !== undefined) collection.name = name.trim();
    if (description !== undefined) collection.description = description.trim();
    if (isPrivate !== undefined) collection.isPrivate = isPrivate;
    if (tags !== undefined) collection.tags = tags.filter(tag => tag.trim().length > 0);
    if (settings !== undefined) collection.settings = { ...collection.settings, ...settings };

    await collection.save();

    res.json({
      success: true,
      data: {
        id: collection._id,
        name: collection.name,
        description: collection.description,
        isPrivate: collection.isPrivate,
        tags: collection.tags,
        settings: collection.settings,
        updatedAt: collection.updatedAt.toISOString().split('T')[0]
      }
    });

  } catch (error) {
    console.error('Error updating collection:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update collection'
    });
  }
});

// @route   DELETE /api/collections/:id
// @desc    Delete a collection
// @access  Private
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const collectionId = req.params.id;

    const collection = await Collection.findOneAndDelete({ 
      _id: collectionId, 
      userId 
    });

    if (!collection) {
      return res.status(404).json({
        success: false,
        message: 'Collection not found'
      });
    }

    res.json({
      success: true,
      message: 'Collection deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting collection:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete collection'
    });
  }
});

// @route   POST /api/collections/:id/creators
// @desc    Add creator to collection
// @access  Private
router.post('/:id/creators', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const collectionId = req.params.id;
    const { creatorId } = req.body;

    if (!creatorId) {
      return res.status(400).json({
        success: false,
        message: 'Creator ID is required'
      });
    }

    const collection = await Collection.findOne({ 
      _id: collectionId, 
      userId 
    });

    if (!collection) {
      return res.status(404).json({
        success: false,
        message: 'Collection not found'
      });
    }

    // Check if creator exists
    const creator = await User.findById(creatorId);
    if (!creator) {
      return res.status(404).json({
        success: false,
        message: 'Creator not found'
      });
    }

    // Add creator to collection
    await collection.addCreator(creatorId);

    // Populate the updated collection
    await collection.populate('creators.userId', 'name handle avatar isOnline');

    res.json({
      success: true,
      data: {
        id: collection._id,
        creatorCount: collection.creators.length,
        creators: collection.creators.map(creator => ({
          id: creator.userId._id,
          name: creator.userId.name,
          handle: creator.userId.handle,
          avatar: creator.userId.avatar,
          isOnline: creator.userId.isOnline,
          addedAt: creator.addedAt
        }))
      }
    });

  } catch (error) {
    console.error('Error adding creator to collection:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add creator to collection'
    });
  }
});

// @route   DELETE /api/collections/:id/creators/:creatorId
// @desc    Remove creator from collection
// @access  Private
router.delete('/:id/creators/:creatorId', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const collectionId = req.params.id;
    const creatorId = req.params.creatorId;

    const collection = await Collection.findOne({ 
      _id: collectionId, 
      userId 
    });

    if (!collection) {
      return res.status(404).json({
        success: false,
        message: 'Collection not found'
      });
    }

    // Remove creator from collection
    await collection.removeCreator(creatorId);

    res.json({
      success: true,
      data: {
        id: collection._id,
        creatorCount: collection.creators.length
      }
    });

  } catch (error) {
    console.error('Error removing creator from collection:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove creator from collection'
    });
  }
});

// @route   GET /api/collections/search
// @desc    Search collections
// @access  Private
router.get('/search', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { q, page = 1, limit = 20 } = req.query;

    if (!q || q.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const collections = await Collection.searchCollections(q.trim(), userId)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    res.json({
      success: true,
      data: collections.map(collection => ({
        id: collection._id,
        name: collection.name,
        description: collection.description,
        isPrivate: collection.isPrivate,
        creatorCount: collection.creators.length,
        stats: collection.stats,
        tags: collection.tags,
        createdAt: collection.createdAt.toISOString().split('T')[0]
      }))
    });

  } catch (error) {
    console.error('Error searching collections:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search collections'
    });
  }
});

module.exports = router;
