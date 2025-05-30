import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/preact'
import { Colors, Color } from './colors'
import '@testing-library/jest-dom'
import { h } from 'preact'

vi.mock('use-eye-dropper', () => ({
  default: () => ({
    open: vi.fn(),
    isSupported: () => false
  })
}))

vi.mock('usehooks-ts', () => ({
  useOnClickOutside: vi.fn()
}))

vi.mock('react-colorful', () => ({
  HexColorPicker: ({ onChange }) => h('div', {
    'data-testid': 'color-picker',
    onClick: () => onChange('#00ff00')
  })
}))

describe('Colors Component', () => {
  const mockPalettes = [
    {
      name: 'red',
      color: '#ff0000',
      colors: ['#ffaaaa', '#ff5555', '#ff0000', '#aa0000', '#550000']
    },
    {
      name: 'blue',
      color: '#0000ff',
      colors: ['#aaaaff', '#5555ff', '#0000ff', '#0000aa', '#000055']
    }
  ]

  const mockSetPalette = vi.fn()
  const mockRemovePalette = vi.fn()
  const mockErrors = {
    name: [],
    color: []
  }

  beforeEach(() => {
    mockSetPalette.mockClear()
    mockRemovePalette.mockClear()
  })

  describe('Colors component', () => {
    it('should render multiple Color components', () => {
      render(
        h(Colors, {
          palettes: mockPalettes,
          onSetPalette: mockSetPalette,
          onRemovePalette: mockRemovePalette,
          errors: mockErrors,
          colorType: "light"
        })
      )

      const colorInputs = screen.getAllByPlaceholderText('Palette color')
      const nameInputs = screen.getAllByPlaceholderText('Palette name')

      expect(colorInputs).toHaveLength(2)
      expect(nameInputs).toHaveLength(2)
      expect(colorInputs[0]).toHaveValue('#ff0000')
      expect(colorInputs[1]).toHaveValue('#0000ff')
      expect(nameInputs[0]).toHaveValue('red')
      expect(nameInputs[1]).toHaveValue('blue')
    })
  })

  describe('Color component', () => {
    it('should call onSetPalette when color input changes', () => {
      render(
        h(Color, {
          palette: mockPalettes[0],
          onSetPalette: mockSetPalette,
          onRemovePalette: mockRemovePalette,
          index: 0,
          errors: mockErrors,
          colorType: "light",
          multipleRows: false
        })
      )

      const colorPicker = screen.getByTestId('color-picker')
      fireEvent.click(colorPicker)

      expect(mockSetPalette).toHaveBeenCalledWith('#00ff00', 'red', 0)
    })

    it('should call onSetPalette when name input changes', () => {
      render(
        h(Color, {
          palette: mockPalettes[0],
          onSetPalette: mockSetPalette,
          onRemovePalette: mockRemovePalette,
          index: 0,
          errors: mockErrors,
          colorType: "light",
          multipleRows: false
        })
      )

      const nameInput = screen.getByPlaceholderText('Palette name')
      fireEvent.change(nameInput, { target: { value: 'crimson' } })

      expect(mockSetPalette).toHaveBeenCalledWith('#ff0000', 'crimson', 0)
    })

    it('should not display a remove button', () => {
      render(
        h(Color, {
          palette: mockPalettes[0],
          onSetPalette: mockSetPalette,
          onRemovePalette: mockRemovePalette,
          index: 0,
          errors: mockErrors,
          colorType: "light",
          multipleRows: false
        })
      )

      const removeButton = screen.queryByRole('button')
      expect(removeButton).not.toBeInTheDocument()
    })

    it('should display a remove button for palettes after the first', () => {
      render(
        h(Color, {
          palette: mockPalettes[1],
          onSetPalette: mockSetPalette,
          onRemovePalette: mockRemovePalette,
          index: 1,
          errors: mockErrors,
          colorType: "light",
          multipleRows: true
        })
      )

      const removeButton = screen.getByRole('button')
      expect(removeButton).toBeInTheDocument()

      fireEvent.click(removeButton)
      expect(mockRemovePalette).toHaveBeenCalledWith(1)
    })
  })
})
