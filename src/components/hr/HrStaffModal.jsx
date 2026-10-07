import React from 'react'
import {
  X,
  Mail,
  Building,
  Star,
  CheckCircle2,
  Clock,
  AlertCircle,
  Calendar
} from 'lucide-react'
import { formatDate } from '../../utils/formatters'

/**
 * HrStaffModal
 * Detailed appraisal records inspector for individual staff members
 */
export default function HrStaffModal({
  staff,
  onClose,
}) {
  if (!staff) return null

  const appraisal = staff.appraisalSummary || {}
  const supervisoryScore = appraisal.supervisoryAvgScore || staff.supervisory?.averageScore
  const peerScore = appraisal.peerReviewAvgScore || staff.peerReview?.averageScore
  const appraisalStatus = appraisal.appraisalStatus || staff.overallAppraisalStatus || 'pending'

  const getStatusBadge = (status) => {
    switch (status) {
      case 'complete':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300/40">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Appraisal Complete
          </span>
        )
      case 'partial':
      case 'in_progress':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300/40">
            <Clock className="w-3.5 h-3.5" />
            In Progress
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-300/40">
            <AlertCircle className="w-3.5 h-3.5" />
            Pending Submission
          </span>
        )
    }
  }

  // Get initials for avatar
  const initials = staff.name
    ? staff.name
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'ST'

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-2xl bg-white dark:bg-slate-850 rounded-3xl border border-slate-200 dark:border-slate-700/80 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-slide-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="relative bg-gradient-to-r from-[#1E1B4B] via-[#2A1B4E] to-[#450A1A] p-6 text-white flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#F5DE94] flex items-center justify-center font-bold text-lg font-mono shrink-0 shadow-inner">
              {initials}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-xl font-bold text-white tracking-tight">{staff.name}</h3>
                {getStatusBadge(appraisalStatus)}
              </div>
              <p className="text-xs text-slate-300 mt-1 flex items-center gap-3">
                <span className="font-mono bg-white/10 px-2 py-0.5 rounded text-[11px]">
                  {staff.staffId || staff.code || 'UNILAG Staff'}
                </span>
                <span>•</span>
                <span className="capitalize">{staff.role} Staff</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Identity & Department Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/40 space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Official Email
              </span>
              <a
                href={`mailto:${staff.email}`}
                className="text-sm font-semibold text-[#1266f1] hover:underline flex items-center gap-1.5"
              >
                <Mail className="w-4 h-4 shrink-0" />
                <span className="truncate">{staff.email}</span>
              </a>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/40 space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Department & Faculty
              </span>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Building className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="truncate">{staff.department || 'Department'}</span>
              </p>
            </div>
          </div>

          {/* Performance & Appraisal Scores */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Appraisal Performance Record
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Supervisory Assessment */}
              <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-800/40 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-900 dark:text-indigo-300">
                    Supervisory Assessment
                  </span>
                  <div className="flex items-center gap-1 text-[#D4AF37]">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-sm font-bold font-mono">
                      {supervisoryScore ? Number(supervisoryScore).toFixed(1) : '—'}
                    </span>
                    <span className="text-[11px] text-slate-400">/ 5.0</span>
                  </div>
                </div>

                <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
                  <p>
                    <strong>Assessments Count:</strong>{' '}
                    {appraisal.supervisoryAssessmentsCount ?? staff.supervisory?.completedAssessments ?? 0}
                  </p>
                  {staff.supervisory?.latestAssessment && (
                    <>
                      <p>
                        <strong>Supervisor:</strong> {staff.supervisory.latestAssessment.supervisorName}
                      </p>
                      {staff.supervisory.latestAssessment.remarks && (
                        <p className="italic text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 p-2 rounded-lg border border-indigo-100 dark:border-indigo-800/30">
                          "{staff.supervisory.latestAssessment.remarks}"
                        </p>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Peer Review */}
              <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-800/40 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-900 dark:text-amber-300">
                    Peer Reviews Received
                  </span>
                  <div className="flex items-center gap-1 text-[#D4AF37]">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-sm font-bold font-mono">
                      {peerScore ? Number(peerScore).toFixed(1) : '—'}
                    </span>
                    <span className="text-[11px] text-slate-400">/ 5.0</span>
                  </div>
                </div>

                <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
                  <p>
                    <strong>Reviews Completed:</strong>{' '}
                    {appraisal.peerReviewsCount ?? staff.peerReview?.completedReviews ?? 0}
                  </p>
                  {staff.peerReview?.latestReview && (
                    <>
                      <p>
                        <strong>Reviewer:</strong> {staff.peerReview.latestReview.reviewerName} (
                        {staff.peerReview.latestReview.courseCode})
                      </p>
                      {staff.peerReview.latestReview.comments && (
                        <p className="italic text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 p-2 rounded-lg border border-amber-100 dark:border-amber-800/30">
                          "{staff.peerReview.latestReview.comments}"
                        </p>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Joined date info */}
          {staff.joinedAt && (
            <p className="text-xs text-slate-400 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              Department Appointment Date: {formatDate(staff.joinedAt)}
            </p>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
          <a
            href={`mailto:${staff.email}?subject=UNILAG%20Departmental%20Appraisal%20Notification`}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#1266f1] hover:bg-[#0e52c1] transition-all cursor-pointer"
          >
            <Mail className="w-3.5 h-3.5" />
            Send Official Notice
          </a>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
