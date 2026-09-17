import Link from 'next/link'
import { motion } from 'framer-motion'
import { MapPin, Calendar, ArrowRight } from 'lucide-react'

interface ItemCardProps {
  item: {
    id: string
    type: 'LOST' | 'FOUND'
    title: string
    location: string
    date_lost_found: string
    category: string
    status: string
  }
  index?: number
}

export function ItemCard({ item, index = 0 }: ItemCardProps) {
  const isLost = item.type === 'LOST'

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -60px 0px' }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link
        href={`/items/${item.id}`}
        className="group block bg-base-850/70 border border-border-subtle rounded-md transition-colors duration-200 hover:bg-base-800/70 hover:border-border-default"
      >
        <div className="p-4 sm:p-5">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className={`inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] font-medium tracking-wide border ${
              isLost
                ? 'bg-status-lost/10 text-status-lost border border-status-lost/20'
                : 'bg-status-found/10 text-status-found border border-status-found/20'
            }`}>
              {item.type}
            </span>
            {item.status !== 'OPEN' && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-sm bg-base-700/30 text-[10px] font-medium text-text-muted border border-border-subtle">
                {item.status.charAt(0) + item.status.slice(1).toLowerCase()}
              </span>
            )}
            <span className="text-caption text-text-muted sm:ml-auto">{item.category}</span>
          </div>

          <h4 className="text-[15px] font-medium text-text-primary mb-4 group-hover:text-accent transition-colors duration-200 line-clamp-2">
            {item.title}
          </h4>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[12px] text-text-muted mb-4">
            <span className="inline-flex min-w-0 items-center gap-1.5">
              <MapPin className="w-3 h-3" />
              <span className="truncate">{item.location}</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="w-3 h-3" />
              <span>{formatDate(item.date_lost_found)}</span>
            </span>
          </div>
          <div className="pt-3 border-t border-border-subtle/70 flex items-center justify-end">
            <span className="text-[11px] text-text-muted group-hover:text-accent transition-colors duration-200 flex items-center gap-1.5">
              View
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform duration-200" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
