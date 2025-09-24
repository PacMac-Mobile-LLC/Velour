import { api } from './api';

export const profileService = {
  // Get user profile
  getProfile: async () => {
    try {
      const response = await api.get('/profile');
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error fetching profile:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to fetch profile' 
      };
    }
  },

  // Update user profile
  updateProfile: async (profileData) => {
    try {
      const response = await api.put('/profile', profileData);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error updating profile:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to update profile' 
      };
    }
  },

  // Update profile settings
  updateSettings: async (settings) => {
    try {
      const response = await api.put('/profile/settings', settings);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error updating settings:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to update settings' 
      };
    }
  },

  // Add external link
  addLink: async (linkData) => {
    try {
      const response = await api.post('/profile/links', linkData);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error adding link:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to add link' 
      };
    }
  },

  // Update external link
  updateLink: async (linkId, linkData) => {
    try {
      const response = await api.put(`/profile/links/${linkId}`, linkData);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error updating link:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to update link' 
      };
    }
  },

  // Delete external link
  deleteLink: async (linkId) => {
    try {
      const response = await api.delete(`/profile/links/${linkId}`);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error deleting link:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to delete link' 
      };
    }
  }
};
