const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    maxlength: 1000
  },
  type: {
    type: String,
    enum: ['video', 'image', 'text', 'live_stream'],
    required: true
  },
  media: {
    url: {
      type: String,
      required: true
    },
    thumbnail: String,
    duration: Number, // for videos in seconds
    size: Number, // file size in bytes
    format: String // mp4, jpg, png, etc.
  },
  access: {
    type: {
      type: String,
      enum: ['free', 'subscription', 'pay_per_view'],
      default: 'subscription'
    },
    price: {
      type: Number,
      min: 0,
      default: 0
    },
    tier: {
      type: String,
      enum: ['basic', 'premium', 'vip'],
      default: 'basic'
    }
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  category: {
    type: String,
    enum: ['entertainment', 'education', 'lifestyle', 'fitness', 'music', 'art', 'other'],
    default: 'entertainment'
  },
  stats: {
    views: {
      type: Number,
      default: 0
    },
    likes: {
      type: Number,
      default: 0
    },
    comments: {
      type: Number,
      default: 0
    },
    shares: {
      type: Number,
      default: 0
    }
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  isLive: {
    type: Boolean,
    default: false
  },
  scheduledFor: {
    type: Date,
    default: null
  },
  expiresAt: {
    type: Date,
    default: null
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  moderation: {
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    reviewedAt: Date,
    notes: String
  }
}, {
  timestamps: true
});

// Index for efficient queries
contentSchema.index({ creator: 1, createdAt: -1 });
contentSchema.index({ type: 1, isPublished: 1 });
contentSchema.index({ tags: 1 });
contentSchema.index({ category: 1 });

// Virtual for content URL
contentSchema.virtual('contentUrl').get(function() {
  return `/api/content/${this._id}/media`;
});

// Get public content data
contentSchema.methods.getPublicData = function() {
  return {
    _id: this._id,
    title: this.title,
    description: this.description,
    type: this.type,
    media: {
      thumbnail: this.media.thumbnail,
      duration: this.media.duration,
      format: this.media.format
    },
    access: this.access,
    tags: this.tags,
    category: this.category,
    stats: this.stats,
    isPublished: this.isPublished,
    isLive: this.isLive,
    createdAt: this.createdAt,
    creator: this.creator
  };
};

module.exports = mongoose.model('Content', contentSchema);
