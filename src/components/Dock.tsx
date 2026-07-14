'use client'

import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from 'framer-motion'
import Link from 'next/link'
import { useRef } from 'react'

type DockItem = {
  label: string
  href: string
  icon: React.ReactNode
  external?: boolean
}

const ICONS = {
  home: (
    <path d="M4 11.5 12 5l8 6.5M6 10.5V19h12v-8.5M10 19v-5h4v5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
  ),
  projects: (
    <path d="M4 6h7v6H4zM13 6h7v4h-7zM13 12h7v6h-7zM4 14h7v4H4z" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
  ),
  stack: (
    <path d="M12 4 3 8.5 12 13l9-4.5zM3 12.5 12 17l9-4.5M3 16.5 12 21l9-4.5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" strokeLinecap="round" />
  ),
  blog: (
    <path d="M6 4h9l3 3v13H6zM14 4v4h4M9 12h6M9 15h6M9 9h3" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" strokeLinecap="round" />
  ),
  mail: (
    <path d="M4 6h16v12H4zM4 7l8 6 8-6" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" strokeLinecap="round" />
  ),
}

function DockButton({ item, mouseX }: { item: DockItem; mouseX: MotionValue<number> }) {
  const ref = useRef<HTMLDivElement>(null)

  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 }
    return val - bounds.x - bounds.width / 2
  })
  const sizeSync = useTransform(distance, [-140, 0, 140], [44, 68, 44])
  const size = useSpring(sizeSync, { mass: 0.1, stiffness: 170, damping: 14 })

  const inner = (
    <motion.div className="dock-btn" ref={ref} style={{ width: size, height: size }}>
      <svg aria-hidden="true" viewBox="0 0 24 24" className="dock-icon">
        {item.icon}
      </svg>
      <span className="dock-tip">{item.label}</span>
    </motion.div>
  )

  // If the target section is on the current page, smooth-scroll to it directly
  // (a plain hash jump is unreliable with the pinned-scroll hero).
  const onClick = (e: React.MouseEvent) => {
    const hash = item.href.split('#')[1]
    if (!hash) return
    const el = document.getElementById(hash)
    if (!el) return
    e.preventDefault()
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  if (item.external) {
    return (
      <a aria-label={item.label} className="dock-link" href={item.href}>
        {inner}
      </a>
    )
  }
  return (
    <Link aria-label={item.label} className="dock-link" href={item.href} onClick={onClick}>
      {inner}
    </Link>
  )
}

export function Dock({ email }: { email?: string | null }) {
  const mouseX = useMotionValue(Infinity)

  const items: DockItem[] = [
    { label: 'Home', href: '/', icon: ICONS.home },
    { label: 'Projects', href: '/projects', icon: ICONS.projects },
    { label: 'Stack', href: '/#skills', icon: ICONS.stack },
    { label: 'Blog', href: '/blog', icon: ICONS.blog },
    { label: 'Contact', href: email ? `mailto:${email}` : '/#contact', icon: ICONS.mail, external: !!email },
  ]

  return (
    <nav aria-label="Primary" className="dock">
      <div
        className="dock-bar"
        onMouseLeave={() => mouseX.set(Infinity)}
        onMouseMove={(e) => mouseX.set(e.pageX)}
      >
        {items.map((item) => (
          <DockButton item={item} key={item.label} mouseX={mouseX} />
        ))}
      </div>
    </nav>
  )
}
