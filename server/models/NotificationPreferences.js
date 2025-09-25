const mongoose = require('mongoose');

const notificationPreferencesSchema = new mongoose.Schema({
  // User this preferences belong to
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  // Global notification settings
  global: {
    enabled: {
      type: Boolean,
      default: true
    },
    quietHours: {
      enabled: {
        type: Boolean,
        default: false
      },
      start: {
        type: String,
        default: '22:00' // 10 PM
      },
      end: {
        type: String,
        default: '08:00' // 8 AM
      },
      timezone: {
        type: String,
        default: 'UTC'
      }
    },
    frequency: {
      type: String,
      enum: ['immediate', 'hourly', 'daily', 'weekly'],
      default: 'immediate'
    }
  },
  // Channel-specific preferences
  channels: {
    push: {
      enabled: {
        type: Boolean,
        default: true
      },
      deviceTokens: [{
        token: String,
        platform: {
          type: String,
          enum: ['ios', 'android', 'web']
        },
        lastUsed: {
          type: Date,
          default: Date.now
        }
      }]
    },
    email: {
      enabled: {
        type: Boolean,
        default: true
      },
      frequency: {
        type: String,
        enum: ['immediate', 'hourly', 'daily', 'weekly'],
        default: 'immediate'
      },
      digest: {
        enabled: {
          type: Boolean,
          default: false
        },
        time: {
          type: String,
          default: '09:00' // 9 AM
        }
      }
    },
    sms: {
      enabled: {
        type: Boolean,
        default: false
      },
      phoneNumber: String,
      verified: {
        type: Boolean,
        default: false
      }
    },
    inApp: {
      enabled: {
        type: Boolean,
        default: true
      },
      sound: {
        type: Boolean,
        default: true
      },
      vibration: {
        type: Boolean,
        default: true
      }
    }
  },
  // Type-specific preferences
  types: {
    live_stream_started: {
      enabled: {
        type: Boolean,
        default: true
      },
      channels: {
        push: { type: Boolean, default: true },
        email: { type: Boolean, default: true },
        sms: { type: Boolean, default: false },
        inApp: { type: Boolean, default: true }
      },
      priority: {
        type: Number,
        min: 1,
        max: 5,
        default: 5
      }
    },
    live_stream_ended: {
      enabled: {
        type: Boolean,
        default: false
      },
      channels: {
        push: { type: Boolean, default: false },
        email: { type: Boolean, default: false },
        sms: { type: Boolean, default: false },
        inApp: { type: Boolean, default: true }
      },
      priority: {
        type: Number,
        min: 1,
        max: 5,
        default: 2
      }
    },
    new_post: {
      enabled: {
        type: Boolean,
        default: true
      },
      channels: {
        push: { type: Boolean, default: true },
        email: { type: Boolean, default: false },
        sms: { type: Boolean, default: false },
        inApp: { type: Boolean, default: true }
      },
      priority: {
        type: Number,
        min: 1,
        max: 5,
        default: 4
      }
    },
    new_content: {
      enabled: {
        type: Boolean,
        default: true
      },
      channels: {
        push: { type: Boolean, default: true },
        email: { type: Boolean, default: false },
        sms: { type: Boolean, default: false },
        inApp: { type: Boolean, default: true }
      },
      priority: {
        type: Number,
        min: 1,
        max: 5,
        default: 3
      }
    },
    follow: {
      enabled: {
        type: Boolean,
        default: true
      },
      channels: {
        push: { type: Boolean, default: true },
        email: { type: Boolean, default: true },
        sms: { type: Boolean, default: false },
        inApp: { type: Boolean, default: true }
      },
      priority: {
        type: Number,
        min: 1,
        max: 5,
        default: 4
      }
    },
    like: {
      enabled: {
        type: Boolean,
        default: true
      },
      channels: {
        push: { type: Boolean, default: false },
        email: { type: Boolean, default: false },
        sms: { type: Boolean, default: false },
        inApp: { type: Boolean, default: true }
      },
      priority: {
        type: Number,
        min: 1,
        max: 5,
        default: 2
      }
    },
    comment: {
      enabled: {
        type: Boolean,
        default: true
      },
      channels: {
        push: { type: Boolean, default: true },
        email: { type: Boolean, default: false },
        sms: { type: Boolean, default: false },
        inApp: { type: Boolean, default: true }
      },
      priority: {
        type: Number,
        min: 1,
        max: 5,
        default: 3
      }
    },
    message: {
      enabled: {
        type: Boolean,
        default: true
      },
      channels: {
        push: { type: Boolean, default: true },
        email: { type: Boolean, default: false },
        sms: { type: Boolean, default: false },
        inApp: { type: Boolean, default: true }
      },
      priority: {
        type: Number,
        min: 1,
        max: 5,
        default: 5
      }
    },
    subscription: {
      enabled: {
        type: Boolean,
        default: true
      },
      channels: {
        push: { type: Boolean, default: true },
        email: { type: Boolean, default: true },
        sms: { type: Boolean, default: false },
        inApp: { type: Boolean, default: true }
      },
      priority: {
        type: Number,
        min: 1,
        max: 5,
        default: 4
      }
    },
    mention: {
      enabled: {
        type: Boolean,
        default: true
      },
      channels: {
        push: { type: Boolean, default: true },
        email: { type: Boolean, default: true },
        sms: { type: Boolean, default: false },
        inApp: { type: Boolean, default: true }
      },
      priority: {
        type: Number,
        min: 1,
        max: 5,
        default: 4
      }
    },
    system: {
      enabled: {
        type: Boolean,
        default: true
      },
      channels: {
        push: { type: Boolean, default: true },
        email: { type: Boolean, default: true },
        sms: { type: Boolean, default: false },
        inApp: { type: Boolean, default: true }
      },
      priority: {
        type: Number,
        min: 1,
        max: 5,
        default: 3
      }
    },
    reminder: {
      enabled: {
        type: Boolean,
        default: true
      },
      channels: {
        push: { type: Boolean, default: true },
        email: { type: Boolean, default: false },
        sms: { type: Boolean, default: false },
        inApp: { type: Boolean, default: true }
      },
      priority: {
        type: Number,
        min: 1,
        max: 5,
        default: 3
      }
    }
  },
  // Creator-specific preferences (for content creators)
  creator: {
    // Notifications about their content performance
    performance: {
      enabled: {
        type: Boolean,
        default: true
      },
      channels: {
        push: { type: Boolean, default: false },
        email: { type: Boolean, default: true },
        sms: { type: Boolean, default: false },
        inApp: { type: Boolean, default: true }
      },
      frequency: {
        type: String,
        enum: ['immediate', 'hourly', 'daily', 'weekly'],
        default: 'daily'
      }
    },
    // Notifications about new subscribers
    newSubscribers: {
      enabled: {
        type: Boolean,
        default: true
      },
      channels: {
        push: { type: Boolean, default: true },
        email: { type: Boolean, default: true },
        sms: { type: Boolean, default: false },
        inApp: { type: Boolean, default: true }
      }
    },
    // Notifications about earnings/milestones
    earnings: {
      enabled: {
        type: Boolean,
        default: true
      },
      channels: {
        push: { type: Boolean, default: false },
        email: { type: Boolean, default: true },
        sms: { type: Boolean, default: false },
        inApp: { type: Boolean, default: true }
      }
    }
  },
  // Follower-specific preferences
  follower: {
    // Only get notifications from followed users
    followedOnly: {
      type: Boolean,
      default: true
    },
    // Minimum follower count to receive notifications from
    minFollowerCount: {
      type: Number,
      default: 0
    },
    // Only get notifications from verified users
    verifiedOnly: {
      type: Boolean,
      default: false
    },
    // Content type preferences
    contentTypes: [{
      type: String,
      enum: ['photos', 'videos', 'live_streams', 'audio', 'text', 'artwork']
    }]
  }
}, {
  timestamps: true
});

// Index for efficient querying
notificationPreferencesSchema.index({ user: 1 });

// Method to check if notification type is enabled
notificationPreferencesSchema.methods.isNotificationEnabled = function(type, channel = null) {
  // Check global settings first
  if (!this.global.enabled) {
    return false;
  }

  // Check type-specific settings
  const typeSettings = this.types[type];
  if (!typeSettings || !typeSettings.enabled) {
    return false;
  }

  // If specific channel is requested, check channel settings
  if (channel) {
    return typeSettings.channels[channel] || false;
  }

  return true;
};

// Method to get enabled channels for notification type
notificationPreferencesSchema.methods.getEnabledChannels = function(type) {
  const typeSettings = this.types[type];
  if (!typeSettings || !typeSettings.enabled) {
    return [];
  }

  const enabledChannels = [];
  Object.keys(typeSettings.channels).forEach(channel => {
    if (typeSettings.channels[channel] && this.channels[channel]?.enabled) {
      enabledChannels.push(channel);
    }
  });

  return enabledChannels;
};

// Method to check if user is in quiet hours
notificationPreferencesSchema.methods.isInQuietHours = function() {
  if (!this.global.quietHours.enabled) {
    return false;
  }

  const now = new Date();
  const currentTime = now.toLocaleTimeString('en-US', { 
    hour12: false, 
    timeZone: this.global.quietHours.timezone 
  });
  
  const startTime = this.global.quietHours.start;
  const endTime = this.global.quietHours.end;

  // Handle overnight quiet hours (e.g., 22:00 to 08:00)
  if (startTime > endTime) {
    return currentTime >= startTime || currentTime <= endTime;
  } else {
    return currentTime >= startTime && currentTime <= endTime;
  }
};

// Static method to get or create preferences for user
notificationPreferencesSchema.statics.getOrCreate = async function(userId) {
  let preferences = await this.findOne({ user: userId });
  
  if (!preferences) {
    preferences = new this({ user: userId });
    await preferences.save();
  }
  
  return preferences;
};

module.exports = mongoose.model('NotificationPreferences', notificationPreferencesSchema);
