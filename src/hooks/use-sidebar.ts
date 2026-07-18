import { useState, useCallback, useEffect } from 'react'
import { BREAKPOINTS } from '@/constants'

const SIDEBAR_COLLAPSED_KEY = 'academia-sidebar-collapsed'

export function useSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (typeof window === 'undefined') return false
    return localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === 'true'
  })
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  useEffect(() => {
    localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(isCollapsed))
  }, [isCollapsed])

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= BREAKPOINTS.LG) setIsMobileOpen(false)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const toggle = useCallback(() => setIsCollapsed((p) => !p), [])
  const collapse = useCallback(() => setIsCollapsed(true), [])
  const expand = useCallback(() => setIsCollapsed(false), [])
  const toggleMobile = useCallback(() => setIsMobileOpen((p) => !p), [])
  const closeMobile = useCallback(() => setIsMobileOpen(false), [])

  return { isCollapsed, isMobileOpen, toggle, collapse, expand, toggleMobile, closeMobile }
}
