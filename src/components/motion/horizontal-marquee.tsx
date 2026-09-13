'use client'

import { cn } from '@/lib/utils'
import { usePrefersReducedMotion } from '@/lib/motion'

interface HorizontalMarqueeProps {
  children: React.ReactNode
  className?: string
  trackClassName?: string
  duration?: number
  pauseOnHover?: boolean
  reverse?: boolean
}

export function HorizontalMarquee({
  children,
  className,
  trackClassName,
  duration = 30,
  pauseOnHover = true,
  reverse = false,
}: HorizontalMarqueeProps) {
  const prefersReducedMotion = usePrefersReducedMotion()

  if (prefersReducedMotion) {
    return <div className={cn('overflow-hidden', className)}>{children}</div>
  }

  return (
    <div
      className={cn('overflow-hidden', className)}
      style={{ '--marquee-duration': `${duration}s` } as React.CSSProperties}
    >
      <div
        className={cn(
          'marquee-track flex w-max',
          pauseOnHover && 'hover:[animation-play-state:paused]',
          reverse && '[animation-direction:reverse]',
          trackClassName
        )}
      >
        <div className="flex items-center gap-8 pr-8 shrink-0" aria-hidden={false}>
          {children}
        </div>
        <div className="flex items-center gap-8 pr-8 shrink-0" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  )
}
