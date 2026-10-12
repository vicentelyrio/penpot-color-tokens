import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/preact'
import { Footer } from './footer'

describe('Footer Component', () => {
  const mockProps = {
    libraryMode: false,
    jsonMode: false,
    visualPaletteMode: false,
    delimiter: '-',
    setLibraryMode: vi.fn(),
    setJsonMode: vi.fn(),
    setVisualPaletteMode: vi.fn(),
    setDelimiter: vi.fn(),
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

  it('should disable the tokens checkbox when the tokens API is unavailable', () => {
    render(<Footer {...mockProps} tokensAvailable={false} />)

    expect(screen.getByLabelText('Add to tokens')).toBeDisabled()
  })

  it('should call setTokensMode when the tokens checkbox changes', () => {
    const setTokensMode = vi.fn()
    render(<Footer {...mockProps} tokensAvailable setTokensMode={setTokensMode} />)

    fireEvent.change(screen.getByLabelText('Add to tokens'), { target: { checked: true } })

    expect(setTokensMode).toHaveBeenCalledWith(true)
  })

  it('should list token sets and reveal the name input for a new set', () => {
    render(
      <Footer
        {...mockProps}
        tokensAvailable
        tokensMode
        tokenSets={[{ id: 'set-1', name: 'color', active: true }]}
        targetSet="__new__"
        newSetName="Brand"
      />
    )

    expect(screen.getByRole('option', { name: 'color' })).toBeInTheDocument()
    expect(screen.getByLabelText('Set name')).toHaveValue('Brand')
  })
})
