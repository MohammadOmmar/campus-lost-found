import { cn } from '@/lib/utils'

type ItemStatus = 'OPEN' | 'CLAIMED' | 'RETURNED' | 'CLOSED'

const STATUS_STYLES: Record<ItemStatus, string> = {
  OPEN: 'bg-base-700/10 text-text-muted',
  CLAIMED: 'bg-status-match/10 text-status-match',
  RETURNED: 'bg-status-found/10 text-status-found',
  CLOSED: 'bg-muted/50 text-text-muted',
}

const STATUS_LABELS: Record<ItemStatus, string> = {
  OPEN: 'Open',
  CLAIMED: 'Claimed',
  RETURNED: 'Returned',
  CLOSED: 'Closed',
}

export function ItemStatusBadge({ status, className }: { status: string; className?: string }) {
  const key = status as ItemStatus
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium uppercase tracking-wide',
        STATUS_STYLES[key] ?? STATUS_STYLES.OPEN,
        className
      )}
    >
      {STATUS_LABELS[key] ?? status}
    </span>
  )
}
