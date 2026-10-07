import { render, screen, fireEvent } from '@testing-library/react'
import LogoutModal from '../LogoutModal'

describe('LogoutModal Component', () => {
  const onConfirm = vi.fn()
  const onCancel = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders nothing when open is false', () => {
    const { container } = render(
      <LogoutModal open={false} onConfirm={onConfirm} onCancel={onCancel} />
    )
    expect(container.firstChild).toBeNull()
  })

  it('renders modal dialog when open is true', () => {
    render(<LogoutModal open={true} onConfirm={onConfirm} onCancel={onCancel} />)
    expect(screen.getByRole('dialog', { name: 'Confirm logout' })).toBeInTheDocument()
    expect(screen.getByText('Log out?')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Log out' })).toBeInTheDocument()
  })

  it('calls onCancel when Cancel button is clicked', () => {
    render(<LogoutModal open={true} onConfirm={onConfirm} onCancel={onCancel} />)
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))
    expect(onCancel).toHaveBeenCalledTimes(1)
    expect(onConfirm).not.toHaveBeenCalled()
  })

  it('calls onConfirm when Log out button is clicked', () => {
    render(<LogoutModal open={true} onConfirm={onConfirm} onCancel={onCancel} />)
    fireEvent.click(screen.getByRole('button', { name: 'Log out' }))
    expect(onConfirm).toHaveBeenCalledTimes(1)
  })

  it('calls onCancel when backdrop overlay is clicked', () => {
    render(<LogoutModal open={true} onConfirm={onConfirm} onCancel={onCancel} />)
    fireEvent.click(screen.getByTestId('logout-backdrop'))
    expect(onCancel).toHaveBeenCalledTimes(1)
  })

  it('calls onCancel when Escape key is pressed', () => {
    render(<LogoutModal open={true} onConfirm={onConfirm} onCancel={onCancel} />)
    fireEvent.keyDown(window, { key: 'Escape' })
    expect(onCancel).toHaveBeenCalledTimes(1)
  })
})
