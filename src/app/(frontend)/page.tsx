import { headers as getHeaders } from 'next/headers.js'
import Image from 'next/image'
import Link from 'next/link'
import { getPayload, type Payload } from 'payload'
import React from 'react'

import { BlogPreview } from '@/components/BlogPreview'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { ProjectShowcase } from '@/components/ProjectShowcase'
import { SkillMatrix } from '@/components/SkillMatrix'
import config from '@/payload.config'
import type { Experience, Media, Post, Project, SiteSetting, Skill } from '@/payload-types'
import './styles.css'

type DisplayProject = Pick<Project, 'title' | 'summary' | 'liveUrl' | 'repoUrl' | 'projectStatus'> & {
  coverImage?: Project['coverImage']
  highlights?: Project['highlights']
  id?: number | string
  stack?: Project['stack']
}

type DisplaySkill = Pick<Skill, 'name' | 'category'> & {
  id?: number | string
}

type DisplayExperience = Pick<
  Experience,
  'role' | 'company' | 'location' | 'current' | 'startDate' | 'endDate' | 'summary' | 'highlights'
> & {
  id?: number | string
}

type DisplayPost = Pick<Post, 'title' | 'slug' | 'excerpt' | 'publishedAt' | 'readTime' | 'tags'> & {
  id?: number | string
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

const fallbackSkills: DisplaySkill[] = [
  { name: 'Next.js', category: 'frontend' },
  { name: 'Payload CMS', category: 'cms' },
  { name: 'TypeScript', category: 'frontend' },
  { name: 'API Design', category: 'backend' },
  { name: 'PostgreSQL', category: 'backend' },
  { name: 'Deployment', category: 'devops' },
]

const fallbackExperience: DisplayExperience[] = [
  {
    role: 'Professional Volleyball Player',
    company: 'Club and National Competition',
    location: 'Europe',
    current: true,
    startDate: '2020-01-01T00:00:00.000Z',
    summary:
      'Competing professionally while bringing the habits of training, teamwork, and performance into product work.',
    highlights: [
      { item: 'Built discipline around feedback loops, preparation, and performing under pressure.' },
      { item: 'Learned to communicate clearly in high-trust team environments.' },
    ],
  },
  {
    role: 'Full-stack Developer',
    company: 'Independent',
    location: 'Remote',
    current: true,
    startDate: '2024-01-01T00:00:00.000Z',
    summary: 'Building product websites, CMS-backed experiences, and practical internal tools.',
    highlights: [
      { item: 'Shape product requirements into clean content models and maintainable interfaces.' },
      { item: 'Deliver fast Next.js builds with a CMS workflow that non-developers can use.' },
    ],
  },
]

const fallbackPosts: DisplayPost[] = [
  {
    title: 'Training Habits That Help Me Build Better',
    slug: 'training-habits-that-help-me-build-better',
    excerpt:
      'How structure, repetition, and honest feedback from volleyball carry into product work.',
    publishedAt: '2026-05-01T00:00:00.000Z',
    readTime: '3 min read',
    tags: [{ label: 'Process' }, { label: 'Sport' }],
  },
  {
    title: 'Keeping a Portfolio Simple',
    slug: 'keeping-a-portfolio-simple',
    excerpt:
      'A few notes on clean sections, editable content, and avoiding unnecessary visual noise.',
    publishedAt: '2026-04-18T00:00:00.000Z',
    readTime: '4 min read',
    tags: [{ label: 'Design' }, { label: 'CMS' }],
  },
]

const defaultSettings: Partial<SiteSetting> = {
  availability: 'Available for selected projects',
  headline:
    'I build clean digital products and bring the same discipline, focus, and energy from professional volleyball into my work.',
  intro:
    'Developer and professional volleyball player. I like simple interfaces, useful systems, and work that feels sharp both on screen and in real life.',
  location: 'Remote',
  name: 'Your Name',
  siteName: 'Developer Portfolio',
  title: 'Developer and pro volleyball player',
}

function getMediaUrl(media: Media | number | string | null | undefined) {
  if (media && typeof media === 'object' && 'url' in media) {
    return media.url
  }

  return null
}

function formatDateRange(experience: DisplayExperience) {
  const start = new Date(experience.startDate).getFullYear()
  const end = experience.current
    ? 'Present'
    : experience.endDate
      ? new Date(experience.endDate).getFullYear()
      : 'Present'

  return `${start} - ${end}`
}

async function getSiteSettings(payload: Payload) {
  try {
    return await payload.findGlobal({
      slug: 'site-settings',
      depth: 1,
    })
  } catch {
    return defaultSettings as SiteSetting
  }
}

export default async function HomePage() {
  const headers = await getHeaders()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const { user } = await payload.auth({ headers })

  const [settingsResult, projectsResult, skillsResult, experienceResult, postsResult] =
    await Promise.all([
    getSiteSettings(payload),
    payload.find({
      collection: 'projects',
      depth: 1,
      limit: 6,
      sort: 'sortOrder',
      where: {
        or: [{ featured: { equals: true } }, { featured: { exists: false } }],
      },
    }),
    payload.find({
      collection: 'skills',
      limit: 12,
      sort: 'sortOrder',
      where: {
        featured: { equals: true },
      },
    }),
    payload.find({
      collection: 'experience',
      limit: 5,
      sort: 'sortOrder',
    }),
    payload.find({
      collection: 'posts',
      depth: 1,
      limit: 3,
      sort: '-publishedAt',
      where: {
        featured: {
          equals: true,
        },
      },
    }),
  ])

  const settings = { ...defaultSettings, ...settingsResult }
  const projects = projectsResult.docs.length ? projectsResult.docs : fallbackProjects
  const skills = skillsResult.docs.length ? skillsResult.docs : fallbackSkills
  const experience = experienceResult.docs.length ? experienceResult.docs : fallbackExperience
  const posts = postsResult.docs.length ? postsResult.docs : fallbackPosts
  const heroImage = getMediaUrl(settings.heroImage) || '/portfolio-hero.png'
  const heroStats = [
    { label: 'Projects', value: projects.length.toString().padStart(2, '0') },
    { label: 'Stack', value: skills.length.toString().padStart(2, '0') },
    { label: 'Athlete', value: 'Pro' },
  ]
  const terminalLines = settings.terminalLines?.length
    ? settings.terminalLines.map((l) => l.text)
    : ['$ pnpm dev', 'clean interfaces', 'train, ship, repeat']
  const dashboardSignals = settings.dashboardSignals?.length
    ? settings.dashboardSignals.map((s) => ({ label: s.label, value: s.value }))
    : [{ label: 'CMS', value: 'Payload' }, { label: 'Build', value: 'Next.js' }, { label: 'Status', value: 'Live' }]
  const tickerItems = settings.tickerItems?.length
    ? settings.tickerItems.map((t) => t.text)
    : ['Developer', 'Professional volleyball', 'Clean interfaces', 'CMS workflows', 'Product thinking']

  return (
    <main className="site-shell">
      <Header
        contact={{
          availability: settings.availability,
          email: settings.email,
          location: settings.location,
          name: settings.name,
          resumeUrl: settings.resumeUrl,
          siteName: settings.siteName,
          socialLinks: settings.socialLinks,
        }}
        siteName={settings.siteName}
      />

      <section className="hero" aria-labelledby="intro-title">
        <Image
          alt=""
          className="hero-image"
          fill
          loading="eager"
          sizes="100vw"
          src={heroImage}
        />
        <div className="hero-scrim" />
        <div className="hero-grid" aria-hidden="true" />
        <div className="signal-stack" aria-hidden="true">
          {dashboardSignals.map((card) => (
            <div className="signal-card" key={card.label}>
              <span>{card.label}</span>
              <strong>{card.value}</strong>
            </div>
          ))}
        </div>
        <div className="hero-content">
          <p className="eyebrow">{settings.availability}</p>
          <h1 id="intro-title">{settings.name}</h1>
          <p className="role">{settings.title}</p>
          <p className="headline">{settings.headline}</p>
          <div className="hero-meta">
            {settings.location && <span>{settings.location}</span>}
            {settings.resumeUrl && <a href={settings.resumeUrl}>Resume</a>}
            {settings.socialLinks?.map((link) => (
              <a href={link.url} key={link.id ?? link.url} rel="noreferrer" target="_blank">
                {link.label}
              </a>
            ))}
          </div>
        </div>
        <aside className="hero-dashboard" aria-hidden="true">
          <div className="dashboard-topline">
            <span>portfolio://developer-athlete</span>
            <strong>Available</strong>
          </div>
          <div className="terminal-window">
            <span className="terminal-dot" />
            <span className="terminal-dot" />
            <span className="terminal-dot" />
            {terminalLines.map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>
          <div className="stat-grid">
            {heroStats.map((stat) => (
              <div key={stat.label}>
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>
          <div className="signal-meter">
            <span />
            <span />
            <span />
          </div>
        </aside>
        <div className="ticker" aria-hidden="true">
          {[0, 1].map((copy) => (
            <div className="ticker-track" key={copy} aria-hidden={copy === 1 ? 'true' : undefined}>
              {tickerItems.map((item, i) => (
                <React.Fragment key={i}>
                  <span>{item}</span>
                  <span>·</span>
                </React.Fragment>
              ))}
            </div>
          ))}
        </div>
      </section>

      <section className="intro-section" aria-label="Profile">
        <p>{settings.intro}</p>
      </section>

      <section className="content-band" id="projects" aria-labelledby="projects-title">
        <div className="section-heading with-action">
          <div>
            <p className="eyebrow">Selected Work</p>
            <h2 id="projects-title">Projects built to be used.</h2>
          </div>
          <Link href="/projects">All projects</Link>
        </div>
        <ProjectShowcase projects={projects} />
      </section>

      <section className="content-band" id="skills" aria-labelledby="skills-title">
        <div className="section-heading" style={{ textAlign: 'center' }}>
          <p className="eyebrow">Stack</p>
          <h2 id="skills-title" style={{ margin: '0 auto' }}>Tools I build with.</h2>
        </div>
        <SkillMatrix skills={skills} />
      </section>

<section className="content-band" aria-labelledby="experience-title">
        <div className="section-heading">
          <p className="eyebrow">Experience</p>
          <h2 id="experience-title">Work across code and sport.</h2>
        </div>
        <div className="timeline">
          {experience.map((item) => (
            <article className="timeline-item" key={item.id ?? `${item.company}-${item.role}`}>
              <div>
                <p className="date-range">{formatDateRange(item)}</p>
                <h3>{item.role}</h3>
                <p className="company">
                  {item.company}
                  {item.location ? `, ${item.location}` : ''}
                </p>
              </div>
              <div>
                <p>{item.summary}</p>
                {!!item.highlights?.length && (
                  <ul className="highlight-list">
                    {item.highlights.slice(0, 3).map((highlight) => (
                      <li key={highlight.id ?? highlight.item}>{highlight.item}</li>
                    ))}
                  </ul>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      <Footer settings={settings} />
    </main>
  )
}
