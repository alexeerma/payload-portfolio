import type { CollectionConfig } from 'payload'

const isAuthenticated = ({ req: { user } }: { req: { user?: unknown } }) => Boolean(user)

export const Skills: CollectionConfig = {
  slug: 'skills',
  labels: {
    singular: 'Skill',
    plural: 'Skills',
  },
  access: {
    create: isAuthenticated,
    delete: isAuthenticated,
    read: () => true,
    update: isAuthenticated,
  },
  admin: {
    defaultColumns: ['name', 'category', 'featured', 'sortOrder'],
    group: 'Portfolio',
    useAsTitle: 'name',
  },
  defaultSort: 'sortOrder',
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'category',
      type: 'select',
      defaultValue: 'frontend',
      options: [
        { label: 'Frontend', value: 'frontend' },
        { label: 'Backend', value: 'backend' },
        { label: 'CMS', value: 'cms' },
        { label: 'DevOps', value: 'devops' },
        { label: 'Design', value: 'design' },
      ],
      required: true,
    },
    {
      name: 'proficiency',
      type: 'number',
      defaultValue: 80,
      max: 100,
      min: 0,
      admin: {
        hidden: true,
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'sortOrder',
      type: 'number',
      defaultValue: 100,
    },
  ],
}
