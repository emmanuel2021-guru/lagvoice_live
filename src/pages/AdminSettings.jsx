import { useState } from 'react'

export default function AdminSettings() {
  const [maintenance, setMaintenance] = useState(false)
  const [allowAnon, setAllowAnon] = useState(true)

  return (
    <div className="space-y-6">
      <div>
        <p className="text-[11px] font-bold text-ink/40 uppercase tracking-[0.15em] mb-1">Configuration</p>
        <h1 className="text-[1.8rem] lg:text-[2.2rem] font-bold text-ink leading-tight tracking-tight">Settings</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-mist/50 p-6 space-y-6">
          <h2 className="text-[15px] font-bold text-ink border-b border-mist/50 pb-4">System Preferences</h2>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[14px] font-semibold text-ink">Maintenance Mode</p>
              <p className="text-[12px] text-ink/50">Disable student logins temporarily</p>
            </div>
            <button 
              onClick={() => setMaintenance(!maintenance)}
              className={`w-12 h-6 rounded-full transition-colors relative ${maintenance ? 'bg-red-500' : 'bg-mist'}`}
            >
              <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${maintenance ? 'left-7' : 'left-1'}`} />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-[14px] font-semibold text-ink">Allow Anonymous Submissions</p>
              <p className="text-[12px] text-ink/50">Students can submit feedback without identifying themselves</p>
            </div>
            <button 
              onClick={() => setAllowAnon(!allowAnon)}
              className={`w-12 h-6 rounded-full transition-colors relative ${allowAnon ? 'bg-[#00b74a]' : 'bg-mist'}`}
            >
              <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${allowAnon ? 'left-7' : 'left-1'}`} />
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-mist/50 p-6 space-y-6">
          <h2 className="text-[15px] font-bold text-ink border-b border-mist/50 pb-4">Integrations</h2>
          
          <div>
            <p className="text-[11px] font-semibold text-ink/40 uppercase tracking-wider mb-2">SMTP Server (Emails)</p>
            <input 
              type="text" 
              defaultValue="smtp.unilag.edu.ng"
              className="w-full px-4 py-3 rounded-xl bg-cream border border-mist/50 text-[14px] focus:outline-none focus:border-[#1266f1]/40"
            />
          </div>

          <div>
            <p className="text-[11px] font-semibold text-ink/40 uppercase tracking-wider mb-2">SMS Gateway API Key</p>
            <input 
              type="password" 
              defaultValue="************************"
              className="w-full px-4 py-3 rounded-xl bg-cream border border-mist/50 text-[14px] focus:outline-none focus:border-[#1266f1]/40"
            />
          </div>

          <button className="w-full py-3 bg-[#1266f1] text-white rounded-xl text-[13px] font-semibold hover:bg-[#0e52c1] transition-colors">
            Save Configuration
          </button>
        </div>
      </div>
    </div>
  )
}
