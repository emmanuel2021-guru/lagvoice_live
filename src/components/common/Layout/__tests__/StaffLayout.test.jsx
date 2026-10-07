import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import StaffLayout, { getStaffNavItems } from '../StaffLayout'
import { useAuth } from '../../../../hooks/useAuth'

// Mock useAuth
vi.mock('../../../../hooks/useAuth', () => ({
  useAuth: vi.fn(),
}))

// Mock NotificationBell
vi.mock('../../NotificationBell/NotificationBell', () => ({
  default: () => <div data-testid="notification-bell">Bell</div>,
}))

describe('StaffLayout Component', () => {
  const mockLogout = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getStaffNavItems routing function', () => {
    it('returns correct base paths and items for staff role', () => {
      const items = getStaffNavItems('staff')
      expect(items).toEqual([
        { label: 'Dashboard', path: '/staff', icon: 'grid' },
        { label: 'Inbox', path: '/staff/inbox', icon: 'message' },
        { label: 'Peer Review', path: '/staff/peer-review', icon: 'people' },
      ])
    })

    it('returns /hod basePath and supervisory routes for hod role', () => {
      const items = getStaffNavItems('hod')
      expect(items).toContainEqual({ label: 'Dashboard', path: '/hod', icon: 'grid' })
      expect(items).toContainEqual({ label: 'Supervisory', path: '/staff/supervisory', icon: 'star' })
      expect(items).toContainEqual({ label: 'Self-Assess', path: '/staff/self-assessment', icon: 'shield' })
    })

    it('returns /dean basePath and supervisory routes for dean role', () => {
      const items = getStaffNavItems('dean')
      expect(items).toContainEqual({ label: 'Dashboard', path: '/dean', icon: 'grid' })
      expect(items).toContainEqual({ label: 'Supervisory', path: '/staff/supervisory', icon: 'star' })
      expect(items).toContainEqual({ label: 'Self-Assess', path: '/staff/self-assessment', icon: 'shield' })
    })
  })

  it('renders standard staff navigation for role "staff"', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: { name: 'Dr. Adewale', role: 'staff' },
      logout: mockLogout,
      isNonStaff: false,
    })

    render(
      <MemoryRouter initialEntries={['/staff']}>
        <StaffLayout>
          <div>Staff Portal Body</div>
        </StaffLayout>
      </MemoryRouter>
    )

    expect(screen.getByText('LagVoice')).toBeInTheDocument()
    expect(screen.getByText('Staff Portal')).toBeInTheDocument()
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Inbox')).toBeInTheDocument()
    expect(screen.getByText('Peer Review')).toBeInTheDocument()

    // Supervisory & Self-assess should NOT be present for standard staff
    expect(screen.queryByText('Supervisory')).not.toBeInTheDocument()
    expect(screen.queryByText('Self-Assess')).not.toBeInTheDocument()
  })

  it('renders HOD navigation including supervisory items for role "hod"', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: { name: 'Prof. Okon', role: 'hod' },
      logout: mockLogout,
      isNonStaff: false,
    })

    render(
      <MemoryRouter initialEntries={['/hod']}>
        <StaffLayout>
          <div>HOD Portal Body</div>
        </StaffLayout>
      </MemoryRouter>
    )

    expect(screen.getByText('HOD Portal')).toBeInTheDocument()
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Inbox')).toBeInTheDocument()
    expect(screen.getByText('Peer Review')).toBeInTheDocument()
    expect(screen.getByText('Supervisory')).toBeInTheDocument()
    expect(screen.getByText('Self-Assess')).toBeInTheDocument()
  })

  it('renders non-staff items when user is non-staff', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: { name: 'Mrs. Balogun', role: 'non-staff' },
      logout: mockLogout,
      isNonStaff: true,
    })

    render(
      <MemoryRouter initialEntries={['/non-staff']}>
        <StaffLayout>
          <div>Non-Staff Body</div>
        </StaffLayout>
      </MemoryRouter>
    )

    expect(screen.getByText('Helpdesk Portal')).toBeInTheDocument()
    expect(screen.getByText('Helpdesk')).toBeInTheDocument()
    expect(screen.getByText('Inbox')).toBeInTheDocument()
    expect(screen.getByText('Polls')).toBeInTheDocument()
    expect(screen.getByText('Memos')).toBeInTheDocument()
    expect(screen.queryByText('Peer Review')).not.toBeInTheDocument()
  })

  it('handles search input and "/" hotkey focusing', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: { name: 'Staff User', role: 'staff' },
      logout: mockLogout,
      isNonStaff: false,
    })

    render(
      <MemoryRouter>
        <StaffLayout>
          <div>Content</div>
        </StaffLayout>
      </MemoryRouter>
    )

    const searchInput = screen.getByPlaceholderText('Search anything...')
    fireEvent.change(searchInput, { target: { value: 'Memo' } })
    expect(searchInput.value).toBe('Memo')

    searchInput.blur()
    fireEvent.keyDown(window, { key: '/' })
    expect(document.activeElement).toBe(searchInput)
  })

  it('triggers logout modal confirmation and cancel', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: { name: 'Staff User', role: 'staff' },
      logout: mockLogout,
      isNonStaff: false,
    })

    render(
      <MemoryRouter>
        <StaffLayout>
          <div>Content</div>
        </StaffLayout>
      </MemoryRouter>
    )

    const logoutBtn = screen.getByRole('button', { name: 'Log out' })
    fireEvent.click(logoutBtn)

    expect(screen.getByRole('dialog', { name: 'Confirm logout' })).toBeInTheDocument()

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
