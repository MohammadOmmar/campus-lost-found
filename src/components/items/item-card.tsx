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
        className="group block bg-card border border-border/30 rounded-2xl overflow-hidden transition-all duration-200 hover:border-border/50 hover:shadow-sm"
      >
        <div className="relative aspect-[4/3] bg-secondary/40 flex items-center justify-center overflow-hidden">
          {item.image_url ? (
            <Image src={item.image_url} alt={item.title} fill sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover transition-transform duration-300 group-hover:scale-105" />
          ) : (
            <Package className="w-9 h-9 text-muted-foreground/20 transition-transform duration-300 group-hover:scale-110" />
          )}
          <div className="absolute top-3 left-3">
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium tracking-wide ${isLost ? 'bg-destructive/10 text-destructive' : 'bg-status-found/10 text-status-found'}`}>
              {item.type}
            </span>
          </div>
          {item.status !== 'OPEN' && (
            <div className="absolute top-3 right-3">
              <span className="inline-flex items-center px-2 py-1 rounded-full bg-background/90 backdrop-blur-sm text-[11px] font-medium text-muted-foreground">
                {item.status.charAt(0) + item.status.slice(1).toLowerCase()}
              </span>
            </div>
          )}
        </div>

        <div className="p-4">
          <h4 className="text-[14px] font-medium text-foreground mb-2 group-hover:text-foreground/80 transition-colors line-clamp-1">{item.title}</h4>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-[12px] text-muted-foreground"><MapPin className="w-3 h-3 shrink-0" /><span className="truncate">{item.location}</span></div>
            <div className="flex items-center gap-2 text-[12px] text-muted-foreground"><Calendar className="w-3 h-3 shrink-0" /><span>{formatDate(item.date_lost_found)}</span></div>
          </div>
          <div className="mt-3 pt-3 border-t border-border/20">
            <span className="text-[11px] text-muted-foreground uppercase tracking-wide">{item.category}</span>
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
