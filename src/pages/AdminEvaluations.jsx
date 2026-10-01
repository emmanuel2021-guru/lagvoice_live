import { useState, useEffect } from 'react'
import api from '../services/api'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'

export default function AdminEvaluations() {
  const [term, setTerm] = useState('2025/2026')
  const [activeTab, setActiveTab] = useState('course') // course, lecturer, department
  const [data, setData] = useState({ byCourse: [], byLecturer: [], byDepartment: [] })
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [savingConfig, setSavingConfig] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [evalsRes, qsRes] = await Promise.all([
          api.get('/evaluations/aggregated'),
          api.get('/evaluations/questions')
        ])
        
        // The updated backend returns { byCourse, byLecturer, byDepartment }
        // For backwards compatibility it also returns data: byCourse, so we check for both
        setData({
          byCourse: evalsRes.byCourse || evalsRes.data || [],
          byLecturer: evalsRes.byLecturer || [],
          byDepartment: evalsRes.byDepartment || []
        })

        if (Array.isArray(qsRes.data)) {
          setQuestions(qsRes.data)
        }
      } catch (err) {
        console.error('Failed to load data', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const saveQuestions = async () => {
    setSavingConfig(true)
    try {
      await api.put('/evaluations/questions', { questions })
      alert('Configuration saved successfully!')
    } catch (err) {
      console.error('Failed to save config', err)
      alert('Error saving configuration.')
    } finally {
      setSavingConfig(false)
    }
  }

  // Get current dataset based on active tab
  const getActiveData = () => {
    if (activeTab === 'lecturer') return data.byLecturer
    if (activeTab === 'department') return data.byDepartment
    return data.byCourse
  }

  const activeData = getActiveData()

  // Calculate totals across ALL courses for summary blocks (always based on byCourse)
  const totalResponses = data.byCourse.reduce((sum, c) => sum + c.responses, 0)
  const avgScore = data.byCourse.length > 0 ? (data.byCourse.reduce((sum, c) => sum + c.score, 0) / data.byCourse.length).toFixed(2) : '0.00'
  const flagged = data.byCourse.filter(c => c.score < 3.0).length

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-[11px] font-bold text-[#b23cfd] uppercase tracking-[0.15em] mb-1">Academics</p>
          <h1 className="text-[1.8rem] lg:text-[2.2rem] font-bold text-ink leading-tight tracking-tight">Evaluations</h1>
        </div>
        <select 
          value={term} 
          onChange={e => setTerm(e.target.value)}
          className="px-4 py-2 rounded-xl bg-white border border-mist text-[14px] text-ink focus:outline-none focus:ring-2 focus:ring-[#b23cfd]/20"
        >
          <option>2025/2026</option>
          <option>2024/2025</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-mist/50 p-6">
          <p className="text-[11px] uppercase tracking-wider text-ink/50 font-semibold">Total Responses</p>
          <p className="text-[2rem] font-bold text-ink mt-2">{totalResponses.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-2xl border border-mist/50 p-6">
          <p className="text-[11px] uppercase tracking-wider text-ink/50 font-semibold">University Avg</p>
          <p className="text-[2rem] font-bold text-[#00b74a] mt-2">{avgScore} / 5</p>
        </div>
        <div className="bg-white rounded-2xl border border-mist/50 p-6">
          <p className="text-[11px] uppercase tracking-wider text-ink/50 font-semibold">Flagged Courses</p>
          <p className="text-[2rem] font-bold text-red-500 mt-2">{flagged}</p>
        </div>
      </div>

      {/* Aggregation Data Section */}
      <div className="bg-white rounded-2xl border border-mist/50 p-6 overflow-hidden">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h2 className="text-[15px] font-bold text-ink">Score Aggregation & Trends</h2>
          
          <div className="flex bg-[#F5F7FA] p-1 rounded-xl">
            <button 
              onClick={() => setActiveTab('course')}
              className={`px-4 py-1.5 text-[12px] font-semibold rounded-lg transition-colors ${activeTab === 'course' ? 'bg-white text-[#b23cfd] shadow-sm' : 'text-ink/60 hover:text-ink'}`}
            >
              By Course
            </button>
            <button 
              onClick={() => setActiveTab('lecturer')}
              className={`px-4 py-1.5 text-[12px] font-semibold rounded-lg transition-colors ${activeTab === 'lecturer' ? 'bg-white text-[#b23cfd] shadow-sm' : 'text-ink/60 hover:text-ink'}`}
            >
              By Lecturer
            </button>
            <button 
              onClick={() => setActiveTab('department')}
              className={`px-4 py-1.5 text-[12px] font-semibold rounded-lg transition-colors ${activeTab === 'department' ? 'bg-white text-[#b23cfd] shadow-sm' : 'text-ink/60 hover:text-ink'}`}
            >
              By Department
            </button>
          </div>
        </div>

        {/* Visual Chart */}
        {activeData.length > 0 && (
          <div className="h-64 mb-8">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey={activeTab === 'course' ? 'code' : 'name'} axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9fa6b2' }} />
                <YAxis domain={[0, 5]} axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9fa6b2' }} />
                <Tooltip cursor={{ fill: '#F5F7FA' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }} />
                <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                  {activeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.score < 3.0 ? '#ef4444' : '#b23cfd'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-mist/50">
              <th className="py-3 px-4 text-[12px] font-semibold text-ink/50 uppercase tracking-wider">
                {activeTab === 'course' ? 'Course' : activeTab === 'lecturer' ? 'Lecturer' : 'Department'}
              </th>
              <th className="py-3 px-4 text-[12px] font-semibold text-ink/50 uppercase tracking-wider">Responses</th>
              <th className="py-3 px-4 text-[12px] font-semibold text-ink/50 uppercase tracking-wider">Avg Score</th>
              <th className="py-3 px-4 text-[12px] font-semibold text-ink/50 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody>
            {activeData.map((item, idx) => (
              <tr key={idx} className="border-b border-mist/20 hover:bg-cream/20 transition-colors">
                <td className="py-4 px-4">
                  <p className="text-[14px] font-bold text-ink">{item.code || item.name}</p>
                  {item.title && <p className="text-[12px] text-ink/50">{item.title}</p>}
                </td>
                <td className="py-4 px-4 text-[13px] text-ink/70">{item.responses}</td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    <span className={`text-[13px] font-bold ${item.score < 3.0 ? 'text-red-500' : 'text-[#00b74a]'}`}>{item.score}</span>
                    <svg className="w-3.5 h-3.5 text-gold" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                </td>
                <td className="py-4 px-4">
                  {item.score < 3.0 ? (
                    <span className="px-2 py-1 bg-red-50 text-red-600 rounded-md text-[11px] font-bold uppercase">Needs Review</span>
                  ) : (
                    <span className="px-2 py-1 bg-[#00b74a]/10 text-[#00b74a] rounded-md text-[11px] font-bold uppercase">Excellent</span>
                  )}
                </td>
              </tr>
            ))}
            {activeData.length === 0 && (
              <tr>
                <td colSpan="4" className="py-8 text-center text-[13px] text-ink/50">No data available for this aggregation.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="bg-white rounded-2xl border border-mist/50 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[15px] font-bold text-ink">Evaluation Form Configuration</h2>
          <button 
            onClick={saveQuestions}
            disabled={savingConfig}
            className="px-4 py-2 bg-[#b23cfd] text-white rounded-xl text-[13px] font-semibold hover:bg-[#9b34dd] transition-all disabled:opacity-50"
          >
            {savingConfig ? 'Saving...' : 'Save Configuration'}
          </button>
        </div>
        <p className="text-[13px] text-ink/50 mb-6">Manage the Likert scale questions presented to students across all courses.</p>
        
        <div className="space-y-3">
          {questions.map((q, idx) => (
            <div key={q.id || idx} className="flex items-center gap-3">
              <span className="text-[13px] font-bold text-ink/30 w-6">{idx + 1}.</span>
              <input 
                type="text" 
                value={q.text} 
                onChange={(e) => {
                  const newQs = [...questions];
                  newQs[idx].text = e.target.value;
                  setQuestions(newQs);
                }}
                className="flex-1 px-4 py-2 text-[14px] rounded-xl bg-cream border border-mist/50 text-ink focus:outline-none focus:ring-2 focus:ring-[#b23cfd]/20 transition-all"
              />
              <button 
                onClick={() => setQuestions(questions.filter((_, i) => i !== idx))}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))}
          <button 
            onClick={() => setQuestions([...questions, { id: 'q' + Date.now(), text: 'New question...' }])}
            className="text-[13px] font-semibold text-[#b23cfd] hover:underline mt-2 inline-flex items-center gap-1"
          >
            + Add Question
          </button>
        </div>
      </div>
    </div>
  )
}
