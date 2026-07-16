import { cn } from '@/lib/utils'

// ─── Base Skeleton ────────────────────────────────────────────────────────────

interface SkeletonProps {
  className?: string
  style?: React.CSSProperties
}

export function Skeleton({ className, style }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-neutral-100',
        className,
      )}
      style={style}
    />
  )
}

// ─── Card Skeleton ────────────────────────────────────────────────────────────

export function CardSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-xl border border-border bg-white p-5">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-8 w-8 rounded-lg" />
          </div>
          <div className="mt-4 space-y-2">
            <Skeleton className="h-7 w-24" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Table Skeleton ───────────────────────────────────────────────────────────

export function TableSkeleton({ rows = 5, columns = 5 }: { rows?: number; columns?: number }) {
  return (
    <div className="rounded-xl border border-border bg-white overflow-hidden">
      {/* Header */}
      <div className="border-b border-border bg-neutral-50 px-4 py-3">
        <div className="flex gap-4">
          {Array.from({ length: columns }).map((_, i) => (
            <Skeleton key={i} className="h-4 flex-1" />
          ))}
        </div>
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, row) => (
        <div key={row} className="border-b border-border px-4 py-3.5 last:border-0">
          <div className="flex items-center gap-4">
            {Array.from({ length: columns }).map((_, col) => (
              <Skeleton
                key={col}
                className={cn(
                  'h-4 flex-1',
                  col === 0 && 'max-w-[180px]',
                  col === columns - 1 && 'max-w-[80px]',
                )}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── List Skeleton ────────────────────────────────────────────────────────────

export function ListSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 rounded-lg border border-border bg-white px-4 py-3.5">
          <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-3 w-32" />
          </div>
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
      ))}
    </div>
  )
}

// ─── Profile Skeleton ─────────────────────────────────────────────────────────

export function ProfileSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-white p-6">
      <div className="flex items-center gap-5">
        <Skeleton className="h-16 w-16 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-56" />
          <Skeleton className="h-3 w-32" />
        </div>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-5 w-24" />
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Chart Skeleton ───────────────────────────────────────────────────────────

export function ChartSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-white p-6">
      <div className="mb-4 space-y-2">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-3 w-48" />
      </div>
      <div className="flex items-end gap-2 h-48">
        {Array.from({ length: 12 }).map((_, i) => (
          <Skeleton
            key={i}
            className="flex-1 rounded-t-sm"
            style={{ height: `${Math.random() * 60 + 30}%` }}
          />
        ))}
      </div>
    </div>
  )
}

// ─── Page Skeleton (combines multiple) ────────────────────────────────────────

export function PageSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-4 w-72" />
        </div>
        <Skeleton className="h-9 w-32 rounded-lg" />
      </div>
      {/* Stats */}
      <CardSkeleton count={4} />
      {/* Content */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ChartSkeleton />
        </div>
        <ListSkeleton rows={4} />
      </div>
    </div>
  )
}
