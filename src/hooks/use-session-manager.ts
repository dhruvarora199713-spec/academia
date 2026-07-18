/**
 * useSessionManager — Enterprise Session Management
 *
 * Policy:
 * - Inactivity: warning at 9min, logout at 10min. Activity resets.
 * - Absolute: 30min from login. Cannot be reset. Force logout.
 * - Multi-tab sync: BroadcastChannel + storage events.
 * - Background: recalculates on tab focus.
 */

import { useState, useEffect, useCallback, useRef } from 'react'
import { SESSION_CONFIG } from '@/constants/session'

export interface SessionState {
  showWarning: boolean
  countdown: number
  isExpired: boolean
  expireReason: 'inactivity' | 'absolute' | null
}

interface UseSessionManagerOptions {
  isAuthenticated: boolean
  onLogout: () => Promise<void>
}

export function useSessionManager({ isAuthenticated, onLogout }: UseSessionManagerOptions) {
  const [state, setState] = useState<SessionState>({
    showWarning: false,
    countdown: 0,
    isExpired: false,
    expireReason: null,
  })

  const warningTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const logoutTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const absoluteTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const countdownIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const broadcastRef = useRef<BroadcastChannel | null>(null)
  const isLoggingOutRef = useRef(false)

  // ─── Clear all timers ───────────────────────────────────────────────────────

  const cleanup = useCallback(() => {
    if (warningTimerRef.current) { clearTimeout(warningTimerRef.current); warningTimerRef.current = null }
    if (logoutTimerRef.current) { clearTimeout(logoutTimerRef.current); logoutTimerRef.current = null }
    if (absoluteTimerRef.current) { clearTimeout(absoluteTimerRef.current); absoluteTimerRef.current = null }
    if (countdownIntervalRef.current) { clearInterval(countdownIntervalRef.current); countdownIntervalRef.current = null }
  }, [])

  // ─── Perform Logout ─────────────────────────────────────────────────────────

  const performLogout = useCallback(async (reason: 'inactivity' | 'absolute') => {
    if (isLoggingOutRef.current) return
    isLoggingOutRef.current = true

    cleanup()
    setState({ showWarning: false, countdown: 0, isExpired: true, expireReason: reason })

    // Broadcast to other tabs
    try { broadcastRef.current?.postMessage({ type: 'logout', reason }) } catch {}

    // Clear session metadata
    try {
      localStorage.removeItem(SESSION_CONFIG.LOGIN_TIMESTAMP_KEY)
      localStorage.removeItem(SESSION_CONFIG.LAST_ACTIVITY_KEY)
    } catch {}

    await onLogout()
  }, [onLogout, cleanup])

  // ─── Start Warning Countdown ────────────────────────────────────────────────

  const startWarningCountdown = useCallback(() => {
    if (isLoggingOutRef.current) return

    const seconds = Math.floor(SESSION_CONFIG.WARNING_DURATION_MS / 1000)
    setState((s) => ({ ...s, showWarning: true, countdown: seconds, expireReason: 'inactivity' }))

    let remaining = seconds
    countdownIntervalRef.current = setInterval(() => {
      remaining--
      if (remaining <= 0) {
        performLogout('inactivity')
      } else {
        setState((s) => ({ ...s, countdown: remaining }))
      }
    }, 1000)
  }, [performLogout])

  // ─── Reset Inactivity Timer (activity detected) ─────────────────────────────

  const resetInactivityTimer = useCallback(() => {
    if (!isAuthenticated || isLoggingOutRef.current) return

    // Hide warning if showing (activity dismisses it)
    setState((s) => {
      if (s.showWarning && s.expireReason === 'inactivity') {
        return { ...s, showWarning: false, countdown: 0 }
      }
      return s
    })

    // Clear countdown if running
    if (countdownIntervalRef.current) { clearInterval(countdownIntervalRef.current); countdownIntervalRef.current = null }

    // Clear existing inactivity timers
    if (warningTimerRef.current) { clearTimeout(warningTimerRef.current); warningTimerRef.current = null }
    if (logoutTimerRef.current) { clearTimeout(logoutTimerRef.current); logoutTimerRef.current = null }

    // Store last activity
    try { localStorage.setItem(SESSION_CONFIG.LAST_ACTIVITY_KEY, String(Date.now())) } catch {}

    // Set warning timer (9 minutes)
    warningTimerRef.current = setTimeout(() => {
      startWarningCountdown()
    }, SESSION_CONFIG.WARNING_START_MS)

    // Set hard logout timer (10 minutes) — backup if countdown fails
    logoutTimerRef.current = setTimeout(() => {
      performLogout('inactivity')
    }, SESSION_CONFIG.INACTIVITY_TIMEOUT_MS)
  }, [isAuthenticated, startWarningCountdown, performLogout])

  // ─── Continue Session (only for inactivity warning) ─────────────────────────

  const continueSession = useCallback(() => {
    // Only allow continuing for inactivity — NOT for absolute expiry
    resetInactivityTimer()
  }, [resetInactivityTimer])

  // ─── Start Absolute Timer ───────────────────────────────────────────────────

  const startAbsoluteTimer = useCallback(() => {
    let loginTs = Number(localStorage.getItem(SESSION_CONFIG.LOGIN_TIMESTAMP_KEY) || 0)
    if (!loginTs) {
      loginTs = Date.now()
      try { localStorage.setItem(SESSION_CONFIG.LOGIN_TIMESTAMP_KEY, String(loginTs)) } catch {}
    }

    const elapsed = Date.now() - loginTs
    const remaining = SESSION_CONFIG.ABSOLUTE_TIMEOUT_MS - elapsed

    if (remaining <= 0) {
      performLogout('absolute')
      return
    }

    absoluteTimerRef.current = setTimeout(() => {
      performLogout('absolute')
    }, remaining)
  }, [performLogout])

  // ─── Logout Now (user clicks button) ───────────────────────────────────────

  const logoutNow = useCallback(() => {
    performLogout('inactivity')
  }, [performLogout])

  // ─── Main Effect: Setup & Cleanup ───────────────────────────────────────────

  useEffect(() => {
    if (!isAuthenticated) {
      cleanup()
      isLoggingOutRef.current = false
      setState({ showWarning: false, countdown: 0, isExpired: false, expireReason: null })
      return
    }

    // Activity events (throttled)
    const events = ['mousedown', 'keydown', 'touchstart', 'scroll', 'click', 'mousemove']
    const throttledReset = throttle(resetInactivityTimer, 5000)

    events.forEach((e) => window.addEventListener(e, throttledReset, { passive: true }))

    // Visibility change — recalculate on tab focus
    const handleVisibility = () => {
      if (document.visibilityState === 'visible' && isAuthenticated && !isLoggingOutRef.current) {
        // Check absolute timeout
        const loginTs = Number(localStorage.getItem(SESSION_CONFIG.LOGIN_TIMESTAMP_KEY) || 0)
        if (loginTs && (Date.now() - loginTs) >= SESSION_CONFIG.ABSOLUTE_TIMEOUT_MS) {
          performLogout('absolute')
          return
        }
        // Check inactivity
        const lastActivity = Number(localStorage.getItem(SESSION_CONFIG.LAST_ACTIVITY_KEY) || 0)
        if (lastActivity && (Date.now() - lastActivity) >= SESSION_CONFIG.INACTIVITY_TIMEOUT_MS) {
          performLogout('inactivity')
        } else if (lastActivity && (Date.now() - lastActivity) >= SESSION_CONFIG.WARNING_START_MS) {
          startWarningCountdown()
        } else {
          resetInactivityTimer()
        }
      }
    }
    document.addEventListener('visibilitychange', handleVisibility)

    // Start timers
    resetInactivityTimer()
    startAbsoluteTimer()

    // Multi-tab sync
    try {
      broadcastRef.current = new BroadcastChannel(SESSION_CONFIG.BROADCAST_CHANNEL)
      broadcastRef.current.onmessage = (event) => {
        if (event.data?.type === 'logout') {
          performLogout(event.data.reason || 'inactivity')
        }
      }
    } catch {}

    // Storage event fallback
    const handleStorage = (e: StorageEvent) => {
      if (e.key === SESSION_CONFIG.LOGIN_TIMESTAMP_KEY && e.newValue === null) {
        performLogout('inactivity')
      }
    }
    window.addEventListener('storage', handleStorage)

    return () => {
      events.forEach((e) => window.removeEventListener(e, throttledReset))
      document.removeEventListener('visibilitychange', handleVisibility)
      window.removeEventListener('storage', handleStorage)
      broadcastRef.current?.close()
      broadcastRef.current = null
      cleanup()
    }
  }, [isAuthenticated])

  return {
    ...state,
    continueSession,
    logoutNow,
  }
}

// ─── Throttle ─────────────────────────────────────────────────────────────────

function throttle(fn: () => void, ms: number): () => void {
  let last = 0
  return () => {
    const now = Date.now()
    if (now - last >= ms) { last = now; fn() }
  }
}
