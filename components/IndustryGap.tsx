'use client'

import { useRef } from 'react'
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue } from 'framer-motion'
import { RoleBadge } from '@/components/JourneySelector'
import { useUserJourney } from '@/context/UserJourneyContext'
import { EASE } from '@/components/SectionReveal'
import IndustryGapMonolith from '@/components/IndustryGapMonolith'

const HIGHLIGHTS = {
  default: null,
  creator:
    'Studios chase trends blind — without real-time modpack and server data, even top creators are building in the dark.',
  brand:
    'Brands sponsor creators without verified audience data — campaigns fail before they launch.',
} as const

function IndustryGapCopy({
  highlight,
  role,
  compact = false,
}: {
  highlight: string | null
  role: string | null
  compact?: boolean
}) {
  return (
    <div className={`text-center ${compact ? 'max-w-xl' : 'max-w-3xl'} mx-auto px-4`}>
      <div className="flex justify-center mb-4">
        <RoleBadge />
      </div>
      <p className="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-4">
        The Industry Gap
      </p>
      <h2
        id={compact ? 'industry-gap-heading' : 'industry-gap-heading-mobile'}
        className={`font-bold text-white leading-tight mb-6 ${
          compact
            ? 'text-2xl sm:text-3xl md:text-4xl'
            : 'text-3xl sm:text-4xl md:text-5xl'
        }`}
      >
        The Minecraft creator economy runs on intuition.
        <span className="block text-zinc-500 mt-2">Not intelligence.</span>
      </h2>
      <p
        id="industry-gap-body"
        className={`text-zinc-400 leading-relaxed mx-auto ${
          compact ? 'text-sm sm:text-base max-w-lg' : 'text-base sm:text-lg max-w-2xl'
        }`}
      >
        Studios chase trends blind. Brands sponsor creators without verified
        audience data. The Minecraft meta shifts overnight — and nobody has a
        single source of truth for what&apos;s actually moving across the{' '}
        <span className="text-zinc-300">Minecraft ecosystem</span>. The gap
        isn&apos;t creativity. It&apos;s{' '}
        <span className="text-white font-medium">data transparency</span>.
      </p>

      <AnimatePresence>
        {highlight && (
          <motion.p
            key={role}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.45, ease: EASE }}
            className={`mt-6 text-sm sm:text-base leading-relaxed max-w-xl mx-auto rounded-lg border px-5 py-4 ${
              role === 'creator'
                ? 'border-green-400/20 bg-green-400/5 text-green-300/90'
                : 'border-blue-400/20 bg-blue-400/5 text-blue-300/90'
            }`}
          >
            {highlight}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}

function IndustryGapMobile() {
  const { role } = useUserJourney()
  const highlight = role ? HIGHLIGHTS[role] : null
  const rotateX = useMotionValue(52)
  const rotateY = useMotionValue(-18)

  return (
    <section
      className="relative px-4 py-28 bg-[#0A0A0C] md:hidden"
      aria-labelledby="industry-gap-heading-mobile"
    >
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            'linear-gradient(180deg, #0A0A0C 0%, #141416 50%, #0A0A0C 100%)',
        }}
      />
      <div className="relative z-10">
        <IndustryGapCopy highlight={highlight} role={role} />
        <div className="mt-14 flex justify-center overflow-hidden">
          <IndustryGapMonolith rotateX={rotateX} rotateY={rotateY} />
        </div>
      </div>
    </section>
  )
}

function IndustryGapDesktop() {
  const sectionRef = useRef<HTMLElement>(null)
  const { role } = useUserJourney()
  const highlight = role ? HIGHLIGHTS[role] : null

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  const bgLift = useTransform(scrollYProgress, [0.08, 0.28, 0.9], [0, 1, 1])
  const horizontal = useTransform(scrollYProgress, [0.22, 0.82], [0, 1])

  const trackX = useTransform(horizontal, [0, 1], ['0%', '-50%'])
  const textScale = useTransform(horizontal, [0, 1], [1, 0.84])
  const textX = useTransform(horizontal, [0, 1], ['0vw', '-4vw'])
  const textOpacity = useTransform(horizontal, [0, 0.85, 1], [1, 1, 0.92])

  const voxelX = useTransform(horizontal, [0, 1], ['42vw', '0vw'])
  const voxelOpacity = useTransform(horizontal, [0, 0.12, 0.55, 1], [0, 0.35, 0.9, 1])
  const voxelRotateY = useTransform(horizontal, [0, 1], [34, -14])
  const voxelRotateX = useTransform(horizontal, [0, 1], [22, 56])
  const voxelScale = useTransform(horizontal, [0, 1], [0.88, 1])

  const scrollHint = useTransform(horizontal, [0, 0.08, 0.2], [1, 1, 0])

  return (
    <section
      ref={sectionRef}
      className="relative hidden md:block"
      style={{ height: '280vh' }}
      aria-labelledby="industry-gap-heading"
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        <motion.div
          className="pointer-events-none absolute inset-0"
          aria-hidden="true"
          style={{
            background: useTransform(
              bgLift,
              (v) =>
                `linear-gradient(180deg,
                  rgb(${10 + v * 18}, ${10 + v * 18}, ${12 + v * 20}) 0%,
                  rgb(${18 + v * 22}, ${18 + v * 22}, ${22 + v * 24}) 45%,
                  rgb(${22 + v * 26}, ${22 + v * 26}, ${26 + v * 28}) 50%,
                  rgb(${18 + v * 22}, ${18 + v * 22}, ${22 + v * 24}) 55%,
                  rgb(${10 + v * 18}, ${10 + v * 18}, ${12 + v * 20}) 100%)`,
            ),
          }}
        />
        <motion.div
          className="pointer-events-none absolute inset-0"
          aria-hidden="true"
          style={{
            opacity: useTransform(bgLift, (v) => v * 0.55),
            background:
              'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(74,222,128,0.09), transparent 70%)',
          }}
        />

        <motion.div
          className="relative z-10 flex h-full items-center"
          style={{
            width: '200%',
            x: trackX,
          }}
        >
          <div className="flex h-full w-1/2 shrink-0 items-center justify-center">
            <motion.div
              style={{
                scale: textScale,
                x: textX,
                opacity: textOpacity,
              }}
              className="w-full"
            >
              <IndustryGapCopy highlight={highlight} role={role} compact />
            </motion.div>
          </div>

          <div className="flex h-full w-1/2 shrink-0 items-center justify-center">
            <motion.div
              style={{
                x: voxelX,
                opacity: voxelOpacity,
                scale: voxelScale,
              }}
            >
              <IndustryGapMonolith
                rotateX={voxelRotateX}
                rotateY={voxelRotateY}
              />
            </motion.div>
          </div>
        </motion.div>

        <motion.p
          className="pointer-events-none absolute bottom-8 left-1/2 z-20 -translate-x-1/2 font-mono text-[10px] uppercase tracking-widest text-zinc-500"
          style={{ opacity: scrollHint }}
          aria-hidden="true"
        >
          Scroll to explore the signal gap
        </motion.p>
      </div>
    </section>
  )
}

export default function IndustryGap() {
  return (
    <>
      <IndustryGapMobile />
      <IndustryGapDesktop />
    </>
  )
}
