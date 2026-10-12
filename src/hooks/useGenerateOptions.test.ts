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

  it('should default tokensMode to false and allow selecting a target set', () => {
    const { result } = renderHook(() => useGenerateOptions())

    expect(result.current.tokensMode).toBe(false)
    expect(result.current.targetSet).toBe('')

    act(() => {
      result.current.setTokensMode(true)
      result.current.setTargetSet('set-1')
    })

    expect(result.current.tokensMode).toBe(true)
    expect(result.current.targetSet).toBe('set-1')
  })
})
