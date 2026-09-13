'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, Package, KeyRound, CreditCard, Headphones, BookOpen } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { HorizontalMarquee } from '@/components/motion/horizontal-marquee'

const categories = [
  { label: 'Keys', icon: KeyRound },
  { label: 'Wallets', icon: CreditCard },
  { label: 'Earbuds', icon: Headphones },
  { label: 'Backpacks', icon: Package },
  { label: 'Books', icon: BookOpen },
  { label: 'ID Cards', icon: CreditCard },
  { label: 'Bottles', icon: Package },
  { label: 'Chargers', icon: Headphones },
]

const easeOutExpo = [0.16, 1, 0.3, 1] as const

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })

  const headingY = useTransform(scrollYProgress, [0, 1], [0, -28])
  const headingOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const visualScale = useTransform(scrollYProgress, [0, 1], [1, 0.94])
  const visualY = useTransform(scrollYProgress, [0, 1], [0, 24])

  return (
    <section
      ref={sectionRef}
      className="section-hero relative min-h-[100svh] flex flex-col justify-center pt-28 pb-16 overflow-hidden"
    >
      {/* Atmospheric background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-[radial-gradient(ellipse_at_center,rgba(47,128,237,0.06)_0%,transparent_50%)]" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-base-950 to-transparent" />
      </div>

      <div className="container-tight relative z-10">
        {/* Editorial header */}
        <motion.div
          style={{ y: headingY, opacity: headingOpacity }}
          className="mb-8 md:mb-12"
        >
          <motion.span
            className="label-tag-accent mb-5 inline-flex"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: easeOutExpo }}
          >
            Campus Lost & Found
          </motion.span>

          <motion.h1
            className="text-display-lg text-text-primary max-w-[22ch] leading-[1.08]"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: easeOutExpo }}
          >
            Lost something
            <br />
            <span className="italic">on campus?</span>
          </motion.h1>

          <motion.p
            className="text-body-large max-w-md mt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: easeOutExpo }}
          >
            Report what you lost, share what you found, and verify ownership when the right match appears.
          </motion.p>

          {/* CTAs */}
          <motion.div
            className="flex flex-wrap gap-3 mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: easeOutExpo }}
          >
            <Button size="lg" className="h-12 px-6 text-[14px] font-medium" asChild>
              <Link href="/items/new">
                Report Lost
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="h-12 px-6 text-[14px]" asChild>
              <Link href="/items">Browse Found</Link>
            </Button>
          </motion.div>
        </motion.div>

        {/* Object visual */}
        <motion.div
          style={{ scale: visualScale, y: visualY }}
          className="mt-8 md:mt-12"
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="text-caption text-text-muted">RECENT ACTIVITY</span>
            <div className="flex-1 h-px bg-border-subtle" />
            <div className="flex items-center gap-2">
              <div className="status-dot" />
              <span className="text-[10px] font-mono text-accent/70">LIVE</span>
            </div>
          </div>

          {/* Object grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { title: 'AirPods Pro', location: 'Library', type: 'LOST', status: 'open' },
              { title: 'Car keys', location: 'Parking Lot B', type: 'FOUND', status: 'open' },
              { title: 'Student ID', location: 'Cafeteria', type: 'FOUND', status: 'claimed' },
              { title: 'Blue notebook', location: 'Science Hall', type: 'LOST', status: 'open' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 + i * 0.08, ease: easeOutExpo }}
                className="bg-base-850/60 border border-border-subtle rounded-xl p-4 hover:border-border-default transition-all duration-300 group"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium ${
                    item.type === 'LOST'
                      ? 'bg-status-lost/10 text-status-lost'
                      : 'bg-status-found/10 text-status-found'
                  }`}>
                    {item.type}
                  </span>
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    item.status === 'open' ? 'bg-accent' : 'bg-status-returned'
                  }`} />
                </div>
                <h4 className="text-[13px] font-medium text-text-primary mb-1 group-hover:text-accent transition-colors">
                  {item.title}
                </h4>
                <p className="text-[11px] text-text-muted">{item.location}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Category marquee */}
      <div className="mt-16 md:mt-20">
        <HorizontalMarquee duration={25} className="py-4">
          {categories.map((cat, i) => (
            <div
              key={i}
              className="flex items-center gap-3 px-5 py-3 rounded-full border border-border-subtle bg-base-850/40"
            >
              <cat.icon className="w-4 h-4 text-text-muted" />
              <span className="text-[13px] font-medium text-text-secondary whitespace-nowrap">
                {cat.label}
              </span>
            </div>
          ))}
        </HorizontalMarquee>
      </div>
    </section>
  )
}

