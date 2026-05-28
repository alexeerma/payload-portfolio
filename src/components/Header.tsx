import Link from 'next/link'

import { ContactOverlay } from './ContactOverlay'

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
  siteName?: string | null
}

export function Header({ contact, siteName }: HeaderProps) {
  return (
    <header className="site-header">
      <nav className="nav-left" aria-label="Primary left">
        <Link href="/projects">Projects</Link>
        <Link href="/#skills">Stack</Link>
      </nav>

      <Link aria-label="Home" className="brand" href="/" />

      <nav className="nav-right" aria-label="Primary right">
        <Link href="/blog">Blog</Link>
        {contact ? (
          <ContactOverlay contact={contact} />
        ) : (
          contact?.email && <a href={`mailto:${contact.email}`}>Contact</a>
        )}
      </nav>
    </header>
  )
}
