import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/preact'
import { Colors, Color } from './colors'

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

  beforeEach(() => {
    mockSetPalette.mockClear()
    mockRemovePalette.mockClear()
  })

  describe('Colors component', () => {
    it('should render multiple Color components', () => {
      render(
        <Colors
          palettes={mockPalettes}
          onSetPalette={mockSetPalette}
          onRemovePalette={mockRemovePalette}
        />
      )

      expect(screen.getByText('#ff0000')).toBeInTheDocument()
      expect(screen.getByText('#0000ff')).toBeInTheDocument()

      const inputs = screen.getAllByRole('textbox')
      expect(inputs.length).toBe(2)
      expect(inputs[0]).toHaveValue('red')
      expect(inputs[1]).toHaveValue('blue')
    })
  })

  describe('Color component', () => {
    it('should call onSetPalette when color input changes', () => {
      render(
        <Color
          palette={mockPalettes[0]}
          onSetPalette={mockSetPalette}
          onRemovePalette={mockRemovePalette}
          index={0}
        />
      )

      const colorInput = screen.getByDisplayValue('#ff0000')
      fireEvent.change(colorInput, { target: { value: '#00ff00' } })

      expect(mockSetPalette).toHaveBeenCalledWith('#00ff00', 'red', 0)
    })

    it('should call onSetPalette when name input changes', () => {
      render(
        <Color
          palette={mockPalettes[0]}
          onSetPalette={mockSetPalette}
          onRemovePalette={mockRemovePalette}
          index={0}
        />
      )

      const nameInput = screen.getByDisplayValue('red')
      fireEvent.change(nameInput, { target: { value: 'crimson' } })

      expect(mockSetPalette).toHaveBeenCalledWith('#ff0000', 'crimson', 0)
    })

    it('should not display a remove button', () => {
      render(
        <Color
          palette={mockPalettes[0]}
          onSetPalette={mockSetPalette}
          onRemovePalette={mockRemovePalette}
          index={0}
          multipleRows={false}
        />
      )

      const removeButton = screen.queryByRole('button')
      expect(removeButton).not.toBeInTheDocument()
    })

    it('should display a remove button for palettes after the first', () => {
      render(
        <Color
          palette={mockPalettes[1]}
          onSetPalette={mockSetPalette}
          onRemovePalette={mockRemovePalette}
          index={1}
          multipleRows
        />
      )

      const removeButton = screen.getByRole('button')
      expect(removeButton).toBeInTheDocument()

      fireEvent.click(removeButton)
      expect(mockRemovePalette).toHaveBeenCalledWith(1)
    })
  })
})
