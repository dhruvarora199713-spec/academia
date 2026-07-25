/**
 * Authentication Service
 *
 * WHY: Centralizes all auth operations. Components never call Firebase Auth directly.
 * This enables: consistent error handling, logging, session management,
 * and easy migration to a different auth provider in the future.
 *
 * SUPPORTS: Google OAuth, Email/Password, Session persistence, Role resolution
 */

import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  GoogleAuthProvider,
  setPersistence,
  browserLocalPersistence,
  type User,
  type UserCredential,
  type Unsubscribe,
} from 'firebase/auth'
import { auth } from '@/firebase/config'
import { COLLECTIONS, ROLE_PERMISSIONS, PERMISSIONS } from '@/firebase/constants'
import { getDocument } from '@/services/database/firestore.service'
import type { UserDocument } from '@/types/firebase/schema'
import type { UserRole } from '@/firebase/constants'

// ─── Providers ────────────────────────────────────────────────────────────────

const googleProvider = new GoogleAuthProvider()
googleProvider.setCustomParameters({ prompt: 'select_account' })

// ─── Sign In with Google ──────────────────────────────────────────────────────

export async function signInWithGoogle(): Promise<UserCredential> {
  await setPersistence(auth, browserLocalPersistence)
  return signInWithPopup(auth, googleProvider)
}

// ─── Sign In with Email/Password ──────────────────────────────────────────────

export async function signInWithEmail(email: string, password: string): Promise<UserCredential> {
  await setPersistence(auth, browserLocalPersistence)
  return signInWithEmailAndPassword(auth, email, password)
}

// ─── Create Account with Email/Password ───────────────────────────────────────

export async function createAccount(email: string, password: string): Promise<UserCredential> {
  return createUserWithEmailAndPassword(auth, email, password)
}

// ─── Sign Out ─────────────────────────────────────────────────────────────────

export async function logout(): Promise<void> {
  return signOut(auth)
}

// ─── Forgot Password ──────────────────────────────────────────────────────────

export async function resetPassword(email: string): Promise<void> {
  return sendPasswordResetEmail(auth, email)
}

// ─── Auth State Observer ──────────────────────────────────────────────────────

export function onAuthChange(callback: (user: User | null) => void): Unsubscribe {
  return onAuthStateChanged(auth, callback)
}

// ─── Get Current User ─────────────────────────────────────────────────────────

export function getCurrentUser(): User | null {
  return auth.currentUser
}

// ─── Get User Role from Firestore ─────────────────────────────────────────────

export async function getUserRole(uid: string): Promise<UserRole | null> {
  const userDoc = await getDocument<UserDocument>(COLLECTIONS.USERS, uid)
  return userDoc?.role ?? null
}

// ─── Check if user has specific role ──────────────────────────────────────────

export async function hasRole(uid: string, requiredRole: UserRole): Promise<boolean> {
  const role = await getUserRole(uid)
  if (!role) return false
  if (role === 'super_admin') return true // Super admin bypasses all
  return role === requiredRole
}

// ─── Check if user has specific permission ────────────────────────────────────

export async function hasPermission(uid: string, permission: string): Promise<boolean> {
  const role = await getUserRole(uid)
  if (!role) return false
  if (role === 'super_admin') return true

  const permissions = ROLE_PERMISSIONS[role] || []
  return permissions.includes(permission as typeof PERMISSIONS[keyof typeof PERMISSIONS])
}

// ─── Get User Profile (Firestore document) ────────────────────────────────────

export async function getUserProfile(uid: string): Promise<UserDocument | null> {
  return getDocument<UserDocument>(COLLECTIONS.USERS, uid)
}
