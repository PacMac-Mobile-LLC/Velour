const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  subscriber: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  stripeSubscriptionId: {
    type: String,
    required: true,
    unique: true
  },
  stripeCustomerId: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'cancelled', 'past_due', 'unpaid'],
    required: true
  },
  plan: {
    type: String,
    enum: ['basic', 'premium', 'vip'],
    required: true
  },
  billing: {
    interval: {
      type: String,
      enum: ['month', 'year'],
      required: true
    },
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    currency: {
      type: String,
      default: 'usd'
    }
  },
  periods: {
    current: {
      start: {
        type: Date,
        required: true
      },
      end: {
        type: Date,
        required: true
      }
    },
    next: {
      start: Date,
      end: Date
    }
  },
  trial: {
    isTrial: {
      type: Boolean,
      default: false
    },
    trialEnd: Date
  },
  cancellation: {
    cancelledAt: Date,
    cancelAtPeriodEnd: {
      type: Boolean,
      default: false
    },
    cancellationReason: String
  },
  paymentHistory: [{
    stripePaymentIntentId: String,
    amount: Number,
    currency: String,
    status: String,
    paidAt: Date,
    description: String
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for efficient queries
subscriptionSchema.index({ subscriber: 1, creator: 1 });
subscriptionSchema.index({ creator: 1, status: 1 });
subscriptionSchema.index({ stripeSubscriptionId: 1 });

// Virtual for subscription status
subscriptionSchema.virtual('isValid').get(function() {
  return this.status === 'active' && this.isActive && 
         new Date() <= this.periods.current.end;
});

// Get subscription summary
subscriptionSchema.methods.getSummary = function() {
  return {
    _id: this._id,
    status: this.status,
    plan: this.plan,
    billing: this.billing,
    periods: this.periods,
    trial: this.trial,
    cancellation: this.cancellation,
    isValid: this.isValid,
    createdAt: this.createdAt
  };
};

module.exports = mongoose.model('Subscription', subscriptionSchema);
