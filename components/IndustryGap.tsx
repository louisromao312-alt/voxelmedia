'use client'

import { motion, AnimatePresence } from 'framer-motion'
import SectionReveal from '@/components/SectionReveal'
import IndustryGapNetwork from '@/components/IndustryGapNetwork'
import { RoleBadge } from '@/components/JourneySelector'
import { useUserJourney } from '@/context/UserJourneyContext'
import { EASE } from '@/components/SectionReveal'

const HIGHLIGHTS = {
  default: null,
  creator:
    'Studios chase trends blind — without real-time modpack and server data, even top creators are building in the dark.',
  brand:
    'Brands sponsor creators without verified audience data — campaigns fail before they launch.',
} as const

export default function IndustryGap() {
  const { role } = useUserJourney()
  const highlight = role ? HIGHLIGHTS[role] : null

  return (
    <SectionReveal
      className="relative overflow-visible px-4 py-28 md:py-36 bg-[#0A0A0C]"
      aria-labelledby="industry-gap-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 z-0"
        aria-hidden="true"
        style={{
          background:
            'linear-gradient(180deg, #0A0A0C 0%, #0A0B0E 50%, #0A0A0C 100%)',
        }}
      />

      <IndustryGapNetwork />

      <div className="relative z-10 mx-auto max-w-5xl">
      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <div className="flex justify-center mb-4">
          <RoleBadge />
        </div>
        <p className="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-4">
          The Industry Gap
        </p>
        <h2
          id="industry-gap-heading"
          className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-6"
        >
          The Minecraft creator economy runs on intuition.
          <span className="block text-zinc-400 mt-2">Not intelligence.</span>
        </h2>
        <p
          id="industry-gap-body"
          className="text-zinc-300/90 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto"
        >
          Studios chase trends blind. Brands sponsor creators without verified
          audience data. The Minecraft meta shifts overnight — and nobody has a
          single source of truth for what&apos;s actually moving across the{' '}
          <span className="text-sky-400/90">Minecraft ecosystem</span>. The gap
          isn&apos;t creativity. It&apos;s{' '}
          <span className="text-sky-400 font-medium">data transparency</span>.
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
      </div>
    </SectionReveal>
  )
}
