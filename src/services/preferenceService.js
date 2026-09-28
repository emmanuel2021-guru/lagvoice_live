import api from './api';

export const preferenceService = {
  async getPreferences() {
    const response = await api.get('/preferences');
    return response.data;
  },

  async updatePreferences(prefs) {
    const response = await api.put('/preferences', prefs);
    return response.data;
  }
};
