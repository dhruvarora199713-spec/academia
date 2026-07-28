import { motion } from 'framer-motion'
import { Activity as ActivityIcon, FileText, Award, Calendar, BookOpen, Settings, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Activity } from '../data'

interface ActivityTimelineProps {
  activities: Activity[]
  delay?: number
}

const typeConfig = {
  academic: { icon: CheckCircle2, class: 'bg-primary-100 text-primary-600' },
  submission: { icon: FileText, class: 'bg-success-100 text-success-600' },
  achievement: { icon: Award, class: 'bg-warning-100 text-warning-600' },
  event: { icon: Calendar, class: 'bg-purple-100 text-purple-600' },
  library: { icon: BookOpen, class: 'bg-cyan-100 text-cyan-600' },
  admin: { icon: Settings, class: 'bg-neutral-100 text-neutral-600' },
}

export function ActivityTimeline({ activities, delay = 0 }: ActivityTimelineProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: delay * 0.08 }}
      className="rounded-xl border border-border bg-white shadow-xs"
    >
      <div className="flex items-center gap-2.5 border-b border-border px-5 py-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-100">
          <ActivityIcon className="h-4 w-4 text-neutral-600" />
        </div>
        <h3 className="text-sm font-semibold text-neutral-900">Activity Timeline</h3>
      </div>

      <div className="px-5 py-4">
        <div className="space-y-0">
          {activities.map((activity, i) => {
            const config = typeConfig[activity.type]
            const Icon = config.icon
            const isLast = i === activities.length - 1

            return (
              <div key={activity.id} className="flex gap-3">
                {/* Timeline */}
                <div className="flex flex-col items-center">
                  <div className={cn('flex h-7 w-7 shrink-0 items-center justify-center rounded-full', config.class)}>
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  {!isLast && <div className="mt-1 w-px flex-1 bg-border min-h-[16px]" />}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 pb-5">
                  <p className="text-sm font-medium text-neutral-800">{activity.action}</p>
                  <p className="mt-0.5 text-xs text-neutral-500 truncate">{activity.description}</p>
                  <p className="mt-1 text-[11px] text-neutral-400">{formatTimeAgo(activity.timestamp)}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </motion.div>
  )
}

function formatTimeAgo(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffHours / 24)

  if (diffHours < 1) return 'Just now'
  if (diffHours < 24) return `${diffHours} hours ago`
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}
