import { useState, useCallback } from 'preact/hooks'
import { ToastProps, ToastType } from '@components/toaster/toaster'

export const useToaster = () => {
  const [toasts, setToasts] = useState<ToastProps[]>([])

  const addToast = useCallback((toast: Omit<ToastProps, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.floor(Math.random() * 1000)}`
    const newToast = { ...toast, id }
    setToasts((prev) => [...prev, newToast])
    return id
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const showToast = useCallback((
    message: string,
    type: ToastType = 'info',
    duration = 5000,
    stats?: ToastProps['stats']
  ) => addToast({ message, type, duration, stats }), [addToast])

  return {
    toasts,
    addToast,
    removeToast,
    showToast
  }
}
