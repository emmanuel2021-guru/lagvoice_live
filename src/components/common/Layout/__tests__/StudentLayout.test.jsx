import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import StudentLayout, { studentNavItems } from '../StudentLayout'
import { useAuth } from '../../../../hooks/useAuth'

// Mock useAuth
vi.mock('../../../../hooks/useAuth', () => ({
  useAuth: vi.fn(),
}))

// Mock NotificationBell
vi.mock('../../NotificationBell/NotificationBell', () => ({
  default: () => <div data-testid="notification-bell">Bell</div>,
}))

describe('StudentLayout Component', () => {
  const mockLogout = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders student navigation items on desktop and mobile', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: { name: 'Student John', role: 'student' },
      logout: mockLogout,
    })

    render(
      <MemoryRouter initialEntries={['/student']}>
        <StudentLayout>
          <div>Student Content Body</div>
        </StudentLayout>
      </MemoryRouter>
    )

    // Check brand headers
    expect(screen.getAllByText('LagVoice').length).toBeGreaterThan(0)
    expect(screen.getByText('Student Portal')).toBeInTheDocument()

    // Nav items exist (present in desktop sidebar and mobile bottom nav)
    studentNavItems.forEach((item) => {
      expect(screen.getAllByText(item.label).length).toBeGreaterThan(0)
    })

    expect(screen.getByText('Student Content Body')).toBeInTheDocument()
  })

  it('handles search input and "/" hotkey focusing', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: { name: 'Student John', role: 'student' },
      logout: mockLogout,
    })

    render(
      <MemoryRouter>
        <StudentLayout>
          <div>Content</div>
        </StudentLayout>
      </MemoryRouter>
    )

    const searchInput = screen.getByPlaceholderText('Search anything...')
    fireEvent.change(searchInput, { target: { value: 'Ticket' } })
    expect(searchInput.value).toBe('Ticket')

    searchInput.blur()
    fireEvent.keyDown(window, { key: '/' })
    expect(document.activeElement).toBe(searchInput)
  })

  it('triggers logout modal confirmation and cancel', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: { name: 'Student John', role: 'student' },
      logout: mockLogout,
    })

    render(
      <MemoryRouter>
        <StudentLayout>
          <div>Content</div>
        </StudentLayout>
      </MemoryRouter>
    )

    const logoutBtn = screen.getByRole('button', { name: 'Log out' })
    fireEvent.click(logoutBtn)

    expect(screen.getByRole('dialog', { name: 'Confirm logout' })).toBeInTheDocument()
    expect(screen.getByText('Log out?')).toBeInTheDocument()

    // Cancel closes dialog
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))
    expect(screen.queryByRole('dialog', { name: 'Confirm logout' })).not.toBeInTheDocument()
    expect(mockLogout).not.toHaveBeenCalled()

    // Confirm executes logout
    fireEvent.click(logoutBtn)
    const modalLogoutBtn = screen.getAllByRole('button', { name: 'Log out' })[1]
    fireEvent.click(modalLogoutBtn)
    expect(mockLogout).toHaveBeenCalledTimes(1)
  })
})
