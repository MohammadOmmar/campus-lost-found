'use client'

import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { MapPin, Calendar, ArrowRight } from 'lucide-react'
import { MatchScore } from './match-score'
import { ReportStatus } from '@/components/items/item-row'

interface MatchCandidate {
  id: string
  type: 'LOST' | 'FOUND'
  title: string
  description: string
  category: string
  location: string
  date_lost_found: string
  status: string
}

interface MatchCandidateCardProps {
  candidate: {
    id: string
    type: 'LOST' | 'FOUND'
    title: string
    description: string
    category: string
    location: string
    date_lost_found: string
    status: string
  }
  score: {
    total: number
    breakdown: {
      category: number
      location: number
      date_proximity: number
      title_similarity: number
      description_overlap: number
    }
  }
  index?: number
}

/**
 * Candidate card for the matches page.
 * Shows public fields only - never private_verification or claim data.
 */
export function MatchCandidateCard({
  candidate,
  score,
  index = 0,
}: MatchCandidateCardProps) {
  const reduceMotion = useReducedMotion()
  const isLost = candidate.type === 'LOST'

  return (
    <motion.article
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -60px 0px' }}
      transition={{
        duration: 0.5,
        delay: reduceMotion ? 0 : index * 0.08,
        ease: [0.4, 0, 0.2, 1],
      }}
      className="bg-base-850 border border-border-subtle rounded-md p-5 md:p-7 transition-colors duration-200 hover:bg-base-800/70 hover:border-border-default"
    >
      <div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-sm border text-caption font-medium ${
              isLost
                ? 'bg-status-lost/10 text-status-lost border-status-lost/20'
                : 'bg-status-found/10 text-status-found border-status-found/20'
            }`}
          >
            {candidate.type}
          </span>
          <MatchScore total={score.total} breakdown={score.breakdown} index={index} />
        </div>

        <div className="mt-5 pt-5 border-t border-border-subtle">
          <h3 className="text-h3 mb-3">{candidate.title}</h3>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-small text-text-muted mb-3">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              {candidate.location}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              {formatDate(candidate.date_lost_found)}
            </span>
            <span className="text-caption">{candidate.category}</span>
          </div>
          <p className="text-body text-text-muted line-clamp-3 mb-5">
            {candidate.description}
          </p>
          <Link
            href={`/items/${candidate.id}`}
            className="inline-flex items-center gap-1.5 text-small font-medium text-text-primary hover:text-accent transition-colors"
          >
            View this report
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </motion.article>
  )
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}
