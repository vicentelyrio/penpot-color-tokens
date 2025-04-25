import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/preact'
import { useGenerateOptions } from './useGenerateOptions'

describe('useGenerateOptions', () => {
  it('should initialize with default values', () => {
    const { result } = renderHook(() => useGenerateOptions())

    expect(result.current.libraryMode).toBe(true)
    expect(result.current.jsonMode).toBe(true)
    expect(result.current.visualPaletteMode).toBe(true)
  })

  it('should toggle libraryMode', () => {
    const { result } = renderHook(() => useGenerateOptions())

    act(() => {
      result.current.setLibraryMode(false)
    })

    expect(result.current.libraryMode).toBe(false)
  })

  it('should toggle jsonMode', () => {
    const { result } = renderHook(() => useGenerateOptions())

    act(() => {
      result.current.setJsonMode(false)
    })

    expect(result.current.jsonMode).toBe(false)
  })

  it('should toggle visualPaletteMode', () => {
    const { result } = renderHook(() => useGenerateOptions())

    act(() => {
      result.current.setVisualPaletteMode(false)
    })

    expect(result.current.visualPaletteMode).toBe(false)
  })
}) 