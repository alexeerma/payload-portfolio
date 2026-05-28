import Image from 'next/image'
import Link from 'next/link'
import type { CSSProperties } from 'react'

import type { Media, Post } from '@/payload-types'

type DisplayPost = Pick<Post, 'title' | 'slug' | 'excerpt' | 'publishedAt' | 'readTime' | 'tags'> & {
  coverImage?: Post['coverImage']
  id?: number | string
}

type BlogPreviewProps = {
  posts: DisplayPost[]
}

function getMediaUrl(media: Media | number | string | null | undefined) {
  if (media && typeof media === 'object' && 'url' in media) return media.url
  return null
}

function formatPostDate(value: string) {
  return new Intl.DateTimeFormat('en', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value))
}

export function BlogPreview({ posts }: BlogPreviewProps) {
  return (
    <div className="blog-preview-grid">
      {posts.map((post, index) => {
        const imageUrl = getMediaUrl(post.coverImage) ?? '/portfolio-hero.png'
        return (
          <article
            className="blog-card"
            key={post.id ?? post.slug}
            style={{ '--card-index': index } as CSSProperties}
          >
            <Link href={`/blog/${post.slug}`} className="blog-card-image" tabIndex={-1}>
              <Image
                alt=""
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1120px) 50vw, 33vw"
                src={imageUrl}
              />
            </Link>
            <div className="blog-card-body">
              <div className="blog-card-meta">
                <span>{formatPostDate(post.publishedAt)}</span>
                {post.readTime && <span>{post.readTime}</span>}
              </div>
              <h3>
                <Link href={`/blog/${post.slug}`}>{post.title}</Link>
              </h3>
              <p>{post.excerpt}</p>
              {!!post.tags?.length && (
                <ul className="tag-list" aria-label={`${post.title} tags`}>
                  {post.tags.slice(0, 3).map((tag) => (
                    <li key={tag.id ?? tag.label}>{tag.label}</li>
                  ))}
                </ul>
              )}
            </div>
          </article>
        )
      })}
    </div>
  )
}
