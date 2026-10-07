import React from 'react'

/**
 * HrLoadingSkeleton
 * High-fidelity loading state placeholder matching the HR Dashboard visual hierarchy
 */
export default function HrLoadingSkeleton() {
  return (
    <div className="space-y-6 animate-pulse" aria-busy="true" aria-label="Loading HR Dashboard">
      {/* Header Banner Skeleton */}
      <div className="relative overflow-hidden rounded-2xl p-6 lg:p-8 bg-slate-200 dark:bg-slate-800/60 border border-slate-300 dark:border-slate-700/60 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-3 max-w-xl">
            <div className="h-4 w-32 bg-slate-300 dark:bg-slate-700 rounded-full" />
            <div className="h-8 w-72 lg:w-96 bg-slate-300 dark:bg-slate-700 rounded-xl" />
            <div className="h-4 w-56 bg-slate-300 dark:bg-slate-700 rounded-lg" />
          </div>
          <div className="flex items-center gap-3">
            <div className="h-10 w-28 bg-slate-300 dark:bg-slate-700 rounded-xl" />
            <div className="h-10 w-32 bg-slate-300 dark:bg-slate-700 rounded-xl" />
          </div>
        </div>
      </div>

      {/* KPI Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="rounded-2xl p-5 bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 shadow-sm space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="h-3 w-28 bg-slate-200 dark:bg-slate-700 rounded-full" />
              <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-700" />
            </div>
            <div className="h-9 w-24 bg-slate-200 dark:bg-slate-700 rounded-lg" />
            <div className="h-3 w-40 bg-slate-200 dark:bg-slate-700 rounded-full" />
          </div>
        ))}
      </div>

      {/* Two Column Section: Chart + Grievances */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Chart Skeleton */}
        <div className="lg:col-span-7 rounded-2xl p-6 bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700/50 pb-4">
            <div className="space-y-1.5">
              <div className="h-5 w-48 bg-slate-200 dark:bg-slate-700 rounded-lg" />
              <div className="h-3 w-36 bg-slate-200 dark:bg-slate-700 rounded-full" />
            </div>
            <div className="h-8 w-24 bg-slate-200 dark:bg-slate-700 rounded-lg" />
          </div>
          <div className="h-64 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-end p-4 gap-4">
            {[40, 70, 55, 90, 65, 80].map((h, idx) => (
              <div
                key={idx}
                className="flex-1 bg-slate-200 dark:bg-slate-700 rounded-t-lg transition-all"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
        </div>

        {/* Grievances Feed Skeleton */}
        <div className="lg:col-span-5 rounded-2xl p-6 bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700/50 pb-4">
            <div className="h-5 w-44 bg-slate-200 dark:bg-slate-700 rounded-lg" />
            <div className="h-6 w-16 bg-slate-200 dark:bg-slate-700 rounded-full" />
          </div>
          <div className="space-y-3">
            {[1, 2, 3].map((idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-700/40 bg-slate-50/50 dark:bg-slate-800/40 space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <div className="h-3.5 w-24 bg-slate-200 dark:bg-slate-700 rounded-full" />
                  <div className="h-5 w-16 bg-slate-200 dark:bg-slate-700 rounded-full" />
                </div>
                <div className="h-4 w-5/6 bg-slate-200 dark:bg-slate-700 rounded-md" />
                <div className="h-3 w-1/2 bg-slate-200 dark:bg-slate-700 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Staff Roster Skeleton */}
      <div className="rounded-2xl p-6 bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 dark:border-slate-700/50 pb-4">
          <div className="h-6 w-48 bg-slate-200 dark:bg-slate-700 rounded-lg" />
          <div className="flex items-center gap-3">
            <div className="h-9 w-44 bg-slate-200 dark:bg-slate-700 rounded-lg" />
            <div className="h-9 w-32 bg-slate-200 dark:bg-slate-700 rounded-lg" />
          </div>
        </div>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="h-12 bg-slate-100 dark:bg-slate-800/60 rounded-xl flex items-center px-4 justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700" />
                <div className="h-4 w-32 bg-slate-200 dark:bg-slate-700 rounded-md" />
              </div>
              <div className="h-4 w-24 bg-slate-200 dark:bg-slate-700 rounded-md hidden sm:block" />
              <div className="h-6 w-20 bg-slate-200 dark:bg-slate-700 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
