'use client'

import { MagneticLink } from './Magnetic'

export function NavLeft() {
  return (
    <nav className="nav-left" aria-label="Primary left">
      <MagneticLink href="/projects" className="nav-link">Projects</MagneticLink>
      <MagneticLink href="/#skills" className="nav-link">Stack</MagneticLink>
    </nav>
  )
}

export function NavRight({ email, contact }: { email?: string | null; contact?: object }) {
  return (
    <nav className="nav-right" aria-label="Primary right">
      <MagneticLink href="/blog" className="nav-link">Blog</MagneticLink>
      {/* ContactOverlay is rendered by Header when contact prop is passed */}
    </nav>
  )
}
