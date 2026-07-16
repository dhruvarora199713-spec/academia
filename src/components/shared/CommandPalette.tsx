/**
 * Command Palette — Global Search
 *
 * ⌘K to open. Searches across all modules. Keyboard navigation.
 * Architecture: Local search over static data now. Pluggable Firestore queries later.
 */

import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, ArrowRight, BookOpen, CalendarCheck, FileText, ClipboardList, Award, CreditCard, Briefcase, Building, FolderKanban, Calendar, Medal, Trophy } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useDebounce } from '@/hooks/use-debounce'
import { subjectsData } from '@/pages/subjects/data'
import { assignmentsData } from '@/pages/assignments/data'
import { examsData } from '@/pages/exams/data'

// ─── Search Index ─────────────────────────────────────────────────────────────

interface SearchResult {
  id: string
  title: string
  subtitle: string
  category: string
  href: string
  icon: typeof BookOpen
}

function buildSearchIndex(): SearchResult[] {
  const results: SearchResult[] = []

  subjectsData.forEach((s) => results.push({ id: `sub-${s.id}`, title: s.name, subtitle: `${s.code} • ${s.credits} Credits`, category: 'Subjects', href: `/subjects/${s.id}`, icon: BookOpen }))
  assignmentsData.forEach((a) => results.push({ id: `asg-${a.id}`, title: a.title, subtitle: `${a.subject.code} • Due ${new Date(a.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`, category: 'Assignments', href: `/assignments/${a.id}`, icon: FileText }))
  examsData.forEach((e) => results.push({ id: `exam-${e.id}`, title: `${e.subject.name} — ${e.title}`, subtitle: `${new Date(e.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} • ${e.venue}`, category: 'Exams', href: '/exams', icon: ClipboardList }))

  // Static pages
  results.push(
    { id: 'nav-attendance', title: 'Attendance', subtitle: 'View attendance records', category: 'Pages', href: '/attendance', icon: CalendarCheck },
    { id: 'nav-results', title: 'Results', subtitle: 'Academic results & grades', category: 'Pages', href: '/results', icon: Award },
    { id: 'nav-fees', title: 'Fees', subtitle: 'Fee management', category: 'Pages', href: '/fees', icon: CreditCard },
    { id: 'nav-placements', title: 'Placements', subtitle: 'Campus placements', category: 'Pages', href: '/placements', icon: Briefcase },
    { id: 'nav-internships', title: 'Internships', subtitle: 'Internship opportunities', category: 'Pages', href: '/internships', icon: Building },
    { id: 'nav-projects', title: 'Projects', subtitle: 'Student projects', category: 'Pages', href: '/projects', icon: FolderKanban },
    { id: 'nav-calendar', title: 'Calendar', subtitle: 'Academic calendar', category: 'Pages', href: '/calendar', icon: Calendar },
    { id: 'nav-certificates', title: 'Certificates', subtitle: 'Your credentials', category: 'Pages', href: '/certificates', icon: Medal },
    { id: 'nav-achievements', title: 'Achievements', subtitle: 'Badges & milestones', category: 'Pages', href: '/achievements', icon: Trophy },
  )

  return results
}

// ─── Command Palette Component ────────────────────────────────────────────────

export function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const navigate = useNavigate()
  const inputRef = useRef<HTMLInputElement>(null)
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const debouncedQuery = useDebounce(query, 150)

  const searchIndex = useMemo(() => buildSearchIndex(), [])

  const results = useMemo(() => {
    if (!debouncedQuery.trim()) return searchIndex.slice(0, 8)
    const q = debouncedQuery.toLowerCase()
    return searchIndex.filter((r) =>
      r.title.toLowerCase().includes(q) ||
      r.subtitle.toLowerCase().includes(q) ||
      r.category.toLowerCase().includes(q)
    ).slice(0, 10)
  }, [debouncedQuery, searchIndex])

  // Focus input on open
  useEffect(() => {
    if (open) { inputRef.current?.focus(); setQuery(''); setSelectedIndex(0) }
  }, [open])

  // Keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setSelectedIndex((i) => Math.min(i + 1, results.length - 1)) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setSelectedIndex((i) => Math.max(i - 1, 0)) }
    else if (e.key === 'Enter' && results[selectedIndex]) { navigate(results[selectedIndex].href); onClose() }
    else if (e.key === 'Escape') { onClose() }
  }, [results, selectedIndex, navigate, onClose])

  // Reset selection when results change
  useEffect(() => { setSelectedIndex(0) }, [results])

  if (!open) return null

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4" onClick={onClose}>
        <div className="fixed inset-0 bg-black/20 backdrop-blur-[2px]" />
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.97 }}
          transition={{ duration: 0.15 }}
          className="relative w-full max-w-lg overflow-hidden rounded-xl border border-border bg-white shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Input */}
          <div className="flex items-center gap-3 border-b border-border px-4 py-3">
            <Search className="h-4 w-4 text-neutral-400 shrink-0" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search anything..."
              className="flex-1 bg-transparent text-sm text-neutral-900 outline-none placeholder:text-neutral-400"
            />
            <kbd className="hidden sm:flex h-5 items-center rounded border border-neutral-200 bg-neutral-50 px-1.5 text-[10px] font-mono text-neutral-400">ESC</kbd>
          </div>

          {/* Results */}
          <div className="max-h-[320px] overflow-y-auto py-2">
            {results.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-sm text-neutral-500">No results found</p>
                <p className="text-xs text-neutral-400 mt-1">Try a different search term</p>
              </div>
            ) : (
              results.map((result, i) => {
                const Icon = result.icon
                return (
                  <button
                    key={result.id}
                    onClick={() => { navigate(result.href); onClose() }}
                    onMouseEnter={() => setSelectedIndex(i)}
                    className={cn(
                      'flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors',
                      i === selectedIndex ? 'bg-primary-50' : 'hover:bg-neutral-50',
                    )}
                  >
                    <div className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-lg', i === selectedIndex ? 'bg-primary-100 text-primary-600' : 'bg-neutral-100 text-neutral-500')}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-neutral-900 truncate">
                        {highlightMatch(result.title, debouncedQuery)}
                      </p>
                      <p className="text-xs text-neutral-400 truncate">{result.subtitle}</p>
                    </div>
                    <span className="shrink-0 text-[10px] font-medium text-neutral-400">{result.category}</span>
                    {i === selectedIndex && <ArrowRight className="h-3 w-3 text-primary-500 shrink-0" />}
                  </button>
                )
              })
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center gap-4 border-t border-border px-4 py-2 text-[10px] text-neutral-400">
            <span>↑↓ Navigate</span>
            <span>↵ Open</span>
            <span>Esc Close</span>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

// ─── Highlight matched text ───────────────────────────────────────────────────

function highlightMatch(text: string, query: string) {
  if (!query.trim()) return text
  const idx = text.toLowerCase().indexOf(query.toLowerCase())
  if (idx === -1) return text
  return (
    <>
      {text.slice(0, idx)}
      <span className="text-primary-600 font-semibold">{text.slice(idx, idx + query.length)}</span>
      {text.slice(idx + query.length)}
    </>
  )
}

// ─── Hook to manage ⌘K shortcut ───────────────────────────────────────────────

export function useCommandPalette() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen((o) => !o)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  return { open, setOpen, onClose: () => setOpen(false) }
}
