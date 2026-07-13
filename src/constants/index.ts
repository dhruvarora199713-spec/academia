export const APP_NAME = 'Academia'
export const APP_TAGLINE = 'A Next Generation University Experience Platform'
export const APP_VERSION = '1.0.0'

export const ROUTES = {
  DASHBOARD: '/',
  ATTENDANCE: '/attendance',
  SUBJECTS: '/subjects',
  COURSES: '/courses',
  ASSIGNMENTS: '/assignments',
  PROJECTS: '/projects',
  CALENDAR: '/calendar',
  TIMETABLE: '/timetable',
  EXAMS: '/exams',
  RESULTS: '/results',
  CGPA: '/cgpa-calculator',
  PERFORMANCE_ANALYTICS: '/analytics/performance',
  LIBRARY: '/library',
  FEES: '/fees',
  SCHOLARSHIPS: '/scholarships',
  HOSTEL: '/hostel',
  TRANSPORT: '/transport',
  PLACEMENTS: '/placements',
  INTERNSHIPS: '/internships',
  CERTIFICATES: '/certificates',
  ACHIEVEMENTS: '/achievements',
  PROFILE: '/profile',
  NOTIFICATIONS: '/notifications',
  SETTINGS: '/settings',
  SUPPORT: '/support',
  HELP: '/help',
  ABOUT: '/about',
  PRIVACY: '/privacy',
} as const

export const DEFAULT_PAGE_SIZE = 10
export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100]

export const ANIMATION = {
  FAST: 150,
  BASE: 200,
  SLOW: 300,
  SLOWER: 500,
  PAGE_TRANSITION: 400,
} as const

export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
} as const
