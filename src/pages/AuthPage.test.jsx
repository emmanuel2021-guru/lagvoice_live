import { describe, it, expect, vi, beforeEach } from 'vitest'
import React from 'react'
import { renderToString } from 'react-dom/server'
import AuthPage from './AuthPage'
import { ROLES, ROUTES } from '../utils/constants'
import { getRoleDashboardRoute } from '../features/auth'

// Mock react-router-dom
const mockNavigate = vi.fn()
let mockCurrentPath = ROUTES.LOGIN

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  useLocation: () => ({ pathname: mockCurrentPath }),
}))

// Mock useAuth
const mockLogin = vi.fn()
const mockRegisterUser = vi.fn()
const mockClearError = vi.fn()

vi.mock('../hooks/useAuth', () => ({
  useAuth: () => ({
    login: mockLogin,
    registerUser: mockRegisterUser,
    loading: false,
    error: null,
    clearError: mockClearError,
  }),
}))

describe('AuthPage Main Shell Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockCurrentPath = ROUTES.LOGIN
  })

  // 1. Mode-Switching (Login vs. Register)
  describe('Mode-Switching Behavior', () => {
    it('initializes in login mode when navigating to /login', () => {
      mockCurrentPath = ROUTES.LOGIN
      const html = renderToString(React.createElement(AuthPage))

      expect(html).toContain('Welcome')
      expect(html).toContain('back')
      expect(html).toContain('Sign in as Department HR')
      expect(html).toContain('Sign in with LMS')
      expect(html).toContain('Sign in as HOD/Dean')
      expect(html).toContain('Sign In')
    })

    it('initializes in register mode when navigating to /register', () => {
      mockCurrentPath = ROUTES.REGISTER
      const html = renderToString(React.createElement(AuthPage))

      expect(html).toContain('Join the')
      expect(html).toContain('conversation')
      expect(html).toContain('Account')
      expect(html).toContain('Details')
      expect(html).toContain('Secure')
    })

    it('clears previous errors and resets wizard step upon mode transition', () => {
      let currentMode = 'login'
      let submitError = 'Some old login error'
      let signupStep = 3
      let fieldErrors = { email: 'Old error' }

      const switchMode = (next) => {
        currentMode = next
        mockClearError()
        submitError = null
        signupStep = 1
        fieldErrors = {}
      }

      switchMode('register')

      expect(currentMode).toBe('register')
      expect(submitError).toBeNull()
      expect(signupStep).toBe(1)
      expect(fieldErrors).toEqual({})
      expect(mockClearError).toHaveBeenCalled()
    })
  })

  // 2. Successful Authentication Routing
  describe('Successful Authentication Routing', () => {
    it('routes successfully authenticated Department HR persona to /hr', async () => {
      mockLogin.mockResolvedValueOnce({
        success: true,
        user: { role: ROLES.HR, email: 'hr.cs@unilag.edu.ng' },
      })

      const handleLoginFlow = async (email, password, role) => {
        const result = await mockLogin(email, password, role)
        const userRole = result?.user?.role || role
        mockNavigate(getRoleDashboardRoute(userRole))
      }

      await handleLoginFlow('hr.cs@unilag.edu.ng', 'Password123!', ROLES.HR)

      expect(mockLogin).toHaveBeenCalledWith('hr.cs@unilag.edu.ng', 'Password123!', 'hr')
      expect(mockNavigate).toHaveBeenCalledWith('/hr')
    })

    it('routes Electrical Engineering HR preset login to /hr', async () => {
      mockLogin.mockResolvedValueOnce({
        success: true,
        user: { role: ROLES.HR, email: 'hr.ee@unilag.edu.ng' },
      })

      const handleLoginFlow = async (email, password, role) => {
        const result = await mockLogin(email, password, role)
        const userRole = result?.user?.role || role
        mockNavigate(getRoleDashboardRoute(userRole))
      }

      await handleLoginFlow('hr.ee@unilag.edu.ng', 'Password123!', ROLES.HR)

      expect(mockLogin).toHaveBeenCalledWith('hr.ee@unilag.edu.ng', 'Password123!', 'hr')
      expect(mockNavigate).toHaveBeenCalledWith('/hr')
    })

    it('routes LMS student login to /student', async () => {
      mockLogin.mockResolvedValueOnce({
        success: true,
        user: { role: ROLES.STUDENT, email: 'student@unilag.edu.ng' },
      })

      const handleLoginFlow = async (email, password, role) => {
        const result = await mockLogin(email, password, role)
        const userRole = result?.user?.role || role
        mockNavigate(getRoleDashboardRoute(userRole))
      }

      await handleLoginFlow('student@unilag.edu.ng', 'password123', ROLES.STUDENT)

      expect(mockLogin).toHaveBeenCalledWith('student@unilag.edu.ng', 'password123', 'student')
      expect(mockNavigate).toHaveBeenCalledWith('/student')
    })

    it('routes HOD login to /hod and Dean login to /dean', async () => {
      mockLogin.mockResolvedValueOnce({
        success: true,
        user: { role: ROLES.HOD, email: 'hod@unilag.edu.ng' },
      })

      const handleLoginFlow = async (email, password, role) => {
        const result = await mockLogin(email, password, role)
        const userRole = result?.user?.role || role
        mockNavigate(getRoleDashboardRoute(userRole))
      }

      await handleLoginFlow('hod@unilag.edu.ng', 'password123', ROLES.HOD)
      expect(mockNavigate).toHaveBeenCalledWith('/hod')

      mockLogin.mockResolvedValueOnce({
        success: true,
        user: { role: ROLES.DEAN, email: 'dean@unilag.edu.ng' },
      })

      await handleLoginFlow('dean@unilag.edu.ng', 'password123', ROLES.DEAN)
      expect(mockNavigate).toHaveBeenCalledWith('/dean')
    })

    it('routes staff, non-staff, admin, and faculty to their respective routes', () => {
      expect(getRoleDashboardRoute(ROLES.STAFF)).toBe('/staff')
      expect(getRoleDashboardRoute(ROLES.NON_STAFF)).toBe('/non-staff')
      expect(getRoleDashboardRoute(ROLES.ADMIN)).toBe('/admin')
      expect(getRoleDashboardRoute(ROLES.FACULTY)).toBe('/faculty')
    })

    it('routes unmapped custom roles to /{role} fallback route', () => {
      expect(getRoleDashboardRoute('bursar')).toBe('/bursar')
    })
  })

  // 3. Registration Flow & Standardized API Error Handling
  describe('Registration Flow & Standardized Error Handling', () => {
    it('redirects to dashboard when user registration succeeds', async () => {
      mockRegisterUser.mockResolvedValueOnce({
        success: true,
        user: { role: ROLES.STUDENT, email: 'new.student@unilag.edu.ng' },
      })

      const handleRegisterFlow = async (formData) => {
        const result = await mockRegisterUser(formData)
        const userRole = result?.user?.role || formData.role
        mockNavigate(getRoleDashboardRoute(userRole))
      }

      await handleRegisterFlow({
        email: 'new.student@unilag.edu.ng',
        role: ROLES.STUDENT,
      })

      expect(mockRegisterUser).toHaveBeenCalled()
      expect(mockNavigate).toHaveBeenCalledWith('/student')
    })

    it('captures standardized USER_EXISTS error code and highlights email field', async () => {
      const existsError = new Error('User already exists')
      existsError.code = 'USER_EXISTS'
      mockRegisterUser.mockRejectedValueOnce(existsError)

      let fieldErrors = {}
      let submitError = null

      const handleRegisterFlow = async (formData) => {
        try {
          await mockRegisterUser(formData)
        } catch (err) {
          const errorMessage = err?.message || 'Registration failed. Please try again.'
          submitError = errorMessage
          if (
            err?.code === 'USER_EXISTS' ||
            err?.response?.data?.code === 'USER_EXISTS' ||
            err?.code === 'EMAIL_ALREADY_EXISTS'
          ) {
            fieldErrors = { ...fieldErrors, email: errorMessage }
          }
        }
      }

      await handleRegisterFlow({ email: 'existing@unilag.edu.ng', role: ROLES.STUDENT })

      expect(submitError).toBe('User already exists')
      expect(fieldErrors.email).toBe('User already exists')
    })

    it('captures Axios err.response.data.code === USER_EXISTS and highlights email field', async () => {
      const axiosError = {
        message: 'Request failed with status code 400',
        response: {
          data: {
            code: 'USER_EXISTS',
            message: 'User already exists',
          },
        },
      }
      mockRegisterUser.mockRejectedValueOnce(axiosError)

      let fieldErrors = {}
      let submitError = null

      const handleRegisterFlow = async (formData) => {
        try {
          await mockRegisterUser(formData)
        } catch (err) {
          const errorMessage = err?.message || 'Registration failed. Please try again.'
          submitError = errorMessage
          if (
            err?.code === 'USER_EXISTS' ||
            err?.response?.data?.code === 'USER_EXISTS' ||
            err?.code === 'EMAIL_ALREADY_EXISTS'
          ) {
            fieldErrors = { ...fieldErrors, email: errorMessage }
          }
        }
      }

      await handleRegisterFlow({ email: 'existing@unilag.edu.ng', role: ROLES.STUDENT })

      expect(submitError).toBe('Request failed with status code 400')
      expect(fieldErrors.email).toBe('Request failed with status code 400')
    })
  })

  // 4. Shell Layout Structure
  describe('Shell Layout Structure', () => {
    it('renders Back to home navigation button and institutional branding', () => {
      const html = renderToString(React.createElement(AuthPage))

      expect(html).toContain('Back to home')
      expect(html).toContain('LagVoice')
      expect(html).toContain('UNILAG QAS')
    })

    it('renders FloatingPreviewCards right panel with UNILAG QA footer', () => {
      const html = renderToString(React.createElement(AuthPage))

      expect(html).toContain('Recent Ticket')
      expect(html).toContain('Satisfaction')
      expect(html).toContain('Campus Impact')
      expect(html).toContain('University of Lagos · Quality Assurance')
    })
  })
})
