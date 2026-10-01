import { useState, useEffect } from 'react'
import { qaService } from '../services/qaService'
import { DEPARTMENTS } from '../services/userService'

const QA_QUESTIONS = [
  { id: 'q1', text: 'Department adheres to approved curriculum?' },
  { id: 'q2', text: 'Safety protocols are visible and enforced?' },
  { id: 'q3', text: 'Student feedback loops are documented?' },
  { id: 'q4', text: 'Faculty workload is evenly distributed?' },
  { id: 'q5', text: 'Facilities and labs are well maintained?' }
]

export default function AdminQaAudits() {
  const [activeTab, setActiveTab] = useState('submit') // submit, history, compliance
  const [audits, setAudits] = useState([])
  const [selfAssessments, setSelfAssessments] = useState([])
  const [loading, setLoading] = useState(true)

  // Form State
  const [department, setDepartment] = useState('')
  const [answers, setAnswers] = useState({})
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const fetchData = async () => {
    try {
      setLoading(true)
      const [auditData, selfAssessData] = await Promise.all([
        qaService.getAudits(),
        qaService.getAllSelfAssessments()
      ])
      setAudits(auditData || [])
      setSelfAssessments(selfAssessData || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleToggleAnswer = (qId) => {
    setAnswers(prev => ({
      ...prev,
      [qId]: !prev[qId]
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!department) return alert('Select a department')

    setSubmitting(true)
    
    let yesCount = 0
    QA_QUESTIONS.forEach(q => {
      if (answers[q.id]) yesCount++
    })
    const score = (yesCount / QA_QUESTIONS.length) * 100

    try {
      await qaService.submitAudit({
        department,
        checklistData: answers,
        score,
        notes
      })
      alert('Audit submitted successfully!')
      setDepartment('')
      setAnswers({})
      setNotes('')
      setActiveTab('history')
      fetchData()
    } catch (err) {
      console.error(err)
      alert('Error submitting audit')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto pb-12 animate-fade-in">
      <div className="mb-8">
        <p className="text-[11px] font-bold text-[#1266f1] uppercase tracking-[0.15em] mb-1">Quality Assurance</p>
        <h1 className="text-[1.8rem] lg:text-[2.2rem] font-bold text-ink leading-tight tracking-tight">QA Audits & Compliance</h1>
        <p className="text-[14px] text-ink/60 mt-1">Conduct internal audits and monitor NUC/NBTE compliance tracking.</p>
      </div>

      <div className="flex gap-2 mb-6 border-b border-[#E4E8EE]">
        <button 
          onClick={() => setActiveTab('submit')}
          className={`px-5 py-3 text-[13px] font-semibold transition-all relative ${activeTab === 'submit' ? 'text-[#1266f1]' : 'text-ink/50 hover:text-ink/80'}`}
        >
          New Audit
          {activeTab === 'submit' && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#1266f1] rounded-t-full" />}
        </button>
        <button 
          onClick={() => setActiveTab('history')}
          className={`px-5 py-3 text-[13px] font-semibold transition-all relative ${activeTab === 'history' ? 'text-[#1266f1]' : 'text-ink/50 hover:text-ink/80'}`}
        >
          Internal Audit History
          {activeTab === 'history' && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#1266f1] rounded-t-full" />}
        </button>
        <button 
          onClick={() => setActiveTab('compliance')}
          className={`px-5 py-3 text-[13px] font-semibold transition-all relative ${activeTab === 'compliance' ? 'text-[#1266f1]' : 'text-ink/50 hover:text-ink/80'}`}
        >
          NUC/NBTE Compliance
          {activeTab === 'compliance' && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#1266f1] rounded-t-full" />}
        </button>
      </div>

      {activeTab === 'submit' ? (
        <form onSubmit={handleSubmit} className="bg-white border border-[#E4E8EE] rounded-2xl p-6 lg:p-8 shadow-sm">
          <h2 className="text-[16px] font-bold text-ink mb-6">Departmental QA Checklist</h2>
          
          <div className="mb-8">
            <label className="block text-[12px] font-bold text-ink/50 uppercase tracking-wider mb-2">Target Department</label>
            <select 
              value={department} 
              onChange={e => setDepartment(e.target.value)}
              className="w-full md:w-1/2 px-4 py-3 rounded-xl bg-[#F5F7FA] border-none text-[14px] focus:ring-2 focus:ring-[#1266f1]/20"
              required
            >
              <option value="">Select Department...</option>
              {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          <div className="space-y-4 mb-8">
            <label className="block text-[12px] font-bold text-ink/50 uppercase tracking-wider">Compliance Checks</label>
            {QA_QUESTIONS.map(q => (
              <label key={q.id} className="flex items-center justify-between p-4 rounded-xl border border-[#E4E8EE] hover:bg-[#F5F7FA] cursor-pointer transition-colors">
                <span className="text-[14px] font-medium text-ink">{q.text}</span>
                <div className="relative inline-flex items-center">
                  <input 
                    type="checkbox" 
                    checked={answers[q.id] || false}
                    onChange={() => handleToggleAnswer(q.id)}
                    className="sr-only peer" 
                  />
                  <div className="w-11 h-6 bg-mist/50 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00b74a]"></div>
                </div>
              </label>
            ))}
          </div>

          <div className="mb-8">
            <label className="block text-[12px] font-bold text-ink/50 uppercase tracking-wider mb-2">Additional Notes</label>
            <textarea 
              value={notes} 
              onChange={e => setNotes(e.target.value)}
              rows={4}
              placeholder="Any specific observations or recommendations..."
              className="w-full px-4 py-3 rounded-xl bg-[#F5F7FA] border-none text-[14px] focus:ring-2 focus:ring-[#1266f1]/20 resize-none"
            />
          </div>

          <button 
            type="submit" 
            disabled={submitting}
            className="w-full md:w-auto px-8 py-3 bg-[#1266f1] text-white rounded-xl text-[14px] font-bold hover:bg-[#0e52c1] transition-colors disabled:opacity-50"
          >
            {submitting ? 'Submitting...' : 'Submit QA Audit'}
          </button>
        </form>
      ) : activeTab === 'history' ? (
        <div className="bg-white border border-[#E4E8EE] rounded-2xl overflow-hidden shadow-sm">
          {loading ? (
            <p className="p-8 text-center text-ink/50">Loading audits...</p>
          ) : audits.length === 0 ? (
            <p className="p-8 text-center text-ink/50">No QA audits have been conducted yet.</p>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E4E8EE] bg-[#F5F7FA]">
                  <th className="py-3 px-6 text-[11px] font-bold text-ink/50 uppercase tracking-wider">Date</th>
                  <th className="py-3 px-6 text-[11px] font-bold text-ink/50 uppercase tracking-wider">Department</th>
                  <th className="py-3 px-6 text-[11px] font-bold text-ink/50 uppercase tracking-wider">Auditor</th>
                  <th className="py-3 px-6 text-[11px] font-bold text-ink/50 uppercase tracking-wider">Score</th>
                  <th className="py-3 px-6 text-[11px] font-bold text-ink/50 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody>
                {audits.map(audit => (
                  <tr key={audit.id} className="border-b border-[#E4E8EE]/50 hover:bg-[#F5F7FA] transition-colors">
                    <td className="py-4 px-6 text-[13px] text-ink/70">
                      {new Date(audit.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-[14px] font-bold text-ink">{audit.department}</p>
                    </td>
                    <td className="py-4 px-6 text-[13px] text-ink/70">
                      {audit.auditor?.name || 'Unknown'}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`text-[14px] font-bold ${audit.score >= 80 ? 'text-[#00b74a]' : audit.score >= 50 ? 'text-orange-500' : 'text-red-500'}`}>
                        {audit.score}%
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      {audit.score >= 80 ? (
                        <span className="px-2 py-1 bg-[#00b74a]/10 text-[#00b74a] rounded-md text-[11px] font-bold uppercase">Compliant</span>
                      ) : (
                        <span className="px-2 py-1 bg-red-50 text-red-600 rounded-md text-[11px] font-bold uppercase">Needs Action</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      ) : (
        <div className="bg-white border border-[#E4E8EE] rounded-2xl overflow-hidden shadow-sm">
          <div className="p-6 border-b border-[#E4E8EE]">
            <h2 className="text-[15px] font-bold text-ink">External Compliance Readiness (NUC / NBTE)</h2>
            <p className="text-[13px] text-ink/60 mt-1">Self-assessments submitted by HODs and Deans mapped against official criteria.</p>
          </div>
          {loading ? (
            <p className="p-8 text-center text-ink/50">Loading compliance data...</p>
          ) : selfAssessments.length === 0 ? (
            <p className="p-8 text-center text-ink/50">No external compliance self-assessments submitted yet.</p>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E4E8EE] bg-[#F5F7FA]">
                  <th className="py-3 px-6 text-[11px] font-bold text-ink/50 uppercase tracking-wider">Date</th>
                  <th className="py-3 px-6 text-[11px] font-bold text-ink/50 uppercase tracking-wider">Department / Program</th>
                  <th className="py-3 px-6 text-[11px] font-bold text-ink/50 uppercase tracking-wider">Body</th>
                  <th className="py-3 px-6 text-[11px] font-bold text-ink/50 uppercase tracking-wider">Readiness</th>
                  <th className="py-3 px-6 text-[11px] font-bold text-ink/50 uppercase tracking-wider">Submitted By</th>
                </tr>
              </thead>
              <tbody>
                {selfAssessments.map(sa => (
                  <tr key={sa.id} className="border-b border-[#E4E8EE]/50 hover:bg-[#F5F7FA] transition-colors">
                    <td className="py-4 px-6 text-[13px] text-ink/70">
                      {new Date(sa.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-[14px] font-bold text-ink">{sa.department}</p>
                      <p className="text-[12px] text-ink/50">{sa.programName}</p>
                    </td>
                    <td className="py-4 px-6 text-[13px] font-bold text-[#1266f1]">
                      {sa.accreditationBody}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`text-[14px] font-bold ${sa.readinessScore >= 80 ? 'text-[#00b74a]' : sa.readinessScore >= 50 ? 'text-orange-500' : 'text-red-500'}`}>
                        {sa.readinessScore}%
                      </span>
                    </td>
                    <td className="py-4 px-6 text-[13px] text-ink/70">
                      {sa.submittedBy?.name || 'Unknown'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  )
}
