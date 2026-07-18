import type { ReactNode } from 'react'
import { motion } from 'framer-motion'

interface PageWrapperProps {
  children: ReactNode
  title?: string
  className?: string
}

export function PageWrapper({ children, title, className = '' }: PageWrapperProps) {
  return (
    <motion.main
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'tween', ease: [0.4, 0, 0.2, 1], duration: 0.3 }}
      className={`flex-1 px-4 py-6 lg:px-6 lg:py-8 ${className}`}
      role="main"
      aria-label={title}
    >
      {children}
    </motion.main>
  )
}
