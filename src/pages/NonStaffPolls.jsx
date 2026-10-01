/**
 * StudentPolls — View and respond to admin-created polls
 * Polls created by administrators are visible here for students to participate in
 */
import { useState, useEffect } from 'react'
import { pollService } from '../services/pollService'

function PollOption({ label, index, selected, onSelect, disabled }) {
  return (
    <button
      onClick={() => !disabled && onSelect(index)}
      disabled={disabled}
      className={`w-full text-left p-3.5 rounded-xl border transition-all ${
        selected === index
          ? 'border-[#1266f1] bg-[#1266f1]/[0.04] shadow-[0_2px_8px_rgba(18,102,241,0.08)]'
          : 'border-[#E4E8EE] bg-white hover:border-[#1266f1]/20 hover:bg-[#F5F7FA]'
      } ${disabled ? 'cursor-default' : 'cursor-pointer'}`}
    >
      <div className="flex items-center gap-3">
        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
          selected === index ? 'border-[#1266f1] bg-[#1266f1]' : 'border-[#E4E8EE]'
        }`}>
          {selected === index && <div className="w-2 h-2 rounded-full bg-white" />}
        </div>
        <span className="text-[13px] font-medium text-[#262626]">{label}</span>
      </div>
    </button>
  )
}

function ResultBar({ label, count, total, index }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0
  const colors = ['#1266f1', '#ffa900', '#00b74a', '#b23cfd', '#f93154']
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-[12px] text-[#4f4f4f] font-medium">{label}</span>
        <span className="text-[11px] text-[#9fa6b2] font-mono">{pct}% ({count})</span>
      </div>
      <div className="h-2 bg-[#E4E8EE] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, backgroundColor: colors[index % colors.length] }}
        />
      </div>
    </div>
  )
}

export default function NonStaffPolls() {
  const [polls, setPolls] = useState([])
  const [selectedOptions, setSelectedOptions] = useState({})
  const [submittedPolls, setSubmittedPolls] = useState(new Set())
  const [loading, setLoading] = useState(true)

  const fetchPolls = async () => {
    try {
      const data = await pollService.getPolls()
      setPolls(data)
      const submitted = new Set(data.filter(p => p.responded).map(p => p.id))
      setSubmittedPolls(submitted)
      
      const options = {}
      data.forEach(p => {
        if (p.responded) options[p.id] = p.userOptionIndex
      })
      setSelectedOptions(options)
    } catch (err) {
      console.error('Failed to fetch polls', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPolls()
  }, [])

  const handleSelect = (pollId, optionIndex) => {
    setSelectedOptions(prev => ({ ...prev, [pollId]: optionIndex }))
  }

  const handleSubmit = async (pollId) => {
    try {
      await pollService.submitResponse(pollId, selectedOptions[pollId])
      setSubmittedPolls(prev => new Set([...prev, pollId]))
      // Refresh to get actual stats
      fetchPolls()
    } catch (err) {
      console.error('Failed to submit poll', err)
      alert(err.response?.data?.message || 'Failed to submit vote')
    }
  }

  const activePolls = polls.filter(p => p.status === 'active')
  const closedPolls = polls.filter(p => p.status === 'closed')

  if (loading) {
    return <div className="text-center py-10 text-[#9fa6b2]">Loading polls...</div>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <p className="text-[11px] font-bold text-[#9fa6b2] uppercase tracking-[0.15em] mb-1">Engagement</p>
        <h1 className="text-[1.8rem] lg:text-[2.2rem] font-bold text-[#262626] leading-tight tracking-tight">Polls & Surveys</h1>
        <p className="text-[14px] text-[#9fa6b2] mt-1">Vote on active polls and see results from closed ones</p>
      </div>

      {/* Active Polls */}
      {activePolls.length > 0 && (
        <div>
          <h2 className="text-[14px] font-bold text-[#262626] mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00b74a] animate-pulse" />
            Active Polls
          </h2>
          <div className="space-y-4">
            {activePolls.map(poll => {
              const isSubmitted = submittedPolls.has(poll.id)
              const selected = selectedOptions[poll.id]
              const daysLeft = Math.max(0, Math.ceil((new Date(poll.deadline) - new Date()) / 86400000))

              return (
                <div key={poll.id} className="bg-white rounded-2xl border border-[#E4E8EE] p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-[15px] font-bold text-[#262626]">{poll.title}</h3>
                      <p className="text-[13px] text-[#9fa6b2] mt-1 leading-relaxed">{poll.description}</p>
                    </div>
                    <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-[#00b74a]/10 text-[#00b74a] shrink-0 ml-3">
                      {daysLeft}d left
                    </span>
                  </div>

                  <div className="flex items-center gap-3 mb-4 text-[11px] text-[#9fa6b2]">
                    <span className="flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {poll.totalResponses} responses
                    </span>
                    <span>&middot;</span>
                    <span>Target: {poll.target}</span>
                  </div>

                  {isSubmitted ? (
                    <div className="bg-[#F5F7FA] rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <svg className="w-4 h-4 text-[#00b74a]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-[12px] font-semibold text-[#00b74a]">You have voted</span>
                      </div>
                      <p className="text-[11px] text-[#9fa6b2] mb-3">Results:</p>
                      <div className="space-y-3">
                        {poll.options.map((opt, i) => {
                          // Simulate results for active polls
                          const simulatedResults = poll.options.map((_, j) => Math.floor(Math.random() * 100) + 20)
                          const total = simulatedResults.reduce((a, b) => a + b, 0)
                          return <ResultBar key={i} label={opt} count={simulatedResults[i]} total={total} index={i} />
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {poll.options.map((opt, i) => (
                        <PollOption
                          key={i}
                          label={opt}
                          index={i}
                          selected={selected}
                          onSelect={(idx) => handleSelect(poll.id, idx)}
                        />
                      ))}
                      <button
                        onClick={() => handleSubmit(poll.id)}
                        disabled={selected === undefined}
                        className="w-full mt-3 py-3 rounded-xl bg-[#1266f1] text-white font-semibold text-[13px] shadow-[0_2px_8px_rgba(18,102,241,0.2)] hover:bg-[#0e52c1] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        Submit Vote
                      </button>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Closed Polls */}
      {closedPolls.length > 0 && (
        <div>
          <h2 className="text-[14px] font-bold text-[#262626] mb-3">Past Polls</h2>
          <div className="space-y-4">
            {closedPolls.map(poll => {
              const maxResult = poll.results ? Math.max(...poll.results) : 0
              const total = poll.results ? poll.results.reduce((a, b) => a + b, 0) : 0

              return (
                <div key={poll.id} className="bg-white rounded-2xl border border-[#E4E8EE] p-6 opacity-75">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-[15px] font-bold text-[#262626]">{poll.title}</h3>
                      <p className="text-[13px] text-[#9fa6b2] mt-1">{poll.description}</p>
                    </div>
                    <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-[#E4E8EE] text-[#9fa6b2] shrink-0 ml-3">
                      Closed
                    </span>
                  </div>

                  <div className="flex items-center gap-3 mb-4 text-[11px] text-[#9fa6b2]">
                    <span>{poll.totalResponses} total responses</span>
                    <span>&middot;</span>
                    <span>{poll.responded ? 'You voted' : 'You did not vote'}</span>
                  </div>

                  <div className="bg-[#F5F7FA] rounded-xl p-4 space-y-3">
                    {poll.options.map((opt, i) => (
                      <ResultBar key={i} label={opt} count={poll.results[i]} total={total} index={i} />
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
