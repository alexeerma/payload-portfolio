import Link from 'next/link'

type HeaderProps = {
  adminHref: string
  email?: string | null
  isLoggedIn: boolean
  siteName?: string | null
}

export function Header({ adminHref, email, isLoggedIn, siteName }: HeaderProps) {
  return (
    <header className="site-header">
      <Link className="brand" href="/">
        {siteName || 'Developer Portfolio'}
      </Link>
      <nav className="nav-actions" aria-label="Primary">
        <Link href="/projects">Projects</Link>
        <Link href="/#skills">Stack</Link>
        <Link href="/blog">Blog</Link>
        {email && <a href={`mailto:${email}`}>Contact</a>}
        <Link href={adminHref}>{isLoggedIn ? 'Dashboard' : 'Admin'}</Link>
      </nav>
    </header>
  )
}
