import api from './api';

export const servicomService = {
  getCharters: async () => {
    const response = await api.get('/servicom/charters');
    return response.data;
  },

  upsertCharter: async (data) => {
    const response = await api.post('/servicom/charters', data);
    return response.data;
  }
};
