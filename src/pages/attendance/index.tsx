import { useState } from 'react'
import { PageWrapper } from '@/layouts/PageWrapper'
import { PageHeader } from '@/components/shared/PageHeader'
import { Download, Printer } from 'lucide-react'
import { useAcademicData } from '@/store/academic-context'
import { AttendanceOverview } from './components/AttendanceOverview'
import { SubjectAttendanceTable } from './components/SubjectAttendanceTable'
import { AttendanceCharts } from './components/AttendanceCharts'
import { AttendanceInsights } from './components/AttendanceInsights'
import { cn } from '@/lib/utils'

// ─── Tab options ──────────────────────────────────────────────────────────────

type TabId = 'overview' | 'analytics' | 'insights'

const tabOptions: { id: TabId; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'analytics', label: 'Analytics' },
  { id: 'insights', label: 'Insights' },
]

// ─── Attendance Page ──────────────────────────────────────────────────────────

export default function AttendancePage() {
  const [activeTab, setActiveTab] = useState<TabId>('overview')
  const { data } = useAcademicData()

  const rows = data.attendance
  const stats = data.attendanceOverview
  const insights = data.attendanceInsights

  return (
    <PageWrapper title="Attendance">
      <PageHeader
        title="Attendance"
        description={`Semester 6 • Overall: ${stats.overallPercentage}% • Required: 75%`}
        actions={
          <div className="flex items-center gap-2">
            <button className="flex h-8 items-center gap-1.5 rounded-lg border border-border px-3 text-xs font-medium text-neutral-600 hover:bg-neutral-50 transition-colors">
              <Printer className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Print</span>
            </button>
            <button className="flex h-8 items-center gap-1.5 rounded-lg bg-primary-600 px-3 text-xs font-medium text-white hover:bg-primary-700 transition-colors">
              <Download className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        }
      />

      {/* Tab Navigation */}
      <div className="mb-6 flex items-center gap-1 border-b border-border">
        {tabOptions.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'relative px-4 py-2.5 text-sm font-medium transition-colors',
              activeTab === tab.id ? 'text-primary-700' : 'text-neutral-500 hover:text-neutral-700',
            )}
          >
            {tab.label}
            {activeTab === tab.id && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <AttendanceOverview stats={stats} />
          <SubjectAttendanceTable rows={rows} />
        </div>
      )}

      {activeTab === 'analytics' && (
        <AttendanceCharts />
      )}

      {activeTab === 'insights' && (
        <AttendanceInsights insights={insights} />
      )}
    </PageWrapper>
  )
}
