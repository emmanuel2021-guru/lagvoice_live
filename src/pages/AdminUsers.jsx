import { useState, useEffect } from 'react'
import api from '../services/api'

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)

  const fetchUsers = async () => {
    try {
      const res = await api.get('/auth/users')
      setUsers(res.data)
    } catch (err) {
      console.error('Failed to load users', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleSyncHR = async () => {
    setSyncing(true)
    try {
      const res = await api.post('/auth/sync-hr')
      alert(res.data.message)
      await fetchUsers()
    } catch (err) {
      console.error('HR sync failed', err)
      alert('Failed to sync with HR system')
    } finally {
      setSyncing(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-[11px] font-bold text-[#1266f1] uppercase tracking-[0.15em] mb-1">User Management</p>
          <h1 className="text-[1.8rem] lg:text-[2.2rem] font-bold text-ink leading-tight tracking-tight">Users</h1>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleSyncHR}
            disabled={syncing}
            className="px-4 py-2 border border-mist/80 text-ink/70 rounded-xl text-[13px] font-semibold hover:bg-mist/30 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {syncing ? (
              <>
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                Syncing...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
                Sync HR Data (Mock)
              </>
            )}
          </button>
          <button className="px-4 py-2 bg-[#1266f1] text-white rounded-xl text-[13px] font-semibold hover:bg-[#0e52c1] transition-all">
            + Add User
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-mist/50 p-6 overflow-hidden">
        {loading ? (
          <div className="text-center py-10 text-ink/40">Loading users...</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-mist/50">
                <th className="py-3 px-4 text-[12px] font-semibold text-ink/50 uppercase tracking-wider">Name</th>
                <th className="py-3 px-4 text-[12px] font-semibold text-ink/50 uppercase tracking-wider">Email</th>
                <th className="py-3 px-4 text-[12px] font-semibold text-ink/50 uppercase tracking-wider">Role</th>
                <th className="py-3 px-4 text-[12px] font-semibold text-ink/50 uppercase tracking-wider">Department</th>
                <th className="py-3 px-4 text-[12px] font-semibold text-ink/50 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} className="border-b border-mist/20 hover:bg-cream/20 transition-colors">
                  <td className="py-4 px-4 text-[14px] font-medium text-ink">{u.name}</td>
                  <td className="py-4 px-4 text-[13px] text-ink/70">{u.email}</td>
                  <td className="py-4 px-4 text-[13px]">
                    <span className="px-2.5 py-1 rounded-full bg-mist text-ink/70 text-[11px] font-semibold uppercase tracking-wider">
                      {u.role}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-[13px] text-ink/70">{u.department}</td>
                  <td className="py-4 px-4 text-[13px]">
                    <button className="text-[#1266f1] hover:underline mr-3">Edit</button>
                    <button className="text-red-500 hover:underline">Suspend</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
