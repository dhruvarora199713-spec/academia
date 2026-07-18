import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Bell, Menu, Command, ChevronDown, User, Settings, LogOut, HelpCircle, Loader2, CheckCheck } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useSidebarContext } from '@/store/sidebar-context'
import { useAuth } from '@/store/auth-context'
import { useProfile } from '@/store/profile-context'
import { CommandPalette, useCommandPalette } from '@/components/shared/CommandPalette'
import { getNotifications, getUnreadCount, markAsRead, markAllAsRead } from '@/services/notifications/notification.service'
import { Breadcrumbs } from './Breadcrumbs'

export function Header() {
  const { toggleMobile } = useSidebarContext()
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const commandPalette = useCommandPalette()

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b border-border bg-white/95 px-4 backdrop-blur-sm lg:px-6">
      <button onClick={toggleMobile} className="flex h-8 w-8 items-center justify-center rounded-md text-neutral-500 hover:bg-neutral-100 lg:hidden">
        <Menu className="h-5 w-5" />
      </button>
      <div className="hidden lg:block"><Breadcrumbs /></div>
      <div className="flex-1" />
      <div className="flex items-center gap-1">
        <button onClick={() => commandPalette.setOpen(true)} className="flex h-8 items-center gap-2 rounded-lg border border-border bg-neutral-50 px-3 text-sm text-neutral-400 hover:border-neutral-300 hover:bg-white">
          <Search className="h-3.5 w-3.5" />
          <span className="hidden md:inline">Search...</span>
          <kbd className="hidden h-5 items-center gap-0.5 rounded border border-neutral-200 bg-white px-1.5 font-mono text-[10px] text-neutral-400 md:flex">
            <Command className="h-2.5 w-2.5" />K
          </kbd>
        </button>
        <CommandPalette open={commandPalette.open} onClose={commandPalette.onClose} />
        <NotificationDropdown />
        <ProfileMenu isOpen={isProfileOpen} setIsOpen={setIsProfileOpen} />
      </div>
    </header>
  )
}

function NotificationDropdown() {
  const [open, setOpen] = useState(false)
  const [, forceUpdate] = useState(0)
  const navigate = useNavigate()
  const notifications = getNotifications()
  const unreadCount = getUnreadCount()

  const handleMarkAll = () => { markAllAsRead(); forceUpdate((n) => n + 1) }
  const handleClick = (id: string, url?: string) => {
    markAsRead(id); forceUpdate((n) => n + 1)
    if (url) { navigate(url); setOpen(false) }
  }

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="relative flex h-8 w-8 items-center justify-center rounded-md text-neutral-500 hover:bg-neutral-100">
        <Bell className="h-[18px] w-[18px]" />
        {unreadCount > 0 && <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary-500 ring-2 ring-white" />}
      </button>
      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div initial={{ opacity: 0, y: -4, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -4, scale: 0.97 }} transition={{ duration: 0.15 }} className="absolute right-0 top-full z-50 mt-2 w-80 overflow-hidden rounded-xl border border-border bg-white shadow-lg">
              <div className="flex items-center justify-between border-b border-border px-4 py-3">
                <h3 className="text-sm font-semibold text-neutral-900">Notifications</h3>
                {unreadCount > 0 && (
                  <button onClick={handleMarkAll} className="flex items-center gap-1 text-[11px] font-medium text-primary-600 hover:text-primary-700">
                    <CheckCheck className="h-3 w-3" />Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-[360px] overflow-y-auto divide-y divide-border">
                {notifications.slice(0, 6).map((n) => (
                  <button key={n.id} onClick={() => handleClick(n.id, n.actionUrl)} className={cn('flex w-full gap-3 px-4 py-3 text-left transition-colors hover:bg-neutral-50', !n.isRead && 'bg-primary-50/30')}>
                    <div className={cn('mt-0.5 h-2 w-2 shrink-0 rounded-full', n.isRead ? 'bg-transparent' : 'bg-primary-500')} />
                    <div className="flex-1 min-w-0">
                      <p className={cn('text-xs font-medium truncate', n.isRead ? 'text-neutral-700' : 'text-neutral-900')}>{n.title}</p>
                      <p className="text-[11px] text-neutral-500 truncate mt-0.5">{n.body}</p>
                      <p className="text-[10px] text-neutral-400 mt-1">{timeAgo(n.createdAt)}</p>
                    </div>
                  </button>
                ))}
              </div>
              <div className="border-t border-border px-4 py-2.5 text-center">
                <button onClick={() => { navigate('/notifications'); setOpen(false) }} className="text-xs font-medium text-primary-600 hover:text-primary-700">View all notifications</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const hours = Math.floor(diff / (1000 * 60 * 60))
  if (hours < 1) return 'Just now'
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

function ProfileMenu({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (v: boolean) => void }) {
  const { user, profile, logout } = useAuth()
  const { userDoc, studentDoc } = useProfile()
  const navigate = useNavigate()
  const [loggingOut, setLoggingOut] = useState(false)

  const displayName = studentDoc?.fullName || userDoc?.displayName || profile?.displayName || user?.displayName || 'User'
  const email = userDoc?.email || profile?.email || user?.email || ''
  const avatarUrl = studentDoc?.avatar || userDoc?.photoURL || user?.photoURL || null
  const initials = displayName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)

  const handleLogout = async () => {
    setLoggingOut(true)
    await logout()
    navigate('/login', { replace: true })
  }

  const menuItems = [
    { icon: User, label: 'Profile', action: () => { setIsOpen(false); navigate('/profile') } },
    { icon: Settings, label: 'Settings', action: () => { setIsOpen(false); navigate('/settings') } },
    { icon: HelpCircle, label: 'Help', action: () => { setIsOpen(false); navigate('/help') } },
  ]

  return (
    <div className="relative">
      <button onClick={() => setIsOpen(!isOpen)} className={cn('flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-neutral-50', isOpen && 'bg-neutral-50')}>
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-100 text-xs font-semibold text-primary-700 overflow-hidden">
          {avatarUrl ? <img src={avatarUrl} alt="" className="h-full w-full object-cover" /> : initials}
        </div>
        <ChevronDown className={cn('h-3.5 w-3.5 text-neutral-400 transition-transform', isOpen && 'rotate-180')} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <motion.div initial={{ opacity: 0, y: -4, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -4, scale: 0.97 }} transition={{ duration: 0.15 }} className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-xl border border-border bg-white p-1 shadow-lg">
              <div className="border-b border-border px-3 py-2.5 mb-1">
                <p className="text-sm font-medium text-neutral-900">{displayName}</p>
                <p className="text-xs text-neutral-500 truncate">{email}</p>
              </div>
              {menuItems.map(({ icon: Icon, label, action }) => (
                <button key={label} onClick={action} className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-neutral-700 hover:bg-neutral-50">
                  <Icon className="h-4 w-4" />{label}
                </button>
              ))}
              <div className="my-1 border-t border-border" />
              <button onClick={handleLogout} disabled={loggingOut} className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-error-600 hover:bg-error-50 disabled:opacity-50">
                {loggingOut ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
                Sign out
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
