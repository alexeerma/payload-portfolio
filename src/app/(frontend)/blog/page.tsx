import { headers as getHeaders } from 'next/headers.js'
import { getPayload, type Payload } from 'payload'

import { BlogPreview } from '@/components/BlogPreview'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import config from '@/payload.config'
import type { SiteSetting } from '@/payload-types'

const defaultSettings: Partial<SiteSetting> = {
  availability: 'Available for selected projects',
  name: 'Aleksander Eerma',
  siteName: 'Aleksander Eerma',
}

async function getSiteSettings(payload: Payload) {
  try {
    return await payload.findGlobal({
      slug: 'site-settings',
      depth: 1,
    })
  } catch {
    return defaultSettings as SiteSetting
  }
}

export default async function BlogPage() {
  const headers = await getHeaders()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const { user } = await payload.auth({ headers })

  const [settingsResult, postsResult] = await Promise.all([
    getSiteSettings(payload),
    payload.find({
      collection: 'posts',
      depth: 1,
      limit: 24,
      sort: '-publishedAt',
    }),
  ])

  const settings = { ...defaultSettings, ...settingsResult }

  return (
    <main className="site-shell interior-page">
      <Header
        contact={{ email: settings.email, name: settings.name, availability: settings.availability, siteName: settings.siteName }}
        siteName={settings.siteName}
      />

      <section className="page-hero" aria-labelledby="blog-page-title">
        <p className="eyebrow">Blog</p>
        <h1 id="blog-page-title">Notes from code and sport.</h1>
        <p>
          Short thoughts on building clean products, managing CMS workflows, training habits, and
          the overlap between development and professional volleyball.
        </p>
      </section>

      <section className="content-band blog-index-section" aria-label="All blog posts">
        <BlogPreview posts={postsResult.docs} />
      </section>

      <Footer settings={settings} />
    </main>
  )
}
