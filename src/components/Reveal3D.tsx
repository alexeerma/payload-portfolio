'use client'

import { useEffect, useRef } from 'react'

import { registerGsap, ScrollTrigger } from '@/lib/gsap'

type Reveal3DProps = {
  children: React.ReactNode
  className?: string
  /** Rotate children in around the X axis (tilt forward) on enter. */
  axis?: 'x' | 'y'
  /** Depth the element pushes back from before settling, in px. */
  depth?: number
  /** Stagger direct children instead of animating the wrapper as one block. */
  stagger?: boolean
}

export function Reveal3D({
  children,
  className,
  axis = 'x',
  depth = 140,
  stagger = false,
}: Reveal3DProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const gsap = registerGsap()
    const targets = stagger ? Array.from(el.children) : [el]

    const from =
      axis === 'x'
        ? { rotateX: -34, y: 60, z: -depth, opacity: 0 }
        : { rotateY: 26, x: 40, z: -depth, opacity: 0 }

    const ctx = gsap.context(() => {
      gsap.set(el, { perspective: 1000 })
      gsap.from(targets, {
        ...from,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        stagger: stagger ? 0.12 : 0,
        transformOrigin: axis === 'x' ? '50% 100%' : '0% 50%',
        scrollTrigger: {
          trigger: el,
          start: 'top 82%',
          toggleActions: 'play none none none',
        },
      })
    }, el)

    return () => ctx.revert()
  }, [axis, depth, stagger])

  return (
    <div className={className} ref={ref} style={{ transformStyle: 'preserve-3d' }}>
      {children}
    </div>
  )
}

export { ScrollTrigger }
