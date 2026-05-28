'use client'

import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useEffect, useState } from 'react'

export function CursorGlow() {
  const [visible, setVisible] = useState(false)
  const x = useMotionValue(-500)
  const y = useMotionValue(-500)
  const springX = useSpring(x, { stiffness: 60, damping: 18 })
  const springY = useSpring(y, { stiffness: 60, damping: 18 })

  useEffect(() => {
    if (!window.matchMedia('(hover: hover)').matches) return
    function onMove(e: MouseEvent) {
      x.set(e.clientX)
      y.set(e.clientY)
      setVisible(true)
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [x, y])

  if (!visible) return null

  return (
    <motion.div
      aria-hidden
      className="cursor-glow"
      style={{ left: springX, top: springY }}
    />
  )
}
