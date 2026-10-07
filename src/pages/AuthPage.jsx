/**
 * AuthPage — Canonical Authentication Entry Point
 * Split-screen layout:
 * - Left Panel: LoginView / RegisterStepWizard
 * - Right Panel: FloatingPreviewCards
 */
import { useState, useCallback, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { ROLES, ROUTES } from '../utils/constants'
import {
  LoginView,
  RegisterStepWizard,
  FloatingPreviewCards,
  validateSignupStep,
  validateSignupStep3,
  getRoleDashboardRoute,
} from '../features/auth'

export default function AuthPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, registerUser, loading, error, clearError } = useAuth()

  const [mode, setMode] = useState(location.pathname === ROUTES.REGISTER ? 'register' : 'login')
  const [showPassword, setShowPassword] = useState(false)
  const [signupStep, setSignupStep] = useState(1)
  const [fieldErrors, setFieldErrors] = useState({})
  const [submitError, setSubmitError] = useState(null)
  const [form, setForm] = useState({
    email: '',
    password: '',
    role: ROLES.STUDENT,
    remember: false,
    firstName: '',
    lastName: '',
    studentId: '',
    department: '',
    faculty: 'Science',
    phone: '',
    confirmPassword: '',
    agreeTerms: false,
  })

  // Synchronize route pathname changes (/login vs /register)
  useEffect(() => {
    if (location.pathname === ROUTES.REGISTER) {
      setMode('register')
    } else if (location.pathname === ROUTES.LOGIN) {
      setMode('login')
    }
  }, [location.pathname])

  const switchMode = useCallback(
    (next) => {
      setMode(next)
      clearError()
      setSubmitError(null)
      setSignupStep(1)
      setFieldErrors({})
    },
    [clearError]
  )

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
    if (error) clearError()
    if (submitError) setSubmitError(null)
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const next = { ...prev }
        delete next[name]
        return next
      })
    }
  }

  const handleLogin = async (e) => {
    if (e && e.preventDefault) e.preventDefault()
    setSubmitError(null)
    try {
      const result = await login(form.email, form.password, form.role)
      if (result?.meta?.requestStatus === 'fulfilled' || result?.success || result?.user) {
        const userRole = result?.payload?.user?.role || result?.user?.role || form.role
        navigate(getRoleDashboardRoute(userRole))
      }
    } catch (err) {
      setSubmitError(err?.message || 'Login failed')
    }
  }

  const handleRegister = async () => {
    setSubmitError(null)
    try {
      const result = await registerUser({
        ...form,
        role: form.role,
      })
      if (result?.success || result?.user || result?.meta?.requestStatus === 'fulfilled') {
        const userRole = result?.user?.role || result?.payload?.user?.role || form.role
        navigate(getRoleDashboardRoute(userRole))
      }
    } catch (err) {
      const errorMessage = err?.message || 'Registration failed. Please try again.'
      setSubmitError(errorMessage)

      // Rely on standardized API error code rather than string-matching err.message
      if (
        err?.code === 'USER_EXISTS' ||
        err?.response?.data?.code === 'USER_EXISTS' ||
        err?.code === 'EMAIL_ALREADY_EXISTS'
      ) {
        setFieldErrors((prev) => ({ ...prev, email: errorMessage }))
      }
    }
  }

  const handleRegisterStep = (e) => {
    if (e && e.preventDefault) e.preventDefault()
    if (signupStep < 3) {
      const errs = validateSignupStep(signupStep, form)
      setFieldErrors(errs)
      if (Object.keys(errs).length === 0) {
        setSignupStep((s) => Math.min(s + 1, 3))
      }
      return
    }

    const errs = validateSignupStep3(form)
    setFieldErrors(errs)
    if (Object.keys(errs).length > 0) {
      return
    }

    handleRegister()
  }

  return (
    <div className="auth-surface min-h-screen flex flex-col lg:flex-row bg-gradient-to-br from-[#F5F0EB] via-[#FAF8F3] to-[#F0EDE8]">
      {/* ─── Left Panel: Auth Form ─── */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8 lg:p-10 min-h-screen overflow-y-auto">
        <div className="w-full max-w-[420px]">
          {/* Back to Home */}
          <button
            onClick={() => navigate(ROUTES.HOME)}
            className="flex items-center gap-2 text-[13px] text-ink/40 hover:text-ink/70 font-medium transition-colors mb-5 group"
            aria-label="Back to home page"
          >
            <svg
              className="w-4 h-4 group-hover:-translate-x-1 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to home
          </button>

          {/* Logo */}
          <div className="flex items-center gap-3 mb-6 sm:mb-8">
            <img
              src="/images/logo-n.png"
              alt="LagVoice"
              className="w-12 h-12 rounded-xl object-cover shadow-[0_2px_8px_rgba(128,0,0,0.15)]"
            />
            <div>
              <span className="text-ink font-bold text-lg tracking-tight">LagVoice</span>
              <span className="text-ink/20 mx-1.5">·</span>
              <span className="text-ink/30 text-[10px] tracking-widest uppercase font-medium">UNILAG QAS</span>
            </div>
          </div>

          {/* ── Login Form View ── */}
          <div
            className={`transition-all duration-[500ms] ease-[cubic-bezier(0.4,0,0.2,1)] ${
              mode === 'login'
                ? 'opacity-100 translate-y-0 scale-100 relative'
                : 'opacity-0 translate-y-4 scale-[0.98] absolute inset-0 pointer-events-none'
            }`}
          >
            <LoginView
              form={form}
              setForm={setForm}
              handleChange={handleChange}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              loading={loading}
              error={error || submitError}
              onSubmit={handleLogin}
              onSwitchToRegister={() => switchMode('register')}
              onForgotPassword={() => navigate(ROUTES.FORGOT_PASSWORD)}
            />
          </div>

          {/* ── Register Wizard View ── */}
          <div
            className={`transition-all duration-[500ms] ease-[cubic-bezier(0.4,0,0.2,1)] ${
              mode === 'register'
                ? 'opacity-100 translate-y-0 scale-100 relative'
                : 'opacity-0 translate-y-4 scale-[0.98] absolute inset-0 pointer-events-none'
            }`}
          >
            <RegisterStepWizard
              form={form}
              setForm={setForm}
              handleChange={handleChange}
              signupStep={signupStep}
              setSignupStep={setSignupStep}
              fieldErrors={fieldErrors}
              setFieldErrors={setFieldErrors}
              loading={loading}
              error={error || submitError}
              onSubmitStep={handleRegisterStep}
              onSwitchToLogin={() => switchMode('login')}
            />
          </div>
        </div>
      </div>

      {/* ─── Right Panel: Floating Preview Cards ─── */}
      <FloatingPreviewCards />
    </div>
  )
}
