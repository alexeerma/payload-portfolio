import type { Skill } from '@/payload-types'

type DisplaySkill = Pick<Skill, 'name' | 'category'> & {
  id?: number | string
}

type SkillMatrixProps = {
  skills: DisplaySkill[]
}

export function SkillMatrix({ skills }: SkillMatrixProps) {
  const reversed = [...skills].reverse()

  return (
    <div className="skill-scroll-wrap">
      {[
        { items: skills, reverse: false },
        { items: reversed, reverse: true },
      ].map(({ items, reverse }, rowIndex) => (
        <div className={`skill-scroll-row${reverse ? ' reverse' : ''}`} key={rowIndex}>
          {[0, 1, 2].map((copy) => (
            <div
              className="skill-scroll-track"
              key={copy}
              aria-hidden={copy > 0 ? 'true' : undefined}
            >
              {items.map((skill) => (
                <span className="skill-pill" key={skill.id ?? skill.name}>
                  {skill.name}
                </span>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
