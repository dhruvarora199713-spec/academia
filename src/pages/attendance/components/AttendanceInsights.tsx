import { motion } from 'framer-motion'
import { CheckCircle2, AlertTriangle, XCircle, Info, Lightbulb } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { AttendanceInsight } from '../data'

interface AttendanceInsightsProps {
  insights: AttendanceInsight[]
}

const typeConfig = {
  success: { icon: CheckCircle2, border: 'border-l-success-500', iconClass: 'text-success-600 bg-success-50' },
  warning: { icon: AlertTriangle, border: 'border-l-warning-500', iconClass: 'text-warning-600 bg-warning-50' },
  danger: { icon: XCircle, border: 'border-l-error-500', iconClass: 'text-error-600 bg-error-50' },
  info: { icon: Info, border: 'border-l-primary-500', iconClass: 'text-primary-600 bg-primary-50' },
}

export function AttendanceInsights({ insights }: AttendanceInsightsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      className="rounded-xl border border-border bg-white shadow-xs"
    >
      <div className="flex items-center gap-2.5 border-b border-border px-5 py-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-100">
          <Lightbulb className="h-4 w-4 text-neutral-600" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-neutral-900">Smart Insights</h3>
          <p className="text-xs text-neutral-400">Auto-generated based on your attendance data</p>
        </div>
      </div>

      <div className="divide-y divide-border">
        {insights.map((insight, i) => {
          const config = typeConfig[insight.type]
          const Icon = config.icon

          return (
            <motion.div
              key={insight.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, delay: i * 0.05 }}
              className={cn(
                'flex items-start gap-3 px-5 py-4 border-l-[3px] transition-colors hover:bg-neutral-25',
                config.border,
              )}
            >
              <div className={cn('flex h-7 w-7 shrink-0 items-center justify-center rounded-full mt-0.5', config.iconClass)}>
                <Icon className="h-3.5 w-3.5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-neutral-800">{insight.title}</p>
                <p className="mt-0.5 text-xs text-neutral-500">{insight.description}</p>
              </div>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}
