/**
 * TicketDetail — Full ticket view with intelligent tracking pipeline
 * Complaint lifecycle adapts based on category and current stage
 */
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { TICKET_STATUS_CONFIG } from '../utils/constants'
import { formatRelativeTime } from '../utils/formatters'
import { ticketService } from '../services/ticketService'
import { useAuth } from '../hooks/useAuth'

// ── Intelligent Pipeline Steps ──
const FULL_PIPELINE = [
  { key: 'pending', label: 'Complaint Submitted', description: 'Your feedback has been received and assigned a tracking ID.' },
  { key: 'under_review', label: 'Under Review', description: 'The complaint is being reviewed.' },
  { key: 'action_taken', label: 'Action Taken', description: 'Action is being taken to resolve the issue.' },
  { key: 'resolved', label: 'Resolved', description: 'The issue has been resolved. You can reopen this ticket if the problem persists.' },
  { key: 'escalated', label: 'Escalated', description: 'The issue has been escalated for further attention.' },
  { key: 'closed', label: 'Closed', description: 'The ticket has been permanently closed.' },
]

// Map timeline steps to status keys for progress calculation
function getProgressPercent(currentStatus, pipeline) {
  const idx = pipeline.findIndex(s => s.key === currentStatus)
  if (idx === -1) return 0
  return Math.round(((idx + 1) / pipeline.length) * 100)
}

function PipelineIcon({ step, isDone, isCurrent }) {
  if (isDone) {
    return (
      <div className="w-8 h-8 rounded-full bg-[#00b74a]/15 flex items-center justify-center shrink-0">
        <svg className="w-4 h-4 text-[#00b74a]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
    )
  }
  if (isCurrent) {
    return (
      <div className="w-8 h-8 rounded-full bg-[#1266f1]/15 flex items-center justify-center shrink-0 ring-4 ring-[#1266f1]/10">
        <div className="w-3 h-3 rounded-full bg-[#1266f1] animate-pulse" />
      </div>
    )
  }
  return (
    <div className="w-8 h-8 rounded-full bg-[#E4E8EE] flex items-center justify-center shrink-0">
      <div className="w-2 h-2 rounded-full bg-[#9fa6b2]/40" />
    </div>
  )
}

export default function TicketDetail() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { user } = useAuth()
  
  const [ticket, setTicket] = useState(null)
  const [loading, setLoading] = useState(true)
  const [commentText, setCommentText] = useState('')
  const [submittingComment, setSubmittingComment] = useState(false)
  const [comments, setComments] = useState([])

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const data = await ticketService.getTicketById(id)
        setTicket(data)
        setComments(data.comments || [])
      } catch (e) {
        console.error('Failed to load ticket:', e)
      } finally {
        setLoading(false)
      }
    }
    fetchTicket()
  }, [id])

  const addComment = async () => {
    if (!commentText.trim()) return
    setSubmittingComment(true)
    try {
      const newComment = await ticketService.addComment(id, commentText)
      setComments(prev => [...prev, newComment])
      setCommentText('')
    } catch (e) {
      alert('Failed to add comment')
    }
    setSubmittingComment(false)
  }
  
  const reopenTicket = async () => {
    if (confirm('Are you sure you want to reopen this ticket?')) {
      try {
        await ticketService.reopenTicket(id)
        const updated = await ticketService.getTicketById(id)
        setTicket(updated)
      } catch (e) {
        alert('Failed to reopen ticket')
      }
    }
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 flex items-center justify-center min-h-[50vh]">
        <svg className="w-8 h-8 text-[#1266f1] animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
    )
  }

  if (!ticket) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 text-center">
        <p className="text-[#9fa6b2]">Ticket not found or you do not have permission to view it.</p>
        <button onClick={() => navigate('/student/tickets')} className="mt-4 text-[#1266f1] hover:underline">
          Back to Tickets
        </button>
      </div>
    )
  }

  const pipeline = FULL_PIPELINE
  const currentStepIdx = pipeline.findIndex(s => s.key === ticket.status)
  const progress = getProgressPercent(ticket.status, pipeline)
  const status = TICKET_STATUS_CONFIG[ticket.status]

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Back */}
      <button onClick={() => navigate('/student/tickets')} className="flex items-center gap-2 text-[13px] text-[#9fa6b2] hover:text-[#262626] mb-6 transition-colors">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        All Tickets
      </button>

      {/* Ticket Header */}
      <div className="bg-white rounded-2xl border border-[#E4E8EE] p-6 mb-4">
        <div className="flex items-start justify-between mb-4">
          <div>
            <span className="text-[10px] font-mono text-[#9fa6b2]">UNILAG-TKT-{ticket.id}</span>
            <h1 className="text-[1.3rem] font-bold text-[#262626] mt-1">{ticket.title}</h1>
          </div>
          <span
            className="text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-[0.08em]"
            style={{ color: status?.color, backgroundColor: status?.bgColor }}
          >
            {status?.label || ticket.status}
          </span>
        </div>

        {/* Progress bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-[10px] text-[#9fa6b2] mb-1.5">
            <span>Progress</span>
            <span className="font-mono">{progress}%</span>
          </div>
          <div className="h-1.5 bg-[#E4E8EE] rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[#1266f1] to-[#00b74a] rounded-full transition-all duration-700" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-[12px]">
          <div className="bg-[#F5F7FA] rounded-xl p-3">
            <p className="text-[10px] text-[#9fa6b2] uppercase tracking-wider font-semibold mb-0.5">Category</p>
            <p className="text-[13px] font-semibold text-[#262626]">{ticket.category}</p>
          </div>
          <div className="bg-[#F5F7FA] rounded-xl p-3">
            <p className="text-[10px] text-[#9fa6b2] uppercase tracking-wider font-semibold mb-0.5">Subcategory</p>
            <p className="text-[13px] font-semibold text-[#262626]">{ticket.subcategory || 'N/A'}</p>
          </div>
          <div className="bg-[#F5F7FA] rounded-xl p-3">
            <p className="text-[10px] text-[#9fa6b2] uppercase tracking-wider font-semibold mb-0.5">Location</p>
            <p className="text-[13px] font-semibold text-[#262626]">{ticket.location || 'Not specified'}</p>
          </div>
          <div className="bg-[#F5F7FA] rounded-xl p-3">
            <p className="text-[10px] text-[#9fa6b2] uppercase tracking-wider font-semibold mb-0.5">Submitted</p>
            <p className="text-[13px] font-semibold text-[#262626]">{formatRelativeTime(ticket.createdAt)}</p>
          </div>
        </div>
      </div>

      {/* ═══ Interactive Tracking Pipeline ═══ */}
      <div className="bg-white rounded-2xl border border-[#E4E8EE] p-6 mb-4">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-[15px] font-bold text-[#262626]">Tracking Pipeline</h2>
          <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-[#1266f1]/10 text-[#1266f1]">
            Step {currentStepIdx + 1} of {pipeline.length}
          </span>
        </div>

        <div className="space-y-0">
          {pipeline.map((step, i) => {
            const isDone = i < currentStepIdx
            const isCurrent = i === currentStepIdx
            const isFuture = i > currentStepIdx

            return (
              <div key={step.key} className="flex gap-3 relative">
                {/* Vertical connector line */}
                {i < pipeline.length - 1 && (
                  <div className={`absolute left-[15px] top-[32px] w-[2px] h-[calc(100%-8px)] ${isDone ? 'bg-[#00b74a]/30' : isCurrent ? 'bg-[#1266f1]/20' : 'bg-[#E4E8EE]'}`} />
                )}

                <PipelineIcon step={step.key} isDone={isDone} isCurrent={isCurrent} />

                <div className={`flex-1 pb-5 ${isFuture ? 'opacity-40' : ''}`}>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className={`text-[13px] font-semibold ${isCurrent ? 'text-[#1266f1]' : isDone ? 'text-[#262626]' : 'text-[#9fa6b2]'}`}>
                        {step.label}
                      </p>
                      <p className={`text-[11px] mt-0.5 leading-relaxed ${isDone || isCurrent ? 'text-[#9fa6b2]' : 'text-[#9fa6b2]/50'}`}>
                        {step.description}
                      </p>
                    </div>
                  </div>
                  {isCurrent && (
                    <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#1266f1]/10 text-[#1266f1] text-[10px] font-semibold">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#1266f1] animate-pulse" />
                      In Progress
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Description */}
      <div className="bg-white rounded-2xl border border-[#E4E8EE] p-6 mb-4">
        <h2 className="text-[15px] font-bold text-[#262626] mb-3">Description</h2>
        <p className="text-[14px] text-[#4f4f4f] leading-relaxed">{ticket.description}</p>
        {ticket.isAnonymous && (
          <div className="mt-2 flex items-center gap-2 text-[12px] text-[#1266f1]">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
            </svg>
            <span>Submitted anonymously</span>
          </div>
        )}
        
        {/* Images */}
        {ticket.images && ticket.images.length > 0 && (
          <div className="mt-4 border-t border-[#E4E8EE] pt-4">
            <h3 className="text-[13px] font-semibold text-[#262626] mb-2">Attached Evidences</h3>
            <div className="flex flex-wrap gap-2">
              {ticket.images.map((img, i) => (
                <a key={i} href={`http://localhost:3000/uploads/${img}`} target="_blank" rel="noopener noreferrer" className="w-24 h-24 rounded-lg overflow-hidden border border-[#E4E8EE] hover:opacity-80 transition-opacity">
                  <img src={`http://localhost:3000/uploads/${img}`} alt="Evidence" className="w-full h-full object-cover" />
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Comments */}
      <div className="bg-white rounded-2xl border border-[#E4E8EE] p-6 mb-4">
        <h2 className="text-[15px] font-bold text-[#262626] mb-4">Comments & Updates</h2>
        <div className="space-y-4 mb-4">
          {comments.map(c => {
             const isMe = c.userId === user?.id
             return (
              <div key={c.id} className={`flex gap-3 ${isMe ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${
                  c.user?.role === 'admin' ? 'bg-[#1266f1]/10 text-[#1266f1]' : 'bg-[#ffa900]/10 text-[#ffa900]'
                }`}>
                  {c.user?.name ? c.user.name.charAt(0) : 'U'}
                </div>
                <div className={`max-w-[80%] ${isMe ? 'text-right' : ''}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[12px] font-semibold text-[#262626]">{c.user?.name || 'User'}</span>
                    <span className="text-[10px] text-[#9fa6b2] font-mono">{formatRelativeTime(c.createdAt)}</span>
                  </div>
                  <div className={`text-[13px] text-[#4f4f4f] leading-relaxed rounded-xl p-3 ${
                    c.user?.role === 'admin' ? 'bg-[#F5F7FA] text-left' : 'bg-[#1266f1]/[0.05] text-left'
                  }`}>
                    {c.message}
                  </div>
                </div>
              </div>
             )
          })}
        </div>

        {/* Add Comment */}
        <div className="flex gap-2 pt-3 border-t border-[#E4E8EE]">
          <input
            value={commentText}
            onChange={e => setCommentText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addComment()}
            placeholder="Add a comment or follow-up..."
            className="flex-1 px-4 py-2.5 rounded-xl bg-[#F5F7FA] border border-[#E4E8EE] text-[13px] text-[#262626] placeholder:text-[#9fa6b2] focus:outline-none focus:ring-2 focus:ring-[#1266f1]/15 focus:border-[#1266f1]/40 transition-all"
          />
          <button
            onClick={addComment}
            disabled={!commentText.trim() || submittingComment}
            className="px-4 py-2.5 rounded-xl bg-[#1266f1] text-white text-[13px] font-semibold hover:bg-[#0e52c1] transition-all disabled:opacity-40"
          >
            {submittingComment ? 'Sending...' : 'Send'}
          </button>
        </div>
      </div>

      {/* Actions */}
      {(ticket.status === 'resolved' || ticket.status === 'closed') && (
        <button onClick={reopenTicket} className="w-full py-3 rounded-xl border border-[#E4E8EE] text-[#4f4f4f] font-semibold text-[14px] hover:bg-[#F5F7FA] transition-all flex items-center justify-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Reopen Ticket
        </button>
      )}
    </div>
  )
}
