import { useState, useEffect } from 'react'
import { servicomService } from '../services/servicomService'
import { DEPARTMENTS } from '../services/userService'
import { useAuth } from '../hooks/useAuth'

export default function AdminServicomCharters() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('manage') // manage, view
  const [charters, setCharters] = useState([])
  const [loading, setLoading] = useState(true)

  const [department, setDepartment] = useState('')
  const [slaHours, setSlaHours] = useState(48)
  const [commitments, setCommitments] = useState(['', '', '']) // start with 3 empty fields
  const [saving, setSaving] = useState(false)

  const fetchCharters = async () => {
    try {
      setLoading(true)
      const data = await servicomService.getCharters()
      setCharters(data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCharters()
  }, [])

  // When department changes, load its existing charter if available
  useEffect(() => {
    if (department) {
      const existing = charters.find(c => c.department === department)
      if (existing) {
        setCommitments(existing.commitments || ['', '', ''])
        setSlaHours(existing.slaHours || 48)
      } else {
        setCommitments(['', '', ''])
        setSlaHours(48)
      }
    }
  }, [department, charters])

  const handleCommitmentChange = (index, value) => {
    const newCommits = [...commitments]
    newCommits[index] = value
    setCommitments(newCommits)
  }

  const addCommitmentField = () => {
    setCommitments([...commitments, ''])
  }

  const removeCommitmentField = (index) => {
    setCommitments(commitments.filter((_, i) => i !== index))
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!department) return alert('Select a department')
    
    const validCommitments = commitments.filter(c => c.trim().length > 0)
    if (validCommitments.length === 0) return alert('Enter at least one commitment')

    setSaving(true)
    try {
      await servicomService.upsertCharter({
        department,
        commitments: validCommitments,
        slaHours
      })
      alert('Service Charter updated successfully!')
      setDepartment('')
      setCommitments(['', '', ''])
      setSlaHours(48)
      setActiveTab('view')
      fetchCharters()
    } catch (err) {
      console.error(err)
      alert('Error saving charter')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto pb-12 animate-fade-in">
      <div className="mb-8">
        <p className="text-[11px] font-bold text-[#f59e0b] uppercase tracking-[0.15em] mb-1">SERVICOM</p>
        <h1 className="text-[1.8rem] lg:text-[2.2rem] font-bold text-ink leading-tight tracking-tight">Service Charters</h1>
        <p className="text-[14px] text-ink/60 mt-1">Manage and publish departmental service commitments.</p>
      </div>

      <div className="flex gap-2 mb-6 border-b border-[#E4E8EE]">
        <button 
          onClick={() => setActiveTab('manage')}
          className={`px-5 py-3 text-[13px] font-semibold transition-all relative ${activeTab === 'manage' ? 'text-[#f59e0b]' : 'text-ink/50 hover:text-ink/80'}`}
        >
          Manage Charter
          {activeTab === 'manage' && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#f59e0b] rounded-t-full" />}
        </button>
        <button 
          onClick={() => setActiveTab('view')}
          className={`px-5 py-3 text-[13px] font-semibold transition-all relative ${activeTab === 'view' ? 'text-[#f59e0b]' : 'text-ink/50 hover:text-ink/80'}`}
        >
          Charter Repository
          {activeTab === 'view' && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#f59e0b] rounded-t-full" />}
        </button>
      </div>

      {activeTab === 'manage' ? (
        <form onSubmit={handleSave} className="bg-white border border-[#E4E8EE] rounded-2xl p-6 lg:p-8 shadow-sm">
          <div className="mb-8">
            <label className="block text-[12px] font-bold text-ink/50 uppercase tracking-wider mb-2">Target Department</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select 
                value={department} 
                onChange={e => setDepartment(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[#F5F7FA] border-none text-[14px] focus:ring-2 focus:ring-[#f59e0b]/20"
                required
              >
                <option value="">Select Department...</option>
                {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              <div className="flex items-center gap-2">
                <label className="text-[13px] font-bold text-ink whitespace-nowrap">SLA Resolution Time (Hours):</label>
                <input 
                  type="number"
                  min="1"
                  value={slaHours}
                  onChange={e => setSlaHours(e.target.value)}
                  className="w-24 px-4 py-3 rounded-xl bg-[#F5F7FA] border-none text-[14px] focus:ring-2 focus:ring-[#f59e0b]/20"
                />
              </div>
            </div>
          </div>

          <div className="mb-8">
            <label className="block text-[12px] font-bold text-ink/50 uppercase tracking-wider mb-4">Service Commitments / SLAs</label>
            {commitments.map((commit, index) => (
              <div key={index} className="flex gap-3 mb-3">
                <span className="flex items-center justify-center w-10 h-11 bg-[#F5F7FA] rounded-xl text-[14px] font-bold text-ink/40">
                  {index + 1}
                </span>
                <input 
                  type="text"
                  value={commit}
                  onChange={(e) => handleCommitmentChange(index, e.target.value)}
                  placeholder="e.g. We will resolve all student complaints within 24 hours..."
                  className="flex-1 px-4 py-3 rounded-xl bg-[#F5F7FA] border-none text-[14px] focus:ring-2 focus:ring-[#f59e0b]/20"
                />
                <button 
                  type="button"
                  onClick={() => removeCommitmentField(index)}
                  className="w-11 h-11 flex items-center justify-center bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-colors"
                  title="Remove"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
            <button 
              type="button"
              onClick={addCommitmentField}
              className="mt-2 text-[13px] font-bold text-[#f59e0b] hover:text-[#d97706] transition-colors flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Add Commitment
            </button>
          </div>

          <button 
            type="submit" 
            disabled={saving}
            className="w-full md:w-auto px-8 py-3 bg-[#f59e0b] text-white rounded-xl text-[14px] font-bold hover:bg-[#d97706] transition-colors disabled:opacity-50"
          >
            {saving ? 'Publishing...' : 'Publish Service Charter'}
          </button>
        </form>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <p className="col-span-full p-8 text-center text-ink/50">Loading repository...</p>
          ) : charters.length === 0 ? (
            <p className="col-span-full p-8 text-center text-ink/50">No service charters published yet.</p>
          ) : (
            charters.map(charter => (
              <div key={charter.id} className="bg-white border border-[#E4E8EE] rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-[#f59e0b]/10 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-[#f59e0b]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-[15px] font-bold text-ink leading-tight">{charter.department}</h3>
                    <p className="text-[11px] text-ink/50 mt-1 uppercase tracking-wider">Service Charter</p>
                  </div>
                </div>
                
                <ul className="space-y-3 mt-6">
                  {charter.commitments.map((commit, idx) => (
                    <li key={idx} className="flex gap-3 text-[13px] text-ink/80 leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#f59e0b] mt-1.5 flex-shrink-0" />
                      <span>{commit}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-6 pt-4 border-t border-[#E4E8EE] flex justify-between items-center">
                  <p className="text-[11px] text-ink/40">Last updated by {charter.updatedBy?.name?.split(' ')[0]}</p>
                  <p className="text-[11px] text-ink/40">{new Date(charter.updatedAt).toLocaleDateString()}</p>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}
