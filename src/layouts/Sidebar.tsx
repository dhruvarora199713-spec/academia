import { useLocation, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronsLeft, GraduationCap, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { navigationConfig } from '@/constants/navigation'
import { useSidebarContext } from '@/store/sidebar-context'
import { useAuth } from '@/store/auth-context'
import { useProfile } from '@/store/profile-context'
import { APP_NAME } from '@/constants'
import type { NavItem, NavGroup } from '@/constants/navigation'

export const SIDEBAR_WIDTH = 260
export const SIDEBAR_COLLAPSED_WIDTH = 72

export function Sidebar() {
  const { isCollapsed, isMobileOpen, toggle, closeMobile } = useSidebarContext()
  const location = useLocation()

  return (
    <>
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px] lg:hidden"
            onClick={closeMobile}
          />
        )}
      </AnimatePresence>

      <aside
        className={cn(
          'fixed left-0 top-0 z-50 flex h-screen flex-col border-r border-border bg-white transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]',
          'lg:relative lg:z-auto',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        )}
        style={{ width: isCollapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH }}
      >
        {/* Logo */}
        <div className="flex h-14 items-center justify-between border-b border-border px-4">
          <Link to="/" className="flex items-center gap-2.5 overflow-hidden">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-600 text-white">
              <GraduationCap className="h-4.5 w-4.5" />
            </div>
            {!isCollapsed && (
              <span className="text-base font-semibold tracking-tight text-neutral-900 whitespace-nowrap">
                {APP_NAME}
              </span>
            )}
          </Link>
          <button
            onClick={toggle}
            className="hidden h-7 w-7 items-center justify-center rounded-md text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 lg:flex"
          >
            <ChevronsLeft className={cn('h-4 w-4 transition-transform duration-300', isCollapsed && 'rotate-180')} />
          </button>
          <button onClick={closeMobile} className="flex h-7 w-7 items-center justify-center rounded-md text-neutral-400 hover:bg-neutral-100 lg:hidden">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden py-4">
          <div className="space-y-6 px-3">
            {navigationConfig.map((group) => (
              <NavGroupComponent key={group.title} group={group} isCollapsed={isCollapsed} currentPath={location.pathname} onNavigate={closeMobile} />
            ))}
          </div>
        </nav>

        {/* Footer */}
        <div className="border-t border-border p-3">
          <SidebarFooter isCollapsed={isCollapsed} />
        </div>
      </aside>
    </>
  )
}

function SidebarFooter({ isCollapsed }: { isCollapsed: boolean }) {
  const { user } = useAuth()
  const { userDoc, studentDoc } = useProfile()
  const displayName = studentDoc?.fullName || userDoc?.displayName || user?.displayName || 'Student'
  const initials = displayName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
  const subtitle = studentDoc?.branch ? `${studentDoc.program || 'B.Tech'} ${studentDoc.branch.split(' ').map((w: string) => w[0]).join('')} • Sem ${studentDoc.semester || ''}` : user?.email || ''

  return (
    <div className={cn('flex items-center gap-3 rounded-lg px-2.5 py-2', isCollapsed && 'justify-center px-0')}>
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-100 text-sm font-medium text-primary-700">{initials}</div>
      {!isCollapsed && (
        <div className="overflow-hidden">
          <p className="text-sm font-medium text-neutral-900 truncate">{displayName}</p>
          <p className="text-xs text-neutral-500 truncate">{subtitle}</p>
        </div>
      )}
    </div>
  )
}

function NavGroupComponent({ group, isCollapsed, currentPath, onNavigate }: { group: NavGroup; isCollapsed: boolean; currentPath: string; onNavigate: () => void }) {
  return (
    <div>
      {!isCollapsed && (
        <h4 className="mb-1.5 px-2.5 text-[11px] font-medium uppercase tracking-wider text-neutral-400">
          {group.title}
        </h4>
      )}
      <ul className="space-y-0.5">
        {group.items.map((item) => (
          <NavItemComponent key={item.href} item={item} isCollapsed={isCollapsed} isActive={currentPath === item.href} onNavigate={onNavigate} />
        ))}
      </ul>
    </div>
  )
}

function NavItemComponent({ item, isCollapsed, isActive, onNavigate }: { item: NavItem; isCollapsed: boolean; isActive: boolean; onNavigate: () => void }) {
  const Icon = item.icon
  return (
    <li>
      <Link
        to={item.href}
        onClick={onNavigate}
        className={cn(
          'group relative flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium transition-all duration-150',
          isCollapsed && 'justify-center px-0 py-2.5',
          isActive ? 'bg-primary-50 text-primary-700' : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900',
          item.disabled && 'pointer-events-none opacity-40',
        )}
        title={isCollapsed ? item.title : undefined}
      >
        {isActive && (
          <motion.div layoutId="sidebar-active" className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-primary-600" transition={{ type: 'spring', stiffness: 350, damping: 30 }} />
        )}
        <Icon className={cn('h-[18px] w-[18px] shrink-0', isActive ? 'text-primary-600' : 'text-neutral-400 group-hover:text-neutral-600')} />
        {!isCollapsed && <span className="truncate whitespace-nowrap">{item.title}</span>}
        {item.badge && !isCollapsed && (
          <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-primary-100 px-1.5 text-[10px] font-semibold text-primary-700">{item.badge}</span>
        )}
        {item.badge && isCollapsed && <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary-500" />}
      </Link>
    </li>
  )
}
