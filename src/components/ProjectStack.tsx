'use client'

import Image from 'next/image'
import { useEffect, useRef } from 'react'

import { registerGsap, ScrollTrigger } from '@/lib/gsap'
import type { Media, Project } from '@/payload-types'

type DisplayProject = Pick<Project, 'title' | 'summary' | 'liveUrl' | 'repoUrl' | 'projectStatus'> & {
  coverImage?: Project['coverImage']
  highlights?: Project['highlights']
  id?: number | string
  stack?: Project['stack']
}

function getMediaUrl(media: Media | number | string | null | undefined) {
  if (media && typeof media === 'object' && 'url' in media) return media.url
  return null
}

export function ProjectStack({ projects }: { projects: DisplayProject[] }) {
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const gsap = registerGsap()
    const cards = Array.from(root.querySelectorAll<HTMLElement>('.stack-card'))

    const ctx = gsap.context(() => {
      cards.forEach((card) => {
        const inner = card.querySelector('.stack-card-inner')
        // Fade + un-blur in as it enters, hold sharp in the centre, then fade +
        // blur away as it leaves — so any number of projects transition cleanly.
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: card,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
            invalidateOnRefresh: true,
          },
        })
        tl.fromTo(
          inner,
          { autoAlpha: 0, filter: 'blur(16px)', yPercent: 6 },
          { autoAlpha: 1, filter: 'blur(0px)', yPercent: 0, ease: 'none', duration: 0.32 },
        )
          .to(inner, { duration: 0.36 })
          .to(inner, { autoAlpha: 0, filter: 'blur(16px)', yPercent: -6, ease: 'none', duration: 0.32 })
      })
    }, root)

    // Positions depend on the pinned hero above; recompute once everything is mounted.
    ScrollTrigger.refresh()

    return () => ctx.revert()
  }, [projects.length])

  return (
    <div className="project-stack" ref={rootRef}>
      {projects.map((project, index) => {
        const img = getMediaUrl(project.coverImage) || '/portfolio-hero.png'
        const caseHref = project.liveUrl || project.repoUrl || '/projects'
        return (
          <article
            className="stack-card"
            data-flip={index % 2 === 1 ? 'true' : undefined}
            key={project.id ?? project.title}
            style={{ zIndex: index + 1 }}
          >
            <div className="stack-card-inner">
              <div className="stack-card-media">
                <Image alt="" fill sizes="(max-width: 900px) 100vw, 52vw" src={img} />
                <span className="stack-card-index">{String(index + 1).padStart(2, '0')}</span>
              </div>
              <div className="stack-card-copy">
                <p className="stack-card-kicker">{(project.projectStatus || 'Project').replace('-', ' ')}</p>
                <h3>{project.title}</h3>
                <p className="stack-card-summary">{project.summary}</p>
                <a className="stage-cta stack-card-view" href={caseHref}>
                  <span>View case</span>
                </a>
              </div>
            </div>
          </article>
        )
      })}
    </div>
  )
}

export { ScrollTrigger }
