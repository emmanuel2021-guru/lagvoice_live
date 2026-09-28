import { useState, useEffect } from 'react'
import api from '../services/api'

export default function AdminEvaluations() {
  const [term, setTerm] = useState('2025/2026')
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEvaluations = async () => {
      try {
        const res = await api.get('/evaluations/aggregated')
        setCourses(res.data)
      } catch (err) {
        console.error('Failed to load evaluations', err)
      } finally {
        setLoading(false)
      }
    }
    fetchEvaluations()
  }, [])

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
          <p className="text-[2rem] font-bold text-ink mt-2">{courses.reduce((sum, c) => sum + c.responses, 0).toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-2xl border border-mist/50 p-6">
          <p className="text-[11px] uppercase tracking-wider text-ink/50 font-semibold">University Avg</p>
          <p className="text-[2rem] font-bold text-[#00b74a] mt-2">
            {courses.length > 0 ? (courses.reduce((sum, c) => sum + c.score, 0) / courses.length).toFixed(2) : '0.00'} / 5
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-mist/50 p-6">
          <p className="text-[11px] uppercase tracking-wider text-ink/50 font-semibold">Flagged Courses</p>
          <p className="text-[2rem] font-bold text-red-500 mt-2">{courses.filter(c => c.score < 3.0).length}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-mist/50 p-6 overflow-hidden">
        <h2 className="text-[15px] font-bold text-ink mb-4">Course Rankings</h2>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-mist/50">
              <th className="py-3 px-4 text-[12px] font-semibold text-ink/50 uppercase tracking-wider">Course</th>
              <th className="py-3 px-4 text-[12px] font-semibold text-ink/50 uppercase tracking-wider">Responses</th>
              <th className="py-3 px-4 text-[12px] font-semibold text-ink/50 uppercase tracking-wider">Avg Score</th>
              <th className="py-3 px-4 text-[12px] font-semibold text-ink/50 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody>
            {courses.map(c => (
              <tr key={c.code} className="border-b border-mist/20 hover:bg-cream/20 transition-colors">
                <td className="py-4 px-4">
                  <p className="text-[14px] font-bold text-ink">{c.code}</p>
                  <p className="text-[12px] text-ink/50">{c.title}</p>
                </td>
                <td className="py-4 px-4 text-[13px] text-ink/70">{c.responses}</td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    <span className={`text-[13px] font-bold ${c.score < 4.0 ? 'text-orange-500' : 'text-[#00b74a]'}`}>{c.score}</span>
                    <svg className="w-3.5 h-3.5 text-gold" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <button className="text-[12px] font-semibold text-[#b23cfd] hover:underline">View Report</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
