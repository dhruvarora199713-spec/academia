import type { LucideIcon } from 'lucide-react'
import {
  LayoutDashboard, CalendarCheck, BookOpen, FileText,
  FolderKanban, Calendar, Clock, ClipboardList, Award,
  Calculator, LineChart, Library, CreditCard, Gift,
  Building2, Bus, Briefcase, Building, Medal, Trophy, User,
  Bell, Settings, HelpCircle, MessageSquare, Info, Shield,
} from 'lucide-react'
import { ROUTES } from '@/constants'

export interface NavItem {
  title: string
  href: string
  icon: LucideIcon
  badge?: string | number
  disabled?: boolean
}

export interface NavGroup {
  title: string
  items: NavItem[]
}

export const navigationConfig: NavGroup[] = [
  {
    title: 'Overview',
    items: [
      { title: 'Dashboard', href: ROUTES.DASHBOARD, icon: LayoutDashboard },
    ],
  },
  {
    title: 'Academics',
    items: [
      { title: 'Subjects', href: ROUTES.SUBJECTS, icon: BookOpen },
      { title: 'Attendance', href: ROUTES.ATTENDANCE, icon: CalendarCheck },
      { title: 'Assignments', href: ROUTES.ASSIGNMENTS, icon: FileText, badge: 3 },
      { title: 'Timetable', href: ROUTES.TIMETABLE, icon: Clock },
      { title: 'Calendar', href: ROUTES.CALENDAR, icon: Calendar },
    ],
  },
  {
    title: 'Examinations',
    items: [
      { title: 'Exams', href: ROUTES.EXAMS, icon: ClipboardList },
      { title: 'Results', href: ROUTES.RESULTS, icon: Award },
      { title: 'CGPA Calculator', href: ROUTES.CGPA, icon: Calculator },
    ],
  },
  {
    title: 'Analytics',
    items: [
      { title: 'Performance', href: ROUTES.PERFORMANCE_ANALYTICS, icon: LineChart },
    ],
  },
  {
    title: 'Campus',
    items: [
      { title: 'Library', href: ROUTES.LIBRARY, icon: Library },
      { title: 'Fees', href: ROUTES.FEES, icon: CreditCard },
      { title: 'Scholarships', href: ROUTES.SCHOLARSHIPS, icon: Gift },
      { title: 'Hostel', href: ROUTES.HOSTEL, icon: Building2 },
      { title: 'Transport', href: ROUTES.TRANSPORT, icon: Bus },
    ],
  },
  {
    title: 'Career',
    items: [
      { title: 'Placements', href: ROUTES.PLACEMENTS, icon: Briefcase },
      { title: 'Internships', href: ROUTES.INTERNSHIPS, icon: Building },
      { title: 'Projects', href: '/projects', icon: FolderKanban },
      { title: 'Certificates', href: ROUTES.CERTIFICATES, icon: Medal },
      { title: 'Achievements', href: ROUTES.ACHIEVEMENTS, icon: Trophy },
    ],
  },
  {
    title: 'Account',
    items: [
      { title: 'Profile', href: ROUTES.PROFILE, icon: User },
      { title: 'Notifications', href: ROUTES.NOTIFICATIONS, icon: Bell, badge: 5 },
      { title: 'Settings', href: ROUTES.SETTINGS, icon: Settings },
    ],
  },
  {
    title: 'Support',
    items: [
      { title: 'Help Center', href: ROUTES.HELP, icon: HelpCircle },
      { title: 'Support', href: ROUTES.SUPPORT, icon: MessageSquare },
      { title: 'About', href: ROUTES.ABOUT, icon: Info },
      { title: 'Privacy', href: ROUTES.PRIVACY, icon: Shield },
    ],
  },
]
