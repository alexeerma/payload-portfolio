import { getPayload } from 'payload'
import type { MetadataRoute } from 'next'
import config from '@/payload.config'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const url = process.env.NEXT_PUBLIC_SERVER_URL || 'https://alexeerma.ee'

  const staticRoutes: MetadataRoute.Sitemap = [
    { url, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
    { url: `${url}/projects`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${url}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
  ]

  if (!process.env.PAYLOAD_SECRET) return staticRoutes

  const payload = await getPayload({ config: await config })

  const postsResult = await payload.find({
    collection: 'posts',
    limit: 200,
    sort: '-publishedAt',
    where: { _status: { equals: 'published' } },
  }).catch(() => ({ docs: [] }))

  const projectsResult = await payload.find({
    collection: 'projects',
    limit: 200,
    sort: 'sortOrder',
  }).catch(() => ({ docs: [] }))

  const postEntries: MetadataRoute.Sitemap = postsResult.docs
    .filter((post) => post.slug)
    .map((post) => ({
      url: `${url}/blog/${post.slug}`,
      lastModified: new Date(post.updatedAt),
      changeFrequency: 'monthly',
      priority: 0.6,
    }))

  return [...staticRoutes, ...postEntries]
}
