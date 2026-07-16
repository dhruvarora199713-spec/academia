import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { Inbox } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface EmptyStateProps {
  /** Custom icon (defaults to Inbox) */
  icon?: LucideIcon
  /** Title text */
  title: string
  /** Description text */
  description?: string
  /** Optional action button */
  action?: ReactNode
  /** Size variant */
  size?: 'sm' | 'md' | 'lg'
  /** Additional CSS class */
  className?: string
}

const sizeStyles = {
  sm: { container: 'py-8', icon: 'h-8 w-8', title: 'text-sm', desc: 'text-xs' },
  md: { container: 'py-12', icon: 'h-10 w-10', title: 'text-base', desc: 'text-sm' },
  lg: { container: 'py-16', icon: 'h-12 w-12', title: 'text-lg', desc: 'text-sm' },
}

export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  action,
  size = 'md',
  className,
}: EmptyStateProps) {
  const styles = sizeStyles[size]

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'flex flex-col items-center justify-center text-center',
        styles.container,
        className,
      )}
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-neutral-100">
        <Icon className={cn('text-neutral-400', styles.icon)} />
      </div>
      <h3 className={cn('mt-4 font-medium text-neutral-900', styles.title)}>
        {title}
      </h3>
      {description && (
        <p className={cn('mt-1.5 max-w-sm text-neutral-500', styles.desc)}>
          {description}
        </p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </motion.div>
  )
}
