'use client'

import { useRef, type PointerEvent } from 'react'
import { motion, useInView } from 'framer-motion'
import { Building2, Users, Shield } from 'lucide-react'
import SectionReveal, { revealTransition } from '@/components/SectionReveal'
import { BrandSprite, CreatorSprite, StarSprite } from '@/components/AgencyBridgeSprites'
import { RoleBadge } from '@/components/JourneySelector'
import { useUserJourney } from '@/context/UserJourneyContext'

import { useBurst } from '@/context/BlockBurstContext'

export default function AgencyBridge() {
  const bridgeRef = useRef<HTMLDivElement>(null)
  const bridgeInView = useInView(bridgeRef, { once: false, amount: 0.35 })
  const { role } = useUserJourney()
  const { triggerBurst } = useBurst()

  const brandEmphasis = role === 'brand'
  const creatorEmphasis = role === 'creator'

  const handleCardBurst = (e: PointerEvent<HTMLDivElement>) => {
    triggerBurst(e.clientX, e.clientY)
  }

  return (
    <SectionReveal
      className="relative overflow-visible px-4 py-24 md:py-32 bg-[#0A0A0C]"
      aria-labelledby="agency-bridge-heading"
    >
      <div className="max-w-5xl mx-auto overflow-visible">
        <div className="text-center mb-16">
          <div className="flex flex-col items-center gap-3 mb-3">
            <RoleBadge />
            <span className="inline-flex items-center gap-1.5 border border-green-400/20 bg-green-400/5 rounded-full px-3 py-1 text-[10px] font-mono text-green-400 uppercase tracking-widest">
              <Shield size={11} aria-hidden="true" />
              EULA-Safe Strategy
            </span>
            <p className="text-xs font-mono text-zinc-500 uppercase tracking-widest">
              The Agency Bridge
            </p>
          </div>
          <h2
            id="agency-bridge-heading"
            className="text-3xl sm:text-4xl font-bold text-white"
          >
            Where brands meet builders.
          </h2>
          <p className="mt-3 text-zinc-400 max-w-xl mx-auto text-sm sm:text-base">
            Voxel closes the loop between campaign-ready brands and
            compliance-verified creators — with full data transparency on both
            sides.
          </p>
        </div>

        <div
          ref={bridgeRef}
          className="relative grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-8 md:gap-6 items-stretch overflow-visible"
        >
          {/* Brand */}
          <div className="relative min-h-[260px] overflow-visible md:min-h-[300px]">
            <BrandSprite inView={bridgeInView} />
            <motion.div
            className={`relative z-10 flex min-h-[260px] flex-col items-center justify-center gap-4 rounded-2xl border bg-white/[0.02] p-6 pt-36 sm:p-8 sm:pt-40 md:min-h-[300px] md:items-end md:justify-center md:p-8 md:pt-8 md:pl-[32%] md:text-right text-center transition-all duration-500 cursor-pointer select-none ${
              brandEmphasis
                ? 'border-blue-400/30 bg-blue-400/5 scale-[1.02] shadow-[0_0_40px_rgba(96,165,250,0.08)]'
                : creatorEmphasis
                  ? 'border-white/[0.05] opacity-60'
                  : 'border-white/[0.07]'
            }`}
            initial={{ opacity: 0, x: -32 }}
            animate={bridgeInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -32 }}
            transition={revealTransition(bridgeInView, 0, { duration: 0.7 })}
            onPointerDown={handleCardBurst}
            whileTap={{ scale: 0.97 }}
          >
            <div className="flex items-center justify-center w-14 h-14 rounded-xl border border-white/10 bg-white/[0.04] text-blue-400">
              <Building2 size={24} aria-hidden="true" />
            </div>
            <div className="w-full md:max-w-[68%]">
              <h3 className="text-xl font-bold text-white">Brand</h3>
              <p className="text-sm text-zinc-400 mt-1 leading-relaxed">
                Campaign briefs, audience targeting, and ROI projections —
                backed by verified Minecraft market data.
              </p>
            </div>
          </motion.div>
          </div>

          {/* Center — star + label */}
          <div className="relative z-10 flex flex-col items-center justify-center gap-4 py-4 md:py-0 min-h-[100px] md:min-w-[160px]">
            <StarSprite inView={bridgeInView} />
            <motion.p
              className="font-mono text-[10px] text-green-400 uppercase tracking-widest text-center whitespace-nowrap"
              initial={{ opacity: 0, y: 6 }}
              animate={bridgeInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
              transition={revealTransition(bridgeInView, 0.8, { duration: 0.5 })}
            >
              Voxel Compliant
              <br className="md:hidden" />
              <span className="hidden md:inline"> </span>
              Integration
            </motion.p>
          </div>

          {/* Creator */}
          <div className="relative min-h-[260px] overflow-visible md:min-h-[300px]">
          <CreatorSprite inView={bridgeInView} />
          <motion.div
            className={`relative z-10 flex min-h-[260px] flex-col items-center justify-center gap-4 rounded-2xl border bg-white/[0.02] p-6 pt-36 sm:p-8 sm:pt-40 md:min-h-[300px] md:items-start md:justify-center md:p-8 md:pt-8 md:pr-[32%] md:text-left text-center transition-all duration-500 cursor-pointer select-none ${
              creatorEmphasis
                ? 'border-green-400/30 bg-green-400/5 scale-[1.02] shadow-[0_0_40px_rgba(74,222,128,0.08)]'
                : brandEmphasis
                  ? 'border-white/[0.05] opacity-60'
                  : 'border-white/[0.07]'
            }`}
            initial={{ opacity: 0, x: 32 }}
            animate={bridgeInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 32 }}
            transition={revealTransition(bridgeInView, 0.1, { duration: 0.7 })}
            onPointerDown={handleCardBurst}
            whileTap={{ scale: 0.97 }}
          >
            <div className="flex items-center justify-center w-14 h-14 rounded-xl border border-white/10 bg-white/[0.04] text-green-400">
              <Users size={24} aria-hidden="true" />
            </div>
            <div className="w-full md:max-w-[68%]">
              <h3 className="text-xl font-bold text-white">Creator</h3>
              <p className="text-sm text-zinc-400 mt-1 leading-relaxed">
                Trend signals, compliance badges, and brand-match scoring —
                so you build what the market actually wants.
              </p>
            </div>
          </motion.div>
          </div>
        </div>
      </div>
    </SectionReveal>
  )
}
