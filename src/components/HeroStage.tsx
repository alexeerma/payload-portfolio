'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

import { gsap, registerGsap } from '@/lib/gsap'
import Strands from '@/components/Strands'

// ── Hero background animation ──────────────────────────────────────────────
// Tweak the strands here. Full prop reference in src/components/Strands.tsx.
const STRANDS_CONFIG = {
  colors: ['#3b9bff', '#7C3AED', '#06B6D4'], // strand palette (hex)
  count: 5, // number of strands
  speed: 0.5, // flow speed
  amplitude: 2.7, // vertical wave reach
  waviness: 0.2, // curve density
  thickness: 0.7, // strand width
  glow: 2.6, // bloom strength
  taper: 1.7, // edge fade sharpness
  spread: 1, // separation between strands
  intensity: 0.45, // overall brightness
  saturation: 1.5, // color vibrance
  opacity: 1, // layer transparency
  scale: 3, // zoom of the whole effect
}
// ───────────────────────────────────────────────────────────────────────────

type SocialLink = { id?: string | null; label: string; url: string }

const DEFAULT_CATEGORIES = ['Next.js', 'Payload', 'TypeScript', 'Design systems', 'Deployment']

type HeroStageProps = {
  name?: string | null
  title?: string | null
  headline?: string | null
  intro?: string | null
  availability?: string | null
  email?: string | null
  resumeUrl?: string | null
  logoUrl?: string | null
  socialLinks?: SocialLink[] | null
  stats: { label: string; value: string }[]
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
  socialLinks,
  stats,
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
  const sectionRef = useRef<HTMLElement>(null)
  const stmtARef = useRef<HTMLDivElement>(null)
  const stmtBRef = useRef<HTMLDivElement>(null)

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

      // Only ONE statement is centred & sharp at a time.
      // A blurs + fades up out.
      tl.to(a, { autoAlpha: 0, y: -60, filter: 'blur(16px)', ease: 'power1.in', duration: 1 }, 0.4)
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
      <div className="stage-strands" aria-hidden="true">
        <Strands {...STRANDS_CONFIG} />
      </div>

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
