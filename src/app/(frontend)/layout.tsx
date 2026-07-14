import type { Metadata, Viewport } from 'next'
import { getPayload } from 'payload'
import React from 'react'

import { Dock } from '@/components/Dock'
import config from '@/payload.config'
import './styles.css'

export const viewport: Viewport = {
  themeColor: '#ffffff',
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SERVER_URL || 'https://alexeerma.ee'),
  title: {
    default: 'Aleksander Eerma — Developer',
    template: '%s | Aleksander Eerma',
  },
  description: 'Full-stack developer and professional volleyball player. Building clean digital products with Next.js, Payload CMS, and sharp interfaces.',
  icons: { icon: '/favicon.svg' },
  openGraph: {
    siteName: 'Aleksander Eerma',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
  },
  robots: {
    index: true,
    follow: true,
  },
}

async function getEmail() {
  try {
    const payload = await getPayload({ config: await config })
    const settings = await payload.findGlobal({ slug: 'site-settings', depth: 0 })
    return settings?.email ?? null
  } catch {
    return null
  }
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props
  const email = await getEmail()

  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main-content">Skip to content</a>
        {children}
        <Dock email={email} />
      </body>
    </html>
  )
}
