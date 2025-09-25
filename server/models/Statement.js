const mongoose = require('mongoose');

const statementSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['earnings', 'payout', 'refund', 'chargeback', 'fee', 'bonus'],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'USD'
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  reference: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'cancelled'],
    default: 'pending'
  },
  period: {
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    }
  },
  breakdown: {
    subscriptions: {
      count: { type: Number, default: 0 },
      amount: { type: Number, default: 0 }
    },
    payPerView: {
      count: { type: Number, default: 0 },
      amount: { type: Number, default: 0 }
    },
    tips: {
      count: { type: Number, default: 0 },
      amount: { type: Number, default: 0 }
    },
    fees: {
      platform: { type: Number, default: 0 },
      processing: { type: Number, default: 0 },
      total: { type: Number, default: 0 }
    },
    netAmount: { type: Number, default: 0 }
  },
  payout: {
    method: {
      type: String,
      enum: ['bank_transfer', 'paypal', 'stripe', 'crypto'],
      default: 'stripe'
    },
    accountId: String,
    transactionId: String,
    processedAt: Date,
    fees: {
      type: Number,
      default: 0
    }
  },
  metadata: {
    source: String,
    campaign: String,
    tags: [String],
    notes: String
  }
}, {
  timestamps: true
});

// Indexes
statementSchema.index({ userId: 1 });
statementSchema.index({ type: 1 });
statementSchema.index({ status: 1 });
statementSchema.index({ 'period.startDate': 1, 'period.endDate': 1 });
statementSchema.index({ createdAt: -1 });
statementSchema.index({ amount: -1 });

// Virtual for formatted amount
statementSchema.virtual('amountFormatted').get(function() {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: this.currency
  }).format(this.amount);
});

// Virtual for period duration
statementSchema.virtual('periodDuration').get(function() {
  const start = this.period.startDate;
  const end = this.period.endDate;
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

// Methods
statementSchema.methods.calculateNetAmount = function() {
  const totalFees = this.breakdown.fees.total || 0;
  this.breakdown.netAmount = this.amount - totalFees;
  return this.save();
};

statementSchema.methods.markAsCompleted = function(transactionId = null) {
  this.status = 'completed';
  this.payout.processedAt = new Date();
  if (transactionId) {
    this.payout.transactionId = transactionId;
  }
  return this.save();
};

statementSchema.methods.markAsFailed = function() {
  this.status = 'failed';
  return this.save();
};

// Static methods
statementSchema.statics.getUserStatements = function(userId, page = 1, limit = 20, type = null) {
  let query = { userId };
  if (type) {
    query.type = type;
  }
  
  return this.find(query)
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);
};

statementSchema.statics.getEarningsSummary = function(userId, startDate, endDate) {
  return this.aggregate([
    {
      $match: {
        userId: mongoose.Types.ObjectId(userId),
        type: 'earnings',
        'period.startDate': { $gte: startDate },
        'period.endDate': { $lte: endDate }
      }
    },
    {
      $group: {
        _id: null,
        totalEarnings: { $sum: '$amount' },
        totalFees: { $sum: '$breakdown.fees.total' },
        netEarnings: { $sum: '$breakdown.netAmount' },
        statementCount: { $sum: 1 }
      }
    }
  ]);
};

statementSchema.statics.getMonthlyEarnings = function(userId, year) {
  return this.aggregate([
    {
      $match: {
        userId: mongoose.Types.ObjectId(userId),
        type: 'earnings',
        status: 'completed'
      }
    },
    {
      $addFields: {
        month: { $month: '$period.endDate' },
        year: { $year: '$period.endDate' }
      }
    },
    {
      $match: { year: year }
    },
    {
      $group: {
        _id: '$month',
        totalEarnings: { $sum: '$amount' },
        netEarnings: { $sum: '$breakdown.netAmount' },
        statementCount: { $sum: 1 }
      }
    },
    {
      $sort: { _id: 1 }
    }
  ]);
};

statementSchema.statics.getTopEarningPeriods = function(userId, limit = 10) {
  return this.find({
    userId: mongoose.Types.ObjectId(userId),
    type: 'earnings',
    status: 'completed'
  })
  .sort({ amount: -1 })
  .limit(limit)
  .select('amount period description breakdown.netAmount');
};

module.exports = mongoose.model('Statement', statementSchema);
