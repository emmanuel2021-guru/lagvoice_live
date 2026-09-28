/**
 * Analytics service (currently pending backend endpoints)
 * Returns empty structures until connected to backend API.
 */
import api from './api'

export const analyticsService = {
  async getKpiOverview() {
    const res = await api.get('/analytics/kpi-overview')
    return res.data
  },

  async getComplaintTrend(period = 'monthly') {
    const res = await api.get('/analytics/trends')
    return res.data
  },

  async getComplaintsByCategory() {
    const res = await api.get('/analytics/by-category')
    return res.data
  },

  async getComplaintsByDepartment() {
    const res = await api.get('/analytics/by-department')
    return res.data
  },

  async getActiveAlerts() {
    const res = await api.get('/analytics/alerts')
    return res.data
  },

  async getTopRecurringIssues() {
    const res = await api.get('/analytics/top-issues')
    return res.data
  },
}
