'use client'

import { motion } from 'framer-motion'
import { Package, MapPin, Calendar, Search, Shield, CheckCircle, ArrowDown } from 'lucide-react'

const easeOut = [0.4, 0, 0.2, 1] as const

function Card({ badge, badgeColor, icon: Icon, iconColor, children }: {
  badge: string
  badgeColor: string
  icon: React.ElementType
  iconColor: string
  children: React.ReactNode
}) {
  return (
    <div className="bg-card border border-border/40 rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium tracking-wide ${badgeColor}`}>
          {badge}
        </span>
      </div>
      <div className="w-full h-28 bg-secondary/50 rounded-xl mb-4 flex items-center justify-center">
        <Icon className={`w-10 h-10 ${iconColor}`} />
      </div>
      {children}
    </div>
  )
}

export function ProductVisualization() {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="hidden lg:block">
        <div className="flex items-start justify-between gap-3">
          <motion.div className="flex-1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2, ease: easeOut }}>
            <Card badge="LOST" badgeColor="bg-destructive/10 text-destructive" icon={Package} iconColor="text-muted-foreground/40">
              <h4 className="text-[14px] font-medium text-foreground mb-3">Black wireless earbuds</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[12px] text-muted-foreground"><MapPin className="w-3.5 h-3.5" /><span>Library</span></div>
                <div className="flex items-center gap-2 text-[12px] text-muted-foreground"><Calendar className="w-3.5 h-3.5" /><span>September 8</span></div>
              </div>
            </Card>
          </motion.div>

          <motion.div className="flex items-center justify-center pt-16" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.5, ease: easeOut }}>
            <ArrowDown className="w-4 h-4 text-muted-foreground/50 rotate-[-90deg]" />
          </motion.div>

          <motion.div className="flex-1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5, ease: easeOut }}>
            <Card badge="POTENTIAL MATCH" badgeColor="bg-status-match/15 text-status-match" icon={Search} iconColor="text-muted-foreground/40">
              <div className="flex items-baseline gap-2 mb-3">
                <motion.span className="text-3xl font-semibold text-foreground" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.8, ease: easeOut }}>
                  87%
                </motion.span>
                <span className="text-[12px] text-muted-foreground">match score</span>
              </div>
              <p className="text-[12px] text-muted-foreground">Same category, nearby location, close date</p>
            </Card>
          </motion.div>

          <motion.div className="flex items-center justify-center pt-16" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.8, ease: easeOut }}>
            <ArrowDown className="w-4 h-4 text-muted-foreground/50 rotate-[-90deg]" />
          </motion.div>

          <motion.div className="flex-1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.8, ease: easeOut }}>
            <Card badge="VERIFICATION" badgeColor="bg-status-verification/15 text-status-verification" icon={Shield} iconColor="text-muted-foreground/40">
              <h4 className="text-[14px] font-medium text-foreground mb-3">Private ownership proof</h4>
              <p className="text-[12px] text-muted-foreground">Only the true owner would know</p>
            </Card>
          </motion.div>

          <motion.div className="flex items-center justify-center pt-16" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 1.1, ease: easeOut }}>
            <ArrowDown className="w-4 h-4 text-muted-foreground/50 rotate-[-90deg]" />
          </motion.div>

          <motion.div className="flex-1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 1.1, ease: easeOut }}>
            <Card badge="RETURNED" badgeColor="bg-status-returned/15 text-status-returned" icon={CheckCircle} iconColor="text-status-returned/60">
              <h4 className="text-[14px] font-medium text-foreground mb-3">Item reunited</h4>
              <p className="text-[12px] text-muted-foreground">Verified owner, case closed</p>
            </Card>
          </motion.div>
        </div>
      </div>

      <div className="lg:hidden space-y-3">
        <motion.div className="bg-card border border-border/40 rounded-2xl p-4" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: easeOut }}>
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 bg-secondary/50 rounded-xl flex items-center justify-center shrink-0">
              <Package className="w-6 h-6 text-muted-foreground/40" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-destructive/10 text-destructive text-[10px] font-medium tracking-wide mb-2">LOST</span>
              <h4 className="text-[14px] font-medium text-foreground">Black wireless earbuds</h4>
              <p className="text-[12px] text-muted-foreground mt-1">Library · September 8</p>
            </div>
          </div>
        </motion.div>

        <motion.div className="flex justify-center py-1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, ease: easeOut }}>
          <ArrowDown className="w-3.5 h-3.5 text-muted-foreground/40" />
        </motion.div>

        <motion.div className="bg-card border border-border/40 rounded-2xl p-4" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2, ease: easeOut }}>
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 bg-status-match/5 rounded-xl flex items-center justify-center shrink-0 border border-status-match/10">
              <Search className="w-6 h-6 text-status-match/60" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-status-match/15 text-status-match text-[10px] font-medium tracking-wide mb-2">POTENTIAL MATCH</span>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-xl font-semibold text-foreground">87%</span>
                <span className="text-[12px] text-muted-foreground">match</span>
              </div>
              <p className="text-[12px] text-muted-foreground">Same category, nearby location</p>
            </div>
          </div>
        </motion.div>

        <motion.div className="flex justify-center py-1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4, ease: easeOut }}>
          <ArrowDown className="w-3.5 h-3.5 text-muted-foreground/40" />
        </motion.div>

        <motion.div className="bg-card border border-border/40 rounded-2xl p-4" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.4, ease: easeOut }}>
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 bg-status-verification/5 rounded-xl flex items-center justify-center shrink-0 border border-status-verification/10">
              <Shield className="w-6 h-6 text-status-verification/60" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-status-verification/15 text-status-verification text-[10px] font-medium tracking-wide mb-2">VERIFICATION</span>
              <h4 className="text-[14px] font-medium text-foreground mb-1">Private ownership proof</h4>
              <p className="text-[12px] text-muted-foreground">Only the true owner would know</p>
            </div>
          </div>
        </motion.div>

        <motion.div className="flex justify-center py-1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, ease: easeOut }}>
          <ArrowDown className="w-3.5 h-3.5 text-muted-foreground/40" />
        </motion.div>

        <motion.div className="bg-card border border-border/40 rounded-2xl p-4" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.6, ease: easeOut }}>
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 bg-status-returned/5 rounded-xl flex items-center justify-center shrink-0 border border-status-returned/10">
              <CheckCircle className="w-6 h-6 text-status-returned/60" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-status-returned/15 text-status-returned text-[10px] font-medium tracking-wide mb-2">RETURNED</span>
              <h4 className="text-[14px] font-medium text-foreground mb-1">Item reunited</h4>
              <p className="text-[12px] text-muted-foreground">Verified owner, case closed</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
