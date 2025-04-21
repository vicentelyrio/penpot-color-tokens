import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/preact'
import { useAppState } from './useAppState'

vi.mock('@utils/buildPalette', () => ({
  buildPalette: vi.fn(({ color, tints, shades }: {
    color: string;
    steps: number;
    tints: boolean;
    shades: boolean;
  }) => {
    if (tints && shades) {
      return ['tint', color, 'shade']
    } else if (tints) {
      return ['tint', color]
    } else if (shades) {
      return [color, 'shade']
    } else {
      return [color]
    }
  })
}))

describe('useAppState hook', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useAppState())

    expect(result.current.steps).toBe(8)
    expect(result.current.tints).toBe(true)
    expect(result.current.shades).toBe(true)
    expect(result.current.palettes).toHaveLength(1)
    expect(result.current.palettes[0].name).toBe('gray')
    expect(result.current.palettes[0].color).toBe('#666666')
  })

  it('should add a new palette', () => {
    const { result } = renderHook(() => useAppState())

    act(() => {
      result.current.onAddPalette()
    })

    expect(result.current.palettes).toHaveLength(2)
    expect(result.current.palettes[1].name).toBe('gray')
    expect(result.current.palettes[1].color).toBe('#666666')
  })

  it('should remove a palette', () => {
    const { result } = renderHook(() => useAppState())

    act(() => {
      result.current.onAddPalette()
    })

    expect(result.current.palettes).toHaveLength(2)

    act(() => {
      result.current.onRemovePalette(1)
    })

    expect(result.current.palettes).toHaveLength(1)
    expect(result.current.palettes[0].name).toBe('gray')
  })

  it('should update a palette color', () => {
    const { result } = renderHook(() => useAppState())

    act(() => {
      result.current.onSetPalette('#ff0000', 'red', 0)
    })

    expect(result.current.palettes[0].color).toBe('#ff0000')
    expect(result.current.palettes[0].name).toBe('red')
  })

  it('should update palettes when changing steps', () => {
    const { result } = renderHook(() => useAppState())

    act(() => {
      result.current.setSteps(4)
    })

    expect(result.current.steps).toBe(4)
  })

  it('should update palettes when toggling tints', () => {
    const { result } = renderHook(() => useAppState())

    act(() => {
      result.current.setTints(false)
    })

    expect(result.current.tints).toBe(false)
  })

  it('should update palettes when toggling shades', () => {
    const { result } = renderHook(() => useAppState())

    act(() => {
      result.current.setShades(false)
    })

    expect(result.current.shades).toBe(false)
  })
})
