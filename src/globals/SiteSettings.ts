import type { GlobalConfig } from 'payload'

const isAuthenticated = ({ req: { user } }: { req: { user?: unknown } }) => Boolean(user)

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
  access: {
    read: () => true,
    update: isAuthenticated,
  },
  admin: {
    group: 'Portfolio',
  },
  fields: [
    {
      name: 'siteName',
      type: 'text',
      defaultValue: 'Developer Portfolio',
      required: true,
    },
    {
      name: 'name',
      type: 'text',
      defaultValue: 'Your Name',
      required: true,
    },
    {
      name: 'title',
      type: 'text',
      defaultValue: 'Full-stack developer',
      required: true,
    },
    {
      name: 'headline',
      type: 'textarea',
      defaultValue: 'I build fast, useful products with clean interfaces and reliable systems.',
      required: true,
    },
    {
      name: 'intro',
      type: 'textarea',
      defaultValue:
        'A portfolio starter wired to Payload CMS for projects, skills, experience, media, and site copy.',
      required: true,
    },
    {
      name: 'availability',
      type: 'text',
      defaultValue: 'Available for selected projects',
    },
    {
      name: 'location',
      type: 'text',
      defaultValue: 'Remote',
    },
    {
      name: 'email',
      type: 'email',
    },
    {
      name: 'resumeUrl',
      type: 'text',
    },
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'socialLinks',
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
        {
          name: 'url',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'featuredProjects',
      type: 'relationship',
      hasMany: true,
      relationTo: 'projects',
    },
  ],
}
