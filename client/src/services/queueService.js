import { api } from './api';

export const queueService = {
  // Get queue items
  getQueueItems: async (page = 1, limit = 20, status = 'all') => {
    try {
      const response = await api.get('/queue', {
        params: { page, limit, status }
      });
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error fetching queue items:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to fetch queue items' 
      };
    }
  },

  // Create queue item
  createQueueItem: async (queueData) => {
    try {
      const response = await api.post('/queue', queueData);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error creating queue item:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to create queue item' 
      };
    }
  },

  // Update queue item
  updateQueueItem: async (queueId, updateData) => {
    try {
      const response = await api.put(`/queue/${queueId}`, updateData);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error updating queue item:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to update queue item' 
      };
    }
  },

  // Delete queue item
  deleteQueueItem: async (queueId) => {
    try {
      const response = await api.delete(`/queue/${queueId}`);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error deleting queue item:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to delete queue item' 
      };
    }
  },

  // Start live session
  startLiveSession: async (queueId) => {
    try {
      const response = await api.post(`/queue/${queueId}/start`);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error starting live session:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to start live session' 
      };
    }
  },

  // Complete live session
  completeLiveSession: async (queueId, actualViewers = 0) => {
    try {
      const response = await api.post(`/queue/${queueId}/complete`, { actualViewers });
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error completing live session:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to complete live session' 
      };
    }
  }
};
