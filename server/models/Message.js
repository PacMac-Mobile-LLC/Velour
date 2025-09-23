const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: {
      type: String,
      enum: ['text', 'image', 'video', 'audio'],
      default: 'text'
    },
    text: String,
    media: {
      url: String,
      thumbnail: String,
      duration: Number,
      size: Number
    }
  },
  isRead: {
    type: Boolean,
    default: false
  },
  readAt: Date,
  isDeleted: {
    type: Boolean,
    default: false
  },
  deletedAt: Date,
  replyTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  },
  reactions: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    emoji: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  isPinned: {
    type: Boolean,
    default: false
  },
  metadata: {
    isSystemMessage: {
      type: Boolean,
      default: false
    },
    systemMessageType: {
      type: String,
      enum: ['subscription_started', 'subscription_ended', 'payment_received', 'content_shared']
    }
  }
}, {
  timestamps: true
});

// Index for efficient queries
messageSchema.index({ sender: 1, recipient: 1, createdAt: -1 });
messageSchema.index({ recipient: 1, isRead: 1 });
messageSchema.index({ createdAt: -1 });

// Get message data for display
messageSchema.methods.getMessageData = function() {
  return {
    _id: this._id,
    sender: this.sender,
    recipient: this.recipient,
    content: this.content,
    isRead: this.isRead,
    readAt: this.readAt,
    replyTo: this.replyTo,
    reactions: this.reactions,
    isPinned: this.isPinned,
    metadata: this.metadata,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
};

module.exports = mongoose.model('Message', messageSchema);
