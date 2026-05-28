import Link from 'next/link'
import type { CSSProperties } from 'react'

import type { Post } from '@/payload-types'

type DisplayPost = Pick<Post, 'title' | 'slug' | 'excerpt' | 'publishedAt' | 'readTime' | 'tags'> & {
  id?: number | string
}

type BlogPreviewProps = {
  posts: DisplayPost[]
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
      {posts.map((post, index) => (
        <article
          className="blog-card"
          key={post.id ?? post.slug}
          style={{ '--card-index': index } as CSSProperties}
        >
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
        </article>
      ))}
    </div>
  )
}
