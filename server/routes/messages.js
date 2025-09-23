const express = require('express');
const router = express.Router();
const multer = require('multer');
const { body, validationResult } = require('express-validator');
const { authenticateToken, requireSubscription } = require('../middleware/auth');
const Message = require('../models/Message');
const User = require('../models/User');
const Subscription = require('../models/Subscription');

// Configure multer for message media uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit for messages
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|mp4|mov|avi|mkv|webm|mp3|wav|m4a/;
    const extname = allowedTypes.test(file.originalname.toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image, video, and audio files are allowed'));
    }
  }
});

// Send message
router.post('/send', authenticateToken, upload.single('media'), [
  body('recipientId')
    .isMongoId()
    .withMessage('Valid recipient ID is required'),
  body('content.text')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Message text must be less than 1000 characters'),
  body('content.type')
    .isIn(['text', 'image', 'video', 'audio'])
    .withMessage('Content type must be text, image, video, or audio')
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

    const sender = req.user;
    const { recipientId, content, replyTo } = req.body;

    // Check if recipient exists
    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({
        success: false,
        message: 'Recipient not found'
      });
    }

    // Check if users can message each other
    const canMessage = await checkMessagingPermission(sender, recipient);
    if (!canMessage) {
      return res.status(403).json({
        success: false,
        message: 'You cannot message this user'
      });
    }

    // Prepare message content
    let messageContent = {
      type: content.type,
      text: content.text
    };

    // Handle media upload
    if (req.file && content.type !== 'text') {
      messageContent.media = {
        url: `https://example-cdn.com/messages/${Date.now()}-${req.file.originalname}`,
        thumbnail: content.type === 'video' ? `https://example-cdn.com/thumbnails/${Date.now()}-thumb.jpg` : null,
        size: req.file.size
      };
    }

    // Create message
    const message = new Message({
      sender: sender._id,
      recipient: recipientId,
      content: messageContent,
      replyTo: replyTo || null
    });

    await message.save();

    // Populate sender info for response
    await message.populate('sender', 'username profile');

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: message.getMessageData()
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message'
    });
  }
});

// Get conversation with a specific user
router.get('/conversation/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUser = req.user;
    const { page = 1, limit = 50 } = req.query;

    // Check if users can message each other
    const otherUser = await User.findById(userId);
    if (!otherUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const canMessage = await checkMessagingPermission(currentUser, otherUser);
    if (!canMessage) {
      return res.status(403).json({
        success: false,
        message: 'You cannot access this conversation'
      });
    }

    // Get messages between users
    const messages = await Message.find({
      $or: [
        { sender: currentUser._id, recipient: userId },
        { sender: userId, recipient: currentUser._id }
      ],
      isDeleted: false
    })
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .populate('sender', 'username profile')
    .populate('recipient', 'username profile')
    .populate('replyTo');

    // Mark messages as read
    await Message.updateMany(
      {
        sender: userId,
        recipient: currentUser._id,
        isRead: false
      },
      {
        isRead: true,
        readAt: new Date()
      }
    );

    res.json({
      success: true,
      messages: messages.map(msg => msg.getMessageData()),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: await Message.countDocuments({
          $or: [
            { sender: currentUser._id, recipient: userId },
            { sender: userId, recipient: currentUser._id }
          ],
          isDeleted: false
        })
      }
    });
  } catch (error) {
    console.error('Get conversation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get conversation'
    });
  }
});

// Get all conversations for current user
router.get('/conversations', authenticateToken, async (req, res) => {
  try {
    const currentUser = req.user;

    // Get unique conversation partners
    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [
            { sender: currentUser._id },
            { recipient: currentUser._id }
          ],
          isDeleted: false
        }
      },
      {
        $addFields: {
          otherUser: {
            $cond: {
              if: { $eq: ['$sender', currentUser._id] },
              then: '$recipient',
              else: '$sender'
            }
          }
        }
      },
      {
        $group: {
          _id: '$otherUser',
          lastMessage: { $last: '$$ROOT' },
          unreadCount: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ['$recipient', currentUser._id] },
                    { $eq: ['$isRead', false] }
                  ]
                },
                1,
                0
              ]
            }
          }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $unwind: '$user'
      },
      {
        $lookup: {
          from: 'users',
          localField: 'lastMessage.sender',
          foreignField: '_id',
          as: 'lastMessageSender'
        }
      },
      {
        $unwind: '$lastMessageSender'
      },
      {
        $sort: { 'lastMessage.createdAt': -1 }
      },
      {
        $project: {
          user: {
            _id: '$user._id',
            username: '$user.username',
            profile: '$user.profile'
          },
          lastMessage: {
            _id: '$lastMessage._id',
            content: '$lastMessage.content',
            createdAt: '$lastMessage.createdAt',
            isRead: '$lastMessage.isRead',
            sender: {
              _id: '$lastMessageSender._id',
              username: '$lastMessageSender.username',
              profile: '$lastMessageSender.profile'
            }
          },
          unreadCount: 1
        }
      }
    ]);

    res.json({
      success: true,
      conversations
    });
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get conversations'
    });
  }
});

// Mark messages as read
router.put('/mark-read/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUser = req.user;

    await Message.updateMany(
      {
        sender: userId,
        recipient: currentUser._id,
        isRead: false
      },
      {
        isRead: true,
        readAt: new Date()
      }
    );

    res.json({
      success: true,
      message: 'Messages marked as read'
    });
  } catch (error) {
    console.error('Mark messages as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark messages as read'
    });
  }
});

// Delete message
router.delete('/:messageId', authenticateToken, async (req, res) => {
  try {
    const { messageId } = req.params;
    const currentUser = req.user;

    const message = await Message.findOne({
      _id: messageId,
      $or: [
        { sender: currentUser._id },
        { recipient: currentUser._id }
      ]
    });

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    // Soft delete
    message.isDeleted = true;
    message.deletedAt = new Date();
    await message.save();

    res.json({
      success: true,
      message: 'Message deleted successfully'
    });
  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete message'
    });
  }
});

// Get unread message count
router.get('/unread/count', authenticateToken, async (req, res) => {
  try {
    const currentUser = req.user;

    const unreadCount = await Message.countDocuments({
      recipient: currentUser._id,
      isRead: false,
      isDeleted: false
    });

    res.json({
      success: true,
      unreadCount
    });
  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get unread count'
    });
  }
});

// React to message
router.post('/:messageId/react', authenticateToken, [
  body('emoji')
    .isLength({ min: 1, max: 10 })
    .withMessage('Emoji is required and must be less than 10 characters')
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

    const { messageId } = req.params;
    const { emoji } = req.body;
    const currentUser = req.user;

    const message = await Message.findOne({
      _id: messageId,
      $or: [
        { sender: currentUser._id },
        { recipient: currentUser._id }
      ],
      isDeleted: false
    });

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    // Remove existing reaction from this user
    message.reactions = message.reactions.filter(
      reaction => !reaction.user.equals(currentUser._id)
    );

    // Add new reaction
    message.reactions.push({
      user: currentUser._id,
      emoji
    });

    await message.save();

    res.json({
      success: true,
      message: 'Reaction added successfully',
      reactions: message.reactions
    });
  } catch (error) {
    console.error('React to message error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add reaction'
    });
  }
});

// Helper function to check messaging permissions
async function checkMessagingPermission(sender, recipient) {
  // Users can always message themselves (for testing)
  if (sender._id.equals(recipient._id)) {
    return true;
  }

  // Check if recipient allows messages
  if (!recipient.preferences.privacy.allowMessages) {
    return false;
  }

  // If sender is a subscriber and recipient is a creator, check subscription
  if (sender.role === 'subscriber' && recipient.role === 'creator') {
    const subscription = await Subscription.findOne({
      subscriber: sender._id,
      creator: recipient._id,
      status: 'active',
      isActive: true
    });
    
    return subscription && subscription.isValid;
  }

  // If sender is a creator and recipient is a subscriber, check if recipient is subscribed
  if (sender.role === 'creator' && recipient.role === 'subscriber') {
    const subscription = await Subscription.findOne({
      subscriber: recipient._id,
      creator: sender._id,
      status: 'active',
      isActive: true
    });
    
    return subscription && subscription.isValid;
  }

  // Default: no messaging between unsubscribed users
  return false;
}

module.exports = router;
