import 'dotenv/config'

import { getPayload } from 'payload'

import config from '../src/payload.config'

const projectSlugs = ['atlas-dashboard', 'studio-portfolio', 'api-observatory']
const postSlugs = [
  'training-habits-that-help-me-build-better',
  'keeping-a-portfolio-simple',
  'the-overlap-between-teams-and-products',
]
const skillNames = [
  'Next.js',
  'Payload CMS',
  'TypeScript',
  'React',
  'Node.js',
  'PostgreSQL',
  'Product Design',
  'Deployment',
]

async function removeExistingSeedData(payload: Awaited<ReturnType<typeof getPayload>>) {
  for (const slug of projectSlugs) {
    await payload.delete({
      collection: 'projects',
      where: {
        slug: {
          equals: slug,
        },
      },
    })
  }

  for (const slug of postSlugs) {
    await payload.delete({
      collection: 'posts',
      where: {
        slug: {
          equals: slug,
        },
      },
    })
  }

  for (const name of skillNames) {
    await payload.delete({
      collection: 'skills',
      where: {
        name: {
          equals: name,
        },
      },
    })
  }

  await payload.delete({
    collection: 'experience',
    where: {
      company: {
        in: ['Independent', 'Professional Volleyball', 'Northstar Studio', 'Orbit Labs'],
      },
    },
  })
}

async function seed() {
  const payload = await getPayload({ config })

  await removeExistingSeedData(payload)

  const projects = await Promise.all([
    payload.create({
      collection: 'projects',
      data: {
        title: 'Atlas Dashboard',
        slug: 'atlas-dashboard',
        projectStatus: 'launched',
        featured: true,
        sortOrder: 10,
        summary:
          'A focused SaaS dashboard concept for monitoring product health, revenue signals, and team workflows.',
        stack: [
          { technology: 'Next.js' },
          { technology: 'TypeScript' },
          { technology: 'Payload CMS' },
        ],
        highlights: [
          { item: 'Designed compact reporting views for repeat operational use.' },
          { item: 'Modeled dashboard content so non-developers can update copy and screenshots.' },
        ],
        liveUrl: 'https://example.com',
        repoUrl: 'https://github.com/example/atlas-dashboard',
        completedAt: '2026-02-01T00:00:00.000Z',
        _status: 'published',
      },
    }),
    payload.create({
      collection: 'projects',
      data: {
        title: 'Studio Portfolio',
        slug: 'studio-portfolio',
        projectStatus: 'case-study',
        featured: true,
        sortOrder: 20,
        summary:
          'A clean editorial portfolio system for publishing selected work, writing, and services.',
        stack: [{ technology: 'React' }, { technology: 'Design Systems' }, { technology: 'CMS' }],
        highlights: [
          { item: 'Created reusable page sections for case studies and landing pages.' },
          { item: 'Balanced expressive visuals with simple content editing workflows.' },
        ],
        liveUrl: 'https://example.com',
        _status: 'published',
      },
    }),
    payload.create({
      collection: 'projects',
      data: {
        title: 'API Observatory',
        slug: 'api-observatory',
        projectStatus: 'in-progress',
        featured: true,
        sortOrder: 30,
        summary:
          'A developer tool concept for tracking API uptime, latency, schemas, and release notes.',
        stack: [{ technology: 'Node.js' }, { technology: 'PostgreSQL' }, { technology: 'Charts' }],
        highlights: [
          { item: 'Modeled health checks, endpoint ownership, and release annotations.' },
          { item: 'Prepared the product for future alerting and integration workflows.' },
        ],
        repoUrl: 'https://github.com/example/api-observatory',
        _status: 'published',
      },
    }),
  ])

  await Promise.all([
    payload.create({
      collection: 'skills',
      data: { name: 'Next.js', category: 'frontend', featured: true, sortOrder: 10 },
    }),
    payload.create({
      collection: 'skills',
      data: { name: 'Payload CMS', category: 'cms', featured: true, sortOrder: 20 },
    }),
    payload.create({
      collection: 'skills',
      data: { name: 'TypeScript', category: 'frontend', featured: true, sortOrder: 30 },
    }),
    payload.create({
      collection: 'skills',
      data: { name: 'React', category: 'frontend', featured: true, sortOrder: 40 },
    }),
    payload.create({
      collection: 'skills',
      data: { name: 'Node.js', category: 'backend', featured: true, sortOrder: 50 },
    }),
    payload.create({
      collection: 'skills',
      data: { name: 'PostgreSQL', category: 'backend', featured: true, sortOrder: 60 },
    }),
    payload.create({
      collection: 'skills',
      data: { name: 'Product Design', category: 'design', featured: true, sortOrder: 70 },
    }),
    payload.create({
      collection: 'skills',
      data: { name: 'Deployment', category: 'devops', featured: true, sortOrder: 80 },
    }),
  ])

  await Promise.all([
    payload.create({
      collection: 'posts',
      data: {
        title: 'Training Habits That Help Me Build Better',
        slug: 'training-habits-that-help-me-build-better',
        featured: true,
        sortOrder: 10,
        publishedAt: '2026-05-01T00:00:00.000Z',
        readTime: '3 min read',
        excerpt:
          'How structure, repetition, and honest feedback from volleyball carry into product work.',
        body: [
          'Professional sport teaches you to respect small habits. You do not get better from one dramatic session. You get better by showing up, paying attention, and repeating the right things with enough honesty to adjust.',
          'That maps surprisingly well to building software. A clean interface, a stable CMS model, or a useful product workflow usually comes from the same rhythm: make a version, test it, notice what feels off, and improve it.',
          'The best work I do happens when I treat development less like a sprint for cleverness and more like training. Clear goals, focused reps, sharp feedback, and a calm standard for quality.',
        ].join('\n\n'),
        tags: [{ label: 'Process' }, { label: 'Sport' }],
        _status: 'published',
      },
    }),
    payload.create({
      collection: 'posts',
      data: {
        title: 'Keeping a Portfolio Simple',
        slug: 'keeping-a-portfolio-simple',
        featured: true,
        sortOrder: 20,
        publishedAt: '2026-04-18T00:00:00.000Z',
        readTime: '4 min read',
        excerpt:
          'A few notes on clean sections, editable content, and avoiding unnecessary visual noise.',
        body: [
          'A portfolio does not need to prove everything at once. It needs to make the right things easy to understand: who you are, what you build, what you care about, and how someone can contact you.',
          'That is why I like using a CMS for portfolio content. The structure stays stable, but the details can evolve. Projects, notes, stack, and experience can change without rebuilding the whole site every time.',
          'Visually, the same rule applies. A light system, strong spacing, and a few polished interactions can feel much better than a page that tries to be impressive in every section.',
        ].join('\n\n'),
        tags: [{ label: 'Design' }, { label: 'CMS' }],
        _status: 'published',
      },
    }),
    payload.create({
      collection: 'posts',
      data: {
        title: 'The Overlap Between Teams and Products',
        slug: 'the-overlap-between-teams-and-products',
        featured: true,
        sortOrder: 30,
        publishedAt: '2026-03-28T00:00:00.000Z',
        readTime: '3 min read',
        excerpt:
          'What product work can borrow from high-trust teams: clarity, roles, and shared rhythm.',
        body: [
          'Good teams are not just talented people standing near each other. They need trust, timing, clear roles, and the ability to recover quickly when something goes wrong.',
          'Product work has the same shape. Design, development, content, and feedback all need to move together. When the rhythm is clear, the final experience feels calmer for the user.',
          'That is the kind of work I enjoy: simple systems, sharp communication, and interfaces that feel composed because the process behind them was composed too.',
        ].join('\n\n'),
        tags: [{ label: 'Teamwork' }, { label: 'Product' }],
        _status: 'published',
      },
    }),
  ])

  await Promise.all([
    payload.create({
      collection: 'experience',
      data: {
        role: 'Professional Volleyball Player',
        company: 'Professional Volleyball',
        location: 'Europe',
        current: true,
        startDate: '2020-01-01T00:00:00.000Z',
        summary:
          'Competing professionally while bringing training discipline, teamwork, and performance habits into product work.',
        highlights: [
          { item: 'Built habits around preparation, feedback, and performing under pressure.' },
          { item: 'Worked in high-trust teams where communication and consistency matter every day.' },
        ],
        technologies: [{ technology: 'Teamwork' }, { technology: 'Performance' }],
        sortOrder: 5,
      },
    }),
    payload.create({
      collection: 'experience',
      data: {
        role: 'Full-stack Developer',
        company: 'Independent',
        companyUrl: 'https://example.com',
        location: 'Remote',
        current: true,
        startDate: '2024-01-01T00:00:00.000Z',
        summary:
          'Building CMS-backed marketing sites, internal dashboards, and practical product prototypes.',
        highlights: [
          { item: 'Turned loose product ideas into working Next.js and Payload implementations.' },
          { item: 'Improved content workflows for teams that update websites every week.' },
        ],
        technologies: [
          { technology: 'Next.js' },
          { technology: 'Payload CMS' },
          { technology: 'TypeScript' },
        ],
        sortOrder: 10,
      },
    }),
    payload.create({
      collection: 'experience',
      data: {
        role: 'Frontend Engineer',
        company: 'Orbit Labs',
        companyUrl: 'https://example.com',
        location: 'Tallinn',
        current: false,
        startDate: '2022-04-01T00:00:00.000Z',
        endDate: '2023-12-01T00:00:00.000Z',
        summary:
          'Worked on responsive interfaces, component libraries, and product analytics surfaces.',
        highlights: [
          { item: 'Built accessible UI patterns for dense dashboard screens.' },
          { item: 'Collaborated with design and backend teams on reusable product foundations.' },
        ],
        technologies: [{ technology: 'React' }, { technology: 'Design Systems' }],
        sortOrder: 20,
      },
    }),
  ])

  await payload.updateGlobal({
    slug: 'site-settings',
    data: {
      siteName: 'Aleksander Eerma',
      name: 'Aleksander Eerma',
      title: 'Developer and pro volleyball player',
      headline:
        'I build clean digital products and bring the same discipline, focus, and energy from professional volleyball into my work.',
      intro:
        'Developer and professional volleyball player. I like simple interfaces, useful systems, and work that feels sharp both on screen and in real life.',
      availability: 'Available for freelance projects',
      location: 'Tallinn · Remote',
      email: 'hello@example.com',
      resumeUrl: 'https://example.com/resume.pdf',
      socialLinks: [
        { label: 'GitHub', url: 'https://github.com/example' },
        { label: 'LinkedIn', url: 'https://linkedin.com/in/example' },
      ],
      featuredProjects: projects.map((project) => project.id),
    },
  })

  payload.logger.info('Seed data created.')
  process.exit(0)
}

seed().catch((error) => {
  console.error(error)
  process.exit(1)
})
