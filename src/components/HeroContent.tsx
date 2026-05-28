'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { MagneticLink, MagneticSpan } from './Magnetic'

type SocialLink = { id?: string | null; label: string; url: string }

type HeroContentProps = {
  availability?: string | null
  headline?: string | null
  location?: string | null
  name?: string | null
  resumeUrl?: string | null
  role?: string | null
  socialLinks?: SocialLink[] | null
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
}

const fadeUp = {
  hidden: { opacity: 0, y: 18, filter: 'blur(6px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
}

function WordSplit({ text, tag = 'span' }: { text: string; tag?: 'h1' | 'span' }) {
  const words = text.split(' ')
  const Tag = tag as 'h1' | 'span'

  return (
    <Tag style={{ display: 'flex', flexWrap: 'wrap', columnGap: '0.28em' }}>
      {words.map((word, i) => (
        <span key={i} style={{ display: 'inline-block', overflow: 'hidden' }}>
          <motion.span
            style={{ display: 'inline-block' }}
            variants={{
              hidden: { y: '105%', opacity: 0 },
              show: {
                y: 0,
                opacity: 1,
                transition: { duration: 0.55, delay: i * 0.055, ease: [0.22, 1, 0.36, 1] },
              },
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </Tag>
  )
}



export function HeroContent({ availability, headline, location, name, resumeUrl, role, socialLinks }: HeroContentProps) {
  const reduced = useReducedMotion()

  return (
    <motion.div className="hero-content" variants={container} initial={reduced ? 'show' : 'hidden'} animate="show">
      <motion.p className="eyebrow" variants={fadeUp}>{availability}</motion.p>

      <motion.div variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } } }}>
        <WordSplit text={name || ''} tag="h1" />
      </motion.div>

      <motion.p className="role" variants={fadeUp}>{role}</motion.p>
      <motion.p className="headline" variants={fadeUp}>{headline}</motion.p>

      <motion.div className="hero-meta" variants={fadeUp}>
        {location && <MagneticSpan>{location}</MagneticSpan>}
        {resumeUrl && <MagneticLink href={resumeUrl}>Resume</MagneticLink>}
        {socialLinks?.map((link) => (
          <MagneticLink href={link.url} key={link.id ?? link.url} rel="noreferrer" target="_blank">
            {link.label}
          </MagneticLink>
        ))}
      </motion.div>
    </motion.div>
  )
}
