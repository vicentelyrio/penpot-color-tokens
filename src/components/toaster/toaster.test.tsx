import { render, screen, fireEvent } from '@testing-library/preact'
import { Toast, ToastProps, ToastType, Toaster } from './toaster'
import { vi } from 'vitest'
import classes from './toaster.module.css'

describe('Toaster Component', () => {
  const mockOnRemove = vi.fn()
  const mockToasts: ToastProps[] = [
    {
      id: '1',
      type: 'success',
      message: 'Success message',
    },
    {
      id: '2',
      type: 'error',
      message: 'Error message',
    },
  ]

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render multiple toasts', () => {
    render(<Toaster toasts={mockToasts} onRemove={mockOnRemove} />)

    expect(screen.getByText('Success message')).toBeInTheDocument()
    expect(screen.getByText('Error message')).toBeInTheDocument()
  })

  it('should render toasts in correct order', () => {
    render(<Toaster toasts={mockToasts} onRemove={mockOnRemove} />)

    const toasts = screen.getAllByRole('button', { name: 'Close toast' })
    expect(toasts).toHaveLength(2)
  })

  it('should render empty when no toasts', () => {
    render(<Toaster toasts={[]} onRemove={mockOnRemove} />)

    const container = screen.getByTestId('toaster-container')
    expect(container.children).toHaveLength(0)
  })

  it('should pass onRemove to each Toast', () => {
    render(<Toaster toasts={mockToasts} onRemove={mockOnRemove} />)

    const closeButtons = screen.getAllByRole('button', { name: 'Close toast' })
    fireEvent.click(closeButtons[0])

    expect(mockOnRemove).toHaveBeenCalledWith('1')
  })
})

describe('Toast Component', () => {
  const mockOnRemove = vi.fn()
  const defaultToast: ToastProps = {
    id: '1',
    type: 'success' as ToastType,
    message: 'Test message',
  }

  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.clearAllTimers()
    vi.useRealTimers()
  })

  it('should render with correct message and type', () => {
    render(<Toast toast={defaultToast} onRemove={mockOnRemove} />)
    expect(screen.getByText('Test message')).toBeInTheDocument()
    const toastElement = screen.getByText('Test message').parentElement?.parentElement
    expect(toastElement).toHaveClass(classes.toast, classes.success)
  })

  it('should call onRemove when close button is clicked', () => {
    render(<Toast toast={defaultToast} onRemove={mockOnRemove} />)
    const closeButton = screen.getByLabelText('Close toast')
    fireEvent.click(closeButton)
    expect(mockOnRemove).toHaveBeenCalledWith('1')
  })

  it('should auto-remove after duration', () => {
    const duration = 3000
    const toastWithDuration: ToastProps = {
      ...defaultToast,
      duration
    }
    render(<Toast toast={toastWithDuration} onRemove={mockOnRemove} />)

    expect(mockOnRemove).not.toHaveBeenCalled()
    vi.advanceTimersByTime(duration)
    expect(mockOnRemove).toHaveBeenCalledWith('1')
  })

  it('should render stats when provided', () => {
    const toastWithStats: ToastProps = {
      ...defaultToast,
      stats: {
        created: 5,
        skipped: 2,
        failed: 1
      }
    }
    render(<Toast toast={toastWithStats} onRemove={mockOnRemove} />)
    
    const statsText = screen.getByText(/created:/)
    expect(statsText).toBeInTheDocument()
    expect(statsText).toHaveTextContent('created: 5 | skipped: 2 | failed: 1')
  })

  it('should handle zero values in stats', () => {
    const toastWithZeroStats: ToastProps = {
      ...defaultToast,
      stats: {
        created: 0,
        skipped: 0,
        failed: 0
      }
    }
    render(<Toast toast={toastWithZeroStats} onRemove={mockOnRemove} />)
    
    const statsText = screen.getByText(/created:/)
    expect(statsText).toBeInTheDocument()
    expect(statsText.parentElement).toHaveTextContent('created: 0 | skipped: 0 | failed: 0')
  })

  it('should use default duration when not provided', () => {
    render(<Toast toast={defaultToast} onRemove={mockOnRemove} />)

    expect(mockOnRemove).not.toHaveBeenCalled()
    vi.advanceTimersByTime(5000) // Default duration
    expect(mockOnRemove).toHaveBeenCalledWith('1')
  })

  it('should cleanup timer on unmount', () => {
    const { unmount } = render(<Toast toast={defaultToast} onRemove={mockOnRemove} />)
    
    unmount()
    vi.advanceTimersByTime(5000)
    expect(mockOnRemove).not.toHaveBeenCalled()
  })
}) 