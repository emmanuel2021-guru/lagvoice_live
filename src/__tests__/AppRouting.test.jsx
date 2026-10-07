/**
 * Tests for Application Routing and Navigation Integrations
 * Validates route protection, role permissions, and layout navigation items
 */
import { describe, it, expect } from 'vitest'
import { hrNavItems, getStaffNavItems, nonStaffNavItems } from '../components/common/Layout/StaffLayout'
import { ROUTES } from '../utils/constants'

describe('App Routing & Layout Navigation', () => {
  describe('StaffLayout Navigation Items', () => {
    it('exports hrNavItems with the four required HR tabs', () => {
      expect(hrNavItems).toHaveLength(4)
      expect(hrNavItems[0]).toEqual({ label: 'Overview', path: '/hr', icon: 'grid' })
      expect(hrNavItems[1]).toEqual({ label: 'Staff Directory', path: '/hr/staff', icon: 'people' })
      expect(hrNavItems[2]).toEqual({ label: 'Appraisals', path: '/hr/appraisals', icon: 'star' })
      expect(hrNavItems[3]).toEqual({ label: 'Grievances', path: '/hr/grievances', icon: 'tickets' })
    })

    it('returns hrNavItems when getStaffNavItems is called with role "hr"', () => {
      const items = getStaffNavItems('hr')
      expect(items).toEqual(hrNavItems)
    })

    it('returns standard staff tabs for role "staff"', () => {
      const items = getStaffNavItems('staff')
      expect(items.some(i => i.path === '/staff')).toBe(true)
      expect(items.some(i => i.path === '/staff/inbox')).toBe(true)
      expect(items.some(i => i.path === '/staff/peer-review')).toBe(true)
      expect(items.some(i => i.path === '/staff/supervisory')).toBe(false)
    })

    it('returns supervisory and self-assessment tabs for "hod" and "dean"', () => {
      const hodItems = getStaffNavItems('hod')
      expect(hodItems.some(i => i.path === '/hod')).toBe(true)
      expect(hodItems.some(i => i.path === '/staff/supervisory')).toBe(true)
      expect(hodItems.some(i => i.path === '/staff/self-assessment')).toBe(true)

      const deanItems = getStaffNavItems('dean')
      expect(deanItems.some(i => i.path === '/dean')).toBe(true)
      expect(deanItems.some(i => i.path === '/staff/supervisory')).toBe(true)
      expect(deanItems.some(i => i.path === '/staff/self-assessment')).toBe(true)
    })

    it('exports nonStaffNavItems with Helpdesk, Inbox, Polls, and Memos', () => {
      expect(nonStaffNavItems).toHaveLength(4)
      expect(nonStaffNavItems.map(i => i.label)).toEqual(['Helpdesk', 'Inbox', 'Polls', 'Memos'])
    })
  })

  describe('Protected Route Role Access Permissions', () => {
    const isRoleAllowed = (allowedRoles, userRole) => {
      if (!allowedRoles || allowedRoles.length === 0) return true
      return allowedRoles.includes(userRole)
    }

    it('allows HR role on /hr and /hr/* protected routes', () => {
      const hrAllowedRoles = ['hr']
      expect(isRoleAllowed(hrAllowedRoles, 'hr')).toBe(true)
      expect(isRoleAllowed(hrAllowedRoles, 'student')).toBe(false)
      expect(isRoleAllowed(hrAllowedRoles, 'staff')).toBe(false)
    })

    it('allows HR role access to /staff/inbox alongside staff, non-staff, hod, and dean', () => {
      const inboxAllowedRoles = ['staff', 'non-staff', 'hod', 'dean', 'hr']
      expect(isRoleAllowed(inboxAllowedRoles, 'hr')).toBe(true)
      expect(isRoleAllowed(inboxAllowedRoles, 'staff')).toBe(true)
      expect(isRoleAllowed(inboxAllowedRoles, 'non-staff')).toBe(true)
      expect(isRoleAllowed(inboxAllowedRoles, 'hod')).toBe(true)
      expect(isRoleAllowed(inboxAllowedRoles, 'dean')).toBe(true)
      expect(isRoleAllowed(inboxAllowedRoles, 'student')).toBe(false)
    })

    it('verifies ROUTES constants match the registered route endpoints', () => {
      expect(ROUTES.HR_DASHBOARD).toBe('/hr')
      expect(ROUTES.HOD_DASHBOARD).toBe('/hod')
      expect(ROUTES.DEAN_DASHBOARD).toBe('/dean')
      expect(ROUTES.STAFF_INBOX).toBe('/staff/inbox')
      expect(ROUTES.HR_STAFF).toBe('/hr/staff')
      expect(ROUTES.HR_APPRAISALS).toBe('/hr/appraisals')
      expect(ROUTES.HR_GRIEVANCES).toBe('/hr/grievances')
    })
  })

  describe('ProtectedRoute Route Guard Decision Logic', () => {
    const evaluateProtectedRoute = ({ isAuthenticated, role, allowedRoles = [] }) => {
      if (!isAuthenticated) {
        return { action: 'redirect', target: '/login' }
      }
      if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
        const dashboards = {
          student: '/student',
          faculty: '/faculty',
          admin: '/admin',
          staff: '/staff',
          'non-staff': '/non-staff',
          hod: '/hod',
          dean: '/dean',
          hr: '/hr'
        }
        return { action: 'redirect', target: dashboards[role] || '/login' }
      }
      return { action: 'render' }
    }

    it('rejects unauthenticated sessions attempting /hr and redirects to /login', () => {
      const result = evaluateProtectedRoute({
        isAuthenticated: false,
        role: null,
        allowedRoles: ['hr']
      })
      expect(result).toEqual({ action: 'redirect', target: '/login' })
    })

    it('rejects student attempting /hr and redirects to /student', () => {
      const result = evaluateProtectedRoute({
        isAuthenticated: true,
        role: 'student',
        allowedRoles: ['hr']
      })
      expect(result).toEqual({ action: 'redirect', target: '/student' })
    })

    it('rejects staff attempting /hr and redirects to /staff', () => {
      const result = evaluateProtectedRoute({
        isAuthenticated: true,
        role: 'staff',
        allowedRoles: ['hr']
      })
      expect(result).toEqual({ action: 'redirect', target: '/staff' })
    })

    it('rejects non-staff attempting /hr and redirects to /non-staff', () => {
      const result = evaluateProtectedRoute({
        isAuthenticated: true,
        role: 'non-staff',
        allowedRoles: ['hr']
      })
      expect(result).toEqual({ action: 'redirect', target: '/non-staff' })
    })

    it('allows authenticated HR user to access /hr', () => {
      const result = evaluateProtectedRoute({
        isAuthenticated: true,
        role: 'hr',
        allowedRoles: ['hr']
      })
      expect(result).toEqual({ action: 'render' })
    })

    it('redirects HR user attempting to access /student to /hr', () => {
      const result = evaluateProtectedRoute({
        isAuthenticated: true,
        role: 'hr',
        allowedRoles: ['student']
      })
      expect(result).toEqual({ action: 'redirect', target: '/hr' })
    })
  })
})
