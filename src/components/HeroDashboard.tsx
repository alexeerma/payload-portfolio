'use client'

import { animate, motion, useInView, useMotionValue, useTransform } from 'framer-motion'
import { useEffect, useRef } from 'react'

type HeroDashboardProps = {
  dashboardSignals: { label: string; value: string }[]
  heroStats: { label: string; value: string }[]
  terminalLines: string[]
}

function CountUp({ value }: { value: string }) {
  const num = parseInt(value)
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true })
  const count = useMotionValue(0)
  const display = useTransform(count, (v) => String(Math.round(v)).padStart(2, '0'))

  useEffect(() => {
    if (!isInView || isNaN(num)) return
    const controls = animate(count, num, { duration: 1.6, ease: 'easeOut' })
    return controls.stop
  }, [isInView, count, num])

  if (isNaN(num)) return <strong>{value}</strong>

  return <motion.strong ref={ref}>{display}</motion.strong>
}

export function HeroDashboard({ dashboardSignals, heroStats, terminalLines }: HeroDashboardProps) {
  return (
    <motion.aside
      aria-hidden="true"
      className="hero-dashboard"
      initial={{ opacity: 0, x: 40, rotateY: 4 }}
      animate={{ opacity: 1, x: 0, rotateY: 0 }}
      transition={{ duration: 0.75, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
      style={{ transformPerspective: 1200 }}
    >
      <div className="dashboard-topline">
        <span>Web Development</span>
        <strong>Available</strong>
      </div>

      <div className="terminal-window">
        <span className="terminal-dot" />
        <span className="terminal-dot" />
        <span className="terminal-dot" />
        {terminalLines.map((line, i) => (
          <motion.p
            key={i}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 + i * 0.12, duration: 0.38, ease: 'easeOut' }}
          >
            {line}
          </motion.p>
        ))}
      </div>

      <div className="stat-grid">
        {heroStats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 14, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.65 + i * 0.08, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <CountUp value={stat.value} />
            <span>{stat.label}</span>
          </motion.div>
        ))}
      </div>

      <div className="signal-stack" aria-hidden="true">
        {dashboardSignals.map((card) => (
          <div className="signal-card" key={card.label}>
            <span>{card.label}</span>
            <strong>{card.value}</strong>
          </div>
        ))}
      </div>

      <div className="signal-meter">
        <span />
        <span />
        <span />
      </div>
    </motion.aside>
  )
}
