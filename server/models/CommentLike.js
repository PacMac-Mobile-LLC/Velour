const mongoose = require('mongoose');

const commentLikeSchema = new mongoose.Schema({
  comment_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
    required: true,
    index: true
  },
  user_id: {
    type: String,
    required: true,
    index: true
  }
}, {
  timestamps: true
});

// Compound index to ensure one like per user per comment
commentLikeSchema.index({ comment_id: 1, user_id: 1 }, { unique: true });

// Static method to toggle like
commentLikeSchema.statics.toggleLike = async function(commentId, userId) {
  const Comment = mongoose.model('Comment');
  const existingLike = await this.findOne({ comment_id: commentId, user_id: userId });
  
  if (existingLike) {
    // Unlike: remove the like record and decrement comment likes
    await this.deleteOne({ _id: existingLike._id });
    await Comment.findByIdAndUpdate(commentId, { $inc: { likes: -1 } });
    return { isLiked: false };
  } else {
    // Like: create the like record and increment comment likes
    await this.create({ comment_id: commentId, user_id: userId });
    await Comment.findByIdAndUpdate(commentId, { $inc: { likes: 1 } });
    return { isLiked: true };
  }
};

// Static method to check if user liked a comment
commentLikeSchema.statics.isLikedByUser = async function(commentId, userId) {
  const like = await this.findOne({ comment_id: commentId, user_id: userId });
  return !!like;
};

// Static method to get like count for a comment
commentLikeSchema.statics.getLikeCount = async function(commentId) {
  return await this.countDocuments({ comment_id: commentId });
};

module.exports = mongoose.model('CommentLike', commentLikeSchema);
