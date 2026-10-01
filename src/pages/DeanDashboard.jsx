import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'

export default function DeanDashboard() {
  const { user } = useAuth()
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <p className="text-[11px] font-bold text-[#1266f1] uppercase tracking-[0.15em] mb-1">Dean Overview</p>
        <h1 className="text-[1.8rem] lg:text-[2.2rem] font-bold text-ink leading-tight tracking-tight">
          Faculty of {user?.faculty || 'Your Faculty'}
        </h1>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* KPI 1 */}
        <div className="bg-white rounded-2xl border border-mist/50 p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[12px] font-bold text-ink/40 uppercase tracking-[0.1em]">Faculty Rating</h3>
            <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center">
              <svg className="w-4 h-4 text-gold-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-[2rem] font-bold text-ink font-mono">4.1</span>
            <span className="text-[14px] text-ink/40">/ 5.0</span>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-[12px] text-resolved font-medium">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
            <span>Top 3 Faculties in UNILAG</span>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-white rounded-2xl border border-mist/50 p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[12px] font-bold text-ink/40 uppercase tracking-[0.1em]">Total Departments</h3>
            <div className="w-8 h-8 rounded-full bg-[#1266f1]/10 flex items-center justify-center">
              <svg className="w-4 h-4 text-[#1266f1]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-[2rem] font-bold text-ink font-mono">8</span>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-[12px] text-ink/40">
            <span>All HOD positions filled</span>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-white rounded-2xl border border-mist/50 p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[12px] font-bold text-ink/40 uppercase tracking-[0.1em]">Complaint Resolution</h3>
            <div className="w-8 h-8 rounded-full bg-resolved/10 flex items-center justify-center">
              <svg className="w-4 h-4 text-resolved" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-[2rem] font-bold text-ink font-mono">85%</span>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-[12px] text-resolved font-medium">
            <span>Target: 80% SLA Compliance</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Comparison */}
        <div className="bg-white rounded-2xl border border-mist/50 overflow-hidden">
          <div className="px-5 py-4 border-b border-mist/50 flex justify-between items-center">
            <h3 className="text-[14px] font-bold text-ink">Departmental Comparison</h3>
          </div>
          <div className="p-0">
            {[
              { name: 'Computer Science', hod: 'Prof. HOD Computer Science', rating: 4.2 },
              { name: 'Mathematics', hod: 'Dr. Stella', rating: 3.9 },
              { name: 'Physics', hod: 'Prof. Ade', rating: 4.5 }
            ].map((dept, i) => (
              <div key={i} className="flex items-center justify-between px-5 py-4 border-b border-mist/20 last:border-0 hover:bg-mist/10 transition-colors">
                <div>
                  <p className="text-[14px] font-bold text-ink">{dept.name}</p>
                  <p className="text-[12px] text-ink/40">HOD: {dept.hod}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[14px] font-mono font-bold text-ink">{dept.rating}</span>
                  <svg className="w-4 h-4 text-gold-dark" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Items */}
        <div className="bg-white rounded-2xl border border-mist/50 overflow-hidden">
          <div className="px-5 py-4 border-b border-mist/50">
            <h3 className="text-[14px] font-bold text-ink">Faculty Actions</h3>
          </div>
          <div className="p-5 space-y-3">
            <button className="w-full text-left p-4 rounded-xl border border-mist hover:bg-cream hover:border-[#1266f1]/30 transition-all group flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-mist/50 flex items-center justify-center shrink-0 group-hover:bg-[#1266f1]/10">
                <svg className="w-4 h-4 text-ink/60 group-hover:text-[#1266f1] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              </div>
              <div>
                <p className="text-[13px] font-bold text-ink group-hover:text-[#1266f1] transition-colors">Review HOD Appraisals</p>
                <p className="text-[12px] text-ink/50 mt-0.5">Submit evaluations for the 8 Heads of Departments in your faculty.</p>
              </div>
            </button>
            <button className="w-full text-left p-4 rounded-xl border border-mist hover:bg-cream hover:border-[#1266f1]/30 transition-all group flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-mist/50 flex items-center justify-center shrink-0 group-hover:bg-[#1266f1]/10">
                <svg className="w-4 h-4 text-ink/60 group-hover:text-[#1266f1] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
              </div>
              <div>
                <p className="text-[13px] font-bold text-ink group-hover:text-[#1266f1] transition-colors">Generate Faculty Report</p>
                <p className="text-[12px] text-ink/50 mt-0.5">Export the monthly faculty compliance and resolution metrics.</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
