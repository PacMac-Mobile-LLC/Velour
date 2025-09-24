const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const Queue = require('../models/Queue');

const router = express.Router();

// Get queue items
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 20, status = 'all' } = req.query;

    let query = { userId: userId };
    if (status !== 'all') {
      query.status = status;
    }

    const queueItems = await Queue.find(query)
      .sort({ scheduledDate: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Queue.countDocuments(query);

    res.json({
      success: true,
      data: queueItems.map(item => ({
        id: item._id,
        title: item.title,
        description: item.description,
        type: item.type,
        status: item.status,
        scheduledDate: item.scheduledDate.toISOString().split('T')[0],
        scheduledTime: item.scheduledTime,
        duration: item.duration,
        isPrivate: item.isPrivate,
        price: item.price,
        expectedViewers: item.expectedViewers,
        actualViewers: item.actualViewers,
        createdAt: item.createdAt.toISOString().split('T')[0]
      })),
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total: total
      }
    });

  } catch (error) {
    console.error('Error fetching queue items:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch queue items'
    });
  }
});

// Create queue item
router.post('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      title,
      description,
      type,
      scheduledDate,
      scheduledTime,
      duration,
      isPrivate,
      price,
      tags
    } = req.body;

    // Validate required fields
    if (!title || !type || !scheduledDate || !scheduledTime) {
      return res.status(400).json({
        success: false,
        message: 'Title, type, scheduled date, and time are required'
      });
    }

    // Validate scheduled date is in the future
    const scheduledDateTime = new Date(`${scheduledDate}T${scheduledTime}`);
    if (scheduledDateTime <= new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Scheduled date and time must be in the future'
      });
    }

    const newQueueItem = new Queue({
      userId: userId,
      title,
      description: description || '',
      type,
      scheduledDate: scheduledDateTime,
      scheduledTime,
      duration: duration || 60,
      isPrivate: isPrivate || false,
      price: price || 0,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : []
    });

    await newQueueItem.save();

    res.json({
      success: true,
      message: 'Queue item created successfully',
      data: {
        id: newQueueItem._id,
        title: newQueueItem.title,
        description: newQueueItem.description,
        type: newQueueItem.type,
        status: newQueueItem.status,
        scheduledDate: newQueueItem.scheduledDate.toISOString().split('T')[0],
        scheduledTime: newQueueItem.scheduledTime,
        duration: newQueueItem.duration,
        isPrivate: newQueueItem.isPrivate,
        price: newQueueItem.price,
        expectedViewers: newQueueItem.expectedViewers,
        createdAt: newQueueItem.createdAt.toISOString().split('T')[0]
      }
    });

  } catch (error) {
    console.error('Error creating queue item:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create queue item'
    });
  }
});

// Update queue item
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const queueId = req.params.id;
    const updateData = req.body;

    // Remove fields that shouldn't be updated directly
    delete updateData.userId;
    delete updateData._id;
    delete updateData.createdAt;

    // If updating scheduled date/time, validate it's in the future
    if (updateData.scheduledDate && updateData.scheduledTime) {
      const scheduledDateTime = new Date(`${updateData.scheduledDate}T${updateData.scheduledTime}`);
      if (scheduledDateTime <= new Date()) {
        return res.status(400).json({
          success: false,
          message: 'Scheduled date and time must be in the future'
        });
      }
      updateData.scheduledDate = scheduledDateTime;
    }

    const queueItem = await Queue.findOneAndUpdate(
      { _id: queueId, userId: userId },
      updateData,
      { new: true }
    );

    if (!queueItem) {
      return res.status(404).json({
        success: false,
        message: 'Queue item not found'
      });
    }

    res.json({
      success: true,
      message: 'Queue item updated successfully',
      data: {
        id: queueItem._id,
        title: queueItem.title,
        description: queueItem.description,
        type: queueItem.type,
        status: queueItem.status,
        scheduledDate: queueItem.scheduledDate.toISOString().split('T')[0],
        scheduledTime: queueItem.scheduledTime,
        duration: queueItem.duration,
        isPrivate: queueItem.isPrivate,
        price: queueItem.price,
        expectedViewers: queueItem.expectedViewers,
        actualViewers: queueItem.actualViewers
      }
    });

  } catch (error) {
    console.error('Error updating queue item:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update queue item'
    });
  }
});

// Delete queue item
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const queueId = req.params.id;

    const queueItem = await Queue.findOneAndDelete({ _id: queueId, userId: userId });

    if (!queueItem) {
      return res.status(404).json({
        success: false,
        message: 'Queue item not found'
      });
    }

    res.json({
      success: true,
      message: 'Queue item deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting queue item:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete queue item'
    });
  }
});

// Start live session
router.post('/:id/start', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const queueId = req.params.id;

    const queueItem = await Queue.findOneAndUpdate(
      { _id: queueId, userId: userId, status: 'scheduled' },
      { 
        status: 'live',
        startedAt: new Date()
      },
      { new: true }
    );

    if (!queueItem) {
      return res.status(404).json({
        success: false,
        message: 'Queue item not found or not scheduled'
      });
    }

    res.json({
      success: true,
      message: 'Live session started successfully',
      data: {
        id: queueItem._id,
        status: queueItem.status,
        startedAt: queueItem.startedAt
      }
    });

  } catch (error) {
    console.error('Error starting live session:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to start live session'
    });
  }
});

// Complete live session
router.post('/:id/complete', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const queueId = req.params.id;
    const { actualViewers } = req.body;

    const queueItem = await Queue.findOneAndUpdate(
      { _id: queueId, userId: userId, status: 'live' },
      { 
        status: 'completed',
        completedAt: new Date(),
        actualViewers: actualViewers || 0
      },
      { new: true }
    );

    if (!queueItem) {
      return res.status(404).json({
        success: false,
        message: 'Queue item not found or not live'
      });
    }

    res.json({
      success: true,
      message: 'Live session completed successfully',
      data: {
        id: queueItem._id,
        status: queueItem.status,
        completedAt: queueItem.completedAt,
        actualViewers: queueItem.actualViewers
      }
    });

  } catch (error) {
    console.error('Error completing live session:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to complete live session'
    });
  }
});

module.exports = router;
