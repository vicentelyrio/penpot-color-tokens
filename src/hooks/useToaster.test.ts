import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/preact'
import { useToaster } from './useToaster'
import { ToastType } from '@components/toaster/toaster'

describe('useToaster', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should initialize with empty toasts array', () => {
    const { result } = renderHook(() => useToaster())
    expect(result.current.toasts).toEqual([])
  })

  it('should add a toast with addToast', () => {
    const { result } = renderHook(() => useToaster())
    const toast = { id: 'test-id', message: 'Test toast', type: 'info' as ToastType, duration: 5000 }

    act(() => {
      result.current.addToast(toast)
    })

    expect(result.current.toasts).toHaveLength(1)
    expect(result.current.toasts[0]).toMatchObject(toast)
    expect(result.current.toasts[0].id).toBe('test-id')
  })

  it('should remove a toast with removeToast', () => {
    const { result } = renderHook(() => useToaster())
    const toastId = 'test-id'

    act(() => {
      result.current.addToast({ id: toastId, message: 'Test toast', type: 'info', duration: 5000 })
    })

    expect(result.current.toasts).toHaveLength(1)

    act(() => {
      result.current.removeToast(toastId)
    })

    expect(result.current.toasts).toHaveLength(0)
  })

  it('should show a toast with default values using showToast', () => {
    const { result } = renderHook(() => useToaster())

    act(() => {
      result.current.showToast({
        id: 'test-toast',
        message: 'Test message',
        type: 'info',
        duration: 5000
      })
    })

    expect(result.current.toasts).toHaveLength(1)
    expect(result.current.toasts[0]).toMatchObject({
      id: 'test-toast',
      message: 'Test message',
      type: 'info',
      duration: 5000
    })
  })

  it('should show a toast with custom values using showToast', () => {
    const { result } = renderHook(() => useToaster())
    const stats = { created: 5, skipped: 2, failed: 1 }

    act(() => {
      result.current.showToast({
        id: 'test-toast-2',
        message: 'Test message',
        type: 'success',
        duration: 3000,
        stats
      })
    })

    expect(result.current.toasts).toHaveLength(1)
    expect(result.current.toasts[0]).toMatchObject({
      id: 'test-toast-2',
      message: 'Test message',
      type: 'success',
      duration: 3000,
      stats
    })
  })

  it('should maintain multiple toasts', () => {
    const { result } = renderHook(() => useToaster())

    act(() => {
      result.current.showToast({
        id: 'toast-1',
        message: 'First toast',
        type: 'info',
        duration: 5000
      })
      result.current.showToast({
        id: 'toast-2', 
        message: 'Second toast',
        type: 'error',
        duration: 5000
      })
    })

    expect(result.current.toasts).toHaveLength(2)
    expect(result.current.toasts[0].message).toBe('First toast')
    expect(result.current.toasts[1].message).toBe('Second toast')
  })
}) 