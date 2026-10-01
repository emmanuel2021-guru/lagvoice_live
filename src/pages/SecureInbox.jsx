import { useState, useEffect } from 'react'
import { messageService } from '../services/messageService'
import { useSelector } from 'react-redux'
import { formatRelativeTime } from '../utils/formatters'

export default function SecureInbox() {
  const { user } = useSelector(state => state.auth)
  const [activeTab, setActiveTab] = useState('inbox')
  const [messages, setMessages] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  
  const [composing, setComposing] = useState(false)
  const [formData, setFormData] = useState({ recipientId: '', subject: '', body: '' })
  const [sending, setSending] = useState(false)

  const fetchMessages = async (type) => {
    try {
      setLoading(true)
      const res = await messageService.getMessages(type)
      setMessages(res?.data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const fetchUsers = async () => {
    try {
      const res = await messageService.getStaffUsers()
      setUsers((res?.data || []).filter(u => String(u.id) !== String(user.id)))
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchMessages(activeTab)
    fetchUsers()
  }, [activeTab])

  const handleSend = async (e) => {
    e.preventDefault()
    setSending(true)
    try {
      await messageService.sendMessage(formData)
      setComposing(false)
      setFormData({ recipientId: '', subject: '', body: '' })
      if (activeTab === 'sent') fetchMessages('sent')
      alert('Message sent securely.')
    } catch (err) {
      console.error(err)
      alert('Failed to send message.')
    } finally {
      setSending(false)
    }
  }

  const handleMarkRead = async (id) => {
    try {
      await messageService.markAsRead(id)
      setMessages(messages.map(m => m.id === id ? { ...m, isRead: true } : m))
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold text-gold-dark uppercase tracking-[0.15em] mb-1">Internal Comm</p>
          <h1 className="text-[1.8rem] lg:text-[2.2rem] font-bold text-ink leading-tight tracking-tight">Secure Inbox</h1>
        </div>
        <button
          onClick={() => setComposing(true)}
          className="px-6 py-2.5 rounded-xl bg-maroon text-white font-semibold text-[13px] shadow-[0_2px_6px_rgba(128,0,0,0.15)] hover:bg-maroon-dark transition-all"
        >
          Compose Message
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-mist/50">
        {['inbox', 'sent'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 px-1 text-[13px] font-bold capitalize transition-colors relative ${
              activeTab === tab ? 'text-maroon' : 'text-ink/40 hover:text-ink/60'
            }`}
          >
            {tab}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-maroon rounded-t-full" />
            )}
          </button>
        ))}
      </div>

      {/* Message List */}
      <div className="bg-paper rounded-2xl border border-mist/50 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-[13px] text-ink/40 font-medium">Loading messages...</div>
        ) : messages.length === 0 ? (
          <div className="p-12 text-center text-[13px] text-ink/40 font-medium">No messages found.</div>
        ) : (
          <div className="divide-y divide-mist/15">
            {messages.map(m => (
              <div key={m.id} className={`p-5 transition-colors ${!m.isRead && activeTab === 'inbox' ? 'bg-cream/20' : 'hover:bg-cream/30'}`}>
                <div className="flex justify-between items-start gap-4 mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-maroon/10 flex items-center justify-center shrink-0">
                      <span className="text-[12px] font-bold text-maroon">
                        {(activeTab === 'inbox' ? m.sender?.name : m.recipient?.name)?.charAt(0) || '?'}
                      </span>
                    </div>
                    <div>
                      <p className="text-[13px] font-bold text-ink">
                        {activeTab === 'inbox' ? m.sender?.name : m.recipient?.name}
                      </p>
                      <p className="text-[11px] text-ink/40">
                        {activeTab === 'inbox' ? m.sender?.department : m.recipient?.department}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[11px] text-ink/40 font-mono">{formatRelativeTime(m.createdAt)}</p>
                    {activeTab === 'inbox' && !m.isRead && (
                      <button onClick={() => handleMarkRead(m.id)} className="text-[10px] font-bold text-maroon uppercase tracking-wider mt-1 hover:underline">
                        Mark as Read
                      </button>
                    )}
                  </div>
                </div>
                <div className="pl-11">
                  <h4 className="text-[14px] font-semibold text-ink mb-1">{m.subject}</h4>
                  <p className="text-[13px] text-ink/70 leading-relaxed whitespace-pre-wrap">{m.body}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Compose Modal */}
      {composing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/20 backdrop-blur-sm">
          <div className="bg-paper rounded-2xl w-full max-w-lg shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-mist/30 flex justify-between items-center bg-cream/30">
              <h3 className="font-bold text-ink text-[16px]">New Secure Message</h3>
              <button onClick={() => setComposing(false)} className="text-ink/40 hover:text-ink transition-colors">
                ✕
              </button>
            </div>
            <form onSubmit={handleSend} className="p-6 space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-ink/50 uppercase tracking-wider mb-1.5">To</label>
                <select
                  required
                  value={formData.recipientId}
                  onChange={e => setFormData({ ...formData, recipientId: e.target.value })}
                  className="w-full h-11 px-4 rounded-xl border border-mist bg-white text-[14px] text-ink focus:border-maroon focus:ring-1 focus:ring-maroon outline-none transition-all"
                >
                  <option value="">Select recipient...</option>
                  {users.map(u => (
                    <option key={u.id} value={u.id}>{u.name} ({u.role.toUpperCase()}) - {u.department}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-ink/50 uppercase tracking-wider mb-1.5">Subject</label>
                <input
                  required
                  type="text"
                  value={formData.subject}
                  onChange={e => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full h-11 px-4 rounded-xl border border-mist bg-white text-[14px] text-ink focus:border-maroon focus:ring-1 focus:ring-maroon outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-ink/50 uppercase tracking-wider mb-1.5">Message</label>
                <textarea
                  required
                  rows={5}
                  value={formData.body}
                  onChange={e => setFormData({ ...formData, body: e.target.value })}
                  className="w-full p-4 rounded-xl border border-mist bg-white text-[14px] text-ink focus:border-maroon focus:ring-1 focus:ring-maroon outline-none transition-all resize-none"
                />
              </div>
              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setComposing(false)}
                  className="px-5 py-2.5 rounded-xl font-semibold text-[13px] text-ink/60 hover:bg-mist/30 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={sending}
                  className="px-6 py-2.5 rounded-xl bg-maroon text-white font-semibold text-[13px] shadow-[0_2px_6px_rgba(128,0,0,0.15)] hover:bg-maroon-dark transition-all disabled:opacity-50"
                >
                  {sending ? 'Sending...' : 'Send Message'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
