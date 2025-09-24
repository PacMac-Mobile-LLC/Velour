const mongoose = require('mongoose');

const queueSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: '',
    trim: true
  },
  type: {
    type: String,
    enum: ['live', 'video', 'gallery', 'audio'],
    required: true
  },
  status: {
    type: String,
    enum: ['scheduled', 'live', 'completed', 'cancelled'],
    default: 'scheduled'
  },
  scheduledDate: {
    type: Date,
    required: true
  },
  scheduledTime: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    default: 60 // in minutes
  },
  isPrivate: {
    type: Boolean,
    default: false
  },
  price: {
    type: Number,
    default: 0
  },
  expectedViewers: {
    type: Number,
    default: 0
  },
  actualViewers: {
    type: Number,
    default: 0
  },
  tags: [{
    type: String,
    trim: true
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  startedAt: {
    type: Date,
    default: null
  },
  completedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Index for efficient queries
queueSchema.index({ userId: 1, scheduledDate: -1 });
queueSchema.index({ status: 1 });
queueSchema.index({ type: 1 });
queueSchema.index({ scheduledDate: 1 });

const Queue = mongoose.model('Queue', queueSchema);

module.exports = Queue;
