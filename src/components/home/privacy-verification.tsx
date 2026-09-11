'use client'

import { motion } from 'framer-motion'
import { Eye, EyeOff, Shield, Lock } from 'lucide-react'

const easeOut = [0.4, 0, 0.2, 1] as const

function InfoRow({ label, value, masked = false }: { label: string; value: string; masked?: boolean }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-border/20 last:border-0">
      <span className="text-[13px] text-muted-foreground">{label}</span>
      <span className={`text-[13px] font-medium ${masked ? 'text-muted-foreground/30 tracking-widest' : 'text-foreground'}`}>
        {value}
      </span>
    </div>
  )
}

export function PrivacyVerification() {
  return (
    <section className="section-spacing border-t border-border/20 bg-muted/10 relative">
      <div className="container-tight">
        <div className="text-center mb-16">
          <motion.h2 className="text-h2 mb-4" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, ease: easeOut }}>
            Enough information to find it.
            <br />
            Not enough to fake ownership.
          </motion.h2>
          <motion.p className="text-body-large text-muted-foreground max-w-lg mx-auto" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1, ease: easeOut }}>
            Private verification details are only used during claim review. Never displayed publicly.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 gap-5 max-w-3xl mx-auto">
          <motion.div className="bg-card border border-border/30 rounded-2xl p-6" initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2, ease: easeOut }}>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-xl bg-status-found/10 flex items-center justify-center"><Eye className="w-4 h-4 text-status-found" /></div>
              <div><h4 className="text-[14px] font-medium text-foreground">Public</h4><p className="text-[12px] text-muted-foreground">Visible to everyone</p></div>
            </div>
            <InfoRow label="Item" value="Black backpack" />
            <InfoRow label="Location" value="Library" />
            <InfoRow label="Date" value="Tuesday" />
            <InfoRow label="Category" value="Bags" />
          </motion.div>

          <motion.div className="bg-card border border-border/30 rounded-2xl p-6" initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.3, ease: easeOut }}>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-xl bg-status-match/10 flex items-center justify-center"><EyeOff className="w-4 h-4 text-status-match" /></div>
              <div><h4 className="text-[14px] font-medium text-foreground">Private</h4><p className="text-[12px] text-muted-foreground">Only during claim review</p></div>
            </div>
            <InfoRow label="Verification" value="—¢—¢—¢—¢—¢—¢—¢—¢—¢—¢—¢—¢—¢—¢" masked />
            <InfoRow label="Owner detail" value="—¢—¢—¢—¢—¢—¢—¢—¢—¢—¢—¢—¢—¢—¢" masked />
            <InfoRow label="Serial number" value="—¢—¢—¢—¢—¢—¢—¢—¢—¢—¢—¢—¢—¢—¢" masked />
            <InfoRow label="Unique mark" value="—¢—¢—¢—¢—¢—¢—¢—¢—¢—¢—¢—¢—¢—¢" masked />
          </motion.div>
        </div>

        <motion.div className="flex flex-wrap justify-center gap-6 mt-12" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.4, ease: easeOut }}>
          <div className="flex items-center gap-2 text-[13px] text-muted-foreground"><Shield className="w-3.5 h-3.5" /><span>Verified ownership only</span></div>
          <div className="flex items-center gap-2 text-[13px] text-muted-foreground"><Lock className="w-3.5 h-3.5" /><span>Private data protected</span></div>
          <div className="flex items-center gap-2 text-[13px] text-muted-foreground"><EyeOff className="w-3.5 h-3.5" /><span>No public personal info</span></div>
        </motion.div>
      </div>
    </section>
  )
}
