/**
 * Assignments Module — Types & Data
 *
 * References: Subject, Faculty from Subjects module.
 * No duplicate models.
 */

import { subjectsData } from '@/pages/subjects/data'
import type { Subject, Faculty } from '@/pages/subjects/types'

// ─── Types ────────────────────────────────────────────────────────────────────

export type AssignmentStatus = 'not-started' | 'in-progress' | 'submitted' | 'late' | 'graded'
export type AssignmentPriority = 'low' | 'medium' | 'high' | 'urgent'
export type SubmissionType = 'online' | 'offline' | 'code' | 'report' | 'presentation'
export type Difficulty = 'easy' | 'medium' | 'hard'

export interface AssignmentFull {
  id: string
  title: string
  description: string
  instructions: string
  subject: Subject
  faculty: Faculty
  assignedDate: string
  dueDate: string
  submittedDate: string | null
  status: AssignmentStatus
  priority: AssignmentPriority
  marks: number | null
  maxMarks: number
  weightage: number
  estimatedTime: string
  difficulty: Difficulty
  submissionType: SubmissionType
  attachments: Attachment[]
  rubric: RubricItem[]
  submissions: SubmissionRecord[]
  feedback: string | null
  progress: number  // 0-100
  tags: string[]
}

export interface Attachment {
  id: string
  name: string
  size: string
  type: string
  url: string
}

export interface RubricItem {
  criterion: string
  maxScore: number
  score: number | null
  description: string
}

export interface SubmissionRecord {
  id: string
  date: string
  fileName: string
  fileSize: string
  status: 'draft' | 'final'
}

// ─── Insight Types ────────────────────────────────────────────────────────────

export interface AssignmentInsight {
  id: string
  type: 'success' | 'warning' | 'danger' | 'info'
  title: string
  description: string
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const sub = (id: string) => subjectsData.find((s) => s.id === id)!

export const assignmentsData: AssignmentFull[] = [
  {
    id: 'asg1',
    title: 'Graph Algorithms Implementation',
    description: 'Implement BFS, DFS, Dijkstra, and Kruskal algorithms with visualization.',
    instructions: '1. Implement all four algorithms in C++ or Python.\n2. Include time/space complexity analysis.\n3. Create a visualization for at least one algorithm.\n4. Submit source code + report (PDF).\n5. Code must compile without errors.',
    subject: sub('sub1'),
    faculty: sub('sub1').faculty,
    assignedDate: '2026-07-02',
    dueDate: '2026-07-15',
    submittedDate: null,
    status: 'in-progress',
    priority: 'high',
    marks: null,
    maxMarks: 100,
    weightage: 15,
    estimatedTime: '8-10 hours',
    difficulty: 'hard',
    submissionType: 'code',
    attachments: [
      { id: 'att1', name: 'Assignment_7_Problem_Statement.pdf', size: '245 KB', type: 'pdf', url: '#' },
      { id: 'att2', name: 'sample_graphs.zip', size: '1.2 MB', type: 'zip', url: '#' },
    ],
    rubric: [
      { criterion: 'Correctness of Implementation', maxScore: 40, score: null, description: 'All algorithms produce correct output' },
      { criterion: 'Code Quality & Documentation', maxScore: 20, score: null, description: 'Clean code, proper comments, README' },
      { criterion: 'Complexity Analysis', maxScore: 20, score: null, description: 'Time and space analysis for each algorithm' },
      { criterion: 'Visualization', maxScore: 20, score: null, description: 'Interactive or animated visualization' },
    ],
    submissions: [],
    feedback: null,
    progress: 45,
    tags: ['graphs', 'algorithms', 'implementation'],
  },
  {
    id: 'asg2',
    title: 'Socket Programming Lab Report',
    description: 'Implement a TCP client-server chat application and document the architecture.',
    instructions: '1. Implement TCP client-server in Python.\n2. Support multiple clients.\n3. Document protocol design.\n4. Include screenshots of working system.\n5. Submit lab report + source code.',
    subject: sub('sub2'),
    faculty: sub('sub2').faculty,
    assignedDate: '2026-07-05',
    dueDate: '2026-07-12',
    submittedDate: null,
    status: 'in-progress',
    priority: 'high',
    marks: null,
    maxMarks: 50,
    weightage: 10,
    estimatedTime: '5-6 hours',
    difficulty: 'medium',
    submissionType: 'report',
    attachments: [
      { id: 'att3', name: 'Lab8_Socket_Programming.pdf', size: '180 KB', type: 'pdf', url: '#' },
    ],
    rubric: [
      { criterion: 'Implementation', maxScore: 20, score: null, description: 'Working client-server system' },
      { criterion: 'Multi-client Support', maxScore: 10, score: null, description: 'Handles concurrent connections' },
      { criterion: 'Documentation', maxScore: 15, score: null, description: 'Architecture diagram, protocol spec' },
      { criterion: 'Testing', maxScore: 5, score: null, description: 'Edge cases and error handling' },
    ],
    submissions: [],
    feedback: null,
    progress: 30,
    tags: ['networking', 'sockets', 'TCP'],
  },
  {
    id: 'asg3',
    title: 'Process Scheduling Simulator',
    description: 'Build a simulator implementing FCFS, SJF, Round Robin, and Priority scheduling algorithms.',
    instructions: '1. Implement all four algorithms.\n2. Accept process input from file.\n3. Calculate avg waiting time, turnaround time.\n4. Generate Gantt chart output.\n5. Compare algorithm performance.',
    subject: sub('sub3'),
    faculty: sub('sub3').faculty,
    assignedDate: '2026-07-01',
    dueDate: '2026-07-14',
    submittedDate: null,
    status: 'not-started',
    priority: 'medium',
    marks: null,
    maxMarks: 100,
    weightage: 15,
    estimatedTime: '6-8 hours',
    difficulty: 'medium',
    submissionType: 'code',
    attachments: [
      { id: 'att4', name: 'OS_Assignment6_Scheduling.pdf', size: '320 KB', type: 'pdf', url: '#' },
    ],
    rubric: [
      { criterion: 'Algorithm Correctness', maxScore: 40, score: null, description: 'Correct scheduling output' },
      { criterion: 'Metrics Calculation', maxScore: 25, score: null, description: 'Waiting time, turnaround time' },
      { criterion: 'Gantt Chart', maxScore: 20, score: null, description: 'Visual representation' },
      { criterion: 'Comparison Report', maxScore: 15, score: null, description: 'Performance analysis' },
    ],
    submissions: [],
    feedback: null,
    progress: 0,
    tags: ['OS', 'scheduling', 'simulator'],
  },
  {
    id: 'asg4',
    title: 'UML Diagrams for Mini Project',
    description: 'Create complete UML documentation for your SE mini project including class, sequence, and activity diagrams.',
    instructions: '1. Use-case diagram\n2. Class diagram\n3. Sequence diagram (min 3 scenarios)\n4. Activity diagram\n5. State diagram\n6. Use StarUML or draw.io',
    subject: sub('sub5'),
    faculty: sub('sub5').faculty,
    assignedDate: '2026-06-28',
    dueDate: '2026-07-12',
    submittedDate: null,
    status: 'in-progress',
    priority: 'urgent',
    marks: null,
    maxMarks: 50,
    weightage: 20,
    estimatedTime: '4-5 hours',
    difficulty: 'medium',
    submissionType: 'report',
    attachments: [],
    rubric: [
      { criterion: 'Completeness', maxScore: 20, score: null, description: 'All required diagrams present' },
      { criterion: 'Correctness', maxScore: 15, score: null, description: 'UML notation followed properly' },
      { criterion: 'Consistency', maxScore: 10, score: null, description: 'Diagrams are consistent with each other' },
      { criterion: 'Presentation', maxScore: 5, score: null, description: 'Clean, professional formatting' },
    ],
    submissions: [],
    feedback: null,
    progress: 60,
    tags: ['UML', 'design', 'documentation'],
  },
  {
    id: 'asg5',
    title: 'DBMS Lab: Stored Procedures & Triggers',
    description: 'Implement stored procedures, triggers, and views for the university database schema.',
    instructions: '1. Create 5 stored procedures.\n2. Create 3 triggers (before/after).\n3. Create 4 views.\n4. Test with sample data.\n5. Submit SQL file + output screenshots.',
    subject: sub('sub4'),
    faculty: sub('sub4').faculty,
    assignedDate: '2026-07-05',
    dueDate: '2026-07-11',
    submittedDate: '2026-07-09',
    status: 'submitted',
    priority: 'medium',
    marks: null,
    maxMarks: 50,
    weightage: 10,
    estimatedTime: '3-4 hours',
    difficulty: 'easy',
    submissionType: 'code',
    attachments: [
      { id: 'att5', name: 'Lab10_SP_Triggers.pdf', size: '150 KB', type: 'pdf', url: '#' },
    ],
    rubric: [
      { criterion: 'Stored Procedures', maxScore: 20, score: null, description: '5 working procedures' },
      { criterion: 'Triggers', maxScore: 15, score: null, description: '3 triggers with proper logic' },
      { criterion: 'Views', maxScore: 10, score: null, description: '4 useful views' },
      { criterion: 'Testing', maxScore: 5, score: null, description: 'Output verification' },
    ],
    submissions: [
      { id: 's1', date: '2026-07-09T14:30:00', fileName: 'lab10_solution.sql', fileSize: '12 KB', status: 'final' },
    ],
    feedback: null,
    progress: 100,
    tags: ['SQL', 'DBMS', 'procedures'],
  },
  {
    id: 'asg6',
    title: 'CN Lab Report - Week 7 (Wireshark)',
    description: 'Capture and analyze HTTP, TCP, and DNS packets using Wireshark.',
    instructions: '1. Capture HTTP session.\n2. Analyze TCP 3-way handshake.\n3. Capture DNS query/response.\n4. Document findings with annotated screenshots.',
    subject: sub('sub2'),
    faculty: sub('sub2').faculty,
    assignedDate: '2026-06-25',
    dueDate: '2026-07-02',
    submittedDate: '2026-07-01',
    status: 'graded',
    priority: 'low',
    marks: 42,
    maxMarks: 50,
    weightage: 8,
    estimatedTime: '2-3 hours',
    difficulty: 'easy',
    submissionType: 'report',
    attachments: [],
    rubric: [
      { criterion: 'HTTP Capture', maxScore: 15, score: 14, description: 'Complete HTTP session captured' },
      { criterion: 'TCP Analysis', maxScore: 15, score: 13, description: '3-way handshake identified' },
      { criterion: 'DNS Analysis', maxScore: 10, score: 8, description: 'Query/response documented' },
      { criterion: 'Report Quality', maxScore: 10, score: 7, description: 'Annotations and clarity' },
    ],
    submissions: [
      { id: 's2', date: '2026-07-01T16:00:00', fileName: 'CN_Lab7_Wireshark_Report.pdf', fileSize: '3.2 MB', status: 'final' },
    ],
    feedback: 'Good analysis of TCP handshake. DNS section could include more detail on iterative vs recursive queries. Overall solid work.',
    progress: 100,
    tags: ['wireshark', 'packet-analysis', 'networking'],
  },
  {
    id: 'asg7',
    title: 'DSA Assignment 6 - Dynamic Programming',
    description: 'Solve 5 DP problems with memoization and tabulation approaches.',
    instructions: '1. Solve each problem using both top-down and bottom-up.\n2. Analyze time/space complexity.\n3. Explain state transition.\n4. Submit on coding platform + PDF report.',
    subject: sub('sub1'),
    faculty: sub('sub1').faculty,
    assignedDate: '2026-06-20',
    dueDate: '2026-06-30',
    submittedDate: '2026-06-29',
    status: 'graded',
    priority: 'high',
    marks: 92,
    maxMarks: 100,
    weightage: 12,
    estimatedTime: '6-8 hours',
    difficulty: 'hard',
    submissionType: 'code',
    attachments: [],
    rubric: [
      { criterion: 'Problem Solutions', maxScore: 50, score: 47, description: 'All 5 problems solved correctly' },
      { criterion: 'Dual Approach', maxScore: 20, score: 19, description: 'Both memoization and tabulation' },
      { criterion: 'Complexity Analysis', maxScore: 20, score: 18, description: 'Time and space for each' },
      { criterion: 'Code Quality', maxScore: 10, score: 8, description: 'Clean, readable code' },
    ],
    submissions: [
      { id: 's3', date: '2026-06-29T22:45:00', fileName: 'dp_solutions.zip', fileSize: '45 KB', status: 'final' },
    ],
    feedback: 'Excellent work on all DP problems. Minor deduction for inconsistent variable naming. The state transition explanations were particularly clear.',
    progress: 100,
    tags: ['DP', 'algorithms', 'optimization'],
  },
  {
    id: 'asg8',
    title: 'Combinatorics Problem Set',
    description: 'Solve 10 problems on permutations, combinations, inclusion-exclusion, and generating functions.',
    instructions: '1. Show complete working for each.\n2. State theorems used.\n3. Handwritten or LaTeX.\n4. Submit as PDF.',
    subject: sub('sub6'),
    faculty: sub('sub6').faculty,
    assignedDate: '2026-07-03',
    dueDate: '2026-07-13',
    submittedDate: null,
    status: 'not-started',
    priority: 'low',
    marks: null,
    maxMarks: 50,
    weightage: 10,
    estimatedTime: '3-4 hours',
    difficulty: 'medium',
    submissionType: 'offline',
    attachments: [
      { id: 'att6', name: 'DM_ProblemSet5.pdf', size: '200 KB', type: 'pdf', url: '#' },
    ],
    rubric: [
      { criterion: 'Correctness', maxScore: 35, score: null, description: 'Correct solutions with working' },
      { criterion: 'Methodology', maxScore: 10, score: null, description: 'Proper theorem application' },
      { criterion: 'Presentation', maxScore: 5, score: null, description: 'Clear handwriting/formatting' },
    ],
    submissions: [],
    feedback: null,
    progress: 0,
    tags: ['combinatorics', 'discrete-math'],
  },
  {
    id: 'asg9',
    title: 'REST API Design Document',
    description: 'Design a complete REST API specification for your SE mini project.',
    instructions: '1. Define all endpoints (CRUD).\n2. Request/response schemas.\n3. Authentication flow.\n4. Error handling standards.\n5. Use OpenAPI/Swagger format.',
    subject: sub('sub5'),
    faculty: sub('sub5').faculty,
    assignedDate: '2026-06-25',
    dueDate: '2026-07-05',
    submittedDate: '2026-07-07',
    status: 'late',
    priority: 'high',
    marks: null,
    maxMarks: 50,
    weightage: 15,
    estimatedTime: '4-5 hours',
    difficulty: 'medium',
    submissionType: 'online',
    attachments: [],
    rubric: [
      { criterion: 'Endpoint Design', maxScore: 20, score: null, description: 'RESTful naming, proper verbs' },
      { criterion: 'Schemas', maxScore: 15, score: null, description: 'Request/response models' },
      { criterion: 'Auth & Security', maxScore: 10, score: null, description: 'JWT/OAuth flow documented' },
      { criterion: 'Documentation Quality', maxScore: 5, score: null, description: 'OpenAPI format compliance' },
    ],
    submissions: [
      { id: 's4', date: '2026-07-07T23:30:00', fileName: 'api_spec_v2.yaml', fileSize: '28 KB', status: 'final' },
    ],
    feedback: null,
    progress: 100,
    tags: ['REST', 'API', 'design'],
  },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function getAssignmentById(id: string): AssignmentFull | undefined {
  return assignmentsData.find((a) => a.id === id)
}

export function getAssignmentsBySubject(subjectId: string): AssignmentFull[] {
  return assignmentsData.filter((a) => a.subject.id === subjectId)
}

// ─── Analytics Computations ───────────────────────────────────────────────────

export function getAssignmentStats() {
  const total = assignmentsData.length
  const completed = assignmentsData.filter((a) => a.status === 'submitted' || a.status === 'graded').length
  const pending = assignmentsData.filter((a) => a.status === 'not-started' || a.status === 'in-progress').length
  const overdue = assignmentsData.filter((a) => a.status === 'late').length
  const graded = assignmentsData.filter((a) => a.status === 'graded')
  const avgMarks = graded.length > 0
    ? Math.round(graded.reduce((s, a) => s + ((a.marks || 0) / a.maxMarks) * 100, 0) / graded.length)
    : 0

  const upcoming = assignmentsData.filter((a) => {
    const due = new Date(a.dueDate)
    const now = new Date()
    const diff = (due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    return diff > 0 && diff <= 7 && (a.status === 'not-started' || a.status === 'in-progress')
  })

  return { total, completed, pending, overdue, avgMarks, upcoming: upcoming.length, completionRate: Math.round((completed / total) * 100) }
}

// ─── Insights (dynamically computed) ──────────────────────────────────────────

export function generateAssignmentInsights(): AssignmentInsight[] {
  const insights: AssignmentInsight[] = []
  const now = new Date()

  // Due this week
  const dueThisWeek = assignmentsData.filter((a) => {
    const due = new Date(a.dueDate)
    const diff = (due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    return diff > 0 && diff <= 7 && a.status !== 'graded' && a.status !== 'submitted'
  })
  if (dueThisWeek.length > 0) {
    insights.push({
      id: 'due-week',
      type: 'warning',
      title: `${dueThisWeek.length} assignment${dueThisWeek.length > 1 ? 's' : ''} due this week`,
      description: dueThisWeek.map((a) => a.title).join(', '),
    })
  }

  // Highest workload subject
  const subjectCounts = assignmentsData
    .filter((a) => a.status !== 'graded')
    .reduce<Record<string, number>>((acc, a) => {
      acc[a.subject.name] = (acc[a.subject.name] || 0) + 1
      return acc
    }, {})
  const topSubject = Object.entries(subjectCounts).sort(([, a], [, b]) => b - a)[0]
  if (topSubject) {
    insights.push({
      id: 'workload',
      type: 'info',
      title: `Highest workload: ${topSubject[0]}`,
      description: `${topSubject[1]} pending/active assignment${topSubject[1] > 1 ? 's' : ''} in this subject.`,
    })
  }

  // Late submission risk
  const atRisk = assignmentsData.filter((a) => {
    const due = new Date(a.dueDate)
    const diff = (due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    return diff > 0 && diff <= 3 && a.progress < 50 && (a.status === 'not-started' || a.status === 'in-progress')
  })
  atRisk.forEach((a) => {
    insights.push({
      id: `risk-${a.id}`,
      type: 'danger',
      title: `Late submission risk: ${a.title}`,
      description: `Due in ${Math.ceil((new Date(a.dueDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24))} days but only ${a.progress}% complete.`,
    })
  })

  // Completion rate
  const stats = getAssignmentStats()
  if (stats.completionRate >= 70) {
    insights.push({
      id: 'completion',
      type: 'success',
      title: `${stats.completionRate}% assignment completion rate`,
      description: `${stats.completed} out of ${stats.total} assignments completed. Average score: ${stats.avgMarks}%.`,
    })
  }

  return insights
}
