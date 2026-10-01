import { useState, useEffect } from 'react'
import api from '../services/api'
import { formatRelativeTime } from '../utils/formatters'

export default function StaffDashboard() {
  const [data, setData] = useState({
    evalSummary: { total: 0, average: 0 },
    evaluations: [],
    peerReviews: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStaffData = async () => {
      try {
        const [evalRes, peerRes] = await Promise.all([
          api.get('/evaluations/staff'),
          api.get('/peer-reviews')
        ])
        
        setData({
          evalSummary: evalRes.summary,
          evaluations: evalRes.data,
          peerReviews: peerRes.reviews
        })
      } catch (err) {
        console.error('Failed to load staff dashboard data', err)
      } finally {
        setLoading(false)
      }
    }
    fetchStaffData()
  }, [])

  if (loading) {
    return <div className="p-8 text-center text-ink/50">Loading Dashboard...</div>
  }

  const { evalSummary, evaluations, peerReviews } = data

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <p className="text-[11px] font-bold text-[#1976D2] uppercase tracking-[0.15em] mb-1">Academic Profile</p>
          <h1 className="text-[1.8rem] lg:text-[2.2rem] font-bold text-ink leading-tight tracking-tight">Staff Dashboard</h1>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-paper rounded-2xl border border-mist/50 p-6 flex flex-col justify-between">
          <p className="text-[11px] text-ink/40 uppercase tracking-wider font-semibold">Overall Teaching Score</p>
          <p className="text-[2.5rem] font-bold text-[#2E7D32] mt-2">{evalSummary.average} <span className="text-[1rem] text-ink/30">/ 5.0</span></p>
        </div>
        <div className="bg-paper rounded-2xl border border-mist/50 p-6 flex flex-col justify-between">
          <p className="text-[11px] text-ink/40 uppercase tracking-wider font-semibold">Total Course Evaluations</p>
          <p className="text-[2.5rem] font-bold text-ink mt-2">{evalSummary.total}</p>
        </div>
        <div className="bg-paper rounded-2xl border border-mist/50 p-6 flex flex-col justify-between">
          <p className="text-[11px] text-ink/40 uppercase tracking-wider font-semibold">Peer Reviews Received</p>
          <p className="text-[2.5rem] font-bold text-[#1976D2] mt-2">{peerReviews.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Student Feedback */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-mist/50 pb-2">
            <h2 className="text-[15px] font-bold text-ink">Recent Student Feedback</h2>
            <span className="text-[12px] text-ink/40 font-semibold">{evaluations.length} total</span>
          </div>
          
          <div className="space-y-3">
            {evaluations.length === 0 ? (
              <p className="text-[13px] text-ink/40 italic py-4">No student evaluations recorded yet.</p>
            ) : (
              evaluations.map(ev => (
                <div key={ev.id} className="bg-white p-5 rounded-xl border border-mist/50 shadow-sm">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="text-[14px] font-bold text-ink">{ev.courseCode}</p>
                      <p className="text-[12px] text-ink/50">{ev.courseName}</p>
                    </div>
                    <div className="px-2.5 py-1 rounded-md bg-[#2E7D32]/10 text-[#2E7D32] text-[12px] font-bold">
                      {ev.overallRating} / 5
                    </div>
                  </div>
                  
                  {ev.likes && (
                    <div className="mt-3">
                      <p className="text-[11px] uppercase tracking-wider text-ink/40 font-semibold mb-1">What students liked</p>
                      <p className="text-[13px] text-ink/80 leading-relaxed bg-cream p-3 rounded-lg border border-mist/30">{ev.likes}</p>
                    </div>
                  )}
                  {ev.suggestions && (
                    <div className="mt-3">
                      <p className="text-[11px] uppercase tracking-wider text-ink/40 font-semibold mb-1">Suggestions for improvement</p>
                      <p className="text-[13px] text-ink/80 leading-relaxed bg-cream p-3 rounded-lg border border-mist/30">{ev.suggestions}</p>
                    </div>
                  )}
                  <p className="text-[10px] text-ink/30 text-right mt-3 font-mono">{formatRelativeTime(ev.createdAt)}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Peer Reviews */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-mist/50 pb-2">
            <h2 className="text-[15px] font-bold text-ink">Peer Reviews Received</h2>
            <span className="text-[12px] text-ink/40 font-semibold">{peerReviews.length} total</span>
          </div>
          
          <div className="space-y-3">
            {peerReviews.length === 0 ? (
              <p className="text-[13px] text-ink/40 italic py-4">No peer reviews received yet.</p>
            ) : (
              peerReviews.map(pr => (
                <div key={pr.id} className="bg-white p-5 rounded-xl border border-mist/50 shadow-sm border-l-4 border-l-[#1976D2]">
                  <div className="mb-3">
                    <p className="text-[12px] text-ink/50 uppercase tracking-wider font-semibold">Reviewed by</p>
                    <p className="text-[14px] font-bold text-ink">{pr.reviewer?.name || 'Anonymous Peer'}</p>
                    {pr.courseCode && <p className="text-[12px] text-ink/60 mt-0.5">Course: {pr.courseCode}</p>}
                  </div>
                  
                  {pr.comments && (
                    <div className="mt-2">
                      <p className="text-[13px] text-ink/80 leading-relaxed italic border-l-2 border-mist pl-3 py-1">"{pr.comments}"</p>
                    </div>
                  )}
                  <p className="text-[10px] text-ink/30 text-right mt-3 font-mono">{formatRelativeTime(pr.createdAt)}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
