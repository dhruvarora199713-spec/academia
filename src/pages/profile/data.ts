// ─── Student Profile — Central Entity ─────────────────────────────────────────
// This is the single source of truth for the student's identity.
// All other modules reference this data.

export interface StudentProfile {
  personal: PersonalInfo
  academic: AcademicInfo
  contact: ContactInfo
  parents: ParentInfo
  emergency: EmergencyContact
  skills: Skill[]
  certifications: Certification[]
  achievements: Achievement[]
  projects: Project[]
  resume: ResumeInfo
  stats: AcademicStats
  activities: Activity[]
}

// ─── Sub-Types ────────────────────────────────────────────────────────────────

export interface PersonalInfo {
  firstName: string
  lastName: string
  fullName: string
  avatar: string | null
  dateOfBirth: string
  gender: string
  bloodGroup: string
  nationality: string
  religion: string
  category: string
  aadharNumber: string
  languages: string[]
}

export interface AcademicInfo {
  rollNumber: string
  registrationNumber: string
  branch: string
  department: string
  program: string
  semester: number
  section: string
  batch: string
  admissionYear: number
  admissionType: string
  advisor: string
  advisorEmail: string
}

export interface ContactInfo {
  email: string
  personalEmail: string
  phone: string
  alternatePhone: string
  currentAddress: string
  permanentAddress: string
  city: string
  state: string
  pincode: string
  country: string
}

export interface ParentInfo {
  father: {
    name: string
    occupation: string
    phone: string
    email: string
  }
  mother: {
    name: string
    occupation: string
    phone: string
    email: string
  }
  guardian?: {
    name: string
    relation: string
    phone: string
    email: string
  }
}

export interface EmergencyContact {
  name: string
  relation: string
  phone: string
  alternatePhone: string
  address: string
}

export interface Skill {
  id: string
  name: string
  category: 'language' | 'framework' | 'tool' | 'soft-skill' | 'database'
  proficiency: 'beginner' | 'intermediate' | 'advanced' | 'expert'
}

export interface Certification {
  id: string
  title: string
  issuer: string
  issueDate: string
  expiryDate?: string
  credentialId: string
  credentialUrl?: string
  verified: boolean
}

export interface Achievement {
  id: string
  title: string
  description: string
  date: string
  type: 'academic' | 'sports' | 'cultural' | 'technical' | 'leadership'
  level: 'university' | 'state' | 'national' | 'international'
}

export interface Project {
  id: string
  title: string
  description: string
  techStack: string[]
  startDate: string
  endDate?: string
  status: 'completed' | 'in-progress' | 'planned'
  repoUrl?: string
  liveUrl?: string
  teamSize: number
}

export interface ResumeInfo {
  fileName: string
  fileSize: string
  lastUpdated: string
  downloadUrl: string
}

export interface AcademicStats {
  cgpa: number
  sgpa: number
  attendance: number
  creditsCompleted: number
  creditsTotal: number
  semesterRank: number
  batchStrength: number
  backlogs: number
  totalBacklogs: number
}

export interface Activity {
  id: string
  action: string
  description: string
  timestamp: string
  type: 'academic' | 'submission' | 'achievement' | 'event' | 'library' | 'admin'
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

export const studentData: StudentProfile = {
  personal: {
    firstName: 'Dhruv',
    lastName: 'Arora',
    fullName: 'Dhruv Kumar Arora',
    avatar: null,
    dateOfBirth: '2003-04-15',
    gender: 'Male',
    bloodGroup: 'B+',
    nationality: 'Indian',
    religion: 'Hindu',
    category: 'General',
    aadharNumber: 'XXXX-XXXX-4829',
    languages: ['English', 'Hindi', 'Punjabi'],
  },

  academic: {
    rollNumber: 'CSE21045',
    registrationNumber: 'UNI/2021/CSE/045',
    branch: 'Computer Science & Engineering',
    department: 'School of Computing',
    program: 'B.Tech',
    semester: 6,
    section: 'A',
    batch: '2021–2025',
    admissionYear: 2021,
    admissionType: 'JEE Mains',
    advisor: 'Dr. Priya Sharma',
    advisorEmail: 'priya.sharma@university.edu',
  },

  contact: {
    email: 'dhruv.arora@university.edu',
    personalEmail: 'dhruvarora.dev@gmail.com',
    phone: '+91 98765 43210',
    alternatePhone: '+91 87654 32109',
    currentAddress: 'Room 214, Hostel Block C, University Campus',
    permanentAddress: '42, Rajendra Nagar, Sector 15',
    city: 'Chandigarh',
    state: 'Punjab',
    pincode: '160015',
    country: 'India',
  },

  parents: {
    father: {
      name: 'Rajesh Kumar Arora',
      occupation: 'Senior Manager, State Bank of India',
      phone: '+91 98123 45678',
      email: 'rajesh.arora@gmail.com',
    },
    mother: {
      name: 'Sunita Arora',
      occupation: 'Principal, DPS School',
      phone: '+91 97654 32100',
      email: 'sunita.arora@gmail.com',
    },
  },

  emergency: {
    name: 'Rajesh Kumar Arora',
    relation: 'Father',
    phone: '+91 98123 45678',
    alternatePhone: '+91 97654 32100',
    address: '42, Rajendra Nagar, Sector 15, Chandigarh, Punjab - 160015',
  },

  skills: [
    { id: '1', name: 'TypeScript', category: 'language', proficiency: 'advanced' },
    { id: '2', name: 'Python', category: 'language', proficiency: 'advanced' },
    { id: '3', name: 'Java', category: 'language', proficiency: 'intermediate' },
    { id: '4', name: 'C++', category: 'language', proficiency: 'intermediate' },
    { id: '5', name: 'React', category: 'framework', proficiency: 'expert' },
    { id: '6', name: 'Next.js', category: 'framework', proficiency: 'advanced' },
    { id: '7', name: 'Node.js', category: 'framework', proficiency: 'advanced' },
    { id: '8', name: 'Django', category: 'framework', proficiency: 'intermediate' },
    { id: '9', name: 'PostgreSQL', category: 'database', proficiency: 'advanced' },
    { id: '10', name: 'MongoDB', category: 'database', proficiency: 'intermediate' },
    { id: '11', name: 'Redis', category: 'database', proficiency: 'beginner' },
    { id: '12', name: 'Docker', category: 'tool', proficiency: 'intermediate' },
    { id: '13', name: 'Git', category: 'tool', proficiency: 'expert' },
    { id: '14', name: 'AWS', category: 'tool', proficiency: 'intermediate' },
    { id: '15', name: 'Figma', category: 'tool', proficiency: 'intermediate' },
    { id: '16', name: 'Problem Solving', category: 'soft-skill', proficiency: 'advanced' },
    { id: '17', name: 'Team Leadership', category: 'soft-skill', proficiency: 'advanced' },
    { id: '18', name: 'Communication', category: 'soft-skill', proficiency: 'advanced' },
  ],

  certifications: [
    {
      id: '1',
      title: 'AWS Certified Cloud Practitioner',
      issuer: 'Amazon Web Services',
      issueDate: '2025-08-20',
      expiryDate: '2028-08-20',
      credentialId: 'AWS-CCP-2025-DKA',
      credentialUrl: 'https://aws.amazon.com/verify',
      verified: true,
    },
    {
      id: '2',
      title: 'Meta Front-End Developer Professional Certificate',
      issuer: 'Meta (via Coursera)',
      issueDate: '2025-03-10',
      credentialId: 'META-FE-2025-DKA',
      credentialUrl: 'https://coursera.org/verify',
      verified: true,
    },
    {
      id: '3',
      title: 'Google Data Analytics Certificate',
      issuer: 'Google (via Coursera)',
      issueDate: '2024-11-05',
      credentialId: 'GDA-2024-DKA',
      credentialUrl: 'https://coursera.org/verify',
      verified: true,
    },
    {
      id: '4',
      title: 'HackerRank Problem Solving (Advanced)',
      issuer: 'HackerRank',
      issueDate: '2025-01-15',
      credentialId: 'HR-PSA-2025-DKA',
      verified: true,
    },
  ],

  achievements: [
    {
      id: '1',
      title: 'Smart India Hackathon — Winner',
      description: 'Built an AI-powered exam proctoring system. Led a team of 6 developers and presented to AICTE panel.',
      date: '2025-12-15',
      type: 'technical',
      level: 'national',
    },
    {
      id: '2',
      title: 'Dean\'s List — Academic Excellence',
      description: 'Recognized for maintaining CGPA above 9.0 for three consecutive semesters.',
      date: '2025-06-30',
      type: 'academic',
      level: 'university',
    },
    {
      id: '3',
      title: 'ACM ICPC Regionalist',
      description: 'Qualified for ICPC Asia Amritapuri Regional. Team ranked 87th out of 2400+ teams.',
      date: '2025-11-20',
      type: 'technical',
      level: 'international',
    },
    {
      id: '4',
      title: 'Best Paper Award — IEEE Conference',
      description: 'Published research on "Optimizing Database Query Performance using ML" at IEEE ICCS 2025.',
      date: '2025-09-10',
      type: 'academic',
      level: 'international',
    },
    {
      id: '5',
      title: 'University Cricket Team Captain',
      description: 'Led the university cricket team to inter-university tournament semi-finals.',
      date: '2025-02-28',
      type: 'sports',
      level: 'state',
    },
  ],

  projects: [
    {
      id: '1',
      title: 'Academia — University Platform',
      description: 'A next-generation university experience platform with real-time attendance, analytics dashboard, and AI-powered study recommendations.',
      techStack: ['React', 'TypeScript', 'Tailwind CSS', 'Node.js', 'PostgreSQL'],
      startDate: '2026-01-10',
      status: 'in-progress',
      repoUrl: 'https://github.com/dhruvarora/academia',
      teamSize: 1,
    },
    {
      id: '2',
      title: 'ProctorAI — Exam Proctoring System',
      description: 'AI-based exam proctoring with face detection, gaze tracking, and anomaly detection. Won Smart India Hackathon 2025.',
      techStack: ['Python', 'TensorFlow', 'OpenCV', 'Flask', 'WebRTC'],
      startDate: '2025-09-01',
      endDate: '2025-12-15',
      status: 'completed',
      repoUrl: 'https://github.com/dhruvarora/proctorai',
      liveUrl: 'https://proctorai.demo.dev',
      teamSize: 6,
    },
    {
      id: '3',
      title: 'QueryOpt — ML Database Optimizer',
      description: 'Machine learning model that predicts and optimizes slow database queries. Published at IEEE ICCS 2025.',
      techStack: ['Python', 'scikit-learn', 'PostgreSQL', 'FastAPI'],
      startDate: '2025-05-01',
      endDate: '2025-09-10',
      status: 'completed',
      repoUrl: 'https://github.com/dhruvarora/queryopt',
      teamSize: 3,
    },
    {
      id: '4',
      title: 'CampusConnect — Social Platform',
      description: 'Anonymous campus social network with real-time chat, event discovery, and marketplace for students.',
      techStack: ['Next.js', 'Socket.io', 'MongoDB', 'Redis', 'AWS S3'],
      startDate: '2025-01-15',
      endDate: '2025-06-30',
      status: 'completed',
      repoUrl: 'https://github.com/dhruvarora/campusconnect',
      liveUrl: 'https://campusconnect.live',
      teamSize: 4,
    },
  ],

  resume: {
    fileName: 'Dhruv_Arora_Resume_2026.pdf',
    fileSize: '245 KB',
    lastUpdated: '2026-06-28',
    downloadUrl: '/assets/resume.pdf',
  },

  stats: {
    cgpa: 8.74,
    sgpa: 9.1,
    attendance: 87.5,
    creditsCompleted: 132,
    creditsTotal: 180,
    semesterRank: 12,
    batchStrength: 240,
    backlogs: 0,
    totalBacklogs: 0,
  },

  activities: [
    { id: '1', action: 'Assignment submitted', description: 'OS Process Scheduling — 92/100', timestamp: '2026-07-07T14:30:00', type: 'submission' },
    { id: '2', action: 'Certificate earned', description: 'AWS Certified Cloud Practitioner', timestamp: '2026-07-05T10:00:00', type: 'achievement' },
    { id: '3', action: 'Event registered', description: 'Tech Talk: Cloud Computing with AWS', timestamp: '2026-07-04T16:45:00', type: 'event' },
    { id: '4', action: 'Grade received', description: 'DBMS Lab Assignment 4 — A+ (97/100)', timestamp: '2026-07-03T09:15:00', type: 'academic' },
    { id: '5', action: 'Book issued', description: 'Computer Networks by Tanenbaum (5th Ed.)', timestamp: '2026-07-01T11:30:00', type: 'library' },
    { id: '6', action: 'Profile updated', description: 'Added new certification: AWS CCP', timestamp: '2026-06-30T18:00:00', type: 'admin' },
    { id: '7', action: 'Project milestone', description: 'Academia — Completed Dashboard module', timestamp: '2026-06-28T20:15:00', type: 'submission' },
    { id: '8', action: 'Attendance marked', description: 'Data Structures — Present (142/162)', timestamp: '2026-06-27T09:05:00', type: 'academic' },
  ],
}
