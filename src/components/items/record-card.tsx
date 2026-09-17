import Link from 'next/link'
import Image from 'next/image'
import { categoryLabel, reportDate } from '@/lib/item-display'
import { ReportStatus, type ReportRecord } from './item-row'

export function RecordCard({ item }: { item: ReportRecord; index?: number }) {
  return (
    <Link href={`/items/${item.id}`} className="group block h-full min-w-0 rounded-md border border-border-default bg-base-900 p-4 transition-colors hover:bg-base-850">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0"><ReportStatus type={item.type} status={item.status} /><h2 className="text-base font-medium mt-3 break-words group-hover:underline underline-offset-4">{item.title}</h2></div>
        {item.image_url && <Image src={item.image_url} alt="" width={64} height={64} className="h-16 w-16 shrink-0 rounded-sm object-cover" />}
      </div>
      <p className="text-xs text-text-secondary mt-2">{categoryLabel(item.category)}</p>
      <div className="mt-4 border-t border-border-default pt-3 text-sm text-text-secondary">
        <p className="break-words">{item.location}</p>
        <div className="flex flex-wrap justify-between gap-2 mt-2 text-xs"><time dateTime={item.date_lost_found}>{reportDate(item.date_lost_found)}</time><span className="text-text-primary">View report →</span></div>
      </div>
    </Link>
  )
}
