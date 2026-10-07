import { describe, it, expect, vi, beforeEach } from 'vitest'
import React from 'react'
import { renderToString } from 'react-dom/server'
import RegisterStepWizard from './RegisterStepWizard'
import { ROLES } from '../../utils/constants'
import { validateSignupStep, validateSignupStep3, passwordStrength } from './authValidation'

describe('RegisterStepWizard Component Unit & Integration Tests', () => {
  let defaultProps

  beforeEach(() => {
    defaultProps = {
      form: {
        firstName: 'Chidinma',
        lastName: 'Okafor',
        email: 'chidinma@student.unilag.edu.ng',
        role: ROLES.STUDENT,
        department: 'Computer Science',
        studentId: '190407001',
        phone: '08012345678',
        password: 'Password123!',
        confirmPassword: 'Password123!',
        agreeTerms: true,
      },
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
    }
  })

  // 1. Step 1: Account Identification View & Validation Boundaries
  describe('Step 1 (Account Identification)', () => {
    it('renders step 1 inputs and active step rail indicator', () => {
      const html = renderToString(
        React.createElement(RegisterStepWizard, {
          ...defaultProps,
          signupStep: 1,
        })
      )

      expect(html).toContain('First Name')
      expect(html).toContain('Last Name')
      expect(html).toContain('Email Address')
      expect(html).toContain('value="Chidinma"')
      expect(html).toContain('value="Okafor"')
      expect(html).toContain('value="chidinma@student.unilag.edu.ng"')
      expect(html).toContain('Continue')
    })

    it('renders inline FieldError messages on Step 1 validation failures', () => {
      const fieldErrors = {
        firstName: 'Enter your first name',
        lastName: 'Enter your last name',
        email: 'Enter a valid email address',
      }

      const html = renderToString(
        React.createElement(RegisterStepWizard, {
          ...defaultProps,
          signupStep: 1,
          fieldErrors,
        })
      )

      expect(html).toContain('Enter your first name')
      expect(html).toContain('Enter your last name')
      expect(html).toContain('Enter a valid email address')
    })

    it('validates Step 1 boundaries accurately using validateSignupStep', () => {
      // Empty inputs boundary
      const emptyErrs = validateSignupStep(1, { firstName: '', lastName: '', email: '' })
      expect(emptyErrs.firstName).toBe('Enter your first name')
      expect(emptyErrs.lastName).toBe('Enter your last name')
      expect(emptyErrs.email).toBe('Enter a valid email address')

      // Valid boundary
      const validErrs = validateSignupStep(1, {
        firstName: 'Babatunde',
        lastName: 'Alabi',
        email: 'hr.cs@unilag.edu.ng',
      })
      expect(validErrs).toEqual({})
    })
  })

  // 2. Step 2: Role and Department Specification View & Boundaries
  describe('Step 2 (Details & Institutional Association)', () => {
    it('renders student-specific label and department dropdown for Student role', () => {
      const html = renderToString(
        React.createElement(RegisterStepWizard, {
          ...defaultProps,
          signupStep: 2,
          form: {
            ...defaultProps.form,
            role: ROLES.STUDENT,
          },
        })
      )

      expect(html).toContain('Student ID (Matric Number)')
      expect(html).toContain('Department')
      expect(html).toContain('<select name="department"')
    })

    it('renders Staff ID label for Staff and Department HR roles', () => {
      const html = renderToString(
        React.createElement(RegisterStepWizard, {
          ...defaultProps,
          signupStep: 2,
          form: {
            ...defaultProps.form,
            role: ROLES.HR,
          },
        })
      )

      expect(html).toContain('Staff ID')
      expect(html).not.toContain('Matric Number')
    })

    it('renders Unit / Office text input instead of department select for Non-Staff role', () => {
      const html = renderToString(
        React.createElement(RegisterStepWizard, {
          ...defaultProps,
          signupStep: 2,
          form: {
            ...defaultProps.form,
            role: ROLES.NON_STAFF,
            department: 'Works and Physical Planning',
          },
        })
      )

      expect(html).toContain('Unit / Office')
      expect(html).toContain('placeholder="Type your unit or office"')
      expect(html).toContain('value="Works and Physical Planning"')
    })

    it('renders inline FieldError messages on Step 2 validation failures', () => {
      const fieldErrors = {
        department: 'Select your department',
        studentId: 'Enter your matric number',
        phone: 'Enter a valid phone number',
      }

      const html = renderToString(
        React.createElement(RegisterStepWizard, {
          ...defaultProps,
          signupStep: 2,
          fieldErrors,
        })
      )

      expect(html).toContain('Select your department')
      expect(html).toContain('Enter your matric number')
      expect(html).toContain('Enter a valid phone number')
    })

    it('validates Step 2 boundaries accurately using validateSignupStep', () => {
      const studentErrs = validateSignupStep(2, {
        role: ROLES.STUDENT,
        department: '',
        studentId: '',
        phone: 'invalid-num',
      })
      expect(studentErrs.department).toBe('Select your department')
      expect(studentErrs.studentId).toBe('Enter your matric number')
      expect(studentErrs.phone).toBe('Enter a valid phone number')

      const hrErrs = validateSignupStep(2, {
        role: ROLES.HR,
        department: 'Computer Science',
        studentId: 'UNILAG/HR/001',
        phone: '08012345678',
      })
      expect(hrErrs).toEqual({})
    })
  })

  // 3. Step 3: Security, Review, and Policy Boundaries
  describe('Step 3 (Security, Review, & Policy Agreement)', () => {
    it('renders password fields, strength meter, review card, and policy agreement', () => {
      const html = renderToString(
        React.createElement(RegisterStepWizard, {
          ...defaultProps,
          signupStep: 3,
        })
      )

      expect(html).toContain('Password')
      expect(html).toContain('Confirm Password')
      expect(html).toContain('Review your details')
      expect(html).toContain('Chidinma Okafor')
      expect(html).toContain('chidinma@student.unilag.edu.ng')
      expect(html).toContain('Computer Science')
      expect(html).toContain('UNILAG QAS Policy')
      expect(html).toContain('Terms of Service')
      expect(html).toContain('Create Account')
    })

    it('renders password strength indicator score correctly on Step 3', () => {
      expect(passwordStrength('')).toBe(0)
      expect(passwordStrength('simple')).toBe(0)
      expect(passwordStrength('ComplexPassword123!')).toBe(4)

      const html = renderToString(
        React.createElement(RegisterStepWizard, {
          ...defaultProps,
          signupStep: 3,
          form: {
            ...defaultProps.form,
            password: 'StrongPassword123!',
          },
        })
      )

      expect(html).toContain('Strong')
    })

    it('renders inline FieldErrors on Step 3 validation failures', () => {
      const fieldErrors = {
        password: 'Use at least 8 characters with mixed case and a number',
        confirmPassword: 'Passwords do not match',
        agreeTerms: 'Please accept the policy to continue',
      }

      const html = renderToString(
        React.createElement(RegisterStepWizard, {
          ...defaultProps,
          signupStep: 3,
          fieldErrors,
        })
      )

      expect(html).toContain('Use at least 8 characters with mixed case and a number')
      expect(html).toContain('Passwords do not match')
      expect(html).toContain('Please accept the policy to continue')
    })

    it('validates Step 3 boundaries accurately using validateSignupStep3', () => {
      const weakErrs = validateSignupStep3({
        password: 'weak',
        confirmPassword: 'weak',
        agreeTerms: true,
      })
      expect(weakErrs.password).toBe('Use at least 8 characters with mixed case and a number')

      const mismatchErrs = validateSignupStep3({
        password: 'Password123!',
        confirmPassword: 'Different123!',
        agreeTerms: true,
      })
      expect(mismatchErrs.confirmPassword).toBe('Passwords do not match')

      const termsErrs = validateSignupStep3({
        password: 'Password123!',
        confirmPassword: 'Password123!',
        agreeTerms: false,
      })
      expect(termsErrs.agreeTerms).toBe('Please accept the policy to continue')

      const validErrs = validateSignupStep3({
        password: 'Password123!',
        confirmPassword: 'Password123!',
        agreeTerms: true,
      })
      expect(validErrs).toEqual({})
    })
  })

  // 4. Loading & Error States
  describe('Loading and Error State Presentation', () => {
    it('renders global submission error alert', () => {
      const html = renderToString(
        React.createElement(RegisterStepWizard, {
          ...defaultProps,
          signupStep: 1,
          error: 'An account with this email already exists',
        })
      )

      expect(html).toContain('role="alert"')
      expect(html).toContain('An account with this email already exists')
    })

    it('disables submission button during loading and shows spinner', () => {
      const html = renderToString(
        React.createElement(RegisterStepWizard, {
          ...defaultProps,
          signupStep: 3,
          loading: true,
        })
      )

      expect(html).toContain('disabled=""')
      expect(html).toContain('animate-spin')
    })

    it('renders link to switch back to login mode', () => {
      const html = renderToString(
        React.createElement(RegisterStepWizard, {
          ...defaultProps,
          signupStep: 1,
        })
      )

      expect(html).toContain('Already have an account?')
      expect(html).toContain('Sign in')
    })
  })
})
