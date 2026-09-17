import Link from 'next/link'
import { categoryLabel, reportDate } from '@/lib/item-display'

export interface ReportRecord {
  id: string
  type: 'LOST' | 'FOUND'
  title: string
  location: string
  date_lost_found: string
  category: string
  status: string
  image_url?: string | null
}

export function ReportStatus({ type, status }: Pick<ReportRecord, 'type' | 'status'>) {
  return <span className="inline-flex flex-wrap items-center gap-2 text-xs font-medium"><span className={type === 'LOST' ? 'text-[#f2aba7]' : 'text-[#9ec9ff]'}>{type}</span><span className="text-text-secondary">{status === 'OPEN' ? 'Open' : status.charAt(0) + status.slice(1).toLowerCase()}</span></span>
}

export function ItemRow({ item }: { item: ReportRecord }) {
  return (
    <li className="border-b border-border-default">
      <Link href={`/items/${item.id}`} className="grid gap-3 p-4 hover:bg-base-900 transition-colors sm:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)_auto] sm:items-center">
        <div className="min-w-0"><ReportStatus type={item.type} status={item.status} /><h3 className="font-medium text-sm mt-2 break-words">{item.title}</h3><p className="text-xs text-text-secondary mt-1">{categoryLabel(item.category)}</p></div>
        <div className="min-w-0 text-sm text-text-secondary"><p className="break-words">{item.location}</p><time className="block text-xs mt-1" dateTime={item.date_lost_found}>{reportDate(item.date_lost_found)}</time></div>
        <span className="text-sm">View report →</span>
      </Link>
    </li>
  )
}
