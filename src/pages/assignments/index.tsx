import { useState, useMemo } from 'react'
import { PageWrapper } from '@/layouts/PageWrapper'
import { PageHeader } from '@/components/shared/PageHeader'
import { EmptyState } from '@/components/shared/EmptyState'
import { FileText, Search } from 'lucide-react'
import { useAcademicData } from '@/store/academic-context'
import { type AssignmentStatus, type AssignmentPriority } from './data'
import { AssignmentCard } from './components/AssignmentCard'
import { AssignmentsToolbar } from './components/AssignmentsToolbar'
import { AssignmentAnalytics } from './components/AssignmentAnalytics'
import { AssignmentInsights } from './components/AssignmentInsights'
import { cn } from '@/lib/utils'

type PageTab = 'assignments' | 'analytics' | 'insights'

const pageTabs: { id: PageTab; label: string }[] = [
  { id: 'assignments', label: 'Assignments' },
  { id: 'analytics', label: 'Analytics' },
  { id: 'insights', label: 'Insights' },
]

const priorityOrder: Record<string, number> = { urgent: 0, high: 1, medium: 2, low: 3 }

export default function AssignmentsPage() {
  const { data } = useAcademicData()
  const assignmentsData = data.assignments
  const insights = data.assignmentInsights
  const [pageTab, setPageTab] = useState<PageTab>('assignments')
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<AssignmentStatus | 'all'>('all')
  const [priority, setPriority] = useState<AssignmentPriority | 'all'>('all')
  const [subject, setSubject] = useState('all')
  const [sort, setSort] = useState('due-asc')
  const [view, setView] = useState<'grid' | 'list'>('grid')

  const filtered = useMemo(() => {
    let result = [...assignmentsData]

    if (status !== 'all') result = result.filter((a) => a.status === status)
    if (priority !== 'all') result = result.filter((a) => a.priority === priority)
    if (subject !== 'all') result = result.filter((a) => a.subject.id === subject)
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter((a) =>
        a.title.toLowerCase().includes(q) ||
        a.subject.name.toLowerCase().includes(q) ||
        a.faculty.name.toLowerCase().includes(q) ||
        a.tags.some((t) => t.includes(q)),
      )
    }

    switch (sort) {
      case 'due-asc': result.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()); break
      case 'due-desc': result.sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime()); break
      case 'priority': result.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]); break
      case 'progress': result.sort((a, b) => b.progress - a.progress); break
      case 'name': result.sort((a, b) => a.title.localeCompare(b.title)); break
    }

    return result
  }, [search, status, priority, subject, sort])

  return (
    <PageWrapper title="Assignments">
      <PageHeader
        title="Assignments"
        description={`${assignmentsData.length} assignments this semester`}
      />

      {/* Page-level tabs */}
      <div className="mb-6 flex items-center gap-1 border-b border-border">
        {pageTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setPageTab(tab.id)}
            className={cn('relative px-4 py-2.5 text-sm font-medium transition-colors', pageTab === tab.id ? 'text-primary-700' : 'text-neutral-500 hover:text-neutral-700')}
          >
            {tab.label}
            {pageTab === tab.id && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 rounded-full" />}
          </button>
        ))}
      </div>

      {/* Content */}
      {pageTab === 'assignments' && (
        <>
          <AssignmentsToolbar
            search={search} onSearchChange={setSearch}
            status={status} onStatusChange={setStatus}
            priority={priority} onPriorityChange={setPriority}
            subject={subject} onSubjectChange={setSubject}
            sort={sort} onSortChange={setSort}
            view={view} onViewChange={setView}
            resultCount={filtered.length}
          />
          <div className="mt-6">
            {filtered.length === 0 ? (
              <EmptyState
                icon={search ? Search : FileText}
                title={search ? 'No assignments match your search' : 'No assignments found'}
                description="Try adjusting your filters or check back later."
              />
            ) : view === 'grid' ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((a, i) => <AssignmentCard key={a.id} assignment={a} index={i} view="grid" />)}
              </div>
            ) : (
              <div className="space-y-3">
                {filtered.map((a, i) => <AssignmentCard key={a.id} assignment={a} index={i} view="list" />)}
              </div>
            )}
          </div>
        </>
      )}

      {pageTab === 'analytics' && <AssignmentAnalytics />}
      {pageTab === 'insights' && <AssignmentInsights insights={insights} />}
    </PageWrapper>
  )
}
