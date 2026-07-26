import { useState, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { Pencil, X, Check } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface InfoField {
  label: string
  value: string | ReactNode
  span?: 1 | 2
}

interface InfoSectionProps {
  title: string
  icon: LucideIcon
  fields: InfoField[]
  editable?: boolean
  /** Edit form content. Receives a close function to exit edit mode. */
  editForm?: ReactNode
  onSave?: () => void
  delay?: number
}

export function InfoSection({
  title,
  icon: Icon,
  fields,
  editable = false,
  editForm,
  onSave,
  delay = 0,
}: InfoSectionProps) {
  const [isEditing, setIsEditing] = useState(false)

  const handleSave = () => {
    onSave?.()
    setIsEditing(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: delay * 0.08 }}
      className="rounded-xl border border-border bg-white shadow-xs"
    >
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-100">
            <Icon className="h-4 w-4 text-neutral-600" />
          </div>
          <h3 className="text-sm font-semibold text-neutral-900">{title}</h3>
        </div>
        {editable && (
          <div className="flex items-center gap-1">
            {isEditing ? (
              <>
                <button onClick={() => setIsEditing(false)} className="flex h-7 w-7 items-center justify-center rounded-md text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600">
                  <X className="h-3.5 w-3.5" />
                </button>
                <button onClick={handleSave} className="flex h-7 items-center gap-1 rounded-md bg-primary-600 px-2.5 text-xs font-medium text-white hover:bg-primary-700">
                  <Check className="h-3 w-3" />Save
                </button>
              </>
            ) : (
              <button onClick={() => setIsEditing(true)} className="flex h-7 items-center gap-1.5 rounded-md border border-border px-2.5 text-xs font-medium text-neutral-600 hover:bg-neutral-50">
                <Pencil className="h-3 w-3" />Edit
              </button>
            )}
          </div>
        )}
      </div>

      <div className="p-5">
        {isEditing && editForm ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
            {editForm}
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
            {fields.map((field, i) => (
              <div key={i} className={cn(field.span === 2 && 'sm:col-span-2')}>
                <dt className="text-xs font-medium text-neutral-400 uppercase tracking-wider">{field.label}</dt>
                <dd className="mt-1 text-sm text-neutral-800">{field.value || <span className="text-neutral-300">—</span>}</dd>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}
