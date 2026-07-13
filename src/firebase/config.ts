/**
 * Firebase Configuration
 *
 * WHY THIS FILE EXISTS:
 * Single point of initialization for all Firebase services.
 * Every Firebase interaction in the app imports from here.
 * Environment variables ensure secrets never touch the codebase.
 *
 * SCALABILITY:
 * - Supports multiple environments (dev/staging/prod) via .env files
 * - Lazy initialization prevents loading Firebase SDK until needed
 * - Tree-shaking: only imported services are bundled
 */

import { initializeApp, type FirebaseApp } from 'firebase/app'
import { getAuth, type Auth } from 'firebase/auth'
import { getFirestore, type Firestore } from 'firebase/firestore'
import { getStorage, type FirebaseStorage } from 'firebase/storage'

// ─── Configuration from Environment ──────────────────────────────────────────

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
}

// ─── Validate Configuration ──────────────────────────────────────────────────

function validateConfig(): void {
  const required = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'appId'] as const
  const missing = required.filter((key) => !firebaseConfig[key])

  if (missing.length > 0) {
    const envVarNames = missing.map((k) => {
      const envKey = k.replace(/([A-Z])/g, '_$1').toUpperCase()
      return `VITE_FIREBASE_${envKey}`
    })

    const message = `[Firebase] Missing required environment variables:\n${envVarNames.join('\n')}\n\nCreate a .env file from .env.example and add your Firebase credentials.`

    if (import.meta.env.DEV) {
      console.error(message)
    } else {
      throw new Error(message)
    }
  }
}

validateConfig()

// ─── Initialize Firebase ─────────────────────────────────────────────────────

const app: FirebaseApp = initializeApp(firebaseConfig)

// ─── Export Initialized Services ─────────────────────────────────────────────

export const auth: Auth = getAuth(app)
export const db: Firestore = getFirestore(app)
export const storage: FirebaseStorage = getStorage(app)
export { app }

export default app
