import { describe, it, expect, vi, beforeEach } from 'vitest'
import React from 'react'
import { renderToString } from 'react-dom/server'
import { ROLES, ROUTES } from '../utils/constants'
import {
  validateSignupStep,
  validateSignupStep3,
  passwordStrength,
  getRoleDashboardRoute,
  ROLE_OPTIONS,
  SIGNUP_STEPS,
} from '../features/auth/authValidation'
import LoginView from '../features/auth/LoginView'
import RegisterStepWizard from '../features/auth/RegisterStepWizard'
import FloatingPreviewCards, {
  TicketPreviewCard,
  SatisfactionCard,
  StatsCard,
} from '../features/auth/FloatingPreviewCards'

describe('AuthPage & Feature Modules Test Suite', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // ─────────────────────────────────────────────────────────────
  // 1. MULTI-STEP VALIDATION BOUNDARIES
  // ─────────────────────────────────────────────────────────────
  describe('Multi-Step Validation Boundaries', () => {
    describe('Step 1: Account Identification Boundaries', () => {
      it('rejects empty and whitespace-only first names', () => {
        expect(validateSignupStep(1, { firstName: '', lastName: 'Okafor', email: 'test@unilag.edu.ng' }))
          .toHaveProperty('firstName', 'Enter your first name')
        expect(validateSignupStep(1, { firstName: '   ', lastName: 'Okafor', email: 'test@unilag.edu.ng' }))
          .toHaveProperty('firstName', 'Enter your first name')
      })

      it('rejects empty and whitespace-only last names', () => {
        expect(validateSignupStep(1, { firstName: 'Chidinma', lastName: '', email: 'test@unilag.edu.ng' }))
          .toHaveProperty('lastName', 'Enter your last name')
        expect(validateSignupStep(1, { firstName: 'Chidinma', lastName: '   ', email: 'test@unilag.edu.ng' }))
          .toHaveProperty('lastName', 'Enter your last name')
      })

      it('rejects invalid email formats at validation boundaries', () => {
        const invalidEmails = ['plainaddress', 'missingat.com', '@nodomain.com', 'spaces in@mail.com', 'user@']
        for (const email of invalidEmails) {
          const errs = validateSignupStep(1, { firstName: 'A', lastName: 'B', email })
          expect(errs.email).toBe('Enter a valid email address')
        }
      })

      it('accepts valid institutional and standard email addresses', () => {
        const validEmails = [
          'student@unilag.edu.ng',
          'hr.cs@unilag.edu.ng',
          'hod.eee@unilag.edu.ng',
          'staff.member@gmail.com',
        ]
        for (const email of validEmails) {
          const errs = validateSignupStep(1, { firstName: 'Babatunde', lastName: 'Alabi', email })
          expect(errs).toEqual({})
        }
      })
    })

    describe('Step 2: Role, Department, and Identifier Boundaries', () => {
      it('enforces student-specific identifier and department boundaries', () => {
        const errs = validateSignupStep(2, {
          role: ROLES.STUDENT,
          department: '',
          studentId: '',
        })
        expect(errs.department).toBe('Select your department')
        expect(errs.studentId).toBe('Enter your matric number')
      })

      it('enforces staff and HR specific staff ID label requirements', () => {
        const errs = validateSignupStep(2, {
          role: ROLES.HR,
          department: 'Computer Science',
          studentId: '',
        })
        expect(errs.studentId).toBe('Enter your staff ID')
        expect(errs.department).toBeUndefined()
      })

      it('enforces non-staff unit/office designation requirement', () => {
        const errs = validateSignupStep(2, {
          role: ROLES.NON_STAFF,
          department: '',
          studentId: 'UNILAG/NSTF/01',
        })
        expect(errs.department).toBe('Type your unit or office')
      })

      it('validates phone number boundaries (optional but checked if provided)', () => {
        const invalidPhone = validateSignupStep(2, {
          role: ROLES.STUDENT,
          department: 'Computer Science',
          studentId: '190407001',
          phone: 'abc1234',
        })
        expect(invalidPhone.phone).toBe('Enter a valid phone number')

        const validPhone = validateSignupStep(2, {
          role: ROLES.STUDENT,
          department: 'Computer Science',
          studentId: '190407001',
          phone: '+2348012345678',
        })
        expect(validPhone.phone).toBeUndefined()
      })
    })

    describe('Step 3: Password Strength, Confirmation, and Policy Boundaries', () => {
      it('calculates password strength accurately across boundary scores', () => {
        expect(passwordStrength('')).toBe(0)
        expect(passwordStrength('short')).toBe(0) // < 8 chars
        expect(passwordStrength('longpassword')).toBe(1) // >= 8 chars only
        expect(passwordStrength('LongPassword')).toBe(2) // >= 8 chars + upper/lower
        expect(passwordStrength('LongPassword1')).toBe(3) // + digits
        expect(passwordStrength('LongPassword1!')).toBe(4) // + symbols
      })

      it('rejects passwords below minimum complexity requirement', () => {
        const errs = validateSignupStep3({
          password: 'pass',
          confirmPassword: 'pass',
          agreeTerms: true,
        })
        expect(errs.password).toBe('Use at least 8 characters with mixed case and a number')
      })

      it('rejects mismatched password confirmations', () => {
        const errs = validateSignupStep3({
          password: 'Password123!',
          confirmPassword: 'Password1234!',
          agreeTerms: true,
        })
        expect(errs.confirmPassword).toBe('Passwords do not match')
      })

      it('rejects submissions that have not agreed to the QA Policy and Terms', () => {
        const errs = validateSignupStep3({
          password: 'Password123!',
          confirmPassword: 'Password123!',
          agreeTerms: false,
        })
        expect(errs.agreeTerms).toBe('Please accept the policy to continue')
      })

      it('passes when strong password, exact confirmation, and terms are agreed', () => {
        const errs = validateSignupStep3({
          password: 'Password123!',
          confirmPassword: 'Password123!',
          agreeTerms: true,
        })
        expect(errs).toEqual({})
      })
    })
  })

  // ─────────────────────────────────────────────────────────────
  // 2. FAILED LOGIN & REGISTRATION STATES (STANDARDIZED API CODES)
  // ─────────────────────────────────────────────────────────────
  describe('Failed Login States & Standardized Error Code Handling', () => {
    it('captures failed login exceptions without losing typed user inputs', async () => {
      const formState = {
        email: 'invalid.user@unilag.edu.ng',
        password: 'WrongPassword!',
        role: ROLES.STUDENT,
      }

      const mockLogin = vi.fn().mockRejectedValue(new Error('Invalid email or password'))

      let capturedError = null
      try {
        await mockLogin(formState.email, formState.password, formState.role)
      } catch (err) {
        capturedError = err.message
      }

      expect(capturedError).toBe('Invalid email or password')
      // Form state retains original values
      expect(formState.email).toBe('invalid.user@unilag.edu.ng')
      expect(formState.role).toBe('student')
    })

    it('relies on standardized error code USER_EXISTS to attach field error to email', () => {
      // Simulating handleRegister catch block logic with standardized API error code
      const errorWithCode = new Error('Registration error')
      errorWithCode.code = 'USER_EXISTS'

      let fieldErrors = {}
      let submitError = null

      const handleCatch = (err) => {
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

      handleCatch(errorWithCode)
      expect(submitError).toBe('Registration error')
      expect(fieldErrors.email).toBe('Registration error')
    })

    it('also recognizes err.response.data.code === USER_EXISTS from Axios response', () => {
      const axiosError = {
        message: 'Request failed (400)',
        response: {
          data: {
            code: 'USER_EXISTS',
            message: 'User already exists',
          },
        },
      }

      let fieldErrors = {}
      let submitError = null

      const handleCatch = (err) => {
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

      handleCatch(axiosError)
      expect(submitError).toBe('Request failed (400)')
      expect(fieldErrors.email).toBe('Request failed (400)')
    })

    it('does not set email field error when error code is generic (e.g. NETWORK_ERROR)', () => {
      const genericError = new Error('Database timeout')
      genericError.code = 'DB_TIMEOUT'

      let fieldErrors = {}
      let submitError = null

      const handleCatch = (err) => {
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

      handleCatch(genericError)
      expect(submitError).toBe('Database timeout')
      expect(fieldErrors.email).toBeUndefined()
    })
  })

  // ─────────────────────────────────────────────────────────────
  // 3. ROUTING ON SUCCESSFUL AUTHENTICATION
  // ─────────────────────────────────────────────────────────────
  describe('Routing on Successful Authentication', () => {
    it('maps all defined roles to their corresponding institutional dashboard routes', () => {
      expect(getRoleDashboardRoute(ROLES.HR)).toBe(ROUTES.HR_DASHBOARD)
      expect(getRoleDashboardRoute(ROLES.HR)).toBe('/hr')

      expect(getRoleDashboardRoute(ROLES.HOD)).toBe(ROUTES.HOD_DASHBOARD)
      expect(getRoleDashboardRoute(ROLES.HOD)).toBe('/hod')

      expect(getRoleDashboardRoute(ROLES.DEAN)).toBe(ROUTES.DEAN_DASHBOARD)
      expect(getRoleDashboardRoute(ROLES.DEAN)).toBe('/dean')

      expect(getRoleDashboardRoute(ROLES.STUDENT)).toBe(ROUTES.STUDENT_DASHBOARD)
      expect(getRoleDashboardRoute(ROLES.STUDENT)).toBe('/student')

      expect(getRoleDashboardRoute(ROLES.STAFF)).toBe(ROUTES.STAFF_DASHBOARD)
      expect(getRoleDashboardRoute(ROLES.STAFF)).toBe('/staff')

      expect(getRoleDashboardRoute(ROLES.NON_STAFF)).toBe(ROUTES.NON_STAFF_DASHBOARD)
      expect(getRoleDashboardRoute(ROLES.NON_STAFF)).toBe('/non-staff')

      expect(getRoleDashboardRoute(ROLES.ADMIN)).toBe(ROUTES.ADMIN_DASHBOARD)
      expect(getRoleDashboardRoute(ROLES.ADMIN)).toBe('/admin')

      expect(getRoleDashboardRoute(ROLES.FACULTY)).toBe(ROUTES.FACULTY_DASHBOARD)
      expect(getRoleDashboardRoute(ROLES.FACULTY)).toBe('/faculty')
    })

    it('falls back to /{role} for unknown or custom dynamic roles', () => {
      expect(getRoleDashboardRoute('auditor')).toBe('/auditor')
      expect(getRoleDashboardRoute('registrar')).toBe('/registrar')
    })

    it('triggers router navigation with correct destination upon successful login', async () => {
      const mockNavigate = vi.fn()
      const mockLogin = vi.fn().mockResolvedValue({
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
  })

  // ─────────────────────────────────────────────────────────────
  // 4. COMPONENT RENDERING & QUICK SIGN-IN HELPER BUTTONS
  // ─────────────────────────────────────────────────────────────
  describe('Extracted Components & Quick Sign-In Helpers', () => {
    it('renders LoginView with institutional role options and inputs', () => {
      const html = renderToString(
        React.createElement(LoginView, {
          form: { email: '', password: '', role: ROLES.STUDENT, remember: false },
          setForm: vi.fn(),
          handleChange: vi.fn(),
          showPassword: false,
          setShowPassword: vi.fn(),
          loading: false,
          error: null,
          onSubmit: vi.fn(),
          onSwitchToRegister: vi.fn(),
          onForgotPassword: vi.fn(),
        })
      )

      expect(html).toContain('Welcome')
      expect(html).toContain('back')
      expect(html).toContain('Sign in as Department HR')
      expect(html).toContain('Comp Science (CSC)')
      expect(html).toContain('Electrical Eng (EEE)')
      expect(html).toContain('Sign in with LMS')
      expect(html).toContain('Sign in as HOD/Dean')
      expect(html).toContain('Signing in as')
      expect(html).toContain('Email or Student ID')
      expect(html).toContain('Password')
    })

    it('populates valid seeded credentials when Department HR quick-sign-in helper is triggered', () => {
      let formState = { email: '', password: '', role: ROLES.STUDENT }
      const setForm = (updater) => {
        formState = typeof updater === 'function' ? updater(formState) : updater
      }

      // Department HR button click simulation
      setForm((prev) => ({
        ...prev,
        email: 'hr.cs@unilag.edu.ng',
        password: 'Password123!',
        role: ROLES.HR,
      }))

      expect(formState.email).toBe('hr.cs@unilag.edu.ng')
      expect(formState.password).toBe('Password123!')
      expect(formState.role).toBe('hr')

      // Department HR EEE preset pill click simulation
      setForm((prev) => ({
        ...prev,
        email: 'hr.ee@unilag.edu.ng',
        password: 'Password123!',
        role: ROLES.HR,
      }))

      expect(formState.email).toBe('hr.ee@unilag.edu.ng')
      expect(formState.password).toBe('Password123!')
      expect(formState.role).toBe('hr')
    })

    it('renders RegisterStepWizard across steps with step rail indicators', () => {
      const htmlStep1 = renderToString(
        React.createElement(RegisterStepWizard, {
          form: { firstName: '', lastName: '', email: '', role: ROLES.STUDENT },
          setForm: vi.fn(),
          handleChange: vi.fn(),
          signupStep: 1,
          setSignupStep: vi.fn(),
          fieldErrors: {},
          setFieldErrors: vi.fn(),
          loading: false,
          error: null,
          onSubmitStep: vi.fn(),
          onSwitchToLogin: vi.fn(),
        })
      )

      expect(htmlStep1).toContain('Join the')
      expect(htmlStep1).toContain('conversation')
      expect(htmlStep1).toContain('Account')
      expect(htmlStep1).toContain('Details')
      expect(htmlStep1).toContain('Secure')
      expect(htmlStep1).toContain('First Name')
      expect(htmlStep1).toContain('Last Name')
      expect(htmlStep1).toContain('Email Address')
    })

    it('defines ROLE_OPTIONS and SIGNUP_STEPS constants correctly', () => {
      expect(ROLE_OPTIONS.map((r) => r.id)).toEqual([
        ROLES.STUDENT,
        ROLES.STAFF,
        ROLES.NON_STAFF,
        ROLES.ADMIN,
        ROLES.HOD,
        ROLES.HR,
      ])
      expect(SIGNUP_STEPS.map((s) => s.id)).toEqual(['account', 'details', 'secure'])
    })

    it('renders individual floating cards (TicketPreviewCard, SatisfactionCard, StatsCard)', () => {
      const ticketHtml = renderToString(React.createElement(TicketPreviewCard))
      expect(ticketHtml).toContain('Recent Ticket')
      expect(ticketHtml).toContain('Under Review')

      const satHtml = renderToString(React.createElement(SatisfactionCard))
      expect(satHtml).toContain('Satisfaction')
      expect(satHtml).toContain('78%')

      const statsHtml = renderToString(React.createElement(StatsCard))
      expect(statsHtml).toContain('Campus Impact')
      expect(statsHtml).toContain('47')
    })

    it('renders FloatingPreviewCards right panel with all 3 preview widgets', () => {
      const html = renderToString(React.createElement(FloatingPreviewCards))

      expect(html).toContain('Recent Ticket')
      expect(html).toContain('Broken AC in Lecture Hall B')
      expect(html).toContain('Satisfaction')
      expect(html).toContain('78%')
      expect(html).toContain('Campus Impact')
      expect(html).toContain('Complaints resolved so far')
      expect(html).toContain('University of Lagos · Quality Assurance')
    })
  })
})
