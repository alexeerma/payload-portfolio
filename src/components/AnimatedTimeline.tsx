'use client'

import { motion, useReducedMotion } from 'framer-motion'

type TimelineItem = {
  id?: number | string
  role: string
  company: string
  location?: string | null
  current?: boolean | null
  startDate: string
  endDate?: string | null
  summary?: string | null
  highlights?: Array<{ id?: string | null; item: string }> | null
}

type AnimatedTimelineProps = {
  items: TimelineItem[]
}

function formatDateRange(item: TimelineItem) {
  const start = new Date(item.startDate).getFullYear()
  const end = item.current ? 'Present' : item.endDate ? new Date(item.endDate).getFullYear() : 'Present'
  return `${start} - ${end}`
}

export function AnimatedTimeline({ items }: AnimatedTimelineProps) {
  const reduced = useReducedMotion()

  return (
    <div className="timeline">
      {items.map((item, i) => (
        <motion.article
          className="timeline-item"
          key={item.id ?? `${item.company}-${item.role}`}
          initial={reduced ? { opacity: 1, x: 0 } : { opacity: 0, x: -18 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: reduced ? 0 : 0.5, delay: reduced ? 0 : i * 0.08, ease: [0.22, 1, 0.36, 1] }}
        >
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
                {item.highlights.slice(0, 3).map((h) => (
                  <li key={h.id ?? h.item}>{h.item}</li>
                ))}
              </ul>
            )}
          </div>
        </motion.article>
      ))}
    </div>
  )
}
