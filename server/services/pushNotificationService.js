const webpush = require('web-push');

// Configure web-push (you'll need to set these in your environment variables)
webpush.setVapidDetails(
  process.env.VAPID_SUBJECT || 'mailto:admin@vibecodes.space',
  process.env.VAPID_PUBLIC_KEY || 'your-vapid-public-key',
  process.env.VAPID_PRIVATE_KEY || 'your-vapid-private-key'
);

class PushNotificationService {
  /**
   * Send push notification to a device
   * @param {String} deviceToken - Device token
   * @param {Object} payload - Notification payload
   * @param {String} platform - Platform (ios, android, web)
   * @returns {Promise}
   */
  static async sendPushNotification(deviceToken, payload, platform = 'web') {
    try {
      const notificationPayload = this.formatPayload(payload, platform);
      
      switch (platform) {
        case 'web':
          return await this.sendWebPush(deviceToken, notificationPayload);
        case 'ios':
          return await this.sendIOSPush(deviceToken, notificationPayload);
        case 'android':
          return await this.sendAndroidPush(deviceToken, notificationPayload);
        default:
          throw new Error(`Unsupported platform: ${platform}`);
      }
    } catch (error) {
      console.error('Error sending push notification:', error);
      throw error;
    }
  }

  /**
   * Format payload for different platforms
   * @param {Object} payload - Original payload
   * @param {String} platform - Platform
   * @returns {Object} Formatted payload
   */
  static formatPayload(payload, platform) {
    const basePayload = {
      title: payload.title,
      body: payload.message || payload.body,
      icon: payload.icon || '/icon-192.png',
      badge: payload.badge || '/badge-icon.png',
      data: payload.data || {}
    };

    switch (platform) {
      case 'web':
        return {
          ...basePayload,
          actions: [
            {
              action: 'view',
              title: 'View',
              icon: '/view-icon.png'
            },
            {
              action: 'dismiss',
              title: 'Dismiss',
              icon: '/dismiss-icon.png'
            }
          ],
          requireInteraction: payload.priority >= 4,
          silent: payload.priority < 3,
          vibrate: payload.vibrate || [200, 100, 200],
          sound: payload.sound || 'default'
        };

      case 'ios':
        return {
          aps: {
            alert: {
              title: basePayload.title,
              body: basePayload.body
            },
            badge: 1,
            sound: basePayload.sound || 'default',
            'content-available': 1,
            'mutable-content': 1
          },
          ...basePayload.data
        };

      case 'android':
        return {
          notification: {
            title: basePayload.title,
            body: basePayload.body,
            icon: basePayload.icon,
            sound: basePayload.sound || 'default',
            vibrate: basePayload.vibrate || [200, 100, 200],
            priority: payload.priority >= 4 ? 'high' : 'normal',
            visibility: 'public'
          },
          data: basePayload.data
        };

      default:
        return basePayload;
    }
  }

  /**
   * Send web push notification
   * @param {String} subscription - Web push subscription
   * @param {Object} payload - Notification payload
   * @returns {Promise}
   */
  static async sendWebPush(subscription, payload) {
    try {
      const result = await webpush.sendNotification(subscription, JSON.stringify(payload));
      console.log('Web push sent successfully:', result);
      return result;
    } catch (error) {
      console.error('Web push failed:', error);
      
      // Handle specific error cases
      if (error.statusCode === 410) {
        // Subscription expired, should be removed
        throw new Error('Subscription expired');
      } else if (error.statusCode === 400) {
        // Bad request, invalid subscription
        throw new Error('Invalid subscription');
      }
      
      throw error;
    }
  }

  /**
   * Send iOS push notification (using APNs)
   * @param {String} deviceToken - iOS device token
   * @param {Object} payload - Notification payload
   * @returns {Promise}
   */
  static async sendIOSPush(deviceToken, payload) {
    try {
      // For iOS, you would typically use a library like 'apn' or 'node-apn'
      // This is a placeholder implementation
      console.log('iOS push notification:', {
        deviceToken,
        payload
      });
      
      // In a real implementation, you would:
      // 1. Create APNs connection
      // 2. Send notification through APNs
      // 3. Handle responses and errors
      
      return { success: true, platform: 'ios' };
    } catch (error) {
      console.error('iOS push failed:', error);
      throw error;
    }
  }

  /**
   * Send Android push notification (using FCM)
   * @param {String} deviceToken - FCM device token
   * @param {Object} payload - Notification payload
   * @returns {Promise}
   */
  static async sendAndroidPush(deviceToken, payload) {
    try {
      // For Android, you would typically use Firebase Cloud Messaging (FCM)
      // This is a placeholder implementation
      console.log('Android push notification:', {
        deviceToken,
        payload
      });
      
      // In a real implementation, you would:
      // 1. Use Firebase Admin SDK
      // 2. Send message through FCM
      // 3. Handle responses and errors
      
      return { success: true, platform: 'android' };
    } catch (error) {
      console.error('Android push failed:', error);
      throw error;
    }
  }

  /**
   * Send push notification to multiple devices
   * @param {Array} deviceTokens - Array of device tokens
   * @param {Object} payload - Notification payload
   * @param {String} platform - Platform
   * @returns {Promise<Array>} Results array
   */
  static async sendBulkPushNotifications(deviceTokens, payload, platform = 'web') {
    try {
      const results = await Promise.allSettled(
        deviceTokens.map(token => this.sendPushNotification(token, payload, platform))
      );

      const successful = results.filter(result => result.status === 'fulfilled').length;
      const failed = results.filter(result => result.status === 'rejected').length;

      console.log(`Bulk push results: ${successful} successful, ${failed} failed`);

      return {
        successful,
        failed,
        results
      };
    } catch (error) {
      console.error('Error sending bulk push notifications:', error);
      throw error;
    }
  }

  /**
   * Validate device token
   * @param {String} deviceToken - Device token
   * @param {String} platform - Platform
   * @returns {Boolean} Is valid
   */
  static validateDeviceToken(deviceToken, platform) {
    if (!deviceToken || typeof deviceToken !== 'string') {
      return false;
    }

    switch (platform) {
      case 'web':
        // Web push subscription should be a valid JSON object
        try {
          const subscription = JSON.parse(deviceToken);
          return subscription.endpoint && subscription.keys;
        } catch {
          return false;
        }

      case 'ios':
        // iOS device tokens are 64 characters hex string
        return /^[a-fA-F0-9]{64}$/.test(deviceToken);

      case 'android':
        // FCM tokens are longer strings
        return deviceToken.length > 100;

      default:
        return false;
    }
  }

  /**
   * Get VAPID keys for web push
   * @returns {Object} VAPID keys
   */
  static getVapidKeys() {
    return {
      publicKey: process.env.VAPID_PUBLIC_KEY,
      privateKey: process.env.VAPID_PRIVATE_KEY
    };
  }

  /**
   * Generate new VAPID keys (for setup)
   * @returns {Object} New VAPID keys
   */
  static generateVapidKeys() {
    const vapidKeys = webpush.generateVAPIDKeys();
    return {
      publicKey: vapidKeys.publicKey,
      privateKey: vapidKeys.privateKey
    };
  }
}

// Export the main function for compatibility
const sendPushNotification = PushNotificationService.sendPushNotification;

module.exports = {
  PushNotificationService,
  sendPushNotification
};
