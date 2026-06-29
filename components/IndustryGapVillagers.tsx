'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { motion, useInView } from 'framer-motion'
import { EASE } from '@/components/SectionReveal'

export default function IndustryGapVillagers() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: false, amount: 0.55 })

  return (
    <div ref={ref} className="pointer-events-none absolute inset-0 z-[1] overflow-visible">
      <motion.div
        className="absolute left-1/2 top-1/2 w-[min(1200px,140vw)]"
        initial={{ opacity: 0, x: '-50%', y: 140 }}
        animate={
          inView
            ? { opacity: 0.9, x: '-50%', y: '-46%' }
            : { opacity: 0, x: '-50%', y: 140 }
        }
        transition={{ duration: 1, ease: EASE }}
        aria-hidden="true"
      >
        <Image
          src="/industry-gap/villagers.png"
          alt=""
          width={1200}
          height={900}
          className="h-auto w-full mix-blend-screen"
          priority={false}
        />
      </motion.div>
    </div>
  )
}
