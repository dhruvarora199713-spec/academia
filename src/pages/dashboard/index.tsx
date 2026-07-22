import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
} from 'recharts'
import {
  CalendarCheck, TrendingUp, BookOpen, Clock, ChevronRight, Circle,
  FileText, Award, Calculator, Library, AlertCircle, CheckCircle2, Zap,
  ArrowRight, MapPin, User,
} from 'lucide-react'
import { PageWrapper } from '@/layouts/PageWrapper'
import { StatCard } from '@/components/shared/StatCard'
import { ChartWrapper, CHART_COLORS, chartConfig } from '@/components/shared/ChartWrapper'
import { useAuth } from '@/store/auth-context'
import { useProfile } from '@/store/profile-context'
import {
  academicStats,
  attendanceChartData,
  cgpaChartData,
  todaySchedule,
  upcomingDeadlines,
  recentActivities,
  quickActions,
} from './data'
import { cn } from '@/lib/utils'

// ─── Icon Map for Quick Actions ───────────────────────────────────────────────

const iconMap = {
  CalendarCheck,
  FileText,
  Award,
  Calculator,
  Clock,
  Library,
} as const

// ─── Dashboard Page ───────────────────────────────────────────────────────────

export default function DashboardPage() {
  const greeting = getGreeting()
  const { user } = useAuth()
  const { userDoc, studentDoc } = useProfile()
  const firstName = studentDoc?.firstName || userDoc?.displayName?.split(' ')[0] || user?.displayName?.split(' ')[0] || 'Student'
  const branch = studentDoc?.branch || ''
  const semester = studentDoc?.semester || 0
  const rollNo = studentDoc?.rollNumber || ''

  return (
    <PageWrapper title="Dashboard">
      {/* Greeting Header */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-8"
      >
        <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">
          {greeting}, {firstName}
        </h1>
        <p className="mt-1 text-sm text-neutral-500">
          {branch}{semester ? ` • Semester ${semester}` : ''}{rollNo ? ` • ${rollNo}` : ''}
        </p>
      </motion.div>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Attendance"
          value={`${academicStats.attendance.current}%`}
          trend={academicStats.attendance.trend}
          trendUp={academicStats.attendance.trendUp}
          icon={CalendarCheck}
          variant="primary"
          delay={0}
        />
        <StatCard
          label="CGPA"
          value={academicStats.cgpa.current.toFixed(2)}
          trend={academicStats.cgpa.trend}
          trendUp={academicStats.cgpa.trendUp}
          icon={TrendingUp}
          variant="success"
          delay={1}
        />
        <StatCard
          label="Credits Completed"
          value={`${academicStats.credits.completed}/${academicStats.credits.total}`}
          subtitle={`${academicStats.credits.thisSemester} this semester`}
          icon={BookOpen}
          variant="warning"
          delay={2}
        />
        <StatCard
          label="Active Subjects"
          value={academicStats.subjects.current}
          subtitle={`${academicStats.subjects.labs} labs included`}
          icon={Clock}
          variant="primary"
          delay={3}
        />
      </div>

      {/* Charts Row */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Attendance Trend */}
        <ChartWrapper
          title="Attendance Trend"
          description="Monthly attendance percentage vs. minimum requirement"
          height={240}
          action={
            <span className="text-xs font-medium text-neutral-400">
              This Semester
            </span>
          }
        >
          <LineChart data={attendanceChartData}>
            <CartesianGrid {...chartConfig.grid} vertical={false} />
            <XAxis dataKey="month" {...chartConfig.axis} tickLine={false} axisLine={false} />
            <YAxis {...chartConfig.axis} tickLine={false} axisLine={false} domain={[75, 100]} />
            <Tooltip {...chartConfig.tooltip} />
            <Line
              type="monotone"
              dataKey="attendance"
              stroke={CHART_COLORS.primary}
              strokeWidth={2.5}
              dot={{ r: 3, fill: CHART_COLORS.primary }}
              activeDot={{ r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="target"
              stroke={CHART_COLORS.neutral}
              strokeWidth={1.5}
              strokeDasharray="4 4"
              dot={false}
            />
          </LineChart>
        </ChartWrapper>

        {/* CGPA Progress */}
        <ChartWrapper
          title="CGPA Progress"
          description="Cumulative GPA trend across semesters"
          height={240}
          action={
            <span className="text-xs font-medium text-neutral-400">
              All Semesters
            </span>
          }
        >
          <BarChart data={cgpaChartData}>
            <CartesianGrid {...chartConfig.grid} vertical={false} />
            <XAxis dataKey="semester" {...chartConfig.axis} tickLine={false} axisLine={false} />
            <YAxis {...chartConfig.axis} tickLine={false} axisLine={false} domain={[7, 10]} />
            <Tooltip {...chartConfig.tooltip} />
            <Bar
              dataKey="sgpa"
              fill={CHART_COLORS.primary}
              radius={[4, 4, 0, 0]}
              opacity={0.3}
            />
            <Bar
              dataKey="cgpa"
              fill={CHART_COLORS.primary}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartWrapper>
      </div>

      {/* Main Content Grid */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Today's Schedule (2/3 width) */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
          className="lg:col-span-2 rounded-xl border border-border bg-white p-6 shadow-xs"
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-base font-semibold text-neutral-900">Today's Schedule</h2>
              <p className="mt-0.5 text-xs text-neutral-500">Tuesday, 8 July 2026</p>
            </div>
            <Link
              to="/timetable"
              className="flex items-center gap-1 text-xs font-medium text-primary-600 hover:text-primary-700 transition-colors"
            >
              View full timetable <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="space-y-2">
            {todaySchedule.map((item) => (
              <ScheduleItem key={item.id} item={item} />
            ))}
          </div>
        </motion.div>

        {/* Upcoming Deadlines (1/3 width) */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="rounded-xl border border-border bg-white p-6 shadow-xs"
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-semibold text-neutral-900">Deadlines</h2>
            <Link
              to="/assignments"
              className="flex items-center gap-1 text-xs font-medium text-primary-600 hover:text-primary-700 transition-colors"
            >
              All <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {upcomingDeadlines.map((deadline) => (
              <DeadlineItem key={deadline.id} item={deadline} />
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom Row: Activities + Quick Actions */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.25 }}
          className="lg:col-span-2 rounded-xl border border-border bg-white p-6 shadow-xs"
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-semibold text-neutral-900">Recent Activity</h2>
            <span className="text-xs text-neutral-400">Last 7 days</span>
          </div>
          <div className="space-y-1">
            {recentActivities.map((activity, i) => (
              <ActivityItem key={activity.id} item={activity} isLast={i === recentActivities.length - 1} />
            ))}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="rounded-xl border border-border bg-white p-6 shadow-xs"
        >
          <h2 className="text-base font-semibold text-neutral-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-2">
            {quickActions.map((action) => {
              const Icon = iconMap[action.iconName]
              return (
                <Link
                  key={action.id}
                  to={action.href}
                  className="group flex flex-col items-center gap-2 rounded-xl border border-border p-4 text-center transition-all hover:border-primary-200 hover:bg-primary-50/50 hover:shadow-sm"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-100 text-neutral-500 transition-colors group-hover:bg-primary-100 group-hover:text-primary-600">
                    <Icon className="h-4.5 w-4.5" />
                  </div>
                  <span className="text-xs font-medium text-neutral-700 group-hover:text-primary-700">
                    {action.label}
                  </span>
                </Link>
              )
            })}
          </div>
        </motion.div>
      </div>
    </PageWrapper>
  )
}

// ─── Schedule Item Component ──────────────────────────────────────────────────

function ScheduleItem({ item }: { item: typeof todaySchedule[number] }) {
  const statusStyles = {
    completed: 'border-l-success-500 bg-success-50/30',
    ongoing: 'border-l-primary-500 bg-primary-50/30',
    upcoming: 'border-l-neutral-300 bg-white',
  }

  const statusBadge = {
    completed: { label: 'Done', class: 'bg-success-100 text-success-700' },
    ongoing: { label: 'Now', class: 'bg-primary-100 text-primary-700' },
    upcoming: { label: item.time, class: 'bg-neutral-100 text-neutral-600' },
  }

  const badge = statusBadge[item.status]

  return (
    <div
      className={cn(
        'flex items-center gap-4 rounded-lg border border-border border-l-[3px] px-4 py-3 transition-colors hover:shadow-xs',
        statusStyles[item.status],
      )}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-neutral-900 truncate">{item.title}</p>
          {item.type === 'lab' && (
            <span className="shrink-0 rounded-full bg-warning-100 px-1.5 py-0.5 text-[10px] font-medium text-warning-700">
              Lab
            </span>
          )}
        </div>
        <div className="mt-0.5 flex items-center gap-3 text-xs text-neutral-500">
          <span className="flex items-center gap-1">
            <User className="h-3 w-3" />{item.professor}
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />{item.location}
          </span>
        </div>
      </div>
      <span className={cn('shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium', badge.class)}>
        {badge.label}
      </span>
    </div>
  )
}

// ─── Deadline Item Component ──────────────────────────────────────────────────

function DeadlineItem({ item }: { item: typeof upcomingDeadlines[number] }) {
  const priorityStyles = {
    high: 'text-error-600',
    medium: 'text-warning-600',
    low: 'text-neutral-400',
  }

  const daysLeft = getDaysUntil(item.dueDate)
  const urgencyLabel = daysLeft <= 2 ? 'Urgent' : `${daysLeft}d left`

  return (
    <div className="flex items-start gap-3 rounded-lg p-2 transition-colors hover:bg-neutral-50">
      <div className="mt-0.5">
        <Circle className={cn('h-2.5 w-2.5 fill-current', priorityStyles[item.priority])} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-neutral-800 truncate">{item.title}</p>
        <p className="text-xs text-neutral-400 mt-0.5">{item.subject}</p>
      </div>
      <span className={cn(
        'shrink-0 text-[11px] font-medium rounded-full px-2 py-0.5',
        daysLeft <= 2 ? 'bg-error-50 text-error-600' : 'bg-neutral-100 text-neutral-500',
      )}>
        {urgencyLabel}
      </span>
    </div>
  )
}

// ─── Activity Item Component ──────────────────────────────────────────────────

function ActivityItem({ item, isLast }: { item: typeof recentActivities[number]; isLast: boolean }) {
  const typeIcons = {
    submission: { icon: FileText, class: 'bg-primary-100 text-primary-600' },
    attendance: { icon: CheckCircle2, class: 'bg-success-100 text-success-600' },
    grade: { icon: Award, class: 'bg-warning-100 text-warning-600' },
    event: { icon: Zap, class: 'bg-purple-100 text-purple-600' },
    library: { icon: BookOpen, class: 'bg-cyan-100 text-cyan-600' },
    payment: { icon: AlertCircle, class: 'bg-neutral-100 text-neutral-600' },
  }

  const config = typeIcons[item.type]
  const Icon = config.icon

  return (
    <div className="flex gap-3 py-2.5">
      {/* Timeline dot */}
      <div className="flex flex-col items-center">
        <div className={cn('flex h-7 w-7 items-center justify-center rounded-full', config.class)}>
          <Icon className="h-3.5 w-3.5" />
        </div>
        {!isLast && <div className="mt-1 w-px flex-1 bg-border" />}
      </div>
      {/* Content */}
      <div className="flex-1 min-w-0 pb-2">
        <p className="text-sm font-medium text-neutral-800">{item.action}</p>
        <p className="text-xs text-neutral-500 truncate">{item.description}</p>
        <p className="text-[11px] text-neutral-400 mt-0.5">{item.time}</p>
      </div>
      <ArrowRight className="h-3.5 w-3.5 mt-1 text-neutral-300 shrink-0" />
    </div>
  )
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

function getDaysUntil(dateStr: string): number {
  const target = new Date(dateStr)
  const now = new Date()
  const diff = target.getTime() - now.getTime()
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
}
