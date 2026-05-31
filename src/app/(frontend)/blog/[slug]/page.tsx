import Image from 'next/image'
import Link from 'next/link'
import { headers as getHeaders } from 'next/headers.js'
import type { Metadata } from 'next'
import { MagneticLink } from '@/components/Magnetic'
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

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const url = process.env.NEXT_PUBLIC_SERVER_URL || 'https://alexeerma.ee'

  const result = await payload.find({
    collection: 'posts',
    depth: 1,
    limit: 1,
    where: { slug: { equals: slug } },
  })

  const post = result.docs[0]
  if (!post) return { title: 'Post not found' }

  const coverImage = getMediaUrl(post.coverImage)

  return {
    title: post.title || '',
    description: post.excerpt || '',
    alternates: { canonical: `${url}/blog/${slug}` },
    openGraph: {
      title: post.title || '',
      description: post.excerpt || '',
      url: `${url}/blog/${slug}`,
      type: 'article',
      images: coverImage ? [{ url: coverImage }] : [],
    },
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
    <main className="site-shell interior-page" id="main-content">
      <Header
        contact={{ email: settings.email, name: settings.name, availability: settings.availability, siteName: settings.siteName }}
        siteName={settings.siteName}
        logoUrl={typeof settings.logo === 'object' && settings.logo && 'url' in settings.logo ? settings.logo.url : null}
      />

      <article className="post-shell">
        <MagneticLink className="back-link" href="/blog">
          Back to blog
        </MagneticLink>
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
