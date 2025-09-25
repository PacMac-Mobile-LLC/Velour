const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500
  },
  video_url: {
    type: String,
    required: true
  },
  thumbnail_url: {
    type: String
  },
  user_id: {
    type: String,
    required: true,
    index: true
  },
  duration: {
    type: Number // in seconds
  },
  file_size: {
    type: Number // in bytes
  },
  mime_type: {
    type: String
  },
  is_public: {
    type: Boolean,
    default: true
  },
  is_featured: {
    type: Boolean,
    default: false
  },
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
  },
  tags: [{
    type: String,
    trim: true
  }],
  category: {
    type: String,
    enum: ['entertainment', 'education', 'lifestyle', 'gaming', 'music', 'sports', 'news', 'other'],
    default: 'other'
  },
  status: {
    type: String,
    enum: ['processing', 'ready', 'failed', 'private'],
    default: 'processing'
  },
  metadata: {
    width: Number,
    height: Number,
    aspect_ratio: String,
    fps: Number,
    bitrate: Number
  }
}, {
  timestamps: true
});

// Indexes for better performance
videoSchema.index({ user_id: 1, created_at: -1 });
videoSchema.index({ is_public: 1, created_at: -1 });
videoSchema.index({ category: 1, created_at: -1 });
videoSchema.index({ status: 1 });
videoSchema.index({ likes: -1, created_at: -1 }); // For trending videos

// Virtual for like count
videoSchema.virtual('likeCount').get(function() {
  return this.likes;
});

// Virtual for comment count
videoSchema.virtual('commentCount').get(function() {
  return this.comments;
});

// Virtual for share count
videoSchema.virtual('shareCount').get(function() {
  return this.shares;
});

// Method to increment views
videoSchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

// Method to increment likes
videoSchema.methods.incrementLikes = function() {
  this.likes += 1;
  return this.save();
};

// Method to decrement likes
videoSchema.methods.decrementLikes = function() {
  if (this.likes > 0) {
    this.likes -= 1;
  }
  return this.save();
};

// Method to increment comments
videoSchema.methods.incrementComments = function() {
  this.comments += 1;
  return this.save();
};

// Method to decrement comments
videoSchema.methods.decrementComments = function() {
  if (this.comments > 0) {
    this.comments -= 1;
  }
  return this.save();
};

// Method to increment shares
videoSchema.methods.incrementShares = function() {
  this.shares += 1;
  return this.save();
};

// Static method to get trending videos
videoSchema.statics.getTrending = function(limit = 20) {
  return this.find({ 
    is_public: true, 
    status: 'ready' 
  })
  .sort({ likes: -1, views: -1, created_at: -1 })
  .limit(limit);
};

// Static method to get videos by user
videoSchema.statics.getByUser = function(userId, limit = 20) {
  return this.find({ 
    user_id: userId, 
    is_public: true, 
    status: 'ready' 
  })
  .sort({ created_at: -1 })
  .limit(limit);
};

// Static method to get recent videos
videoSchema.statics.getRecent = function(limit = 20) {
  return this.find({ 
    is_public: true, 
    status: 'ready' 
  })
  .sort({ created_at: -1 })
  .limit(limit);
};

module.exports = mongoose.model('Video', videoSchema);
