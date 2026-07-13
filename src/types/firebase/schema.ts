/**
 * Firestore Database Schema — Complete Type Definitions
 *
 * WHY: These interfaces define the exact shape of every Firestore document.
 * They serve as the contract between frontend and database.
 * When the backend is implemented, these types ensure type-safe reads/writes.
 *
 * SCALABILITY:
 * - Each collection is independently scalable
 * - References use document IDs (not nested objects) for denormalization
 * - Timestamps are Firestore server timestamps
 * - Arrays are bounded (Firestore limit: 1MB per document)
 */

import type { UserRole } from '@/firebase/constants'

// ─── Base Types ───────────────────────────────────────────────────────────────

export interface FirestoreTimestamp {
  seconds: number
  nanoseconds: number
}

export interface BaseDocument {
  id: string
  createdAt: FirestoreTimestamp
  updatedAt: FirestoreTimestamp
}

// ─── Users Collection ─────────────────────────────────────────────────────────

export interface UserDocument extends BaseDocument {
  uid: string
  email: string
  displayName: string
  photoURL: string | null
  role: UserRole
  isActive: boolean
  lastLoginAt: FirestoreTimestamp | null
  studentId?: string  // Reference to students collection
  facultyId?: string  // Reference to faculty collection
  preferences: UserPreferences
}

export interface UserPreferences {
  notifications: boolean
  emailDigest: boolean
  language: string
  timezone: string
}

// ─── Students Collection ──────────────────────────────────────────────────────

export interface StudentDocument extends BaseDocument {
  userId: string  // Reference to users collection
  rollNumber: string
  registrationNumber: string
  firstName: string
  lastName: string
  fullName: string
  dateOfBirth: string
  gender: string
  bloodGroup: string
  nationality: string
  phone: string
  personalEmail: string
  avatar: string | null

  // Academic
  departmentId: string
  program: string
  branch: string
  semester: number
  section: string
  batch: string
  admissionYear: number
  admissionType: string
  advisorId: string

  // Contact
  currentAddress: string
  permanentAddress: string
  city: string
  state: string
  pincode: string

  // Parents
  fatherName: string
  fatherPhone: string
  fatherEmail: string
  fatherOccupation: string
  motherName: string
  motherPhone: string
  motherEmail: string
  motherOccupation: string

  // Emergency
  emergencyContactName: string
  emergencyContactPhone: string
  emergencyContactRelation: string

  // Academic stats (denormalized for fast reads)
  cgpa: number
  totalCredits: number
  attendance: number
}

// ─── Faculty Collection ───────────────────────────────────────────────────────

export interface FacultyDocument extends BaseDocument {
  userId: string
  name: string
  designation: string
  departmentId: string
  email: string
  phone: string
  cabin: string
  officeHours: string
  specialization: string[]
  qualifications: string[]
  avatar: string | null
}

// ─── Departments Collection ───────────────────────────────────────────────────

export interface DepartmentDocument extends BaseDocument {
  name: string
  code: string
  hodId: string
  facultyIds: string[]
  description: string
}

// ─── Courses/Subjects Collection ──────────────────────────────────────────────

export interface CourseDocument extends BaseDocument {
  name: string
  code: string
  credits: number
  semester: number
  departmentId: string
  facultyId: string
  category: 'core' | 'elective' | 'lab'
  description: string
  schedule: CourseSchedule[]
  syllabus: string[]
  maxStudents: number
  enrolledStudents: string[]  // Student IDs
}

export interface CourseSchedule {
  day: string
  startTime: string
  endTime: string
  room: string
  type: 'lecture' | 'lab' | 'tutorial'
}

// ─── Attendance Collection ────────────────────────────────────────────────────

export interface AttendanceDocument extends BaseDocument {
  courseId: string
  studentId: string
  date: string
  status: 'present' | 'absent' | 'late' | 'excused'
  markedBy: string  // Faculty ID
  topic: string
  sessionType: 'lecture' | 'lab' | 'tutorial'
}

// ─── Assignments Collection ───────────────────────────────────────────────────

export interface AssignmentDocument extends BaseDocument {
  courseId: string
  facultyId: string
  title: string
  description: string
  instructions: string
  dueDate: FirestoreTimestamp
  assignedDate: FirestoreTimestamp
  maxMarks: number
  weightage: number
  type: 'assignment' | 'lab-report' | 'project' | 'quiz'
  submissionType: 'online' | 'offline' | 'code' | 'report'
  attachments: FileAttachment[]
  rubric: RubricItem[]
  isPublished: boolean
}

export interface FileAttachment {
  name: string
  url: string
  size: number
  type: string
  uploadedAt: FirestoreTimestamp
}

export interface RubricItem {
  criterion: string
  maxScore: number
  description: string
}

// ─── Submissions Collection ───────────────────────────────────────────────────

export interface SubmissionDocument extends BaseDocument {
  assignmentId: string
  studentId: string
  files: FileAttachment[]
  submittedAt: FirestoreTimestamp
  status: 'draft' | 'submitted' | 'graded'
  marks: number | null
  feedback: string | null
  gradedBy: string | null
  gradedAt: FirestoreTimestamp | null
  rubricScores: { criterion: string; score: number }[]
  isLate: boolean
}

// ─── Results Collection ───────────────────────────────────────────────────────

export interface ResultDocument extends BaseDocument {
  studentId: string
  courseId: string
  semester: number
  academicYear: string
  internal: number
  midterm: number | null
  endterm: number | null
  practical: number | null
  total: number
  grade: string
  gradePoint: number
  credits: number
  status: 'pass' | 'fail' | 'withheld'
}

// ─── Exams Collection ─────────────────────────────────────────────────────────

export interface ExamDocument extends BaseDocument {
  courseId: string
  title: string
  type: 'midterm' | 'endterm' | 'lab-viva' | 'quiz' | 'practical'
  date: FirestoreTimestamp
  duration: string
  venue: string
  maxMarks: number
  weightage: number
  instructions: string[]
  syllabus: string[]
  isPublished: boolean
}

// ─── Notifications Collection ─────────────────────────────────────────────────

export interface NotificationDocument extends BaseDocument {
  recipientId: string
  title: string
  body: string
  type: 'info' | 'warning' | 'success' | 'error'
  category: 'academic' | 'attendance' | 'assignment' | 'exam' | 'placement' | 'system'
  isRead: boolean
  readAt: FirestoreTimestamp | null
  actionUrl: string | null
  metadata: Record<string, string>
}

// ─── Tickets Collection ───────────────────────────────────────────────────────

export interface TicketDocument extends BaseDocument {
  createdBy: string
  title: string
  category: string
  priority: 'low' | 'medium' | 'high'
  status: 'open' | 'in-progress' | 'resolved' | 'closed'
  assignedTo: string | null
  lastMessageAt: FirestoreTimestamp
  messageCount: number
}

export interface TicketMessageDocument extends BaseDocument {
  ticketId: string
  senderId: string
  senderRole: UserRole
  content: string
  attachments: FileAttachment[]
}

// ─── Certificates Collection ──────────────────────────────────────────────────

export interface CertificateDocument extends BaseDocument {
  studentId: string
  title: string
  issuer: string
  issueDate: string
  expiryDate: string | null
  credentialId: string
  credentialUrl: string | null
  category: string
  skills: string[]
  verified: boolean
  fileUrl: string | null
}

// ─── Placements Collection ────────────────────────────────────────────────────

export interface PlacementDocument extends BaseDocument {
  companyName: string
  role: string
  package: number
  location: string
  type: string
  category: 'regular' | 'dream' | 'super-dream'
  eligibility: string
  rounds: string[]
  driveDate: FirestoreTimestamp
  deadline: FirestoreTimestamp
  description: string
  isActive: boolean
}

export interface PlacementApplicationDocument extends BaseDocument {
  placementId: string
  studentId: string
  status: 'applied' | 'shortlisted' | 'interview' | 'offered' | 'rejected'
  appliedAt: FirestoreTimestamp
  resumeUrl: string
  currentRound: number
}

// ─── Internships Collection ───────────────────────────────────────────────────

export interface InternshipDocument extends BaseDocument {
  company: string
  role: string
  stipend: number
  duration: string
  mode: 'remote' | 'hybrid' | 'onsite'
  location: string
  skills: string[]
  deadline: FirestoreTimestamp
  description: string
  isActive: boolean
}

// ─── Hostel Collection ────────────────────────────────────────────────────────

export interface HostelDocument extends BaseDocument {
  studentId: string
  block: string
  floor: number
  roomNumber: string
  roomType: string
  roommateIds: string[]
  checkInDate: string
  wardenId: string
}

// ─── Transport Collection ─────────────────────────────────────────────────────

export interface TransportDocument extends BaseDocument {
  studentId: string
  routeId: string
  routeName: string
  pickupPoint: string
  passType: 'monthly' | 'semester' | 'annual'
  validFrom: string
  validUntil: string
  isActive: boolean
}

// ─── Library Collection ───────────────────────────────────────────────────────

export interface LibraryDocument extends BaseDocument {
  studentId: string
  bookId: string
  bookTitle: string
  author: string
  isbn: string
  issuedAt: FirestoreTimestamp
  dueDate: FirestoreTimestamp
  returnedAt: FirestoreTimestamp | null
  fine: number
  status: 'issued' | 'returned' | 'overdue'
}

// ─── Fees Collection ──────────────────────────────────────────────────────────

export interface FeeDocument extends BaseDocument {
  studentId: string
  title: string
  amount: number
  dueDate: FirestoreTimestamp
  paidDate: FirestoreTimestamp | null
  status: 'paid' | 'pending' | 'overdue'
  category: string
  semester: number
  receiptId: string | null
  paymentMethod: string | null
}

// ─── Scholarships Collection ──────────────────────────────────────────────────

export interface ScholarshipDocument extends BaseDocument {
  title: string
  provider: string
  amount: number
  type: 'merit' | 'need' | 'government' | 'private'
  eligibility: string
  requirements: string[]
  deadline: FirestoreTimestamp
  isActive: boolean
}

export interface ScholarshipApplicationDocument extends BaseDocument {
  scholarshipId: string
  studentId: string
  status: 'applied' | 'approved' | 'pending-review' | 'rejected'
  appliedAt: FirestoreTimestamp
  documents: FileAttachment[]
}
