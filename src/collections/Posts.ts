import type { CollectionConfig } from 'payload'

const isAuthenticated = ({ req: { user } }: { req: { user?: unknown } }) => Boolean(user)
const publishedOrAuthenticated = ({ req: { user } }: { req: { user?: unknown } }) => {
  if (user) return true

  return {
    _status: {
      equals: 'published',
    },
  }
}

export const Posts: CollectionConfig = {
  slug: 'posts',
  labels: {
    singular: 'Post',
    plural: 'Posts',
  },
  access: {
    create: isAuthenticated,
    delete: isAuthenticated,
    read: publishedOrAuthenticated,
    update: isAuthenticated,
  },
  admin: {
    defaultColumns: ['title', 'publishedAt', 'featured', 'sortOrder'],
    group: 'Content',
    listSearchableFields: ['title', 'excerpt', 'slug'],
    useAsTitle: 'title',
  },
  defaultSort: '-publishedAt',
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        description: 'Use a URL-safe value such as training-and-shipping.',
        position: 'sidebar',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'sortOrder',
      type: 'number',
      defaultValue: 100,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'publishedAt',
      type: 'date',
      required: true,
    },
    {
      name: 'readTime',
      type: 'text',
      defaultValue: '3 min read',
      admin: {
        description: 'Short label shown on the website, for example 4 min read.',
      },
    },
    {
      name: 'excerpt',
      type: 'textarea',
      required: true,
    },
    {
      name: 'body',
      type: 'textarea',
      required: true,
      admin: {
        description: 'Write paragraphs separated by blank lines.',
      },
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'tags',
      type: 'array',
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
      ],
    },
  ],
  versions: {
    drafts: true,
    maxPerDoc: 20,
  },
}
