/**
 * StudentLayout — Desktop: animated expanded sidebar, Mobile: bottom nav
 * Dark mode support with toggle, search hotkey, and shared modal
 */
import { useState, useEffect, useRef } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../../hooks/useAuth'
import { useDarkModeToggle } from '../../../hooks/useDarkMode'
import NotificationBell from '../NotificationBell/NotificationBell'
import NavIcon from '../NavIcon'
import LogoutModal from '../LogoutModal'

export const studentNavItems = [
  { label: 'Home', path: '/student', icon: 'home' },
  { label: 'Feedback', path: '/student/feedback', icon: 'feedback' },
  { label: 'Tickets', path: '/student/tickets', icon: 'tickets' },
  { label: 'Evaluate', path: '/student/evaluations', icon: 'star' },
  { label: 'Polls', path: '/student/polls', icon: 'chart' },
  { label: 'Profile', path: '/student/profile', icon: 'profile' },
]

export default function StudentLayout({ children }) {
  const [showLogout, setShowLogout] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [darkMode, toggleDark] = useDarkModeToggle()
  const [sidebarReady, setSidebarReady] = useState(false)
  const searchInputRef = useRef(null)

  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  // Sidebar entrance animation
  useEffect(() => {
    const t = setTimeout(() => setSidebarReady(true), 100)
    return () => clearTimeout(t)
  }, [])

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

  const handleLogout = () => setShowLogout(true)
  const confirmLogout = () => {
    logout()
    setShowLogout(false)
    navigate('/login')
  }

  return (
    <div className={`flex h-screen transition-colors duration-300 ${darkMode ? 'bg-[#0f172a]' : 'bg-[#F0F3F8]'}`}>
      <LogoutModal open={showLogout} onConfirm={confirmLogout} onCancel={() => setShowLogout(false)} />

      {/* ═══ Desktop Sidebar — animated entry ═══ */}
      <aside className={`
        hidden lg:flex fixed inset-y-0 left-0 z-50 w-64 bg-[#1E1B4B] flex-col shrink-0
        transition-all duration-700 ease-out
        ${sidebarReady ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-full'}
      `}>
        {/* Logo and Brand */}
        <div className="flex items-center gap-3 px-5 pt-6 pb-5 border-b border-white/10 shrink-0">
          <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 shadow-sm" style={{
            animation: sidebarReady ? 'sidebar-logo-glow 1.5s ease-out forwards' : 'none',
          }}>
            <img src="/images/logo-n.png" alt="LagVoice" className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-white font-bold text-[17px] tracking-tight leading-tight truncate">LagVoice</span>
            <span className="text-white/40 text-[11px] font-medium tracking-wider uppercase truncate">Student Portal</span>
          </div>
        </div>

        {/* Nav items with staggered entrance */}
        <nav className="flex-1 flex flex-col gap-1 px-3 py-4 overflow-y-auto no-scrollbar" aria-label="Student navigation">
          {studentNavItems.map((item, i) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `group flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all duration-200 w-full ${
                  sidebarReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
                } ${
                  isActive
                    ? darkMode
                      ? 'bg-white text-[#1E1B4B] shadow-[0_0_20px_rgba(96,140,255,0.45)] ring-1 ring-white/30 sidebar-active-glow'
                      : 'bg-white text-[#1E1B4B] shadow-md shadow-black/10'
                    : darkMode
                      ? 'text-white/60 hover:text-white hover:bg-white/12'
                      : 'text-white/60 hover:text-white hover:bg-white/8'
                }`
              }
              style={{ transitionDelay: sidebarReady ? `${200 + i * 60}ms` : '0ms' }}
              end={item.path === '/student'}
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
              sidebarReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
            } ${darkMode ? 'text-yellow-300 hover:text-yellow-200 hover:bg-white/10' : 'text-white/60 hover:text-white hover:bg-white/8'}`}
            style={{ transitionDelay: sidebarReady ? `${200 + studentNavItems.length * 60}ms` : '0ms' }}
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
            onClick={() => navigate('/student/profile')}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-white/60 hover:text-white hover:bg-white/8 transition-all duration-200 w-full text-left ${
              sidebarReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
            }`}
            style={{ transitionDelay: sidebarReady ? `${200 + (studentNavItems.length + 1) * 60}ms` : '0ms' }}
            aria-label="Settings"
          >
            <span className="shrink-0">
              <NavIcon icon="settings" />
            </span>
            <span className="font-medium text-sm truncate">Settings</span>
          </button>
          <button
            onClick={handleLogout}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-white/60 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 w-full text-left ${
              sidebarReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
            }`}
            style={{ transitionDelay: sidebarReady ? `${200 + (studentNavItems.length + 2) * 60}ms` : '0ms' }}
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
      <div className="flex-1 flex flex-col min-w-0 lg:ml-64">
        {/* Top bar */}
        <header className={`h-[68px] px-4 sm:px-6 shrink-0 transition-colors duration-300 ${
          darkMode ? 'bg-[#1e293b] border-b border-white/5' : 'bg-white border-b border-[#1266f1]/10'
        }`}>
          <div className="flex items-center justify-between h-full">
            <div className="flex items-center gap-3">
              {/* Mobile logo (shown on mobile only) */}
              <div className="lg:hidden flex items-center gap-2">
                <img src="/images/logo-n.png" alt="LagVoice" className="w-8 h-8 rounded-lg object-cover" />
                <span className={`font-bold text-[15px] ${darkMode ? 'text-white' : 'text-[#262626]'}`}>LagVoice</span>
              </div>
              <div className="hidden lg:block">
                <h2 className={`text-[17px] font-bold tracking-tight leading-tight ${darkMode ? 'text-white' : 'text-[#262626]'}`}>
                  {studentNavItems.find((i) => i.path === location.pathname)?.label || 'Home'}
                </h2>
                <p className={`text-[11px] ${darkMode ? 'text-white/40' : 'text-[#9fa6b2]'}`}>
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Search with hotkey */}
              <div className={`hidden lg:flex items-center gap-2 px-4 py-2 rounded-xl border transition-colors w-56 ${
                darkMode ? 'bg-[#0f172a] border-white/10 hover:border-white/20' : 'bg-[#F5F7FA] border-[#1266f1]/8 hover:border-[#1266f1]/20'
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
                <kbd className={`text-[10px] border rounded px-1.5 py-0.5 font-mono shrink-0 ${darkMode ? 'text-white/30 border-white/10 bg-transparent' : 'text-[#9fa6b2] border-[#1266f1]/10 bg-white'}`}>/</kbd>
              </div>

              <div className={`w-px h-6 hidden md:block ${darkMode ? 'bg-white/10' : 'bg-[#1266f1]/8'}`} />

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

              {/* User */}
              <div className={`flex items-center gap-2.5 pl-3 border-l ${darkMode ? 'border-white/10' : 'border-[#1266f1]/8'}`}>
                <div className="w-9 h-9 rounded-xl bg-[#1266f1] flex items-center justify-center text-white font-bold text-[13px]">
                  {user?.name?.charAt(0) || 'S'}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        {/* pb-24 keeps the last card clear of the fixed mobile bottom nav */}
        <main className={`flex-1 overflow-y-auto px-4 pt-4 pb-24 sm:px-6 sm:pt-6 lg:p-8 transition-colors duration-300 ${
          darkMode ? 'bg-[#0f172a]' : 'bg-[#F0F3F8]'
        }`}>
          {children}
        </main>
      </div>

      {/* ═══ Mobile Bottom Nav ═══ */}
      <nav className={`lg:hidden fixed bottom-0 left-0 right-0 z-50 border-t transition-colors duration-300 ${
        darkMode ? 'bg-[#1e293b] border-white/5' : 'bg-white border-[#E4E8EE]'
      }`} aria-label="Student navigation" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <div className="flex items-stretch px-1 py-1.5">
          {studentNavItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex-1 min-w-0 flex flex-col items-center gap-0.5 py-2 rounded-xl transition-all duration-200 ${
                  isActive
                    ? darkMode
                      ? 'text-[#7aa5ff] bg-[#1266f1]/25 ring-1 ring-[#7aa5ff]/30'
                      : 'text-[#1266f1] bg-[#1266f1]/8'
                    : darkMode ? 'text-white/40 hover:text-white/70' : 'text-[#9fa6b2] hover:text-[#4f4f4f]'
                }`
              }
              end={item.path === '/student'}
            >
              <NavIcon icon={item.icon} />
              <span className="text-[9px] font-medium leading-tight truncate max-w-full">{item.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  )
}
