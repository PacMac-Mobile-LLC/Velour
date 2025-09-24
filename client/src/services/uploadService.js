import { api } from './api';

export const uploadService = {
  // Upload file to vault
  uploadToVault: async (file, metadata) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', metadata.title || file.name);
      formData.append('description', metadata.description || '');
      formData.append('isPrivate', metadata.isPrivate || false);
      formData.append('tags', metadata.tags ? metadata.tags.join(',') : '');

      const response = await api.post('/upload/vault', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error uploading file to vault:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to upload file' 
      };
    }
  },

  // Upload profile avatar
  uploadAvatar: async (file) => {
    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await api.post('/upload/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error uploading avatar:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to upload avatar' 
      };
    }
  },

  // Get vault content
  getVaultContent: async (page = 1, limit = 20, type = 'all') => {
    try {
      const response = await api.get('/upload/vault', {
        params: { page, limit, type }
      });
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error fetching vault content:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to fetch vault content' 
      };
    }
  },

  // Delete vault content
  deleteVaultContent: async (contentId) => {
    try {
      const response = await api.delete(`/upload/vault/${contentId}`);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error deleting vault content:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to delete content' 
      };
    }
  }
};
