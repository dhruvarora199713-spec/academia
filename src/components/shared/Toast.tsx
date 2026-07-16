import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react'
import { cn } from '@/lib/utils'

// ─── Types ────────────────────────────────────────────────────────────────────

type ToastVariant = 'success' | 'error' | 'warning' | 'info'

interface Toast {
  id: string
  title: string
  description?: string
  variant: ToastVariant
  duration?: number
}

interface ToastContextValue {
  toast: (options: Omit<Toast, 'id'>) => void
  dismiss: (id: string) => void
}

// ─── Context ──────────────────────────────────────────────────────────────────

const ToastContext = createContext<ToastContextValue | null>(null)

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext)
  if (!context) throw new Error('useToast must be used within ToastProvider')
  return context
}

// ─── Provider ─────────────────────────────────────────────────────────────────

let toastId = 0

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const toast = useCallback(
    (options: Omit<Toast, 'id'>) => {
      const id = String(++toastId)
      const newToast: Toast = { ...options, id }
      setToasts((prev) => [...prev, newToast])

      // Auto-dismiss
      const duration = options.duration ?? 4000
      if (duration > 0) {
        setTimeout(() => dismiss(id), duration)
      }
    },
    [dismiss],
  )

  return (
    <ToastContext.Provider value={{ toast, dismiss }}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  )
}

// ─── Toast Container ──────────────────────────────────────────────────────────

function ToastContainer({
  toasts,
  onDismiss,
}: {
  toasts: Toast[]
  onDismiss: (id: string) => void
}) {
  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 w-full max-w-sm pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
        ))}
      </AnimatePresence>
    </div>
  )
}

// ─── Toast Item ───────────────────────────────────────────────────────────────

const variantConfig = {
  success: {
    icon: CheckCircle2,
    iconColor: 'text-success-600',
    border: 'border-success-200',
    bg: 'bg-white',
  },
  error: {
    icon: AlertCircle,
    iconColor: 'text-error-600',
    border: 'border-error-200',
    bg: 'bg-white',
  },
  warning: {
    icon: AlertTriangle,
    iconColor: 'text-warning-600',
    border: 'border-warning-200',
    bg: 'bg-white',
  },
  info: {
    icon: Info,
    iconColor: 'text-primary-600',
    border: 'border-primary-200',
    bg: 'bg-white',
  },
}

function ToastItem({
  toast,
  onDismiss,
}: {
  toast: Toast
  onDismiss: (id: string) => void
}) {
  const config = variantConfig[toast.variant]
  const Icon = config.icon

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className={cn(
        'pointer-events-auto flex items-start gap-3 rounded-xl border px-4 py-3.5 shadow-lg',
        config.border,
        config.bg,
      )}
    >
      <Icon className={cn('h-5 w-5 mt-0.5 shrink-0', config.iconColor)} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-neutral-900">{toast.title}</p>
        {toast.description && (
          <p className="mt-0.5 text-xs text-neutral-500">{toast.description}</p>
        )}
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        className="shrink-0 rounded-md p-0.5 text-neutral-400 transition-colors hover:text-neutral-600"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </motion.div>
  )
}
