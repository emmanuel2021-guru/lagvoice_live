import React from 'react'
import { AlertTriangle, RefreshCw, X } from 'lucide-react'

/**
 * HrErrorAlert
 * Accessible, clear error alert with optional retry mechanism
 */
export default function HrErrorAlert({
  title = 'Failed to Load Departmental Data',
  message = 'An unexpected error occurred while communicating with the HR service. Please verify your connection or try again.',
  onRetry,
  retrying = false,
  onDismiss,
  className = '',
}) {
  return (
    <div
      role="alert"
      className={`rounded-2xl p-4 lg:p-5 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/40 text-rose-900 dark:text-rose-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all ${className}`}
    >
      <div className="flex items-start gap-3.5">
        <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-900/60 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0 text-rose-600 dark:text-rose-400">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-rose-950 dark:text-rose-100">{title}</h4>
          <p className="text-xs text-rose-700 dark:text-rose-300/90 mt-0.5 leading-relaxed max-w-2xl">
            {message}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
        {onRetry && (
          <button
            onClick={onRetry}
            disabled={retrying}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-700 active:scale-95 text-white shadow-sm transition-all disabled:opacity-60 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${retrying ? 'animate-spin' : ''}`} />
            <span>{retrying ? 'Retrying...' : 'Retry'}</span>
          </button>
        )}
        {onDismiss && (
          <button
            onClick={onDismiss}
            aria-label="Dismiss error"
            className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  )
}
