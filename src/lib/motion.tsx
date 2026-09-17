'use client'

import {
  motion,
  type Variants,
  type Transition,
  type UseInViewOptions,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  useReducedMotion,
  type MotionValue,
} from 'framer-motion'
import { useRef, useEffect, useCallback, type ReactNode } from 'react'

// =============================================
// TRANSITION PRESETS
// =============================================

const easeOut: Transition['ease'] = [0.4, 0, 0.2, 1]
const easeInOut: Transition['ease'] = [0.4, 0, 0.2, 1]
const easeOutExpo: Transition['ease'] = [0.16, 1, 0.3, 1]

export const transitions = {
  quick: { duration: 0.18, ease: easeOut } as Transition,
  default: { duration: 0.25, ease: easeOut } as Transition,
  reveal: { duration: 0.5, ease: easeOut } as Transition,
  emphasis: { duration: 0.7, ease: easeInOut } as Transition,
  spring: { type: 'spring', stiffness: 300, damping: 30 } as Transition,
  springSoft: { type: 'spring', stiffness: 200, damping: 25 } as Transition,
  expo: { duration: 0.6, ease: easeOutExpo } as Transition,
}

const defaultViewport: UseInViewOptions = {
  once: true,
  margin: '0px 0px -100px 0px',
}

// =============================================
// FADE IN
// =============================================

const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function FadeIn({
  children,
  className,
  delay = 0,
  duration = 0.5,
  ...props
}: {
  children: React.ReactNode
  className?: string
  delay?: number
  duration?: number
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: reduced ? 1 : 0 }}
      whileInView={{ opacity: 1 }}
      viewport={defaultViewport}
      transition={{ duration: reduced ? 0.01 : duration, delay: reduced ? 0 : delay, ease: easeOut }}
      {...props}
    >
      {children}
    </motion.div>
  )
}

// =============================================
// FADE UP
// =============================================

export function FadeUp({
  children,
  className,
  delay = 0,
  duration = 0.5,
  distance = 24,
  ...props
}: {
  children: React.ReactNode
  className?: string
  delay?: number
  duration?: number
  distance?: number
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: reduced ? 1 : 0, y: reduced ? 0 : distance }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={defaultViewport}
      transition={{ duration: reduced ? 0.01 : duration, delay: reduced ? 0 : delay, ease: easeOut }}
      {...props}
    >
      {children}
    </motion.div>
  )
}

// =============================================
// REVEAL
// =============================================

export function Reveal({
  children,
  className,
  delay = 0,
  duration = 0.6,
  ...props
}: {
  children: React.ReactNode
  className?: string
  delay?: number
  duration?: number
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, scale: 0.98 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={defaultViewport}
      transition={{ duration, delay, ease: easeOut }}
      {...props}
    >
      {children}
    </motion.div>
  )
}

// =============================================
// STAGGER CONTAINER
// =============================================

export function StaggerContainer({
  children,
  className,
  delay = 0,
  staggerDelay = 0.08,
  ...props
}: {
  children: React.ReactNode
  className?: string
  delay?: number
  staggerDelay?: number
}) {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: delay,
        staggerChildren: staggerDelay,
      },
    },
  }

  return (
    <motion.div
      className={className}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '0px 0px -100px 0px' }}
      {...props}
    >
      {children}
    </motion.div>
  )
}

// =============================================
// STAGGER ITEM
// =============================================

export function StaggerItem({
  children,
  className,
  distance = 20,
  ...props
}: {
  children: React.ReactNode
  className?: string
  distance?: number
}) {
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: distance },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
    },
  }

  return (
    <motion.div className={className} variants={itemVariants} {...props}>
      {children}
    </motion.div>
  )
}

// =============================================
// HOVER LIFT
// =============================================

export function HoverLift({
  children,
  className,
  distance = -4,
  ...props
}: {
  children: React.ReactNode
  className?: string
  distance?: number
}) {
  return (
    <motion.div
      className={className}
      whileHover={{ y: distance }}
      transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
      {...props}
    >
      {children}
    </motion.div>
  )
}

// =============================================
// PAGE TRANSITION
// =============================================

export function PageTransition({
  children,
  className,
  ...props
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      {...props}
    >
      {children}
    </motion.div>
  )
}

// =============================================
// TAB TRANSITION
// =============================================

export function TabTransition({
  children,
  className,
  ...props
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
      {...props}
    >
      {children}
    </motion.div>
  )
}

// =============================================
// MODAL TRANSITION
// =============================================

export function ModalTransition({
  children,
  className,
  ...props
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
      {...props}
    >
      {children}
    </motion.div>
  )
}

// =============================================
// REDUCED MOTION
// =============================================

export function usePrefersReducedMotion() {
  return useReducedMotion()
}

// =============================================
// SCROLL REVEAL - Advanced reveal with direction
// =============================================

export function ScrollReveal({
  children,
  className,
  delay = 0,
  duration = 0.6,
  direction = 'up',
  distance = 32,
  ...props
}: {
  children: ReactNode
  className?: string
  delay?: number
  duration?: number
  direction?: 'up' | 'down' | 'left' | 'right'
  distance?: number
}) {
  const transforms: Record<string, { x?: number; y?: number }> = {
    up: { y: distance },
    down: { y: -distance },
    left: { x: distance },
    right: { x: -distance },
  }

  const t = transforms[direction]

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, ...t }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -80px 0px' }}
      transition={{ duration, delay, ease: easeOutExpo }}
      {...props}
    >
      {children}
    </motion.div>
  )
}

// =============================================
// IMAGE REVEAL - Clip-path reveal for images
// =============================================

export function ImageReveal({
  children,
  className,
  delay = 0,
  duration = 0.7,
  ...props
}: {
  children: ReactNode
  className?: string
  delay?: number
  duration?: number
}) {
  return (
    <motion.div
      className={className}
      initial={{ clipPath: 'inset(0 100% 0 0)' }}
      whileInView={{ clipPath: 'inset(0 0% 0 0)' }}
      viewport={{ once: true, margin: '0px 0px -80px 0px' }}
      transition={{ duration, delay, ease: easeOutExpo }}
      {...props}
    >
      {children}
    </motion.div>
  )
}

// =============================================
// ANIMATED TEXT - Word by word reveal
// =============================================

export function AnimatedText({
  text,
  className,
  delay = 0,
  staggerDelay = 0.04,
}: {
  text: string
  className?: string
  delay?: number
  staggerDelay?: number
}) {
  const words = text.split(' ')

  const container: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: delay,
      },
    },
  }

  const child: Variants = {
    hidden: { opacity: 0, y: 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: easeOutExpo },
    },
  }

  return (
    <motion.div
      className={className}
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      {words.map((word, i) => (
        <motion.span key={i} variants={child} className="inline-block mr-[0.3em]">
          {word}
        </motion.span>
      ))}
    </motion.div>
  )
}

// =============================================
// PARALLAY - Scroll-driven parallax
// =============================================

export function Parallax({
  children,
  className,
  speed = 0.5,
  direction = 'up',
  ...props
}: {
  children: ReactNode
  className?: string
  speed?: number
  direction?: 'up' | 'down'
}) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const y = useTransform(
    scrollYProgress,
    [0, 1],
    direction === 'up' ? [80 * speed, -80 * speed] : [-80 * speed, 80 * speed]
  )

  return (
    <motion.div ref={ref} className={className} style={{ y }} {...props}>
      {children}
    </motion.div>
  )
}

// =============================================
// MAGNETIC BUTTON
// =============================================

export function MagneticButton({
  children,
  className,
  strength = 0.3,
  ...props
}: {
  children: ReactNode
  className?: string
  strength?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!ref.current) return
      const rect = ref.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      const deltaX = e.clientX - centerX
      const deltaY = e.clientY - centerY
      x.set(deltaX * strength)
      y.set(deltaY * strength)
    },
    [x, y, strength]
  )

  const handleMouseLeave = useCallback(() => {
    x.set(0)
    y.set(0)
  }, [x, y])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.addEventListener('mousemove', handleMouseMove)
    el.addEventListener('mouseleave', handleMouseLeave)
    return () => {
      el.removeEventListener('mousemove', handleMouseMove)
      el.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [handleMouseMove, handleMouseLeave])

  const springX = useSpring(x, { stiffness: 150, damping: 15 })
  const springY = useSpring(y, { stiffness: 150, damping: 15 })

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ x: springX, y: springY }}
      {...props}
    >
      {children}
    </motion.div>
  )
}

// =============================================
// SCROLL PROGRESS HOOK
// =============================================

export function useScrollProgress(): MotionValue<number> {
  const { scrollYProgress } = useScroll()
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })
  return smoothProgress
}

// =============================================
// SCROLL-DRIVEN SECTION
// =============================================

export function ScrollSection({
  children,
  className,
  ...props
}: {
  children: ReactNode
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.6, 1, 1, 0.6])
  const scale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.98, 1, 1, 0.98])

  return (
    <motion.section ref={ref} className={className} style={{ opacity, scale }} {...props}>
      {children}
    </motion.section>
  )
}

