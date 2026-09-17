import { cn } from '@/lib/utils'

type ClaimStatus = 'pending' | 'approved' | 'rejected' | string

const STYLES: Record<ClaimStatus, string> = {
  pending: 'border-text-muted/30 text-text-secondary',
  approved: 'border-status-found text-status-found',
  rejected: 'border-text-muted/30 text-text-muted',
}

const LABELS: Record<ClaimStatus, string> = {
  pending: 'Pending review',
  approved: 'Approved',
  rejected: 'Not approved',
}

export function ClaimStatusBadge({ status, className }: { status: string; className?: string }) {
  const key: ClaimStatus = status as ClaimStatus
  return (
    <span className={cn('inline-flex items-center px-2 py-0.5 text-xs font-medium border-b-2', STYLES[key] ?? STYLES.pending, className)}>
      {LABELS[key] ?? status}
    </span>
  )
}