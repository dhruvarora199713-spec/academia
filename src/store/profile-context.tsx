/**
 * Profile Context — DEADLOCK FIX
 *
 * ROOT CAUSE: updateProfile called fetchStudentDoc which set loading=true,
 * causing the Profile page to unmount all forms (show skeleton),
 * which destroyed the component that was awaiting the save result.
 *
 * FIX: updateProfile refreshes studentDoc WITHOUT setting loading=true.
 * The `loading` state is ONLY for initial page load.
 */

import {
  createContext, useContext, useState, useEffect, useCallback, useRef, type ReactNode,
} from 'react'
import { useAuth } from '@/store/auth-context'
import { getDocument } from '@/services/database/firestore.service'
import { COLLECTIONS } from '@/firebase/constants'
import { db } from '@/firebase/config'
import { parseFirebaseError, logger } from '@/services/firebase/error.service'
import type { UserDocument, StudentDocument } from '@/types/firebase/schema'

// ─── Types ────────────────────────────────────────────────────────────────────

interface ProfileContextValue {
  userDoc: UserDocument | null
  studentDoc: StudentDocument | null
  loading: boolean
  error: string | null
  completeness: number
  refreshProfile: () => Promise<void>
  updateProfile: (data: Partial<StudentDocument>) => Promise<boolean>
  uploadAvatar: (file: File) => Promise<string | null>
}

const ProfileContext = createContext<ProfileContextValue | null>(null)

export function useProfile(): ProfileContextValue {
  const context = useContext(ProfileContext)
  if (!context) throw new Error('useProfile must be used within ProfileProvider')
  return context
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function ProfileProvider({ children }: { children: ReactNode }) {
  const { user, profile: authProfile, isAuthenticated } = useAuth()
  const [studentDoc, setStudentDoc] = useState<StudentDocument | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fetchedUidRef = useRef<string | null>(null)

  // ─── Initial fetch (ONLY on first load — sets loading) ──────────────────────
  useEffect(() => {
    if (isAuthenticated && user && user.uid !== fetchedUidRef.current) {
      fetchedUidRef.current = user.uid
      initialFetch(user.uid)
    } else if (!isAuthenticated) {
      setStudentDoc(null)
      fetchedUidRef.current = null
    }
  }, [isAuthenticated, user])

  async function initialFetch(uid: string) {
    setLoading(true)
    try {
      const doc = await getDocument<StudentDocument>(COLLECTIONS.STUDENTS, uid)
      setStudentDoc(doc)
    } catch (err) {
      const firebaseErr = err as { code?: string; message?: string }
      logger.error('Profile initial fetch failed', firebaseErr)
    } finally {
      setLoading(false)
    }
  }

  // ─── Silent refresh (does NOT set loading — prevents unmount of forms) ──────
  async function silentRefresh(uid: string) {
    try {
      const doc = await getDocument<StudentDocument>(COLLECTIONS.STUDENTS, uid)
      setStudentDoc(doc)
    } catch {
      // Silent — don't disrupt UI
    }
  }

  const refreshProfile = useCallback(async () => {
    if (user) await silentRefresh(user.uid)
  }, [user])

  // ─── Update Profile (NEVER sets loading — form stays mounted) ───────────────
  const updateProfile = useCallback(async (data: Partial<StudentDocument>): Promise<boolean> => {
    if (!user) return false

    const uid = user.uid

    // Clean undefined values (Firestore rejects them)
    const cleanData: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined) cleanData[key] = value
    }

    try {
      const { doc: firestoreDoc, setDoc, serverTimestamp } = await import('firebase/firestore')
      const docRef = firestoreDoc(db, COLLECTIONS.STUDENTS, uid)

      // Timeout: Firestore can hang on cold connection. Fail fast after 10s.
      const writePromise = setDoc(docRef, {
        ...cleanData,
        userId: uid,
        updatedAt: serverTimestamp(),
      }, { merge: true })

      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Firestore write timed out (10s). Check network or rules.')), 10000)
      )

      await Promise.race([writePromise, timeoutPromise])

      // Refresh student doc WITHOUT setting loading=true
      await silentRefresh(uid)
      return true
    } catch (err: unknown) {
      const firebaseErr = err as { code?: string; message?: string }
      logger.error('Profile save failed', { code: firebaseErr.code, message: firebaseErr.message })
      const parsed = parseFirebaseError(err)
      setError(parsed.userMessage)
      return false
    }
  }, [user])

  const uploadAvatar = useCallback(async (_file: File): Promise<string | null> => {
    return null // Storage skipped
  }, [])

  const userDoc = authProfile

  return (
    <ProfileContext.Provider value={{
      userDoc, studentDoc, loading, error,
      completeness: computeCompleteness(userDoc, studentDoc),
      refreshProfile, updateProfile, uploadAvatar,
    }}>
      {children}
    </ProfileContext.Provider>
  )
}

// ─── Completeness ─────────────────────────────────────────────────────────────

function computeCompleteness(userDoc: UserDocument | null, studentDoc: StudentDocument | null): number {
  if (!userDoc) return 0
  const fields = [
    userDoc.displayName, userDoc.email, userDoc.photoURL,
    studentDoc?.firstName, studentDoc?.lastName, studentDoc?.phone,
    studentDoc?.dateOfBirth, studentDoc?.gender, studentDoc?.rollNumber,
    studentDoc?.branch, studentDoc?.semester, studentDoc?.batch,
    studentDoc?.currentAddress, studentDoc?.city, studentDoc?.state,
    studentDoc?.fatherName, studentDoc?.motherName,
    studentDoc?.emergencyContactName, studentDoc?.personalEmail, studentDoc?.bloodGroup,
  ]
  const filled = fields.filter((f) => f !== null && f !== undefined && f !== '').length
  return Math.round((filled / fields.length) * 100)
}
