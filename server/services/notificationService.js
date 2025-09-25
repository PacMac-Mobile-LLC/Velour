const Notification = require('../models/Notification');
const NotificationPreferences = require('../models/NotificationPreferences');
const User = require('../models/User');
const { sendEmail } = require('./emailService');
const { sendPushNotification } = require('./pushNotificationService');

class NotificationService {
  /**
   * Create and send a notification
   * @param {Object} notificationData - Notification data
   * @returns {Object} Created notification
   */
  static async createNotification(notificationData) {
    try {
      const {
        recipientId,
        senderId,
        type,
        title,
        message,
        data = {},
        priority = 3,
        category = 'social',
        tags = [],
        actionUrl = null,
        expiresAt = null
      } = notificationData;

      // Validate required fields
      if (!recipientId || !senderId || !type || !title || !message) {
        throw new Error('Missing required notification fields');
      }

      // Get user preferences
      const preferences = await NotificationPreferences.getOrCreate(recipientId);
      
      // Check if notification type is enabled
      if (!preferences.isNotificationEnabled(type)) {
        console.log(`Notification type ${type} is disabled for user ${recipientId}`);
        return null;
      }

      // Check quiet hours
      if (preferences.isInQuietHours() && priority < 4) {
        console.log(`User ${recipientId} is in quiet hours, deferring notification`);
        // Schedule for later delivery
        expiresAt = this.calculateNextDeliveryTime(preferences);
      }

      // Create notification
      const notification = new Notification({
        recipient: recipientId,
        sender: senderId,
        type,
        title,
        message,
        data,
        priority,
        category,
        tags,
        actionUrl,
        expiresAt,
        userPreferences: {
          pushEnabled: preferences.channels.push.enabled,
          emailEnabled: preferences.channels.email.enabled,
          smsEnabled: preferences.channels.sms.enabled,
          inAppEnabled: preferences.channels.inApp.enabled
        }
      });

      await notification.save();

      // Send notification through enabled channels
      await this.deliverNotification(notification, preferences);

      return notification;

    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }

  /**
   * Deliver notification through enabled channels
   * @param {Object} notification - Notification object
   * @param {Object} preferences - User preferences
   */
  static async deliverNotification(notification, preferences) {
    const enabledChannels = preferences.getEnabledChannels(notification.type);
    
    for (const channel of enabledChannels) {
      try {
        await this.sendToChannel(notification, channel, preferences);
      } catch (error) {
        console.error(`Error sending notification to ${channel}:`, error);
        await notification.markAsFailed(channel, error.message);
      }
    }
  }

  /**
   * Send notification to specific channel
   * @param {Object} notification - Notification object
   * @param {String} channel - Channel name
   * @param {Object} preferences - User preferences
   */
  static async sendToChannel(notification, channel, preferences) {
    const recipient = await User.findById(notification.recipient);
    const sender = await User.findById(notification.sender);

    // Add delivery channel tracking
    notification.deliveryChannels.push({
      channel,
      status: 'pending',
      sentAt: new Date()
    });

    switch (channel) {
      case 'push':
        await this.sendPushNotification(notification, recipient, sender, preferences);
        break;
      case 'email':
        await this.sendEmailNotification(notification, recipient, sender, preferences);
        break;
      case 'sms':
        await this.sendSMSNotification(notification, recipient, sender, preferences);
        break;
      case 'inApp':
        // In-app notifications are already stored in database
        await notification.markAsDelivered('inApp');
        break;
      default:
        throw new Error(`Unknown notification channel: ${channel}`);
    }
  }

  /**
   * Send push notification
   */
  static async sendPushNotification(notification, recipient, sender, preferences) {
    if (!preferences.channels.push.deviceTokens || preferences.channels.push.deviceTokens.length === 0) {
      throw new Error('No device tokens available for push notifications');
    }

    const pushData = {
      title: notification.title,
      body: notification.message,
      data: {
        notificationId: notification._id.toString(),
        type: notification.type,
        senderId: sender._id.toString(),
        senderName: sender.name || sender.profile?.displayName,
        actionUrl: notification.actionUrl,
        ...notification.data
      },
      icon: sender.avatar || sender.profile?.avatar || '/default-avatar.png',
      badge: '/badge-icon.png',
      sound: preferences.channels.inApp.sound ? 'default' : null,
      vibrate: preferences.channels.inApp.vibration ? [200, 100, 200] : null
    };

    // Send to all device tokens
    for (const deviceToken of preferences.channels.push.deviceTokens) {
      try {
        await sendPushNotification(deviceToken.token, pushData, deviceToken.platform);
        await notification.markAsDelivered('push');
      } catch (error) {
        console.error(`Failed to send push to token ${deviceToken.token}:`, error);
        await notification.markAsFailed('push', error.message);
      }
    }
  }

  /**
   * Send email notification
   */
  static async sendEmailNotification(notification, recipient, sender, preferences) {
    const emailData = {
      to: recipient.email,
      subject: notification.title,
      template: this.getEmailTemplate(notification.type),
      data: {
        recipientName: recipient.name || recipient.profile?.displayName,
        senderName: sender.name || sender.profile?.displayName,
        notificationTitle: notification.title,
        notificationMessage: notification.message,
        actionUrl: notification.actionUrl,
        ...notification.data
      }
    };

    await sendEmail(emailData);
    await notification.markAsDelivered('email');
  }

  /**
   * Send SMS notification
   */
  static async sendSMSNotification(notification, recipient, sender, preferences) {
    if (!preferences.channels.sms.phoneNumber || !preferences.channels.sms.verified) {
      throw new Error('SMS not configured or verified for user');
    }

    const smsMessage = `${notification.title}: ${notification.message}`;
    
    // Implement SMS sending logic here (Twilio, AWS SNS, etc.)
    // await sendSMS(preferences.channels.sms.phoneNumber, smsMessage);
    
    console.log(`SMS to ${preferences.channels.sms.phoneNumber}: ${smsMessage}`);
    await notification.markAsDelivered('sms');
  }

  /**
   * Get email template for notification type
   */
  static getEmailTemplate(type) {
    const templates = {
      live_stream_started: 'live-stream-notification',
      new_post: 'new-post-notification',
      follow: 'follow-notification',
      message: 'message-notification',
      subscription: 'subscription-notification',
      default: 'general-notification'
    };

    return templates[type] || templates.default;
  }

  /**
   * Notify followers when user goes live
   */
  static async notifyLiveStreamStarted(streamerId, streamData) {
    try {
      const streamer = await User.findById(streamerId);
      if (!streamer) {
        throw new Error('Streamer not found');
      }

      // Get all followers
      const followers = await User.find({
        following: streamerId,
        isActive: true
      });

      const notifications = [];

      for (const follower of followers) {
        const notification = await this.createNotification({
          recipientId: follower._id,
          senderId: streamerId,
          type: 'live_stream_started',
          title: `${streamer.name || streamer.profile?.displayName} is now live!`,
          message: streamData.title || 'Join the live stream now!',
          data: {
            streamId: streamData.id,
            streamTitle: streamData.title,
            streamThumbnail: streamData.thumbnail
          },
          priority: 5,
          category: 'content',
          tags: ['live', 'streaming'],
          actionUrl: `/live/${streamData.id}`
        });

        if (notification) {
          notifications.push(notification);
        }
      }

      console.log(`Sent live stream notifications to ${notifications.length} followers`);
      return notifications;

    } catch (error) {
      console.error('Error notifying live stream start:', error);
      throw error;
    }
  }

  /**
   * Notify followers when user posts new content
   */
  static async notifyNewPost(creatorId, postData) {
    try {
      const creator = await User.findById(creatorId);
      if (!creator) {
        throw new Error('Creator not found');
      }

      // Get all followers
      const followers = await User.find({
        following: creatorId,
        isActive: true
      });

      const notifications = [];

      for (const follower of followers) {
        const notification = await this.createNotification({
          recipientId: follower._id,
          senderId: creatorId,
          type: 'new_post',
          title: `New post from ${creator.name || creator.profile?.displayName}`,
          message: postData.caption || 'Check out their latest content!',
          data: {
            contentId: postData.id,
            contentType: postData.type,
            contentThumbnail: postData.thumbnail
          },
          priority: 4,
          category: 'content',
          tags: ['post', 'content'],
          actionUrl: `/post/${postData.id}`
        });

        if (notification) {
          notifications.push(notification);
        }
      }

      console.log(`Sent new post notifications to ${notifications.length} followers`);
      return notifications;

    } catch (error) {
      console.error('Error notifying new post:', error);
      throw error;
    }
  }

  /**
   * Notify user when someone follows them
   */
  static async notifyNewFollower(userId, followerId) {
    try {
      const follower = await User.findById(followerId);
      if (!follower) {
        throw new Error('Follower not found');
      }

      const notification = await this.createNotification({
        recipientId: userId,
        senderId: followerId,
        type: 'follow',
        title: 'New Follower!',
        message: `${follower.name || follower.profile?.displayName} started following you`,
        data: {
          targetId: followerId,
          targetType: 'user'
        },
        priority: 4,
        category: 'social',
        tags: ['follow', 'social'],
        actionUrl: `/profile/${followerId}`
      });

      return notification;

    } catch (error) {
      console.error('Error notifying new follower:', error);
      throw error;
    }
  }

  /**
   * Notify user when they receive a message
   */
  static async notifyNewMessage(recipientId, senderId, messageData) {
    try {
      const sender = await User.findById(senderId);
      if (!sender) {
        throw new Error('Sender not found');
      }

      const notification = await this.createNotification({
        recipientId,
        senderId,
        type: 'message',
        title: `New message from ${sender.name || sender.profile?.displayName}`,
        message: messageData.content || 'You have a new message',
        data: {
          messageId: messageData.id,
          conversationId: messageData.conversationId
        },
        priority: 5,
        category: 'social',
        tags: ['message', 'chat'],
        actionUrl: `/messages/${messageData.conversationId}`
      });

      return notification;

    } catch (error) {
      console.error('Error notifying new message:', error);
      throw error;
    }
  }

  /**
   * Get notifications for user
   */
  static async getUserNotifications(userId, options = {}) {
    try {
      const notifications = await Notification.getUserNotifications(userId, options);
      return notifications;
    } catch (error) {
      console.error('Error getting user notifications:', error);
      throw error;
    }
  }

  /**
   * Mark notification as read
   */
  static async markAsRead(notificationId, userId) {
    try {
      const notification = await Notification.findOne({
        _id: notificationId,
        recipient: userId
      });

      if (!notification) {
        throw new Error('Notification not found');
      }

      await notification.markAsRead();
      return notification;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }

  /**
   * Mark all notifications as read for user
   */
  static async markAllAsRead(userId) {
    try {
      const result = await Notification.markAllAsRead(userId);
      return result;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  }

  /**
   * Get unread notification count for user
   */
  static async getUnreadCount(userId) {
    try {
      const count = await Notification.getUnreadCount(userId);
      return count;
    } catch (error) {
      console.error('Error getting unread count:', error);
      throw error;
    }
  }

  /**
   * Update notification preferences
   */
  static async updatePreferences(userId, preferences) {
    try {
      const userPreferences = await NotificationPreferences.getOrCreate(userId);
      
      // Update preferences
      Object.keys(preferences).forEach(key => {
        if (userPreferences[key] !== undefined) {
          userPreferences[key] = { ...userPreferences[key], ...preferences[key] };
        }
      });

      await userPreferences.save();
      return userPreferences;
    } catch (error) {
      console.error('Error updating notification preferences:', error);
      throw error;
    }
  }

  /**
   * Add device token for push notifications
   */
  static async addDeviceToken(userId, token, platform) {
    try {
      const preferences = await NotificationPreferences.getOrCreate(userId);
      
      // Check if token already exists
      const existingToken = preferences.channels.push.deviceTokens.find(
        dt => dt.token === token
      );

      if (!existingToken) {
        preferences.channels.push.deviceTokens.push({
          token,
          platform,
          lastUsed: new Date()
        });
      } else {
        existingToken.lastUsed = new Date();
      }

      await preferences.save();
      return preferences;
    } catch (error) {
      console.error('Error adding device token:', error);
      throw error;
    }
  }

  /**
   * Remove device token
   */
  static async removeDeviceToken(userId, token) {
    try {
      const preferences = await NotificationPreferences.getOrCreate(userId);
      
      preferences.channels.push.deviceTokens = preferences.channels.push.deviceTokens.filter(
        dt => dt.token !== token
      );

      await preferences.save();
      return preferences;
    } catch (error) {
      console.error('Error removing device token:', error);
      throw error;
    }
  }

  /**
   * Calculate next delivery time for quiet hours
   */
  static calculateNextDeliveryTime(preferences) {
    const now = new Date();
    const endTime = preferences.global.quietHours.end;
    const [hours, minutes] = endTime.split(':').map(Number);
    
    const nextDelivery = new Date(now);
    nextDelivery.setHours(hours, minutes, 0, 0);
    
    // If end time has passed today, schedule for tomorrow
    if (nextDelivery <= now) {
      nextDelivery.setDate(nextDelivery.getDate() + 1);
    }
    
    return nextDelivery;
  }

  /**
   * Clean up old notifications
   */
  static async cleanupOldNotifications(daysOld = 30) {
    try {
      const result = await Notification.cleanupOldNotifications(daysOld);
      console.log(`Cleaned up ${result.deletedCount} old notifications`);
      return result;
    } catch (error) {
      console.error('Error cleaning up old notifications:', error);
      throw error;
    }
  }
}

module.exports = NotificationService;
