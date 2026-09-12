"use client"

import { motion } from "framer-motion"
import { FileText, Search, ShieldCheck, ArrowRight } from "lucide-react"

const steps = [
  {
    step: "01",
    title: "Report",
    description: "File a report with item details, category, location, and a photo. Posts appear immediately to the campus.",
    icon: FileText,
    color: "text-status-lost",
    bgColor: "bg-status-lost/10",
    borderColor: "border-status-lost/20",
  },
  {
    step: "02",
    title: "Discover",
    description: "Search by category, location, and date. The system surfaces potential matches based on your report.",
    icon: Search,
    color: "text-accent",
    bgColor: "bg-accent/10",
    borderColor: "border-accent/20",
  },
  {
    step: "03",
    title: "Verify",
    description: "Review details only the real owner would know. Nothing sensitive is ever shown publicly.",
    icon: ShieldCheck,
    color: "text-status-verification",
    bgColor: "bg-status-verification/10",
    borderColor: "border-status-verification/20",
  },
  {
    step: "04",
    title: "Return",
    description: "Once verified, arrange a safe handoff. Status updates so everyone knows it's been returned.",
    icon: ArrowRight,
    color: "text-status-returned",
    bgColor: "bg-status-returned/10",
    borderColor: "border-status-returned/20",
  },
]

const easeOut = [0.4, 0, 0.2, 1] as const

export function HowItWorks() {
  return (
    <section className="section-spacing border-t border-border-subtle relative overflow-hidden">
      {/* Atmospheric background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-accent/[0.02] blur-3xl" />
      </div>

      <div className="container-tight relative">
        {/* Section header - more editorial */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: easeOut }}
          className="text-center mb-16 md:mb-20"
        >
          <span className="label-tag-accent mb-4 inline-flex">Process</span>
          <h2 className="text-h1 mt-4 mb-4">How it works</h2>
          <p className="text-body-large max-w-md mx-auto text-text-secondary">
            A simple, private flow for reporting, matching, verifying, and returning items.
          </p>
        </motion.div>

        {/* Technical workflow visualization */}
        <div className="relative">
          {/* Connecting line - desktop */}
          <div className="hidden lg:block absolute top-16 left-[10%] right-[10%] h-px bg-border-subtle" />
          
          <div className="grid gap-6 md:gap-8 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: index * 0.1, ease: easeOut }}
                className="relative"
              >
                {/* Node indicator on connecting line */}
                <div className="hidden lg:flex absolute -top-[3px] left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-base-900 border-2 border-border-subtle z-10" />
                
                <div className="bg-base-850 border border-border-subtle rounded-lg p-6 hover:border-border-default transition-all duration-300 h-full">
                  {/* Step number - large, technical */}
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-display-lg font-light tracking-tighter text-text-muted/10 select-none">
                      {step.step}
                    </span>
                    <div className={`w-10 h-10 rounded-md ${step.bgColor} flex items-center justify-center border ${step.borderColor}`}>
                      <step.icon className={`w-5 h-5 ${step.color}`} />
                    </div>
                  </div>

                  <h3 className="text-[15px] font-medium text-text-primary mb-2">{step.title}</h3>
                  <p className="text-[13px] text-text-muted leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Mobile connecting arrows */}
          <div className="lg:hidden flex flex-col items-center gap-2 my-4">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + i * 0.1, ease: easeOut }}
                className="text-text-muted/30"
              >
                <ArrowRight className="w-4 h-4 rotate-90" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

