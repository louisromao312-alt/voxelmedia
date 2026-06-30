'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import SectionReveal, { EASE, revealTransition } from '@/components/SectionReveal'
import BriefReportPreview from '@/components/BriefReportPreview'
import { useUserJourney } from '@/context/UserJourneyContext'

function scrollToWaitlist() {
  document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' })
}

export default function FreemiumInsights() {
  const contentRef = useRef<HTMLDivElement>(null)
  const contentInView = useInView(contentRef, { once: false, amount: 0.3 })
  const { role } = useUserJourney()

  const subCopy =
    role === 'creator'
      ? 'Weekly breakdowns of rising modpack categories, viral mechanics, and creator monetization strategies — built for studios shipping fast.'
      : role === 'brand'
        ? 'Weekly intelligence on EULA-safe campaign opportunities, creator fit scoring, and market entry timing for brands entering Minecraft.'
        : "Don't just join a waitlist. Start receiving our weekly breakdowns of platform shifts, viral mechanics, and creator business strategies today. 100% free. Unsubscribe anytime."

  return (
    <SectionReveal
      className="relative px-4 py-24 md:py-32 bg-[#0A0A0C]"
      aria-labelledby="freemium-insights-heading"
    >
      <div className="max-w-6xl mx-auto">
        <div
          ref={contentRef}
          className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 items-center rounded-2xl border border-white/[0.08] bg-white/[0.02] p-8 sm:p-10 overflow-hidden"
        >
          {/* Left — report preview mockup */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -20 }}
            animate={
              contentInView
                ? { opacity: 1, x: 0 }
                : { opacity: 0, x: -20 }
            }
            transition={revealTransition(contentInView, 0, { duration: 0.7 })}
          >
            <BriefReportPreview />
          </motion.div>

          {/* Right — copy */}
          <motion.div
            className="flex flex-col gap-5"
            initial={{ opacity: 0, x: 20 }}
            animate={
              contentInView
                ? { opacity: 1, x: 0 }
                : { opacity: 0, x: 20 }
            }
            transition={revealTransition(contentInView, 0.1, { duration: 0.7 })}
          >
            <p className="text-xs font-mono text-green-400 uppercase tracking-widest">
              Freemium Insights
            </p>
            <h2
              id="freemium-insights-heading"
              className="text-2xl sm:text-3xl md:text-4xl font-bold text-white leading-tight"
            >
              The Voxel Brief.
              <span className="block text-zinc-400 font-normal text-xl sm:text-2xl mt-1">
                Free weekly market intelligence.
              </span>
            </h2>
            <motion.p
              key={role ?? 'default'}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: EASE }}
              className="text-zinc-400 text-sm sm:text-base leading-relaxed"
            >
              {subCopy}
            </motion.p>
            <button
              onClick={scrollToWaitlist}
              className="inline-flex items-center justify-center gap-2 self-start px-6 py-3.5 rounded-lg text-sm font-semibold text-black bg-white hover:bg-zinc-100 transition-colors cursor-pointer"
              aria-label="Subscribe for free — scroll to waitlist form"
            >
              Subscribe for Free
              <ArrowRight size={16} aria-hidden="true" />
            </button>
          </motion.div>
        </div>
      </div>
    </SectionReveal>
  )
}
