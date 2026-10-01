import { useState, useEffect } from 'react'
import { supervisoryService } from '../services/supervisoryService'

const SUPERVISORY_RUBRICS = [
  { id: 'teaching', label: 'Teaching Effectiveness' },
  { id: 'curriculum', label: 'Curriculum Adherence' },
  { id: 'punctuality', label: 'Professionalism & Punctuality' },
  { id: 'admin', label: 'Administrative Duties' },
]

export default function SupervisoryAssessment() {
  const [activeTab, setActiveTab] = useState('submit')
  const [facultyList, setFacultyList] = useState([])
  const [reviewsReceived, setReviewsReceived] = useState([])
  
  // Form state
  const [selectedFaculty, setSelectedFaculty] = useState('')
  const [courseCode, setCourseCode] = useState('')
  const [scores, setScores] = useState({ teaching: 3, curriculum: 3, punctuality: 3, admin: 3 })
  const [comments, setComments] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [fList, rList] = await Promise.all([
        supervisoryService.getStaffList(),
        supervisoryService.getMyAssessments()
      ])
      setFacultyList(fList)
      setReviewsReceived(rList)
    } catch (err) {
      console.error('Failed to load supervisory data', err)
    }
  }

  const handleScoreChange = (rubric, val) => {
    setScores(prev => ({ ...prev, [rubric]: val }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!selectedFaculty) return alert('Select a staff member')

    setLoading(true)
    try {
      await supervisoryService.submitAssessment({
        staffId: selectedFaculty,
        context: courseCode || 'Supervisory Assessment',
        scores,
        remarks: comments
      })
      setSuccess(true)
      setSelectedFaculty('')
      setCourseCode('')
      setComments('')
      setScores({ teaching: 3, curriculum: 3, punctuality: 3, admin: 3 })
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      alert('Failed to submit assessment')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div>
        <h1 className="text-[1.8rem] font-bold text-[#262626]">Supervisory Assessment</h1>
        <p className="text-[14px] text-[#9fa6b2] mt-1">Conduct official HOD / Dean assessments on departmental staff.</p>
      </div>

      <div className="flex gap-2 mt-6 mb-8 border-b border-[#E4E8EE]">
        <button 
          onClick={() => setActiveTab('submit')}
          className={`px-4 py-2 text-[13px] font-semibold border-b-2 transition-colors ${activeTab === 'submit' ? 'border-[#1266f1] text-[#1266f1]' : 'border-transparent text-[#9fa6b2] hover:text-[#262626]'}`}
        >
          Submit Assessment
        </button>
        <button 
          onClick={() => setActiveTab('received')}
          className={`px-4 py-2 text-[13px] font-semibold border-b-2 transition-colors ${activeTab === 'received' ? 'border-[#1266f1] text-[#1266f1]' : 'border-transparent text-[#9fa6b2] hover:text-[#262626]'}`}
        >
          My Assessment History
        </button>
      </div>

      {activeTab === 'submit' && (
        <div className="bg-white rounded-2xl border border-[#E4E8EE] p-6 shadow-sm">
          {success && (
            <div className="mb-6 p-4 rounded-xl bg-[#00b74a]/10 text-[#00b74a] text-[13px] font-semibold">
              Supervisory assessment submitted successfully.
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[12px] font-bold text-[#262626] mb-2 uppercase tracking-wider">Select Staff Member</label>
                <select
                  value={selectedFaculty}
                  onChange={e => setSelectedFaculty(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F5F7FA] border border-[#E4E8EE] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#1266f1]/20 focus:border-[#1266f1]"
                  required
                >
                  <option value="">-- Choose Staff Member --</option>
                  {facultyList.map(f => (
                    <option key={f.id} value={f.id}>{f.name} ({f.department})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[12px] font-bold text-[#262626] mb-2 uppercase tracking-wider">Assessment Context</label>
                <input
                  type="text"
                  placeholder="e.g. End of Semester Review"
                  value={courseCode}
                  onChange={e => setCourseCode(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F5F7FA] border border-[#E4E8EE] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#1266f1]/20 focus:border-[#1266f1]"
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-[12px] font-bold text-[#262626] mb-2 uppercase tracking-wider">Evaluation Rubric</label>
              {SUPERVISORY_RUBRICS.map(r => (
                <div key={r.id} className="flex items-center justify-between p-3 rounded-xl bg-[#F5F7FA]">
                  <span className="text-[13px] font-semibold text-[#4f4f4f]">{r.label}</span>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map(val => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => handleScoreChange(r.id, val)}
                        className={`w-8 h-8 rounded-lg text-[12px] font-bold transition-all ${
                          scores[r.id] === val ? 'bg-[#1266f1] text-white shadow-md' : 'bg-white border border-[#E4E8EE] text-[#9fa6b2] hover:border-[#1266f1]/30'
                        }`}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div>
              <label className="block text-[12px] font-bold text-[#262626] mb-2 uppercase tracking-wider">HOD / Dean Remarks</label>
              <textarea
                rows="4"
                value={comments}
                onChange={e => setComments(e.target.value)}
                placeholder="Official remarks..."
                className="w-full px-4 py-3 rounded-xl bg-[#F5F7FA] border border-[#E4E8EE] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#1266f1]/20 focus:border-[#1266f1] resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-[#1266f1] text-white font-bold text-[14px] hover:bg-[#0e52c1] transition-colors shadow-md disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Submit Official Assessment'}
            </button>
          </form>
        </div>
      )}

      {activeTab === 'received' && (
        <div className="space-y-4">
          {reviewsReceived.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-2xl border border-[#E4E8EE]">
              <p className="text-[13px] text-[#9fa6b2]">No supervisory assessments found.</p>
            </div>
          ) : (
            reviewsReceived.map(review => (
              <div key={review.id} className="bg-white rounded-2xl border border-[#E4E8EE] p-6 shadow-sm border-l-4 border-l-[#f93154]">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-[14px] font-bold text-[#262626]">HOD / Dean Assessment</h3>
                    <p className="text-[12px] text-[#9fa6b2]">Context: {review.context || 'General'}</p>
                  </div>
                  <span className="text-[11px] text-[#9fa6b2] font-mono">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                  {SUPERVISORY_RUBRICS.map(r => (
                    <div key={r.id} className="bg-[#F5F7FA] p-3 rounded-xl text-center">
                      <p className="text-[10px] uppercase font-bold text-[#9fa6b2] mb-1">{r.label}</p>
                      <p className="text-[18px] font-bold text-[#1266f1]">{review.scores[r.id] || 0}/5</p>
                    </div>
                  ))}
                </div>
                
                {review.remarks && (
                  <div className="bg-[#f93154]/5 p-4 rounded-xl border border-[#f93154]/10">
                    <p className="text-[13px] text-[#4f4f4f] font-medium">"{review.remarks}"</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}
