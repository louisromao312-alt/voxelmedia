'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { BarChart2, Users } from 'lucide-react'

const EASE = [0.16, 1, 0.3, 1] as const

const FEATURES = [
  {
    icon: BarChart2,
    side: 'left' as const,
    eyebrow: 'For Creators & Studios',
    title: 'The Creator Engine',
    tagline: 'Spot the trend before it peaks.',
    description:
      'Voxel surfaces momentum signals before they saturate. Know which game categories, aesthetics, and mechanics are gaining traction — weeks before your competition sees the data.',
    bullets: [
      'Real-time trend velocity across Minecraft modpacks and server categories',
      'Early-warning signals with statistical confidence scores',
      'Category breakdowns: aesthetics, mechanics, server types',
      'Competitive benchmark against top 100 creators',
    ],
    accentColor: 'text-green-400' as const,
    dotColor: 'bg-green-400' as const,
    glowColor: 'rgba(74, 222, 128, 0.06)',
  },
  {
    icon: Users,
    side: 'right' as const,
    eyebrow: 'For Brands & Agencies',
    title: 'The Matchmaking Hub',
    tagline: 'Where Brands meet Builders.',
    description:
      'Connect with verified UGC creators whose audiences match your campaign. Skip the spreadsheet hell — Voxel scores creator-brand fit by audience overlap, trend alignment, and past performance.',
    bullets: [
      'Curated creator roster with verified audience data',
      'AI-powered brand-creator fit scoring',
      'Campaign ROI projections before you sign',
      'White-glove onboarding for enterprise brands',
    ],
    accentColor: 'text-blue-400' as const,
    dotColor: 'bg-blue-400' as const,
    glowColor: 'rgba(96, 165, 250, 0.06)',
  },
]

function FeatureBlock({
  icon: Icon,
  side,
  eyebrow,
  title,
  tagline,
  description,
  bullets,
  accentColor,
  dotColor,
  glowColor,
  animate,
  index,
}: (typeof FEATURES)[number] & { animate: boolean; index: number }) {
  const xInitial = side === 'left' ? -40 : 40

  return (
    <motion.div
      initial={{ opacity: 0, x: xInitial }}
      animate={animate ? { opacity: 1, x: 0 } : {}}
      transition={{
        duration: 0.75,
        delay: index * 0.12,
        ease: EASE,
      }}
      className="relative rounded-2xl border border-white/[0.07] bg-white/[0.025] p-8 sm:p-10 overflow-hidden"
      role="article"
      aria-labelledby={`feature-${index}-heading`}
    >
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none rounded-2xl"
        style={{
          background: `radial-gradient(ellipse 80% 60% at ${side === 'left' ? '20%' : '80%'} 30%, ${glowColor}, transparent 70%)`,
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 flex flex-col gap-6">
        {/* Icon */}
        <div
          className={`inline-flex items-center justify-center w-10 h-10 rounded-lg border border-white/10 bg-white/[0.05] ${accentColor}`}
          aria-hidden="true"
        >
          <Icon size={18} />
        </div>

        {/* Text */}
        <div className="flex flex-col gap-2">
          <p className="text-xs font-mono text-zinc-500 uppercase tracking-widest">
            {eyebrow}
          </p>
          <h3
            id={`feature-${index}-heading`}
            className="text-2xl sm:text-3xl font-bold text-white leading-tight"
          >
            {title}
          </h3>
          <p className={`text-base font-medium ${accentColor}`}>{tagline}</p>
        </div>

        <p className="text-zinc-400 text-sm leading-relaxed">{description}</p>

        {/* Bullet list */}
        <ul className="flex flex-col gap-2.5" aria-label={`${title} features`}>
          {bullets.map((b, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-400">
              <span
                className={`mt-0.5 flex-shrink-0 w-1 h-1 rounded-full ${dotColor} mt-2`}
                aria-hidden="true"
              />
              {b}
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  )
}

export default function FeatureSplit() {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  return (
    <section
      ref={ref}
      className="px-4 py-24 max-w-6xl mx-auto"
      aria-labelledby="features-heading"
    >
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.55, ease: EASE }}
        className="text-center mb-12"
      >
        <p className="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-3">
          Platform Capabilities
        </p>
        <h2
          id="features-heading"
          className="text-3xl sm:text-4xl font-bold text-white"
        >
          Two tools. One unfair advantage.
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {FEATURES.map((feature, i) => (
          <FeatureBlock
            key={feature.title}
            {...feature}
            animate={isInView}
            index={i}
          />
        ))}
      </div>
    </section>
  )
}
