import api from './api';

export const pollService = {
  async getPolls() {
    const response = await api.get('/polls');
    return response.data; // Array of formatted polls
  },

  async submitResponse(pollId, optionIndex) {
    const response = await api.post('/polls', { pollId, optionIndex });
    return response.data;
  }
};
