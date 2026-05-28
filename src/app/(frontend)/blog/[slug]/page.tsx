import Image from 'next/image'
import Link from 'next/link'
import { headers as getHeaders } from 'next/headers.js'
import { notFound } from 'next/navigation'
import { getPayload, type Payload } from 'payload'

import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import config from '@/payload.config'
import type { Media, SiteSetting } from '@/payload-types'

type BlogPostPageProps = {
  params: Promise<{
    slug: string
  }>
}

const defaultSettings: Partial<SiteSetting> = {
  availability: 'Available for selected projects',
  name: 'Aleksander Eerma',
  siteName: 'Aleksander Eerma',
}

function getMediaUrl(media: Media | number | string | null | undefined) {
  if (media && typeof media === 'object' && 'url' in media) {
    return media.url
  }

  return null
}

function formatPostDate(value: string) {
  return new Intl.DateTimeFormat('en', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(value))
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

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const headers = await getHeaders()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const { user } = await payload.auth({ headers })

  const [settingsResult, postsResult] = await Promise.all([
    getSiteSettings(payload),
    payload.find({
      collection: 'posts',
      depth: 1,
      limit: 1,
      where: {
        slug: {
          equals: slug,
        },
      },
    }),
  ])

  const post = postsResult.docs[0]

  if (!post) {
    notFound()
  }

  const settings = { ...defaultSettings, ...settingsResult }
  const coverImage = getMediaUrl(post.coverImage)
  const paragraphs = post.body
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)

  return (
    <main className="site-shell interior-page">
      <Header
        adminHref={payloadConfig.routes.admin}
        email={settings.email}
        isLoggedIn={Boolean(user)}
        siteName={settings.siteName}
      />

      <article className="post-shell">
        <Link className="back-link" href="/blog">
          Back to blog
        </Link>
        <header className="post-header">
          <div className="blog-card-meta">
            <span>{formatPostDate(post.publishedAt)}</span>
            {post.readTime && <span>{post.readTime}</span>}
          </div>
          <h1>{post.title}</h1>
          <p>{post.excerpt}</p>
          {!!post.tags?.length && (
            <ul className="tag-list" aria-label={`${post.title} tags`}>
              {post.tags.map((tag) => (
                <li key={tag.id ?? tag.label}>{tag.label}</li>
              ))}
            </ul>
          )}
        </header>

        {coverImage && (
          <div className="post-cover">
            <Image alt="" fill sizes="(max-width: 900px) 100vw, 920px" src={coverImage} />
          </div>
        )}

        <div className="post-body">
          {paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </article>

      <Footer settings={settings} />
    </main>
  )
}
