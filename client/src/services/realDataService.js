import { api } from './api';

// This service provides real data instead of mock data
// It will be used once the API connections are working properly

export const realDataService = {
  // Dashboard Stats
  getDashboardStats: async () => {
    try {
      const response = await api.get('/dashboard/stats');
      return {
        success: true,
        data: {
          activeSubscriptions: response.data.activeSubscriptions || 0,
          totalViews: response.data.totalViews || 0,
          messagesSent: response.data.messagesSent || 0,
          monthlyRevenue: response.data.monthlyRevenue || 0,
          subscriptionGrowth: response.data.subscriptionGrowth || 0,
          viewGrowth: response.data.viewGrowth || 0,
          messageGrowth: response.data.messageGrowth || 0,
          revenueGrowth: response.data.revenueGrowth || 0
        }
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      return { success: false, data: null };
    }
  },

  // Notifications
  getNotifications: async (page = 1, limit = 20) => {
    try {
      const response = await api.get(`/notifications?page=${page}&limit=${limit}`);
      return {
        success: true,
        data: response.data.notifications || [],
        total: response.data.total || 0,
        page: response.data.page || 1,
        totalPages: response.data.totalPages || 1
      };
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return { success: false, data: [], total: 0 };
    }
  },

  // Messages/Conversations
  getConversations: async (page = 1, limit = 20) => {
    try {
      const response = await api.get(`/messages/conversations?page=${page}&limit=${limit}`);
      return {
        success: true,
        data: response.data.conversations || [],
        total: response.data.total || 0
      };
    } catch (error) {
      console.error('Error fetching conversations:', error);
      return { success: false, data: [], total: 0 };
    }
  },

  getMessages: async (conversationId, page = 1, limit = 50) => {
    try {
      const response = await api.get(`/messages/${conversationId}?page=${page}&limit=${limit}`);
      return {
        success: true,
        data: response.data.messages || [],
        total: response.data.total || 0
      };
    } catch (error) {
      console.error('Error fetching messages:', error);
      return { success: false, data: [], total: 0 };
    }
  },

  // Collections
  getCollections: async () => {
    try {
      const response = await api.get('/collections');
      return {
        success: true,
        data: response.data.collections || []
      };
    } catch (error) {
      console.error('Error fetching collections:', error);
      return { success: false, data: [] };
    }
  },

  createCollection: async (collectionData) => {
    try {
      const response = await api.post('/collections', collectionData);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error creating collection:', error);
      return { success: false, message: error.response?.data?.message || 'Failed to create collection' };
    }
  },

  // Vault/Content
  getVaultContent: async (page = 1, limit = 20, type = 'all') => {
    try {
      const response = await api.get(`/vault?page=${page}&limit=${limit}&type=${type}`);
      return {
        success: true,
        data: response.data.content || [],
        total: response.data.total || 0
      };
    } catch (error) {
      console.error('Error fetching vault content:', error);
      return { success: false, data: [], total: 0 };
    }
  },

  uploadContent: async (formData) => {
    try {
      const response = await api.post('/upload/vault', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error uploading content:', error);
      return { success: false, message: error.response?.data?.message || 'Failed to upload content' };
    }
  },

  // Queue/Scheduling
  getQueue: async (page = 1, limit = 20) => {
    try {
      const response = await api.get(`/queue?page=${page}&limit=${limit}`);
      return {
        success: true,
        data: response.data.queue || [],
        total: response.data.total || 0
      };
    } catch (error) {
      console.error('Error fetching queue:', error);
      return { success: false, data: [], total: 0 };
    }
  },

  scheduleContent: async (scheduleData) => {
    try {
      const response = await api.post('/queue', scheduleData);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error scheduling content:', error);
      return { success: false, message: error.response?.data?.message || 'Failed to schedule content' };
    }
  },

  // Statements/Payouts
  getStatements: async (page = 1, limit = 20) => {
    try {
      const response = await api.get(`/statements?page=${page}&limit=${limit}`);
      return {
        success: true,
        data: response.data.statements || [],
        total: response.data.total || 0
      };
    } catch (error) {
      console.error('Error fetching statements:', error);
      return { success: false, data: [], total: 0 };
    }
  },

  // Analytics/Statistics
  getAnalytics: async (timeframe = '30d') => {
    try {
      const response = await api.get(`/analytics?timeframe=${timeframe}`);
      return {
        success: true,
        data: response.data.analytics || {}
      };
    } catch (error) {
      console.error('Error fetching analytics:', error);
      return { success: false, data: {} };
    }
  },

  // Profile
  getProfile: async () => {
    try {
      const response = await api.get('/profile');
      return {
        success: true,
        data: response.data.profile || {}
      };
    } catch (error) {
      console.error('Error fetching profile:', error);
      return { success: false, data: {} };
    }
  },

  updateProfile: async (profileData) => {
    try {
      const response = await api.put('/profile', profileData);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error updating profile:', error);
      return { success: false, message: error.response?.data?.message || 'Failed to update profile' };
    }
  },

  uploadAvatar: async (formData) => {
    try {
      const response = await api.post('/upload/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error uploading avatar:', error);
      return { success: false, message: error.response?.data?.message || 'Failed to upload avatar' };
    }
  },

  // Recommended Creators
  getRecommendedCreators: async (limit = 10) => {
    try {
      const response = await api.get(`/creators/recommended?limit=${limit}`);
      return {
        success: true,
        data: response.data.creators || []
      };
    } catch (error) {
      console.error('Error fetching recommended creators:', error);
      return { success: false, data: [] };
    }
  },

  // Subscriptions
  getSubscriptions: async () => {
    try {
      const response = await api.get('/subscriptions');
      return {
        success: true,
        data: response.data.subscriptions || []
      };
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
      return { success: false, data: [] };
    }
  }
};

export default realDataService;
