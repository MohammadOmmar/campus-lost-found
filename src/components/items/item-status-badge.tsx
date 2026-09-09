import { cn } from '@/lib/utils'

type ItemStatus = 'OPEN' | 'CLAIMED' | 'RETURNED' | 'CLOSED'

const STATUS_STYLES: Record<ItemStatus, string> = {
  OPEN: 'bg-secondary/10 text-muted-foreground',
  CLAIMED: 'bg-amber-500/10 text-amber-700 dark:text-amber-400',
  RETURNED: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
  CLOSED: 'bg-muted/50 text-muted-foreground',
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
