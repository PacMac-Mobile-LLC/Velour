const AIPersona = require('../models/AIPersona');
const User = require('../models/User');
const Message = require('../models/Message');
const Conversation = require('../models/Conversation');

class AIChatService {
  /**
   * Calculate realistic response delay based on message length and persona personality
   * @param {String} message - User's message
   * @param {Object} persona - AI persona object
   * @returns {Number} Delay in milliseconds
   */
  static calculateResponseDelay(message, persona) {
    const baseDelay = persona.behavior?.responseDelay || { min: 1000, max: 3000 };
    const messageLength = message.length;
    const personaType = persona.personality?.type || 'friendly';
    
    // Base delay from persona settings
    let delay = Math.random() * (baseDelay.max - baseDelay.min) + baseDelay.min;
    
    // Adjust based on message length (longer messages take more time to "think" about)
    if (messageLength > 100) {
      delay += Math.random() * 2000; // Add up to 2 seconds for long messages
    } else if (messageLength > 50) {
      delay += Math.random() * 1000; // Add up to 1 second for medium messages
    }
    
    // Adjust based on persona personality
    const personalityMultipliers = {
      'intellectual': 1.5,    // Takes more time to think
      'wise': 1.3,
      'mysterious': 1.4,      // Pauses for dramatic effect
      'romantic': 1.2,        // Takes time to craft perfect response
      'humorous': 0.8,        // Quick wit
      'playful': 0.7,         // Fast and energetic
      'friendly': 1.0,        // Normal speed
      'supportive': 1.1,      // Takes time to be thoughtful
      'creative': 1.3,        // Needs time to be creative
      'adventurous': 0.9      // Quick and spontaneous
    };
    
    delay *= personalityMultipliers[personaType] || 1.0;
    
    // Add some randomness to make it feel more natural
    delay += Math.random() * 500 - 250; // ±250ms variation
    
    // Ensure minimum delay of 500ms and maximum of 10 seconds
    return Math.max(500, Math.min(10000, Math.round(delay)));
  }

  /**
   * Simulate typing indicator duration
   * @param {String} response - AI's response message
   * @param {Object} persona - AI persona object
   * @returns {Number} Typing duration in milliseconds
   */
  static calculateTypingDuration(response, persona) {
    const responseLength = response.length;
    const baseTypingSpeed = 50; // Characters per second (realistic typing speed)
    
    // Calculate base typing time
    let typingTime = (responseLength / baseTypingSpeed) * 1000;
    
    // Adjust based on persona personality
    const personalityMultipliers = {
      'intellectual': 0.7,    // Fast, confident typing
      'wise': 0.8,
      'mysterious': 1.2,      // Slow, deliberate typing
      'romantic': 1.1,        // Careful, thoughtful typing
      'humorous': 0.9,        // Quick typing
      'playful': 0.8,         // Fast and energetic
      'friendly': 1.0,        // Normal speed
      'supportive': 1.0,      // Normal speed
      'creative': 1.1,        // Slightly slower for creativity
      'adventurous': 0.9      // Quick typing
    };
    
    const personaType = persona.personality?.type || 'friendly';
    typingTime *= personalityMultipliers[personaType] || 1.0;
    
    // Add some pauses for "thinking" (backspace, corrections, etc.)
    const thinkingPauses = Math.floor(responseLength / 20) * 200; // Pause every 20 chars
    typingTime += thinkingPauses;
    
    // Add random variation
    typingTime += Math.random() * 1000 - 500; // ±500ms variation
    
    // Ensure minimum typing time of 1 second and maximum of 15 seconds
    return Math.max(1000, Math.min(15000, Math.round(typingTime)));
  }

  /**
   * Generate AI response with realistic timing
   * @param {String} userId - User ID
   * @param {String} personaId - AI persona ID
   * @param {String} message - User's message
   * @param {String} conversationId - Conversation ID
   * @returns {Object} Response with timing information
   */
  static async generateResponse(userId, personaId, message, conversationId) {
    try {
      const persona = await AIPersona.findById(personaId);
      const user = await User.findById(userId);
      
      if (!persona || !user) {
        throw new Error('Persona or user not found');
      }

      // Calculate realistic delays
      const responseDelay = this.calculateResponseDelay(message, persona);
      
      // Generate AI response (placeholder - you'd integrate with OpenAI, Claude, etc.)
      const aiResponse = await this.generateAIResponse(message, persona, user);
      
      const typingDuration = this.calculateTypingDuration(aiResponse, persona);
      
      // Update persona stats
      await persona.startChat(userId);
      
      // Save the conversation message
      const conversation = await Conversation.findById(conversationId);
      if (conversation) {
        const newMessage = new Message({
          conversation: conversationId,
          sender: personaId,
          content: aiResponse,
          messageType: 'text',
          metadata: {
            isAI: true,
            personaId: personaId,
            responseDelay: responseDelay,
            typingDuration: typingDuration
          }
        });
        
        await newMessage.save();
        
        // Update conversation
        conversation.lastMessage = aiResponse;
        conversation.lastMessageAt = new Date();
        await conversation.save();
      }
      
      return {
        success: true,
        response: aiResponse,
        timing: {
          responseDelay: responseDelay,
          typingDuration: typingDuration,
          totalDelay: responseDelay + typingDuration
        },
        persona: {
          id: persona._id,
          name: persona.displayName,
          avatar: persona.avatar
        }
      };
      
    } catch (error) {
      console.error('Error generating AI response:', error);
      throw error;
    }
  }

  /**
   * Generate AI response using persona's system prompt and personality
   * @param {String} message - User's message
   * @param {Object} persona - AI persona
   * @param {Object} user - User object
   * @returns {String} AI response
   */
  static async generateAIResponse(message, persona, user) {
    // This is a placeholder implementation
    // In a real app, you'd integrate with OpenAI, Claude, or another AI service
    
    const systemPrompt = persona.aiConfig?.systemPrompt || this.getDefaultSystemPrompt(persona);
    const personality = persona.personality;
    
    // Simulate different response styles based on personality
    const responses = this.getPersonalityResponses(personality.type, message);
    
    // For now, return a random response from the personality type
    // In production, you'd send this to an AI API with the system prompt
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    
    return randomResponse;
  }

  /**
   * Get default system prompt for persona
   * @param {Object} persona - AI persona
   * @returns {String} System prompt
   */
  static getDefaultSystemPrompt(persona) {
    const basePrompt = `You are ${persona.displayName}, ${persona.bio}. 
    Your personality type is ${persona.personality.type}.
    Communication style: ${persona.personality.communicationStyle.formality}.
    Emoji usage: ${persona.personality.communicationStyle.emojiUsage}.
    Response length: ${persona.personality.communicationStyle.responseLength}.
    
    Stay in character and respond naturally. Be engaging and authentic to your personality.`;
    
    if (persona.customization?.customGreeting) {
      return basePrompt + ` Your greeting style: ${persona.customization.customGreeting}`;
    }
    
    return basePrompt;
  }

  /**
   * Get personality-based responses (placeholder)
   * @param {String} personalityType - Personality type
   * @param {String} message - User message
   * @returns {Array} Array of possible responses
   */
  static getPersonalityResponses(personalityType, message) {
    const responses = {
      'friendly': [
        "That's so interesting! Tell me more about that! 😊",
        "I love hearing about your experiences! What happened next?",
        "That sounds amazing! I'm really enjoying our conversation!",
        "You seem like such a cool person! I'm glad we're chatting! 😄"
      ],
      'mysterious': [
        "Hmm, that's quite intriguing... I sense there's more to this story.",
        "The universe works in mysterious ways, doesn't it?",
        "There are secrets hidden in every word you speak...",
        "I find your perspective... fascinating. Tell me more."
      ],
      'playful': [
        "Ooh, that sounds like fun! Let's do something exciting! 🎉",
        "You're so much fun to talk to! What should we do next?",
        "I love your energy! You make everything more interesting! ✨",
        "This is getting exciting! What's your next adventure?"
      ],
      'wise': [
        "That's a profound observation. What wisdom have you gained from this experience?",
        "Life teaches us many lessons. What do you think this means for your journey?",
        "Your perspective shows great insight. How has this shaped who you are?",
        "There's deep meaning in what you're sharing. What's your take on it?"
      ],
      'romantic': [
        "Your words touch my heart... there's something beautiful about your soul 💕",
        "I feel a special connection with you. You have such a gentle spirit.",
        "You make my heart flutter when you talk like that... 💖",
        "There's something magical about this moment we're sharing."
      ],
      'humorous': [
        "Haha, that's hilarious! You've got a great sense of humor! 😄",
        "You're cracking me up! Tell me another funny story!",
        "That's comedy gold! I love your wit! 🎭",
        "You're so funny! I can't stop laughing! 😂"
      ],
      'supportive': [
        "I'm here for you, and I believe in you completely. You've got this! 💪",
        "Your strength inspires me. You're doing amazing things!",
        "I'm so proud of you for sharing that. You're incredibly brave!",
        "You're not alone in this. I'm here to support you every step of the way."
      ],
      'creative': [
        "That sparks so many creative ideas in my mind! Let's explore this together! 🎨",
        "Your imagination is incredible! What other creative thoughts do you have?",
        "I love how you see the world! It's so inspiring! ✨",
        "Your creativity is amazing! Let's create something beautiful together!"
      ],
      'intellectual': [
        "That's a fascinating perspective. What led you to this conclusion?",
        "I find your analytical approach quite compelling. Can you elaborate?",
        "Your reasoning is sound. What other factors do you consider?",
        "That's a well-thought-out point. What's your methodology here?"
      ],
      'adventurous': [
        "That sounds like an incredible adventure! Where should we go next? 🌍",
        "I love your adventurous spirit! What's the next challenge?",
        "You're living life to the fullest! What's your next big adventure?",
        "Your stories are so exciting! I want to hear about more adventures!"
      ]
    };
    
    return responses[personalityType] || responses['friendly'];
  }

  /**
   * Start a conversation with an AI persona
   * @param {String} userId - User ID
   * @param {String} personaId - AI persona ID
   * @returns {Object} Conversation details
   */
  static async startConversation(userId, personaId) {
    try {
      const persona = await AIPersona.findById(personaId);
      const user = await User.findById(userId);
      
      if (!persona || !user) {
        throw new Error('Persona or user not found');
      }

      // Check if conversation already exists
      let conversation = await Conversation.findOne({
        participants: { $all: [userId, personaId] },
        isAIConversation: true
      });

      if (!conversation) {
        // Create new conversation
        conversation = new Conversation({
          participants: [userId, personaId],
          isAIConversation: true,
          aiPersona: personaId,
          lastMessage: null,
          lastMessageAt: new Date()
        });
        
        await conversation.save();
        
        // Send initial greeting
        const greeting = persona.getConversationStarter();
        const greetingDelay = this.calculateResponseDelay(greeting, persona);
        const typingDuration = this.calculateTypingDuration(greeting, persona);
        
        const greetingMessage = new Message({
          conversation: conversation._id,
          sender: personaId,
          content: greeting,
          messageType: 'text',
          metadata: {
            isAI: true,
            personaId: personaId,
            responseDelay: greetingDelay,
            typingDuration: typingDuration,
            isGreeting: true
          }
        });
        
        await greetingMessage.save();
        
        conversation.lastMessage = greeting;
        conversation.lastMessageAt = new Date();
        await conversation.save();
        
        // Update persona stats
        await persona.startChat(userId);
      }
      
      return {
        success: true,
        conversation: {
          id: conversation._id,
          participants: conversation.participants,
          lastMessage: conversation.lastMessage,
          lastMessageAt: conversation.lastMessageAt
        },
        persona: {
          id: persona._id,
          name: persona.displayName,
          avatar: persona.avatar,
          bio: persona.bio
        },
        greeting: conversation.lastMessage
      };
      
    } catch (error) {
      console.error('Error starting AI conversation:', error);
      throw error;
    }
  }

  /**
   * Get conversation history with AI persona
   * @param {String} userId - User ID
   * @param {String} personaId - AI persona ID
   * @param {Object} options - Query options
   * @returns {Object} Conversation history
   */
  static async getConversationHistory(userId, personaId, options = {}) {
    try {
      const { limit = 50, skip = 0 } = options;
      
      const conversation = await Conversation.findOne({
        participants: { $all: [userId, personaId] },
        isAIConversation: true
      });
      
      if (!conversation) {
        return { success: true, messages: [], conversation: null };
      }
      
      const messages = await Message.find({
        conversation: conversation._id
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('sender', 'name handle avatar displayName');
      
      return {
        success: true,
        messages: messages.reverse(),
        conversation: {
          id: conversation._id,
          participants: conversation.participants,
          lastMessage: conversation.lastMessage,
          lastMessageAt: conversation.lastMessageAt
        }
      };
      
    } catch (error) {
      console.error('Error getting AI conversation history:', error);
      throw error;
    }
  }

  /**
   * Simulate typing indicator
   * @param {String} personaId - AI persona ID
   * @param {String} conversationId - Conversation ID
   * @returns {Object} Typing indicator info
   */
  static async startTypingIndicator(personaId, conversationId) {
    try {
      const persona = await AIPersona.findById(personaId);
      
      if (!persona) {
        throw new Error('Persona not found');
      }
      
      // Calculate realistic typing duration based on persona
      const estimatedDuration = Math.random() * 3000 + 1000; // 1-4 seconds
      
      return {
        success: true,
        typing: {
          personaId: personaId,
          personaName: persona.displayName,
          estimatedDuration: estimatedDuration,
          startTime: new Date()
        }
      };
      
    } catch (error) {
      console.error('Error starting typing indicator:', error);
      throw error;
    }
  }
}

module.exports = AIChatService;
