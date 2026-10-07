import React from 'react'
import { Inbox, Users, CheckCircle, Search } from 'lucide-react'

/**
 * HrEmptyState
 * Visually engaging empty state component matching UNILAG palette
 */
export default function HrEmptyState({
  icon: Icon = Inbox,
  title = 'No Data Available',
  description = 'There are currently no records to display.',
  actionLabel,
  onAction,
  variant = 'default', // 'default' | 'search' | 'success' | 'staff'
  compact = false,
}) {
  const IconComponent =
    variant === 'search'
      ? Search
      : variant === 'success'
      ? CheckCircle
      : variant === 'staff'
      ? Users
      : Icon

  const getVariantStyles = () => {
    switch (variant) {
      case 'success':
        return {
          wrapperBg: 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/40',
          iconColor: 'text-emerald-600 dark:text-emerald-400',
          iconBg: 'bg-emerald-100 dark:bg-emerald-900/50',
        }
      case 'search':
        return {
          wrapperBg: 'bg-amber-50/60 dark:bg-amber-950/20 border-amber-200/80 dark:border-amber-800/40',
          iconColor: 'text-amber-600 dark:text-amber-400',
          iconBg: 'bg-amber-100 dark:bg-amber-900/40',
        }
      case 'staff':
        return {
          wrapperBg: 'bg-indigo-50/60 dark:bg-indigo-950/20 border-indigo-200/80 dark:border-indigo-800/40',
          iconColor: 'text-[#1E1B4B] dark:text-indigo-300',
          iconBg: 'bg-indigo-100 dark:bg-indigo-900/40',
        }
      default:
        return {
          wrapperBg: 'bg-slate-50/80 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-700/60',
          iconColor: 'text-slate-500 dark:text-slate-400',
          iconBg: 'bg-slate-100 dark:bg-slate-800',
        }
    }
  }

  const styles = getVariantStyles()

  return (
    <div
      className={`rounded-2xl border text-center flex flex-col items-center justify-center transition-all ${
        compact ? 'p-6' : 'p-8 lg:p-12'
      } ${styles.wrapperBg}`}
    >
      <div
        className={`rounded-2xl flex items-center justify-center mb-4 transition-transform hover:scale-105 ${
          compact ? 'w-12 h-12' : 'w-16 h-16'
        } ${styles.iconBg}`}
      >
        <IconComponent className={`${compact ? 'w-6 h-6' : 'w-8 h-8'} ${styles.iconColor}`} />
      </div>

      <h3 className="text-base lg:text-lg font-bold text-slate-900 dark:text-slate-100 mb-1">
        {title}
      </h3>

      <p className="text-xs lg:text-sm text-slate-500 dark:text-slate-400 max-w-md leading-relaxed mb-4">
        {description}
      </p>

      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#1266f1] hover:bg-[#0e52c1] shadow-sm hover:shadow transition-all active:scale-95"
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}
