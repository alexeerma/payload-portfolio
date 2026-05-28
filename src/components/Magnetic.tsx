'use client'

import { motion, useMotionValue, useSpring } from 'framer-motion'
import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
  className?: string
  strength?: number
}

function useMagnetic(strength = 0.22) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 180, damping: 14 })
  const sy = useSpring(y, { stiffness: 180, damping: 14 })

  function onMouseMove(e: React.MouseEvent<HTMLElement>) {
    const rect = e.currentTarget.getBoundingClientRect()
    x.set((e.clientX - rect.left - rect.width / 2) * strength)
    y.set((e.clientY - rect.top - rect.height / 2) * strength)
  }

  function onMouseLeave() {
    x.set(0)
    y.set(0)
  }

  return { sx, sy, onMouseMove, onMouseLeave }
}

export function MagneticLink({
  href,
  children,
  className,
  target,
  rel,
  strength,
}: Props & { href: string; target?: string; rel?: string }) {
  const { sx, sy, onMouseMove, onMouseLeave } = useMagnetic(strength)
  return (
    <motion.a
      className={className}
      href={href}
      rel={rel}
      style={{ x: sx, y: sy, display: 'inline-block' }}
      target={target}
      onMouseLeave={onMouseLeave}
      onMouseMove={onMouseMove}
    >
      {children}
    </motion.a>
  )
}

export function MagneticButton({
  children,
  className,
  onClick,
  type,
  strength,
}: Props & { onClick?: () => void; type?: 'button' | 'submit' | 'reset' }) {
  const { sx, sy, onMouseMove, onMouseLeave } = useMagnetic(strength)
  return (
    <motion.button
      className={className}
      style={{ x: sx, y: sy }}
      type={type ?? 'button'}
      onClick={onClick}
      onMouseLeave={onMouseLeave}
      onMouseMove={onMouseMove as React.MouseEventHandler<HTMLButtonElement>}
    >
      {children}
    </motion.button>
  )
}

export function MagneticSpan({ children, className, strength }: Props) {
  const { sx, sy, onMouseMove, onMouseLeave } = useMagnetic(strength)
  return (
    <motion.span
      className={className}
      style={{ x: sx, y: sy, display: 'inline-block' }}
      onMouseLeave={onMouseLeave}
      onMouseMove={onMouseMove as React.MouseEventHandler<HTMLSpanElement>}
    >
      {children}
    </motion.span>
  )
}
