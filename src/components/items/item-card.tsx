import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { MapPin, ArrowRight } from 'lucide-react'

interface ItemCardProps {
  item: {
    id: string
    type: 'LOST' | 'FOUND'
    title: string
    location: string
    date_lost_found: string
    category: string
    image_url: string | null
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
        className="group block bg-base-850/50 border border-border-subtle rounded-xl overflow-hidden transition-all duration-300 hover:border-border-default hover:shadow-[0_8px_32px_rgba(0,0,0,0.25),_0_2px_8px_rgba(0,0,0,0.15)] hover:-translate-y-[3px]"
      >
        {/* Image */}
        <div className="relative aspect-[4/3] bg-base-900/40 overflow-hidden">
          {item.image_url ? (
            <Image
              src={item.image_url}
              alt={item.title}
              fill
              sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-base-800/50 to-base-900/50">
              <div className="w-12 h-12 rounded-xl bg-base-700/30 flex items-center justify-center border border-border-subtle/50">
                <MapPin className="w-5 h-5 text-text-muted/30" />
              </div>
            </div>
          )}
          {/* Bottom gradient overlay */}
          <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-base-950/50 to-transparent pointer-events-none" />
          {/* Status badge */}
          <div className="absolute top-3 left-3">
            <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium tracking-wide ${
              isLost
                ? 'bg-base-950/80 text-status-lost border border-status-lost/25'
                : 'bg-base-950/80 text-status-found border border-status-found/25'
            }`}>
              {item.type}
            </span>
          </div>
          {/* Status indicator */}
          {item.status !== 'OPEN' && (
            <div className="absolute top-3 right-3">
              <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-base-950/80 text-[10px] font-medium text-text-muted border border-border-subtle">
                {item.status.charAt(0) + item.status.slice(1).toLowerCase()}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h4 className="text-[14px] font-medium text-text-primary mb-2 group-hover:text-accent transition-colors duration-200 line-clamp-1">
            {item.title}
          </h4>
          <div className="flex items-center gap-3 text-[12px] text-text-muted">
            <span className="inline-flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              <span className="truncate">{item.location}</span>
            </span>
            <span className="text-border-strong">·</span>
            <span>{formatDate(item.date_lost_found)}</span>
          </div>
          <div className="mt-3 pt-3 border-t border-border-subtle/60 flex items-center justify-between">
            <span className="text-[11px] text-text-muted uppercase tracking-wide">{item.category}</span>
            <span className="text-[11px] text-text-muted group-hover:text-accent transition-all duration-200 flex items-center gap-1.5">
              View
              <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
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
