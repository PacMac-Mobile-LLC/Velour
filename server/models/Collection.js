const mongoose = require('mongoose');

const collectionSchema = new mongoose.Schema({
  name: {
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
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isPrivate: {
    type: Boolean,
    default: false
  },
  creators: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  tags: [{
    type: String,
    trim: true
  }],
  stats: {
    creatorCount: {
      type: Number,
      default: 0
    },
    viewCount: {
      type: Number,
      default: 0
    },
    likeCount: {
      type: Number,
      default: 0
    }
  },
  settings: {
    allowComments: {
      type: Boolean,
      default: true
    },
    allowSharing: {
      type: Boolean,
      default: true
    },
    autoAddNewContent: {
      type: Boolean,
      default: false
    }
  }
}, {
  timestamps: true
});

// Indexes
collectionSchema.index({ userId: 1 });
collectionSchema.index({ name: 'text', description: 'text' });
collectionSchema.index({ isPrivate: 1 });
collectionSchema.index({ 'creators.userId': 1 });

// Virtual for creator count
collectionSchema.virtual('creatorCount').get(function() {
  return this.creators.length;
});

// Methods
collectionSchema.methods.addCreator = function(userId) {
  if (!this.creators.some(creator => creator.userId.toString() === userId.toString())) {
    this.creators.push({ userId });
    this.stats.creatorCount = this.creators.length;
    return this.save();
  }
  return Promise.resolve(this);
};

collectionSchema.methods.removeCreator = function(userId) {
  this.creators = this.creators.filter(creator => creator.userId.toString() !== userId.toString());
  this.stats.creatorCount = this.creators.length;
  return this.save();
};

collectionSchema.methods.isCreatorInCollection = function(userId) {
  return this.creators.some(creator => creator.userId.toString() === userId.toString());
};

// Static methods
collectionSchema.statics.getUserCollections = function(userId, isPrivate = null) {
  let query = { userId };
  if (isPrivate !== null) {
    query.isPrivate = isPrivate;
  }
  return this.find(query).populate('creators.userId', 'name handle avatar');
};

collectionSchema.statics.getPublicCollections = function(page = 1, limit = 20) {
  return this.find({ isPrivate: false })
    .populate('userId', 'name handle avatar')
    .populate('creators.userId', 'name handle avatar')
    .sort({ 'stats.viewCount': -1, createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);
};

collectionSchema.statics.searchCollections = function(query, userId = null) {
  const searchQuery = {
    $or: [
      { name: { $regex: query, $options: 'i' } },
      { description: { $regex: query, $options: 'i' } },
      { tags: { $in: [new RegExp(query, 'i')] } }
    ]
  };

  if (userId) {
    searchQuery.$or.push({ userId });
  }

  return this.find(searchQuery)
    .populate('userId', 'name handle avatar')
    .populate('creators.userId', 'name handle avatar');
};

module.exports = mongoose.model('Collection', collectionSchema);
