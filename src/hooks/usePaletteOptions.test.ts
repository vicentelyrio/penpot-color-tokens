import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/preact'
import { usePaletteOptions } from './usePaletteOptions'
import { DEFAULT_STEPS } from '@consts/config'

describe('usePaletteOptions', () => {
  it('should initialize with default values', () => {
    const { result } = renderHook(() => usePaletteOptions())

    expect(result.current.steps).toBe(DEFAULT_STEPS)
    expect(result.current.tints).toBe(true)
    expect(result.current.shades).toBe(true)
  })

  it('should update steps value', () => {
    const { result } = renderHook(() => usePaletteOptions())

    act(() => {
      result.current.setSteps(5)
    })

    expect(result.current.steps).toBe(5)
  })

  it('should toggle tints value', () => {
    const { result } = renderHook(() => usePaletteOptions())

    act(() => {
      result.current.setTints(false)
    })

    expect(result.current.tints).toBe(false)
  })

  it('should toggle shades value', () => {
    const { result } = renderHook(() => usePaletteOptions())

    act(() => {
      result.current.setShades(false)
    })

    expect(result.current.shades).toBe(false)
  })
}) 