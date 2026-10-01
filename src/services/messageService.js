import api from './api';

export const messageService = {
  getMessages: async (type = 'inbox') => {
    return await api.get(`/messages?type=${type}`);
  },

  sendMessage: async (messageData) => {
    return await api.post('/messages', messageData);
  },

  markAsRead: async (id) => {
    return await api.put(`/messages/${id}/read`);
  },

  getStaffUsers: async () => {
    return await api.get('/messages/users');
  }
};
