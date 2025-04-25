import { render, screen, fireEvent } from '@testing-library/preact'
import { Footer } from './footer'
import { vi } from 'vitest'

describe('Footer Component', () => {
  const mockProps = {
    libraryMode: false,
    jsonMode: false,
    visualPaletteMode: false,
    setLibraryMode: vi.fn(),
    setJsonMode: vi.fn(),
    setVisualPaletteMode: vi.fn(),
    onSavePalettes: vi.fn(),
  }

  it('should render with correct default values', () => {
    render(<Footer {...mockProps} />)

    expect(screen.getByLabelText('Add to Library')).not.toBeChecked()
    expect(screen.getByLabelText('Add components')).not.toBeChecked()
    expect(screen.getByLabelText('Export as JSON')).not.toBeChecked()
    expect(screen.getByText('Generate')).toBeInTheDocument()
  })

  it('should call setLibraryMode when library mode checkbox changes', () => {
    render(<Footer {...mockProps} />)

    const libraryCheckbox = screen.getByLabelText('Add to Library')
    fireEvent.change(libraryCheckbox, { target: { checked: true } })

    expect(mockProps.setLibraryMode).toHaveBeenCalledWith(true)
  })

  it('should call setVisualPaletteMode when visual palette mode checkbox changes', () => {
    render(<Footer {...mockProps} />)

    const visualPaletteCheckbox = screen.getByLabelText('Add components')
    fireEvent.change(visualPaletteCheckbox, { target: { checked: true } })

    expect(mockProps.setVisualPaletteMode).toHaveBeenCalledWith(true)
  })

  it('should call setJsonMode when JSON mode checkbox changes', () => {
    render(<Footer {...mockProps} />)

    const jsonCheckbox = screen.getByLabelText('Export as JSON')
    fireEvent.change(jsonCheckbox, { target: { checked: true } })

    expect(mockProps.setJsonMode).toHaveBeenCalledWith(true)
  })

  it('should call onSavePalettes when Generate button is clicked', () => {
    render(<Footer {...mockProps} />)

    const generateButton = screen.getByText('Generate')
    fireEvent.click(generateButton)

    expect(mockProps.onSavePalettes).toHaveBeenCalled()
  })

  it('should render with checked values when props are true', () => {
    const checkedProps = {
      ...mockProps,
      libraryMode: true,
      jsonMode: true,
      visualPaletteMode: true,
    }

    render(<Footer {...checkedProps} />)

    expect(screen.getByLabelText('Add to Library')).toBeChecked()
    expect(screen.getByLabelText('Add components')).toBeChecked()
    expect(screen.getByLabelText('Export as JSON')).toBeChecked()
  })
}) 