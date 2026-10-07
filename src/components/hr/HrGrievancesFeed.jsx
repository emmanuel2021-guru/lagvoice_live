import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  AlertCircle,
  Clock,
  Shield,
  MessageSquare,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Flame,
  Calendar,
  User,
  ShieldAlert
} from 'lucide-react'
import StatusPill from '../common/StatusPill/StatusPill'
import { formatRelativeTime, formatDate } from '../../utils/formatters'
import HrEmptyState from './HrEmptyState'

/**
 * HrGrievancesFeed
 * Department Grievances & Escalations Feed
 * Monitors open internal tickets relating to departmental staff
 */
export default function HrGrievancesFeed({
  tickets = [],
  onTicketClick,
}) {
  const navigate = useNavigate()
  const [statusFilter, setStatusFilter] = useState('unresolved') // 'unresolved' | 'all' | 'pending' | 'resolved'
  const [urgencyFilter, setUrgencyFilter] = useState('all') // 'all' | 'high' | 'medium' | 'low'
  const [expandedTicketId, setExpandedTicketId] = useState(null)

  // Urgency indicator badge
  const getUrgencyBadge = (urgency) => {
    switch (urgency?.toLowerCase()) {
      case 'high':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200/50 dark:border-rose-800/40">
            <Flame className="w-3 h-3 text-rose-600 dark:text-rose-400" />
            High Urgency
          </span>
        )
      case 'medium':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200/50 dark:border-amber-800/40">
            <Clock className="w-3 h-3 text-amber-600 dark:text-amber-400" />
            Medium
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/40">
            Low
          </span>
        )
    }
  }

  // Filter logic
  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      // Status filter
      if (statusFilter === 'unresolved') {
        if (ticket.status === 'resolved' || ticket.status === 'closed') return false
      } else if (statusFilter !== 'all') {
        if (ticket.status !== statusFilter) return false
      }

      // Urgency filter
      if (urgencyFilter !== 'all') {
        if (ticket.urgency !== urgencyFilter) return false
      }

      return true
    })
  }, [tickets, statusFilter, urgencyFilter])

  const toggleExpand = (id) => {
    setExpandedTicketId(expandedTicketId === id ? null : id)
  }

  const handleOpenTicket = (ticketId) => {
    if (onTicketClick) {
      onTicketClick(ticketId)
    } else {
      navigate(`/staff/ticket/${ticketId}`)
    }
  }

  return (
    <div className="rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/60 shadow-sm overflow-hidden flex flex-col justify-between">
      {/* Header */}
      <div className="p-5 lg:p-6 border-b border-slate-100 dark:border-slate-700/50 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-[#800000]/10 dark:bg-rose-900/30 text-[#800000] dark:text-rose-400">
                <AlertCircle className="w-4 h-4" />
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                Department Grievances & Escalations
              </h3>
            </div>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Departmental complaints and workplace issues requiring HR attention
            </p>
          </div>

          <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 self-start sm:self-center">
            {filteredTickets.length} active
          </span>
        </div>

        {/* Quick Filter Buttons */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <div className="inline-flex rounded-xl bg-slate-100 dark:bg-slate-700/60 p-0.5">
            <button
              onClick={() => setStatusFilter('unresolved')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                statusFilter === 'unresolved'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Unresolved Only
            </button>
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                statusFilter === 'all'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              All Tickets
            </button>
            <button
              onClick={() => setStatusFilter('resolved')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                statusFilter === 'resolved'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Resolved
            </button>
          </div>

          <select
            value={urgencyFilter}
            onChange={(e) => setUrgencyFilter(e.target.value)}
            className="px-2.5 py-1 rounded-xl text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-none font-semibold focus:outline-none cursor-pointer"
          >
            <option value="all">Any Urgency</option>
            <option value="high">High Urgency</option>
            <option value="medium">Medium Urgency</option>
            <option value="low">Low Urgency</option>
          </select>
        </div>
      </div>

      {/* Tickets List */}
      <div className="p-4 sm:p-5 space-y-3 overflow-y-auto max-h-[460px]">
        {filteredTickets.length === 0 ? (
          <HrEmptyState
            variant="success"
            title="No Grievance Escalations"
            description={
              statusFilter === 'unresolved'
                ? 'All departmental grievances have been addressed and resolved!'
                : 'No tickets matched your selected filter criteria.'
            }
            compact
          />
        ) : (
          filteredTickets.map((ticket) => {
            const isExpanded = expandedTicketId === ticket.id
            const submitter = ticket.submittedBy

            return (
              <div
                key={ticket.id}
                className="group rounded-2xl border border-slate-200/80 dark:border-slate-700/60 bg-white dark:bg-slate-850 p-4 hover:border-slate-300 dark:hover:border-slate-600 transition-all shadow-xs hover:shadow-sm"
              >
                {/* Main Card Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-[11px] font-bold text-slate-500 dark:text-slate-400">
                        {ticket.trackingId || `UNILAG-${ticket.id}`}
                      </span>
                      {getUrgencyBadge(ticket.urgency)}
                      <StatusPill status={ticket.status} size="sm" />
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug group-hover:text-[#1266f1] transition-colors">
                      {ticket.title}
                    </h4>

                    {/* Metadata strip */}
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatRelativeTime(ticket.createdAt)}
                      </span>
                      <span>•</span>
                      <span className="text-slate-600 dark:text-slate-300 font-medium">
                        {ticket.subcategory || ticket.category || 'General'}
                      </span>
                      {ticket.isAnonymous ? (
                        <>
                          <span>•</span>
                          <span className="inline-flex items-center gap-1 text-slate-400 italic">
                            <Shield className="w-3 h-3 text-[#D4AF37]" />
                            Confidential Submission
                          </span>
                        </>
                      ) : submitter?.name ? (
                        <>
                          <span>•</span>
                          <span className="inline-flex items-center gap-1 text-slate-600 dark:text-slate-300 font-medium truncate max-w-[150px]">
                            <User className="w-3 h-3 text-slate-400" />
                            {submitter.name}
                          </span>
                        </>
                      ) : null}
                    </div>
                  </div>

                  {/* Expand / Collapse toggle & Open ticket action */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => toggleExpand(ticket.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-750 transition-colors cursor-pointer"
                      title={isExpanded ? 'Collapse ticket' : 'Expand description'}
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => handleOpenTicket(ticket.id)}
                      className="p-1.5 rounded-lg text-[#1266f1] hover:bg-[#1266f1]/10 transition-colors cursor-pointer"
                      title="Open full ticket details"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Expanded Details Section */}
                {isExpanded && (
                  <div className="mt-3.5 pt-3 border-t border-slate-100 dark:border-slate-750 space-y-3 animate-fade-in text-xs">
                    <div>
                      <p className="font-semibold text-slate-400 uppercase tracking-wider text-[10px] mb-1">
                        Issue Description
                      </p>
                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-100 dark:border-slate-700/40">
                        {ticket.description || 'No detailed description provided.'}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-slate-400">
                      <div className="flex items-center gap-2">
                        {ticket.commentsCount !== undefined && (
                          <span className="flex items-center gap-1">
                            <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                            {ticket.commentsCount} {ticket.commentsCount === 1 ? 'comment' : 'comments'}
                          </span>
                        )}
                        {ticket.slaDeadline && (
                          <span className="text-amber-600 dark:text-amber-400">
                            SLA: {formatDate(ticket.slaDeadline)}
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => handleOpenTicket(ticket.id)}
                        className="inline-flex items-center gap-1.5 font-semibold text-[#1266f1] hover:underline"
                      >
                        <span>Investigate & Respond</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>

      {/* Footer Info */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-700/50 bg-slate-50/60 dark:bg-slate-800/40 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <span className="flex items-center gap-1.5">
          <ShieldAlert className="w-3.5 h-3.5 text-[#800000]" />
          <span>Staff confidentiality is strictly maintained.</span>
        </span>
        <button
          onClick={() => navigate('/staff/inbox')}
          className="font-semibold text-[#1266f1] hover:underline cursor-pointer"
        >
          View Secure Inbox &rarr;
        </button>
      </div>
    </div>
  )
}
