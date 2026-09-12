'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { User, Search, Building2 } from 'lucide-react'

const easeOut = [0.4, 0, 0.2, 1] as const

const scenarios = [
  { id: 'students', label: 'Students', icon: User, title: 'Lost your belongings?', description: 'Report what you lost with details only you would know. Browse found items and submit claims with proof of ownership.', steps: ['Report lost item with photo and details', 'Browse found items or wait for matches', 'Submit claim with private ownership proof', 'Get your item back once verified'] },
  { id: 'finders', label: 'Finders', icon: Search, title: 'Found something?', description: 'Help return found items to their owners. Review claims securely and verify ownership before handing off.', steps: ['Report found item with location and photo', 'Wait for potential owners to claim', 'Review ownership proof privately', 'Return item and mark as resolved'] },
  { id: 'staff', label: 'Campus Staff', icon: Building2, title: 'Supporting your campus', description: 'Oversee the return process with a clear, organized workflow. No personal data exposed —" just verified handoffs.', steps: ['View organized lost & found listings', 'See verified matches and claim status', 'Support secure item returns', 'Access resolution history'] },
]

export function UserScenarios() {
  const [activeTab, setActiveTab] = useState('students')
  const activeScenario = scenarios.find((s) => s.id === activeTab) || scenarios[0]

  return (
    <section className="section-spacing border-t border-border-subtle bg-base-900/50 relative">
      <div className="container-tight">
        <div className="text-center mb-16">
          <span className="label-tag-accent mb-4 inline-flex">For Everyone</span>
          <motion.h2 className="text-h1 mt-4 mb-4" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, ease: easeOut }}>
            Built for everyone on campus
          </motion.h2>
          <motion.p className="text-body-large max-w-lg mx-auto" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1, ease: easeOut }}>
            Whether you lost something, found something, or help run the campus — there&apos;s a workflow for you.
          </motion.p>
        </div>

        <div className="flex justify-center mb-12">
          <div className="inline-flex items-center gap-1 p-1 bg-base-850 border border-border-subtle rounded-md">
            {scenarios.map((scenario) => (
              <button key={scenario.id} onClick={() => setActiveTab(scenario.id)} className={`relative px-5 py-2 rounded-sm text-[13px] font-medium transition-colors duration-200 ${activeTab === scenario.id ? 'text-text-primary' : 'text-text-muted hover:text-text-secondary'}`} aria-selected={activeTab === scenario.id} role="tab">
                {activeTab === scenario.id && (<motion.div className="absolute inset-0 bg-accent/10 rounded-sm border border-accent/20" layoutId="activeTab" transition={{ duration: 0.25, ease: easeOut }} />)}
                <span className="relative flex items-center gap-2">
                  <scenario.icon className={`w-3.5 h-3.5 ${activeTab === scenario.id ? 'text-accent' : ''}`} />
                  <span className="hidden sm:inline">{scenario.label}</span>
                </span>
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.3, ease: easeOut }} className="bg-base-850 border border-border-subtle rounded-lg p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
              <div>
                <div className="w-11 h-11 rounded-md bg-accent/10 flex items-center justify-center mb-6 ring-1 ring-accent/20"><activeScenario.icon className="w-5 h-5 text-accent" /></div>
                <h3 className="text-h2 mb-4">{activeScenario.title}</h3>
                <p className="text-body-large leading-relaxed">{activeScenario.description}</p>
              </div>
              <div className="space-y-4">
                {activeScenario.steps.map((step, index) => (
                  <motion.div key={index} className="flex items-start gap-4" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, delay: index * 0.08, ease: easeOut }}>
                    <div className="w-7 h-7 rounded-sm bg-accent/10 flex items-center justify-center shrink-0 mt-0.5 ring-1 ring-accent/20"><span className="text-[12px] font-medium text-accent">{index + 1}</span></div>
                    <p className="text-[14px] text-text-primary pt-0.5">{step}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}
