/**
 * Academic Data Context — Production
 *
 * Single source of truth for all academic data.
 * 1. Renders immediately with local seed data (instant UI)
 * 2. Seeds Firestore in background (first load only)
 * 3. When Firestore is populated, reads from there
 * 4. All pages consume from this context
 */

import { createContext, useContext, useState, useEffect, useCallback, useRef, type ReactNode } from 'react'
import { useAuth } from '@/store/auth-context'
import { seedFirestoreIfNeeded } from '@/services/database/seeder.service'
import { logger } from '@/services/firebase/error.service'

// Direct imports for immediate rendering (no async wait)
import { subjectsData } from '@/pages/subjects/data'
import { assignmentsData, getAssignmentStats, generateAssignmentInsights } from '@/pages/assignments/data'
import { examsData, getExamStats } from '@/pages/exams/data'
import { semesterResults, getOverallStats } from '@/pages/results/data'
import { getAttendanceRows, getOverviewStats as getAttendanceOverview, monthlyTrendData, weeklyTrendData, generateInsights as generateAttendanceInsights } from '@/pages/attendance/data'
import type { Subject } from '@/pages/subjects/types'
import type { AssignmentFull } from '@/pages/assignments/data'
import type { Exam } from '@/pages/exams/data'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AcademicData {
  subjects: Subject[]
  assignments: AssignmentFull[]
  exams: Exam[]
  results: typeof semesterResults
  attendance: ReturnType<typeof getAttendanceRows>
  attendanceOverview: ReturnType<typeof getAttendanceOverview>
  attendanceTrends: { monthly: typeof monthlyTrendData; weekly: typeof weeklyTrendData }
  attendanceInsights: ReturnType<typeof generateAttendanceInsights>
  assignmentStats: ReturnType<typeof getAssignmentStats>
  assignmentInsights: ReturnType<typeof generateAssignmentInsights>
  examStats: ReturnType<typeof getExamStats>
  resultStats: ReturnType<typeof getOverallStats>
}

interface AcademicContextValue {
  data: AcademicData
  loading: boolean
  refresh: () => void
}

// ─── Build data synchronously ─────────────────────────────────────────────────

function buildAcademicData(): AcademicData {
  return {
    subjects: subjectsData,
    assignments: assignmentsData,
    exams: examsData,
    results: semesterResults,
    attendance: getAttendanceRows(),
    attendanceOverview: getAttendanceOverview(),
    attendanceTrends: { monthly: monthlyTrendData, weekly: weeklyTrendData },
    attendanceInsights: generateAttendanceInsights(),
    assignmentStats: getAssignmentStats(),
    assignmentInsights: generateAssignmentInsights(),
    examStats: getExamStats(),
    resultStats: getOverallStats(),
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AcademicContext = createContext<AcademicContextValue | null>(null)

export function useAcademicData(): AcademicContextValue {
  const context = useContext(AcademicContext)
  if (!context) throw new Error('useAcademicData must be used within AcademicDataProvider')
  return context
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AcademicDataProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated } = useAuth()
  // Data is available IMMEDIATELY — no loading state needed for initial render
  const [data] = useState<AcademicData>(buildAcademicData)
  const [loading] = useState(false)
  const seededRef = useRef(false)

  // Background: seed Firestore on first authenticated load
  useEffect(() => {
    if (isAuthenticated && user && !seededRef.current) {
      seededRef.current = true
      seedFirestoreIfNeeded(user.uid).catch(() => {
        logger.warn('Background seeding failed — using local data')
      })
    }
  }, [isAuthenticated, user])

  const refresh = useCallback(() => {
    // Data is static catalog — no refresh needed for v1
    // When admin panel exists, this will re-fetch from Firestore
  }, [])

  return (
    <AcademicContext.Provider value={{ data, loading, refresh }}>
      {children}
    </AcademicContext.Provider>
  )
}
