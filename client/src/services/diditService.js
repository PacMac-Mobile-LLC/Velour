import api from './api';

// Didit.me Age Verification Service
export const diditService = {
  // Initialize age verification session
  async initializeVerification(userId, userEmail, userData) {
    try {
      const response = await api.post('/api/verification/didit/initialize', {
        userId,
        userEmail,
        userData
      });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error initializing Didit verification:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to initialize age verification'
      };
    }
  },

  // Get verification status
  async getVerificationStatus(userId) {
    try {
      const response = await api.get(`/api/verification/status/${userId}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error fetching verification status:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch verification status'
      };
    }
  },

  // Get verification history
  async getVerificationHistory(userId) {
    try {
      const response = await api.get(`/api/verification/history/${userId}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error fetching verification history:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch verification history'
      };
    }
  },

  // Resend verification request
  async resendVerification(userId) {
    try {
      const response = await api.post(`/api/verification/resend/${userId}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error resending verification:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to resend verification'
      };
    }
  }
};

export default diditService;
