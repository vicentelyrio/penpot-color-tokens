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
    delimiter: '-',
    jsonMode: true,
    libraryMode: true,
    visualPaletteMode: true
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useGenerate(defaultProps))

    expect(result.current.errors).toEqual({})
    expect(result.current.status).toEqual([])
    expect(typeof result.current.onGeneratePalettes).toBe('function')
  })

  it('should handle library generation', () => {
    const { result } = renderHook(() => useGenerate(defaultProps))
    const postMessageSpy = vi.spyOn(parent, 'postMessage')

    act(() => {
      result.current.onGeneratePalettes()
    })

    expect(result.current.status).toHaveLength(3)
    expect(result.current.status.find(s => s.id === MESSAGES.GENERATE_COLOR_LIBRARY)).toBeDefined()
    expect(parseColors).toHaveBeenCalledWith(defaultProps.palettes, true, true, '-')
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

    expect(result.current.status).toHaveLength(3)
    expect(result.current.status.find(s => s.id === MESSAGES.GENERATE_JSON)).toBeDefined()
    expect(parseColors).toHaveBeenCalledWith(defaultProps.palettes, true, true, '-')
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

    expect(result.current.status).toHaveLength(3)
    expect(result.current.status.find(s => s.id === MESSAGES.GENERATE_COMPONENTS)).toBeDefined()
    expect(parseColors).toHaveBeenCalledWith(defaultProps.palettes, true, true, '-')
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

    const libraryStatus = result.current.status.find(s => s.id === MESSAGES.GENERATE_COLOR_LIBRARY)
    expect(libraryStatus).toBeDefined()
    expect(libraryStatus?.message).toBe('Success')
    expect(libraryStatus?.type).toBe('error')
    expect(libraryStatus?.stats).toEqual({ created: 1, skipped: 1, failed: 1 })
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

    const jsonStatus = result.current.status.find(s => s.id === MESSAGES.GENERATE_JSON)
    expect(jsonStatus).toBeDefined()
    expect(jsonStatus?.message).toBe('Success')
    expect(jsonStatus?.type).toBe('success')
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

    const componentsStatus = result.current.status.find(s => s.id === MESSAGES.GENERATE_COMPONENTS)
    expect(componentsStatus).toBeDefined()
    expect(componentsStatus?.message).toBe('Success')
    expect(componentsStatus?.type).toBe('success')
  })

  it('should cleanup message listener on unmount', () => {
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener')
    const { unmount } = renderHook(() => useGenerate(defaultProps))

    unmount()

    expect(removeEventListenerSpy).toHaveBeenCalledWith('message', expect.any(Function))
  })

  it('should request token sets on mount and store the reply', () => {
    const postMessageSpy = vi.spyOn(parent, 'postMessage')
    const { result } = renderHook(() => useGenerate(defaultProps))

    expect(postMessageSpy).toHaveBeenCalledWith({ type: MESSAGES.GET_TOKEN_SETS }, '*')

    act(() => {
      window.dispatchEvent(new MessageEvent('message', {
        data: {
          type: MESSAGES.TOKEN_SETS,
          available: true,
          sets: [{ id: 'set-1', name: 'color', active: true }]
        }
      }))
    })

    expect(result.current.tokenSets.available).toBe(true)
    expect(result.current.tokenSets.sets).toHaveLength(1)
  })

  it('should post GENERATE_TOKENS with the selected set', () => {
    const postMessageSpy = vi.spyOn(parent, 'postMessage')
    const { result } = renderHook(() => useGenerate({
      ...defaultProps,
      libraryMode: false,
      jsonMode: false,
      visualPaletteMode: false,
      tokensMode: true,
      targetSet: 'set-1'
    }))

    act(() => {
      result.current.onGeneratePalettes()
    })

    expect(postMessageSpy).toHaveBeenCalledWith({
      type: MESSAGES.GENERATE_TOKENS,
      tokens: { colors: [] },
      setId: 'set-1',
      newSetName: undefined
    }, '*')
  })

  it('should post a null setId and the name for a new set', () => {
    const postMessageSpy = vi.spyOn(parent, 'postMessage')
    const { result } = renderHook(() => useGenerate({
      ...defaultProps,
      libraryMode: false,
      jsonMode: false,
      visualPaletteMode: false,
      tokensMode: true,
      targetSet: '__new__',
      newSetName: 'Brand'
    }))

    act(() => {
      result.current.onGeneratePalettes()
    })

    expect(postMessageSpy).toHaveBeenCalledWith(expect.objectContaining({
      type: MESSAGES.GENERATE_TOKENS,
      setId: null,
      newSetName: 'Brand'
    }), '*')
  })

  it('should report created/updated/skipped/failed counts for tokens', () => {
    const { result } = renderHook(() => useGenerate(defaultProps))

    act(() => {
      window.dispatchEvent(new MessageEvent('message', {
        data: {
          type: MESSAGES.TOKENS_GENERATED,
          success: true,
          message: 'Processed 4 tokens',
          results: [
            { name: 'a', success: true },
            { name: 'b', success: true, updated: true },
            { name: 'c', success: true, skipped: true },
            { name: 'd', success: false }
          ]
        }
      }))
    })

    const toast = result.current.status.find(s => s.id === MESSAGES.GENERATE_TOKENS)
    expect(toast?.stats).toEqual({ created: 1, updated: 1, skipped: 1, failed: 1 })
    expect(toast?.type).toBe('error')
  })
})
