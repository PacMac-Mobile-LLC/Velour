const mongoose = require('mongoose');

const videoLikeSchema = new mongoose.Schema({
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
  }
}, {
  timestamps: true
});

// Compound index to ensure one like per user per video
videoLikeSchema.index({ video_id: 1, user_id: 1 }, { unique: true });

// Static method to toggle like
videoLikeSchema.statics.toggleLike = async function(videoId, userId) {
  const Video = mongoose.model('Video');
  const existingLike = await this.findOne({ video_id: videoId, user_id: userId });
  
  if (existingLike) {
    // Unlike: remove the like record and decrement video likes
    await this.deleteOne({ _id: existingLike._id });
    await Video.findByIdAndUpdate(videoId, { $inc: { likes: -1 } });
    return { isLiked: false };
  } else {
    // Like: create the like record and increment video likes
    await this.create({ video_id: videoId, user_id: userId });
    await Video.findByIdAndUpdate(videoId, { $inc: { likes: 1 } });
    return { isLiked: true };
  }
};

// Static method to check if user liked a video
videoLikeSchema.statics.isLikedByUser = async function(videoId, userId) {
  const like = await this.findOne({ video_id: videoId, user_id: userId });
  return !!like;
};

// Static method to get like count for a video
videoLikeSchema.statics.getLikeCount = async function(videoId) {
  return await this.countDocuments({ video_id: videoId });
};

module.exports = mongoose.model('VideoLike', videoLikeSchema);
