import type { CollectionConfig } from 'payload'

const isAuthenticated = ({ req: { user } }: { req: { user?: unknown } }) => Boolean(user)

export const Experience: CollectionConfig = {
  slug: 'experience',
  labels: {
    singular: 'Experience',
    plural: 'Experience',
  },
  access: {
    create: isAuthenticated,
    delete: isAuthenticated,
    read: () => true,
    update: isAuthenticated,
  },
  admin: {
    defaultColumns: ['role', 'company', 'current', 'sortOrder'],
    group: 'Portfolio',
    useAsTitle: 'role',
  },
  defaultSort: 'sortOrder',
  fields: [
    {
      name: 'role',
      type: 'text',
      required: true,
    },
    {
      name: 'company',
      type: 'text',
      required: true,
    },
    {
      name: 'companyUrl',
      type: 'text',
    },
    {
      name: 'location',
      type: 'text',
    },
    {
      name: 'current',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'startDate',
      type: 'date',
      required: true,
    },
    {
      name: 'endDate',
      type: 'date',
      admin: {
        condition: (_, siblingData) => !siblingData.current,
      },
    },
    {
      name: 'summary',
      type: 'textarea',
      required: true,
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
      name: 'technologies',
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
      name: 'sortOrder',
      type: 'number',
      defaultValue: 100,
    },
  ],
}
