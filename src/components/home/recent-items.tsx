'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, MapPin, Calendar, Package } from 'lucide-react'

const easeOut = [0.4, 0, 0.2, 1] as const

const items = [
  { id: '1', type: 'LOST', title: 'Black wireless earbuds', location: 'Main Library', date: 'Sep 8, 2026', category: 'Electronics' },
  { id: '2', type: 'FOUND', title: 'Silver house keys with keychain', location: 'Student Center', date: 'Sep 7, 2026', category: 'Keys' },
  { id: '3', type: 'LOST', title: 'Blue backpack with laptop', location: 'Science Building', date: 'Sep 6, 2026', category: 'Bags' },
  { id: '4', type: 'FOUND', title: 'Student ID card', location: 'Cafeteria', date: 'Sep 5, 2026', category: 'ID Cards' },
  { id: '5', type: 'LOST', title: 'Gold wristwatch', location: 'Gym', date: 'Sep 4, 2026', category: 'Jewelry' },
  { id: '6', type: 'FOUND', title: 'Notebook with handwritten notes', location: 'Library 2nd Floor', date: 'Sep 3, 2026', category: 'Books' },
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
        className="group block bg-base-850 border border-border-subtle rounded-lg overflow-hidden transition-all duration-200 hover:border-border-strong"
      >
        <div className="relative aspect-[4/3] bg-base-900/50 flex items-center justify-center overflow-hidden">
          <Package className="w-8 h-8 text-text-muted/20 transition-transform duration-300 group-hover:scale-110" />
          <div className="absolute top-3 left-3">
            <span className={`label-tag ${isLost ? '!text-status-lost !border-status-lost/20 !bg-status-lost/10' : '!text-status-found !border-status-found/20 !bg-status-found/10'}`}>
              {item.type}
            </span>
          </div>
        </div>

        <div className="p-4">
          <h4 className="text-[14px] font-medium text-text-primary mb-2 group-hover:text-accent transition-colors line-clamp-1">{item.title}</h4>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-[12px] text-text-muted"><MapPin className="w-3 h-3 shrink-0" /><span className="truncate">{item.location}</span></div>
            <div className="flex items-center gap-2 text-[12px] text-text-muted"><Calendar className="w-3 h-3 shrink-0" /><span>{item.date}</span></div>
          </div>
          <div className="mt-3 pt-3 border-t border-border-subtle">
            <span className="text-mono">{item.category}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export function RecentItems() {
  return (
    <section className="section-spacing border-t border-border-subtle">
      <div className="container-tight">
        <div className="flex items-end justify-between mb-12">
          <div>
            <span className="label-tag-accent mb-3 inline-flex">Live Feed</span>
            <motion.h2 className="text-h2 mt-3 mb-2" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, ease: easeOut }}>
              Recent Lost & Found
            </motion.h2>
            <motion.p className="text-body" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1, ease: easeOut }}>
              Latest items reported on campus
            </motion.p>
          </div>
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2, ease: easeOut }}>
            <Link href="/items" className="hidden sm:inline-flex items-center gap-2 text-[13px] font-medium text-text-secondary hover:text-accent transition-colors">
              View all items <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </motion.div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item, index) => (<ItemCard key={item.id} item={item} index={index} />))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link href="/items" className="inline-flex items-center gap-2 text-[13px] font-medium text-text-secondary hover:text-accent">
            View all items <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  )
}
