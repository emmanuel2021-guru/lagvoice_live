/**
 * HR Service
 * Central API service for HR communications and departmental staff oversight
 */
import api from './api'

/**
 * Fetch overview metrics and summary statistics for the authenticated HR officer's department
 * @returns {Promise<Object>} Overview data including staff counts, pending reviews, ratings, and ticket metrics
 */
export const getHrOverview = async () => {
  return await api.get('/hr/overview')
}

/**
 * Fetch staff members belonging to the HR officer's department
 * @param {Object} [params] - Query filters (e.g. { role, search, status })
 * @returns {Promise<Object>} List of departmental staff records with appraisal summaries
 */
export const getDepartmentStaff = async (params = {}) => {
  return await api.get('/hr/staff', { params })
}

/**
 * Fetch aggregated appraisal records (supervisory assessments and peer reviews)
 * @param {Object} [params] - Optional query parameters
 * @returns {Promise<Object>} Departmental appraisal summaries, roster, and recent submissions
 */
export const getDepartmentAppraisals = async (params = {}) => {
  return await api.get('/hr/appraisals', { params })
}

/**
 * Fetch departmental grievance tickets filtered by status, category, urgency, or staff involvement
 * @param {Object} [params] - Query filters (e.g. { status, category, urgency, staffInvolvement, search })
 * @returns {Promise<Object>} Departmental grievance tickets and summary breakdowns
 */
export const getDepartmentGrievances = async (params = {}) => {
  return await api.get('/hr/grievances', { params })
}

export const hrService = {
  getHrOverview,
  getDepartmentStaff,
  getDepartmentAppraisals,
  getDepartmentGrievances,
}

export default hrService
