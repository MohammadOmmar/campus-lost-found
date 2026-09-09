'use client'

import {
  motion,
  type Variants,
  type Transition,
  type UseInViewOptions,
} from 'framer-motion'

// =============================================
// TRANSITION PRESETS
// =============================================

const easeOut: Transition['ease'] = [0.4, 0, 0.2, 1]
const easeInOut: Transition['ease'] = [0.4, 0, 0.2, 1]

export const transitions = {
  quick: { duration: 0.18, ease: easeOut } as Transition,
  default: { duration: 0.25, ease: easeOut } as Transition,
  reveal: { duration: 0.5, ease: easeOut } as Transition,
  emphasis: { duration: 0.7, ease: easeInOut } as Transition,
}

const defaultViewport: UseInViewOptions = {
  once: true,
  margin: '0px 0px -100px 0px',
}

// =============================================
// FADE IN
// =============================================

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
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={defaultViewport}
      transition={{ duration, delay, ease: easeOut }}
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
      initial={{ opacity: 0, y: distance }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={defaultViewport}
      transition={{ duration, delay, ease: easeOut }}
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

export function useReducedMotion() {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}
