import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'

export default function HodDashboard() {
  const { user } = useAuth()
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <p className="text-[11px] font-bold text-gold-dark uppercase tracking-[0.15em] mb-1">HOD Overview</p>
        <h1 className="text-[1.8rem] lg:text-[2.2rem] font-bold text-ink leading-tight tracking-tight">
          Department of {user?.department || 'Your Department'}
        </h1>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* KPI 1 */}
        <div className="bg-white rounded-2xl border border-mist/50 p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[12px] font-bold text-ink/40 uppercase tracking-[0.1em]">Department Rating</h3>
            <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center">
              <svg className="w-4 h-4 text-gold-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-[2rem] font-bold text-ink font-mono">4.2</span>
            <span className="text-[14px] text-ink/40">/ 5.0</span>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-[12px] text-resolved font-medium">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
            <span>Top 10% in Faculty</span>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-white rounded-2xl border border-mist/50 p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[12px] font-bold text-ink/40 uppercase tracking-[0.1em]">Staff Count</h3>
            <div className="w-8 h-8 rounded-full bg-[#1266f1]/10 flex items-center justify-center">
              <svg className="w-4 h-4 text-[#1266f1]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-[2rem] font-bold text-ink font-mono">24</span>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-[12px] text-ink/40">
            <span>18 Academic • 6 Non-Academic</span>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-white rounded-2xl border border-mist/50 p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[12px] font-bold text-ink/40 uppercase tracking-[0.1em]">Pending Complaints</h3>
            <div className="w-8 h-8 rounded-full bg-maroon/10 flex items-center justify-center">
              <svg className="w-4 h-4 text-maroon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-[2rem] font-bold text-ink font-mono">3</span>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-[12px] text-maroon font-medium">
            <span>Requires departmental attention</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Staff Performance List */}
        <div className="bg-white rounded-2xl border border-mist/50 overflow-hidden">
          <div className="px-5 py-4 border-b border-mist/50 flex justify-between items-center">
            <h3 className="text-[14px] font-bold text-ink">Staff Performance (Evaluations)</h3>
            <button className="text-[12px] font-semibold text-[#1266f1] hover:text-[#0e52c1] transition-colors">View All</button>
          </div>
          <div className="p-0">
            {[
              { name: 'Dr. Adebayo', role: 'Academic', rating: 4.8 },
              { name: 'Prof. Okonkwo', role: 'Academic', rating: 3.5 },
              { name: 'Mr. John Doe', role: 'Non-Academic', rating: 4.2 }
            ].map((staff, i) => (
              <div key={i} className="flex items-center justify-between px-5 py-4 border-b border-mist/20 last:border-0 hover:bg-mist/10 transition-colors">
                <div>
                  <p className="text-[14px] font-bold text-ink">{staff.name}</p>
                  <p className="text-[12px] text-ink/40">{staff.role}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[14px] font-mono font-bold text-ink">{staff.rating}</span>
                  <svg className="w-4 h-4 text-gold-dark" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Items */}
        <div className="bg-white rounded-2xl border border-mist/50 overflow-hidden">
          <div className="px-5 py-4 border-b border-mist/50">
            <h3 className="text-[14px] font-bold text-ink">Departmental Actions</h3>
          </div>
          <div className="p-5 space-y-3">
            <button className="w-full text-left p-4 rounded-xl border border-mist hover:bg-cream hover:border-maroon/30 transition-all group flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-mist/50 flex items-center justify-center shrink-0 group-hover:bg-maroon/10">
                <svg className="w-4 h-4 text-ink/60 group-hover:text-maroon transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              </div>
              <div>
                <p className="text-[13px] font-bold text-ink group-hover:text-maroon transition-colors">Review NUC Self-Assessment</p>
                <p className="text-[12px] text-ink/50 mt-0.5">Submit the upcoming QA review for the department.</p>
              </div>
            </button>
            <button className="w-full text-left p-4 rounded-xl border border-mist hover:bg-cream hover:border-maroon/30 transition-all group flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-mist/50 flex items-center justify-center shrink-0 group-hover:bg-maroon/10">
                <svg className="w-4 h-4 text-ink/60 group-hover:text-maroon transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
              </div>
              <div>
                <p className="text-[13px] font-bold text-ink group-hover:text-maroon transition-colors">Conduct Peer Review</p>
                <p className="text-[12px] text-ink/50 mt-0.5">You have 2 pending peer reviews for your academic staff.</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
