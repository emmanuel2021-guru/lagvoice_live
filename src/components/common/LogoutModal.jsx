import { useEffect } from 'react'

/**
 * LogoutModal — Shared accessible confirmation modal for logging out.
 * Supports light & dark modes, keyboard Escape dismiss, and overlay click dismiss.
 */
export default function LogoutModal({ open, onConfirm, onCancel }) {
  useEffect(() => {
    if (!open) return
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onCancel()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open, onCancel])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Confirm logout"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onCancel}
        data-testid="logout-backdrop"
      />

      {/* Modal Dialog Card */}
      <div className="relative bg-white dark:bg-[#1e293b] rounded-2xl shadow-2xl w-full max-w-[380px] p-8 animate-slide-in-up border border-[#E4E8EE] dark:border-white/10">
        <div className="w-14 h-14 rounded-2xl bg-[#f93154]/10 flex items-center justify-center mx-auto mb-5">
          <svg className="w-7 h-7 text-[#f93154]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
          </svg>
        </div>

        <h3 className="text-[18px] font-bold text-[#262626] dark:text-white text-center mb-2">
          Log out?
        </h3>
        <p className="text-[13px] text-[#9fa6b2] dark:text-white/50 text-center mb-7 leading-relaxed">
          You will be signed out of your account and redirected to the login page.
        </p>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-3 rounded-xl border border-[#E4E8EE] dark:border-white/10 text-[14px] font-semibold text-[#4f4f4f] dark:text-white/70 hover:bg-[#F5F7FA] dark:hover:bg-white/5 transition-all duration-200"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 py-3 rounded-xl bg-[#f93154] text-white text-[14px] font-semibold hover:bg-[#d42843] active:scale-[0.98] transition-all duration-200 shadow-[0_4px_14px_rgba(249,49,84,0.25)]"
          >
            Log out
          </button>
        </div>
      </div>
    </div>
  )
}
