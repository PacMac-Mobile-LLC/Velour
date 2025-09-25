const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['creator', 'subscriber'],
    default: 'subscriber'
  },
  profile: {
    displayName: {
      type: String,
      required: true,
      trim: true
    },
    bio: {
      type: String,
      maxlength: 500
    },
    avatar: {
      type: String,
      default: null
    },
    coverImage: {
      type: String,
      default: null
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    socialLinks: {
      twitter: String,
      instagram: String,
      tiktok: String
    }
  },
  subscription: {
    stripeCustomerId: String,
    stripeSubscriptionId: String,
    status: {
      type: String,
      enum: ['active', 'inactive', 'cancelled', 'past_due'],
      default: 'inactive'
    },
    currentPeriodEnd: Date,
    plan: {
      type: String,
      enum: ['basic', 'premium', 'vip'],
      default: 'basic'
    }
  },
  creatorSettings: {
    subscriptionPrice: {
      monthly: {
        type: Number,
        default: 9.99,
        min: 0
      },
      yearly: {
        type: Number,
        default: 99.99,
        min: 0
      }
    },
    isActive: {
      type: Boolean,
      default: true
    },
    earnings: {
      total: {
        type: Number,
        default: 0
      },
      thisMonth: {
        type: Number,
        default: 0
      }
    },
    subscriberCount: {
      type: Number,
      default: 0
    }
  },
  preferences: {
    notifications: {
      email: {
        type: Boolean,
        default: true
      },
      push: {
        type: Boolean,
        default: true
      }
    },
    privacy: {
      showOnlineStatus: {
        type: Boolean,
        default: true
      },
      allowMessages: {
        type: Boolean,
        default: true
      }
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date,
    default: Date.now
  },
  // Age verification fields
  isAgeVerified: {
    type: Boolean,
    default: false,
    index: true
  },
  ageVerifiedAt: {
    type: Date,
    default: null
  },
  ageVerificationStatus: {
    type: String,
    enum: ['not_started', 'pending', 'verified', 'failed', 'expired'],
    default: 'not_started',
    index: true
  },
  ageVerificationId: {
    type: String,
    default: null
  },
  // Additional profile fields
  name: {
    type: String,
    trim: true
  },
  handle: {
    type: String,
    trim: true,
    unique: true,
    sparse: true
  },
  bio: {
    type: String,
    maxlength: 500,
    default: ''
  },
  avatar: {
    type: String,
    default: null
  },
  avatarPath: {
    type: String,
    default: null
  },
  location: {
    type: String,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  website: {
    type: String,
    trim: true
  },
  birthday: {
    type: Date
  },
  // Profile settings
  profileVisibility: {
    type: String,
    enum: ['public', 'private'],
    default: 'public'
  },
  emailNotifications: {
    type: Boolean,
    default: true
  },
  pushNotifications: {
    type: Boolean,
    default: true
  },
  twoFactorAuth: {
    type: Boolean,
    default: false
  },
  dataSharing: {
    type: Boolean,
    default: false
  },
  marketingEmails: {
    type: Boolean,
    default: false
  },
  // External links
  links: [{
    id: String,
    title: String,
    description: String,
    url: String,
    type: {
      type: String,
      enum: ['social', 'website', 'support'],
      default: 'website'
    }
  }],
  // Stats
  followers: {
    type: Number,
    default: 0
  },
  following: {
    type: Number,
    default: 0
  },
  posts: {
    type: Number,
    default: 0
  },
  // AI Matching Preferences
  matchingPreferences: {
    // Content interests
    contentInterests: [{
      type: String,
      enum: [
        'fitness', 'art', 'music', 'photography', 'travel', 'food', 'fashion',
        'technology', 'gaming', 'sports', 'education', 'business', 'lifestyle',
        'beauty', 'comedy', 'dance', 'writing', 'crafts', 'nature', 'pets'
      ]
    }],
    // Personality traits (1-5 scale)
    personalityTraits: {
      outgoing: { type: Number, min: 1, max: 5, default: 3 },
      creative: { type: Number, min: 1, max: 5, default: 3 },
      adventurous: { type: Number, min: 1, max: 5, default: 3 },
      intellectual: { type: Number, min: 1, max: 5, default: 3 },
      romantic: { type: Number, min: 1, max: 5, default: 3 },
      humorous: { type: Number, min: 1, max: 5, default: 3 },
      supportive: { type: Number, min: 1, max: 5, default: 3 },
      ambitious: { type: Number, min: 1, max: 5, default: 3 }
    },
    // Relationship preferences
    relationshipGoals: [{
      type: String,
      enum: ['friendship', 'dating', 'casual', 'serious', 'networking', 'collaboration']
    }],
    // Age preferences
    ageRange: {
      min: { type: Number, min: 18, max: 100, default: 18 },
      max: { type: Number, min: 18, max: 100, default: 100 }
    },
    // Location preferences
    locationPreferences: {
      nearby: { type: Boolean, default: true },
      sameCountry: { type: Boolean, default: true },
      international: { type: Boolean, default: false },
      maxDistance: { type: Number, default: 50 } // in miles/km
    },
    // Activity preferences
    activityPreferences: [{
      type: String,
      enum: [
        'video_calls', 'voice_calls', 'text_chat', 'live_streaming',
        'content_creation', 'collaboration', 'gaming', 'virtual_dates'
      ]
    }],
    // Communication style
    communicationStyle: {
      frequency: {
        type: String,
        enum: ['daily', 'weekly', 'monthly', 'occasional'],
        default: 'weekly'
      },
      preferredTime: {
        type: String,
        enum: ['morning', 'afternoon', 'evening', 'night', 'anytime'],
        default: 'anytime'
      },
      formality: {
        type: String,
        enum: ['casual', 'professional', 'mixed'],
        default: 'casual'
      }
    },
    // Content creation preferences
    creatorPreferences: {
      contentTypes: [{
        type: String,
        enum: ['photos', 'videos', 'live_streams', 'audio', 'text', 'artwork']
      }],
      collaborationInterest: { type: Boolean, default: false },
      mentoringInterest: { type: Boolean, default: false },
      learningInterest: { type: Boolean, default: false }
    }
  },
  // AI Matching Data
  aiProfile: {
    // Computed compatibility scores with other users
    compatibilityScores: [{
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      score: { type: Number, min: 0, max: 100 },
      factors: {
        interests: { type: Number, min: 0, max: 100 },
        personality: { type: Number, min: 0, max: 100 },
        location: { type: Number, min: 0, max: 100 },
        activity: { type: Number, min: 0, max: 100 }
      },
      lastUpdated: { type: Date, default: Date.now }
    }],
    // User behavior patterns
    behaviorPatterns: {
      activeHours: [Number], // 0-23 representing hours of day
      preferredContentTypes: [String],
      interactionFrequency: { type: Number, default: 0 },
      responseTime: { type: Number, default: 0 }, // average response time in minutes
      engagementScore: { type: Number, min: 0, max: 100, default: 50 }
    },
    // Learning data for AI
    learningData: {
      successfulMatches: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
      failedMatches: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
      userFeedback: [{
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        rating: { type: Number, min: 1, max: 5 },
        feedback: String,
        timestamp: { type: Date, default: Date.now }
      }],
      preferencesUpdated: { type: Date, default: Date.now }
    }
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Get public profile data
userSchema.methods.getPublicProfile = function() {
  return {
    _id: this._id,
    username: this.username,
    profile: this.profile,
    role: this.role,
    creatorSettings: this.role === 'creator' ? {
      subscriptionPrice: this.creatorSettings.subscriptionPrice,
      isActive: this.creatorSettings.isActive,
      subscriberCount: this.creatorSettings.subscriberCount
    } : undefined,
    isActive: this.isActive,
    createdAt: this.createdAt
  };
};

module.exports = mongoose.model('User', userSchema);
