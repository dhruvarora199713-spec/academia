/**
 * Route Guards — Security Hardened
 *
 * SECURITY GUARANTEE:
 * - No protected content renders until auth is CONFIRMED
 * - No reliance on "null" renders (which can flash)
 * - Immediate redirect for unauthenticated users
 * - Works with direct URL access, browser refresh, incognito, back button
 */

import { type ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/store/auth-context'
import type { UserRole } from '@/firebase/constants'

interface RouteGuardProps {
  children: ReactNode
  fallback?: ReactNode
}

// ─── Protected Route ──────────────────────────────────────────────────────────
// Requires authenticated user. Redirects to /login if not.
// By the time this renders, AuthGate has already confirmed loading=false,
// so we can trust isAuthenticated immediately.

export function ProtectedRoute({ children }: RouteGuardProps) {
  const { isAuthenticated } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}

// ─── Guest Route ──────────────────────────────────────────────────────────────
// Only for unauthenticated users (login, register, forgot-password).
// Redirects to dashboard if already authenticated.

export function GuestRoute({ children }: RouteGuardProps) {
  const { isAuthenticated } = useAuth()

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}

// ─── Role-Based Guard ─────────────────────────────────────────────────────────

function RoleGuard({ children, allowedRoles }: RouteGuardProps & { allowedRoles: UserRole[] }) {
  const { isAuthenticated, role } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (!role || (!allowedRoles.includes(role) && role !== 'super_admin')) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}

export function StudentRoute({ children, fallback }: RouteGuardProps) {
  return <RoleGuard allowedRoles={['student']} fallback={fallback}>{children}</RoleGuard>
}

export function FacultyRoute({ children, fallback }: RouteGuardProps) {
  return <RoleGuard allowedRoles={['faculty', 'hod']} fallback={fallback}>{children}</RoleGuard>
}

export function AdminRoute({ children, fallback }: RouteGuardProps) {
  return <RoleGuard allowedRoles={['admin', 'super_admin']} fallback={fallback}>{children}</RoleGuard>
}

export function SuperAdminRoute({ children, fallback }: RouteGuardProps) {
  return <RoleGuard allowedRoles={['super_admin']} fallback={fallback}>{children}</RoleGuard>
}
