const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  // Basic comment information
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true
  },
  
  // Comment content
  content: {
    text: {
      type: String,
      required: true,
      maxlength: 1000,
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
      thumbnail: String,
      duration: Number,
      size: Number,
      width: Number,
      height: Number
    }],
    hashtags: [{
      type: String,
      lowercase: true,
      trim: true
    }],
    mentions: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }]
  },

  // Comment relationships
  parentComment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  },
  
  replies: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  }],

  // Engagement metrics
  engagement: {
    likes: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      reaction: {
        type: String,
        enum: ['like', 'love', 'laugh', 'wow', 'sad', 'angry'],
        default: 'like'
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    }],
    replies: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment'
    }]
  },

  // Moderation
  moderation: {
    isApproved: {
      type: Boolean,
      default: true
    },
    moderationFlags: [{
      type: String,
      enum: ['inappropriate_content', 'spam', 'harassment', 'other']
    }],
    moderatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    moderatedAt: Date
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

// Indexes
commentSchema.index({ post: 1, createdAt: -1 });
commentSchema.index({ author: 1, createdAt: -1 });
commentSchema.index({ parentComment: 1, createdAt: -1 });
commentSchema.index({ 'content.hashtags': 1 });
commentSchema.index({ 'content.mentions': 1 });

// Virtual for engagement counts
commentSchema.virtual('engagementCounts').get(function() {
  return {
    likes: this.engagement.likes.length,
    replies: this.engagement.replies.length
  };
});

// Pre-save middleware
commentSchema.pre('save', function(next) {
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
      this.content.mentions = mentions.map(mention => mention.substring(1));
    }
  }
  
  next();
});

// Instance methods
commentSchema.methods.addLike = async function(userId, reaction = 'like') {
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

commentSchema.methods.removeLike = async function(userId) {
  this.engagement.likes = this.engagement.likes.filter(
    like => !like.user.equals(userId)
  );
  
  return await this.save();
};

commentSchema.methods.isLikedBy = function(userId) {
  return this.engagement.likes.some(like => like.user.equals(userId));
};

commentSchema.methods.getUserReaction = function(userId) {
  const like = this.engagement.likes.find(like => like.user.equals(userId));
  return like ? like.reaction : null;
};

// Static methods
commentSchema.statics.findByPost = function(postId, options = {}) {
  const { limit = 50, skip = 0, includeReplies = true } = options;
  
  const query = { post: postId };
  if (!includeReplies) {
    query.parentComment = { $exists: false };
  }
  
  return this.find(query)
    .populate('author', 'name handle avatar verified')
    .populate('replies')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
};

commentSchema.statics.findByAuthor = function(authorId, options = {}) {
  const { limit = 20, skip = 0 } = options;
  
  return this.find({ author: authorId })
    .populate('post', 'content.text type')
    .populate('author', 'name handle avatar verified')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
};

module.exports = mongoose.model('Comment', commentSchema);
