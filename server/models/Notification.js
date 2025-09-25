const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  // Recipient of the notification
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  // Sender/creator of the content that triggered the notification
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Type of notification
  type: {
    type: String,
    enum: [
      'live_stream_started',
      'live_stream_ended',
      'new_post',
      'new_content',
      'follow',
      'like',
      'comment',
      'message',
      'subscription',
      'mention',
      'system',
      'reminder'
    ],
    required: true,
    index: true
  },
  // Title of the notification
  title: {
    type: String,
    required: true,
    maxlength: 100
  },
  // Body/message of the notification
  message: {
    type: String,
    required: true,
    maxlength: 500
  },
  // Additional data related to the notification
  data: {
    // For live streams
    streamId: String,
    streamTitle: String,
    streamThumbnail: String,
    
    // For posts/content
    contentId: String,
    contentType: String,
    contentThumbnail: String,
    
    // For messages
    messageId: String,
    conversationId: String,
    
    // For follows/likes/comments
    targetId: String,
    targetType: String,
    
    // Custom data
    customData: mongoose.Schema.Types.Mixed
  },
  // Notification priority (1-5, 5 being highest)
  priority: {
    type: Number,
    min: 1,
    max: 5,
    default: 3
  },
  // Read status
  read: {
    type: Boolean,
    default: false,
    index: true
  },
  // Read timestamp
  readAt: {
    type: Date,
    default: null
  },
  // Delivery status
  deliveryStatus: {
    type: String,
    enum: ['pending', 'sent', 'delivered', 'failed', 'bounced'],
    default: 'pending',
    index: true
  },
  // Delivery channels attempted
  deliveryChannels: [{
    channel: {
      type: String,
      enum: ['push', 'email', 'sms', 'in_app', 'webhook'],
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'sent', 'delivered', 'failed', 'bounced'],
      default: 'pending'
    },
    sentAt: Date,
    deliveredAt: Date,
    error: String
  }],
  // Expiration date (notifications can expire)
  expiresAt: {
    type: Date,
    default: null,
    index: { expireAfterSeconds: 0 }
  },
  // Action URL (where user should be taken when clicking notification)
  actionUrl: {
    type: String,
    maxlength: 500
  },
  // Notification category for grouping
  category: {
    type: String,
    enum: ['social', 'content', 'system', 'marketing', 'reminder'],
    default: 'social',
    index: true
  },
  // Tags for filtering and organization
  tags: [{
    type: String,
    maxlength: 50
  }],
  // User's notification preferences at time of creation
  userPreferences: {
    pushEnabled: { type: Boolean, default: true },
    emailEnabled: { type: Boolean, default: true },
    smsEnabled: { type: Boolean, default: false },
    inAppEnabled: { type: Boolean, default: true }
  }
}, {
  timestamps: true
});

// Indexes for efficient querying
notificationSchema.index({ recipient: 1, read: 1, createdAt: -1 });
notificationSchema.index({ recipient: 1, type: 1, createdAt: -1 });
notificationSchema.index({ sender: 1, type: 1, createdAt: -1 });
notificationSchema.index({ deliveryStatus: 1, createdAt: 1 });
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Virtual for notification age
notificationSchema.virtual('age').get(function() {
  return Date.now() - this.createdAt.getTime();
});

// Method to mark as read
notificationSchema.methods.markAsRead = function() {
  this.read = true;
  this.readAt = new Date();
  return this.save();
};

// Method to mark as delivered
notificationSchema.methods.markAsDelivered = function(channel) {
  if (channel) {
    const deliveryChannel = this.deliveryChannels.find(dc => dc.channel === channel);
    if (deliveryChannel) {
      deliveryChannel.status = 'delivered';
      deliveryChannel.deliveredAt = new Date();
    }
  }
  
  if (this.deliveryChannels.every(dc => dc.status === 'delivered' || dc.status === 'failed')) {
    this.deliveryStatus = 'delivered';
  }
  
  return this.save();
};

// Method to mark as failed
notificationSchema.methods.markAsFailed = function(channel, error) {
  if (channel) {
    const deliveryChannel = this.deliveryChannels.find(dc => dc.channel === channel);
    if (deliveryChannel) {
      deliveryChannel.status = 'failed';
      deliveryChannel.error = error;
    }
  }
  
  this.deliveryStatus = 'failed';
  return this.save();
};

// Static method to get unread count for user
notificationSchema.statics.getUnreadCount = function(userId) {
  return this.countDocuments({
    recipient: userId,
    read: false,
    expiresAt: { $gt: new Date() }
  });
};

// Static method to get notifications for user with pagination
notificationSchema.statics.getUserNotifications = function(userId, options = {}) {
  const {
    page = 1,
    limit = 20,
    type,
    category,
    read,
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = options;

  const query = { recipient: userId };
  
  if (type) query.type = type;
  if (category) query.category = category;
  if (read !== undefined) query.read = read;
  
  // Don't include expired notifications
  query.expiresAt = { $gt: new Date() };

  const sort = {};
  sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

  return this.find(query)
    .populate('sender', 'name handle avatar profile.displayName profile.avatar')
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(limit);
};

// Static method to mark all notifications as read for user
notificationSchema.statics.markAllAsRead = function(userId) {
  return this.updateMany(
    { recipient: userId, read: false },
    { 
      read: true, 
      readAt: new Date() 
    }
  );
};

// Static method to clean up old notifications
notificationSchema.statics.cleanupOldNotifications = function(daysOld = 30) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysOld);
  
  return this.deleteMany({
    read: true,
    createdAt: { $lt: cutoffDate }
  });
};

module.exports = mongoose.model('Notification', notificationSchema);
