'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Terminal, Activity, Cpu } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ProductVisualization } from './product-visualization'

const easeOut = [0.4, 0, 0.2, 1] as const

const stats = [
  { value: '1,247', label: 'items.processed' },
  { value: '892', label: 'matches.found' },
  { value: '94.2%', label: 'success.rate' },
]

const terminalLines = [
  { prefix: '>', value: 'system.status', accent: true },
  { prefix: '', value: 'campus network active · 247 online', accent: false },
  { prefix: '', value: 'last sync: 2.3s ago', accent: false },
]

export function Hero() {
  return (
    <section className="section-hero relative min-h-[100vh] flex flex-col justify-end pt-32 pb-24 overflow-hidden">
      {/* Atmospheric background layers */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1400px] h-[700px] bg-[radial-gradient(ellipse_at_center,rgba(200,255,0,0.06)_0%,transparent_50%)]" />
        <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-[radial-gradient(circle_at_center,rgba(200,255,0,0.03)_0%,transparent_50%)]" />
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-base-950 to-transparent" />
        <div className="absolute inset-0 bg-grid-fine opacity-[0.15]" />
      </div>

      <div className="container-tight relative z-10">
        {/* Terminal prompt bar */}
        <motion.div
          className="surface-raised flex items-center gap-4 px-4 py-3 rounded-lg mb-12 text-[13px] font-mono max-w-fit"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: easeOut }}
        >
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-accent/70" />
            <span className="text-text-muted">{'>'}</span>
          </div>
          <div className="flex items-center gap-3 text-[12px]">
            {terminalLines.map((line, i) => (
              <span key={i} className={line.accent ? 'text-accent' : 'text-text-muted/60'}>
                {line.prefix && <span className="text-accent">{line.prefix}</span>}
                <span className="ml-1">{line.value}</span>
              </span>
            ))}
          </div>
          <div className="flex items-center gap-2 ml-4 pl-4 border-l border-border-subtle">
            <Activity className="w-3 h-3 text-accent" />
            <span className="text-accent text-[11px]">LIVE</span>
          </div>
        </motion.div>

        {/* Main headline */}
        <motion.h1
          className="text-display-lg text-text-primary mb-6 max-w-5xl leading-[0.9]"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: easeOut }}
        >
          Campus
          <br />
          <span className="text-glow-accent">Lost & Found</span>
        </motion.h1>

        {/* Supporting text */}
        <motion.p
          className="text-body-large max-w-lg mb-10 text-text-secondary"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25, ease: easeOut }}
        >
          Report lost and found items, discover potential matches, and securely verify ownership — all within your campus community.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          className="flex flex-wrap gap-4 mb-14"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35, ease: easeOut }}
        >
          <Button size="lg" className="h-12 px-6 text-[14px] font-medium" asChild>
            <Link href="/items/new">
              Report an Item
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
          <Button variant="ghost" size="lg" className="h-12 px-6 text-[14px]" asChild>
            <Link href="/items">Browse Items</Link>
          </Button>
        </motion.div>

        {/* Stats row */}
        <motion.div
          className="flex flex-wrap gap-10 mb-14"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5, ease: easeOut }}
        >
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col gap-1">
              <span className="text-[22px] font-light text-accent tabular-nums tracking-tight">{stat.value}</span>
              <span className="text-[11px] font-mono text-text-muted uppercase tracking-wider">{stat.label}</span>
            </div>
          ))}
        </motion.div>

        {/* Product visualization */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: easeOut }}
          className="scan-line"
        >
          <div className="flex items-center gap-3 mb-5">
            <span className="text-[11px] font-mono text-text-muted uppercase tracking-wider">LIVE SYSTEM PREVIEW</span>
            <div className="flex-1 h-px bg-border-subtle" />
            <div className="flex items-center gap-2">
              <div className="status-dot" />
              <span className="text-[10px] font-mono text-accent/70">PROCESSING</span>
            </div>
          </div>
          <ProductVisualization />
        </motion.div>
      </div>
    </section>
  )
}

