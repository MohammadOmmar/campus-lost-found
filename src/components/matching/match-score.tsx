'use client'

import { motion, useReducedMotion } from 'framer-motion'

interface ScoreBreakdown {
  category: number
  location: number
  date_proximity: number
  title_similarity: number
  description_overlap: number
}

interface MatchScoreProps {
  total: number
  breakdown: ScoreBreakdown
  index?: number
}

/**
 * Refined visual score treatment.
 * Circular progress ring + expandable factor breakdown.
 * Not an analytics dashboard —" restrained and product-focused.
 */
export function MatchScore({ total, breakdown, index = 0 }: MatchScoreProps) {
  const reduceMotion = useReducedMotion()
  const radius = 30
  const circumference = 2 * Math.PI * radius

  const factors = [
    { label: 'Category', points: breakdown.category, max: 25 },
    { label: 'Location', points: breakdown.location, max: 20 },
    { label: 'Date', points: breakdown.date_proximity, max: 20 },
    { label: 'Title', points: breakdown.title_similarity, max: 20 },
    { label: 'Description', points: breakdown.description_overlap, max: 15 },
  ]

  return (
    <motion.div
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.5,
        delay: 0.25 + index * 0.1,
        ease: [0.4, 0, 0.2, 1],
      }}
      className="flex items-center gap-4"
    >
      {/* Score ring */}
      <div className="relative w-[76px] h-[76px] shrink-0">
        <svg viewBox="0 0 76 76" className="w-full h-full -rotate-90">
          <circle
            cx="38"
            cy="38"
            r={radius}
            fill="none"
            strokeWidth="6"
            className="stroke-secondary"
          />
          <motion.circle
            cx="38"
            cy="38"
            r={radius}
            fill="none"
            strokeWidth="6"
            strokeLinecap="round"
                        className="stroke-accent"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{
              strokeDashoffset: circumference - (total / 100) * circumference,
            }}
            transition={{
              duration: reduceMotion ? 0 : 0.9,
              delay: reduceMotion ? 0 : 0.3 + index * 0.1,
              ease: [0.4, 0, 0.2, 1],
            }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-h3 leading-none">{total}%</span>
        </div>
      </div>

      {/* Breakdown */}
      <motion.div
        initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.4,
          delay: reduceMotion ? 0 : 0.5 + index * 0.1,
          ease: [0.4, 0, 0.2, 1],
        }}
        className="flex-1 min-w-0"
      >
        <p className="text-caption text-text-muted mb-2">Potential match</p>
        <div className="space-y-1.5">
          {factors.map((f) => (
            <div key={f.label} className="flex items-center gap-2">
              <span className="text-small text-text-muted w-20 shrink-0">
                {f.label}
              </span>
              <div className="flex-1 h-1 rounded-full bg-base-700 overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-accent"
                  initial={{ width: 0 }}
                  animate={{ width: `${(f.points / f.max) * 100}%` }}
                  transition={{
                    duration: reduceMotion ? 0 : 0.6,
                    delay: reduceMotion ? 0 : 0.6 + index * 0.1,
                    ease: [0.4, 0, 0.2, 1],
                  }}
                />
              </div>
              <span className="text-small text-text-muted w-12 text-right shrink-0 tabular-nums">
                {f.points}/{f.max}
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}
