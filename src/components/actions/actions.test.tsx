import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/preact'
import { Actions } from './actions'

describe('Actions Component', () => {
  const mockProps = {
    steps: 8,
    tints: true,
    shades: true,
    libraryMode: true,
    visualPaletteMode: true,
    jsonMode: true,
    onAddPalette: vi.fn(),
    onSavePalettes: vi.fn(),
    setSteps: vi.fn(),
    setTints: vi.fn(),
    setShades: vi.fn(),
    setLibraryMode: vi.fn(),
    setVisualPaletteMode: vi.fn(),
    setJsonMode: vi.fn()
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render with correct default values', () => {
    render(<Actions {...mockProps} />)

    const stepsInput = screen.getByLabelText(/steps/i)
    expect(stepsInput).toHaveValue(8)

    const tintsCheckbox = screen.getByLabelText(/tints/i)
    const shadesCheckbox = screen.getByLabelText(/shades/i)
    expect(tintsCheckbox).toBeChecked()
    expect(shadesCheckbox).toBeChecked()

    expect(screen.getByText(/add/i)).toBeInTheDocument()
    expect(screen.getByText(/generate/i)).toBeInTheDocument()
  })

  it('should call setSteps when steps input changes', () => {
    render(<Actions {...mockProps} />)

    const stepsInput = screen.getByLabelText(/steps/i)
    fireEvent.change(stepsInput, { target: { value: '4' } })

    expect(mockProps.setSteps).toHaveBeenCalledWith(4)
  })

  it('should call setTints when tints checkbox changes', () => {
    const setTints = vi.fn()

    render(<Actions {...mockProps} setTints={setTints} />)

    const tintsCheckbox = screen.getByLabelText(/tints/i)
    fireEvent.change(tintsCheckbox, { target: { checked: false } })

    expect(setTints).toHaveBeenCalledWith(false)
  })

  it('should call setShades when shades checkbox changes', () => {
    const setShades = vi.fn()

    render(<Actions {...mockProps} setShades={setShades} />)

    const shadesCheckbox = screen.getByLabelText(/shades/i)
    fireEvent.change(shadesCheckbox, { target: { checked: false } })

    expect(setShades).toHaveBeenCalledWith(false)
  })

  it('should call onAddPalette when Add button is clicked', () => {
    render(<Actions {...mockProps} />)

    const addButton = screen.getByText(/add/i)
    fireEvent.click(addButton)

    expect(mockProps.onAddPalette).toHaveBeenCalled()
  })

  it('should call onSavePalettes when Generate button is clicked', () => {
    render(<Actions {...mockProps} />)

    const generateButton = screen.getByText(/generate/i)
    fireEvent.click(generateButton)

    expect(mockProps.onSavePalettes).toHaveBeenCalled()
  })
})
