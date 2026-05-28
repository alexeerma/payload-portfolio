import type { CSSProperties } from 'react'

import type { Skill } from '@/payload-types'

type DisplaySkill = Pick<Skill, 'name' | 'category'> & {
  id?: number | string
}

type SkillMatrixProps = {
  skills: DisplaySkill[]
}

export function SkillMatrix({ skills }: SkillMatrixProps) {
  const categories = Array.from(new Set(skills.map((skill) => skill.category)))

  return (
    <div className="skill-matrix">
      {categories.map((category) => (
        <section className="stack-group" key={category} aria-labelledby={`stack-${category}`}>
          <h3 id={`stack-${category}`}>{category}</h3>
          <div className="stack-list">
            {skills
              .filter((skill) => skill.category === category)
              .map((skill, index) => (
                <span
                  className="stack-pill"
                  key={skill.id ?? skill.name}
                  style={{ '--skill-index': index } as CSSProperties}
                >
                  {skill.name}
                </span>
              ))}
          </div>
        </section>
      ))}
      <div className="stack-note">
        <span>Simple stack overview</span>
        <p>No ratings. No percentages. Just the tools I like building with.</p>
      </div>
    </div>
  )
}
