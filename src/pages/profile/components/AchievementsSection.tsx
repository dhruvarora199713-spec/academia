import { motion } from 'framer-motion'
import { Trophy } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Achievement } from '../data'

interface AchievementsSectionProps {
  achievements: Achievement[]
  delay?: number
}

const levelBadge = {
  university: { label: 'University', class: 'bg-neutral-100 text-neutral-600' },
  state: { label: 'State', class: 'bg-primary-50 text-primary-700' },
  national: { label: 'National', class: 'bg-success-50 text-success-700' },
  international: { label: 'International', class: 'bg-warning-50 text-warning-700' },
}

const typeEmoji: Record<string, string> = {
  academic: '📚',
  sports: '🏏',
  cultural: '🎭',
  technical: '💻',
  leadership: '🎯',
}

export function AchievementsSection({ achievements, delay = 0 }: AchievementsSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: delay * 0.08 }}
      className="rounded-xl border border-border bg-white shadow-xs"
    >
      <div className="flex items-center gap-2.5 border-b border-border px-5 py-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-100">
          <Trophy className="h-4 w-4 text-neutral-600" />
        </div>
        <h3 className="text-sm font-semibold text-neutral-900">Achievements</h3>
        <span className="ml-auto rounded-full bg-neutral-100 px-2 py-0.5 text-[11px] font-medium text-neutral-500">
          {achievements.length}
        </span>
      </div>

      <div className="divide-y divide-border">
        {achievements.map((item) => {
          const badge = levelBadge[item.level]
          return (
            <div key={item.id} className="flex items-start gap-4 px-5 py-4 transition-colors hover:bg-neutral-25">
              <span className="mt-0.5 text-lg">{typeEmoji[item.type] || '🏆'}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium text-neutral-900">{item.title}</p>
                  <span className={cn('shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium', badge.class)}>
                    {badge.label}
                  </span>
                </div>
                <p className="mt-1 text-xs text-neutral-500 line-clamp-2">{item.description}</p>
                <p className="mt-1.5 text-[11px] text-neutral-400">
                  {new Date(item.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}
