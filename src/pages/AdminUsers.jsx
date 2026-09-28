import { useState, useEffect } from 'react'
import api from '../services/api'

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
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
    fetchUsers()
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-[11px] font-bold text-[#1266f1] uppercase tracking-[0.15em] mb-1">User Management</p>
          <h1 className="text-[1.8rem] lg:text-[2.2rem] font-bold text-ink leading-tight tracking-tight">Users</h1>
        </div>
        <button className="px-4 py-2 bg-[#1266f1] text-white rounded-xl text-[13px] font-semibold hover:bg-[#0e52c1] transition-all">
          + Add User
        </button>
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
