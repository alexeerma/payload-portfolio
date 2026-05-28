import type { SiteSetting } from '@/payload-types'

type FooterProps = {
  settings: Partial<SiteSetting>
}

export function Footer({ settings }: FooterProps) {
  const year = new Date().getFullYear()

  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-left">
          <p className="footer-name">{settings.name || 'Your Name'}</p>
        </div>

        <div className="footer-center">
          {settings.resumeUrl && (
            <a href={settings.resumeUrl} rel="noreferrer" target="_blank">
              Resume
            </a>
          )}
          {settings.socialLinks?.map((link) => (
            <a href={link.url} key={link.id ?? link.url} rel="noreferrer" target="_blank">
              {link.label}
            </a>
          ))}
        </div>

        <div className="footer-right">
          <p className="footer-meta">{settings.siteName || 'Developer Portfolio'}</p>
          <p className="footer-meta">All rights reserved © {year}</p>
        </div>
      </div>
    </footer>
  )
}
