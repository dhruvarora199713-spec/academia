/**
 * Firebase Application Constants
 *
 * WHY: Single source of truth for all Firebase-specific magic strings.
 * Every Firestore query, storage path, and role check references these constants.
 * Prevents typos. Enables refactoring. Makes security rules auditable.
 */

// ─── Firestore Collections ────────────────────────────────────────────────────

export const COLLECTIONS = {
  USERS: 'users',
  STUDENTS: 'students',
  FACULTY: 'faculty',
  DEPARTMENTS: 'departments',
  COURSES: 'courses',
  SUBJECTS: 'subjects',
  ATTENDANCE: 'attendance',
  ASSIGNMENTS: 'assignments',
  SUBMISSIONS: 'submissions',
  RESULTS: 'results',
  EXAMS: 'exams',
  NOTIFICATIONS: 'notifications',
  TICKETS: 'tickets',
  CERTIFICATES: 'certificates',
  ACHIEVEMENTS: 'achievements',
  PLACEMENTS: 'placements',
  INTERNSHIPS: 'internships',
  HOSTEL: 'hostel',
  TRANSPORT: 'transport',
  EVENTS: 'events',
  LIBRARY: 'library',
  FEES: 'fees',
  SCHOLARSHIPS: 'scholarships',
  TIMETABLE: 'timetable',
  ANNOUNCEMENTS: 'announcements',
} as const

// ─── Firestore Sub-collections ────────────────────────────────────────────────

export const SUB_COLLECTIONS = {
  ATTENDANCE_RECORDS: 'records',
  ASSIGNMENT_SUBMISSIONS: 'submissions',
  TICKET_MESSAGES: 'messages',
  STUDENT_ACHIEVEMENTS: 'achievements',
  COURSE_RESOURCES: 'resources',
  FEE_PAYMENTS: 'payments',
} as const

// ─── User Roles ───────────────────────────────────────────────────────────────

export const ROLES = {
  STUDENT: 'student',
  FACULTY: 'faculty',
  HOD: 'hod',
  ADMIN: 'admin',
  SUPER_ADMIN: 'super_admin',
} as const

export type UserRole = typeof ROLES[keyof typeof ROLES]

// ─── Permissions ──────────────────────────────────────────────────────────────

export const PERMISSIONS = {
  // Student permissions
  VIEW_OWN_PROFILE: 'view:own_profile',
  EDIT_OWN_PROFILE: 'edit:own_profile',
  VIEW_ATTENDANCE: 'view:attendance',
  SUBMIT_ASSIGNMENT: 'submit:assignment',
  VIEW_RESULTS: 'view:results',
  VIEW_TIMETABLE: 'view:timetable',
  CREATE_TICKET: 'create:ticket',
  VIEW_PLACEMENTS: 'view:placements',
  APPLY_PLACEMENT: 'apply:placement',

  // Faculty permissions
  MARK_ATTENDANCE: 'mark:attendance',
  CREATE_ASSIGNMENT: 'create:assignment',
  GRADE_ASSIGNMENT: 'grade:assignment',
  POST_ANNOUNCEMENT: 'post:announcement',
  UPLOAD_RESOURCE: 'upload:resource',
  VIEW_STUDENT_PROFILES: 'view:student_profiles',

  // Admin permissions
  MANAGE_USERS: 'manage:users',
  MANAGE_COURSES: 'manage:courses',
  MANAGE_DEPARTMENTS: 'manage:departments',
  VIEW_ANALYTICS: 'view:analytics',
  MANAGE_PLACEMENTS: 'manage:placements',
  MANAGE_HOSTEL: 'manage:hostel',
  MANAGE_TRANSPORT: 'manage:transport',
  MANAGE_FEES: 'manage:fees',

  // Super Admin
  FULL_ACCESS: 'full:access',
} as const

export type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS]

// ─── Role → Permission Mapping ────────────────────────────────────────────────

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [ROLES.STUDENT]: [
    PERMISSIONS.VIEW_OWN_PROFILE,
    PERMISSIONS.EDIT_OWN_PROFILE,
    PERMISSIONS.VIEW_ATTENDANCE,
    PERMISSIONS.SUBMIT_ASSIGNMENT,
    PERMISSIONS.VIEW_RESULTS,
    PERMISSIONS.VIEW_TIMETABLE,
    PERMISSIONS.CREATE_TICKET,
    PERMISSIONS.VIEW_PLACEMENTS,
    PERMISSIONS.APPLY_PLACEMENT,
  ],
  [ROLES.FACULTY]: [
    PERMISSIONS.VIEW_OWN_PROFILE,
    PERMISSIONS.EDIT_OWN_PROFILE,
    PERMISSIONS.MARK_ATTENDANCE,
    PERMISSIONS.CREATE_ASSIGNMENT,
    PERMISSIONS.GRADE_ASSIGNMENT,
    PERMISSIONS.POST_ANNOUNCEMENT,
    PERMISSIONS.UPLOAD_RESOURCE,
    PERMISSIONS.VIEW_STUDENT_PROFILES,
    PERMISSIONS.VIEW_ATTENDANCE,
    PERMISSIONS.VIEW_RESULTS,
  ],
  [ROLES.HOD]: [
    PERMISSIONS.VIEW_OWN_PROFILE,
    PERMISSIONS.EDIT_OWN_PROFILE,
    PERMISSIONS.VIEW_STUDENT_PROFILES,
    PERMISSIONS.VIEW_ANALYTICS,
    PERMISSIONS.MANAGE_COURSES,
    PERMISSIONS.MARK_ATTENDANCE,
    PERMISSIONS.CREATE_ASSIGNMENT,
    PERMISSIONS.GRADE_ASSIGNMENT,
    PERMISSIONS.POST_ANNOUNCEMENT,
    PERMISSIONS.UPLOAD_RESOURCE,
  ],
  [ROLES.ADMIN]: [
    PERMISSIONS.MANAGE_USERS,
    PERMISSIONS.MANAGE_COURSES,
    PERMISSIONS.MANAGE_DEPARTMENTS,
    PERMISSIONS.VIEW_ANALYTICS,
    PERMISSIONS.MANAGE_PLACEMENTS,
    PERMISSIONS.MANAGE_HOSTEL,
    PERMISSIONS.MANAGE_TRANSPORT,
    PERMISSIONS.MANAGE_FEES,
  ],
  [ROLES.SUPER_ADMIN]: [
    PERMISSIONS.FULL_ACCESS,
  ],
}

// ─── Storage Paths ────────────────────────────────────────────────────────────

export const STORAGE_PATHS = {
  AVATARS: 'avatars',
  ASSIGNMENTS: 'assignments',
  SUBMISSIONS: 'submissions',
  RESOURCES: 'resources',
  CERTIFICATES: 'certificates',
  RESUMES: 'resumes',
  DOCUMENTS: 'documents',
} as const

// ─── Auth Providers ───────────────────────────────────────────────────────────

export const AUTH_PROVIDERS = {
  GOOGLE: 'google.com',
  EMAIL: 'password',
} as const
