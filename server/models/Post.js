const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  // Basic post information
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Post content
  content: {
    text: {
      type: String,
      maxlength: 2000,
      trim: true
    },
    media: [{
      type: {
        type: String,
        enum: ['image', 'video', 'audio', 'gif'],
        required: true
      },
      url: {
        type: String,
        required: true
      },
      thumbnail: String, // For videos
      duration: Number, // For videos/audio in seconds
      size: Number, // File size in bytes
      width: Number,
      height: Number,
      filters: [{
        type: String,
        enum: ['vintage', 'blackwhite', 'sepia', 'blur', 'brightness', 'contrast', 'saturation', 'hue', 'rainbow', 'neon', 'pixelate', 'mirror', 'fisheye', 'sunglasses', 'hat', 'mustache', 'crown', 'heart_eyes', 'rainbow_vomit']
      }],
      metadata: {
        originalName: String,
        mimeType: String,
        uploadedAt: { type: Date, default: Date.now }
      }
    }],
    hashtags: [{
      type: String,
      lowercase: true,
      trim: true
    }],
    mentions: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    links: [{
      url: String,
      title: String,
      description: String,
      image: String,
      domain: String
    }]
  },

  // Post type and category
  type: {
    type: String,
    enum: ['text', 'image', 'video', 'audio', 'mixed', 'story', 'reel', 'live'],
    default: 'text'
  },
  
  category: {
    type: String,
    enum: ['general', 'fitness', 'art', 'music', 'photography', 'travel', 'food', 'fashion', 'technology', 'gaming', 'sports', 'education', 'business', 'lifestyle', 'beauty', 'comedy', 'dance', 'writing', 'crafts', 'nature', 'pets', 'nsfw'],
    default: 'general'
  },

  // Privacy and audience settings
  privacy: {
    visibility: {
      type: String,
      enum: ['public', 'followers', 'friends', 'private', 'custom'],
      default: 'public'
    },
    audience: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    allowComments: {
      type: Boolean,
      default: true
    },
    allowShares: {
      type: Boolean,
      default: true
    },
    allowReactions: {
      type: Boolean,
      default: true
    },
    ageRestricted: {
      type: Boolean,
      default: false
    }
  },

  // Engagement metrics
  engagement: {
    likes: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      reaction: {
        type: String,
        enum: ['like', 'love', 'laugh', 'wow', 'sad', 'angry', 'fire', 'heart_eyes'],
        default: 'like'
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    }],
    comments: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment'
    }],
    shares: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      sharedAt: {
        type: Date,
        default: Date.now
      },
      shareType: {
        type: String,
        enum: ['share', 'repost', 'quote'],
        default: 'share'
      },
      shareText: String // For quote shares
    }],
    views: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      viewedAt: {
        type: Date,
        default: Date.now
      },
      duration: Number // How long they viewed in seconds
    }],
    saves: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      savedAt: {
        type: Date,
        default: Date.now
      }
    }]
  },

  // Post relationships
  relationships: {
    originalPost: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post'
    },
    repostOf: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post'
    },
    thread: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post'
    },
    replies: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post'
    }],
    parentPost: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post'
    }
  },

  // Location and context
  location: {
    name: String,
    coordinates: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        index: '2dsphere'
      }
    },
    address: String,
    city: String,
    country: String
  },

  // Scheduling and publishing
  scheduledFor: Date,
  publishedAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'scheduled', 'archived', 'deleted'],
    default: 'published'
  },

  // Moderation and safety
  moderation: {
    isApproved: {
      type: Boolean,
      default: true
    },
    moderationFlags: [{
      type: String,
      enum: ['inappropriate_content', 'spam', 'harassment', 'copyright', 'violence', 'nudity', 'other']
    }],
    moderationNotes: String,
    moderatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    moderatedAt: Date,
    autoModerationScore: Number // 0-100, higher = more likely to be flagged
  },

  // Analytics and insights
  analytics: {
    reach: {
      total: { type: Number, default: 0 },
      unique: { type: Number, default: 0 },
      followers: { type: Number, default: 0 },
      nonFollowers: { type: Number, default: 0 }
    },
    engagement: {
      rate: { type: Number, default: 0 }, // Percentage
      clicks: { type: Number, default: 0 },
      shares: { type: Number, default: 0 },
      comments: { type: Number, default: 0 },
      likes: { type: Number, default: 0 }
    },
    demographics: {
      ageGroups: [{
        range: String,
        count: Number
      }],
      genders: [{
        gender: String,
        count: Number
      }],
      locations: [{
        location: String,
        count: Number
      }]
    }
  },

  // SEO and discovery
  seo: {
    title: String,
    description: String,
    keywords: [String],
    slug: String
  },

  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for better performance
postSchema.index({ author: 1, createdAt: -1 });
postSchema.index({ type: 1, createdAt: -1 });
postSchema.index({ category: 1, createdAt: -1 });
postSchema.index({ 'privacy.visibility': 1, createdAt: -1 });
postSchema.index({ 'content.hashtags': 1 });
postSchema.index({ 'content.mentions': 1 });
postSchema.index({ 'location.coordinates': '2dsphere' });
postSchema.index({ status: 1, publishedAt: -1 });
postSchema.index({ 'engagement.likes': 1 });
postSchema.index({ 'engagement.comments': 1 });
postSchema.index({ 'engagement.shares': 1 });

// Text search index
postSchema.index({
  'content.text': 'text',
  'content.hashtags': 'text',
  'seo.title': 'text',
  'seo.description': 'text'
});

// Virtual for engagement counts
postSchema.virtual('engagementCounts').get(function() {
  return {
    likes: this.engagement.likes.length,
    comments: this.engagement.comments.length,
    shares: this.engagement.shares.length,
    views: this.engagement.views.length,
    saves: this.engagement.saves.length
  };
});

// Virtual for reaction counts
postSchema.virtual('reactionCounts').get(function() {
  const counts = {};
  this.engagement.likes.forEach(like => {
    counts[like.reaction] = (counts[like.reaction] || 0) + 1;
  });
  return counts;
});

// Pre-save middleware
postSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  
  // Extract hashtags from text content
  if (this.content.text) {
    const hashtagRegex = /#[\w\u0590-\u05ff]+/g;
    const hashtags = this.content.text.match(hashtagRegex);
    if (hashtags) {
      this.content.hashtags = hashtags.map(tag => tag.toLowerCase().substring(1));
    }
  }
  
  // Extract mentions from text content
  if (this.content.text) {
    const mentionRegex = /@[\w\u0590-\u05ff]+/g;
    const mentions = this.content.text.match(mentionRegex);
    if (mentions) {
      // This would need to be resolved to actual user IDs
      // For now, we'll store the handles
      this.content.mentions = mentions.map(mention => mention.substring(1));
    }
  }
  
  // Generate slug for SEO
  if (this.content.text && !this.seo.slug) {
    this.seo.slug = this.content.text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 50);
  }
  
  next();
});

// Static methods
postSchema.statics.findByAuthor = function(authorId, options = {}) {
  const { limit = 20, skip = 0, type = null, category = null } = options;
  
  const query = { author: authorId, status: 'published' };
  if (type) query.type = type;
  if (category) query.category = category;
  
  return this.find(query)
    .populate('author', 'name handle avatar verified')
    .populate('engagement.comments')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
};

postSchema.statics.findByHashtag = function(hashtag, options = {}) {
  const { limit = 20, skip = 0 } = options;
  
  return this.find({
    'content.hashtags': hashtag.toLowerCase(),
    status: 'published',
    'privacy.visibility': { $in: ['public', 'followers'] }
  })
    .populate('author', 'name handle avatar verified')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
};

postSchema.statics.findTrending = function(options = {}) {
  const { limit = 20, timeRange = '24h' } = options;
  
  let timeFilter = {};
  if (timeRange === '1h') {
    timeFilter = { createdAt: { $gte: new Date(Date.now() - 60 * 60 * 1000) } };
  } else if (timeRange === '24h') {
    timeFilter = { createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } };
  } else if (timeRange === '7d') {
    timeFilter = { createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } };
  }
  
  return this.find({
    status: 'published',
    'privacy.visibility': { $in: ['public', 'followers'] },
    ...timeFilter
  })
    .populate('author', 'name handle avatar verified')
    .sort({ 'engagement.likes': -1, 'engagement.comments': -1, 'engagement.shares': -1 })
    .limit(limit);
};

postSchema.statics.searchPosts = function(searchQuery, options = {}) {
  const { limit = 20, skip = 0, type = null, category = null } = options;
  
  const query = {
    $text: { $search: searchQuery },
    status: 'published',
    'privacy.visibility': { $in: ['public', 'followers'] }
  };
  
  if (type) query.type = type;
  if (category) query.category = category;
  
  return this.find(query)
    .populate('author', 'name handle avatar verified')
    .sort({ score: { $meta: 'textScore' } })
    .skip(skip)
    .limit(limit);
};

// Instance methods
postSchema.methods.addLike = async function(userId, reaction = 'like') {
  // Remove existing like from this user
  this.engagement.likes = this.engagement.likes.filter(
    like => !like.user.equals(userId)
  );
  
  // Add new like
  this.engagement.likes.push({
    user: userId,
    reaction: reaction
  });
  
  return await this.save();
};

postSchema.methods.removeLike = async function(userId) {
  this.engagement.likes = this.engagement.likes.filter(
    like => !like.user.equals(userId)
  );
  
  return await this.save();
};

postSchema.methods.addView = async function(userId, duration = 0) {
  // Remove existing view from this user
  this.engagement.views = this.engagement.views.filter(
    view => !view.user.equals(userId)
  );
  
  // Add new view
  this.engagement.views.push({
    user: userId,
    duration: duration
  });
  
  return await this.save();
};

postSchema.methods.addShare = async function(userId, shareType = 'share', shareText = '') {
  this.engagement.shares.push({
    user: userId,
    shareType: shareType,
    shareText: shareText
  });
  
  return await this.save();
};

postSchema.methods.addSave = async function(userId) {
  // Check if already saved
  const alreadySaved = this.engagement.saves.some(
    save => save.user.equals(userId)
  );
  
  if (!alreadySaved) {
    this.engagement.saves.push({
      user: userId
    });
  }
  
  return await this.save();
};

postSchema.methods.removeSave = async function(userId) {
  this.engagement.saves = this.engagement.saves.filter(
    save => !save.user.equals(userId)
  );
  
  return await this.save();
};

postSchema.methods.isLikedBy = function(userId) {
  return this.engagement.likes.some(like => like.user.equals(userId));
};

postSchema.methods.isSavedBy = function(userId) {
  return this.engagement.saves.some(save => save.user.equals(userId));
};

postSchema.methods.isSharedBy = function(userId) {
  return this.engagement.shares.some(share => share.user.equals(userId));
};

postSchema.methods.getUserReaction = function(userId) {
  const like = this.engagement.likes.find(like => like.user.equals(userId));
  return like ? like.reaction : null;
};

// Export the model
module.exports = mongoose.model('Post', postSchema);
