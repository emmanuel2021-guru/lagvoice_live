import { useState, useEffect } from 'react'
import { qaService } from '../services/qaService'
import { useAuth } from '../hooks/useAuth'

export default function HodSelfAssessment() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('submit') // submit, history
  const [assessments, setAssessments] = useState([])
  const [loading, setLoading] = useState(true)

  // Form State
  const [accreditationBody, setAccreditationBody] = useState('NUC')
  const [dynamicQuestions, setDynamicQuestions] = useState([])
  const [programName, setProgramName] = useState('')
  const [answers, setAnswers] = useState({})
  const [submitting, setSubmitting] = useState(false)

  const fetchAssessments = async () => {
    try {
      setLoading(true)
      const data = await qaService.getMySelfAssessments()
      setAssessments(data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const fetchBenchmarks = async (body) => {
    try {
      const data = await qaService.getBenchmarks(body)
      setDynamicQuestions(data || [])
      setAnswers({})
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchAssessments()
  }, [])

  useEffect(() => {
    fetchBenchmarks(accreditationBody)
  }, [accreditationBody])

  const handleToggleAnswer = (qId) => {
    setAnswers(prev => ({
      ...prev,
      [qId]: !prev[qId]
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!programName) return alert('Enter the program name')
    if (dynamicQuestions.length === 0) return alert('No benchmarks available for this body')

    setSubmitting(true)
    
    // Calculate score (each yes = percentage based on total questions)
    let yesCount = 0
    dynamicQuestions.forEach(q => {
      if (answers[q.id]) yesCount++
    })
    const readinessScore = (yesCount / dynamicQuestions.length) * 100

    try {
      await qaService.submitSelfAssessment({
        department: user.department || 'Unknown Department',
        accreditationBody,
        programName,
        responses: answers,
        readinessScore
      })
      alert('Self-Assessment submitted successfully!')
      setProgramName('')
      setAnswers({})
      setActiveTab('history')
      fetchAssessments()
    } catch (err) {
      console.error(err)
      alert('Error submitting self-assessment')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto pb-12 animate-fade-in">
      <div className="mb-8">
        <p className="text-[11px] font-bold text-[#b23cfd] uppercase tracking-[0.15em] mb-1">Department</p>
        <h1 className="text-[1.8rem] lg:text-[2.2rem] font-bold text-ink leading-tight tracking-tight">Self-Assessment</h1>
        <p className="text-[14px] text-ink/60 mt-1">Prepare your department for upcoming accreditation visits.</p>
      </div>

      <div className="flex gap-2 mb-6 border-b border-[#E4E8EE]">
        <button 
          onClick={() => setActiveTab('submit')}
          className={`px-5 py-3 text-[13px] font-semibold transition-all relative ${activeTab === 'submit' ? 'text-[#b23cfd]' : 'text-ink/50 hover:text-ink/80'}`}
        >
          New Assessment
          {activeTab === 'submit' && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#b23cfd] rounded-t-full" />}
        </button>
        <button 
          onClick={() => setActiveTab('history')}
          className={`px-5 py-3 text-[13px] font-semibold transition-all relative ${activeTab === 'history' ? 'text-[#b23cfd]' : 'text-ink/50 hover:text-ink/80'}`}
        >
          Assessment History
          {activeTab === 'history' && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#b23cfd] rounded-t-full" />}
        </button>
      </div>

      {activeTab === 'submit' ? (
        <form onSubmit={handleSubmit} className="bg-white border border-[#E4E8EE] rounded-2xl p-6 lg:p-8 shadow-sm">
          <h2 className="text-[16px] font-bold text-ink mb-6">Accreditation Readiness Form</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-[12px] font-bold text-ink/50 uppercase tracking-wider mb-2">Accreditation Body</label>
              <select 
                value={accreditationBody} 
                onChange={e => setAccreditationBody(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[#F5F7FA] border-none text-[14px] focus:ring-2 focus:ring-[#b23cfd]/20"
              >
                <option value="NUC">NUC (National Universities Commission)</option>
                <option value="NBTE">NBTE (National Board for Technical Education)</option>
                <option value="INTERNAL">Internal Quality Assurance</option>
              </select>
            </div>
            <div>
              <label className="block text-[12px] font-bold text-ink/50 uppercase tracking-wider mb-2">Program Name</label>
              <input 
                type="text"
                value={programName}
                onChange={e => setProgramName(e.target.value)}
                placeholder="e.g. B.Sc. Computer Science"
                className="w-full px-4 py-3 rounded-xl bg-[#F5F7FA] border-none text-[14px] focus:ring-2 focus:ring-[#b23cfd]/20"
                required
              />
            </div>
          </div>

          <div className="space-y-4 mb-8">
            <label className="block text-[12px] font-bold text-ink/50 uppercase tracking-wider">Readiness Checklist</label>
            {dynamicQuestions.length === 0 ? (
              <p className="text-[13px] text-ink/50 py-4">Loading benchmarks...</p>
            ) : dynamicQuestions.map(q => (
              <label key={q.id} className="flex items-center justify-between p-4 rounded-xl border border-[#E4E8EE] hover:bg-[#F5F7FA] cursor-pointer transition-colors">
                <span className="text-[14px] font-medium text-ink">{q.text}</span>
                <div className="relative inline-flex items-center">
                  <input 
                    type="checkbox" 
                    checked={answers[q.id] || false}
                    onChange={() => handleToggleAnswer(q.id)}
                    className="sr-only peer" 
                  />
                  <div className="w-11 h-6 bg-mist/50 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#b23cfd]"></div>
                </div>
              </label>
            ))}
          </div>

          <button 
            type="submit" 
            disabled={submitting}
            className="w-full md:w-auto px-8 py-3 bg-[#b23cfd] text-white rounded-xl text-[14px] font-bold hover:bg-[#9b34dd] transition-colors disabled:opacity-50"
          >
            {submitting ? 'Submitting...' : 'Submit Self-Assessment'}
          </button>
        </form>
      ) : (
        <div className="bg-white border border-[#E4E8EE] rounded-2xl overflow-hidden shadow-sm">
          {loading ? (
            <p className="p-8 text-center text-ink/50">Loading assessments...</p>
          ) : assessments.length === 0 ? (
            <p className="p-8 text-center text-ink/50">You haven't submitted any self-assessments yet.</p>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E4E8EE] bg-[#F5F7FA]">
                  <th className="py-3 px-6 text-[11px] font-bold text-ink/50 uppercase tracking-wider">Date</th>
                  <th className="py-3 px-6 text-[11px] font-bold text-ink/50 uppercase tracking-wider">Program</th>
                  <th className="py-3 px-6 text-[11px] font-bold text-ink/50 uppercase tracking-wider">Body</th>
                  <th className="py-3 px-6 text-[11px] font-bold text-ink/50 uppercase tracking-wider">Readiness</th>
                </tr>
              </thead>
              <tbody>
                {assessments.map(assessment => (
                  <tr key={assessment.id} className="border-b border-[#E4E8EE]/50 hover:bg-[#F5F7FA] transition-colors">
                    <td className="py-4 px-6 text-[13px] text-ink/70">
                      {new Date(assessment.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-[14px] font-bold text-ink">{assessment.programName}</p>
                    </td>
                    <td className="py-4 px-6 text-[13px] font-bold text-ink/70">
                      {assessment.accreditationBody}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`text-[14px] font-bold ${assessment.readinessScore >= 80 ? 'text-[#00b74a]' : assessment.readinessScore >= 50 ? 'text-orange-500' : 'text-red-500'}`}>
                        {assessment.readinessScore}%
                      </span>
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
