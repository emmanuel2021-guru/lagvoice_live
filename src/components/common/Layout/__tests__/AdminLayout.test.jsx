import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import AdminLayout from '../AdminLayout'
import { useAuth } from '../../../../hooks/useAuth'

// Mock useAuth
vi.mock('../../../../hooks/useAuth', () => ({
  useAuth: vi.fn(),
}))

// Mock NotificationBell
vi.mock('../../NotificationBell/NotificationBell', () => ({
  default: () => <div data-testid="notification-bell">Bell</div>,
}))

describe('AdminLayout Component', () => {
  const mockLogout = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders all admin navigation items when user is admin', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: { name: 'Admin User', role: 'admin' },
      logout: mockLogout,
      isAdmin: true,
      isFaculty: false,
    })

    render(
      <MemoryRouter initialEntries={['/admin']}>
        <AdminLayout>
          <div>Admin Content</div>
        </AdminLayout>
      </MemoryRouter>
    )

    // Verify Admin Portal branding and admin links
    expect(screen.getByText('LagVoice')).toBeInTheDocument()
    expect(screen.getByText('Admin Console')).toBeInTheDocument()

    // Nav items
    expect(screen.getByText('Overview')).toBeInTheDocument()
    expect(screen.getByText('Complaints')).toBeInTheDocument()
    expect(screen.getByText('Evaluations')).toBeInTheDocument()
    expect(screen.getByText('QA Audits')).toBeInTheDocument()
    expect(screen.getByText('Charters')).toBeInTheDocument()
    expect(screen.getByText('Polls')).toBeInTheDocument()
    expect(screen.getByText('Reports')).toBeInTheDocument()
    expect(screen.getByText('Inbox')).toBeInTheDocument()
    expect(screen.getByText('Users')).toBeInTheDocument()
    expect(screen.getByText('Admin Content')).toBeInTheDocument()
  })

  it('renders faculty navigation items when user is faculty', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: { name: 'Faculty Member', role: 'faculty' },
      logout: mockLogout,
      isAdmin: false,
      isFaculty: true,
    })

    render(
      <MemoryRouter initialEntries={['/faculty']}>
        <AdminLayout>
          <div>Faculty Content</div>
        </AdminLayout>
      </MemoryRouter>
    )

    expect(screen.getByText('Faculty Portal')).toBeInTheDocument()
    expect(screen.getByText('Overview')).toBeInTheDocument()
    expect(screen.getByText('Peer Reviews')).toBeInTheDocument()
    expect(screen.getByText('Results')).toBeInTheDocument()
    expect(screen.getByText('Metrics')).toBeInTheDocument()

    // Should not render admin-only links
    expect(screen.queryByText('Complaints')).not.toBeInTheDocument()
    expect(screen.queryByText('QA Audits')).not.toBeInTheDocument()
    expect(screen.queryByText('Charters')).not.toBeInTheDocument()
  })

  it('binds search input and focuses on "/" hotkey press', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: { name: 'Admin User', role: 'admin' },
      logout: mockLogout,
      isAdmin: true,
      isFaculty: false,
    })

    render(
      <MemoryRouter>
        <AdminLayout>
          <div>Page</div>
        </AdminLayout>
      </MemoryRouter>
    )

    const searchInput = screen.getByPlaceholderText('Search anything...')
    expect(searchInput).toBeInTheDocument()

    // Type query
    fireEvent.change(searchInput, { target: { value: 'Quality' } })
    expect(searchInput.value).toBe('Quality')

    // Press '/' key when not in an input
    searchInput.blur()
    expect(document.activeElement).not.toBe(searchInput)

    fireEvent.keyDown(window, { key: '/' })
    expect(document.activeElement).toBe(searchInput)
  })

  it('opens logout confirmation modal and handles cancel and confirm actions', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: { name: 'Admin User', role: 'admin' },
      logout: mockLogout,
      isAdmin: true,
      isFaculty: false,
    })

    render(
      <MemoryRouter>
        <AdminLayout>
          <div>Page</div>
        </AdminLayout>
      </MemoryRouter>
    )

    // Modal is initially not displayed
    expect(screen.queryByRole('dialog', { name: 'Confirm logout' })).not.toBeInTheDocument()

    // Click logout button in sidebar
    const logoutBtn = screen.getByRole('button', { name: 'Log out' })
    fireEvent.click(logoutBtn)

    // Modal is now open
    expect(screen.getByRole('dialog', { name: 'Confirm logout' })).toBeInTheDocument()
    expect(screen.getByText('Log out?')).toBeInTheDocument()

    // Click Cancel
    const cancelBtn = screen.getByRole('button', { name: 'Cancel' })
    fireEvent.click(cancelBtn)
    expect(screen.queryByRole('dialog', { name: 'Confirm logout' })).not.toBeInTheDocument()
    expect(mockLogout).not.toHaveBeenCalled()

    // Open again and confirm logout
    fireEvent.click(logoutBtn)
    const confirmBtn = screen.getAllByRole('button', { name: 'Log out' })[1] // button inside modal
    fireEvent.click(confirmBtn)
    expect(mockLogout).toHaveBeenCalledTimes(1)
  })
})
