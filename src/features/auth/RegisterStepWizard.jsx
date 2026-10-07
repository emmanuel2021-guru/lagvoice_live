import { Fragment } from 'react'
import { DEPARTMENTS } from '../../services/userService'
import { ROLES } from '../../utils/constants'
import {
  SIGNUP_STEPS,
  ROLE_OPTIONS,
  passwordStrength,
  STRENGTH_LABELS,
  STRENGTH_COLORS,
} from './authValidation'

function FieldError({ message }) {
  if (!message) return null
  return <p className="text-[11px] text-red-500 mt-1.5">{message}</p>
}

/**
 * RegisterStepWizard component for AuthPage
 */
export default function RegisterStepWizard({
  form,
  setForm,
  handleChange,
  signupStep,
  setSignupStep,
  fieldErrors = {},
  setFieldErrors,
  loading,
  error,
  onSubmitStep,
  onSwitchToLogin,
}) {
  const strength = passwordStrength(form.password)
  const strengthLabel = STRENGTH_LABELS[strength] || 'Too weak'
  const strengthColor = STRENGTH_COLORS[strength] || 'bg-red-400'

  const errCls = (name) =>
    fieldErrors[name]
      ? 'border-red-400 focus:ring-red-400/15 focus:border-red-400/50'
      : 'border-mist/80 focus:ring-maroon/15 focus:border-maroon/40'

  const inputCls = (name) => `w-full px-4 py-3 text-[14px] rounded-xl bg-white border ${errCls(name)} text-ink
    placeholder:text-ink/25 focus:outline-none focus:ring-2 transition-all duration-200 shadow-[0_1px_2px_rgba(0,0,0,0.04)]`

  const selectCls = (name) => `w-full px-4 py-3 text-[14px] rounded-xl bg-white border ${errCls(name)} text-ink
    focus:outline-none focus:ring-2 transition-all duration-200 appearance-none cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.04)]
    bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2016%2016%22%3E%3Cpath%20fill%3D%22%23800000%22%20d%3D%22M4.5%206l3.5%204%203.5-4z%22/%3E%3C/svg%3E')]
    bg-no-repeat bg-[right_12px_center]`

  const stepSubtitles = [
    'Create your account in three quick steps.',
    'Tell us about your role and where you work or study.',
    'Secure your account and review your details.',
  ]

  return (
    <div>
      <h1 className="text-[1.6rem] sm:text-[1.8rem] lg:text-[2.2rem] text-ink font-bold leading-[1.1] tracking-tight mb-1.5">
        Join the<br />conversation<span className="text-gold">.</span>
      </h1>
      <p className="text-ink/40 text-[13px] sm:text-[14px] mb-5 sm:mb-6 leading-relaxed">
        {stepSubtitles[signupStep - 1]}
      </p>

      <form onSubmit={onSubmitStep} noValidate className="space-y-3 sm:space-y-3.5">
        {/* Step rail */}
        <div className="flex items-center gap-2 mb-4" aria-label="Sign-up steps">
          {SIGNUP_STEPS.map((s, i) => (
            <Fragment key={s.id}>
              <button
                type="button"
                onClick={() => {
                  if (i < signupStep) {
                    setSignupStep(i + 1)
                  }
                }}
                className={`flex items-center gap-2 ${i < signupStep ? 'cursor-pointer' : 'cursor-default'}`}
                aria-current={signupStep === i + 1 ? 'step' : undefined}
              >
                <span
                  className={`w-6 h-6 rounded-full text-[11px] font-bold flex items-center justify-center transition-all duration-300 ${
                    signupStep > i + 1
                      ? 'bg-emerald-500 text-white'
                      : signupStep === i + 1
                      ? 'bg-maroon text-white shadow-[0_2px_8px_rgba(128,0,0,0.3)] scale-110'
                      : 'bg-mist/60 text-ink/30'
                  }`}
                >
                  {signupStep > i + 1 ? (
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    i + 1
                  )}
                </span>
                <span
                  className={`text-[11px] font-semibold uppercase tracking-wider transition-colors ${
                    signupStep === i + 1 ? 'text-maroon' : 'text-ink/25'
                  }`}
                >
                  {s.label}
                </span>
              </button>
              {i < SIGNUP_STEPS.length - 1 && (
                <span
                  className={`flex-1 h-px transition-colors duration-500 ${
                    signupStep > i + 1 ? 'bg-emerald-400/60' : 'bg-mist/60'
                  }`}
                />
              )}
            </Fragment>
          ))}
        </div>

        {/* Step 1: Account */}
        {signupStep === 1 && (
          <div className="space-y-3 animate-fade-step">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-ink/40 uppercase tracking-[0.15em] mb-1.5">
                  First Name
                </label>
                <input
                  name="firstName"
                  placeholder="Chidinma"
                  value={form.firstName}
                  onChange={handleChange}
                  className={inputCls('firstName')}
                />
                <FieldError message={fieldErrors.firstName} />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-ink/40 uppercase tracking-[0.15em] mb-1.5">
                  Last Name
                </label>
                <input
                  name="lastName"
                  placeholder="Okafor"
                  value={form.lastName}
                  onChange={handleChange}
                  className={inputCls('lastName')}
                />
                <FieldError message={fieldErrors.lastName} />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-ink/40 uppercase tracking-[0.15em] mb-1.5">
                Email Address
              </label>
              <input
                name="email"
                type="email"
                placeholder="you@student.unilag.edu.ng"
                value={form.email}
                onChange={handleChange}
                className={inputCls('email')}
              />
              <FieldError message={fieldErrors.email} />
            </div>
          </div>
        )}

        {/* Step 2: Details */}
        {signupStep === 2 && (
          <div className="space-y-3 animate-fade-step">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-ink/40 uppercase tracking-[0.15em] mb-1.5">
                  Role
                </label>
                <select name="role" value={form.role} onChange={handleChange} className={selectCls('role')}>
                  <option value={ROLES.STUDENT}>Student</option>
                  <option value={ROLES.STAFF}>Staff</option>
                  <option value={ROLES.NON_STAFF}>Non-Staff</option>
                  <option value={ROLES.HR}>Department HR</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-ink/40 uppercase tracking-[0.15em] mb-1.5">
                  {form.role === ROLES.NON_STAFF ? 'Unit / Office' : 'Department'}
                </label>
                {form.role === ROLES.NON_STAFF ? (
                  <input
                    name="department"
                    placeholder="Type your unit or office"
                    value={form.department}
                    onChange={handleChange}
                    className={inputCls('department')}
                  />
                ) : (
                  <select
                    name="department"
                    value={form.department}
                    onChange={handleChange}
                    className={selectCls('department')}
                  >
                    <option value="">Select</option>
                    {DEPARTMENTS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                )}
                <FieldError message={fieldErrors.department} />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-ink/40 uppercase tracking-[0.15em] mb-1.5">
                {form.role === ROLES.STUDENT ? 'Student ID (Matric Number)' : 'Staff ID'}
              </label>
              <input
                name="studentId"
                placeholder={form.role === ROLES.STUDENT ? 'e.g., 2021/12345' : 'e.g., UNILAG/STF/0482'}
                value={form.studentId}
                onChange={handleChange}
                className={inputCls('studentId')}
              />
              <FieldError message={fieldErrors.studentId} />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-ink/40 uppercase tracking-[0.15em] mb-1.5">
                Phone Number
              </label>
              <input
                name="phone"
                type="tel"
                placeholder="080 0000 0000"
                value={form.phone}
                onChange={handleChange}
                className={inputCls('phone')}
              />
              <FieldError message={fieldErrors.phone} />
            </div>
          </div>
        )}

        {/* Step 3: Secure */}
        {signupStep === 3 && (
          <div className="space-y-3 animate-fade-step">
            <div>
              <label className="block text-[11px] font-semibold text-ink/40 uppercase tracking-[0.15em] mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg className="w-4 h-4 text-ink/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  name="password"
                  type="password"
                  placeholder="Create a strong password"
                  value={form.password}
                  onChange={handleChange}
                  className={`w-full pl-11 pr-4 py-3 text-[14px] rounded-xl bg-white border ${errCls('password')} text-ink
                    placeholder:text-ink/25 focus:outline-none focus:ring-2 transition-all duration-200 shadow-[0_1px_2px_rgba(0,0,0,0.04)]`}
                />
              </div>

              {/* Strength meter */}
              {form.password && (
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex-1 flex gap-1">
                    {[0, 1, 2, 3].map((seg) => (
                      <span
                        key={seg}
                        className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                          seg < strength ? strengthColor : 'bg-mist/70'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] font-semibold text-ink/40 w-16 text-right">{strengthLabel}</span>
                </div>
              )}
              <FieldError message={fieldErrors.password} />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-ink/40 uppercase tracking-[0.15em] mb-1.5">
                Confirm Password
              </label>
              <input
                name="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={form.confirmPassword}
                onChange={handleChange}
                className={inputCls('confirmPassword')}
              />
              <FieldError message={fieldErrors.confirmPassword} />
            </div>

            {/* Review */}
            <div className="rounded-xl bg-cream/70 border border-mist/50 p-4">
              <p className="text-[11px] font-semibold text-ink/40 uppercase tracking-[0.15em] mb-2.5">
                Review your details
              </p>
              <div className="space-y-1.5">
                {[
                  ['Name', `${form.firstName} ${form.lastName}`.trim() || '—'],
                  ['Email', form.email || '—'],
                  ['Role', ROLE_OPTIONS.find((r) => r.id === form.role)?.label || form.role],
                  ['Department', form.department || '—'],
                  [form.role === ROLES.STUDENT ? 'Student ID' : 'Staff ID', form.studentId || '—'],
                  ['Phone', form.phone || '—'],
                ].map(([k, v]) => (
                  <div key={k} className="flex items-center justify-between gap-3 text-[12px]">
                    <span className="text-ink/35">{k}</span>
                    <span className="text-ink font-medium text-right truncate max-w-[60%]">{v}</span>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => {
                  setFieldErrors({})
                  setSignupStep(2)
                }}
                className="mt-3 text-[12px] font-semibold text-maroon hover:text-maroon-dark transition-colors"
              >
                Edit details
              </button>
            </div>

            {/* Terms */}
            <div className="flex items-start gap-2.5 pt-1">
              <div
                className="relative mt-0.5 cursor-pointer group"
                onClick={() => {
                  setForm((prev) => ({ ...prev, agreeTerms: !prev.agreeTerms }))
                  if (fieldErrors.agreeTerms) {
                    setFieldErrors((prev) => {
                      const next = { ...prev }
                      delete next.agreeTerms
                      return next
                    })
                  }
                }}
              >
                <input
                  id="agreeTerms"
                  type="checkbox"
                  name="agreeTerms"
                  checked={form.agreeTerms}
                  readOnly
                  className="sr-only"
                  required
                />
                <div
                  className={`w-[18px] h-[18px] rounded-md border-[1.5px] transition-all duration-200 flex items-center justify-center ${
                    form.agreeTerms ? 'bg-maroon border-maroon' : 'border-mist bg-white group-hover:border-ink/30'
                  }`}
                >
                  {form.agreeTerms && (
                    <svg className="w-3 h-3 text-white pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>
              <span
                className="text-[13px] text-ink/35 hover:text-ink/50 transition-colors leading-relaxed cursor-pointer"
                onClick={() => {
                  setForm((prev) => ({ ...prev, agreeTerms: !prev.agreeTerms }))
                  if (fieldErrors.agreeTerms) {
                    setFieldErrors((prev) => {
                      const next = { ...prev }
                      delete next.agreeTerms
                      return next
                    })
                  }
                }}
              >
                I agree to the <span className="text-maroon font-medium">UNILAG QAS Policy</span> and{' '}
                <span className="text-maroon font-medium">Terms of Service</span>
              </span>
            </div>
            <FieldError message={fieldErrors.agreeTerms} />
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="px-4 py-3 rounded-xl bg-escalated/5 border border-escalated/15 animate-shake" role="alert">
            <p className="text-[13px] text-escalated font-medium">{error}</p>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 rounded-xl bg-maroon text-white font-semibold text-[14px]
            shadow-[0_4px_14px_rgba(128,0,0,0.25)] hover:shadow-[0_8px_25px_rgba(128,0,0,0.35)]
            hover:bg-maroon-dark active:bg-maroon-deep active:scale-[0.98]
            transition-all duration-300 ease-out
            disabled:opacity-50 disabled:cursor-not-allowed
            relative overflow-hidden group mt-1"
        >
          <span
            className={`inline-flex items-center gap-2 transition-all duration-200 ${
              loading ? 'translate-y-[-20px] opacity-0' : ''
            }`}
          >
            {signupStep < 3 ? 'Continue' : 'Create Account'}
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d={signupStep < 3 ? 'M13 7l5 5-5 5M18 12H3' : 'M5 13l4 4L19 7'}
              />
            </svg>
          </span>
          {loading && (
            <svg className="animate-spin absolute inset-0 m-auto h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
        </button>
      </form>

      {/* Switch to Sign in */}
      <p className="mt-5 text-center text-[13px] text-ink/35">
        Already have an account?{' '}
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="text-maroon font-semibold hover:text-maroon-dark transition-colors inline-flex items-center gap-1 group"
        >
          <svg className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Sign in
        </button>
      </p>
    </div>
  )
}
