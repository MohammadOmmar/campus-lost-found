"use client"

import { useRef, useState } from "react"
import { motion, useInView, useScroll, useTransform } from "framer-motion"
import { FileText, Search, ShieldCheck, ArrowRight } from "lucide-react"

const steps = [
  {
    step: "01",
    title: "Report it",
    description: "File a report with item details, category, location, and a photo. Posts appear immediately to the campus.",
    icon: FileText,
    color: "text-status-lost",
    bgColor: "bg-status-lost/8",
    borderColor: "border-status-lost/15",
  },
  {
    step: "02",
    title: "Discover matches",
    description: "Search by category, location, and date. The system surfaces potential matches based on your report.",
    icon: Search,
    color: "text-accent",
    bgColor: "bg-accent/8",
    borderColor: "border-accent/15",
  },
  {
    step: "03",
    title: "Verify ownership",
    description: "Review details only the real owner would know. Nothing sensitive is ever shown publicly.",
    icon: ShieldCheck,
    color: "text-status-verification",
    bgColor: "bg-status-verification/8",
    borderColor: "border-status-verification/15",
  },
  {
    step: "04",
    title: "Return it",
    description: "Once verified, arrange a safe handoff. Status updates so everyone knows it's been returned.",
    icon: ArrowRight,
    color: "text-status-returned",
    bgColor: "bg-status-returned/8",
    borderColor: "border-status-returned/15",
  },
]

const easeOutExpo = [0.16, 1, 0.3, 1] as const

export function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" })
  const [activeStep, setActiveStep] = useState(0)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start center", "end center"],
  })

  const progressHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"])

  return (
    <section ref={sectionRef} className="section-spacing border-t border-border-subtle relative overflow-hidden">
      <div className="container-tight relative">
        {/* Sticky layout on desktop */}
        <div className="lg:grid lg:grid-cols-[1fr_1.2fr] lg:gap-16 items-start">
          {/* Sticky left side */}
          <div className="lg:sticky lg:top-32 mb-12 lg:mb-0">
            <motion.span
              className="label-tag-accent mb-4 inline-flex"
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, ease: easeOutExpo }}
            >
              Process
            </motion.span>
            <motion.h2
              className="text-h1 mt-4 mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1, ease: easeOutExpo }}
            >
              How getting
              <br />
              it back works.
            </motion.h2>
            <motion.p
              className="text-body-large measure-default"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2, ease: easeOutExpo }}
            >
              A simple, private flow for reporting, matching, verifying, and returning items.
            </motion.p>
          </div>

          {/* Steps - right side */}
          <div className="relative space-y-4">
            {/* Progress line */}
            <div className="hidden lg:block absolute left-5 top-0 bottom-0 w-px bg-border-subtle">
              <motion.div
                className="w-full bg-heritage/70 origin-top"
                style={{ height: progressHeight }}
              />
            </div>

            {steps.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "0px 0px -60px 0px" }}
                transition={{ duration: 0.5, delay: index * 0.1, ease: easeOutExpo }}
                onMouseEnter={() => setActiveStep(index)}
                className={`group relative bg-base-850/40 border rounded-xl p-6 transition-all duration-300 cursor-default ${
                  activeStep === index
                    ? "border-border-default bg-base-850/70"
                    : "border-border-subtle hover:border-border-default hover:bg-base-850/60"
                }`}
              >
                <div className="flex items-start gap-5">
                  {/* Step indicator */}
                  <div className="flex flex-col items-center gap-2 shrink-0">
                    <div className={`w-10 h-10 rounded-lg ${step.bgColor} flex items-center justify-center border ${step.borderColor} transition-transform duration-300 ${
                      activeStep === index ? "scale-110" : ""
                    }`}>
                      <step.icon className={`w-5 h-5 ${step.color}`} />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-caption text-heritage/80">{step.step}</span>
                      <h3 className="text-[15px] font-medium text-text-primary group-hover:text-accent transition-colors">
                        {step.title}
                      </h3>
                    </div>
                    <p className={`text-[13px] leading-relaxed transition-opacity duration-300 ${
                      activeStep === index ? "text-text-secondary" : "text-text-muted"
                    }`}>
                      {step.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

