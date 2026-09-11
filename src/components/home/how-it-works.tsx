'use client'

import { motion } from 'framer-motion'
import { FileText, Search, Shield, CheckCircle } from 'lucide-react'

const easeOut = [0.4, 0, 0.2, 1] as const

const steps = [
  {
    number: '01',
    title: 'Report',
    description: 'Submit details about your lost or found item. Add a photo, location, and date to help others identify it.',
    icon: FileText,
  },
  {
    number: '02',
    title: 'Discover',
    description: 'Browse items or let the system surface potential matches based on category, location, and timing.',
    icon: Search,
  },
  {
    number: '03',
    title: 'Verify',
    description: 'Submit a claim with proof of ownership. The finder reviews privately —" no sensitive data exposed.',
    icon: Shield,
  },
  {
    number: '04',
    title: 'Return',
    description: 'Once verified, the item is marked returned. A simple, secure handoff within your campus community.',
    icon: CheckCircle,
  },
]

export function HowItWorks() {
  return (
    <section className="section-spacing border-t border-border/20 relative">
      <div className="container-tight">
        <div className="text-center mb-20">
          <motion.h2
            className="text-h2 mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: easeOut }}
          >
            How it works
          </motion.h2>
          <motion.p
            className="text-body-large text-muted-foreground max-w-lg mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1, ease: easeOut }}
          >
            Four simple steps to reunite lost belongings with their owners.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-5">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              className="relative"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1, ease: easeOut }}
            >
              <div className="mb-6">
                <span className="text-display font-light text-muted-foreground/15">
                  {step.number}
                </span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-secondary/80 flex items-center justify-center mb-5">
                <step.icon className="w-4.5 h-4.5 text-foreground/70" />
              </div>
              <h3 className="text-h3 mb-3">{step.title}</h3>
              <p className="text-body text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
