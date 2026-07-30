import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Search, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { AttendanceSubjectRow } from '../data'

interface SubjectAttendanceTableProps {
  rows: AttendanceSubjectRow[]
}

type SortKey = 'name' | 'percentage' | 'present' | 'absent' | 'total' | 'required' | 'canMiss'
type SortDir = 'asc' | 'desc'

const statusStyles = {
  safe: { label: 'Safe', class: 'bg-success-50 text-success-700' },
  warning: { label: 'Warning', class: 'bg-warning-50 text-warning-700' },
  critical: { label: 'Critical', class: 'bg-error-50 text-error-700' },
}

export function SubjectAttendanceTable({ rows }: SubjectAttendanceTableProps) {
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('name')
  const [sortDir, setSortDir] = useState<SortDir>('asc')

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  const filtered = useMemo(() => {
    let result = [...rows]

    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        (r) =>
          r.subject.name.toLowerCase().includes(q) ||
          r.subject.code.toLowerCase().includes(q) ||
          r.subject.faculty.name.toLowerCase().includes(q),
      )
    }

    result.sort((a, b) => {
      let cmp = 0
      switch (sortKey) {
        case 'name': cmp = a.subject.name.localeCompare(b.subject.name); break
        case 'percentage': cmp = a.subject.attendance.percentage - b.subject.attendance.percentage; break
        case 'present': cmp = a.subject.attendance.present - b.subject.attendance.present; break
        case 'absent': cmp = a.subject.attendance.absent - b.subject.attendance.absent; break
        case 'total': cmp = a.subject.attendance.total - b.subject.attendance.total; break
        case 'required': cmp = a.classesRequired - b.classesRequired; break
        case 'canMiss': cmp = a.canMiss - b.canMiss; break
      }
      return sortDir === 'asc' ? cmp : -cmp
    })

    return result
  }, [rows, search, sortKey, sortDir])

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      {/* Search */}
      <div className="mb-4 relative max-w-xs">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search subjects..."
          className="h-9 w-full rounded-lg border border-border bg-white pl-9 pr-3 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition-colors focus:border-primary-300 focus:ring-2 focus:ring-primary-100"
        />
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-border bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-neutral-50/80">
                <SortHeader label="Subject" sortKey="name" current={sortKey} dir={sortDir} onClick={handleSort} className="min-w-[180px]" />
                <SortHeader label="Present" sortKey="present" current={sortKey} dir={sortDir} onClick={handleSort} />
                <SortHeader label="Absent" sortKey="absent" current={sortKey} dir={sortDir} onClick={handleSort} />
                <SortHeader label="Total" sortKey="total" current={sortKey} dir={sortDir} onClick={handleSort} />
                <SortHeader label="Percentage" sortKey="percentage" current={sortKey} dir={sortDir} onClick={handleSort} />
                <SortHeader label="Need" sortKey="required" current={sortKey} dir={sortDir} onClick={handleSort} />
                <SortHeader label="Can Miss" sortKey="canMiss" current={sortKey} dir={sortDir} onClick={handleSort} />
                <th className="h-10 px-4 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => {
                const att = row.subject.attendance
                const status = statusStyles[row.status]
                const percentColor = att.percentage >= 85
                  ? 'text-success-600'
                  : att.percentage >= 75
                    ? 'text-warning-600'
                    : 'text-error-600'

                return (
                  <tr key={row.subject.id} className="border-b border-border last:border-0 transition-colors hover:bg-neutral-25">
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-neutral-800">{row.subject.name}</p>
                        <p className="text-xs text-neutral-400">{row.subject.code} • {row.subject.faculty.name}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-neutral-700 font-medium">{att.present}</td>
                    <td className="px-4 py-3 text-neutral-700">{att.absent}</td>
                    <td className="px-4 py-3 text-neutral-500">{att.total}</td>
                    <td className="px-4 py-3">
                      <span className={cn('font-semibold', percentColor)}>
                        {att.percentage}%
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {row.classesRequired > 0 ? (
                        <span className="text-error-600 font-medium">{row.classesRequired}</span>
                      ) : (
                        <span className="text-neutral-300">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {row.canMiss > 0 ? (
                        <span className="text-success-600 font-medium">{row.canMiss}</span>
                      ) : (
                        <span className="text-error-500 font-medium">0</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn('rounded-full px-2.5 py-0.5 text-[10px] font-semibold', status.class)}>
                        {status.label}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  )
}

// ─── Sort Header ──────────────────────────────────────────────────────────────

function SortHeader({
  label,
  sortKey,
  current,
  dir,
  onClick,
  className,
}: {
  label: string
  sortKey: SortKey
  current: SortKey
  dir: SortDir
  onClick: (key: SortKey) => void
  className?: string
}) {
  const isActive = current === sortKey
  return (
    <th className={cn('h-10 px-4 text-left text-xs font-medium uppercase tracking-wider text-neutral-500', className)}>
      <button
        onClick={() => onClick(sortKey)}
        className="flex items-center gap-1 hover:text-neutral-700 transition-colors"
      >
        {label}
        {isActive ? (
          dir === 'asc' ? <ArrowUp className="h-3 w-3 text-primary-600" /> : <ArrowDown className="h-3 w-3 text-primary-600" />
        ) : (
          <ArrowUpDown className="h-3 w-3 text-neutral-300" />
        )}
      </button>
    </th>
  )
}
