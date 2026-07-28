import { motion } from 'framer-motion'
import { Award, ExternalLink, Shield, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Certification } from '../data'

interface CertificationsSectionProps {
  certifications: Certification[]
  delay?: number
}

export function CertificationsSection({ certifications, delay = 0 }: CertificationsSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: delay * 0.08 }}
      className="rounded-xl border border-border bg-white shadow-xs"
    >
      <div className="flex items-center gap-2.5 border-b border-border px-5 py-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-100">
          <Shield className="h-4 w-4 text-neutral-600" />
        </div>
        <h3 className="text-sm font-semibold text-neutral-900">Certifications</h3>
        <span className="ml-auto rounded-full bg-neutral-100 px-2 py-0.5 text-[11px] font-medium text-neutral-500">
          {certifications.length}
        </span>
      </div>

      <div className="divide-y divide-border">
        {certifications.map((cert) => (
          <CertCard key={cert.id} cert={cert} />
        ))}
      </div>
    </motion.div>
  )
}

function CertCard({ cert }: { cert: Certification }) {
  return (
    <div className="flex items-start gap-4 px-5 py-4 transition-colors hover:bg-neutral-25">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50">
        <Award className="h-5 w-5 text-primary-600" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-sm font-medium text-neutral-900">{cert.title}</p>
            <p className="mt-0.5 text-xs text-neutral-500">{cert.issuer}</p>
          </div>
          {cert.verified && (
            <CheckCircle2 className="h-4 w-4 shrink-0 text-success-500 mt-0.5" />
          )}
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-neutral-400">
          <span>Issued {formatDate(cert.issueDate)}</span>
          {cert.expiryDate && <span>Expires {formatDate(cert.expiryDate)}</span>}
          <span className="font-mono text-[11px]">{cert.credentialId}</span>
        </div>
        {cert.credentialUrl && (
          <a
            href={cert.credentialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              'mt-2 inline-flex items-center gap-1 text-xs font-medium text-primary-600 hover:text-primary-700',
            )}
          >
            View credential <ExternalLink className="h-3 w-3" />
          </a>
        )}
      </div>
    </div>
  )
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}
