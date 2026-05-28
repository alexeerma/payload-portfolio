'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'

export function ParallaxHeroImage({ src }: { src: string }) {
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 900], [0, 180])

  return (
    <motion.div
      aria-hidden
      style={{
        bottom: '-15%',
        left: 0,
        position: 'absolute',
        right: 0,
        top: '-15%',
        y,
        zIndex: -5,
      }}
    >
      <Image
        alt=""
        fill
        loading="eager"
        sizes="100vw"
        src={src}
        style={{
          filter: 'saturate(0.92) contrast(1.02)',
          objectFit: 'cover',
          objectPosition: '62% center',
          opacity: 0.38,
          transform: 'scale(1.04)',
        }}
      />
    </motion.div>
  )
}
