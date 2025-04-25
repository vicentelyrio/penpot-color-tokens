import { render, screen, fireEvent } from '@testing-library/preact'
import { Actions } from './actions'
import { vi } from 'vitest'

describe('Actions Component', () => {
  const mockProps = {
    tints: false,
    shades: false,
    steps: 5,
    setTints: vi.fn(),
    setShades: vi.fn(),
    setSteps: vi.fn(),
    onAddPalette: vi.fn(),
  }

  it('should render with correct default values', () => {
    render(<Actions {...mockProps} />)

    expect(screen.getByLabelText('Tints')).not.toBeChecked()
    expect(screen.getByLabelText('Shades')).not.toBeChecked()
    expect(screen.getByLabelText('Steps')).toHaveValue(5)
    expect(screen.getByText(/add/i)).toBeInTheDocument()
  })

  it('should call setSteps when steps input changes', () => {
    render(<Actions {...mockProps} />)

    const stepsInput = screen.getByLabelText('Steps')
    fireEvent.change(stepsInput, { target: { value: '10' } })

    expect(mockProps.setSteps).toHaveBeenCalledWith(10)
  })

  it('should call setTints when tints checkbox changes', () => {
    render(<Actions {...mockProps} />)

    const tintsCheckbox = screen.getByLabelText('Tints')
    fireEvent.change(tintsCheckbox, { target: { checked: true } })

    expect(mockProps.setTints).toHaveBeenCalledWith(true)
  })

  it('should call setShades when shades checkbox changes', () => {
    render(<Actions {...mockProps} />)

    const shadesCheckbox = screen.getByLabelText('Shades')
    fireEvent.change(shadesCheckbox, { target: { checked: true } })

    expect(mockProps.setShades).toHaveBeenCalledWith(true)
  })

  it('should call onAddPalette when Add button is clicked', () => {
    render(<Actions {...mockProps} />)

    const addButton = screen.getByText(/add/i)
    fireEvent.click(addButton)

    expect(mockProps.onAddPalette).toHaveBeenCalled()
  })
})
