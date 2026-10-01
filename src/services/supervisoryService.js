import api from './api'

export const supervisoryService = {
  // Get list of staff members to evaluate
  getStaffList: async () => {
    const response = await api.get('/supervisory/staff')
    return response.data
  },

  // Submit a new assessment
  submitAssessment: async (data) => {
    // data should contain { staffId, context, scores, remarks }
    const response = await api.post('/supervisory', data)
    return response.data
  },

  // Get assessments submitted by me (the supervisor)
  getMyAssessments: async () => {
    const response = await api.get('/supervisory/my-assessments')
    return response.data
  }
}
