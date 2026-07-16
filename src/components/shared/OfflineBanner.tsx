import { motion, AnimatePresence } from 'framer-motion'
import { WifiOff } from 'lucide-react'
import { useOnlineStatus } from '@/hooks/use-online-status'

export function OfflineBanner() {
  const isOnline = useOnlineStatus()

  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.div
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -40, opacity: 0 }}
          className="fixed top-0 left-0 right-0 z-[300] flex items-center justify-center gap-2 bg-neutral-900 px-4 py-2"
        >
          <WifiOff className="h-3.5 w-3.5 text-white" />
          <span className="text-xs font-medium text-white">You're offline. Some features may not work.</span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
