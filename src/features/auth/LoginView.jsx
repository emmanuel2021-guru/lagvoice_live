import { ROLES } from '../../utils/constants'
import { ROLE_OPTIONS } from './authValidation'

/**
 * LoginView component for AuthPage
 */
export default function LoginView({
  form,
  setForm,
  handleChange,
  showPassword,
  setShowPassword,
  loading,
  error,
  onSubmit,
  onSwitchToRegister,
  onForgotPassword,
}) {
  return (
    <div>
      <h1 className="text-[1.6rem] sm:text-[1.8rem] lg:text-[2.2rem] text-ink font-bold leading-[1.1] tracking-tight mb-1.5">
        Welcome<br />back<span className="text-maroon">.</span>
      </h1>
      <p className="text-ink/40 text-[13px] sm:text-[14px] mb-5 sm:mb-6 leading-relaxed">
        Sign in to access the UNILAG Quality Assurance platform.
      </p>

      {import.meta.env.DEV && (
        <>
          {/* Quick Sign-In Helper: Student */}
          <button
            type="button"
            onClick={() => {
              setForm(prev => ({ ...prev, email: 'student@unilag.edu.ng', password: 'password123', role: ROLES.STUDENT }))
            }}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-white border border-mist/80 hover:bg-mist/30 transition-colors mb-2 shadow-[0_2px_8px_rgba(0,0,0,0.04)] group"
          >
            <div className="w-6 h-6 rounded-md bg-maroon/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg className="w-4 h-4 text-maroon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
              </svg>
            </div>
            <span className="text-[13px] font-bold text-ink">Sign in with LMS</span>
          </button>

          {/* Quick Sign-In Helper: HOD / Dean */}
          <button
            type="button"
            onClick={() => {
              setForm(prev => ({ ...prev, email: 'hod@unilag.edu.ng', password: 'password123', role: ROLES.HOD }))
            }}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-white border border-mist/80 hover:bg-mist/30 transition-colors mb-2 shadow-[0_2px_8px_rgba(0,0,0,0.04)] group"
          >
            <div className="w-6 h-6 rounded-md bg-[#1976D2]/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg className="w-4 h-4 text-[#1976D2]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="text-[13px] font-bold text-ink">Sign in as HOD/Dean</span>
          </button>

          {/* Quick Sign-In Helper: Department HR */}
          <div className="mb-6 space-y-2">
            <button
              type="button"
              onClick={() => {
                setForm(prev => ({ ...prev, email: 'hr.cs@unilag.edu.ng', password: 'Password123!', role: ROLES.HR }))
              }}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-white border border-mist/80 hover:bg-mist/30 transition-colors shadow-[0_2px_8px_rgba(0,0,0,0.04)] group"
            >
              <div className="w-6 h-6 rounded-md bg-[#7B1FA2]/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg className="w-4 h-4 text-[#7B1FA2]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <span className="text-[13px] font-bold text-ink">Sign in as Department HR</span>
            </button>

            <div className="flex items-center justify-center gap-2 pt-0.5">
              <span className="text-[11px] text-ink/40 font-medium">HR Dept:</span>
              <button
                type="button"
                onClick={() => {
                  setForm(prev => ({ ...prev, email: 'hr.cs@unilag.edu.ng', password: 'Password123!', role: ROLES.HR }))
                }}
                className={`text-[11px] px-2.5 py-0.5 rounded-md font-medium transition-colors ${
                  form.email === 'hr.cs@unilag.edu.ng' && form.role === ROLES.HR
                    ? 'bg-[#7B1FA2]/15 text-[#7B1FA2] font-semibold'
                    : 'bg-mist-light text-ink/60 hover:text-ink hover:bg-mist/50'
                }`}
              >
                Comp Science (CSC)
              </button>
              <button
                type="button"
                onClick={() => {
                  setForm(prev => ({ ...prev, email: 'hr.ee@unilag.edu.ng', password: 'Password123!', role: ROLES.HR }))
                }}
                className={`text-[11px] px-2.5 py-0.5 rounded-md font-medium transition-colors ${
                  form.email === 'hr.ee@unilag.edu.ng' && form.role === ROLES.HR
                    ? 'bg-[#7B1FA2]/15 text-[#7B1FA2] font-semibold'
                    : 'bg-mist-light text-ink/60 hover:text-ink hover:bg-mist/50'
                }`}
              >
                Electrical Eng (EEE)
              </button>
            </div>
          </div>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-mist/60" />
            <span className="text-[10px] uppercase tracking-wider font-semibold text-ink/30">Or use email</span>
            <div className="flex-1 h-px bg-mist/60" />
          </div>
        </>
      )}

      <form onSubmit={onSubmit} className="space-y-3.5">
        {/* Role */}
        <div>
          <label className="block text-[11px] font-semibold text-ink/40 uppercase tracking-[0.15em] mb-2">
            Signing in as
          </label>
          <div className="relative">
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full px-4 py-3 text-[14px] rounded-xl bg-white border border-mist/80 text-ink
                focus:outline-none focus:ring-2 focus:ring-maroon/15 focus:border-maroon/40
                transition-all duration-200 appearance-none cursor-pointer
                bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2016%2016%22%3E%3Cpath%20fill%3D%22%23800000%22%20d%3D%22M4.5%206l3.5%204%203.5-4z%22/%3E%3C/svg%3E')]
                bg-no-repeat bg-[right_14px_center] shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
            >
              {ROLE_OPTIONS.map(r => <option key={r.id} value={r.id}>{r.label}</option>)}
            </select>
          </div>
        </div>

        {/* Email */}
        <div>
          <label htmlFor="login-email" className="block text-[11px] font-semibold text-ink/40 uppercase tracking-[0.15em] mb-2">
            Email or Student ID
          </label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg className="w-4 h-4 text-ink/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
              </svg>
            </div>
            <input
              id="login-email"
              name="email"
              type="email"
              placeholder="you@student.unilag.edu.ng"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full pl-11 pr-4 py-3 text-[14px] rounded-xl bg-white border border-mist/80 text-ink
                placeholder:text-ink/25
                focus:outline-none focus:ring-2 focus:ring-maroon/15 focus:border-maroon/40
                transition-all duration-200 shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="login-password" className="block text-[11px] font-semibold text-ink/40 uppercase tracking-[0.15em]">
              Password
            </label>
            <button
              type="button"
              onClick={onForgotPassword}
              className="text-[11px] text-gold-dark hover:text-gold font-medium transition-colors"
            >
              Forgot password?
            </button>
          </div>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg className="w-4 h-4 text-ink/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <input
              id="login-password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full pl-11 pr-11 py-3 text-[14px] rounded-xl bg-white border border-mist/80 text-ink
                placeholder:text-ink/25
                focus:outline-none focus:ring-2 focus:ring-maroon/15 focus:border-maroon/40
                transition-all duration-200 shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-ink/20 hover:text-ink/40 transition-colors"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Remember me */}
        <label className="flex items-center gap-2.5 cursor-pointer group pt-1">
          <div className="relative">
            <input
              type="checkbox"
              name="remember"
              checked={form.remember}
              onChange={handleChange}
              className="peer sr-only"
            />
            <div className="w-[18px] h-[18px] rounded-md border-[1.5px] border-mist bg-white
              peer-checked:bg-maroon peer-checked:border-maroon
              transition-all duration-200 flex items-center justify-center
              group-hover:border-ink/30">
              {form.remember && (
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
          </div>
          <span className="text-[13px] text-ink/40 group-hover:text-ink/55 transition-colors">Remember me</span>
        </label>

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
            relative overflow-hidden group mt-2"
        >
          <span className={`transition-all duration-200 ${loading ? 'translate-y-[-20px] opacity-0' : ''}`}>
            Sign In
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

      {/* Switch to Sign up link */}
      <p className="mt-5 text-center text-[13px] text-ink/35">
        Don't have an account?{' '}
        <button
          type="button"
          onClick={onSwitchToRegister}
          className="text-maroon font-semibold hover:text-maroon-dark transition-colors inline-flex items-center gap-1 group"
        >
          Create one
          <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </p>
    </div>
  )
}
