import { Link, useLocation } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'

const routeLabels: Record<string, string> = {
  '': 'Dashboard', attendance: 'Attendance', subjects: 'Subjects', courses: 'Courses',
  assignments: 'Assignments', projects: 'Projects', calendar: 'Calendar', timetable: 'Timetable',
  exams: 'Exams', results: 'Results', grades: 'Grades', 'cgpa-calculator': 'CGPA Calculator',
  analytics: 'Analytics', performance: 'Performance', library: 'Library', fees: 'Fees',
  scholarships: 'Scholarships', hostel: 'Hostel', transport: 'Transport', placements: 'Placements',
  internships: 'Internships', certificates: 'Certificates', achievements: 'Achievements',
  profile: 'Profile', faculty: 'Faculty Directory', events: 'Events', notifications: 'Notifications',
  settings: 'Settings', support: 'Support', help: 'Help Center', about: 'About', privacy: 'Privacy',
}

export function Breadcrumbs() {
  const location = useLocation()
  const segments = location.pathname.split('/').filter(Boolean)

  if (segments.length === 0) {
    return (
      <div className="flex items-center gap-1.5 text-sm">
        <Home className="h-3.5 w-3.5 text-neutral-400" />
        <span className="font-medium text-neutral-700">Dashboard</span>
      </div>
    )
  }

  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex items-center gap-1.5 text-sm">
        <li>
          <Link to="/" className="text-neutral-400 hover:text-neutral-600"><Home className="h-3.5 w-3.5" /></Link>
        </li>
        {segments.map((seg, i) => {
          const isLast = i === segments.length - 1
          const href = '/' + segments.slice(0, i + 1).join('/')
          const label = routeLabels[seg] || seg.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
          return (
            <li key={href} className="flex items-center gap-1.5">
              <ChevronRight className="h-3 w-3 text-neutral-300" />
              {isLast ? <span className="font-medium text-neutral-700">{label}</span> : <Link to={href} className="text-neutral-400 hover:text-neutral-600">{label}</Link>}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
