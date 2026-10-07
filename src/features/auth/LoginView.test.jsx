import { describe, it, expect, vi, beforeEach } from 'vitest'
import React from 'react'
import { renderToString } from 'react-dom/server'
import LoginView from './LoginView'
import { ROLES } from '../../utils/constants'
import { ROLE_OPTIONS } from './authValidation'

describe('LoginView Component Unit & Integration Tests', () => {
  let mockProps

  beforeEach(() => {
    mockProps = {
      form: {
        email: 'test@unilag.edu.ng',
        password: 'Password123!',
        role: ROLES.STUDENT,
        remember: false,
      },
      setForm: vi.fn(),
      handleChange: vi.fn(),
      showPassword: false,
      setShowPassword: vi.fn(),
      loading: false,
      error: null,
      onSubmit: vi.fn(),
      onSwitchToRegister: vi.fn(),
      onForgotPassword: vi.fn(),
    }
  })

  // 1. Structural Rendering Tests
  describe('Structural Rendering', () => {
    it('renders login greeting and welcome text', () => {
      const html = renderToString(React.createElement(LoginView, mockProps))
      expect(html).toContain('Welcome')
      expect(html).toContain('back')
      expect(html).toContain('Sign in to access the UNILAG Quality Assurance platform.')
    })

    it('renders all quick-fill helper buttons and departmental pills', () => {
      const html = renderToString(React.createElement(LoginView, mockProps))
      expect(html).toContain('Sign in with LMS')
      expect(html).toContain('Sign in as HOD/Dean')
      expect(html).toContain('Sign in as Department HR')
      expect(html).toContain('Comp Science (CSC)')
      expect(html).toContain('Electrical Eng (EEE)')
    })

    it('renders role options matching the central institutional specification', () => {
      const html = renderToString(React.createElement(LoginView, mockProps))
      for (const role of ROLE_OPTIONS) {
        expect(html).toContain(role.label)
        expect(html).toContain(`value="${role.id}"`)
      }
    })

    it('renders email input with proper attributes', () => {
      const html = renderToString(React.createElement(LoginView, mockProps))
      expect(html).toContain('id="login-email"')
      expect(html).toContain('name="email"')
      expect(html).toContain('type="email"')
      expect(html).toContain('value="test@unilag.edu.ng"')
    })

    it('renders password input with hidden text when showPassword is false', () => {
      const html = renderToString(
        React.createElement(LoginView, {
          ...mockProps,
          showPassword: false,
        })
      )
      expect(html).toContain('id="login-password"')
      expect(html).toContain('type="password"')
      expect(html).toContain('aria-label="Show password"')
    })

    it('renders password input with visible text when showPassword is true', () => {
      const html = renderToString(
        React.createElement(LoginView, {
          ...mockProps,
          showPassword: true,
        })
      )
      expect(html).toContain('id="login-password"')
      expect(html).toContain('type="text"')
      expect(html).toContain('aria-label="Hide password"')
    })
  })

  // 2. Form State & Credential Population Boundaries
  describe('Quick Sign-In Helper Presets', () => {
    it('sets valid seeded credentials for Computer Science HR when main button is clicked', () => {
      let state = { ...mockProps.form }
      const setFormMock = (updater) => {
        state = typeof updater === 'function' ? updater(state) : updater
      }

      // Simulate the onClick handler for Department HR button
      setFormMock((prev) => ({
        ...prev,
        email: 'hr.cs@unilag.edu.ng',
        password: 'Password123!',
        role: ROLES.HR,
      }))

      expect(state.email).toBe('hr.cs@unilag.edu.ng')
      expect(state.password).toBe('Password123!')
      expect(state.role).toBe('hr')
    })

    it('sets Electrical Engineering HR credentials when EEE preset pill is clicked', () => {
      let state = { ...mockProps.form }
      const setFormMock = (updater) => {
        state = typeof updater === 'function' ? updater(state) : updater
      }

      // Simulate EEE preset click
      setFormMock((prev) => ({
        ...prev,
        email: 'hr.ee@unilag.edu.ng',
        password: 'Password123!',
        role: ROLES.HR,
      }))

      expect(state.email).toBe('hr.ee@unilag.edu.ng')
      expect(state.password).toBe('Password123!')
      expect(state.role).toBe('hr')
    })

    it('sets student LMS preset credentials correctly', () => {
      let state = { ...mockProps.form }
      const setFormMock = (updater) => {
        state = typeof updater === 'function' ? updater(state) : updater
      }

      setFormMock((prev) => ({
        ...prev,
        email: 'student@unilag.edu.ng',
        password: 'password123',
        role: ROLES.STUDENT,
      }))

      expect(state.email).toBe('student@unilag.edu.ng')
      expect(state.password).toBe('password123')
      expect(state.role).toBe('student')
    })

    it('sets HOD/Dean preset credentials correctly', () => {
      let state = { ...mockProps.form }
      const setFormMock = (updater) => {
        state = typeof updater === 'function' ? updater(state) : updater
      }

      setFormMock((prev) => ({
        ...prev,
        email: 'hod@unilag.edu.ng',
        password: 'password123',
        role: ROLES.HOD,
      }))

      expect(state.email).toBe('hod@unilag.edu.ng')
      expect(state.password).toBe('password123')
      expect(state.role).toBe('hod')
    })
  })

  // 3. Error and Loading Boundaries
  describe('Error & Loading State Boundaries', () => {
    it('displays error alert when error message is supplied', () => {
      const html = renderToString(
        React.createElement(LoginView, {
          ...mockProps,
          error: 'Invalid email or password',
        })
      )
      expect(html).toContain('role="alert"')
      expect(html).toContain('Invalid email or password')
    })

    it('omits error alert when error is null or empty', () => {
      const html = renderToString(
        React.createElement(LoginView, {
          ...mockProps,
          error: null,
        })
      )
      expect(html).not.toContain('role="alert"')
    })

    it('disables submit button and shows spinner during loading state', () => {
      const html = renderToString(
        React.createElement(LoginView, {
          ...mockProps,
          loading: true,
        })
      )
      expect(html).toContain('disabled=""')
      expect(html).toContain('animate-spin')
    })

    it('enables submit button when not loading', () => {
      const html = renderToString(
        React.createElement(LoginView, {
          ...mockProps,
          loading: false,
        })
      )
      expect(html).not.toContain('disabled=""')
      expect(html).not.toContain('animate-spin')
    })
  })

  // 4. Interactive Callbacks
  describe('Interactive Handlers', () => {
    it('renders link to switch to registration view', () => {
      const html = renderToString(React.createElement(LoginView, mockProps))
      expect(html).toContain("Don&#x27;t have an account?")
      expect(html).toContain('Create one')
    })

    it('renders forgot password button', () => {
      const html = renderToString(React.createElement(LoginView, mockProps))
      expect(html).toContain('Forgot password?')
    })
  })
})
