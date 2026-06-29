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
      className="pointer-events-none relative z-[1] mx-auto -mb-2 w-[148px] sm:-mb-3 sm:w-[176px] md:-mb-4 md:w-[204px] lg:w-[232px]"
      aria-hidden="true"
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
        transition={{ duration: 0.9, ease: EASE }}
        className="relative"
      >
        {/* Sharp layer — fades out toward bottom */}
        <div
          className="relative"
          style={{
            WebkitMaskImage:
              'linear-gradient(to bottom, #000 0%, #000 58%, transparent 86%)',
            maskImage:
              'linear-gradient(to bottom, #000 0%, #000 58%, transparent 86%)',
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

        {/* Soft blur tail blending into The Terminal */}
        <div
          className="absolute inset-x-0 bottom-0 h-[38%] overflow-hidden"
          style={{
            WebkitMaskImage:
              'linear-gradient(to bottom, transparent 0%, #000 45%, #000 100%)',
            maskImage:
              'linear-gradient(to bottom, transparent 0%, #000 45%, #000 100%)',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/voxel-intelligence/villager.png"
            alt=""
            draggable={false}
            aria-hidden="true"
            className="h-auto w-full blur-[3px] brightness-90"
          />
        </div>

        {/* Section-color wash into heading */}
        <div
          className="absolute inset-x-0 bottom-0 h-[34%] bg-gradient-to-t from-[#0A0A0C] via-[#0A0A0C]/90 to-transparent"
          aria-hidden="true"
        />
      </motion.div>
    </div>
  )
}
