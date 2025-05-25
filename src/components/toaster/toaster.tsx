import { useEffect } from 'preact/hooks'
import { clsx } from '@utils/clsx'

import { CloseIcon } from '@components/icons/close'
import classes from './toaster.module.css'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export type ToastProps = {
  id: string
  type: ToastType
  message: string
  duration?: number
  stats?: {
    created: number
    skipped: number
    failed: number
  }
}

export type ToasterProps = {
  toasts: ToastProps[]
  onRemove: (id: string) => void
}

export function Toaster({ toasts, onRemove }: ToasterProps) {
  return (
    <div className={classes.toasterContainer} data-testid="toaster-container">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  )
}

export function Toast({ toast, onRemove }: { toast: ToastProps; onRemove: (id: string) => void }) {
  const { id, type, message, duration = 5000, stats } = toast

  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove(id)
    }, duration)

    return () => clearTimeout(timer)
  }, [id, duration, onRemove])

  return (
    <div className={clsx([classes.toast, classes[type]])}>
      <div className={classes.toastContent}>
        <p className="body-l">{message}</p>

        {stats && (
          <div className={classes.toastStats}>
            <p className="body-m">
              created: {String(stats.created ?? 0)} | skipped: {String(stats.skipped ?? 0)} | failed: {String(stats.failed ?? 0)}
            </p>
          </div>
        )}
      </div>

      <button
        className={classes.closeButton}
        onClick={() => onRemove(id)}
        aria-label="Close toast">
        <CloseIcon />
      </button>
    </div>
  )
}
