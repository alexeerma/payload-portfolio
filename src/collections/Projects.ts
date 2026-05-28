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

export const Projects: CollectionConfig = {
  slug: 'projects',
  labels: {
    singular: 'Project',
    plural: 'Projects',
  },
  access: {
    create: isAuthenticated,
    delete: isAuthenticated,
    read: publishedOrAuthenticated,
    update: isAuthenticated,
  },
  admin: {
    defaultColumns: ['title', 'projectStatus', 'featured', 'sortOrder'],
    group: 'Portfolio',
    listSearchableFields: ['title', 'summary', 'slug'],
    useAsTitle: 'title',
  },
  defaultSort: 'sortOrder',
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
        description: 'Use a URL-safe value such as design-system or api-dashboard.',
        position: 'sidebar',
      },
    },
    {
      name: 'projectStatus',
      type: 'select',
      defaultValue: 'launched',
      options: [
        { label: 'Launched', value: 'launched' },
        { label: 'In progress', value: 'in-progress' },
        { label: 'Case study', value: 'case-study' },
      ],
      required: true,
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
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
      name: 'summary',
      type: 'textarea',
      required: true,
    },
    {
      name: 'description',
      type: 'richText',
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'stack',
      type: 'array',
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          name: 'technology',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'highlights',
      type: 'array',
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          name: 'item',
          type: 'textarea',
          required: true,
        },
      ],
    },
    {
      name: 'liveUrl',
      type: 'text',
      admin: {
        description: 'Public URL for the shipped project.',
      },
    },
    {
      name: 'repoUrl',
      type: 'text',
      admin: {
        description: 'Repository URL, if the code is public.',
      },
    },
    {
      name: 'completedAt',
      type: 'date',
    },
  ],
  versions: {
    drafts: true,
    maxPerDoc: 20,
  },
}
