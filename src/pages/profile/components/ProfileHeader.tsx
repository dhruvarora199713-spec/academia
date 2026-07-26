import { motion } from 'framer-motion'
import { Camera, Mail, MapPin, Calendar, Edit3, Loader2 } from 'lucide-react'
import type { StudentProfile } from '../data'

interface ProfileHeaderProps {
  data: StudentProfile
  onEdit?: () => void
  onAvatarClick?: () => void
  uploading?: boolean
}

export function ProfileHeader({ data, onEdit, onAvatarClick, uploading }: ProfileHeaderProps) {
  const { personal, academic, contact, stats } = data
  const initials = `${personal.firstName[0]}${personal.lastName[0]}`

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-xl border border-border bg-white p-6 shadow-xs lg:p-8"
    >
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
        {/* Avatar */}
        <div className="relative shrink-0 self-center sm:self-start">
          <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-primary-100 text-2xl font-semibold text-primary-700 lg:h-28 lg:w-28 lg:text-3xl overflow-hidden">
            {personal.avatar ? (
              <img src={personal.avatar} alt={personal.fullName} className="h-full w-full object-cover" />
            ) : (
              initials
            )}
          </div>
          <button
            onClick={onAvatarClick}
            disabled={uploading}
            className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-neutral-900 text-white shadow-md transition-transform hover:scale-110 disabled:opacity-50"
            aria-label="Upload photo"
          >
            {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Camera className="h-3.5 w-3.5" />}
          </button>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0 text-center sm:text-left">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
            <h1 className="text-xl font-semibold tracking-tight text-neutral-900 lg:text-2xl">
              {personal.fullName}
            </h1>
            <div className="flex items-center justify-center gap-2 sm:justify-start">
              <span className="rounded-full bg-primary-100 px-2.5 py-0.5 text-xs font-medium text-primary-700">
                {academic.program} {academic.branch.split(' ').map(w => w[0]).join('')}
              </span>
              <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-medium text-neutral-600">
                Sem {academic.semester}
              </span>
            </div>
          </div>

          <div className="mt-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-sm text-neutral-500 sm:justify-start">
            <span className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" />{contact.email}</span>
            <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />{contact.city}, {contact.state}</span>
            <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" />Batch {academic.batch}</span>
          </div>

          {/* Quick Stats */}
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:gap-4">
            <QuickStat label="CGPA" value={stats.cgpa.toFixed(2)} />
            <QuickStat label="Attendance" value={`${stats.attendance}%`} />
            <QuickStat label="Rank" value={`#${stats.semesterRank}`} subtitle={`of ${stats.batchStrength}`} />
            <QuickStat label="Credits" value={`${stats.creditsCompleted}`} subtitle={`/${stats.creditsTotal}`} />
          </div>
        </div>

        {/* Edit Button */}
        {onEdit && (
          <button onClick={onEdit} className="hidden shrink-0 items-center gap-2 rounded-lg border border-border px-3.5 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50 sm:flex">
            <Edit3 className="h-3.5 w-3.5" />Edit Profile
          </button>
        )}
      </div>
    </motion.div>
  )
}

function QuickStat({ label, value, subtitle }: { label: string; value: string; subtitle?: string }) {
  return (
    <div className="rounded-lg bg-neutral-50 px-3 py-2.5 text-center">
      <p className="text-xs font-medium text-neutral-400">{label}</p>
      <p className="mt-0.5 text-base font-semibold text-neutral-900">
        {value}{subtitle && <span className="text-xs font-normal text-neutral-400">{subtitle}</span>}
      </p>
    </div>
  )
}
