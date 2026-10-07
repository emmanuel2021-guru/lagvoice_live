/**
 * Tests for hrService API Communication Methods
 * Validates endpoints, query parameter handling, and data resolution
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import api from '../services/api'
import hrService, {
  getHrOverview,
  getDepartmentStaff,
  getDepartmentAppraisals,
  getDepartmentGrievances
} from '../services/hrService'

vi.mock('../services/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn()
  }
}))

describe('hrService API methods', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getHrOverview', () => {
    it('calls /hr/overview and returns overview metrics', async () => {
      const mockOverviewData = {
        success: true,
        department: 'Computer Science',
        data: {
          totalStaffCount: 18,
          pendingPeerReviews: 3,
          supervisoryRatingsAverage: 4.25,
          unresolvedTickets: 2,
          metrics: {
            totalTickets: 12,
            resolvedTickets: 10,
            resolutionRate: 83.3
          }
        }
      }
      api.get.mockResolvedValueOnce(mockOverviewData)

      const result = await getHrOverview()
      expect(api.get).toHaveBeenCalledWith('/hr/overview')
      expect(result).toEqual(mockOverviewData)
    })

    it('propagates errors when the network or API fails', async () => {
      api.get.mockRejectedValueOnce(new Error('Network error'))

      await expect(getHrOverview()).rejects.toThrow('Network error')
      expect(api.get).toHaveBeenCalledWith('/hr/overview')
    })
  })

  describe('getDepartmentStaff', () => {
    it('calls /hr/staff with default empty params', async () => {
      const mockStaffData = {
        success: true,
        department: 'Computer Science',
        count: 2,
        staff: [
          { id: 1, name: 'Dr. Jane Doe', role: 'faculty' },
          { id: 2, name: 'John Smith', role: 'staff' }
        ]
      }
      api.get.mockResolvedValueOnce(mockStaffData)

      const result = await getDepartmentStaff()
      expect(api.get).toHaveBeenCalledWith('/hr/staff', { params: {} })
      expect(result).toEqual(mockStaffData)
    })

    it('passes search, role, and status query parameters correctly', async () => {
      const filters = { search: 'Jane', role: 'faculty', status: 'active' }
      api.get.mockResolvedValueOnce({ success: true, count: 1, staff: [] })

      await getDepartmentStaff(filters)
      expect(api.get).toHaveBeenCalledWith('/hr/staff', { params: filters })
    })
  })

  describe('getDepartmentAppraisals', () => {
    it('calls /hr/appraisals with default empty params', async () => {
      const mockAppraisalsData = {
        success: true,
        department: 'Computer Science',
        summary: {
          totalStaff: 18,
          fullyCompleted: 12,
          completionRate: 66.7
        },
        roster: []
      }
      api.get.mockResolvedValueOnce(mockAppraisalsData)

      const result = await getDepartmentAppraisals()
      expect(api.get).toHaveBeenCalledWith('/hr/appraisals', { params: {} })
      expect(result).toEqual(mockAppraisalsData)
    })

    it('passes query filters when supplied', async () => {
      const filters = { session: '2025/2026' }
      api.get.mockResolvedValueOnce({ success: true })

      await getDepartmentAppraisals(filters)
      expect(api.get).toHaveBeenCalledWith('/hr/appraisals', { params: filters })
    })
  })

  describe('getDepartmentGrievances', () => {
    it('calls /hr/grievances with default empty params', async () => {
      const mockGrievanceData = {
        success: true,
        department: 'Computer Science',
        count: 5,
        summary: { total: 5, unresolved: 2, resolved: 3 },
        tickets: []
      }
      api.get.mockResolvedValueOnce(mockGrievanceData)

      const result = await getDepartmentGrievances()
      expect(api.get).toHaveBeenCalledWith('/hr/grievances', { params: {} })
      expect(result).toEqual(mockGrievanceData)
    })

    it('passes grievance filtering options (status, category, urgency, staffInvolvement)', async () => {
      const filters = {
        status: 'pending',
        category: 'academic',
        urgency: 'high',
        staffInvolvement: 'staff_only',
        search: 'harassment'
      }
      api.get.mockResolvedValueOnce({ success: true, tickets: [] })

      await getDepartmentGrievances(filters)
      expect(api.get).toHaveBeenCalledWith('/hr/grievances', { params: filters })
    })
  })

  describe('hrService object export', () => {
    it('exports all methods on the default hrService object', () => {
      expect(hrService.getHrOverview).toBe(getHrOverview)
      expect(hrService.getDepartmentStaff).toBe(getDepartmentStaff)
      expect(hrService.getDepartmentAppraisals).toBe(getDepartmentAppraisals)
      expect(hrService.getDepartmentGrievances).toBe(getDepartmentGrievances)
    })
  })
})
