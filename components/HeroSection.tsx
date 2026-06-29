'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useUserJourney, HERO_COPY } from '@/context/UserJourneyContext'
import JourneySelector from '@/components/JourneySelector'
import WaitlistSocialProof from '@/components/WaitlistSocialProof'
import { EASE } from '@/components/SectionReveal'

const SCRAMBLE_CHARS = '!<>-_\\/[]{}=+*^?#ABCDEFGHIJKLMNOPQRSTUVWXYZ01'
const SCRAMBLE_FRAMES = 48

function scrambleString(text: string, progress: number): string {
  const cleanLen = text.replace(/\n/g, '').length || 1
  return text
    .split('')
    .map((char, i) => {
      if (char === '\n') return '\n'
      if (char === ' ') return ' '
      const charThreshold = (i / cleanLen) * 0.55
      if (progress - charThreshold >= 0.35) return char
      return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]
    })
    .join('')
}

function useScramble(text: string, startDelay = 0) {
  const [display, setDisplay] = useState(text)
  const rafRef = useRef(0)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    let cancelled = false
    let frame = 0

    const run = () => {
      const tick = () => {
        if (cancelled) return
        frame++
        const progress = frame / SCRAMBLE_FRAMES
        setDisplay(scrambleString(text, progress))
        if (frame < SCRAMBLE_FRAMES) {
          rafRef.current = requestAnimationFrame(tick)
        } else {
          setDisplay(text)
        }
      }
      setDisplay(scrambleString(text, 0))
      rafRef.current = requestAnimationFrame(tick)
    }

    if (startDelay > 0) {
      timerRef.current = setTimeout(run, startDelay)
    } else {
      run()
    }

    return () => {
      cancelled = true
      if (timerRef.current) clearTimeout(timerRef.current)
      cancelAnimationFrame(rafRef.current)
    }
  }, [text, startDelay])

  return display
}

function ScrambleHeadline({
  text,
  startDelay = 0,
}: {
  text: string
  startDelay?: number
}) {
  const scrambled = useScramble(text, startDelay)
  const lines = scrambled.split('\n')
  const targetLines = text.split('\n')

  return (
    <h1
      id="hero-heading"
      className="max-w-3xl whitespace-pre-line font-mono text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl min-h-[1.2em]"
      aria-label={text.replace('\n', ' ')}
    >
      {lines.map((line, li) => (
        <span key={li} className="block">
          {line.split('').map((char, ci) => {
            const targetChar = targetLines[li]?.[ci]
            const isScrambling =
              char !== ' ' && char !== '\n' && char !== targetChar
            return (
              <span
                key={ci}
                className={isScrambling ? 'text-white/45' : 'text-white'}
              >
                {char === ' ' ? '\u00A0' : char}
              </span>
            )
          })}
        </span>
      ))}
    </h1>
  )
}

function scrollToWaitlist() {
  document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' })
}

export default function HeroSection() {
  const { role } = useUserJourney()
  const contentKey = role ?? 'default'
  const copy = HERO_COPY[contentKey]
  const startDelay = contentKey === 'default' ? 400 : 0

  return (
    <section
      id="hero-section"
      className="relative min-h-[92vh] overflow-hidden bg-[#0A0A0C]"
      aria-labelledby="hero-heading"
    >
      <div className="absolute inset-0" aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/hero/background.jpg"
          alt=""
          fetchPriority="high"
          decoding="async"
          draggable={false}
          className="absolute inset-0 h-full w-full object-cover object-center [image-rendering:auto]"
        />
      </div>

      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(ellipse 70% 60% at 50% 48%, rgba(10,10,12,0.55) 0%, rgba(10,10,12,0.88) 100%)',
        }}
      />

      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        aria-hidden="true"
        style={{
          background:
            'linear-gradient(to top, rgba(10,10,12,0.9) 0%, transparent 30%, transparent 70%, rgba(10,10,12,0.4) 100%)',
        }}
      />

      <div className="relative z-10 flex min-h-[92vh] flex-col items-center justify-center px-4 text-center sm:px-6">
        <div className="mx-auto flex w-full max-w-4xl flex-col items-center gap-6">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.6, ease: EASE }}
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/35 px-3 py-1 text-xs font-mono text-zinc-300 backdrop-blur-sm"
          >
            <span
              className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-400"
              aria-hidden="true"
            />
            PRIVATE BETA · LIMITED ACCESS
          </motion.div>

          <div className="flex w-full flex-col items-center gap-5">
            <ScrambleHeadline
              key={contentKey}
              text={copy.headline}
              startDelay={startDelay}
            />

            <p className="mx-auto max-w-2xl text-base leading-relaxed text-zinc-200/90 sm:text-lg">
              {copy.sub}
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.6, ease: EASE }}
            className="mt-1 flex flex-col items-center gap-4"
          >
            <JourneySelector />

            <AnimatePresence>
              {role && (
                <motion.button
                  key="continue"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.4, ease: EASE }}
                  onClick={scrollToWaitlist}
                  className="cursor-pointer text-sm text-zinc-400 underline decoration-zinc-600 underline-offset-4 transition-colors hover:text-white hover:decoration-zinc-300"
                  aria-label="Continue to waitlist signup"
                >
                  Continue to join Voxel →
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>

          <WaitlistSocialProof />
        </div>
      </div>
    </section>
  )
}
