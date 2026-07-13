/**
 * Session Management Configuration
 *
 * Centralized configuration for all session-related timeouts.
 * Change values here — they propagate to all session logic.
 */

export const SESSION_CONFIG = {
  /** Inactivity timeout before auto-logout (ms) */
  INACTIVITY_TIMEOUT_MS: 10 * 60 * 1000, // 10 minutes

  /** When to show warning modal (ms after last activity) */
  WARNING_START_MS: 9 * 60 * 1000, // 9 minutes (1 min before logout)

  /** Duration of warning countdown before auto-logout (ms) */
  WARNING_DURATION_MS: 60 * 1000, // 60 seconds

  /** Absolute maximum session duration from login (ms) — NOT resettable */
  ABSOLUTE_TIMEOUT_MS: 30 * 60 * 1000, // 30 minutes

  /** Key for storing login timestamp */
  LOGIN_TIMESTAMP_KEY: 'academia_login_ts',

  /** Key for storing last activity timestamp */
  LAST_ACTIVITY_KEY: 'academia_last_activity',

  /** BroadcastChannel name for multi-tab sync */
  BROADCAST_CHANNEL: 'academia_session',
} as const
