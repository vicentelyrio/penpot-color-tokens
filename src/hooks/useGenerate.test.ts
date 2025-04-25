import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/preact'
import { useGenerate } from './useGenerate'
import { MESSAGES } from '@consts/messages'
import { parseColors } from '@utils/parseColors'
import { downloadJsonFile } from '@utils/downloadJson'

vi.mock('@utils/parseColors', () => ({
  parseColors: vi.fn(() => ({ colors: [] }))
}))

vi.mock('@utils/downloadJson', () => ({
  downloadJsonFile: vi.fn()
}))

describe('useGenerate', () => {
  const defaultProps = {
    palettes: [{ name: 'Test', color: '#000000', colors: ['#000000'] }],
    shades: true,
    tints: true,
    jsonMode: true,
    libraryMode: true,
    visualPaletteMode: true
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useGenerate(defaultProps))

    expect(result.current.isGenerating).toBe(false)
    expect(result.current.isExporting).toBe(false)
    expect(result.current.isCreating).toBe(false)
    expect(result.current.generationResult).toBe(null)
    expect(result.current.exportResult).toBe(null)
  })

  it('should handle library generation', () => {
    const { result } = renderHook(() => useGenerate(defaultProps))
    const postMessageSpy = vi.spyOn(parent, 'postMessage')

    act(() => {
      result.current.onGeneratePalettes()
    })

    expect(result.current.isGenerating).toBe(true)
    expect(parseColors).toHaveBeenCalledWith(defaultProps.palettes, true, true)
    expect(postMessageSpy).toHaveBeenCalledWith({
      type: MESSAGES.GENERATE_COLOR_LIBRARY,
      tokens: { colors: [] }
    }, '*')
  })

  it('should handle JSON generation', () => {
    const { result } = renderHook(() => useGenerate(defaultProps))
    const postMessageSpy = vi.spyOn(parent, 'postMessage')

    act(() => {
      result.current.onGeneratePalettes()
    })

    expect(result.current.isExporting).toBe(true)
    expect(parseColors).toHaveBeenCalledWith(defaultProps.palettes, true, true)
    expect(postMessageSpy).toHaveBeenCalledWith({
      type: MESSAGES.GENERATE_JSON,
      tokens: { colors: [] }
    }, '*')
  })

  it('should handle visual palette generation', () => {
    const { result } = renderHook(() => useGenerate(defaultProps))
    const postMessageSpy = vi.spyOn(parent, 'postMessage')

    act(() => {
      result.current.onGeneratePalettes()
    })

    expect(result.current.isCreating).toBe(true)
    expect(parseColors).toHaveBeenCalledWith(defaultProps.palettes, true, true)
    expect(postMessageSpy).toHaveBeenCalledWith({
      type: MESSAGES.GENERATE_COMPONENTS,
      tokens: { colors: [] }
    }, '*')
  })

  it('should handle successful library generation message', () => {
    const { result } = renderHook(() => useGenerate(defaultProps))
    const message = {
      type: MESSAGES.COLOR_LIBRARY_GENERATED,
      success: true,
      message: 'Success',
      results: [
        { success: true, skipped: false },
        { success: true, skipped: true },
        { success: false }
      ]
    }

    act(() => {
      window.dispatchEvent(new MessageEvent('message', { data: message }))
    })

    expect(result.current.isGenerating).toBe(false)
    expect(result.current.generationResult).toEqual({
      success: true,
      message: 'Success',
      stats: { created: 1, skipped: 1, failed: 1 },
      results: message.results
    })
  })

  it('should handle successful JSON generation message', () => {
    const { result } = renderHook(() => useGenerate(defaultProps))
    const jsonData = { colors: [] }
    const message = {
      type: MESSAGES.JSON_GENERATED,
      success: true,
      message: 'Success',
      jsonData
    }

    act(() => {
      window.dispatchEvent(new MessageEvent('message', { data: message }))
    })

    expect(result.current.isExporting).toBe(false)
    expect(result.current.exportResult).toEqual({
      success: true,
      message: 'Success',
      result: jsonData
    })
    expect(downloadJsonFile).toHaveBeenCalledWith(jsonData)
  })

  it('should handle successful components generation message', () => {
    const { result } = renderHook(() => useGenerate(defaultProps))
    const message = {
      type: MESSAGES.COMPONENTS_GENERATED,
      success: true,
      message: 'Success'
    }

    act(() => {
      window.dispatchEvent(new MessageEvent('message', { data: message }))
    })

    expect(result.current.isCreating).toBe(false)
    expect(result.current.generationResult).toEqual({
      success: true,
      message: 'Success',
      stats: undefined,
      results: []
    })
  })

  it('should cleanup message listener on unmount', () => {
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener')
    const { unmount } = renderHook(() => useGenerate(defaultProps))

    unmount()

    expect(removeEventListenerSpy).toHaveBeenCalledWith('message', expect.any(Function))
  })
}) 