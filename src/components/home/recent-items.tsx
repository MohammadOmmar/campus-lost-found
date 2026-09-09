'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, MapPin, Calendar, Package } from 'lucide-react'

const easeOut = [0.4, 0, 0.2, 1] as const

// Sample data for demonstration
const items = [
  {
    id: '1',
    type: 'LOST',
    title: 'Black wireless earbuds',
    location: 'Main Library',
    date: 'Sep 8, 2026',
    category: 'Electronics',
    hasImage: false,
  },
  {
    id: '2',
    type: 'FOUND',
    title: 'Silver house keys with keychain',
    location: 'Student Center',
    date: 'Sep 7, 2026',
    category: 'Keys',
    hasImage: false,
  },
  {
    id: '3',
    type: 'LOST',
    title: 'Blue backpack with laptop',
    location: 'Science Building',
    date: 'Sep 6, 2026',
    category: 'Bags',
    hasImage: false,
  },
  {
    id: '4',
    type: 'FOUND',
    title: 'Student ID card',
    location: 'Cafeteria',
    date: 'Sep 5, 2026',
    category: 'ID Cards',
    hasImage: false,
  },
  {
    id: '5',
    type: 'LOST',
    title: 'Gold wristwatch',
    location: 'Gym',
    date: 'Sep 4, 2026',
    category: 'Jewelry',
    hasImage: false,
  },
  {
    id: '6',
    type: 'FOUND',
    title: 'Notebook with handwritten notes',
    location: 'Library 2nd Floor',
    date: 'Sep 3, 2026',
    category: 'Books',
    hasImage: false,
  },
]

function ItemCard({ item, index }: { item: typeof items[0]; index: number }) {
  const isLost = item.type === 'LOST'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.06, ease: easeOut }}
    >
      <Link
        href="#"
        className="group block bg-card border border-border/40 rounded-2xl overflow-hidden transition-all duration-200 hover:border-border/60"
      >
        {/* Image area */}
        <div className="relative aspect-[4/3] bg-secondary/50 flex items-center justify-center overflow-hidden">
          <Package className="w-10 h-10 text-muted-foreground/30 transition-transform duration-300 group-hover:scale-110" />
          {/* Type badge */}
          <div className="absolute top-3 left-3">
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-caption font-medium ${
              isLost
                ? 'bg-destructive/10 text-destructive'
                : 'bg-emerald-500/10 text-emerald-600'
            }`}>
              {item.type}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h4 className="text-body font-medium text-foreground mb-2 group-hover:text-foreground/80 transition-colors">
            {item.title}
          </h4>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-small text-muted-foreground">
              <MapPin className="w-3 h-3" />
              <span>{item.location}</span>
            </div>
            <div className="flex items-center gap-2 text-small text-muted-foreground">
              <Calendar className="w-3 h-3" />
              <span>{item.date}</span>
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

export function RecentItems() {
  return (
    <section className="section-spacing border-t border-border/40">
      <div className="container-wide">
        <div className="flex items-end justify-between mb-12">
          <div>
            <motion.h2
              className="text-h2 mb-3"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: easeOut }}
            >
              Recent Lost & Found
            </motion.h2>
            <motion.p
              className="text-body text-muted-foreground"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1, ease: easeOut }}
            >
              Latest items reported on campus
            </motion.p>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2, ease: easeOut }}
          >
            <Link
              href="/items"
              className="hidden sm:inline-flex items-center gap-2 text-sm font-medium text-foreground hover:text-muted-foreground transition-colors"
            >
              View all items
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>

        {/* Items grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((item, index) => (
            <ItemCard key={item.id} item={item} index={index} />
          ))}
        </div>

        {/* Mobile view all link */}
        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/items"
            className="inline-flex items-center gap-2 text-sm font-medium text-foreground"
          >
            View all items
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
