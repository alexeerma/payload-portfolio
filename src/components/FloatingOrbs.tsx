'use client'

import { motion } from 'framer-motion'

export function FloatingOrbs() {
  return (
    <div aria-hidden className="floating-orbs">
      <motion.div
        className="orb orb-blue"
        animate={{ x: [0, 40, -30, 0], y: [0, -50, 30, 0], scale: [1, 1.1, 0.95, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="orb orb-mint"
        animate={{ x: [0, -35, 45, 0], y: [0, 40, -35, 0], scale: [1, 0.9, 1.08, 1] }}
        transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
      />
      <motion.div
        className="orb orb-purple"
        animate={{ x: [0, 28, -20, 0], y: [0, -28, 42, 0], scale: [1, 1.05, 0.92, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 8 }}
      />
    </div>
  )
}
