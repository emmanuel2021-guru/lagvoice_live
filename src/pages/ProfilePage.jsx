import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import Input from '../components/common/Input/Input'
import Button from '../components/common/Button/Button'

const FACULTIES = [
  'Arts', 'Basic Medical Sciences', 'Clinical Sciences', 'Dental Sciences',
  'Education', 'Engineering', 'Environmental Sciences', 'Law', 'Management Sciences',
  'Pharmacy', 'Science', 'Social Sciences'
]

export default function ProfilePage() {
  const { user, updateProfile } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [form, setForm] = useState({
    name: user?.name || '',
    studentId: user?.studentId || '',
    staffId: user?.staffId || '',
    department: user?.department || '',
    faculty: user?.faculty || ''
  })
  const [loading, setLoading] = useState(false)

  // Helper to extract initials
  const getInitials = (name) => {
    if (!name) return '?'
    const parts = name.split(' ')
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase()
    }
    return name[0].toUpperCase()
  }

  const handleEditChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      // Send whichever ID field is relevant
      const updateData = {
        name: form.name,
        department: form.department,
        faculty: form.faculty
      }
      if (user?.role === 'staff') updateData.staffId = form.staffId
      else updateData.studentId = form.studentId

      await updateProfile(updateData)
      setIsEditing(false)
    } catch (err) {
      console.error('Failed to update profile:', err)
      alert(err.message || 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8 opacity-0 animate-slide-in-up">
      {/* Header */}
      <div className="pt-2">
        <h1 className="text-[2rem] text-ink font-bold tracking-tight leading-none">Your Profile</h1>
        <p className="text-ink/40 text-[15px] mt-2">Manage your personal information and preferences.</p>
      </div>

      {/* Main Profile Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden">
        {/* Banner */}
        <div className="h-32 bg-gradient-to-r from-maroon to-maroon-deep relative">
          <div className="absolute inset-0 opacity-10 bg-[url('/images/grain.png')]" />
        </div>
        
        <div className="px-8 pb-8 relative">
          {/* Avatar */}
          <div className="w-24 h-24 rounded-2xl bg-gold border-4 border-white flex items-center justify-center shadow-md absolute -top-12">
            <span className="text-3xl font-bold text-maroon-deep">
              {getInitials(user?.name)}
            </span>
          </div>

          <div className="pt-16 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-ink tracking-tight">{user?.name || 'Student'}</h2>
              <p className="text-ink/50 font-medium capitalize mt-1 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-gold"></span>
                {user?.role || 'Student'}
              </p>
            </div>
            <button 
              onClick={() => {
                setForm({
                  name: user?.name || '',
                  studentId: user?.studentId || '',
                  staffId: user?.staffId || '',
                  department: user?.department || '',
                  faculty: user?.faculty || ''
                })
                setIsEditing(true)
              }}
              className="px-5 py-2.5 bg-maroon/5 text-maroon hover:bg-maroon hover:text-white font-semibold rounded-xl transition-colors duration-200 text-sm"
            >
              Edit Profile
            </button>
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-border p-8">
          <h3 className="text-lg font-bold text-ink mb-6 flex items-center gap-2">
            <svg className="w-5 h-5 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Personal Details
          </h3>
          <div className="space-y-5">
            <div>
              <p className="text-[11px] font-semibold text-ink/40 uppercase tracking-widest mb-1">Email Address</p>
              <p className="text-[15px] font-medium text-ink">{user?.email || 'N/A'}</p>
            </div>
            <div>
              <p className="text-[11px] font-semibold text-ink/40 uppercase tracking-widest mb-1">ID Number</p>
              <p className="text-[15px] font-medium text-ink">{user?.studentId || user?.staffId || user?.id || 'N/A'}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-border p-8">
          <h3 className="text-lg font-bold text-ink mb-6 flex items-center gap-2">
            <svg className="w-5 h-5 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            Academic Information
          </h3>
          <div className="space-y-5">
            <div>
              <p className="text-[11px] font-semibold text-ink/40 uppercase tracking-widest mb-1">Faculty</p>
              <p className="text-[15px] font-medium text-ink">{user?.faculty || 'N/A'}</p>
            </div>
            <div>
              <p className="text-[11px] font-semibold text-ink/40 uppercase tracking-widest mb-1">Department</p>
              <p className="text-[15px] font-medium text-ink">{user?.department || 'N/A'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm" onClick={() => setIsEditing(false)} />
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 md:p-8 animate-slide-in-up">
            <h3 className="text-xl font-bold text-ink mb-6">Edit Profile</h3>
            
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-[11px] font-semibold text-ink/40 uppercase tracking-widest mb-2">Full Name</label>
                <Input name="name" value={form.name} onChange={handleEditChange} required />
              </div>
              
              <div>
                <label className="block text-[11px] font-semibold text-ink/40 uppercase tracking-widest mb-2">
                  {user?.role === 'staff' ? 'Staff ID' : 'Student ID'}
                </label>
                <Input 
                  name={user?.role === 'staff' ? 'staffId' : 'studentId'} 
                  value={user?.role === 'staff' ? form.staffId : form.studentId} 
                  onChange={handleEditChange} 
                  required 
                />
              </div>

              {user?.role !== 'non-staff' && (
                <div>
                  <label className="block text-[11px] font-semibold text-ink/40 uppercase tracking-widest mb-2">Faculty</label>
                  <select 
                    name="faculty" 
                    value={form.faculty} 
                    onChange={handleEditChange}
                    required
                    className="w-full px-4 py-3.5 text-[14px] rounded-xl bg-white border border-mist/80 text-ink
                      focus:outline-none focus:ring-2 focus:ring-maroon/15 focus:border-maroon/40
                      transition-all duration-200 appearance-none cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.04)]
                      bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2016%2016%22%3E%3Cpath%20fill%3D%22%23800000%22%20d%3D%22M4.5%206l3.5%204%203.5-4z%22/%3E%3C/svg%3E')]
                      bg-no-repeat bg-[right_12px_center]"
                  >
                    <option value="">Select Faculty</option>
                    {FACULTIES.map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-[11px] font-semibold text-ink/40 uppercase tracking-widest mb-2">Department</label>
                <Input name="department" value={form.department} onChange={handleEditChange} required />
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="button" variant="ghost" onClick={() => setIsEditing(false)} fullWidth>Cancel</Button>
                <Button type="submit" loading={loading} fullWidth>Save Changes</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
