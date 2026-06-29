'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { EASE } from '@/components/SectionReveal'

export default function IndustryGapVillagers() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: false, amount: 0.55 })

  return (
    <div ref={ref} className="pointer-events-none absolute inset-0 z-[5] overflow-visible">
      <motion.div
        className="absolute left-1/2 top-1/2 w-[400px] sm:w-[480px] md:w-[560px] lg:w-[640px]"
        initial={{ opacity: 0, x: '-50%', y: 140 }}
        animate={
          inView
            ? { opacity: 1, x: '-50%', y: '-46%' }
            : { opacity: 0, x: '-50%', y: 140 }
        }
        transition={{ duration: 1, ease: EASE }}
        aria-hidden="true"
      >
        <img
          src="/industry-gap/villagers.png"
          alt=""
          draggable={false}
          className="h-auto w-full"
        />
      </motion.div>
    </div>
  )
}
