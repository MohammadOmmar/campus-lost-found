'use client'

import { motion } from 'framer-motion'
import { Package, MapPin, Calendar, Search, Shield, CheckCircle, ArrowRight, Zap, Lock } from 'lucide-react'

const easeOut = [0.4, 0, 0.2, 1] as const

function Card({ badge, badgeColor, icon: Icon, iconColor, children, active = false }: {
  badge: string
  badgeColor: string
  icon: React.ElementType
  iconColor: string
  children: React.ReactNode
  active?: boolean
}) {
  return (
    <motion.div
      className={`bg-base-850 border rounded-lg p-5 transition-all duration-300 ${
        active ? 'border-accent/30 shadow-[0_0_20px_rgba(200,255,0,0.05)]' : 'border-border-subtle hover:border-border-default'
      }`}
      whileHover={{ y: -2 }}
    >
      <div className="flex items-center gap-2 mb-3">
        <span className={`label-tag ${badgeColor}`}>{badge}</span>
      </div>
      <div className="w-full h-24 bg-base-900/50 rounded-md mb-4 flex items-center justify-center border border-border-subtle/50">
        <Icon className={`w-8 h-8 ${iconColor}`} />
      </div>
      {children}
    </motion.div>
  )
}
export function ProductVisualization() {
  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="hidden lg:block">
        <div className="flex items-start justify-between gap-2">
          <motion.div className="flex-1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2, ease: easeOut }}>
            <Card badge="LOST" badgeColor="!text-status-lost !border-status-lost/20 !bg-status-lost/10" icon={Package} iconColor="text-text-muted">
              <h4 className="text-[14px] font-medium text-text-primary mb-3">Black wireless earbuds</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[12px] text-text-muted"><MapPin className="w-3 h-3" /><span>Library</span></div>
                <div className="flex items-center gap-2 text-[12px] text-text-muted"><Calendar className="w-3 h-3" /><span>September 8</span></div>
              </div>
            </Card>
          </motion.div>
          <motion.div className="flex items-center justify-center pt-14" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.5, ease: easeOut }}>
            <div className="flex flex-col items-center gap-1"><ArrowRight className="w-4 h-4 text-accent/40" /><span className="text-[10px] text-accent/60 font-mono">SCAN</span></div>
          </motion.div>
          <motion.div className="flex-1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5, ease: easeOut }}>
            <Card badge="POTENTIAL MATCH" badgeColor="!text-accent !border-accent-border !bg-accent-muted" icon={Search} iconColor="text-accent/60" active>
              <div className="flex items-baseline gap-2 mb-3">
                <motion.span className="text-3xl font-light text-accent tabular-nums" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.8, ease: easeOut }}>87%</motion.span>
                <span className="text-[12px] text-text-muted">match score</span>
              </div>
              <p className="text-[12px] text-text-muted">Same category, nearby location, close date</p>
            </Card>
          </motion.div>
          <motion.div className="flex items-center justify-center pt-14" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.8, ease: easeOut }}>
            <div className="flex flex-col items-center gap-1"><ArrowRight className="w-4 h-4 text-accent/40" /><span className="text-[10px] text-accent/60 font-mono">VERIFY</span></div>
          </motion.div>
          <motion.div className="flex-1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.8, ease: easeOut }}>
            <Card badge="VERIFICATION" badgeColor="!text-status-verification !border-status-verification/20 !bg-status-verification/10" icon={Shield} iconColor="text-text-muted">
              <h4 className="text-[14px] font-medium text-text-primary mb-3">Private ownership proof</h4>
              <p className="text-[12px] text-text-muted">Only the true owner would know</p>
            </Card>
          </motion.div>
          <motion.div className="flex items-center justify-center pt-14" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 1.1, ease: easeOut }}>
            <div className="flex flex-col items-center gap-1"><ArrowRight className="w-4 h-4 text-accent/40" /><span className="text-[10px] text-accent/60 font-mono">RETURN</span></div>
          </motion.div>
          <motion.div className="flex-1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 1.1, ease: easeOut }}>
            <Card badge="RETURNED" badgeColor="!text-status-returned !border-status-returned/20 !bg-status-returned/10" icon={CheckCircle} iconColor="text-text-muted">
              <h4 className="text-[14px] font-medium text-text-primary mb-3">Item reunited</h4>
              <p className="text-[12px] text-text-muted">Verified owner, case closed</p>
            </Card>
          </motion.div>
        </div>
        <motion.div className="mt-6 flex items-center justify-center gap-8 text-[11px] text-text-muted font-mono" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 1.4, ease: easeOut }}>
          <span className="flex items-center gap-1.5"><Zap className="w-3 h-3 text-accent/60" /> Real-time matching</span>
          <span className="flex items-center gap-1.5"><Lock className="w-3 h-3 text-accent/60" /> Encrypted verification</span>
        </motion.div>
      </div>
      <div className="lg:hidden space-y-3">
        <motion.div className="bg-base-850 border border-border-subtle rounded-lg p-4" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: easeOut }}>
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 bg-status-lost/5 rounded-md flex items-center justify-center shrink-0 border border-status-lost/10"><Package className="w-6 h-6 text-status-lost/60" /></div>
            <div className="flex-1 min-w-0">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-status-lost/15 text-status-lost text-[10px] font-medium tracking-wide mb-2">LOST</span>
              <h4 className="text-[14px] font-medium text-text-primary mb-1">Black wireless earbuds</h4>
              <p className="text-[12px] text-text-muted">Library | September 8</p>
            </div>
          </div>
        </motion.div>
        <motion.div className="flex justify-center py-1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, ease: easeOut }}>
          <div className="flex flex-col items-center gap-1"><ArrowRight className="w-3.5 h-3.5 text-accent/40 rotate-90" /><span className="text-[9px] text-accent/60 font-mono">SCAN</span></div>
        </motion.div>
        <motion.div className="bg-base-850 border border-accent/30 rounded-lg p-4 shadow-[0_0_20px_rgba(200,255,0,0.05)]" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2, ease: easeOut }}>
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 bg-accent/5 rounded-md flex items-center justify-center shrink-0 border border-accent/20"><Search className="w-6 h-6 text-accent/70" /></div>
            <div className="flex-1 min-w-0">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-accent/15 text-accent text-[10px] font-medium tracking-wide mb-2">POTENTIAL MATCH</span>
              <div className="flex items-baseline gap-2 mb-1"><span className="text-xl font-semibold text-accent">87%</span><span className="text-[12px] text-text-muted">match</span></div>
              <p className="text-[12px] text-text-muted">Same category, nearby location</p>
            </div>
          </div>
        </motion.div>
        <motion.div className="flex justify-center py-1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4, ease: easeOut }}>
          <div className="flex flex-col items-center gap-1"><ArrowRight className="w-3.5 h-3.5 text-accent/40 rotate-90" /><span className="text-[9px] text-accent/60 font-mono">VERIFY</span></div>
        </motion.div>
        <motion.div className="bg-base-850 border border-border-subtle rounded-lg p-4" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.4, ease: easeOut }}>
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 bg-status-verification/5 rounded-md flex items-center justify-center shrink-0 border border-status-verification/10"><Shield className="w-6 h-6 text-status-verification/60" /></div>
            <div className="flex-1 min-w-0">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-status-verification/15 text-status-verification text-[10px] font-medium tracking-wide mb-2">VERIFICATION</span>
              <h4 className="text-[14px] font-medium text-text-primary mb-1">Private ownership proof</h4>
              <p className="text-[12px] text-text-muted">Only the true owner would know</p>
            </div>
          </div>
        </motion.div>
        <motion.div className="flex justify-center py-1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, ease: easeOut }}>
          <div className="flex flex-col items-center gap-1"><ArrowRight className="w-3.5 h-3.5 text-accent/40 rotate-90" /><span className="text-[9px] text-accent/60 font-mono">RETURN</span></div>
        </motion.div>
        <motion.div className="bg-base-850 border border-border-subtle rounded-lg p-4" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.6, ease: easeOut }}>
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 bg-status-returned/5 rounded-md flex items-center justify-center shrink-0 border border-status-returned/10"><CheckCircle className="w-6 h-6 text-status-returned/60" /></div>
            <div className="flex-1 min-w-0">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-status-returned/15 text-status-returned text-[10px] font-medium tracking-wide mb-2">RETURNED</span>
              <h4 className="text-[14px] font-medium text-text-primary mb-1">Item reunited</h4>
              <p className="text-[12px] text-text-muted">Verified owner, case closed</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
