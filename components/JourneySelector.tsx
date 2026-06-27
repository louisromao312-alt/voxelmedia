'use client'

import { motion } from 'framer-motion'
import { useUserJourney } from '@/context/UserJourneyContext'
import { EASE } from '@/components/SectionReveal'

const OPTIONS = [
  { id: 'creator' as const, label: 'I am a Creator/Studio' },
  { id: 'brand' as const, label: 'I am a Brand/Agency' },
]

export default function JourneySelector() {
  const { role, setRole } = useUserJourney()

  return (
    <div
      className="relative inline-flex flex-col sm:flex-row gap-2 sm:gap-0 p-1 rounded-xl border border-white/[0.1] bg-white/[0.04] backdrop-blur-sm"
      role="group"
      aria-label="Select your user journey"
    >
      {OPTIONS.map((opt) => {
        const active = role === opt.id
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => setRole(opt.id)}
            aria-pressed={active}
            className={`relative z-10 px-5 py-3 rounded-lg text-xs sm:text-sm font-medium transition-colors duration-300 cursor-pointer whitespace-nowrap ${
              active
                ? 'text-black'
                : 'text-zinc-300 hover:text-white'
            }`}
          >
            {active && (
              <motion.span
                layoutId="journey-switch-pill"
                className="absolute inset-0 rounded-lg bg-white shadow-[0_0_24px_rgba(255,255,255,0.12)]"
                transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                aria-hidden="true"
              />
            )}
            <span className="relative z-10">{opt.label}</span>
          </button>
        )
      })}
    </div>
  )
}

export function RoleBadge() {
  const { role } = useUserJourney()
  if (!role) return null

  const label =
    role === 'creator' ? 'Tailored for Creators' : 'Tailored for Brands'

  return (
    <motion.span
      key={role}
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: EASE }}
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-mono uppercase tracking-widest border ${
        role === 'creator'
          ? 'border-green-400/25 bg-green-400/8 text-green-400'
          : 'border-blue-400/25 bg-blue-400/8 text-blue-400'
      }`}
    >
      <span className="w-1 h-1 rounded-full bg-current animate-pulse" />
      {label}
    </motion.span>
  )
}
