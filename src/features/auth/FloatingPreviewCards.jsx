/**
 * Floating preview cards and decorative brand wall for AuthPage
 */
export function TicketPreviewCard() {
  return (
    <div className="floating-card floating-card-1 w-[260px] bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] border border-mist/40 p-5 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-maroon via-gold to-maroon" />
      <div className="flex items-center justify-between mb-4">
        <span className="text-[10px] font-semibold text-ink/40 uppercase tracking-widest">Recent Ticket</span>
        <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
      </div>
      <p className="text-[13px] font-semibold text-ink leading-snug mb-3">Broken AC in Lecture Hall B</p>
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-mono text-ink/40">#UNILAG-00042</span>
        <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-pending/10 text-pending uppercase tracking-wide">Under Review</span>
      </div>
      <div className="mt-4 flex items-center gap-2">
        <div className="flex-1 h-1.5 bg-mist-light rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-maroon to-gold rounded-full" style={{ width: '60%' }} />
        </div>
        <span className="text-[10px] font-mono text-ink/30">60%</span>
      </div>
    </div>
  )
}

export function SatisfactionCard() {
  return (
    <div className="floating-card floating-card-2 w-[220px] bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] border border-mist/40 p-5">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-lg bg-maroon/8 flex items-center justify-center">
          <svg className="w-4 h-4 text-maroon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </div>
        <span className="text-[11px] font-semibold text-ink/50">Satisfaction</span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-[2rem] font-bold text-ink font-mono leading-none">78%</span>
        <span className="text-[11px] text-resolved font-semibold">↑ 4.2%</span>
      </div>
      <div className="mt-3 flex items-center gap-1">
        {[1, 2, 3, 4, 5].map(i => (
          <svg key={i} className={`w-3.5 h-3.5 ${i <= 4 ? 'text-gold' : 'text-mist'}`} fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    </div>
  )
}

export function StatsCard() {
  return (
    <div className="floating-card floating-card-3 w-[200px] bg-gradient-to-br from-maroon-deep to-maroon rounded-2xl shadow-[0_12px_40px_rgba(80,4,4,0.25)] p-5 text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`
      }} />
      <div className="relative z-10">
        <p className="text-[10px] font-semibold text-white/40 uppercase tracking-widest mb-3">Campus Impact</p>
        <p className="text-[2rem] font-bold font-mono leading-none">47</p>
        <p className="text-[11px] text-white/40 mt-1.5">Complaints resolved so far</p>
        <div className="mt-4 flex items-center gap-1.5">
          <span className="px-2 py-0.5 rounded-full bg-gold/20 text-gold text-[10px] font-semibold">48h</span>
          <span className="text-[10px] text-white/30">avg response</span>
        </div>
      </div>
    </div>
  )
}

export default function FloatingPreviewCards() {
  return (
    <div className="hidden lg:flex lg:w-[45%] relative items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#F0E8E0] via-[#EDE5DA] to-[#E8DDD0]" />

      {/* Subtle pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, var(--color-maroon) 1px, transparent 0)`,
        backgroundSize: '32px 32px'
      }} />

      {/* Decorative blobs */}
      <div className="absolute top-20 right-20 w-[300px] h-[300px] rounded-full bg-maroon/5 blur-[100px]" />
      <div className="absolute bottom-20 left-10 w-[250px] h-[250px] rounded-full bg-gold/8 blur-[80px]" />

      {/* Floating cards */}
      <div className="relative z-10 w-full max-w-[500px] h-[500px]">
        <div className="absolute top-[10%] left-[5%]">
          <TicketPreviewCard />
        </div>
        <div className="absolute top-[35%] right-[0%]">
          <SatisfactionCard />
        </div>
        <div className="absolute bottom-[5%] left-[15%]">
          <StatsCard />
        </div>
      </div>

      {/* Bottom branding */}
      <div className="absolute bottom-8 left-0 right-0 text-center">
        <p className="text-[11px] text-ink/20 tracking-widest uppercase">
          University of Lagos · Quality Assurance
        </p>
      </div>
    </div>
  )
}
