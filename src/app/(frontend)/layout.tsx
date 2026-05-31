import React from 'react'
import type { Metadata, Viewport } from 'next'
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

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main-content">Skip to content</a>
        {children}
      </body>
    </html>
  )
}
