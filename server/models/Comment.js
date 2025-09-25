const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500
  },
  video_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Video',
    required: true,
    index: true
  },
  user_id: {
    type: String,
    required: true,
    index: true
  },
  parent_comment_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
    default: null // For nested comments/replies
  },
  likes: {
    type: Number,
    default: 0
  },
  replies: {
    type: Number,
    default: 0
  },
  is_edited: {
    type: Boolean,
    default: false
  },
  is_deleted: {
    type: Boolean,
    default: false
  },
  edited_at: {
    type: Date
  }
}, {
  timestamps: true
});

// Indexes for better performance
commentSchema.index({ video_id: 1, created_at: -1 });
commentSchema.index({ user_id: 1, created_at: -1 });
commentSchema.index({ parent_comment_id: 1, created_at: 1 });

// Virtual for like count
commentSchema.virtual('likeCount').get(function() {
  return this.likes;
});

// Virtual for reply count
commentSchema.virtual('replyCount').get(function() {
  return this.replies;
});

// Method to increment likes
commentSchema.methods.incrementLikes = function() {
  this.likes += 1;
  return this.save();
};

// Method to decrement likes
commentSchema.methods.decrementLikes = function() {
  if (this.likes > 0) {
    this.likes -= 1;
  }
  return this.save();
};

// Method to increment replies
commentSchema.methods.incrementReplies = function() {
  this.replies += 1;
  return this.save();
};

// Method to decrement replies
commentSchema.methods.decrementReplies = function() {
  if (this.replies > 0) {
    this.replies -= 1;
  }
  return this.save();
};

// Static method to get comments for a video
commentSchema.statics.getByVideo = function(videoId, limit = 50, skip = 0) {
  return this.find({ 
    video_id: videoId, 
    is_deleted: false,
    parent_comment_id: null // Only top-level comments
  })
  .sort({ created_at: -1 })
  .limit(limit)
  .skip(skip);
};

// Static method to get replies for a comment
commentSchema.statics.getReplies = function(parentCommentId, limit = 20) {
  return this.find({ 
    parent_comment_id: parentCommentId,
    is_deleted: false
  })
  .sort({ created_at: 1 })
  .limit(limit);
};

module.exports = mongoose.model('Comment', commentSchema);