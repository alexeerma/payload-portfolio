'use client'

import Image from 'next/image'
import { useMemo, useState } from 'react'

import type { Media, Project } from '@/payload-types'

type DisplayProject = Pick<Project, 'title' | 'summary' | 'liveUrl' | 'repoUrl' | 'projectStatus'> & {
  coverImage?: Project['coverImage']
  highlights?: Project['highlights']
  id?: number | string
  stack?: Project['stack']
}

type ProjectFilter = 'all' | NonNullable<DisplayProject['projectStatus']>

type ProjectShowcaseProps = {
  projects: DisplayProject[]
}

const filters: { label: string; value: ProjectFilter }[] = [
  { label: 'All', value: 'all' },
  { label: 'Launched', value: 'launched' },
  { label: 'Case studies', value: 'case-study' },
  { label: 'In progress', value: 'in-progress' },
]

function getMediaUrl(media: Media | number | string | null | undefined) {
  if (media && typeof media === 'object' && 'url' in media) {
    return media.url
  }

  return null
}

function getProjectImage(project: DisplayProject) {
  return getMediaUrl(project.coverImage) || '/portfolio-hero.png'
}

export function ProjectShowcase({ projects }: ProjectShowcaseProps) {
  const [activeFilter, setActiveFilter] = useState<ProjectFilter>('all')
  const [activeProjectId, setActiveProjectId] = useState<number | string | undefined>(
    projects[0]?.id ?? projects[0]?.title,
  )

  const filteredProjects = useMemo(() => {
    if (activeFilter === 'all') return projects

    return projects.filter((project) => project.projectStatus === activeFilter)
  }, [activeFilter, projects])

  const activeProject =
    filteredProjects.find((project) => (project.id ?? project.title) === activeProjectId) ??
    filteredProjects[0]
  const activeIndex = activeProject
    ? filteredProjects.findIndex(
        (project) => (project.id ?? project.title) === (activeProject.id ?? activeProject.title),
      )
    : -1

  return (
    <div className="project-showcase">
      <div className="showcase-toolbar">
        <div className="segmented-control" aria-label="Project filter">
          {filters.map((filter) => (
            <button
              aria-pressed={activeFilter === filter.value}
              key={filter.value}
              onClick={() => {
                setActiveFilter(filter.value)
                setActiveProjectId(undefined)
              }}
              type="button"
            >
              {filter.label}
            </button>
          ))}
        </div>
        <p>{filteredProjects.length} selected</p>
      </div>

      <div className="featured-project-stage">
        {activeProject && (
          <>
            <div className="stage-media">
              <Image
                alt=""
                fill
                loading="eager"
                sizes="(max-width: 900px) 100vw, 58vw"
                src={getProjectImage(activeProject)}
              />
            </div>
            <div className="stage-copy">
              <div className="stage-status-row">
                <p className="project-kicker">{activeProject.projectStatus?.replace('-', ' ')}</p>
                <span>{activeIndex >= 0 ? String(activeIndex + 1).padStart(2, '0') : '01'}</span>
              </div>
              <h3>{activeProject.title}</h3>
              <p>{activeProject.summary}</p>
              {!!activeProject.stack?.length && (
                <ul className="tag-list" aria-label={`${activeProject.title} stack`}>
                  {activeProject.stack.map((item) => (
                    <li key={item.id ?? item.technology}>{item.technology}</li>
                  ))}
                </ul>
              )}
              <div className="link-row">
                {activeProject.liveUrl && <a href={activeProject.liveUrl}>Live site</a>}
                {activeProject.repoUrl && <a href={activeProject.repoUrl}>Repository</a>}
              </div>
            </div>
          </>
        )}
      </div>

      <div className="project-grid">
        {filteredProjects.map((project, index) => {
          const projectId = project.id ?? project.title
          const isActive = activeProject && projectId === (activeProject.id ?? activeProject.title)

          return (
            <article
              className="project-card"
              data-active={isActive ? 'true' : 'false'}
              key={projectId}
              style={{ '--card-index': index } as React.CSSProperties}
            >
              <button
                className="project-card-button"
                onClick={() => setActiveProjectId(projectId)}
                type="button"
              >
                <span className="project-number">{String(index + 1).padStart(2, '0')}</span>
                <span className="project-card-title">{project.title}</span>
                <span className="project-card-status">{project.projectStatus?.replace('-', ' ')}</span>
              </button>
              <p>{project.summary}</p>
              {!!project.highlights?.length && (
                <ul className="highlight-list">
                  {project.highlights.slice(0, 2).map((highlight) => (
                    <li key={highlight.id ?? highlight.item}>{highlight.item}</li>
                  ))}
                </ul>
              )}
            </article>
          )
        })}
      </div>
    </div>
  )
}
