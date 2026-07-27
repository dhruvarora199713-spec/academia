import { motion } from 'framer-motion'
import { FolderKanban, Github, ExternalLink, Users } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Project } from '../data'

interface ProjectsSectionProps {
  projects: Project[]
  delay?: number
}

const statusStyles = {
  'in-progress': { label: 'In Progress', class: 'bg-primary-50 text-primary-700' },
  completed: { label: 'Completed', class: 'bg-success-50 text-success-700' },
  planned: { label: 'Planned', class: 'bg-neutral-100 text-neutral-600' },
}

export function ProjectsSection({ projects, delay = 0 }: ProjectsSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: delay * 0.08 }}
      className="rounded-xl border border-border bg-white shadow-xs"
    >
      <div className="flex items-center gap-2.5 border-b border-border px-5 py-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-100">
          <FolderKanban className="h-4 w-4 text-neutral-600" />
        </div>
        <h3 className="text-sm font-semibold text-neutral-900">Projects</h3>
        <span className="ml-auto rounded-full bg-neutral-100 px-2 py-0.5 text-[11px] font-medium text-neutral-500">
          {projects.length}
        </span>
      </div>

      <div className="divide-y divide-border">
        {projects.map((project) => {
          const status = statusStyles[project.status]
          return (
            <div key={project.id} className="px-5 py-4 transition-colors hover:bg-neutral-25">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-medium text-neutral-900">{project.title}</h4>
                    <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-medium', status.class)}>
                      {status.label}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-neutral-500 line-clamp-2">{project.description}</p>
                </div>
              </div>

              {/* Tech stack */}
              <div className="mt-3 flex flex-wrap gap-1.5">
                {project.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-md bg-neutral-100 px-2 py-0.5 text-[11px] font-medium text-neutral-600"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {/* Footer */}
              <div className="mt-3 flex items-center gap-4 text-xs text-neutral-400">
                <span className="flex items-center gap-1">
                  <Users className="h-3 w-3" />{project.teamSize} {project.teamSize === 1 ? 'member' : 'members'}
                </span>
                <span>
                  {formatProjectDate(project.startDate)}
                  {project.endDate ? ` — ${formatProjectDate(project.endDate)}` : ' — Present'}
                </span>
                <div className="flex items-center gap-2 ml-auto">
                  {project.repoUrl && (
                    <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-neutral-700 transition-colors">
                      <Github className="h-3.5 w-3.5" />
                    </a>
                  )}
                  {project.liveUrl && (
                    <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-primary-600 transition-colors">
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}

function formatProjectDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}
