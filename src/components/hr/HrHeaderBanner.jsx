import React from 'react'
import {
  Building2,
  ShieldCheck,
  RefreshCw,
  Calendar,
  Sparkles,
  Users2,
  FileSpreadsheet
} from 'lucide-react'

/**
 * HrHeaderBanner
 * UNILAG LagVoice Styled HR Dashboard Header Banner
 * Palette: Navy (#1E1B4B), Maroon (#800000), Gold (#D4AF37), Cream (#F0F3F8)
 */
export default function HrHeaderBanner({
  user,
  lastUpdated,
  onRefresh,
  refreshing = false,
  totalStaff = 0,
  pendingAppraisals = 0,
}) {
  const departmentName = user?.department || 'Department Administration'
  const facultyName = user?.faculty || 'University of Lagos'
  const officerName = user?.name || 'Human Resources Officer'

  // Academic session helper
  const currentYear = new Date().getFullYear()
  const academicSession = `${currentYear - 1}/${currentYear}`

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1E1B4B] via-[#2A1B4E] to-[#450A1A] p-6 lg:p-8 text-white shadow-xl border border-indigo-900/40">
      {/* Decorative background glow & pattern elements */}
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#D4AF37]/15 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-[#800000]/25 blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(212,175,55,0.06),transparent_50%)] pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        {/* Left Column: Department identity & welcome greeting */}
        <div className="space-y-3 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase bg-[#D4AF37]/20 text-[#F5DE94] border border-[#D4AF37]/30 shadow-sm backdrop-blur-sm">
              <Sparkles className="w-3 h-3 text-[#D4AF37]" />
              UNILAG Directorate of HR
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold text-slate-300 bg-white/10 backdrop-blur-sm border border-white/10">
              <Building2 className="w-3 h-3 text-slate-300" />
              {facultyName}
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] text-amber-200/80 bg-amber-500/10 border border-amber-400/20">
              <Calendar className="w-3 h-3" />
              {academicSession} Session
            </span>
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Department of {departmentName}
            </h1>
            <p className="mt-1.5 text-sm sm:text-base text-slate-300/90 leading-relaxed font-normal">
              Welcome back, <span className="font-semibold text-white">{officerName}</span>. Monitor departmental staffing, peer review submissions, supervisory appraisals, and staff workplace grievances.
            </p>
          </div>

          {/* Quick micro-stats row */}
          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-300">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Department Status: <strong className="text-white">Active</strong></span>
            </div>
            <span className="text-white/20 hidden sm:inline">•</span>
            <div className="flex items-center gap-1.5">
              <Users2 className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Staff Members: <strong className="text-white">{totalStaff}</strong></span>
            </div>
            {pendingAppraisals > 0 && (
              <>
                <span className="text-white/20 hidden sm:inline">•</span>
                <div className="flex items-center gap-1.5 text-amber-300 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{pendingAppraisals} Appraisals Pending Review</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right Column: Quick Action Controls */}
        <div className="flex flex-row lg:flex-col items-start lg:items-end justify-between sm:justify-start gap-3 pt-2 lg:pt-0 shrink-0 border-t lg:border-t-0 border-white/10">
          <div className="flex items-center gap-2.5">
            <button
              onClick={onRefresh}
              disabled={refreshing}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 active:scale-95 text-white border border-white/20 backdrop-blur-md transition-all duration-200 disabled:opacity-50 cursor-pointer shadow-sm hover:shadow"
              title="Refresh departmental data"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
              <span>{refreshing ? 'Syncing...' : 'Sync Data'}</span>
            </button>
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-[#D4AF37] hover:bg-[#c29e2f] active:scale-95 text-slate-950 shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer"
              title="Print or Export Departmental Summary"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-slate-950" />
              <span className="hidden sm:inline">Export Report</span>
              <span className="sm:hidden">Export</span>
            </button>
          </div>

          {lastUpdated && (
            <p className="text-[11px] text-slate-400 self-center lg:self-end">
              Last synced: {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
