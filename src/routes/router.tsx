import { lazy, Suspense } from 'react'
import { createBrowserRouter, Outlet } from 'react-router-dom'
import { AppLayout } from '@/layouts/AppLayout'
import { ProtectedRoute, GuestRoute } from '@/routes/guards'

// ─── Route Loading Fallback ───────────────────────────────────────────────────

function PageLoader() {
  return (
    <div className="flex-1 flex items-center justify-center py-20">
      <div className="flex items-center gap-2">
        <div className="h-2 w-2 rounded-full bg-primary-500 animate-pulse" />
        <span className="text-sm text-neutral-400">Loading...</span>
      </div>
    </div>
  )
}

function LazyPage({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<PageLoader />}>{children}</Suspense>
}

// ─── Lazy Route Imports ───────────────────────────────────────────────────────

const LoginPage = lazy(() => import('@/pages/auth/LoginPage'))
const RegisterPage = lazy(() => import('@/pages/auth/RegisterPage'))
const ForgotPasswordPage = lazy(() => import('@/pages/auth/ForgotPasswordPage'))
const DashboardPage = lazy(() => import('@/pages/dashboard'))
const ProfilePage = lazy(() => import('@/pages/profile'))
const SubjectsPage = lazy(() => import('@/pages/subjects'))
const SubjectDetail = lazy(() => import('@/pages/subjects/components/SubjectDetail'))
const AttendancePage = lazy(() => import('@/pages/attendance'))
const AssignmentsPage = lazy(() => import('@/pages/assignments'))
const AssignmentDetail = lazy(() => import('@/pages/assignments/components/AssignmentDetail'))
const TimetablePage = lazy(() => import('@/pages/timetable'))
const CalendarPage = lazy(() => import('@/pages/calendar'))
const ExamsPage = lazy(() => import('@/pages/exams'))
const ResultsPage = lazy(() => import('@/pages/results'))
const CgpaCalculatorPage = lazy(() => import('@/pages/cgpa-calculator'))
const PerformanceAnalyticsPage = lazy(() => import('@/pages/analytics/performance'))
const LibraryPage = lazy(() => import('@/pages/library'))
const FeesPage = lazy(() => import('@/pages/fees'))
const ScholarshipsPage = lazy(() => import('@/pages/scholarships'))
const HostelPage = lazy(() => import('@/pages/hostel'))
const TransportPage = lazy(() => import('@/pages/transport'))
const CertificatesPage = lazy(() => import('@/pages/certificates'))
const AchievementsPage = lazy(() => import('@/pages/achievements'))
const ProjectsPage = lazy(() => import('@/pages/projects'))
const PlacementsPage = lazy(() => import('@/pages/placements'))
const InternshipsPage = lazy(() => import('@/pages/internships'))
const SettingsPage = lazy(() => import('@/pages/settings'))
const NotificationsPage = lazy(() => import('@/pages/notifications'))
const HelpCenterPage = lazy(() => import('@/pages/help'))
const SupportPage = lazy(() => import('@/pages/support'))
const AboutPage = lazy(() => import('@/pages/about'))
const PrivacyPage = lazy(() => import('@/pages/privacy'))
const NotFoundPage = lazy(() => import('@/pages/not-found'))

// ─── Layout Wrappers ──────────────────────────────────────────────────────────

function GuestLayout() {
  return <GuestRoute><Suspense fallback={<PageLoader />}><Outlet /></Suspense></GuestRoute>
}

function ProtectedLayout() {
  return <ProtectedRoute><AppLayout /></ProtectedRoute>
}

// ─── Router ───────────────────────────────────────────────────────────────────

export const router = createBrowserRouter([
  {
    element: <GuestLayout />,
    children: [
      { path: 'login', element: <LazyPage><LoginPage /></LazyPage> },
      { path: 'register', element: <LazyPage><RegisterPage /></LazyPage> },
      { path: 'forgot-password', element: <LazyPage><ForgotPasswordPage /></LazyPage> },
    ],
  },
  {
    element: <ProtectedLayout />,
    children: [
      { index: true, element: <LazyPage><DashboardPage /></LazyPage> },
      { path: 'profile', element: <LazyPage><ProfilePage /></LazyPage> },
      { path: 'subjects', element: <LazyPage><SubjectsPage /></LazyPage> },
      { path: 'subjects/:id', element: <LazyPage><SubjectDetail /></LazyPage> },
      { path: 'attendance', element: <LazyPage><AttendancePage /></LazyPage> },
      { path: 'assignments', element: <LazyPage><AssignmentsPage /></LazyPage> },
      { path: 'assignments/:id', element: <LazyPage><AssignmentDetail /></LazyPage> },
      { path: 'timetable', element: <LazyPage><TimetablePage /></LazyPage> },
      { path: 'calendar', element: <LazyPage><CalendarPage /></LazyPage> },
      { path: 'exams', element: <LazyPage><ExamsPage /></LazyPage> },
      { path: 'results', element: <LazyPage><ResultsPage /></LazyPage> },
      { path: 'cgpa-calculator', element: <LazyPage><CgpaCalculatorPage /></LazyPage> },
      { path: 'analytics/performance', element: <LazyPage><PerformanceAnalyticsPage /></LazyPage> },
      { path: 'library', element: <LazyPage><LibraryPage /></LazyPage> },
      { path: 'fees', element: <LazyPage><FeesPage /></LazyPage> },
      { path: 'scholarships', element: <LazyPage><ScholarshipsPage /></LazyPage> },
      { path: 'hostel', element: <LazyPage><HostelPage /></LazyPage> },
      { path: 'transport', element: <LazyPage><TransportPage /></LazyPage> },
      { path: 'certificates', element: <LazyPage><CertificatesPage /></LazyPage> },
      { path: 'achievements', element: <LazyPage><AchievementsPage /></LazyPage> },
      { path: 'projects', element: <LazyPage><ProjectsPage /></LazyPage> },
      { path: 'placements', element: <LazyPage><PlacementsPage /></LazyPage> },
      { path: 'internships', element: <LazyPage><InternshipsPage /></LazyPage> },
      { path: 'settings', element: <LazyPage><SettingsPage /></LazyPage> },
      { path: 'notifications', element: <LazyPage><NotificationsPage /></LazyPage> },
      { path: 'help', element: <LazyPage><HelpCenterPage /></LazyPage> },
      { path: 'support', element: <LazyPage><SupportPage /></LazyPage> },
      { path: 'about', element: <LazyPage><AboutPage /></LazyPage> },
      { path: 'privacy', element: <LazyPage><PrivacyPage /></LazyPage> },
    ],
  },

  // ─── 404 Catch-All ────────────────────────────────────────────────────────
  { path: '*', element: <LazyPage><NotFoundPage /></LazyPage> },
])
