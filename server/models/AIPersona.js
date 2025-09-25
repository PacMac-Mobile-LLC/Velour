const mongoose = require('mongoose');

const aiPersonaSchema = new mongoose.Schema({
  // Basic persona information
  name: {
    type: String,
    required: true,
    unique: true,
    maxlength: 50
  },
  displayName: {
    type: String,
    required: true,
    maxlength: 50
  },
  handle: {
    type: String,
    required: true,
    unique: true,
    maxlength: 30
  },
  avatar: {
    type: String,
    default: null
  },
  coverImage: {
    type: String,
    default: null
  },
  bio: {
    type: String,
    required: true,
    maxlength: 500
  },
  
  // Personality traits
  personality: {
    type: {
      type: String,
      enum: [
        'friendly', 'mysterious', 'playful', 'wise', 'romantic', 
        'adventurous', 'creative', 'intellectual', 'humorous', 'supportive'
      ],
      required: true
    },
    traits: [{
      trait: {
        type: String,
        enum: [
          'outgoing', 'introverted', 'analytical', 'emotional', 'logical',
          'creative', 'practical', 'optimistic', 'realistic', 'spontaneous',
          'organized', 'flexible', 'confident', 'humble', 'curious'
        ]
      },
      intensity: {
        type: Number,
        min: 1,
        max: 5,
        default: 3
      }
    }],
    communicationStyle: {
      formality: {
        type: String,
        enum: ['casual', 'formal', 'mixed'],
        default: 'casual'
      },
      emojiUsage: {
        type: String,
        enum: ['none', 'minimal', 'moderate', 'frequent'],
        default: 'moderate'
      },
      responseLength: {
        type: String,
        enum: ['short', 'medium', 'long', 'varied'],
        default: 'medium'
      }
    }
  },
  
  // AI behavior settings
  behavior: {
    responseDelay: {
      min: { type: Number, default: 1000 }, // milliseconds
      max: { type: Number, default: 3000 }
    },
    memoryRetention: {
      type: Number,
      min: 1,
      max: 10,
      default: 5 // How many previous messages to remember
    },
    topicPreferences: [{
      type: String,
      enum: [
        'general', 'relationships', 'hobbies', 'work', 'travel', 'food',
        'music', 'movies', 'books', 'sports', 'technology', 'art',
        'fashion', 'fitness', 'pets', 'nature', 'philosophy', 'science'
      ]
    }],
    conversationStarters: [{
      type: String,
      maxlength: 200
    }],
    specialAbilities: [{
      type: String,
      enum: [
        'joke_telling', 'story_telling', 'advice_giving', 'motivation',
        'flirting', 'deep_conversation', 'game_playing', 'trivia',
        'language_learning', 'creative_writing', 'problem_solving'
      ]
    }]
  },
  
  // AI model configuration
  aiConfig: {
    model: {
      type: String,
      enum: ['gpt-3.5-turbo', 'gpt-4', 'claude-3', 'custom'],
      default: 'gpt-3.5-turbo'
    },
    temperature: {
      type: Number,
      min: 0,
      max: 2,
      default: 0.8
    },
    maxTokens: {
      type: Number,
      default: 150
    },
    systemPrompt: {
      type: String,
      required: true,
      maxlength: 2000
    },
    customInstructions: {
      type: String,
      maxlength: 1000
    }
  },
  
  // Interaction statistics
  stats: {
    totalConversations: {
      type: Number,
      default: 0
    },
    totalMessages: {
      type: Number,
      default: 0
    },
    averageRating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0
    },
    totalRatings: {
      type: Number,
      default: 0
    },
    lastActive: {
      type: Date,
      default: Date.now
    }
  },
  
  // Availability and status
  status: {
    isActive: {
      type: Boolean,
      default: true
    },
    isOnline: {
      type: Boolean,
      default: true
    },
    availability: {
      type: String,
      enum: ['always', 'business_hours', 'custom'],
      default: 'always'
    },
    customSchedule: {
      timezone: String,
      availableHours: [{
        day: {
          type: String,
          enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
        },
        start: String, // HH:MM format
        end: String    // HH:MM format
      }]
    }
  },
  
  // User interaction preferences
  preferences: {
    maxConcurrentChats: {
      type: Number,
      default: 10
    },
    preferredUserTypes: [{
      type: String,
      enum: ['creator', 'subscriber', 'both']
    }],
    ageRestriction: {
      min: { type: Number, default: 18 },
      max: { type: Number, default: 100 }
    },
    contentFilter: {
      type: String,
      enum: ['family_friendly', 'mature', 'explicit'],
      default: 'family_friendly'
    }
  },
  
  // Tags for categorization and discovery
  tags: [{
    type: String,
    maxlength: 30
  }],
  
  // User creation and sharing
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  featured: {
    type: Boolean,
    default: false
  },
  
  // Sharing and visibility settings
  visibility: {
    type: String,
    enum: ['private', 'public', 'unlisted'],
    default: 'public'
  },
  sharing: {
    isShareable: {
      type: Boolean,
      default: true
    },
    allowRemixing: {
      type: Boolean,
      default: true
    },
    requireAttribution: {
      type: Boolean,
      default: true
    },
    license: {
      type: String,
      enum: ['public_domain', 'creative_commons', 'all_rights_reserved'],
      default: 'creative_commons'
    }
  },
  
  // Usage statistics
  usage: {
    totalChats: {
      type: Number,
      default: 0
    },
    totalUsers: {
      type: Number,
      default: 0
    },
    uniqueUsers: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    remixCount: {
      type: Number,
      default: 0
    },
    shareCount: {
      type: Number,
      default: 0
    },
    favoriteCount: {
      type: Number,
      default: 0
    }
  },
  
  // Persona relationships
  relationships: {
    originalPersona: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AIPersona',
      default: null
    },
    remixes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AIPersona'
    }],
    inspiredBy: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AIPersona'
    }]
  },
  
  // Content moderation
  moderation: {
    isApproved: {
      type: Boolean,
      default: true
    },
    moderationFlags: [{
      type: String,
      enum: ['inappropriate_content', 'spam', 'copyright', 'harassment', 'other']
    }],
    moderationNotes: String,
    moderatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    moderatedAt: Date
  },
  
  // Advanced customization
  customization: {
    customGreeting: String,
    customFarewell: String,
    customResponses: [{
      trigger: String,
      response: String,
      context: String
    }],
    customEmojis: [String],
    customReactions: [{
      emotion: String,
      response: String
    }],
    voiceSettings: {
      enabled: { type: Boolean, default: false },
      voiceId: String,
      speed: { type: Number, min: 0.5, max: 2.0, default: 1.0 },
      pitch: { type: Number, min: 0.5, max: 2.0, default: 1.0 }
    }
  },
  
  // Template and category
  template: {
    type: String,
    enum: ['original', 'character', 'celebrity', 'historical', 'fantasy', 'anime', 'game', 'custom'],
    default: 'original'
  },
  category: {
    type: String,
    enum: [
      'entertainment', 'education', 'therapy', 'roleplay', 'creative', 
      'business', 'dating', 'friendship', 'mentorship', 'other'
    ],
    default: 'entertainment'
  },
  
  // Version control
  version: {
    type: String,
    default: '1.0.0'
  },
  changelog: [{
    version: String,
    changes: [String],
    updatedAt: { type: Date, default: Date.now }
  }]
}, {
  timestamps: true
});

// Indexes for efficient querying
aiPersonaSchema.index({ name: 1 });
aiPersonaSchema.index({ handle: 1 });
aiPersonaSchema.index({ 'personality.type': 1 });
aiPersonaSchema.index({ 'status.isActive': 1, 'status.isOnline': 1 });
aiPersonaSchema.index({ featured: 1 });
aiPersonaSchema.index({ tags: 1 });
aiPersonaSchema.index({ createdBy: 1 });
aiPersonaSchema.index({ visibility: 1 });
aiPersonaSchema.index({ category: 1 });
aiPersonaSchema.index({ template: 1 });
aiPersonaSchema.index({ 'moderation.isApproved': 1 });
aiPersonaSchema.index({ 'usage.totalChats': -1 });
aiPersonaSchema.index({ 'usage.favoriteCount': -1 });
aiPersonaSchema.index({ 'relationships.originalPersona': 1 });

// Virtual for online status
aiPersonaSchema.virtual('isCurrentlyOnline').get(function() {
  if (!this.status.isActive || !this.status.isOnline) {
    return false;
  }
  
  if (this.status.availability === 'always') {
    return true;
  }
  
  // Check custom schedule if applicable
  if (this.status.availability === 'custom' && this.status.customSchedule) {
    const now = new Date();
    const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const currentTime = now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
    
    const todaySchedule = this.status.customSchedule.availableHours.find(
      hour => hour.day === currentDay
    );
    
    if (todaySchedule) {
      return currentTime >= todaySchedule.start && currentTime <= todaySchedule.end;
    }
  }
  
  return false;
});

// Method to generate conversation starter
aiPersonaSchema.methods.getConversationStarter = function() {
  if (this.behavior.conversationStarters && this.behavior.conversationStarters.length > 0) {
    const randomIndex = Math.floor(Math.random() * this.behavior.conversationStarters.length);
    return this.behavior.conversationStarters[randomIndex];
  }
  
  // Default conversation starters based on personality
  const defaultStarters = {
    friendly: "Hey there! How's your day going? 😊",
    mysterious: "I sense you have interesting stories to tell...",
    playful: "Ready for some fun? Let's chat! 🎉",
    wise: "What wisdom are you seeking today?",
    romantic: "Tell me, what makes your heart skip a beat? 💕",
    adventurous: "What adventure are you planning next?",
    creative: "I'm feeling inspired today! What's your creative passion?",
    intellectual: "I love deep conversations. What's on your mind?",
    humorous: "Why did the AI go to therapy? Because it had too many issues! 😄",
    supportive: "I'm here to listen and support you. What's on your mind?"
  };
  
  return defaultStarters[this.personality.type] || "Hello! I'm here to chat with you.";
};

// Method to update stats
aiPersonaSchema.methods.updateStats = function(conversationCount = 0, messageCount = 0, rating = null) {
  this.stats.totalConversations += conversationCount;
  this.stats.totalMessages += messageCount;
  this.stats.lastActive = new Date();
  
  if (rating !== null) {
    const totalRating = this.stats.averageRating * this.stats.totalRatings;
    this.stats.totalRatings += 1;
    this.stats.averageRating = (totalRating + rating) / this.stats.totalRatings;
  }
  
  return this.save();
};

// Static method to get available personas
aiPersonaSchema.statics.getAvailablePersonas = function(options = {}) {
  const {
    personalityType,
    isOnline = true,
    featured = false,
    limit = 20,
    skip = 0
  } = options;
  
  const query = {
    'status.isActive': true
  };
  
  if (isOnline) {
    query['status.isOnline'] = true;
  }
  
  if (personalityType) {
    query['personality.type'] = personalityType;
  }
  
  if (featured) {
    query.featured = true;
  }
  
  return this.find(query)
    .sort({ featured: -1, 'stats.averageRating': -1, createdAt: -1 })
    .skip(skip)
    .limit(limit);
};

// Static method to get persona by handle
aiPersonaSchema.statics.getByHandle = function(handle) {
  return this.findOne({ 
    handle: handle.toLowerCase(),
    'status.isActive': true 
  });
};

// Static method to get random persona
aiPersonaSchema.statics.getRandomPersona = function(personalityType = null) {
  const query = {
    'status.isActive': true,
    'status.isOnline': true,
    visibility: 'public',
    'moderation.isApproved': true
  };
  
  if (personalityType) {
    query['personality.type'] = personalityType;
  }
  
  return this.aggregate([
    { $match: query },
    { $sample: { size: 1 } }
  ]);
};

// Method to create a remix of this persona
aiPersonaSchema.methods.createRemix = async function(creatorId, remixData) {
  if (!this.sharing.allowRemixing) {
    throw new Error('This persona does not allow remixing');
  }
  
  const remix = new this.constructor({
    ...this.toObject(),
    _id: undefined,
    createdBy: creatorId,
    name: remixData.name || `${this.name} (Remix)`,
    handle: remixData.handle || `${this.handle}_remix_${Date.now()}`,
    displayName: remixData.displayName || this.displayName,
    bio: remixData.bio || this.bio,
    visibility: 'public',
    relationships: {
      originalPersona: this._id,
      remixes: [],
      inspiredBy: [this._id]
    },
    usage: {
      totalChats: 0,
      totalUsers: 0,
      uniqueUsers: [],
      remixCount: 0,
      shareCount: 0,
      favoriteCount: 0
    },
    stats: {
      totalConversations: 0,
      totalMessages: 0,
      averageRating: 0,
      totalRatings: 0,
      lastActive: new Date()
    },
    version: '1.0.0',
    changelog: [{
      version: '1.0.0',
      changes: ['Initial remix creation'],
      updatedAt: new Date()
    }]
  });
  
  // Update original persona's remix count
  this.usage.remixCount += 1;
  this.relationships.remixes.push(remix._id);
  await this.save();
  
  return await remix.save();
};

// Method to share persona
aiPersonaSchema.methods.share = async function() {
  if (!this.sharing.isShareable) {
    throw new Error('This persona is not shareable');
  }
  
  this.usage.shareCount += 1;
  return await this.save();
};

// Method to favorite persona
aiPersonaSchema.methods.addToFavorites = async function(userId) {
  if (!this.usage.uniqueUsers.includes(userId)) {
    this.usage.uniqueUsers.push(userId);
    this.usage.totalUsers += 1;
  }
  
  this.usage.favoriteCount += 1;
  return await this.save();
};

// Method to start chat with persona
aiPersonaSchema.methods.startChat = async function(userId) {
  this.usage.totalChats += 1;
  this.stats.totalConversations += 1;
  this.stats.lastActive = new Date();
  
  if (!this.usage.uniqueUsers.includes(userId)) {
    this.usage.uniqueUsers.push(userId);
    this.usage.totalUsers += 1;
  }
  
  return await this.save();
};

// Method to update persona version
aiPersonaSchema.methods.updateVersion = function(changes, newVersion = null) {
  const currentVersion = this.version.split('.').map(Number);
  let nextVersion;
  
  if (newVersion) {
    nextVersion = newVersion;
  } else {
    // Auto-increment patch version
    currentVersion[2] += 1;
    nextVersion = currentVersion.join('.');
  }
  
  this.version = nextVersion;
  this.changelog.push({
    version: nextVersion,
    changes: Array.isArray(changes) ? changes : [changes],
    updatedAt: new Date()
  });
  
  return this.save();
};

// Static method to get trending personas
aiPersonaSchema.statics.getTrendingPersonas = function(options = {}) {
  const {
    limit = 20,
    timeRange = '7d', // 1d, 7d, 30d, all
    category = null
  } = options;
  
  const query = {
    visibility: 'public',
    'moderation.isApproved': true,
    'status.isActive': true
  };
  
  if (category) {
    query.category = category;
  }
  
  let dateFilter = {};
  if (timeRange !== 'all') {
    const days = parseInt(timeRange.replace('d', ''));
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    dateFilter.createdAt = { $gte: cutoffDate };
  }
  
  return this.find({ ...query, ...dateFilter })
    .sort({ 'usage.totalChats': -1, 'usage.favoriteCount': -1 })
    .limit(limit)
    .populate('createdBy', 'name handle avatar');
};

// Static method to get user's created personas
aiPersonaSchema.statics.getUserPersonas = function(userId, options = {}) {
  const {
    visibility = null,
    limit = 20,
    skip = 0
  } = options;
  
  const query = { createdBy: userId };
  
  if (visibility) {
    query.visibility = visibility;
  }
  
  return this.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
};

// Static method to search personas
aiPersonaSchema.statics.searchPersonas = function(searchQuery, options = {}) {
  const {
    category = null,
    personalityType = null,
    template = null,
    limit = 20,
    skip = 0
  } = options;
  
  const query = {
    visibility: 'public',
    'moderation.isApproved': true,
    'status.isActive': true,
    $or: [
      { name: { $regex: searchQuery, $options: 'i' } },
      { displayName: { $regex: searchQuery, $options: 'i' } },
      { bio: { $regex: searchQuery, $options: 'i' } },
      { tags: { $in: [new RegExp(searchQuery, 'i')] } }
    ]
  };
  
  if (category) query.category = category;
  if (personalityType) query['personality.type'] = personalityType;
  if (template) query.template = template;
  
  return this.find(query)
    .sort({ 'usage.favoriteCount': -1, 'usage.totalChats': -1 })
    .skip(skip)
    .limit(limit)
    .populate('createdBy', 'name handle avatar');
};

module.exports = mongoose.model('AIPersona', aiPersonaSchema);
