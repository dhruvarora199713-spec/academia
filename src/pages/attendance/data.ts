/**
 * Attendance Module — Data Layer
 *
 * IMPORTANT: This module references the Subject types directly.
 * No duplicate models. Subject attendance data comes from subjectsData.
 */

import { subjectsData } from '@/pages/subjects/data'
import type { Subject } from '@/pages/subjects/types'

// ─── Derived Types (extend, not duplicate) ────────────────────────────────────

export interface AttendanceSubjectRow {
  subject: Subject
  classesRequired: number   // classes needed to reach 75%
  status: 'safe' | 'warning' | 'critical'
  canMiss: number           // classes they can still miss and stay >= 75%
  lastAttended: string
}

export interface AttendanceOverviewStats {
  overallPercentage: number
  totalPresent: number
  totalAbsent: number
  totalClasses: number
  requiredPercentage: number
  status: 'safe' | 'warning' | 'critical'
  safeSubjects: number
  warningSubjects: number
  criticalSubjects: number
}

export interface MonthlyTrend {
  month: string
  percentage: number
  classes: number
  present: number
}

export interface WeeklyTrend {
  week: string
  percentage: number
  present: number
  total: number
}

export interface AttendanceInsight {
  id: string
  type: 'success' | 'warning' | 'danger' | 'info'
  title: string
  description: string
  subject?: string
}

// ─── Constants ────────────────────────────────────────────────────────────────

export const REQUIRED_ATTENDANCE = 75

// ─── Computed Data from Subjects ──────────────────────────────────────────────

function computeClassesRequired(present: number, total: number, required: number = REQUIRED_ATTENDANCE): number {
  // Classes needed to attend consecutively to reach required %
  // (present + x) / (total + x) >= required/100
  // Solving: x = (required * total - 100 * present) / (100 - required)
  if (present / total * 100 >= required) return 0
  const x = Math.ceil((required * total - 100 * present) / (100 - required))
  return Math.max(0, x)
}

function computeCanMiss(present: number, total: number, required: number = REQUIRED_ATTENDANCE): number {
  // How many classes can be missed from upcoming and still maintain >= required%
  // present / (total + x) >= required/100
  // Solving: x = (100 * present / required) - total
  const maxTotal = Math.floor((100 * present) / required)
  return Math.max(0, maxTotal - total)
}

function getStatus(percentage: number): 'safe' | 'warning' | 'critical' {
  if (percentage >= 85) return 'safe'
  if (percentage >= 75) return 'warning'
  return 'critical'
}

// ─── Subject Attendance Rows ──────────────────────────────────────────────────

export function getAttendanceRows(): AttendanceSubjectRow[] {
  return subjectsData.map((subject) => {
    const { present, total, percentage, history } = subject.attendance
    const lastRecord = history[0]
    return {
      subject,
      classesRequired: computeClassesRequired(present, total),
      status: getStatus(percentage),
      canMiss: computeCanMiss(present, total),
      lastAttended: lastRecord?.date || '',
    }
  })
}

// ─── Overview Stats ───────────────────────────────────────────────────────────

export function getOverviewStats(): AttendanceOverviewStats {
  const rows = getAttendanceRows()
  const totalPresent = subjectsData.reduce((sum, s) => sum + s.attendance.present, 0)
  const totalClasses = subjectsData.reduce((sum, s) => sum + s.attendance.total, 0)
  const overallPercentage = totalClasses > 0 ? (totalPresent / totalClasses) * 100 : 0

  return {
    overallPercentage: Math.round(overallPercentage * 10) / 10,
    totalPresent,
    totalAbsent: totalClasses - totalPresent,
    totalClasses,
    requiredPercentage: REQUIRED_ATTENDANCE,
    status: getStatus(overallPercentage),
    safeSubjects: rows.filter((r) => r.status === 'safe').length,
    warningSubjects: rows.filter((r) => r.status === 'warning').length,
    criticalSubjects: rows.filter((r) => r.status === 'critical').length,
  }
}

// ─── Monthly Trend Data ───────────────────────────────────────────────────────

export const monthlyTrendData: MonthlyTrend[] = [
  { month: 'Feb', percentage: 94, classes: 28, present: 26 },
  { month: 'Mar', percentage: 89, classes: 32, present: 28 },
  { month: 'Apr', percentage: 86, classes: 30, present: 26 },
  { month: 'May', percentage: 83, classes: 26, present: 22 },
  { month: 'Jun', percentage: 88, classes: 34, present: 30 },
  { month: 'Jul', percentage: 87, classes: 14, present: 12 },
]

// ─── Weekly Trend Data ────────────────────────────────────────────────────────

export const weeklyTrendData: WeeklyTrend[] = [
  { week: 'Week 1', percentage: 100, present: 15, total: 15 },
  { week: 'Week 2', percentage: 87, present: 13, total: 15 },
  { week: 'Week 3', percentage: 93, present: 14, total: 15 },
  { week: 'Week 4', percentage: 80, present: 12, total: 15 },
  { week: 'Week 5', percentage: 87, present: 13, total: 15 },
  { week: 'Week 6', percentage: 93, present: 14, total: 15 },
  { week: 'Week 7', percentage: 73, present: 11, total: 15 },
  { week: 'Week 8', percentage: 87, present: 13, total: 15 },
]

// ─── Dynamic Insights (computed, not hardcoded) ───────────────────────────────

export function generateInsights(): AttendanceInsight[] {
  const rows = getAttendanceRows()
  const stats = getOverviewStats()
  const insights: AttendanceInsight[] = []

  // Overall status
  if (stats.status === 'safe') {
    insights.push({
      id: 'overall-safe',
      type: 'success',
      title: 'You meet the university attendance requirement',
      description: `Your overall attendance is ${stats.overallPercentage}%, which is above the required ${REQUIRED_ATTENDANCE}%.`,
    })
  }

  // Subjects where you can miss classes
  rows
    .filter((r) => r.canMiss > 0 && r.status === 'safe')
    .sort((a, b) => a.canMiss - b.canMiss)
    .slice(0, 2)
    .forEach((r) => {
      insights.push({
        id: `can-miss-${r.subject.id}`,
        type: 'info',
        title: `You can miss ${r.canMiss} more class${r.canMiss > 1 ? 'es' : ''} in ${r.subject.name}`,
        description: `Current: ${r.subject.attendance.percentage}% (${r.subject.attendance.present}/${r.subject.attendance.total} classes). Safe margin maintained.`,
        subject: r.subject.name,
      })
    })

  // Critical subjects
  rows
    .filter((r) => r.status === 'critical')
    .forEach((r) => {
      insights.push({
        id: `critical-${r.subject.id}`,
        type: 'danger',
        title: `${r.subject.name} requires immediate attention`,
        description: `Attendance is ${r.subject.attendance.percentage}% — below the ${REQUIRED_ATTENDANCE}% requirement. Need ${r.classesRequired} consecutive classes to recover.`,
        subject: r.subject.name,
      })
    })

  // Warning subjects
  rows
    .filter((r) => r.status === 'warning')
    .forEach((r) => {
      insights.push({
        id: `warning-${r.subject.id}`,
        type: 'warning',
        title: `${r.subject.name} is approaching the minimum threshold`,
        description: `Currently at ${r.subject.attendance.percentage}%. You can only miss ${r.canMiss} more class${r.canMiss !== 1 ? 'es' : ''} before falling below ${REQUIRED_ATTENDANCE}%.`,
        subject: r.subject.name,
      })
    })

  // Streak insight
  const highestAttendance = rows.reduce((best, r) =>
    r.subject.attendance.percentage > best.subject.attendance.percentage ? r : best,
  )
  insights.push({
    id: 'best-attendance',
    type: 'success',
    title: `Best attendance: ${highestAttendance.subject.name}`,
    description: `${highestAttendance.subject.attendance.percentage}% — ${highestAttendance.subject.attendance.present} out of ${highestAttendance.subject.attendance.total} classes attended.`,
    subject: highestAttendance.subject.name,
  })

  return insights
}
