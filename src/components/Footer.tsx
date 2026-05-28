import type { SiteSetting } from '@/payload-types'

type FooterProps = {
  settings: Partial<SiteSetting>
}

export function Footer({ settings }: FooterProps) {
  const year = new Date().getFullYear()

  return (
    <footer className="site-footer">
      <div>
        <p className="eyebrow">Contact</p>
        <h2>{settings.name || 'Your Name'}</h2>
        <p>{settings.availability || 'Available for selected projects'}</p>
      </div>
      <div className="footer-links">
        {settings.email && <a href={`mailto:${settings.email}`}>{settings.email}</a>}
        {settings.resumeUrl && <a href={settings.resumeUrl}>Resume</a>}
        {settings.socialLinks?.map((link) => (
          <a href={link.url} key={link.id ?? link.url} rel="noreferrer" target="_blank">
            {link.label}
          </a>
        ))}
      </div>
      <p className="footer-meta">
        {settings.siteName || 'Developer Portfolio'} · {year}
      </p>
    </footer>
  )
}
