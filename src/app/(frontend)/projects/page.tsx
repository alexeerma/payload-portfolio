import { headers as getHeaders } from 'next/headers.js'
import type { Metadata } from 'next'
import { getPayload, type Payload } from 'payload'

import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { ProjectShowcase } from '@/components/ProjectShowcase'
import config from '@/payload.config'
import type { Project, SiteSetting } from '@/payload-types'

type DisplayProject = Pick<Project, 'title' | 'summary' | 'liveUrl' | 'repoUrl' | 'projectStatus'> & {
  coverImage?: Project['coverImage']
  highlights?: Project['highlights']
  id?: number | string
  stack?: Project['stack']
}

const fallbackProjects: DisplayProject[] = [
  {
    title: 'CMS Portfolio',
    summary: 'A Payload-backed portfolio with editable projects, profile copy, media, and skills.',
    projectStatus: 'in-progress',
    stack: [{ technology: 'Payload' }, { technology: 'Next.js' }, { technology: 'SQLite' }],
    highlights: [
      { item: 'Structured collections for work samples, technical skills, and experience.' },
      { item: 'Server-rendered homepage that can be fully driven from CMS content.' },
    ],
  },
  {
    title: 'Product Dashboard',
    summary: 'A polished case-study placeholder for a data-heavy SaaS interface.',
    projectStatus: 'case-study',
    stack: [{ technology: 'React' }, { technology: 'TypeScript' }, { technology: 'Design Systems' }],
    highlights: [
      { item: 'Focused on scanning, comparison, and fast operational workflows.' },
      { item: 'Ready to replace with a real project from the Payload admin.' },
    ],
  },
]

const defaultSettings: Partial<SiteSetting> = {
  availability: 'Available for selected projects',
  name: 'Aleksander Eerma',
  siteName: 'Aleksander Eerma',
}

async function getSiteSettings(payload: Payload) {
  try {
    return await payload.findGlobal({ slug: 'site-settings', depth: 1 })
  } catch {
    return defaultSettings as SiteSetting
  }
}

export const metadata: Metadata = {
  title: 'Projects',
  description: 'A full look at what I have shipped, studied, and currently building — web apps, CMS-backed sites, and product interfaces.',
  alternates: { canonical: `${process.env.NEXT_PUBLIC_SERVER_URL || 'https://alexeerma.ee'}/projects` },
  openGraph: {
    title: 'Projects — Aleksander Eerma',
    url: `${process.env.NEXT_PUBLIC_SERVER_URL || 'https://alexeerma.ee'}/projects`,
  },
}

export default async function ProjectsPage() {
  const headers = await getHeaders()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const { user } = await payload.auth({ headers })

  const [settingsResult, projectsResult] = await Promise.all([
    getSiteSettings(payload),
    payload.find({
      collection: 'projects',
      depth: 1,
      limit: 100,
      sort: 'sortOrder',
    }),
  ])

  const settings = { ...defaultSettings, ...settingsResult }
  const projects = projectsResult.docs.length ? projectsResult.docs : fallbackProjects

  return (
    <main className="site-shell interior-page" id="main-content">
      <Header
        contact={{ email: settings.email, name: settings.name, availability: settings.availability, siteName: settings.siteName }}
        siteName={settings.siteName}
        logoUrl={typeof settings.logo === 'object' && settings.logo && 'url' in settings.logo ? settings.logo.url : null}
      />

      <section className="page-hero" aria-labelledby="projects-page-title">
        <p className="eyebrow">Work</p>
        <h1 id="projects-page-title">Projects built to be used.</h1>
        <p>
          A full look at what I have shipped, studied, and currently building. Filter by status or
          click any project to explore it.
        </p>
      </section>

      <section className="content-band" aria-label="All projects">
        <ProjectShowcase projects={projects} />
      </section>

      <Footer settings={settings} />
    </main>
  )
}
