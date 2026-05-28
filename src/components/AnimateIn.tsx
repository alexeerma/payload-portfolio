'use client'

import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'

type AnimateInProps = {
  children: ReactNode
  className?: string
  delay?: number
  direction?: 'up' | 'left'
}

export function AnimateIn({ children, className, delay = 0, direction = 'up' }: AnimateInProps) {
  const reduced = useReducedMotion()

  return (
    <motion.div
      className={className}
      initial={{ opacity: reduced ? 1 : 0, y: reduced ? 0 : direction === 'up' ? 32 : 0, x: reduced ? 0 : direction === 'left' ? -24 : 0, filter: reduced ? 'blur(0px)' : 'blur(10px)' }}
      whileInView={{ opacity: 1, y: 0, x: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: reduced ? 0 : 0.65, delay: reduced ? 0 : delay, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
    >
      {children}
    </motion.div>
  )
}
