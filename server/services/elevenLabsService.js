const axios = require('axios');
const fs = require('fs');
const path = require('path');

class ElevenLabsService {
  constructor() {
    this.apiKey = process.env.ELEVENLABS_API_KEY;
    this.baseURL = 'https://api.elevenlabs.io/v1';
    this.voices = new Map(); // Cache for voice data
    this.voiceSettings = {
      stability: 0.5,
      similarity_boost: 0.5,
      style: 0.0,
      use_speaker_boost: true
    };
  }

  /**
   * Initialize the service and load available voices
   */
  async initialize() {
    try {
      if (!this.apiKey) {
        console.warn('ElevenLabs API key not found. Voice features will be disabled.');
        return false;
      }

      await this.loadVoices();
      console.log('ElevenLabs service initialized successfully');
      return true;
    } catch (error) {
      console.error('Failed to initialize ElevenLabs service:', error);
      return false;
    }
  }

  /**
   * Load available voices from ElevenLabs API
   */
  async loadVoices() {
    try {
      const response = await axios.get(`${this.baseURL}/voices`, {
        headers: {
          'xi-api-key': this.apiKey
        }
      });

      response.data.voices.forEach(voice => {
        this.voices.set(voice.voice_id, {
          id: voice.voice_id,
          name: voice.name,
          category: voice.category,
          description: voice.description,
          labels: voice.labels,
          preview_url: voice.preview_url,
          available_for_tiers: voice.available_for_tiers,
          settings: voice.settings
        });
      });

      console.log(`Loaded ${this.voices.size} voices from ElevenLabs`);
    } catch (error) {
      console.error('Error loading voices:', error);
      throw error;
    }
  }

  /**
   * Get all available voices
   */
  getVoices() {
    return Array.from(this.voices.values());
  }

  /**
   * Get voice by ID
   */
  getVoice(voiceId) {
    return this.voices.get(voiceId);
  }

  /**
   * Get voices by category
   */
  getVoicesByCategory(category) {
    return Array.from(this.voices.values()).filter(voice => 
      voice.category === category
    );
  }

  /**
   * Get voices suitable for AI personas
   */
  getPersonaVoices() {
    const personaVoices = Array.from(this.voices.values()).filter(voice => {
      // Filter out voices that are too specific or not suitable for general use
      const unsuitableCategories = ['news', 'narrative'];
      const unsuitableLabels = ['news', 'narrative', 'audiobook'];
      
      if (unsuitableCategories.includes(voice.category)) {
        return false;
      }
      
      if (voice.labels && voice.labels.some(label => 
        unsuitableLabels.some(unsuitable => 
          label.toLowerCase().includes(unsuitable)
        )
      )) {
        return false;
      }
      
      return true;
    });

    return personaVoices;
  }

  /**
   * Generate speech from text
   * @param {String} text - Text to convert to speech
   * @param {String} voiceId - Voice ID to use
   * @param {Object} options - Additional options
   * @returns {Buffer} Audio data
   */
  async generateSpeech(text, voiceId, options = {}) {
    try {
      if (!this.apiKey) {
        throw new Error('ElevenLabs API key not configured');
      }

      const voice = this.getVoice(voiceId);
      if (!voice) {
        throw new Error(`Voice ${voiceId} not found`);
      }

      const requestData = {
        text: text,
        model_id: options.model || 'eleven_monolingual_v1',
        voice_settings: {
          stability: options.stability || this.voiceSettings.stability,
          similarity_boost: options.similarity_boost || this.voiceSettings.similarity_boost,
          style: options.style || this.voiceSettings.style,
          use_speaker_boost: options.use_speaker_boost !== undefined ? options.use_speaker_boost : this.voiceSettings.use_speaker_boost
        }
      };

      const response = await axios.post(
        `${this.baseURL}/text-to-speech/${voiceId}`,
        requestData,
        {
          headers: {
            'Accept': 'audio/mpeg',
            'Content-Type': 'application/json',
            'xi-api-key': this.apiKey
          },
          responseType: 'arraybuffer'
        }
      );

      return Buffer.from(response.data);
    } catch (error) {
      console.error('Error generating speech:', error);
      throw error;
    }
  }

  /**
   * Generate speech with streaming for real-time conversation
   * @param {String} text - Text to convert to speech
   * @param {String} voiceId - Voice ID to use
   * @param {Object} options - Additional options
   * @returns {Stream} Audio stream
   */
  async generateSpeechStream(text, voiceId, options = {}) {
    try {
      if (!this.apiKey) {
        throw new Error('ElevenLabs API key not configured');
      }

      const voice = this.getVoice(voiceId);
      if (!voice) {
        throw new Error(`Voice ${voiceId} not found`);
      }

      const requestData = {
        text: text,
        model_id: options.model || 'eleven_monolingual_v1',
        voice_settings: {
          stability: options.stability || this.voiceSettings.stability,
          similarity_boost: options.similarity_boost || this.voiceSettings.similarity_boost,
          style: options.style || this.voiceSettings.style,
          use_speaker_boost: options.use_speaker_boost !== undefined ? options.use_speaker_boost : this.voiceSettings.use_speaker_boost
        }
      };

      const response = await axios.post(
        `${this.baseURL}/text-to-speech/${voiceId}/stream`,
        requestData,
        {
          headers: {
            'Accept': 'audio/mpeg',
            'Content-Type': 'application/json',
            'xi-api-key': this.apiKey
          },
          responseType: 'stream'
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error generating speech stream:', error);
      throw error;
    }
  }

  /**
   * Get voice settings optimized for AI persona personality
   * @param {Object} persona - AI persona object
   * @returns {Object} Voice settings
   */
  getPersonaVoiceSettings(persona) {
    const personality = persona.personality?.type || 'friendly';
    
    const personalitySettings = {
      'friendly': {
        stability: 0.6,
        similarity_boost: 0.7,
        style: 0.2,
        use_speaker_boost: true
      },
      'mysterious': {
        stability: 0.4,
        similarity_boost: 0.8,
        style: 0.1,
        use_speaker_boost: true
      },
      'playful': {
        stability: 0.7,
        similarity_boost: 0.6,
        style: 0.4,
        use_speaker_boost: true
      },
      'wise': {
        stability: 0.8,
        similarity_boost: 0.9,
        style: 0.1,
        use_speaker_boost: true
      },
      'romantic': {
        stability: 0.5,
        similarity_boost: 0.8,
        style: 0.3,
        use_speaker_boost: true
      },
      'humorous': {
        stability: 0.6,
        similarity_boost: 0.7,
        style: 0.5,
        use_speaker_boost: true
      },
      'supportive': {
        stability: 0.7,
        similarity_boost: 0.8,
        style: 0.2,
        use_speaker_boost: true
      },
      'creative': {
        stability: 0.5,
        similarity_boost: 0.7,
        style: 0.4,
        use_speaker_boost: true
      },
      'intellectual': {
        stability: 0.8,
        similarity_boost: 0.9,
        style: 0.1,
        use_speaker_boost: true
      },
      'adventurous': {
        stability: 0.6,
        similarity_boost: 0.7,
        style: 0.3,
        use_speaker_boost: true
      }
    };

    return personalitySettings[personality] || personalitySettings['friendly'];
  }

  /**
   * Get recommended voice for AI persona
   * @param {Object} persona - AI persona object
   * @returns {Object} Recommended voice
   */
  getRecommendedVoice(persona) {
    const personality = persona.personality?.type || 'friendly';
    const gender = persona.customization?.voiceSettings?.gender || 'neutral';
    
    // Voice recommendations based on personality and gender
    const voiceRecommendations = {
      'friendly': {
        male: ['pNInz6obpgDQGcFmaJgB', 'EXAVITQu4vr4xnSDxMaL'], // Adam, Antoni
        female: ['21m00Tcm4TlvDq8ikWAM', 'AZnzlk1XvdvUeBnXmlld'], // Rachel, Domi
        neutral: ['pNInz6obpgDQGcFmaJgB', '21m00Tcm4TlvDq8ikWAM']
      },
      'mysterious': {
        male: ['VR6AewLTigWG4xSOukaG', 'pMsXgVXv3BLzUgSXRplM'], // Arnold, Josh
        female: ['EXAVITQu4vr4xnSDxMaL', 'MF3mGyEYCl7XYWbV9V6O'], // Bella, Elli
        neutral: ['VR6AewLTigWG4xSOukaG', 'EXAVITQu4vr4xnSDxMaL']
      },
      'playful': {
        male: ['VR6AewLTigWG4xSOukaG', 'pNInz6obpgDQGcFmaJgB'],
        female: ['AZnzlk1XvdvUeBnXmlld', 'EXAVITQu4vr4xnSDxMaL'],
        neutral: ['pNInz6obpgDQGcFmaJgB', 'AZnzlk1XvdvUeBnXmlld']
      },
      'wise': {
        male: ['pMsXgVXv3BLzUgSXRplM', 'VR6AewLTigWG4xSOukaG'],
        female: ['MF3mGyEYCl7XYWbV9V6O', 'EXAVITQu4vr4xnSDxMaL'],
        neutral: ['pMsXgVXv3BLzUgSXRplM', 'MF3mGyEYCl7XYWbV9V6O']
      },
      'romantic': {
        male: ['pNInz6obpgDQGcFmaJgB', 'VR6AewLTigWG4xSOukaG'],
        female: ['21m00Tcm4TlvDq8ikWAM', 'EXAVITQu4vr4xnSDxMaL'],
        neutral: ['pNInz6obpgDQGcFmaJgB', '21m00Tcm4TlvDq8ikWAM']
      }
    };

    const recommendations = voiceRecommendations[personality] || voiceRecommendations['friendly'];
    const voiceIds = recommendations[gender] || recommendations.neutral;
    
    // Return the first available voice
    for (const voiceId of voiceIds) {
      const voice = this.getVoice(voiceId);
      if (voice) {
        return voice;
      }
    }

    // Fallback to any available voice
    return this.getPersonaVoices()[0];
  }

  /**
   * Generate speech for AI persona response
   * @param {String} text - AI response text
   * @param {Object} persona - AI persona object
   * @param {Object} options - Additional options
   * @returns {Buffer} Audio data
   */
  async generatePersonaSpeech(text, persona, options = {}) {
    try {
      // Get voice ID from persona settings or use recommended voice
      let voiceId = persona.customization?.voiceSettings?.voiceId;
      
      if (!voiceId) {
        const recommendedVoice = this.getRecommendedVoice(persona);
        voiceId = recommendedVoice.id;
      }

      // Get voice settings optimized for persona personality
      const voiceSettings = this.getPersonaVoiceSettings(persona);
      
      // Merge with any custom settings from persona
      const customSettings = persona.customization?.voiceSettings || {};
      const finalSettings = {
        ...voiceSettings,
        ...customSettings,
        speed: customSettings.speed || 1.0,
        pitch: customSettings.pitch || 1.0
      };

      return await this.generateSpeech(text, voiceId, {
        ...options,
        ...finalSettings
      });
    } catch (error) {
      console.error('Error generating persona speech:', error);
      throw error;
    }
  }

  /**
   * Generate speech stream for real-time AI conversation
   * @param {String} text - AI response text
   * @param {Object} persona - AI persona object
   * @param {Object} options - Additional options
   * @returns {Stream} Audio stream
   */
  async generatePersonaSpeechStream(text, persona, options = {}) {
    try {
      // Get voice ID from persona settings or use recommended voice
      let voiceId = persona.customization?.voiceSettings?.voiceId;
      
      if (!voiceId) {
        const recommendedVoice = this.getRecommendedVoice(persona);
        voiceId = recommendedVoice.id;
      }

      // Get voice settings optimized for persona personality
      const voiceSettings = this.getPersonaVoiceSettings(persona);
      
      // Merge with any custom settings from persona
      const customSettings = persona.customization?.voiceSettings || {};
      const finalSettings = {
        ...voiceSettings,
        ...customSettings,
        speed: customSettings.speed || 1.0,
        pitch: customSettings.pitch || 1.0
      };

      return await this.generateSpeechStream(text, voiceId, {
        ...options,
        ...finalSettings
      });
    } catch (error) {
      console.error('Error generating persona speech stream:', error);
      throw error;
    }
  }

  /**
   * Save audio to file
   * @param {Buffer} audioData - Audio data
   * @param {String} filename - Filename to save
   * @returns {String} File path
   */
  async saveAudioToFile(audioData, filename) {
    try {
      const uploadsDir = path.join(__dirname, '../uploads/audio');
      
      // Ensure uploads directory exists
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      const filePath = path.join(uploadsDir, filename);
      fs.writeFileSync(filePath, audioData);
      
      return filePath;
    } catch (error) {
      console.error('Error saving audio to file:', error);
      throw error;
    }
  }

  /**
   * Get usage statistics
   */
  async getUsageStats() {
    try {
      if (!this.apiKey) {
        throw new Error('ElevenLabs API key not configured');
      }

      const response = await axios.get(`${this.baseURL}/user`, {
        headers: {
          'xi-api-key': this.apiKey
        }
      });

      return {
        character_count: response.data.subscription.character_count,
        character_limit: response.data.subscription.character_limit,
        can_extend_character_limit: response.data.subscription.can_extend_character_limit,
        allowed_to_extend_character_limit: response.data.subscription.allowed_to_extend_character_limit,
        next_character_count_reset_unix: response.data.subscription.next_character_count_reset_unix,
        voice_limit: response.data.subscription.voice_limit,
        max_voice_add_edits: response.data.subscription.max_voice_add_edits,
        voice_add_edit_counter: response.data.subscription.voice_add_edit_counter,
        professional_voice_limit: response.data.subscription.professional_voice_limit,
        can_extend_voice_limit: response.data.subscription.can_extend_voice_limit,
        can_use_instant_voice_cloning: response.data.subscription.can_use_instant_voice_cloning,
        can_use_professional_voice_cloning: response.data.subscription.can_use_professional_voice_cloning,
        currency: response.data.subscription.currency,
        status: response.data.subscription.status,
        tier: response.data.subscription.tier
      };
    } catch (error) {
      console.error('Error getting usage stats:', error);
      throw error;
    }
  }

  /**
   * Check if service is available
   */
  isAvailable() {
    return !!this.apiKey && this.voices.size > 0;
  }
}

// Create singleton instance
const elevenLabsService = new ElevenLabsService();

module.exports = elevenLabsService;
