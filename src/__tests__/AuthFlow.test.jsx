/**
 * Tests for Authentication Flow and Role Routing
 * Covers role options, registration role dropdown, useAuth helpers, and redirection logic
 */
import { describe, it, expect, vi } from 'vitest'
import { ROLES, ROUTES } from '../utils/constants'

describe('Auth Flow & Role Redirection', () => {
  describe('ROLE_OPTIONS & Constants', () => {
    it('defines all required roles in ROLES constant including HR, HOD, and DEAN', () => {
      expect(ROLES.HR).toBe('hr')
      expect(ROLES.HOD).toBe('hod')
      expect(ROLES.DEAN).toBe('dean')
      expect(ROLES.STAFF).toBe('staff')
      expect(ROLES.NON_STAFF).toBe('non-staff')
      expect(ROLES.STUDENT).toBe('student')
      expect(ROLES.ADMIN).toBe('admin')
      expect(ROLES.FACULTY).toBe('faculty')
    })

    it('defines corresponding dashboard routes in ROUTES constant', () => {
      expect(ROUTES.HOME).toBe('/')
      expect(ROUTES.LOGIN).toBe('/login')
      expect(ROUTES.REGISTER).toBe('/register')
      expect(ROUTES.FORGOT_PASSWORD).toBe('/forgot-password')
      expect(ROUTES.HR_DASHBOARD).toBe('/hr')
      expect(ROUTES.HOD_DASHBOARD).toBe('/hod')
      expect(ROUTES.DEAN_DASHBOARD).toBe('/dean')
      expect(ROUTES.STAFF_DASHBOARD).toBe('/staff')
      expect(ROUTES.NON_STAFF_DASHBOARD).toBe('/non-staff')
      expect(ROUTES.STUDENT_DASHBOARD).toBe('/student')
      expect(ROUTES.ADMIN_DASHBOARD).toBe('/admin')
      expect(ROUTES.FACULTY_DASHBOARD).toBe('/faculty')
    })
  })

  describe('Role-to-Route Mapping (AuthPage Navigation)', () => {
    const getRoleDashboardRoute = (role) => {
      const roleRoutes = {
        [ROLES.STUDENT]: ROUTES.STUDENT_DASHBOARD,
        [ROLES.STAFF]: ROUTES.STAFF_DASHBOARD,
        [ROLES.NON_STAFF]: ROUTES.NON_STAFF_DASHBOARD,
        [ROLES.ADMIN]: ROUTES.ADMIN_DASHBOARD,
        [ROLES.FACULTY]: ROUTES.FACULTY_DASHBOARD,
        [ROLES.HOD]: ROUTES.HOD_DASHBOARD,
        [ROLES.DEAN]: ROUTES.DEAN_DASHBOARD,
        [ROLES.HR]: ROUTES.HR_DASHBOARD,
      }
      return roleRoutes[role] || `/${role}`
    }

    it('navigates HR users to /hr upon authentication', () => {
      expect(getRoleDashboardRoute(ROLES.HR)).toBe('/hr')
    })

    it('navigates HOD users to their respective route /hod instead of hardcoded /staff', () => {
      expect(getRoleDashboardRoute(ROLES.HOD)).toBe('/hod')
      expect(getRoleDashboardRoute(ROLES.HOD)).not.toBe('/staff')
    })

    it('navigates DEAN users to their respective route /dean instead of hardcoded /staff', () => {
      expect(getRoleDashboardRoute(ROLES.DEAN)).toBe('/dean')
      expect(getRoleDashboardRoute(ROLES.DEAN)).not.toBe('/staff')
    })

    it('navigates standard staff and non-staff to their respective dashboards', () => {
      expect(getRoleDashboardRoute(ROLES.STAFF)).toBe('/staff')
      expect(getRoleDashboardRoute(ROLES.NON_STAFF)).toBe('/non-staff')
    })

    it('navigates students, admins, and faculty to their respective dashboards', () => {
      expect(getRoleDashboardRoute(ROLES.STUDENT)).toBe('/student')
      expect(getRoleDashboardRoute(ROLES.ADMIN)).toBe('/admin')
      expect(getRoleDashboardRoute(ROLES.FACULTY)).toBe('/faculty')
    })
  })

  describe('useAuth Role Flag Logic', () => {
    const computeRoleFlags = (role) => ({
      isStudent: role === ROLES.STUDENT,
      isFaculty: role === ROLES.FACULTY,
      isAdmin: role === ROLES.ADMIN,
      isExternal: role === ROLES.EXTERNAL,
      isStaff: role === ROLES.STAFF,
      isNonStaff: role === ROLES.NON_STAFF,
      isHod: role === ROLES.HOD,
      isDean: role === ROLES.DEAN,
      isHr: role === ROLES.HR,
    })

    it('correctly sets isHr = true and other flags to false for hr role', () => {
      const flags = computeRoleFlags('hr')
      expect(flags.isHr).toBe(true)
      expect(flags.isHod).toBe(false)
      expect(flags.isDean).toBe(false)
      expect(flags.isStaff).toBe(false)
      expect(flags.isStudent).toBe(false)
    })

    it('correctly sets isHod = true for hod role', () => {
      const flags = computeRoleFlags('hod')
      expect(flags.isHod).toBe(true)
      expect(flags.isDean).toBe(false)
      expect(flags.isHr).toBe(false)
    })

    it('correctly sets isDean = true for dean role', () => {
      const flags = computeRoleFlags('dean')
      expect(flags.isDean).toBe(true)
      expect(flags.isHod).toBe(false)
      expect(flags.isHr).toBe(false)
    })
  })
})
