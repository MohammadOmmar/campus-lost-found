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
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-caption font-medium ${badgeColor}`}>
          {badge}
        </span>
      </div>
      <div className="w-full h-28 bg-secondary/60 rounded-xl mb-4 flex items-center justify-center">
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
        <div className="flex items-start justify-between gap-4">
          <motion.div className="flex-1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2, ease: easeOut }}>
            <Card badge="LOST" badgeColor="bg-destructive/10 text-destructive" icon={Package} iconColor="text-muted-foreground/50">
              <h4 className="text-body font-medium text-foreground mb-3">Black wireless earbuds</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-small text-muted-foreground"><MapPin className="w-3.5 h-3.5" /><span>Library</span></div>
                <div className="flex items-center gap-2 text-small text-muted-foreground"><Calendar className="w-3.5 h-3.5" /><span>September 8</span></div>
              </div>
            </Card>
          </motion.div>
          <motion.div className="flex items-center justify-center pt-16" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.5, ease: easeOut }}>
            <ArrowDown className="w-5 h-5 text-muted-foreground rotate-[-90deg]" />
          </motion.div>
          <motion.div className="flex-1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5, ease: easeOut }}>
            <Card badge="POTENTIAL MATCH" badgeColor="bg-primary/10 text-primary" icon={Search} iconColor="text-muted-foreground/50">
              <div className="flex items-baseline gap-2 mb-3">
                <span className="text-h3 font-semibold text-foreground">87%</span>
                <span className="text-small text-muted-foreground">match score</span>
              </div>
              <p className="text-small text-muted-foreground">Same category, nearby location, close date</p>
            </Card>
          </motion.div>
          <motion.div className="flex items-center justify-center pt-16" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.8, ease: easeOut }}>
            <ArrowDown className="w-5 h-5 text-muted-foreground rotate-[-90deg]" />
          </motion.div>
          <motion.div className="flex-1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.8, ease: easeOut }}>
            <Card badge="VERIFICATION" badgeColor="bg-amber-500/10 text-amber-600" icon={Shield} iconColor="text-muted-foreground/50">
              <h4 className="text-body font-medium text-foreground mb-3">Private ownership proof</h4>
              <p className="text-small text-muted-foreground">Claimant provides details only the true owner would know</p>
            </Card>
          </motion.div>
          <motion.div className="flex items-center justify-center pt-16" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 1.1, ease: easeOut }}>
            <ArrowDown className="w-5 h-5 text-muted-foreground rotate-[-90deg]" />
          </motion.div>
          <motion.div className="flex-1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 1.1, ease: easeOut }}>
            <Card badge="RETURNED" badgeColor="bg-emerald-500/10 text-emerald-600" icon={CheckCircle} iconColor="text-emerald-500/70">
              <h4 className="text-body font-medium text-foreground mb-3">Item reunited</h4>
              <p className="text-small text-muted-foreground">Verified owner, item returned, case closed</p>

      {/* Mobile: Vertical layout */}
      <div className="lg:hidden space-y-3">
        <motion.div className="bg-card border border-border/40 rounded-2xl p-4" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1, ease: easeOut }}>
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-secondary/60 rounded-xl flex items-center justify-center shrink-0">
              <Package className="w-7 h-7 text-muted-foreground/50" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-destructive/10 text-destructive text-caption font-medium mb-2">LOST</span>
              <h4 className="text-body font-medium text-foreground mb-2">Black wireless earbuds</h4>
              <div className="flex items-center gap-4 text-small text-muted-foreground">
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />Library</span>
                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />Sep 8</span>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div className="flex justify-center py-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25, ease: easeOut }}>
          <ArrowDown className="w-3.5 h-3.5 text-muted-foreground" />
        </motion.div>

        <motion.div className="bg-card border border-border/40 rounded-2xl p-4" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3, ease: easeOut }}>
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-secondary/60 rounded-xl flex items-center justify-center shrink-0">
              <Search className="w-7 h-7 text-muted-foreground/50" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-primary/10 text-primary text-caption font-medium mb-2">POTENTIAL MATCH</span>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-h3 font-semibold text-foreground">87%</span>
                <span className="text-small text-muted-foreground">match</span>
              </div>
              <p className="text-small text-muted-foreground">Same category, nearby location</p>
            </div>
          </div>
        </motion.div>

        <motion.div className="flex justify-center py-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45, ease: easeOut }}>
          <ArrowDown className="w-3.5 h-3.5 text-muted-foreground" />
        </motion.div>

        <motion.div className="bg-card border border-border/40 rounded-2xl p-4" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.5, ease: easeOut }}>
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-secondary/60 rounded-xl flex items-center justify-center shrink-0">
              <Shield className="w-7 h-7 text-muted-foreground/50" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 text-caption font-medium mb-2">VERIFICATION</span>
              <h4 className="text-body font-medium text-foreground mb-1">Private ownership proof</h4>
              <p className="text-small text-muted-foreground">Only the true owner would know</p>
            </div>
          </div>
        </motion.div>

        <motion.div className="flex justify-center py-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.65, ease: easeOut }}>
          <ArrowDown className="w-3.5 h-3.5 text-muted-foreground" />
        </motion.div>

        <motion.div className="bg-card border border-border/40 rounded-2xl p-4" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.7, ease: easeOut }}>
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-emerald-500/5 rounded-xl flex items-center justify-center shrink-0 border border-emerald-500/10">
              <CheckCircle className="w-7 h-7 text-emerald-500/70" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 text-caption font-medium mb-2">RETURNED</span>
              <h4 className="text-body font-medium text-foreground mb-1">Item reunited</h4>
              <p className="text-small text-muted-foreground">Verified owner, case closed</p>
            </div>
          </div>
        </motion.div>
      </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
