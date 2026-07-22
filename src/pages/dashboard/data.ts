// ─── Student Profile ──────────────────────────────────────────────────────────

export const studentProfile = {
  name: 'Dhruv Arora',
  firstName: 'Dhruv',
  rollNo: 'CSE21045',
  branch: 'Computer Science & Engineering',
  semester: 6,
  section: 'A',
  batch: '2021-2025',
  advisor: 'Dr. Priya Sharma',
}

// ─── Academic Stats ───────────────────────────────────────────────────────────

export const academicStats = {
  attendance: {
    current: 87.5,
    trend: '+2.1%',
    trendUp: true,
    classesAttended: 142,
    totalClasses: 162,
  },
  cgpa: {
    current: 8.74,
    trend: '+0.12',
    trendUp: true,
    previousSemester: 8.62,
  },
  credits: {
    completed: 132,
    total: 180,
    thisSemester: 24,
  },
  subjects: {
    current: 6,
    labs: 2,
  },
}

// ─── Monthly Attendance Data (for Line Chart) ────────────────────────────────

export const attendanceChartData = [
  { month: 'Aug', attendance: 92, target: 85 },
  { month: 'Sep', attendance: 88, target: 85 },
  { month: 'Oct', attendance: 85, target: 85 },
  { month: 'Nov', attendance: 82, target: 85 },
  { month: 'Dec', attendance: 90, target: 85 },
  { month: 'Jan', attendance: 87, target: 85 },
  { month: 'Feb', attendance: 91, target: 85 },
  { month: 'Mar', attendance: 86, target: 85 },
  { month: 'Apr', attendance: 89, target: 85 },
  { month: 'May', attendance: 88, target: 85 },
]

// ─── Semester CGPA Data (for Bar Chart) ──────────────────────────────────────

export const cgpaChartData = [
  { semester: 'Sem 1', cgpa: 8.2, sgpa: 8.2 },
  { semester: 'Sem 2', cgpa: 8.35, sgpa: 8.5 },
  { semester: 'Sem 3', cgpa: 8.48, sgpa: 8.7 },
  { semester: 'Sem 4', cgpa: 8.56, sgpa: 8.8 },
  { semester: 'Sem 5', cgpa: 8.62, sgpa: 8.9 },
  { semester: 'Sem 6', cgpa: 8.74, sgpa: 9.1 },
]

// ─── Today's Schedule ─────────────────────────────────────────────────────────

export const todaySchedule = [
  {
    id: '1',
    time: '9:00 AM',
    endTime: '10:00 AM',
    title: 'Data Structures & Algorithms',
    professor: 'Dr. Rajesh Kumar',
    location: 'Room 301, Block A',
    type: 'lecture' as const,
    status: 'completed' as const,
  },
  {
    id: '2',
    time: '10:15 AM',
    endTime: '11:15 AM',
    title: 'Computer Networks',
    professor: 'Prof. Anita Desai',
    location: 'Room 204, Block B',
    type: 'lecture' as const,
    status: 'completed' as const,
  },
  {
    id: '3',
    time: '11:30 AM',
    endTime: '12:30 PM',
    title: 'Operating Systems',
    professor: 'Dr. Vikram Singh',
    location: 'Room 102, Block A',
    type: 'lecture' as const,
    status: 'ongoing' as const,
  },
  {
    id: '4',
    time: '2:00 PM',
    endTime: '4:00 PM',
    title: 'DBMS Lab',
    professor: 'Prof. Meera Patel',
    location: 'Lab 201, Block C',
    type: 'lab' as const,
    status: 'upcoming' as const,
  },
  {
    id: '5',
    time: '4:15 PM',
    endTime: '5:15 PM',
    title: 'Software Engineering',
    professor: 'Dr. Suresh Menon',
    location: 'Room 305, Block A',
    type: 'lecture' as const,
    status: 'upcoming' as const,
  },
]

// ─── Upcoming Deadlines ───────────────────────────────────────────────────────

export const upcomingDeadlines = [
  {
    id: '1',
    title: 'OS Process Scheduling Assignment',
    subject: 'Operating Systems',
    dueDate: '2026-07-09T23:59:00',
    type: 'assignment' as const,
    priority: 'high' as const,
  },
  {
    id: '2',
    title: 'Mini Project: REST API Design',
    subject: 'Software Engineering',
    dueDate: '2026-07-12T23:59:00',
    type: 'project' as const,
    priority: 'high' as const,
  },
  {
    id: '3',
    title: 'CN Lab Report - Week 8',
    subject: 'Computer Networks',
    dueDate: '2026-07-14T17:00:00',
    type: 'lab-report' as const,
    priority: 'medium' as const,
  },
  {
    id: '4',
    title: 'DSA Practice Problems Set 5',
    subject: 'Data Structures & Algorithms',
    dueDate: '2026-07-15T23:59:00',
    type: 'assignment' as const,
    priority: 'low' as const,
  },
  {
    id: '5',
    title: 'Mid-Semester Exam Preparation',
    subject: 'All Subjects',
    dueDate: '2026-07-20T09:00:00',
    type: 'exam' as const,
    priority: 'high' as const,
  },
]

// ─── Recent Activities ────────────────────────────────────────────────────────

export const recentActivities = [
  {
    id: '1',
    action: 'Submitted assignment',
    description: 'CN Lab Report - Week 7',
    time: '2 hours ago',
    type: 'submission' as const,
  },
  {
    id: '2',
    action: 'Attendance marked',
    description: 'Data Structures & Algorithms',
    time: '4 hours ago',
    type: 'attendance' as const,
  },
  {
    id: '3',
    action: 'Grade received',
    description: 'DBMS Assignment 3 — A+ (95/100)',
    time: '1 day ago',
    type: 'grade' as const,
  },
  {
    id: '4',
    action: 'Registered for event',
    description: 'Tech Talk: Cloud Computing with AWS',
    time: '2 days ago',
    type: 'event' as const,
  },
  {
    id: '5',
    action: 'Library book returned',
    description: 'Introduction to Algorithms (CLRS)',
    time: '3 days ago',
    type: 'library' as const,
  },
  {
    id: '6',
    action: 'Fee payment received',
    description: 'Semester 6 Tuition Fee — ₹87,500',
    time: '5 days ago',
    type: 'payment' as const,
  },
]

// ─── Quick Actions ────────────────────────────────────────────────────────────

export const quickActions = [
  { id: '1', label: 'Mark Attendance', href: '/attendance', iconName: 'CalendarCheck' as const },
  { id: '2', label: 'View Assignments', href: '/assignments', iconName: 'FileText' as const },
  { id: '3', label: 'Check Results', href: '/results', iconName: 'Award' as const },
  { id: '4', label: 'CGPA Calculator', href: '/cgpa-calculator', iconName: 'Calculator' as const },
  { id: '5', label: 'View Timetable', href: '/timetable', iconName: 'Clock' as const },
  { id: '6', label: 'Library Search', href: '/library', iconName: 'Library' as const },
]

// ─── Upcoming Events ──────────────────────────────────────────────────────────

export const upcomingEvents = [
  {
    id: '1',
    title: 'Tech Talk: Cloud Computing',
    date: '2026-07-10',
    time: '4:00 PM',
    location: 'Auditorium',
    type: 'tech-talk' as const,
  },
  {
    id: '2',
    title: 'Hackathon: Build for India',
    date: '2026-07-15',
    time: '9:00 AM',
    location: 'Innovation Center',
    type: 'hackathon' as const,
  },
  {
    id: '3',
    title: 'Campus Placement Drive',
    date: '2026-07-22',
    time: '10:00 AM',
    location: 'Placement Cell',
    type: 'placement' as const,
  },
]
