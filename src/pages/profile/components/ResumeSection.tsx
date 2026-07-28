import { motion } from 'framer-motion'
import { FileText, Download, Upload, Calendar } from 'lucide-react'
import type { ResumeInfo } from '../data'

interface ResumeSectionProps {
  resume: ResumeInfo
  delay?: number
}

export function ResumeSection({ resume, delay = 0 }: ResumeSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: delay * 0.08 }}
      className="rounded-xl border border-border bg-white p-5 shadow-xs"
    >
      <div className="flex items-center gap-2.5 mb-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-100">
          <FileText className="h-4 w-4 text-neutral-600" />
        </div>
        <h3 className="text-sm font-semibold text-neutral-900">Resume</h3>
      </div>

      {/* File card */}
      <div className="rounded-lg border border-border bg-neutral-50 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-error-50">
            <FileText className="h-5 w-5 text-error-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-neutral-900 truncate">{resume.fileName}</p>
            <div className="mt-0.5 flex items-center gap-3 text-xs text-neutral-400">
              <span>{resume.fileSize}</span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Updated {new Date(resume.lastUpdated).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-4 flex gap-2">
        <a
          href={resume.downloadUrl}
          download
          className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-700"
        >
          <Download className="h-4 w-4" />
          Download
        </a>
        <button className="flex items-center justify-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50">
          <Upload className="h-4 w-4" />
          Update
        </button>
      </div>
    </motion.div>
  )
}
