import { cn } from '@/lib/utils'

type ClaimStatus = 'pending' | 'approved' | 'rejected'

const STYLES: Record<ClaimStatus, string> = {
  pending: 'bg-amber-500/10 text-amber-700 dark:text-amber-400',
  approved: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
  rejected: 'bg-secondary text-muted-foreground',
}

const LABELS: Record<ClaimStatus, string> = {
  pending: 'Pending review',
  approved: 'Approved',
  rejected: 'Not approved',
}

export function ClaimStatusBadge({
  status,
  className,
}: {
  status: string
  className?: string
}) {
  const key = status as ClaimStatus
  return (
    <span
      className={cn(
        'inline-flex items-center px-3 py-1 rounded-full text-caption font-medium',
        STYLES[key] ?? STYLES.pending,
        className
      )}
    >
      {LABELS[key] ?? status}
    </span>
  )
}
