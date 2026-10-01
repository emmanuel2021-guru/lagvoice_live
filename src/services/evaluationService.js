import api from './api';

export const evaluationService = {
  async getMyEvaluations() {
    const response = await api.get('/evaluations');
    return response.data; // Array of course codes
  },

  async submitEvaluation(evaluationData) {
    const response = await api.post('/evaluations', evaluationData);
    return response.data;
  },

  async getQuestions() {
    const response = await api.get('/evaluations/questions');
    return response.data;
  },

  async updateQuestions(questions) {
    const response = await api.put('/evaluations/questions', { questions });
    return response.data;
  }
};
