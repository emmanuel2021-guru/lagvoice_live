import React from 'react'
import {
  Users,
  CheckCircle2,
  AlertCircle,
  Star,
  TrendingUp,
  FileCheck,
  ShieldAlert
} from 'lucide-react'

/**
 * HrKpiStats
 * 4 Core Metric Stat Cards for Departmental HR Officers
 * 1. Total departmental staff
 * 2. Appraisal submission rate
 * 3. Open staff tickets / complaints
 * 4. Average supervisory score
 */
export default function HrKpiStats({
  totalStaff = 0,
  staffBreakdown = { academic: 0, nonAcademic: 0 },
  appraisalRate = 0,
  appraisalSummary = { fullyCompleted: 0, total: 0 },
  openComplaints = 0,
  urgentComplaints = 0,
  supervisoryScore = 0,
  peerReviewScore = 0,
  onCardClick,
}) {
  const formattedScore = Number(supervisoryScore || 0).toFixed(1)
  const formattedRate = Number(appraisalRate || 0).toFixed(0)

  // Evaluation qualitative assessment
  const getScoreRating = (val) => {
    const num = parseFloat(val)
    if (num >= 4.5) return { label: 'Excellent', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/40' }
    if (num >= 3.5) return { label: 'Good Standing', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-950/40' }
    if (num >= 2.5) return { label: 'Satisfactory', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/40' }
    if (num > 0) return { label: 'Needs Attention', color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-50 dark:bg-rose-950/40' }
    return { label: 'Not Graded Yet', color: 'text-slate-500 dark:text-slate-400', bg: 'bg-slate-50 dark:bg-slate-800' }
  }

  const scoreRating = getScoreRating(formattedScore)

  const cards = [
    {
      id: 'staff',
      title: 'Departmental Staff',
      value: totalStaff,
      suffix: '',
      subtitle: staffBreakdown.academic > 0 || staffBreakdown.nonAcademic > 0
        ? `${staffBreakdown.academic} Academic • ${staffBreakdown.nonAcademic} Non-Academic`
        : 'Registered personnel in department',
      icon: Users,
      badgeText: 'Active Roster',
      badgeClass: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-200/50 dark:border-indigo-800/40',
      iconBg: 'bg-[#1E1B4B]/10 dark:bg-indigo-900/30 text-[#1E1B4B] dark:text-indigo-400',
      accentColor: '#1E1B4B',
      indicatorText: `${totalStaff} Active Members`,
      indicatorIcon: TrendingUp,
      indicatorColor: 'text-indigo-600 dark:text-indigo-400',
    },
    {
      id: 'appraisals',
      title: 'Appraisal Submission Rate',
      value: `${formattedRate}%`,
      subtitle: appraisalSummary.total > 0
        ? `${appraisalSummary.fullyCompleted} of ${appraisalSummary.total} staff completed`
        : 'Supervisory & peer assessments',
      icon: CheckCircle2,
      badgeText: formattedRate >= 75 ? 'On Target' : 'In Progress',
      badgeClass: formattedRate >= 75
        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200/50 dark:border-emerald-800/40'
        : 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200/50 dark:border-amber-800/40',
      iconBg: 'bg-emerald-500/10 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400',
      accentColor: '#2E7D32',
      progressBar: Math.min(Math.max(parseFloat(formattedRate) || 0, 0), 100),
      indicatorText: `${appraisalSummary.fullyCompleted} Full Submissions`,
      indicatorIcon: FileCheck,
      indicatorColor: 'text-emerald-600 dark:text-emerald-400',
    },
    {
      id: 'grievances',
      title: 'Open Staff Grievances',
      value: openComplaints,
      subtitle: urgentComplaints > 0
        ? `${urgentComplaints} flagged as high urgency`
        : openComplaints === 0 ? 'No pending departmental issues' : 'Active internal complaint tickets',
      icon: AlertCircle,
      badgeText: openComplaints > 0 ? (urgentComplaints > 0 ? 'Urgent Action' : 'Action Required') : 'All Resolved',
      badgeClass: openComplaints > 0
        ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200/50 dark:border-rose-800/40'
        : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200/50 dark:border-emerald-800/40',
      iconBg: 'bg-[#800000]/10 dark:bg-rose-900/30 text-[#800000] dark:text-rose-400',
      accentColor: '#800000',
      indicatorText: openComplaints > 0 ? `${openComplaints} Unresolved Tickets` : 'No Backlog',
      indicatorIcon: openComplaints > 0 ? ShieldAlert : CheckCircle2,
      indicatorColor: openComplaints > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400',
    },
    {
      id: 'score',
      title: 'Avg. Supervisory Score',
      value: formattedScore > 0 ? formattedScore : 'N/A',
      suffix: formattedScore > 0 ? '/ 5.0' : '',
      subtitle: peerReviewScore > 0
        ? `Peer review average: ${Number(peerReviewScore).toFixed(1)} / 5.0`
        : 'Composite HOD & supervisor evaluations',
      icon: Star,
      badgeText: scoreRating.label,
      badgeClass: `${scoreRating.bg} ${scoreRating.color} border-current/20`,
      iconBg: 'bg-[#D4AF37]/15 dark:bg-amber-900/30 text-[#B8860B] dark:text-[#F5DE94]',
      accentColor: '#D4AF37',
      indicatorText: `QA Standard: 3.5+ benchmark`,
      indicatorIcon: Star,
      indicatorColor: 'text-[#B8860B] dark:text-[#F5DE94]',
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const IconComponent = card.icon
        const IndicatorIcon = card.indicatorIcon

        return (
          <div
            key={card.id}
            onClick={() => onCardClick?.(card.id)}
            role={onCardClick ? 'button' : undefined}
            tabIndex={onCardClick ? 0 : undefined}
            className={`group relative rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/60 p-5 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 flex flex-col justify-between ${
              onCardClick ? 'cursor-pointer' : ''
            }`}
          >
            {/* Card Header */}
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  {card.title}
                </span>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 ${card.iconBg}`}>
                  <IconComponent className="w-5 h-5" />
                </div>
              </div>

              {/* Main Metric Value */}
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight font-mono">
                  {card.value}
                </span>
                {card.suffix && (
                  <span className="text-sm font-semibold text-slate-400 dark:text-slate-500">
                    {card.suffix}
                  </span>
                )}
              </div>

              {/* Progress bar if present */}
              {card.progressBar !== undefined && (
                <div className="mt-3 w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-700"
                    style={{ width: `${card.progressBar}%` }}
                  />
                </div>
              )}

              {/* Subtitle / Context breakdown */}
              <p className="mt-2.5 text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                {card.subtitle}
              </p>
            </div>

            {/* Footer pill & benchmark */}
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/50 flex items-center justify-between text-xs">
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${card.badgeClass}`}>
                {card.badgeText}
              </span>

              <span className={`inline-flex items-center gap-1 font-medium text-[11px] ${card.indicatorColor}`}>
                <IndicatorIcon className="w-3.5 h-3.5" />
                <span className="truncate max-w-[110px]">{card.indicatorText}</span>
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
