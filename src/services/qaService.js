import api from './api';

export const qaService = {
  submitAudit: async (auditData) => {
    const response = await api.post('/qa/audits', auditData);
    return response.data;
  },
  
  getAudits: async () => {
    const response = await api.get('/qa/audits');
    return response.data;
  },

  submitSelfAssessment: async (assessmentData) => {
    const response = await api.post('/qa/self-assessments', assessmentData);
    return response.data;
  },

  getMySelfAssessments: async () => {
    const response = await api.get('/qa/self-assessments/me');
    return response.data;
  },

  getAllSelfAssessments: async () => {
    const response = await api.get('/qa/self-assessments');
    return response.data;
  },

  getBenchmarks: async (body) => {
    const url = body ? `/qa/benchmarks?body=${body}` : '/qa/benchmarks';
    const response = await api.get(url);
    return response.data;
  }
};
