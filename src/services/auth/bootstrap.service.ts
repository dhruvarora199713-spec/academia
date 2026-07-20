/**
 * User Bootstrap Service — Performance Optimized
 *
 * Single Firestore read per auth state change:
 * - Existing user: 1 getDoc → returns the doc
 * - New user: 1 getDoc (miss) + 1 setDoc → returns the new doc
 *
 * Previously: bootstrap did 1 getDoc, then AuthContext did ANOTHER getDoc.
 * Now: bootstrap returns what it already fetched.
 */

import type { User } from 'firebase/auth'
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/firebase/config'
import { COLLECTIONS, ROLES } from '@/firebase/constants'
import { logger } from '@/services/firebase/error.service'
import type { UserDocument } from '@/types/firebase/schema'

export async function bootstrapAndGetProfile(firebaseUser: User): Promise<UserDocument | null> {
  try {
    const userRef = doc(db, COLLECTIONS.USERS, firebaseUser.uid)
    const userSnap = await getDoc(userRef)

    // Existing user — return immediately (1 read total)
    if (userSnap.exists()) {
      return { id: userSnap.id, ...userSnap.data() } as UserDocument
    }

    // New user — create doc then return it (1 read + 1 write)
    const newUser = {
      id: firebaseUser.uid,
      uid: firebaseUser.uid,
      email: firebaseUser.email || '',
      displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
      photoURL: firebaseUser.photoURL || null,
      role: ROLES.STUDENT,
      isActive: true,
      lastLoginAt: serverTimestamp(),
      preferences: {
        notifications: true,
        emailDigest: true,
        language: 'en',
        timezone: 'Asia/Kolkata',
      },
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }

    await setDoc(userRef, newUser)
    logger.info('Bootstrap: Created new user document', { uid: firebaseUser.uid })

    // Return the doc we just created (avoid another read)
    return newUser as unknown as UserDocument
  } catch (err) {
    logger.warn('Bootstrap: Could not access Firestore', err)
    return null
  }
}
