/**
 * Authentication Context — Performance Fixed
 *
 * CRITICAL FIX: loading resolves IMMEDIATELY when onAuthStateChanged fires.
 * Firestore operations (bootstrap, profile) run in background.
 * The app never blocks on Firestore availability.
 */

import {
  createContext, useContext, useState, useEffect, useCallback, type ReactNode,
} from 'react'
import type { User } from 'firebase/auth'
import type { UserRole } from '@/firebase/constants'
import type { UserDocument } from '@/types/firebase/schema'
import {
  onAuthChange,
  signInWithGoogle as googleSignIn,
  signInWithEmail,
  createAccount,
  logout as firebaseLogout,
  resetPassword as firebaseResetPassword,
} from '@/services/auth/auth.service'
import { parseFirebaseError } from '@/services/firebase/error.service'
import { bootstrapAndGetProfile } from '@/services/auth/bootstrap.service'

// ─── Types ────────────────────────────────────────────────────────────────────

interface AuthContextValue {
  user: User | null
  profile: UserDocument | null
  role: UserRole | null
  loading: boolean
  isAuthenticated: boolean
  loginWithGoogle: () => Promise<void>
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  refreshUser: () => Promise<void>
  error: string | null
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserDocument | null>(null)
  const [role, setRole] = useState<UserRole | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const unsubscribe = onAuthChange((firebaseUser) => {
      setUser(firebaseUser)
      setError(null)

      // CRITICAL: Resolve loading IMMEDIATELY. Don't await Firestore.
      // This allows the app to render while profile loads in background.
      setLoading(false)

      if (firebaseUser) {
        // Background: fetch/create profile (non-blocking)
        bootstrapAndGetProfile(firebaseUser).then((userDoc) => {
          setProfile(userDoc)
          setRole(userDoc?.role ?? null)
        }).catch(() => {
          setProfile(null)
          setRole(null)
        })
      } else {
        setProfile(null)
        setRole(null)
      }
    })

    return () => unsubscribe()
  }, [])

  const loginWithGoogle = useCallback(async () => {
    setError(null)
    try { await googleSignIn() }
    catch (err) { const p = parseFirebaseError(err); setError(p.userMessage); throw err }
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    setError(null)
    try { await signInWithEmail(email, password) }
    catch (err) { const p = parseFirebaseError(err); setError(p.userMessage); throw err }
  }, [])

  const register = useCallback(async (email: string, password: string) => {
    setError(null)
    try { await createAccount(email, password) }
    catch (err) { const p = parseFirebaseError(err); setError(p.userMessage); throw err }
  }, [])

  const logout = useCallback(async () => {
    setError(null)
    try { await firebaseLogout() }
    catch (err) { const p = parseFirebaseError(err); setError(p.userMessage) }
  }, [])

  const resetPassword = useCallback(async (email: string) => {
    setError(null)
    try { await firebaseResetPassword(email) }
    catch (err) { const p = parseFirebaseError(err); setError(p.userMessage); throw err }
  }, [])

  const refreshUser = useCallback(async () => {
    if (!user) return
    const userDoc = await bootstrapAndGetProfile(user)
    setProfile(userDoc)
    setRole(userDoc?.role ?? null)
  }, [user])

  const value: AuthContextValue = {
    user, profile, role, loading,
    isAuthenticated: !!user,
    loginWithGoogle, login, register, logout, resetPassword, refreshUser, error,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
