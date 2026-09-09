import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { MapPin, Calendar, Package } from 'lucide-react'

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
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.06, ease: [0.4, 0, 0.2, 1] }}
    >
      <Link
        href={`/items/${item.id}`}
        className="group block bg-card border border-border/40 rounded-2xl overflow-hidden transition-all duration-200 hover:border-border/60"
      >
        {/* Image area */}
        <div className="relative aspect-[4/3] bg-secondary/50 flex items-center justify-center overflow-hidden">
          {item.image_url ? (
            <Image
              src={item.image_url}
              alt={item.title}
              fill
              sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <Package className="w-10 h-10 text-muted-foreground/30 transition-transform duration-300 group-hover:scale-110" />
          )}
          {/* Type badge */}
          <div className="absolute top-3 left-3">
            <span
              className={`inline-flex items-center px-2 py-1 rounded-full text-caption font-medium ${
                isLost
                  ? 'bg-destructive/10 text-destructive'
                  : 'bg-emerald-500/10 text-emerald-600'
              }`}
            >
              {item.type}
            </span>
          </div>
          {/* Status badge */}
          {item.status !== 'OPEN' && (
            <div className="absolute top-3 right-3">
              <span className="inline-flex items-center px-2 py-1 rounded-full bg-background/90 backdrop-blur-sm text-caption font-medium text-muted-foreground">
                {item.status.charAt(0) + item.status.slice(1).toLowerCase()}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h4 className="text-body font-medium text-foreground mb-2 group-hover:text-foreground/80 transition-colors line-clamp-1">
            {item.title}
          </h4>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-small text-muted-foreground">
              <MapPin className="w-3 h-3 shrink-0" />
              <span className="truncate">{item.location}</span>
            </div>
            <div className="flex items-center gap-2 text-small text-muted-foreground">
              <Calendar className="w-3 h-3 shrink-0" />
              <span>{formatDate(item.date_lost_found)}</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-border/30">
            <span className="text-caption text-muted-foreground">{item.category}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}
