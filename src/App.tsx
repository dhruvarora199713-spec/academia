import { RouterProvider } from 'react-router-dom'
import { GraduationCap } from 'lucide-react'
import { AuthProvider, useAuth } from '@/store/auth-context'
import { ProfileProvider } from '@/store/profile-context'
import { AcademicDataProvider } from '@/store/academic-context'
import { ToastProvider } from '@/components/shared/Toast'
import { ErrorBoundary } from '@/components/shared/ErrorBoundary'
import { SessionWarningModal } from '@/components/shared/SessionWarningModal'
import { useSessionManager } from '@/hooks/use-session-manager'
import { router } from '@/routes/router'

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ProfileProvider>
          <AcademicDataProvider>
            <ToastProvider>
              <AuthGate />
            </ToastProvider>
          </AcademicDataProvider>
        </ProfileProvider>
      </AuthProvider>
    </ErrorBoundary>
  )
}

/**
 * AuthGate — Auth resolution + Session Management
 */
function AuthGate() {
  const { loading, isAuthenticated, logout } = useAuth()

  const session = useSessionManager({
    isAuthenticated,
    onLogout: logout,
  })

  if (loading) {
    return (
      <div className="fixed inset-0 z-[200] flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-600 text-white">
            <GraduationCap className="h-6 w-6" />
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-1.5 w-1.5 rounded-full bg-primary-500 animate-bounce [animation-delay:0ms]" />
            <div className="h-1.5 w-1.5 rounded-full bg-primary-500 animate-bounce [animation-delay:150ms]" />
            <div className="h-1.5 w-1.5 rounded-full bg-primary-500 animate-bounce [animation-delay:300ms]" />
          </div>
          <p className="text-sm text-neutral-400">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <SessionWarningModal
        show={session.showWarning}
        countdown={session.countdown}
        reason={session.expireReason}
        onContinue={session.continueSession}
        onLogout={session.logoutNow}
      />
      <RouterProvider router={router} />
    </>
  )
}

export default App
