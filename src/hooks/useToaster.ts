import { useState, useCallback } from 'preact/hooks'
import { ToastProps } from '@components/toaster/toaster'

export const useToaster = () => {
  const [toasts, setToasts] = useState<ToastProps[]>([])

  const findToast = useCallback((id: string) => {
    return toasts.filter((toast) => toast.id !== id)
  }, [])

  const addToast = useCallback((toast: ToastProps) => {
    if (findToast(toast?.id)) removeToast(toast.id)
    setToasts((prev) => [...prev, toast])
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const showToast = useCallback((props: ToastProps) => addToast(props), [addToast])

  return {
    toasts,
    addToast,
    removeToast,
    showToast
  }
}
