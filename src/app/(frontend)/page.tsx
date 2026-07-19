import { headers as getHeaders } from 'next/headers.js'
import type { Metadata } from 'next'
import { getPayload, type Payload } from 'payload'

import { AnimateIn } from '@/components/AnimateIn'
import { AnimatedTimeline } from '@/components/AnimatedTimeline'
import { CursorGlow } from '@/components/CursorGlow'
import { Footer } from '@/components/Footer'
import { HeroStage } from '@/components/HeroStage'
import { Reveal3D } from '@/components/Reveal3D'
import { PersonJsonLd } from '@/components/JsonLd'
import { MagneticLink } from '@/components/Magnetic'
import { ProjectStack } from '@/components/ProjectStack'
import { ScrollProgress } from '@/components/ScrollProgress'
import { SkillMatrix } from '@/components/SkillMatrix'
import config from '@/payload.config'
import type { Experience, Media, Project, SiteSetting, Skill } from '@/payload-types'
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
  'role' | 'company' | 'location' | 'current' | 'startDate' | 'endDate' | 'highlights'
> & {
  id?: number | string
  // richText (Lexical) once saved in the admin, plain string for the hardcoded fallbacks
  summary?: Experience['summary'] | string
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

export async function generateMetadata(): Promise<Metadata> {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const settings = await getSiteSettings(payload)
  const url = process.env.NEXT_PUBLIC_SERVER_URL || 'https://alexeerma.ee'

  const title = settings.seo?.title
    || (settings.name && settings.title ? `${settings.name} — ${settings.title}` : 'Developer Portfolio')
  const description = settings.seo?.description || settings.headline || settings.intro || ''
  const ogImage = getMediaUrl(settings.seo?.ogImage) || getMediaUrl(settings.heroImage)

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      images: ogImage ? [{ url: ogImage }] : [],
    },
  }
}

export default async function HomePage() {
  const headers = await getHeaders()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  await payload.auth({ headers })

  const [settingsResult, projectsResult, skillsResult, experienceResult] =
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
  ])

  const settings = { ...defaultSettings, ...settingsResult }
  const projects = projectsResult.docs.length ? projectsResult.docs : fallbackProjects
  const skills = skillsResult.docs.length ? skillsResult.docs : fallbackSkills
  const experience = experienceResult.docs.length ? experienceResult.docs : fallbackExperience
  const heroImage = getMediaUrl(settings.heroImage) || '/portfolio-hero.png'
  const logoUrl = getMediaUrl(settings.logo)
  const resumeUrl = getMediaUrl(settings.resume) || settings.resumeUrl
  const heroStats = settings.heroStats?.length
    ? settings.heroStats.map((s) => ({ label: s.label, value: s.value }))
    : [
        { label: 'Projects', value: projects.length.toString().padStart(2, '0') },
        { label: 'Stack', value: skills.length.toString().padStart(2, '0') },
        { label: 'Athlete', value: 'Pro' },
      ]
  const heroCategories = settings.heroSecondStatement?.categories?.map((c) => c.text).filter(Boolean) as
    | string[]
    | undefined

  return (
    <main className="site-shell" id="main-content">
      <CursorGlow />
      <ScrollProgress />

      <PersonJsonLd
        name={settings.name || 'Aleksander Eerma'}
        jobTitle={settings.title}
        url={process.env.NEXT_PUBLIC_SERVER_URL || 'https://alexeerma.ee'}
        email={settings.email}
        location={settings.location}
        socialLinks={settings.socialLinks}
      />

      <HeroStage
        name={settings.name}
        title={settings.title}
        headline={settings.headline}
        intro={settings.intro}
        availability={settings.availability}
        email={settings.email}
        resumeUrl={resumeUrl}
        logoUrl={logoUrl}
        avatarUrl={heroImage}
        socialLinks={settings.socialLinks}
        stats={heroStats}
        floatImages={
          settings.heroFloatingImages?.length
            ? (settings.heroFloatingImages
                .map((f) => getMediaUrl(f.image))
                .filter(Boolean) as string[])
            : projects.map((p) => getMediaUrl(p.coverImage) || heroImage)
        }
        floatSpeed={settings.heroFloatSpeed ?? 16}
        secondHeadline={settings.heroSecondStatement?.headline}
        categories={heroCategories}
      />

      <AnimateIn>
        <section className="intro-section" aria-label="Profile">
          <p>{settings.intro}</p>
        </section>
      </AnimateIn>

      <section className="content-band" id="projects" aria-labelledby="projects-title">
        <AnimateIn>
          <div className="section-heading with-action">
            <div>
              <p className="eyebrow">Selected Work</p>
              <h2 id="projects-title">Projects built to be used.</h2>
            </div>
            <MagneticLink href="/projects"><span>All projects</span></MagneticLink>
          </div>
        </AnimateIn>
        <ProjectStack projects={projects} />
      </section>

      <section className="content-band" id="skills" aria-labelledby="skills-title">
        <AnimateIn>
          <div className="section-heading" style={{ textAlign: 'center' }}>
            <p className="eyebrow">Stack</p>
            <h2 id="skills-title" style={{ margin: '0 auto' }}>Tools I build with.</h2>
          </div>
        </AnimateIn>
        <SkillMatrix skills={skills} />
      </section>

      <section className="content-band" aria-labelledby="experience-title">
        <AnimateIn>
          <div className="section-heading">
            <p className="eyebrow">Experience</p>
            <h2 id="experience-title">Work across code and sport.</h2>
          </div>
        </AnimateIn>
        <Reveal3D axis="y" depth={160}>
          <AnimatedTimeline items={experience} />
        </Reveal3D>
      </section>

      <Footer settings={settings} />
    </main>
  )
}
