'use client'

import Image from 'next/image'
import { ContactOverlay } from './ContactOverlay'
import { MagneticLink } from './Magnetic'

type ContactInfo = {
  availability?: string | null
  email?: string | null
  location?: string | null
  name?: string | null
  resumeUrl?: string | null
  siteName?: string | null
  socialLinks?: Array<{ id?: string | null; label: string; url: string }> | null
}

type HeaderProps = {
  adminHref?: string
  contact?: ContactInfo
  isLoggedIn?: boolean
  logoUrl?: string | null
  siteName?: string | null
}

export function Header({ contact, logoUrl }: HeaderProps) {
  const logo = logoUrl || '/aelogo.svg'

  return (
    <header className="site-header">
      <nav className="nav-left" aria-label="Primary left">
        <MagneticLink href="/projects" className="nav-link">Projects</MagneticLink>
        <MagneticLink href="/#skills" className="nav-link">Stack</MagneticLink>
      </nav>

      <MagneticLink aria-label="Home" className="brand" href="/">
        <Image alt="Logo" className="brand-logo" height={32} src={logo} width={32} unoptimized />
      </MagneticLink>

      <nav className="nav-right" aria-label="Primary right">
        <MagneticLink href="/blog" className="nav-link">Blog</MagneticLink>
        {contact && <ContactOverlay contact={contact} />}
      </nav>
    </header>
  )
}
