import Image from 'next/image'
import Link from 'next/link'
import type { SiteSetting } from '@/payload-types'

type FooterProps = {
  settings: Partial<SiteSetting>
}

function getLogoUrl(settings: Partial<SiteSetting>) {
  const logo = settings.logo
  if (logo && typeof logo === 'object' && 'url' in logo) return logo.url
  return null
}

export function Footer({ settings }: FooterProps) {
  const year = new Date().getFullYear()
  const logoUrl = getLogoUrl(settings) || '/aelogo.svg'

  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-left">
          <Link href="/" className="footer-logo" aria-label="Home">
            <Image src={logoUrl} alt={settings.name || 'Logo'} width={40} height={40} unoptimized />
          </Link>
        </div>

        <div className="footer-center">
          {settings.resumeUrl && (
            <a href={settings.resumeUrl} rel="noreferrer" target="_blank">Resume</a>
          )}
          {settings.socialLinks?.map((link) => (
            <a href={link.url} key={link.id ?? link.url} rel="noreferrer" target="_blank">
              {link.label}
            </a>
          ))}
        </div>

        <div className="footer-right">
          <p className="footer-meta">{settings.name || 'Aleksander Eerma'}</p>
          <p className="footer-meta">All rights reserved © {year}</p>
        </div>
      </div>
    </footer>
  )
}
