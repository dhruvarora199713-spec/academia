import { motion } from 'framer-motion'
import { Code2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Skill } from '../data'

interface SkillsSectionProps {
  skills: Skill[]
  delay?: number
}

const categoryLabels = {
  language: 'Languages',
  framework: 'Frameworks',
  database: 'Databases',
  tool: 'Tools & Platforms',
  'soft-skill': 'Soft Skills',
}

const proficiencyColors = {
  beginner: 'bg-neutral-100 text-neutral-600 border-neutral-200',
  intermediate: 'bg-primary-50 text-primary-700 border-primary-200',
  advanced: 'bg-success-50 text-success-700 border-success-200',
  expert: 'bg-warning-50 text-warning-700 border-warning-200',
}

export function SkillsSection({ skills, delay = 0 }: SkillsSectionProps) {
  const grouped = Object.entries(categoryLabels).map(([key, label]) => ({
    category: label,
    items: skills.filter((s) => s.category === key),
  })).filter((g) => g.items.length > 0)

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: delay * 0.08 }}
      className="rounded-xl border border-border bg-white shadow-xs"
    >
      <div className="flex items-center gap-2.5 border-b border-border px-5 py-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-100">
          <Code2 className="h-4 w-4 text-neutral-600" />
        </div>
        <h3 className="text-sm font-semibold text-neutral-900">Skills & Technologies</h3>
        <span className="ml-auto rounded-full bg-neutral-100 px-2 py-0.5 text-[11px] font-medium text-neutral-500">
          {skills.length}
        </span>
      </div>

      <div className="p-5 space-y-5">
        {grouped.map((group) => (
          <div key={group.category}>
            <p className="text-xs font-medium text-neutral-400 uppercase tracking-wider mb-2">
              {group.category}
            </p>
            <div className="flex flex-wrap gap-2">
              {group.items.map((skill) => (
                <span
                  key={skill.id}
                  className={cn(
                    'inline-flex items-center rounded-lg border px-2.5 py-1 text-xs font-medium transition-shadow hover:shadow-sm',
                    proficiencyColors[skill.proficiency],
                  )}
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
