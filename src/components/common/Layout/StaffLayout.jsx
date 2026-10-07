/**
 * StaffLayout — Clean expanded sidebar navigation
 * Dark navy sidebar with full labels and icons, modern cards, warm welcome banner
 * Supports dark mode theming, search hotkey, and logout confirmation modal
 */
import { useState, useEffect, useRef } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../../hooks/useAuth'
import { useDarkModeToggle } from '../../../hooks/useDarkMode'
import NotificationBell from '../NotificationBell/NotificationBell'
import NavIcon from '../NavIcon'
import LogoutModal from '../LogoutModal'

export const hrNavItems = [
  { label: 'Overview', path: '/hr', icon: 'grid' },
  { label: 'Staff Directory', path: '/hr/staff', icon: 'people' },
  { label: 'Appraisals', path: '/hr/appraisals', icon: 'star' },
  { label: 'Grievances', path: '/hr/grievances', icon: 'tickets' },
]

export const getStaffNavItems = (role) => {
  if (role === 'hr') {
    return hrNavItems
  }
  const isHodOrDean = role === 'hod' || role === 'dean'
  const basePath = role === 'hod' ? '/hod' : role === 'dean' ? '/dean' : '/staff'
  const items = [
    { label: 'Dashboard', path: basePath, icon: 'grid' },
    { label: 'Inbox', path: '/staff/inbox', icon: 'message' },
    { label: 'Peer Review', path: '/staff/peer-review', icon: 'people' },
  ]
  if (isHodOrDean) {
    items.push(
      { label: 'Supervisory', path: '/staff/supervisory', icon: 'star' },
      { label: 'Self-Assess', path: '/staff/self-assessment', icon: 'shield' }
    )
  }
  return items
}

export const nonStaffNavItems = [
  { label: 'Helpdesk', path: '/non-staff', icon: 'inbox' },
  { label: 'Inbox', path: '/staff/inbox', icon: 'message' },
  { label: 'Polls', path: '/non-staff/polls', icon: 'chart' },
  { label: 'Memos', path: '/non-staff/memos', icon: 'file' },
]

export default function StaffLayout({ children }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showLogout, setShowLogout] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [darkMode, toggleDark] = useDarkModeToggle()
  const searchInputRef = useRef(null)

  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout, isNonStaff, isHr } = useAuth()

  const isHod = user?.role === 'hod' || user?.role === 'dean'
  const userIsHr = isHr || user?.role === 'hr'
  const navItems = userIsHr
    ? hrNavItems
    : isNonStaff
    ? nonStaffNavItems
    : getStaffNavItems(user?.role)
  const basePath = userIsHr
    ? '/hr'
    : isNonStaff
    ? '/non-staff'
    : user?.role === 'hod'
    ? '/hod'
    : user?.role === 'dean'
    ? '/dean'
    : '/staff'

  // Global hotkey: press '/' to focus search input
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) {
        e.preventDefault()
        searchInputRef.current?.focus()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleLogout = () => {
    setShowLogout(true)
  }

  const confirmLogout = () => {
    logout()
    setShowLogout(false)
    navigate('/login')
  }

  return (
    <div className={`flex h-screen transition-colors duration-300 ${darkMode ? 'bg-[#0f172a]' : 'bg-[#F0F3F8]'}`}>
      {/* Logout Confirmation */}
      <LogoutModal open={showLogout} onConfirm={confirmLogout} onCancel={() => setShowLogout(false)} />

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      {/* ═══ Sidebar — Expanded Navigation ═══ */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-[#1E1B4B] flex flex-col shrink-0
        transition-transform duration-300 lg:translate-x-0 lg:static lg:z-50
        ${isMobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
      `}>
        {/* Logo and Brand */}
        <div className="flex items-center justify-between px-5 pt-6 pb-5 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <img src="/images/logo-n.png" alt="LagVoice" className="w-10 h-10 rounded-xl object-contain bg-white shrink-0 shadow-sm p-0.5" />
            <div className="flex flex-col min-w-0">
              <span className="text-white font-bold text-[17px] tracking-tight leading-tight truncate">LagVoice</span>
              <span className="text-white/40 text-[11px] font-medium tracking-wider uppercase truncate">
                {isHod ? (user?.role === 'dean' ? 'Dean Portal' : 'HOD Portal') : userIsHr ? 'HR Portal' : isNonStaff ? 'Helpdesk Portal' : 'Staff Portal'}
              </span>
            </div>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close navigation"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 flex flex-col gap-1 px-3 py-4 overflow-y-auto no-scrollbar" aria-label="Main navigation">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={({ isActive }) =>
                `group flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all duration-200 w-full ${
                  isActive
                    ? darkMode
                      ? 'bg-white text-[#1E1B4B] shadow-[0_0_20px_rgba(96,140,255,0.45)] ring-1 ring-white/30 sidebar-active-glow'
                      : 'bg-white text-[#1E1B4B] shadow-md shadow-black/10'
                    : darkMode
                      ? 'text-white/60 hover:text-white hover:bg-white/12'
                      : 'text-white/60 hover:text-white hover:bg-white/10'
                }`
              }
              end={item.path === basePath}
            >
              <span className="shrink-0">
                <NavIcon icon={item.icon} />
              </span>
              <span className="font-medium text-sm truncate">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Bottom actions */}
        <div className="flex flex-col gap-1 px-3 pb-6 pt-3 border-t border-white/10 shrink-0">
          {/* Dark mode toggle */}
          <button
            onClick={toggleDark}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all duration-200 w-full text-left ${
              darkMode ? 'text-yellow-300 hover:text-yellow-200 hover:bg-white/10' : 'text-white/60 hover:text-white hover:bg-white/10'
            }`}
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            <span className="shrink-0">
              <NavIcon icon={darkMode ? 'sun' : 'moon'} />
            </span>
            <span className="font-medium text-sm truncate">
              {darkMode ? 'Light mode' : 'Dark mode'}
            </span>
          </button>
          <button
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-all duration-200 w-full text-left"
            aria-label="Settings"
          >
            <span className="shrink-0">
              <NavIcon icon="settings" />
            </span>
            <span className="font-medium text-sm truncate">Settings</span>
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-white/60 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 w-full text-left"
            aria-label="Log out"
          >
            <span className="shrink-0">
              <NavIcon icon="logout" />
            </span>
            <span className="font-medium text-sm truncate">Log out</span>
          </button>
        </div>
      </aside>

      {/* ═══ Main Content ═══ */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className={`h-[68px] px-6 shrink-0 transition-colors duration-300 ${
          darkMode ? 'bg-[#1e293b] border-b border-white/5' : 'bg-white border-b border-[#E4E8EE]'
        }`}>
          <div className="flex items-center justify-between h-full">
            {/* Left: hamburger + title + breadcrumb */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className={`p-2 -ml-2 rounded-lg lg:hidden transition-colors ${darkMode ? 'hover:bg-white/5' : 'hover:bg-[#F0F3F8]'}`}
                aria-label="Open navigation"
              >
                <svg className={`w-5 h-5 ${darkMode ? 'text-white/70' : 'text-[#4f4f4f]'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <div>
                <h2 className={`text-[17px] font-bold tracking-tight leading-tight ${darkMode ? 'text-white' : 'text-[#262626]'}`}>
                  {navItems.find((i) => i.path === location.pathname)?.label || 'Overview'}
                </h2>
                <p className={`text-[11px] hidden sm:block ${darkMode ? 'text-white/40' : 'text-[#9fa6b2]'}`}>
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
            </div>

            {/* Right: search + quick actions + notif + avatar */}
            <div className="flex items-center gap-2">
              {/* Search with hotkey */}
              <div className={`hidden lg:flex items-center gap-2 px-4 py-2 rounded-xl border transition-colors w-56 ${
                darkMode ? 'bg-[#0f172a] border-white/10 hover:border-white/20' : 'bg-[#F5F7FA] border-[#E4E8EE] hover:border-[#1266f1]/20'
              }`}>
                <svg className={`w-4 h-4 ${darkMode ? 'text-white/30' : 'text-[#9fa6b2]'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
                </svg>
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search anything..."
                  className={`bg-transparent border-none text-[13px] focus:outline-none w-full placeholder:text-[#9fa6b2] ${darkMode ? 'text-white' : 'text-[#4f4f4f]'}`}
                  aria-label="Search"
                />
                {/* TODO: Implement search query filtering/modal logic */}
                <kbd className={`text-[10px] border rounded px-1.5 py-0.5 font-mono shrink-0 ${darkMode ? 'text-white/30 border-white/10 bg-transparent' : 'text-[#9fa6b2] border-[#E4E8EE] bg-white'}`}>/</kbd>
              </div>

              {/* Quick action buttons */}
              <div className="hidden md:flex items-center gap-1.5">
                <button
                  className={`p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-white/5 text-white/50 hover:text-white' : 'hover:bg-[#F0F3F8] text-[#9fa6b2] hover:text-[#1266f1]'}`}
                  title="Export report"
                >
                  <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </button>
                <button
                  className={`p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-white/5 text-white/50 hover:text-white' : 'hover:bg-[#F0F3F8] text-[#9fa6b2] hover:text-[#1266f1]'}`}
                  title="Settings"
                >
                  <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
                  </svg>
                </button>
              </div>

              {/* Divider */}
              <div className={`w-px h-6 hidden md:block ${darkMode ? 'bg-white/10' : 'bg-[#E4E8EE]'}`} />

              {/* Dark mode toggle (visible on all sizes) */}
              <button
                onClick={toggleDark}
                className={`p-2.5 rounded-xl transition-colors ${darkMode ? 'hover:bg-white/5 text-yellow-400' : 'hover:bg-[#F0F3F8] text-[#4f4f4f]'}`}
                aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {darkMode ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>

              {/* Notifications */}
              <NotificationBell />

              {/* Avatar with name */}
              <div className={`flex items-center gap-2.5 pl-2 border-l ${darkMode ? 'border-white/10' : 'border-[#E4E8EE]'}`}>
                <div className="text-right hidden sm:block">
                  <p className={`text-[13px] font-semibold leading-tight ${darkMode ? 'text-white' : 'text-[#262626]'}`}>{user?.name || (userIsHr ? 'HR Officer' : 'Staff')}</p>
                  <p className={`text-[11px] ${darkMode ? 'text-white/40' : 'text-[#9fa6b2]'}`}>{userIsHr ? 'Department HR' : user?.role || 'Staff Member'}</p>
                </div>
                <div className="w-9 h-9 rounded-xl bg-[#1266f1] flex items-center justify-center text-white text-[13px] font-bold shadow-sm">
                  {user?.name?.charAt(0) || 'S'}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className={`flex-1 overflow-y-auto p-4 lg:p-8 transition-colors duration-300 ${darkMode ? 'bg-[#0f172a]' : 'bg-[#F0F3F8]'}`} role="main">
          {children}
        </main>
      </div>
    </div>
  )
}
