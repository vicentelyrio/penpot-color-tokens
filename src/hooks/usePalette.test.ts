import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/preact'
import { usePalette } from './usePalette'
import { DEFAULT_PALETTE_NAME, DEFAULT_PALETTE_COLOR, DEFAULT_STEPS } from '@consts/config'
import { buildPalette } from '@utils/buildPalette'

vi.mock('@utils/buildPalette', () => ({
  buildPalette: vi.fn((props) => [`${props.color}-1`, `${props.color}-2`])
}))

describe('usePalette', () => {
  const defaultProps = {
    steps: DEFAULT_STEPS,
    tints: true,
    shades: true
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should initialize with default palette', () => {
    const { result } = renderHook(() => usePalette(defaultProps))

    expect(result.current.palettes).toHaveLength(1)
    expect(result.current.palettes[0]).toEqual({
      name: DEFAULT_PALETTE_NAME,
      color: DEFAULT_PALETTE_COLOR,
      colors: [`${DEFAULT_PALETTE_COLOR}-1`, `${DEFAULT_PALETTE_COLOR}-2`]
    })
  })

  it('should add a new palette', () => {
    const { result } = renderHook(() => usePalette(defaultProps))

    act(() => {
      result.current.onAddPalette()
    })

    expect(result.current.palettes).toHaveLength(2)
    expect(result.current.palettes[1]).toEqual({
      name: DEFAULT_PALETTE_NAME,
      color: DEFAULT_PALETTE_COLOR,
      colors: [`${DEFAULT_PALETTE_COLOR}-1`, `${DEFAULT_PALETTE_COLOR}-2`]
    })
  })

  it('should remove a palette', () => {
    const { result } = renderHook(() => usePalette(defaultProps))

    // Add a second palette first
    act(() => {
      result.current.onAddPalette()
    })

    expect(result.current.palettes).toHaveLength(2)

    // Then remove the first palette
    act(() => {
      result.current.onRemovePalette(0)
    })

    expect(result.current.palettes).toHaveLength(1)
    expect(result.current.palettes[0]).toEqual({
      name: DEFAULT_PALETTE_NAME,
      color: DEFAULT_PALETTE_COLOR,
      colors: [`${DEFAULT_PALETTE_COLOR}-1`, `${DEFAULT_PALETTE_COLOR}-2`]
    })
  })

  it('should update a palette', () => {
    const { result } = renderHook(() => usePalette(defaultProps))
    const newColor = '#FF0000'
    const newName = 'Red'

    act(() => {
      result.current.onSetPalette(newColor, newName, 0)
    })

    expect(result.current.palettes[0]).toEqual({
      name: newName,
      color: newColor,
      colors: [`${newColor}-1`, `${newColor}-2`]
    })
    expect(buildPalette).toHaveBeenCalledWith({
      color: newColor,
      steps: DEFAULT_STEPS,
      tints: true,
      shades: true
    })
  })

  it('should rebuild palettes when options change', () => {
    const { result, rerender } = renderHook(
      (props) => usePalette(props),
      { initialProps: defaultProps }
    )

    const newProps = {
      steps: 5,
      tints: false,
      shades: true
    }

    rerender(newProps)

    expect(buildPalette).toHaveBeenCalledWith({
      color: DEFAULT_PALETTE_COLOR,
      ...newProps
    })
  })
}) 