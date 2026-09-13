'use client'

import { motion } from 'framer-motion'
import { useScrollProgress } from '@/lib/motion'

export function ScrollProgress() {
  const progress = useScrollProgress()

  return (
    <motion.div
      className="scroll-progress"
      style={{ scaleX: progress }}
    />
  )
}
