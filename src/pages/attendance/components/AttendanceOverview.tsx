import { motion } from 'framer-motion'
import { CalendarCheck, CalendarX, Target, AlertTriangle, CheckCircle2, ShieldAlert } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { AttendanceOverviewStats } from '../data'
import { REQUIRED_ATTENDANCE } from '../data'

interface AttendanceOverviewProps {
  stats: AttendanceOverviewStats
}

const statusConfig = {
  safe: { label: 'Meeting Requirement', icon: CheckCircle2, class: 'text-success-600 bg-success-50' },
  warning: { label: 'Near Threshold', icon: AlertTriangle, class: 'text-warning-600 bg-warning-50' },
  critical: { label: 'Below Requirement', icon: ShieldAlert, class: 'text-error-600 bg-error-50' },
}

export function AttendanceOverview({ stats }: AttendanceOverviewProps) {
  const config = statusConfig[stats.status]
  const StatusIcon = config.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
    >
      {/* Overall Percentage — Hero Card */}
      <div className="rounded-xl border border-border bg-white p-5 shadow-xs sm:col-span-2 lg:col-span-1">
        <div className="flex items-center gap-3">
          {/* Circular progress indicator */}
          <div className="relative h-14 w-14 shrink-0">
            <svg className="h-14 w-14 -rotate-90" viewBox="0 0 56 56">
              <circle cx="28" cy="28" r="24" fill="none" stroke="#f5f5f4" strokeWidth="5" />
              <circle
                cx="28" cy="28" r="24" fill="none"
                stroke={stats.status === 'safe' ? '#16a34a' : stats.status === 'warning' ? '#d97706' : '#dc2626'}
                strokeWidth="5" strokeLinecap="round"
                strokeDasharray={`${(stats.overallPercentage / 100) * 150.8} 150.8`}
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-neutral-900">
              {stats.overallPercentage}%
            </span>
          </div>
          <div>
            <p className="text-sm font-semibold text-neutral-900">Overall Attendance</p>
            <div className={cn('mt-1 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold', config.class)}>
              <StatusIcon className="h-3 w-3" />
              {config.label}
            </div>
          </div>
        </div>
      </div>

      {/* Classes Attended */}
      <div className="rounded-xl border border-border bg-white p-5 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-neutral-500">Classes Attended</span>
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-success-50">
            <CalendarCheck className="h-3.5 w-3.5 text-success-600" />
          </div>
        </div>
        <p className="mt-2 text-2xl font-semibold text-neutral-900">{stats.totalPresent}</p>
        <p className="text-xs text-neutral-400">out of {stats.totalClasses} total</p>
      </div>

      {/* Classes Missed */}
      <div className="rounded-xl border border-border bg-white p-5 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-neutral-500">Classes Missed</span>
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-error-50">
            <CalendarX className="h-3.5 w-3.5 text-error-600" />
          </div>
        </div>
        <p className="mt-2 text-2xl font-semibold text-neutral-900">{stats.totalAbsent}</p>
        <p className="text-xs text-neutral-400">across all subjects</p>
      </div>

      {/* Subject Status Summary */}
      <div className="rounded-xl border border-border bg-white p-5 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-neutral-500">Requirement: {REQUIRED_ATTENDANCE}%</span>
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary-50">
            <Target className="h-3.5 w-3.5 text-primary-600" />
          </div>
        </div>
        <div className="mt-2 flex items-center gap-3">
          <span className="flex items-center gap-1 text-xs">
            <span className="h-2 w-2 rounded-full bg-success-500" />{stats.safeSubjects} safe
          </span>
          <span className="flex items-center gap-1 text-xs">
            <span className="h-2 w-2 rounded-full bg-warning-500" />{stats.warningSubjects} warn
          </span>
          <span className="flex items-center gap-1 text-xs">
            <span className="h-2 w-2 rounded-full bg-error-500" />{stats.criticalSubjects} risk
          </span>
        </div>
        <p className="text-xs text-neutral-400 mt-1">University minimum threshold</p>
      </div>
    </motion.div>
  )
}
