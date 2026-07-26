import { motion } from 'framer-motion'
import { TrendingUp, CalendarCheck, BookOpen, Medal, BarChart3, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { AcademicStats } from '../data'

interface AcademicStatsSectionProps {
  stats: AcademicStats
  delay?: number
}

export function AcademicStatsSection({ stats, delay = 0 }: AcademicStatsSectionProps) {
  const items = [
    { label: 'CGPA', value: stats.cgpa.toFixed(2), icon: TrendingUp, color: 'text-primary-600 bg-primary-50' },
    { label: 'Current SGPA', value: stats.sgpa.toFixed(2), icon: BarChart3, color: 'text-success-600 bg-success-50' },
    { label: 'Attendance', value: `${stats.attendance}%`, icon: CalendarCheck, color: 'text-warning-600 bg-warning-50' },
    { label: 'Credits', value: `${stats.creditsCompleted}/${stats.creditsTotal}`, icon: BookOpen, color: 'text-primary-600 bg-primary-50' },
    { label: 'Semester Rank', value: `#${stats.semesterRank}`, subtitle: `of ${stats.batchStrength}`, icon: Medal, color: 'text-warning-600 bg-warning-50' },
    { label: 'Backlogs', value: String(stats.backlogs), icon: AlertTriangle, color: stats.backlogs > 0 ? 'text-error-600 bg-error-50' : 'text-success-600 bg-success-50' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: delay * 0.08 }}
      className="rounded-xl border border-border bg-white p-5 shadow-xs"
    >
      <div className="flex items-center gap-2.5 mb-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-100">
          <BarChart3 className="h-4 w-4 text-neutral-600" />
        </div>
        <h3 className="text-sm font-semibold text-neutral-900">Academic Statistics</h3>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {items.map((item) => {
          const Icon = item.icon
          return (
            <div key={item.label} className="rounded-lg border border-border p-3 transition-shadow hover:shadow-sm">
              <div className={cn('flex h-7 w-7 items-center justify-center rounded-md', item.color)}>
                <Icon className="h-3.5 w-3.5" />
              </div>
              <p className="mt-2 text-lg font-semibold text-neutral-900">
                {item.value}
                {item.subtitle && <span className="text-xs font-normal text-neutral-400 ml-0.5">{item.subtitle}</span>}
              </p>
              <p className="text-xs text-neutral-500">{item.label}</p>
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}
