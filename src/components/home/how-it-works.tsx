"use client"

import { motion } from "framer-motion"
import { CheckCircle2 } from "lucide-react"

const steps = [
  {
    step: "01",
    title: "Report what you lost or found",
    description:
      "File a report with the item details, category, location, and a photo. Found items can be posted the same way so the campus can see them immediately.",
  },
  {
    step: "02",
    title: "Browse items and potential matches",
    description:
      "Search by category, location, and date. Our system highlights items that look like a potential match based on what you reported.",
  },
  {
    step: "03",
    title: "Request verification privately",
    description:
      "When there is a possible match, you review details only the real owner or finder would know. Nothing sensitive is shown publicly.",
  },
  {
    step: "04",
    title: "Coordinate the return",
    description:
      "Once verified, arrange a handoff that feels safe and simple. The item status is updated so everyone knows it has been returned.",
  },
]

const easeOut = [0.4, 0, 0.2, 1] as const

export function HowItWorks() {
  return (
    <section className="section-spacing border-t border-border/20 relative">
      <div className="container-tight">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: easeOut }}
          className="text-center mb-16 md:mb-20"
        >
          <h2 className="text-h2 mb-4">How it works</h2>
          <p className="text-body-large text-muted-foreground max-w-lg mx-auto">
            A simple, private flow for reporting, matching, verifying, and returning items on campus.
          </p>
        </motion.div>

        <div className="relative">
          {/* Accent glow panel */}
          <div className="pointer-events-none absolute -right-20 top-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-accent/5 blur-3xl" />

          <div className="relative">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {steps.map((step, index) => (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: index * 0.07, ease: easeOut }}
                  className="relative"
                >
                  {/* Oversized step number */}
                  <div className="mb-5">
                    <span className="text-display font-normal tracking-tighter text-foreground/15 select-none">
                      {step.step}
                    </span>
                  </div>

                  {/* Accent icon */}
                  <div className="mb-5">
                    <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center ring-1 ring-accent/20">
                      <CheckCircle2 className="w-5 h-5 text-accent" />
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-h3 mb-3">{step.title}</h3>
                  <p className="text-body text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

