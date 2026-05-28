import React from 'react'
import './styles.css'

export const metadata = {
  description: 'A developer portfolio powered by Payload CMS.',
  icons: { icon: '/favicon.svg' },
  title: 'Developer Portfolio',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <main>{children}</main>
      </body>
    </html>
  )
}
