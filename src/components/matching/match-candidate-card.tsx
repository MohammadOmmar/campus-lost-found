'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion, useReducedMotion } from 'framer-motion'
import { MapPin, Calendar, Package, ArrowRight } from 'lucide-react'
import { MatchScore } from './match-score'

interface MatchCandidateCardProps {
  candidate: {
    id: string
    type: 'LOST' | 'FOUND'
    title: string
    description: string
    category: string
    location: string
    date_lost_found: string
    image_url: string | null
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
 * Shows public fields only —" never private_verification or claim data.
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
      className="bg-card border border-border/40 rounded-2xl overflow-hidden transition-colors duration-200 hover:border-border/70"
    >
      <div className="grid md:grid-cols-[240px_1fr] gap-0">
        {/* Image */}
        <div className="relative aspect-[16/10] md:aspect-auto md:min-h-[220px] bg-secondary/40 flex items-center justify-center overflow-hidden">
          {candidate.image_url ? (
            <Image
              src={candidate.image_url}
              alt={candidate.title}
              fill
              sizes="(min-width: 768px) 240px, 100vw"
              className="object-cover"
            />
          ) : (
            <Package className="w-10 h-10 text-muted-foreground/30" />
          )}
          <div className="absolute top-3 left-3">
            <span
              className={`inline-flex items-center px-2.5 py-1 rounded-full text-caption font-medium ${
                                isLost
                  ? 'bg-destructive/10 text-destructive'
                  : 'bg-status-found/10 text-status-found'
              }`}
            >
              {candidate.type}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8">
          <MatchScore total={score.total} breakdown={score.breakdown} index={index} />

          <div className="mt-5 pt-5 border-t border-border/30">
            <h3 className="text-h3 mb-2">{candidate.title}</h3>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-small text-muted-foreground mb-3">
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
            <p className="text-body text-muted-foreground line-clamp-3 mb-4">
              {candidate.description}
            </p>
            <Link
              href={`/items/${candidate.id}`}
              className="inline-flex items-center gap-1.5 text-small font-medium text-foreground hover:gap-2.5 transition-all"
            >
              View this report
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
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
