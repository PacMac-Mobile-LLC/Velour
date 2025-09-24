const mongoose = require('mongoose');

const verificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  diditId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  status: {
    type: String,
    enum: ['pending', 'verified', 'failed', 'expired'],
    default: 'pending',
    required: true,
    index: true
  },
  verificationUrl: {
    type: String,
    required: true
  },
  userEmail: {
    type: String,
    required: true
  },
  userData: {
    name: String,
    email: String,
    metadata: mongoose.Schema.Types.Mixed
  },
  verificationData: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  },
  webhookData: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  },
  failureReason: {
    type: String,
    default: null
  },
  metadata: {
    platform: {
      type: String,
      default: 'velour'
    },
    initiatedAt: {
      type: Date,
      default: Date.now
    },
    userAgent: String,
    ipAddress: String
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  verifiedAt: {
    type: Date,
    default: null
  },
  failedAt: {
    type: Date,
    default: null
  },
  expiredAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Indexes for better performance
verificationSchema.index({ userId: 1, status: 1 });
verificationSchema.index({ diditId: 1 });
verificationSchema.index({ createdAt: -1 });
verificationSchema.index({ status: 1, createdAt: -1 });

// Update the updatedAt field before saving
verificationSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Virtual for verification age
verificationSchema.virtual('age').get(function() {
  return Date.now() - this.createdAt.getTime();
});

// Virtual for isExpired
verificationSchema.virtual('isExpired').get(function() {
  const maxAge = 24 * 60 * 60 * 1000; // 24 hours
  return this.age > maxAge && this.status === 'pending';
});

// Method to check if verification is valid
verificationSchema.methods.isValid = function() {
  return this.status === 'verified' && !this.isExpired;
};

// Method to get status display
verificationSchema.methods.getStatusDisplay = function() {
  switch (this.status) {
    case 'verified':
      return '✅ Verified';
    case 'pending':
      return '⏳ Pending';
    case 'failed':
      return '❌ Failed';
    case 'expired':
      return '⏰ Expired';
    default:
      return '❓ Unknown';
  }
};

// Static method to get verification stats
verificationSchema.statics.getStats = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);

  const result = {
    total: 0,
    verified: 0,
    pending: 0,
    failed: 0,
    expired: 0
  };

  stats.forEach(stat => {
    result[stat._id] = stat.count;
    result.total += stat.count;
  });

  return result;
};

// Static method to clean up expired verifications
verificationSchema.statics.cleanupExpired = async function() {
  const maxAge = 24 * 60 * 60 * 1000; // 24 hours
  const cutoffDate = new Date(Date.now() - maxAge);

  const result = await this.updateMany(
    {
      status: 'pending',
      createdAt: { $lt: cutoffDate }
    },
    {
      status: 'expired',
      expiredAt: new Date()
    }
  );

  return result;
};

module.exports = mongoose.model('Verification', verificationSchema);
