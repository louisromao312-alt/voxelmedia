'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { EASE } from '@/components/SectionReveal'

export default function TerminalVillager() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: false, amount: 0.4 })

  return (
    <div
      ref={ref}
      className="pointer-events-none relative z-[1] mx-auto -mb-2 w-[124px] sm:-mb-3 sm:w-[148px] md:-mb-4 md:w-[172px] lg:w-[196px]"
      aria-hidden="true"
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
        transition={{ duration: 0.9, ease: EASE }}
        className="relative"
      >
        {/* Sharp layer — stays crisp until near the bottom edge */}
        <div
          className="relative"
          style={{
            WebkitMaskImage:
              'linear-gradient(to bottom, #000 0%, #000 76%, rgba(0,0,0,0.9) 90%, transparent 98%)',
            maskImage:
              'linear-gradient(to bottom, #000 0%, #000 76%, rgba(0,0,0,0.9) 90%, transparent 98%)',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/voxel-intelligence/villager.png"
            alt=""
            draggable={false}
            className="h-auto w-full"
          />
        </div>

        {/* Soft blur tail — only the last strip before the image ends */}
        <div
          className="absolute inset-x-0 bottom-0 h-[22%] overflow-hidden"
          style={{
            WebkitMaskImage:
              'linear-gradient(to bottom, transparent 0%, transparent 42%, rgba(0,0,0,0.55) 72%, #000 100%)',
            maskImage:
              'linear-gradient(to bottom, transparent 0%, transparent 42%, rgba(0,0,0,0.55) 72%, #000 100%)',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/voxel-intelligence/villager.png"
            alt=""
            draggable={false}
            aria-hidden="true"
            className="h-auto w-full blur-[6px] brightness-95"
          />
        </div>

        {/* Section-color wash into heading */}
        <div
          className="absolute inset-x-0 bottom-0 h-[20%] bg-gradient-to-t from-[#0A0A0C] from-10% via-[#0A0A0C]/75 to-transparent"
          aria-hidden="true"
        />
      </motion.div>
    </div>
  )
}
