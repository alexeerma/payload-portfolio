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
      name: 'resume',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Upload your resume as a PDF. Overrides the Resume URL below.',
      },
    },
    {
      name: 'resumeUrl',
      type: 'text',
      admin: {
        description: 'Fallback resume URL if no file is uploaded above.',
      },
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Logo shown in the site header. Replaces the default icon.',
      },
    },
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'heroFloatingImages',
      type: 'array',
      label: 'Hero Floating Images',
      admin: {
        description:
          'Images that float and orbit clockwise in the hero background. Falls back to project covers if empty.',
        initCollapsed: true,
      },
      maxRows: 7,
      fields: [{ name: 'image', type: 'upload', relationTo: 'media', required: true }],
    },
    {
      name: 'heroFloatSpeed',
      type: 'number',
      label: 'Hero Float Orbit Speed (seconds)',
      defaultValue: 16,
      min: 4,
      max: 60,
      admin: {
        description: 'Seconds for one full clockwise orbit of the floating images. Lower = faster.',
      },
    },
    {
      name: 'heroSecondStatement',
      type: 'group',
      label: 'Hero Second Statement',
      admin: {
        description: 'The second headline that fades in as you scroll the hero, plus its category tags.',
      },
      fields: [
        {
          name: 'headline',
          type: 'textarea',
          defaultValue: 'I build web interfaces, CMS-driven sites and internal tools teams actually use.',
        },
        {
          name: 'categories',
          type: 'array',
          admin: { initCollapsed: true, description: 'Small tags shown above the second headline.' },
          fields: [{ name: 'text', type: 'text', required: true }],
        },
      ],
    },
    {
      name: 'heroStats',
      type: 'array',
      label: 'Hero Stat Tiles',
      admin: {
        description:
          'The stat tiles in the hero HUD bar. Leave empty to auto-use project and skill counts.',
        initCollapsed: true,
      },
      maxRows: 4,
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'value', type: 'text', required: true },
      ],
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
      name: 'seo',
      type: 'group',
      label: 'SEO',
      admin: {
        description: 'Controls what search engines and social media show for your homepage.',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Meta Title',
          admin: {
            description: 'Shown in browser tabs and Google. Ideal length: 50–60 characters.',
            placeholder: 'Aleksander Eerma — Developer & Volleyball Player',
          },
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Meta Description',
          admin: {
            description: 'Shown in Google search results. Ideal length: 120–160 characters.',
          },
        },
        {
          name: 'ogImage',
          type: 'upload',
          label: 'Social Share Image',
          relationTo: 'media',
          admin: {
            description: 'Image shown when your site is shared on social media. Recommended: 1200×630px.',
          },
        },
      ],
    },
    {
      name: 'featuredProjects',
      type: 'relationship',
      hasMany: true,
      relationTo: 'projects',
    },
    {
      name: 'terminalLines',
      type: 'array',
      label: 'Dashboard Terminal Lines',
      admin: {
        description: 'Lines shown in the terminal widget on the hero. First line is styled as a command.',
        initCollapsed: true,
      },
      fields: [{ name: 'text', type: 'text', required: true }],
    },
    {
      name: 'dashboardSignals',
      type: 'array',
      label: 'Dashboard Signal Cards',
      admin: {
        description: 'The small stat cards in the hero dashboard widget.',
        initCollapsed: true,
      },
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'value', type: 'text', required: true },
      ],
      maxRows: 3,
    },
    {
      name: 'tickerItems',
      type: 'array',
      label: 'Ticker Items',
      admin: {
        description: 'Words that scroll across the bottom of the hero section.',
        initCollapsed: true,
      },
      fields: [{ name: 'text', type: 'text', required: true }],
    },
  ],
}
