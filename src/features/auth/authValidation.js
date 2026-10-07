import { ROLES, ROUTES } from '../../utils/constants'

export const ROLE_OPTIONS = [
  { id: ROLES.STUDENT, label: 'Student' },
  { id: ROLES.STAFF, label: 'Staff' },
  { id: ROLES.NON_STAFF, label: 'Non-Staff' },
  { id: ROLES.ADMIN, label: 'Administrator' },
  { id: ROLES.HOD, label: 'HOD / Dean' },
  { id: ROLES.HR, label: 'Department HR' },
]

export const SIGNUP_STEPS = [
  { id: 'account', label: 'Account' },
  { id: 'details', label: 'Details' },
  { id: 'secure', label: 'Secure' },
]

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * Calculates password strength score (0 to 4)
 */
export const passwordStrength = (pw) => {
  if (!pw) return 0
  let score = 0
  if (pw.length >= 8) score += 1
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score += 1
  if (/\d/.test(pw)) score += 1
  if (/[^A-Za-z0-9]/.test(pw)) score += 1
  return score
}

export const STRENGTH_LABELS = ['Too weak', 'Weak', 'Fair', 'Good', 'Strong']
export const STRENGTH_COLORS = ['bg-red-400', 'bg-orange-400', 'bg-yellow-400', 'bg-lime-500', 'bg-emerald-500']

/**
 * Validates step 1 and step 2 of registration wizard
 */
export const validateSignupStep = (step, form = {}) => {
  const errs = {}
  if (step === 1) {
    if (!String(form.firstName || '').trim()) errs.firstName = 'Enter your first name'
    if (!String(form.lastName || '').trim()) errs.lastName = 'Enter your last name'
    if (!EMAIL_RE.test(String(form.email || '').trim())) errs.email = 'Enter a valid email address'
  }
  if (step === 2) {
    if (!String(form.department || '').trim()) {
      errs.department = form.role === ROLES.NON_STAFF ? 'Type your unit or office' : 'Select your department'
    }
    if (!String(form.studentId || '').trim()) {
      errs.studentId = form.role === ROLES.STUDENT ? 'Enter your matric number' : 'Enter your staff ID'
    }
    if (form.phone && !/^[+\d][\d\s-]{6,14}$/.test(String(form.phone).trim())) {
      errs.phone = 'Enter a valid phone number'
    }
  }
  return errs
}

/**
 * Validates step 3 (passwords, terms agreement)
 */
export const validateSignupStep3 = (form = {}) => {
  const errs = {}
  if (!form.password || passwordStrength(form.password) < 2) {
    errs.password = 'Use at least 8 characters with mixed case and a number'
  }
  if (form.confirmPassword !== form.password) {
    errs.confirmPassword = 'Passwords do not match'
  }
  if (!form.agreeTerms) {
    errs.agreeTerms = 'Please accept the policy to continue'
  }
  return errs
}

/**
 * Returns canonical route for user role
 */
export const getRoleDashboardRoute = (role) => {
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
