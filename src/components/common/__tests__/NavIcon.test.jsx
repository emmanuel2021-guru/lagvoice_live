import { render, screen } from '@testing-library/react'
import NavIcon from '../NavIcon'

describe('NavIcon Component', () => {
  it('returns null when no icon is provided', () => {
    const { container } = render(<NavIcon icon={null} />)
    expect(container.firstChild).toBeNull()
  })

  it('renders standard named icons correctly', () => {
    const iconNames = [
      'grid',
      'home',
      'inbox',
      'message',
      'star',
      'shield',
      'chart',
      'file',
      'people',
      'profile',
      'feedback',
      'tickets',
      'settings',
      'logout',
      'sun',
      'moon',
    ]

    iconNames.forEach((name) => {
      const { unmount } = render(<NavIcon icon={name} />)
      expect(screen.getByTestId(`nav-icon-${name}`)).toBeInTheDocument()
      unmount()
    })
  })

  it('applies custom className to SVG elements', () => {
    render(<NavIcon icon="home" className="custom-w-class" />)
    const svg = screen.getByTestId('nav-icon-home')
    expect(svg).toHaveClass('custom-w-class')
  })

  it('renders custom React element directly when passed as icon', () => {
    render(<NavIcon icon={<span data-testid="custom-icon">Icon</span>} />)
    expect(screen.getByTestId('custom-icon')).toBeInTheDocument()
  })
})
