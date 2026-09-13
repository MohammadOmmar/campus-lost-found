'use client'

import { HorizontalMarquee } from '@/components/motion/horizontal-marquee'

const words = [
  'LOST',
  '·',
  'FOUND',
  '·',
  'RETURN',
  '·',
  'RECONNECT',
  '·',
]

export function ContinuousMarquee() {
  return (
    <div className="border-y border-border-subtle/50 bg-base-900/20 py-5 overflow-hidden">
      <HorizontalMarquee duration={25} trackClassName="gap-8">
        {words.map((word, i) => (
          <span
            key={i}
            className={`text-[11px] font-mono tracking-[0.25em] whitespace-nowrap ${
              word === '·' ? 'text-accent/30' : 'text-text-muted/40'
            }`}
          >
            {word}
          </span>
        ))}
      </HorizontalMarquee>
    </div>
  )
}
