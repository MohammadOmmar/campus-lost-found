'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, MapPin } from 'lucide-react'

const easeOutExpo = [0.16, 1, 0.3, 1] as const

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
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -60px 0px' }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: easeOutExpo }}
    >
      <Link
        href="#"
        className="group block bg-base-850/50 border border-border-subtle rounded-xl overflow-hidden transition-all duration-300 hover:border-border-default hover:-translate-y-[3px] hover:shadow-[0_8px_32px_rgba(0,0,0,0.25),_0_2px_8px_rgba(0,0,0,0.15)]"
      >
        <div className="relative aspect-[4/3] bg-base-900/40 overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-base-800/50 to-base-900/50">
            <div className="w-12 h-12 rounded-xl bg-base-700/30 flex items-center justify-center border border-border-subtle/50">
              <MapPin className="w-5 h-5 text-text-muted/30" />
            </div>
          </div>
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-base-900/60 to-transparent pointer-events-none" />
          <div className="absolute top-3 left-3">
            <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium tracking-wide backdrop-blur-md ${
              isLost
                ? 'bg-status-lost/15 text-status-lost border border-status-lost/20'
                : 'bg-status-found/15 text-status-found border border-status-found/20'
            }`}>
              {item.type}
            </span>
          </div>
        </div>

        <div className="p-4">
          <h4 className="text-[14px] font-medium text-text-primary mb-2 group-hover:text-accent transition-colors line-clamp-1">{item.title}</h4>
          <div className="flex items-center gap-3 text-[12px] text-text-muted">
            <span className="inline-flex items-center gap-1"><MapPin className="w-3 h-3" /><span className="truncate">{item.location}</span></span>
            <span className="text-border-strong">·</span>
            <span>{item.date}</span>
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

export function RecentItems() {
  return (
    <section className="section-spacing border-t border-border-subtle">
      <div className="container-tight">
        <div className="flex items-end justify-between mb-12">
          <div>
            <span className="label-tag-accent mb-3 inline-flex">Live Feed</span>
            <motion.h2
              className="text-h2 mt-3 mb-2"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: easeOutExpo }}
            >
              Recent Lost & Found
            </motion.h2>
            <motion.p
              className="text-body"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1, ease: easeOutExpo }}
            >
              Latest items reported on campus
            </motion.p>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2, ease: easeOutExpo }}
          >
            <Link href="/items" className="hidden sm:inline-flex items-center gap-2 text-[13px] font-medium text-text-secondary hover:text-accent transition-colors group">
              View all items
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
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
