import api from './api';

// Dashboard Analytics Service
export const dashboardService = {
  // Get dashboard overview stats
  async getDashboardStats() {
    try {
      const response = await api.get('/dashboard/stats');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch dashboard stats'
      };
    }
  },

  // Get user subscriptions
  async getSubscriptions() {
    try {
      const response = await api.get('/subscriptions');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch subscriptions'
      };
    }
  },

  // Get notifications
  async getNotifications(page = 1, limit = 20) {
    try {
      const response = await api.get(`/notifications?page=${page}&limit=${limit}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch notifications'
      };
    }
  },

  // Mark notification as read
  async markNotificationAsRead(notificationId) {
    try {
      const response = await api.put(`/notifications/${notificationId}/read`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to mark notification as read'
      };
    }
  },

  // Get messages/conversations
  async getConversations(page = 1, limit = 20) {
    try {
      const response = await api.get(`/messages/conversations?page=${page}&limit=${limit}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error fetching conversations:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch conversations'
      };
    }
  },

  // Get messages for a specific conversation
  async getMessages(conversationId, page = 1, limit = 50) {
    try {
      const response = await api.get(`/messages/${conversationId}?page=${page}&limit=${limit}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error fetching messages:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch messages'
      };
    }
  },

  // Send a message
  async sendMessage(conversationId, content, type = 'text') {
    try {
      const response = await api.post(`/messages/${conversationId}`, {
        content,
        type
      });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error sending message:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to send message'
      };
    }
  },

  // Get collections
  async getCollections() {
    try {
      const response = await api.get('/collections');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error fetching collections:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch collections'
      };
    }
  },

  // Create a new collection
  async createCollection(name, description) {
    try {
      const response = await api.post('/collections', {
        name,
        description
      });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error creating collection:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create collection'
      };
    }
  },

  // Add creator to collection
  async addCreatorToCollection(collectionId, creatorId) {
    try {
      const response = await api.post(`/collections/${collectionId}/creators`, {
        creatorId
      });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error adding creator to collection:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to add creator to collection'
      };
    }
  },

  // Get vault content
  async getVaultContent(page = 1, limit = 20, type = 'all') {
    try {
      const response = await api.get(`/vault?page=${page}&limit=${limit}&type=${type}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error fetching vault content:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch vault content'
      };
    }
  },

  // Upload content to vault
  async uploadToVault(file, metadata = {}) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('metadata', JSON.stringify(metadata));

      const response = await api.post('/vault/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error uploading to vault:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to upload content'
      };
    }
  },

  // Get queue/scheduled content
  async getQueue(page = 1, limit = 20) {
    try {
      const response = await api.get(`/queue?page=${page}&limit=${limit}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error fetching queue:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch queue'
      };
    }
  },

  // Schedule content
  async scheduleContent(contentId, scheduledDate, type = 'post') {
    try {
      const response = await api.post('/queue/schedule', {
        contentId,
        scheduledDate,
        type
      });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error scheduling content:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to schedule content'
      };
    }
  },

  // Get statements/payouts
  async getStatements(page = 1, limit = 20) {
    try {
      const response = await api.get(`/statements?page=${page}&limit=${limit}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error fetching statements:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch statements'
      };
    }
  },

  // Get analytics data
  async getAnalytics(timeframe = '30d') {
    try {
      const response = await api.get(`/analytics?timeframe=${timeframe}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error fetching analytics:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch analytics'
      };
    }
  },

  // Get profile data
  async getProfile() {
    try {
      const response = await api.get('/profile');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error fetching profile:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch profile'
      };
    }
  },

  // Update profile
  async updateProfile(profileData) {
    try {
      const response = await api.put('/profile', profileData);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error updating profile:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update profile'
      };
    }
  },

  // Get recommended creators
  async getRecommendedCreators(limit = 10) {
    try {
      const response = await api.get(`/creators/recommended?limit=${limit}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error fetching recommended creators:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch recommended creators'
      };
    }
  },

  // Search creators
  async searchCreators(query, page = 1, limit = 20) {
    try {
      const response = await api.get(`/creators/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error searching creators:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to search creators'
      };
    }
  }
};

export default dashboardService;
