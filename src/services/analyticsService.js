import api from './api'

export const analyticsService = {
  async getKpiOverview() {
    const response = await api.get('/analytics/kpi-overview')
    return response.data
  },

  async getComplaintTrend(period = 'monthly') {
    const response = await api.get(`/analytics/trends?period=${period}`)
    return response.data
  },

  async getComplaintsByCategory() {
    const response = await api.get('/analytics/by-category')
    return response.data
  },

  async getComplaintsByDepartment() {
    const response = await api.get('/analytics/by-department')
    return response.data
  },

  async getActiveAlerts() {
    const response = await api.get('/analytics/alerts')
    return response.data
  },

  async getTopRecurringIssues() {
    const response = await api.get('/analytics/top-issues')
    return response.data
  },
}
