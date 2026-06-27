'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { useCountUp } from '@/components/useCountUp'
import { EASE } from '@/components/SectionReveal'

const WAITLIST_COUNT = 1240

export default function WaitlistSocialProof() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.8 })
  const count = useCountUp(WAITLIST_COUNT, inView, 1.6)

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.1, duration: 0.55, ease: EASE }}
      className="inline-flex items-center"
      role="status"
      aria-live="polite"
      aria-label={`${WAITLIST_COUNT} plus creators and studios on the waitlist`}
    >
      <motion.div
        className="inline-flex items-center gap-3 rounded-full border border-white/[0.09] bg-white/[0.03] px-4 py-2 backdrop-blur-sm"
        animate={{
          boxShadow: [
            '0 0 0 rgba(74, 222, 128, 0)',
            '0 0 24px rgba(74, 222, 128, 0.07)',
            '0 0 0 rgba(74, 222, 128, 0)',
          ],
        }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        {/* Live pulse */}
        <span className="relative flex h-2 w-2 shrink-0" aria-hidden="true">
          <motion.span
            className="absolute inset-0 rounded-full bg-green-400"
            animate={{ scale: [1, 2.2, 1], opacity: [0.55, 0, 0.55] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
          />
          <span className="relative h-2 w-2 rounded-full bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.6)]" />
        </span>

        <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-500">
          Live
        </span>

        <span className="h-3 w-px bg-white/10" aria-hidden="true" />

        <p className="text-xs font-mono leading-none">
          <motion.span
            className="text-white font-semibold tabular-nums"
            key={count}
            initial={{ opacity: 0.6 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.15 }}
          >
            {count.toLocaleString('en-US')}+
          </motion.span>
          <span className="text-zinc-500"> creators &amp; studios on the waitlist</span>
        </p>
      </motion.div>
    </motion.div>
  )
}
