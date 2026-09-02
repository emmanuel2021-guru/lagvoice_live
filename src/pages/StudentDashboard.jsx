import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { ticketService } from '../services/ticketService'
import { formatRelativeTime } from '../utils/formatters'
import { TICKET_STATUS_CONFIG } from '../utils/constants'

export default function StudentDashboard() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [submittedComplaints, setSubmittedComplaints] = useState([])

  // Fetch tickets from API
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const data = await ticketService.getTickets()
        setSubmittedComplaints(data.tickets || [])
      } catch (error) {
        console.error('Failed to fetch tickets:', error)
      }
    }
    fetchTickets()
  }, [])

  const allTickets = submittedComplaints

  // Calculate stats from real tickets
  const activeCount = allTickets.filter(t => t.status === 'pending' || t.status === 'under_review' || t.status === 'escalated').length
  const resolvedCount = allTickets.filter(t => t.status === 'resolved' || t.status === 'closed').length
  
  const stats = [
    { label: 'Active', value: activeCount, color: '#1266f1', icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    )},
    { label: 'Resolved', value: resolvedCount, color: '#00b74a', icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    )},
    { label: 'Evaluations Due', value: 0, color: '#f93154', icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
    )},
  ]

  return (
    <div className="space-y-6 opacity-0 animate-slide-in-up">

      {/* ═══ Welcome Banner ═══ */}
      <div className="relative rounded-2xl overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1266f1 0%, #0e52c1 50%, #0a3d94 100%)' }}
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-8 -right-8 w-40 h-40 bg-[#ffa900] rounded-full blur-[60px]" />
          <div className="absolute -bottom-4 left-1/3 w-32 h-32 bg-white rounded-full blur-[50px]" />
        </div>
        <div className="relative z-10 p-7 lg:p-9 flex items-center justify-between">
          <div>
            <p className="text-[12px] text-white/50 font-medium uppercase tracking-wider mb-1">Student Portal</p>
            <h1 className="text-[1.6rem] lg:text-[2rem] font-bold text-white leading-tight tracking-tight">
              Good morning, {user?.name?.split(' ')[0] || 'Student'}
            </h1>
            <p className="text-[13px] text-white/45 mt-2">Here is what is happening with your feedback</p>
          </div>
          <div className="hidden lg:flex items-center gap-4">
            <div className="w-28 h-20 rounded-2xl bg-white/15 border border-white/20 backdrop-blur-sm flex items-center justify-center">
              <div className="text-center">
                <p className="text-[1.6rem] font-bold text-white font-mono leading-none">{activeCount}</p>
                <p className="text-[9px] text-white/50 uppercase tracking-wider mt-1">Active</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ Stats Row ═══ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-2xl border border-[#E4E8EE] p-5 group hover:border-[#1266f1]/20 hover:shadow-[0_4px_16px_rgba(18,102,241,0.06)] transition-all duration-300"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${stat.color}12`, color: stat.color }}>
                {stat.icon}
              </div>
              <div className="flex-1">
                <p className="text-[11px] font-semibold text-[#9fa6b2] uppercase tracking-wider">{stat.label}</p>
              </div>
            </div>
            <p className="text-[1.8rem] font-bold text-[#262626] leading-none tracking-tight">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* ═══ Share Your Voice CTA ═══ */}
      <button
        onClick={() => navigate('/student/feedback')}
        className="w-full bg-gradient-to-r from-[#1266f1] to-[#0e52c1] text-white rounded-2xl p-6 flex items-center gap-5
          hover:from-[#0e52c1] hover:to-[#0a3d94] transition-all duration-300 group relative overflow-hidden"
      >
        <div className="w-12 h-12 rounded-xl bg-white/15 border border-white/15 flex items-center justify-center shrink-0 group-hover:bg-white/20 transition-colors">
          <svg className="w-5 h-5 text-[#ffa900]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </div>
        <div className="relative z-10 text-left flex-1">
          <p className="font-bold text-[15px]">Share Your Voice</p>
          <p className="text-white/45 text-[13px] mt-0.5">Submit feedback or report an issue, anonymously if you choose</p>
        </div>
        <svg className="relative z-10 w-5 h-5 text-white/25 group-hover:text-[#ffa900] group-hover:translate-x-1 transition-all duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* ═══ Two Column: Activity + Tickets ═══ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-2xl border border-[#E4E8EE] overflow-hidden">
          <div className="flex items-center justify-between px-6 py-5 border-b border-[#E4E8EE]/50">
            <h2 className="text-[16px] font-bold text-[#262626]">Recent Activity</h2>
            <button className="text-[11px] text-[#1266f1] hover:text-[#0e52c1] font-semibold transition-colors">
              View All
            </button>
          </div>
          <div>
            {allTickets.length === 0 ? (
              <div className="px-6 py-8 text-center">
                <p className="text-[13px] text-[#9fa6b2]">No recent activity to show.</p>
              </div>
            ) : (
              allTickets.slice(0, 4).map((ticket) => (
                <div key={ticket.id} className="flex items-start gap-3.5 px-6 py-4 border-b border-[#E4E8EE]/30 last:border-0 hover:bg-[#F5F7FA] transition-colors">
                  <div className="w-2 h-2 rounded-full mt-2 shrink-0 bg-[#1266f1]" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] text-[#4f4f4f] leading-relaxed">
                      You submitted a new ticket: <strong>{ticket.title}</strong>
                    </p>
                    <p className="text-[11px] text-[#9fa6b2] mt-0.5 font-mono">{formatRelativeTime(ticket.createdAt)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* My Tickets */}
        <div className="bg-white rounded-2xl border border-[#E4E8EE] overflow-hidden">
          <div className="flex items-center justify-between px-6 py-5 border-b border-[#E4E8EE]/50">
            <h2 className="text-[16px] font-bold text-[#262626]">
              My Tickets
              {submittedComplaints.length > 0 && (
                <span className="ml-2 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#1266f1]/10 text-[#1266f1]">
                  {submittedComplaints.length} new
                </span>
              )}
            </h2>
            <button onClick={() => navigate('/student/tickets')} className="text-[11px] text-[#1266f1] hover:text-[#0e52c1] font-semibold transition-colors">
              See All
            </button>
          </div>
          <div>
            {allTickets.length === 0 ? (
              <div className="px-6 py-8 text-center">
                <p className="text-[13px] text-[#9fa6b2]">You haven't submitted any tickets yet.</p>
              </div>
            ) : (
              allTickets.map((ticket) => {
                const status = TICKET_STATUS_CONFIG[ticket.status]
                const isSubmitted = submittedComplaints.some(c => c.trackingId === ticket.trackingId)
                return (
                  <button
                    key={ticket.id}
                    onClick={() => navigate(`/student/ticket/${ticket.id}`)}
                    className="w-full flex items-center gap-4 px-6 py-4 border-b border-[#E4E8EE]/30 last:border-0 hover:bg-[#F5F7FA] transition-colors text-left group"
                  >
                    {isSubmitted && (
                      <span className="w-2 h-2 rounded-full bg-[#1266f1] shrink-0 animate-pulse" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-semibold text-[#262626] truncate group-hover:text-[#1266f1] transition-colors">{ticket.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] text-[#9fa6b2] font-mono">{ticket.trackingId}</span>
                        <span className="text-[10px] text-[#9fa6b2]/40">&#183;</span>
                        <span className="text-[10px] text-[#9fa6b2]">{ticket.category}</span>
                        {ticket.createdAt && (
                          <>
                            <span className="text-[10px] text-[#9fa6b2]/40">&#183;</span>
                            <span className="text-[10px] text-[#9fa6b2]">{formatRelativeTime(ticket.createdAt)}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <span
                      className="text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-[0.06em]"
                      style={{ color: status?.color, backgroundColor: status?.bgColor }}
                    >
                      {status?.label}
                    </span>
                  </button>
                )
              })
            )}
          </div>
        </div>
      </div>

      {/* ═══ Active Polls ═══ */}
      <div className="bg-white rounded-2xl border border-[#E4E8EE] overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#E4E8EE]/50">
          <h2 className="text-[16px] font-bold text-[#262626]">
            Active Polls
            <span className="ml-2 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#b23cfd]/10 text-[#b23cfd]">
              2 new
            </span>
          </h2>
          <button onClick={() => navigate('/student/polls')} className="text-[11px] text-[#1266f1] hover:text-[#0e52c1] font-semibold transition-colors">
            View All
          </button>
        </div>
        <div className="divide-y divide-[#E4E8EE]/30">
          {[
            { id: 1, title: 'Campus Security Survey', desc: 'Rate your sense of safety on campus', responses: 342, deadline: '2026-09-15' },
            { id: 2, title: 'Proposed Fee Structure Change', desc: 'Student sentiment on the proposed fee adjustment', responses: 189, deadline: '2026-09-20' },
          ].map(poll => (
            <button
              key={poll.id}
              onClick={() => navigate('/student/polls')}
              className="w-full flex items-center gap-4 px-6 py-4 hover:bg-[#F5F7FA] transition-colors text-left group"
            >
              <div className="w-10 h-10 rounded-xl bg-[#b23cfd]/10 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-[#b23cfd]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold text-[#262626] truncate group-hover:text-[#1266f1] transition-colors">{poll.title}</p>
                <p className="text-[11px] text-[#9fa6b2] mt-0.5">{poll.desc}</p>
              </div>
              <div className="text-right shrink-0">
                <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[#00b74a]/10 text-[#00b74a]">Vote Now</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
