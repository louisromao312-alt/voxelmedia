'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import SectionReveal, { revealTransition } from '@/components/SectionReveal'
import { RoleBadge } from '@/components/JourneySelector'
import { useUserJourney } from '@/context/UserJourneyContext'
import { useCountUp } from '@/components/useCountUp'
import { useBurst } from '@/context/BlockBurstContext'

const METRICS = [
  {
    value: 1,
    suffix: 'M+',
    unit: null,
    label: 'Players Reached',
    sub: 'in native ecosystems',
  },
  {
    value: 35,
    suffix: '+',
    unit: null,
    label: 'Custom Games Delivered',
    sub: 'across the creator economy',
  },
  {
    value: 5,
    suffix: '',
    unit: 'years',
    label: 'Experience',
    sub: 'building in the Minecraft ecosystem',
  },
] as const

const MINECRAFT_PLAYERS = {
  value: 182,
  suffix: 'M+',
  headline: 'Monthly Minecraft Players',
  description:
    '182 million active monthly players, ready to engage with your brand.',
} as const

function MetricCard({
  value,
  suffix,
  unit,
  label,
  sub,
  index,
  inView,
  highlighted,
  role,
  onBurst,
  showCrown = false,
}: (typeof METRICS)[number] & {
  index: number
  inView: boolean
  highlighted: boolean
  role: string | null
  onBurst: (x: number, y: number) => void
  showCrown?: boolean
}) {
  const count = useCountUp(value, inView, 1.6 + index * 0.15)

  return (
    <motion.div
      className={`relative overflow-visible text-center p-6 rounded-xl border transition-all duration-500 cursor-pointer select-none ${
        highlighted
          ? role === 'brand'
            ? 'border-blue-400/30 bg-blue-400/5 shadow-[0_0_30px_rgba(96,165,250,0.08)]'
            : 'border-green-400/30 bg-green-400/5 shadow-[0_0_30px_rgba(74,222,128,0.08)]'
          : 'border-white/[0.07] bg-white/[0.02]'
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={revealTransition(inView, 0.15, {
        duration: 0.6,
        index,
        count: METRICS.length,
        stagger: 0.1,
      })}
      onPointerDown={(e) => onBurst(e.clientX, e.clientY)}
      whileTap={{ scale: 0.95 }}
    >
      {showCrown && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src="/architects-advantage/crown.png"
          alt=""
          draggable={false}
          className="pointer-events-none absolute -left-3 -top-7 z-10 h-auto w-[4.5rem] translate-x-[13px] -translate-y-[20px] -rotate-[5deg] sm:-left-4 sm:-top-8 sm:w-[5.25rem]"
          aria-hidden="true"
        />
      )}
      <p className="flex items-baseline justify-center gap-1.5 whitespace-nowrap text-4xl sm:text-5xl font-bold text-white font-mono tabular-nums leading-none">
        <span>{count}</span>
        {unit && (
          <span className="text-2xl sm:text-3xl font-semibold text-green-400">
            {unit}
          </span>
        )}
        {suffix && <span className="text-green-400">{suffix}</span>}
      </p>
      <p className="mt-2 text-sm font-semibold text-white">{label}</p>
      <p className="mt-1 text-xs text-zinc-500 font-mono">{sub}</p>
    </motion.div>
  )
}

function MinecraftPlayersCallout({
  inView,
  highlighted,
  role,
}: {
  inView: boolean
  highlighted: boolean
  role: string | null
}) {
  const count = useCountUp(MINECRAFT_PLAYERS.value, inView, 2)

  return (
    <motion.div
      className={`text-center p-8 sm:p-10 rounded-xl border transition-all duration-500 ${
        highlighted
          ? role === 'brand'
            ? 'border-blue-400/30 bg-blue-400/5 shadow-[0_0_30px_rgba(96,165,250,0.08)]'
            : 'border-green-400/30 bg-green-400/5 shadow-[0_0_30px_rgba(74,222,128,0.08)]'
          : 'border-white/[0.07] bg-white/[0.02]'
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={revealTransition(inView, 0.45, { duration: 0.6 })}
    >
      <p className="text-5xl sm:text-6xl font-bold text-white font-mono tabular-nums">
        {count}
        <span className="text-green-400">{MINECRAFT_PLAYERS.suffix}</span>
      </p>
      <p className="mt-4 text-base sm:text-lg font-semibold text-white">
        {MINECRAFT_PLAYERS.headline}
      </p>
      <p className="mt-3 text-sm text-zinc-400 max-w-xl mx-auto leading-relaxed">
        {MINECRAFT_PLAYERS.description}
      </p>
    </motion.div>
  )
}

export default function ArchitectsAdvantage() {
  const metricsRef = useRef<HTMLDivElement>(null)
  const calloutRef = useRef<HTMLDivElement>(null)
  const metricsInView = useInView(metricsRef, { once: false, amount: 0.4 })
  const calloutInView = useInView(calloutRef, { once: false, amount: 0.4 })
  const { role } = useUserJourney()
  const { triggerBurst } = useBurst()
  const highlightedIndex = role === 'creator' ? 1 : -1
  const highlightCallout = role === 'brand'

  return (
    <SectionReveal
      className="relative px-4 py-24 md:py-32 bg-[#0A0A0C] overflow-visible"
      aria-labelledby="architects-advantage-heading"
    >
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <div className="flex justify-center mb-3">
            <RoleBadge />
          </div>
          <p className="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-3">
            The Architect&apos;s Advantage
          </p>
          <h2
            id="architects-advantage-heading"
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight"
          >
            Built by builders.
            <span className="block text-zinc-400 mt-1">
              Designed for the industry.
            </span>
          </h2>
          <p className="mt-5 text-zinc-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Voxel isn&apos;t just an analytics dashboard. It&apos;s built on years
            of hands-on experience navigating the creator marketplace, managing
            creators, and understanding player psychology. We build this terminal
            because we&apos;ve been in the trenches ourselves.
          </p>
        </div>

        <div
          ref={metricsRef}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12 overflow-visible"
          role="list"
          aria-label="Industry experience metrics"
        >
          {METRICS.map((metric, i) => (
            <MetricCard
              key={metric.label}
              {...metric}
              index={i}
              inView={metricsInView}
              highlighted={i === highlightedIndex}
              role={role}
              onBurst={triggerBurst}
              showCrown={i === 0}
            />
          ))}
        </div>

        <div ref={calloutRef}>
          <MinecraftPlayersCallout
            inView={calloutInView}
            highlighted={highlightCallout}
            role={role}
          />
        </div>
      </div>
    </SectionReveal>
  )
}
