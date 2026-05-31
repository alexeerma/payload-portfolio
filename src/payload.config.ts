import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Experience } from './collections/Experience'
import { Posts } from './collections/Posts'
import { Projects } from './collections/Projects'
import { Skills } from './collections/Skills'
import { SiteSettings } from './globals/SiteSettings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Projects, Skills, Experience, Posts],
  editor: lexicalEditor(),
  globals: [SiteSettings],
  secret: process.env.PAYLOAD_SECRET || '',
  email: nodemailerAdapter({
    defaultFromAddress: process.env.SMTP_FROM || 'info@alexeerma.ee',
    defaultFromName: process.env.SMTP_FROM_NAME || 'Aleksander Eerma',
    transportOptions: {
      host: process.env.SMTP_HOST || 'smtp.zone.ee',
      port: Number(process.env.SMTP_PORT) || 587,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    },
  }),
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URL || '',
    },
    push: process.env.NODE_ENV !== 'production',
    migrationDir: path.resolve(process.cwd(), 'migrations'),
  }),
  sharp,
  plugins: [],
})
