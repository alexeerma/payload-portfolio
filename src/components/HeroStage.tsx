'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

import { gsap, registerGsap } from '@/lib/gsap'

type SocialLink = { id?: string | null; label: string; url: string }

const DEFAULT_CATEGORIES = ['Next.js', 'Payload', 'TypeScript', 'Design systems', 'Deployment']

// Scatter slots around the hero edges, avoiding the centre where the headline sits.
// r = orbit radius (px), phase = 0..1 offset around the clockwise orbit.
const FLOAT_SLOTS = [
  { top: '17%', left: '9%', size: 122, depth: 0.7, r: 34, phase: 0, rot: -8 },
  { top: '13%', left: '80%', size: 96, depth: 1.1, r: 28, phase: 0.14, rot: 7 },
  { top: '56%', left: '13%', size: 88, depth: 0.5, r: 40, phase: 0.28, rot: 6 },
  { top: '52%', left: '85%', size: 132, depth: 1.25, r: 24, phase: 0.42, rot: -6 },
  { top: '78%', left: '26%', size: 78, depth: 0.85, r: 36, phase: 0.57, rot: 9 },
  { top: '80%', left: '71%', size: 104, depth: 0.6, r: 30, phase: 0.71, rot: -10 },
  { top: '25%', left: '65%', size: 72, depth: 1.0, r: 44, phase: 0.85, rot: 5 },
]

type HeroStageProps = {
  name?: string | null
  title?: string | null
  headline?: string | null
  intro?: string | null
  availability?: string | null
  email?: string | null
  resumeUrl?: string | null
  logoUrl?: string | null
  avatarUrl?: string | null
  socialLinks?: SocialLink[] | null
  stats: { label: string; value: string }[]
  floatImages?: string[]
  floatSpeed?: number
  secondHeadline?: string | null
  categories?: string[]
}

function MouseIcon() {
  return (
    <svg aria-hidden="true" height="15" viewBox="0 0 12 18" width="10">
      <rect x="1" y="1" width="10" height="16" rx="5" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <line x1="6" y1="4" x2="6" y2="7" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  )
}

export function HeroStage({
  name,
  title,
  headline,
  intro,
  availability,
  email,
  resumeUrl,
  logoUrl,
  avatarUrl,
  socialLinks,
  stats,
  floatImages,
  floatSpeed = 16,
  secondHeadline,
  categories,
}: HeroStageProps) {
  const cats = categories?.length ? categories : DEFAULT_CATEGORIES
  const secondText =
    secondHeadline || 'I build web interfaces, CMS-driven sites and internal tools teams actually use.'
  const [cursor, setCursor] = useState({ x: 0, y: 0 })
  const [scroll, setScroll] = useState(0)
  const [time, setTime] = useState('0.0')
  const startRef = useRef<number | null>(null)
  const floatLayerRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const stmtARef = useRef<HTMLDivElement>(null)
  const stmtBRef = useRef<HTMLDivElement>(null)

  const imgs = floatImages?.filter(Boolean) ?? []
  const floaters = imgs.length
    ? FLOAT_SLOTS.map((slot, i) => ({ src: imgs[i % imgs.length], ...slot }))
    : []

  useEffect(() => {
    const onMove = (e: PointerEvent) => setCursor({ x: Math.round(e.clientX), y: Math.round(e.clientY) })
    const onScroll = () => setScroll(Math.round(window.scrollY))
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })

    let raf = 0
    const tick = (t: number) => {
      if (startRef.current === null) startRef.current = t
      setTime(((t - startRef.current) / 1000).toFixed(1))
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  // Depth parallax for the floating images (each tile drifts by its own depth).
  useEffect(() => {
    const layer = floatLayerRef.current
    if (!layer) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const tiles = Array.from(layer.querySelectorAll<HTMLElement>('.stage-floater'))
    const movers = tiles.map((el) => ({
      x: gsap.quickTo(el, 'x', { duration: 1.1, ease: 'power3.out' }),
      y: gsap.quickTo(el, 'y', { duration: 1.1, ease: 'power3.out' }),
      depth: parseFloat(el.dataset.depth || '1'),
    }))

    const onMove = (e: PointerEvent) => {
      const nx = e.clientX / window.innerWidth - 0.5
      const ny = e.clientY / window.innerHeight - 0.5
      movers.forEach((m) => {
        m.x(nx * m.depth * -60)
        m.y(ny * m.depth * -60)
      })
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [floaters.length])

  // Pin the hero and crossfade statement A -> statement B on scroll.
  useEffect(() => {
    const section = sectionRef.current
    const a = stmtARef.current
    const bEl = stmtBRef.current
    if (!section || !a || !bEl) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(bEl, { display: 'none' })
      return
    }

    const floatLayer = floatLayerRef.current
    const g = registerGsap()
    const ctx = g.context(() => {
      // GSAP owns the centring (xPercent/yPercent) so it stays centred as it animates;
      // vertical drift uses pixel `y` on top of that.
      g.set(a, { xPercent: -50, yPercent: -50, y: 0, filter: 'blur(0px)' })
      g.set(bEl, { xPercent: -50, yPercent: -50, y: 60, autoAlpha: 0, filter: 'blur(16px)' })

      const tl = g.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=135%',
          pin: true,
          scrub: 0.6,
          refreshPriority: 1,
          invalidateOnRefresh: true,
        },
      })

      // Only ONE statement is centred & sharp at a time; the images fade to black.
      // A blurs + fades up out, floating images fade away.
      tl.to(a, { autoAlpha: 0, y: -60, filter: 'blur(16px)', ease: 'power1.in', duration: 1 }, 0.4)
      if (floatLayer) tl.to(floatLayer, { autoAlpha: 0, ease: 'power1.in', duration: 1 }, 0.4)
      // B rises into the centre out of black, blur clearing; it stays as the final
      // pinned state and simply scrolls away into the next section (no black gap).
      tl.fromTo(
        bEl,
        { autoAlpha: 0, y: 60, filter: 'blur(16px)' },
        { autoAlpha: 1, y: 0, filter: 'blur(0px)', ease: 'power1.out', duration: 1 },
        1.1,
      )
      tl.to({}, { duration: 0.4 })

      // Once the pin releases, slowly fade the whole hero out as it scrolls away,
      // so it doesn't sit there sharp behind the next section.
      g.to(section, {
        autoAlpha: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'bottom bottom',
          end: 'bottom top',
          scrub: true,
          invalidateOnRefresh: true,
        },
      })
    }, section)

    return () => ctx.revert()
  }, [])

  const navLinks: SocialLink[] = []
  if (resumeUrl) navLinks.push({ label: 'CV', url: resumeUrl })
  ;(socialLinks ?? []).forEach((l) => navLinks.push(l))
  if (email) navLinks.push({ label: 'Mail', url: `mailto:${email}` })

  const bigStatement = title || 'Developer & pro volleyball player'
  const ctaHref = email ? `mailto:${email}` : '/#contact'

  return (
    <section className="hero-stage" aria-labelledby="hero-title" ref={sectionRef}>
      <div className="stage-grain" aria-hidden="true" />
      <div className="stage-spotlight" aria-hidden="true" />

      {floaters.length > 0 && (
        <div className="stage-floaters" aria-hidden="true" ref={floatLayerRef}>
          {floaters.map((f, i) => (
            <div
              className="stage-floater"
              data-depth={f.depth}
              key={i}
              style={
                {
                  '--size': `${f.size}px`,
                  '--dur': `${floatSpeed}s`,
                  '--delay': `${-(f.phase * floatSpeed)}s`,
                  '--r': `${f.r}px`,
                  '--rot': `${f.rot}deg`,
                  left: f.left,
                  top: f.top,
                } as React.CSSProperties
              }
            >
              <span className="floater-inner">
                <Image alt="" fill sizes="140px" src={f.src} />
              </span>
            </div>
          ))}
        </div>
      )}

      <div className="stage-frame" aria-hidden="true">
        <span className="tick tick-tl" />
        <span className="tick tick-tr" />
        <span className="tick tick-bl" />
        <span className="tick tick-br" />
        <span className="tick tick-t" />
        <span className="tick tick-b" />
        <span className="tick tick-l" />
        <span className="tick tick-r" />
      </div>

      <div className="stage-top">
        <Link className="stage-brand" href="/" aria-label="Home">
          <Image alt="" className="stage-logo" height={22} src={logoUrl || '/aelogo.svg'} width={22} unoptimized />
          <span>{(name || 'Aleksander Eerma').toUpperCase()}</span>
        </Link>
        <nav className="stage-nav" aria-label="Primary">
          {navLinks.map((l) => (
            <a className="stage-nav-link" href={l.url} key={l.label}>
              {l.label.toUpperCase()}
            </a>
          ))}
        </nav>
      </div>

      <div className="stage-center">
        <div className="stage-statement" ref={stmtARef}>
          <Image alt="" className="stage-mark" height={26} src={logoUrl || '/aelogo.svg'} width={26} unoptimized />
          <h1 className="stage-headline" id="hero-title">
            {bigStatement}
          </h1>
          {(headline || intro) && <p className="stage-sub">{headline || intro}</p>}
          <a className="stage-cta" href={ctaHref}>
            <span>{email ? 'Write to me' : 'Get in touch'}</span>
          </a>
        </div>

        <div className="stage-statement stage-statement-b" ref={stmtBRef}>
          {cats.length > 0 && (
            <p className="stage-cats">
              {cats.map((c, i) => (
                <span key={`${c}-${i}`}>
                  {c}
                  {i < cats.length - 1 && <i>/</i>}
                </span>
              ))}
            </p>
          )}
          <h2 className="stage-headline stage-headline-b">{secondText}</h2>
          <div className="stage-cta-row">
            <a className="stage-cta" href={ctaHref}>
              <span>{email ? 'Write to me' : 'Get in touch'}</span>
            </a>
            {resumeUrl && (
              <a className="stage-cta" href={resumeUrl}>
                <span>Download CV</span>
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="stage-avatar">
        {avatarUrl && (
          <span className="stage-avatar-img">
            <Image alt="" fill sizes="44px" src={avatarUrl} />
          </span>
        )}
        <span className="stage-avatar-line">{availability || intro}</span>
      </div>

      <div className="stage-hud" aria-hidden="true">
        <div className="hud-tickers">
          {stats.map((s) => (
            <div className="hud-ticker" key={s.label}>
              <span className="hud-ticker-mark" />
              <div>
                <span className="hud-ticker-label">{s.label.toUpperCase()}</span>
                <strong>{s.value}</strong>
              </div>
            </div>
          ))}
        </div>

        <div className="hud-scroll">
          <MouseIcon />
          <span>SCROLL DOWN</span>
        </div>

        <div className="hud-readouts">
          <div>
            <span>CURSOR X:</span>
            <b>{cursor.x}</b>
          </div>
          <div>
            <span>CURSOR Y:</span>
            <b>{cursor.y}</b>
          </div>
          <div>
            <span>SCROLL:</span>
            <b>{scroll}</b>
          </div>
          <div>
            <span>TIME:</span>
            <b>{time}S</b>
          </div>
        </div>
      </div>
    </section>
  )
}
