const mongoose = require('mongoose');

const vaultSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  type: {
    type: String,
    enum: ['image', 'video', 'audio', 'document', 'other'],
    required: true
  },
  fileUrl: {
    type: String,
    required: true
  },
  fileName: {
    type: String,
    required: true
  },
  fileSize: {
    type: Number,
    required: true
  },
  mimeType: {
    type: String,
    required: true
  },
  thumbnailUrl: {
    type: String
  },
  duration: {
    type: Number // For video/audio files in seconds
  },
  dimensions: {
    width: Number,
    height: Number
  },
  tags: [{
    type: String,
    trim: true
  }],
  isPrivate: {
    type: Boolean,
    default: true
  },
  isFavorite: {
    type: Boolean,
    default: false
  },
  metadata: {
    camera: String,
    location: String,
    dateTaken: Date,
    software: String,
    custom: mongoose.Schema.Types.Mixed
  },
  stats: {
    viewCount: {
      type: Number,
      default: 0
    },
    downloadCount: {
      type: Number,
      default: 0
    },
    shareCount: {
      type: Number,
      default: 0
    }
  },
  collections: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Collection'
  }],
  permissions: {
    canView: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    canDownload: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    canShare: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }]
  }
}, {
  timestamps: true
});

// Indexes
vaultSchema.index({ userId: 1 });
vaultSchema.index({ type: 1 });
vaultSchema.index({ isPrivate: 1 });
vaultSchema.index({ isFavorite: 1 });
vaultSchema.index({ title: 'text', description: 'text', tags: 'text' });
vaultSchema.index({ createdAt: -1 });
vaultSchema.index({ 'stats.viewCount': -1 });

// Virtual for file size in human readable format
vaultSchema.virtual('fileSizeFormatted').get(function() {
  const bytes = this.fileSize;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  if (bytes === 0) return '0 Bytes';
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
});

// Virtual for duration in human readable format
vaultSchema.virtual('durationFormatted').get(function() {
  if (!this.duration) return null;
  const hours = Math.floor(this.duration / 3600);
  const minutes = Math.floor((this.duration % 3600) / 60);
  const seconds = this.duration % 60;
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
});

// Methods
vaultSchema.methods.incrementViewCount = function() {
  this.stats.viewCount += 1;
  return this.save();
};

vaultSchema.methods.incrementDownloadCount = function() {
  this.stats.downloadCount += 1;
  return this.save();
};

vaultSchema.methods.incrementShareCount = function() {
  this.stats.shareCount += 1;
  return this.save();
};

vaultSchema.methods.addToCollection = function(collectionId) {
  if (!this.collections.includes(collectionId)) {
    this.collections.push(collectionId);
    return this.save();
  }
  return Promise.resolve(this);
};

vaultSchema.methods.removeFromCollection = function(collectionId) {
  this.collections = this.collections.filter(id => id.toString() !== collectionId.toString());
  return this.save();
};

vaultSchema.methods.toggleFavorite = function() {
  this.isFavorite = !this.isFavorite;
  return this.save();
};

// Static methods
vaultSchema.statics.getUserVault = function(userId, type = 'all', page = 1, limit = 20) {
  let query = { userId };
  if (type !== 'all') {
    query.type = type;
  }
  
  return this.find(query)
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .populate('collections', 'name');
};

vaultSchema.statics.getFavorites = function(userId, page = 1, limit = 20) {
  return this.find({ userId, isFavorite: true })
    .sort({ updatedAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .populate('collections', 'name');
};

vaultSchema.statics.searchVault = function(userId, query, type = 'all') {
  const searchQuery = {
    userId,
    $or: [
      { title: { $regex: query, $options: 'i' } },
      { description: { $regex: query, $options: 'i' } },
      { tags: { $in: [new RegExp(query, 'i')] } }
    ]
  };

  if (type !== 'all') {
    searchQuery.type = type;
  }

  return this.find(searchQuery)
    .sort({ createdAt: -1 })
    .populate('collections', 'name');
};

vaultSchema.statics.getStorageStats = function(userId) {
  return this.aggregate([
    { $match: { userId: mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: '$type',
        count: { $sum: 1 },
        totalSize: { $sum: '$fileSize' }
      }
    }
  ]);
};

module.exports = mongoose.model('Vault', vaultSchema);
