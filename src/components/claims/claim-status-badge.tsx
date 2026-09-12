import { cn } from '@/lib/utils'

type ClaimStatus = 'pending' | 'approved' | 'rejected'

const STYLES: Record<ClaimStatus, string> = {
  pending: 'bg-status-match/10 text-status-match',
  approved: 'bg-status-found/10 text-status-found',
  rejected: 'bg-base-700 text-text-muted',
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
