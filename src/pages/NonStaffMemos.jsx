export default function NonStaffMemos() {
  const memos = [
    {
      id: 1,
      title: 'Mandatory Maintenance Check on AC Units',
      sender: 'Director of Works & Physical Planning',
      date: 'September 28, 2026',
      content: 'All non-teaching staff in the Infrastructure division must complete a mandatory check on all AC units in the main lecture halls by the end of this week. Please log any faulty units via the Helpdesk interface.',
      priority: 'high'
    },
    {
      id: 2,
      title: 'New Policy on Incident Escalation',
      sender: 'Quality Assurance Unit',
      date: 'September 25, 2026',
      content: 'Any ticket remaining in the "Pending" status for more than 48 hours will now be automatically flagged for administrative review. Ensure all assigned tickets are moved to "Under Review" as soon as investigation begins.',
      priority: 'medium'
    },
    {
      id: 3,
      title: 'Upcoming Public Holiday Roster',
      sender: 'Human Resources',
      date: 'September 15, 2026',
      content: 'The duty roster for the upcoming Independence Day holiday has been posted. Security and selected maintenance personnel on duty will be compensated according to the university guidelines.',
      priority: 'low'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <p className="text-[11px] font-bold text-[#1266f1] uppercase tracking-[0.15em] mb-1">Internal</p>
          <h1 className="text-[1.8rem] lg:text-[2.2rem] font-bold text-ink leading-tight tracking-tight">Memos & Announcements</h1>
        </div>
      </div>

      {/* Memos List */}
      <div className="space-y-4">
        {memos.map(memo => (
          <div key={memo.id} className="bg-white p-6 rounded-2xl border border-mist/50 hover:shadow-sm transition-all">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-[16px] font-bold text-ink">{memo.title}</h2>
                <p className="text-[12px] text-ink/50 mt-1">From: <span className="font-semibold text-ink/70">{memo.sender}</span> &middot; {memo.date}</p>
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md ${
                memo.priority === 'high' ? 'bg-[#f93154]/10 text-[#f93154]' :
                memo.priority === 'medium' ? 'bg-[#ffa900]/10 text-[#ffa900]' :
                'bg-mist text-ink/40'
              }`}>
                {memo.priority} priority
              </span>
            </div>
            <div className="bg-cream p-4 rounded-xl border border-mist/30">
              <p className="text-[13px] text-ink/80 leading-relaxed">{memo.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
