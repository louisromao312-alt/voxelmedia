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
      className="w-full max-w-none whitespace-pre-line font-mono text-[clamp(1.75rem,5.5vw,4.75rem)] font-extrabold uppercase leading-[1.05] tracking-[0.03em] text-white [text-shadow:0_0.5px_0_currentColor,0_1px_0_rgba(0,0,0,0.35)] min-h-[2.4em] sm:min-h-[2.5em]"
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
      className="relative min-h-[92vh] w-full overflow-hidden bg-[#0A0A0C] md:min-h-[max(92vh,56.25vw)]"
      aria-labelledby="hero-heading"
    >
      <div
        className="absolute inset-0 flex items-center justify-center"
        aria-hidden="true"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/hero/background.jpg"
          width={2048}
          height={1152}
          alt=""
          fetchPriority="high"
          decoding="sync"
          draggable={false}
          className="h-full w-full object-contain object-center"
        />
      </div>

      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(ellipse 80% 70% at 50% 48%, rgba(10,10,12,0.28) 0%, rgba(10,10,12,0.55) 100%)',
        }}
      />

      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        aria-hidden="true"
        style={{
          background:
            'linear-gradient(to top, rgba(10,10,12,0.62) 0%, transparent 26%, transparent 88%, rgba(10,10,12,0.2) 100%)',
        }}
      />

      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-[min(32vh,280px)]"
        aria-hidden="true"
      >
        <div
          className="absolute inset-0 backdrop-blur-[6px]"
          style={{
            WebkitMaskImage:
              'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.3) 42%, black 100%)',
            maskImage:
              'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.3) 42%, black 100%)',
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to bottom, transparent 0%, rgba(10,10,12,0.45) 48%, rgba(10,10,12,0.9) 78%, #0A0A0C 100%)',
          }}
        />
      </div>

      <div className="relative z-10 flex min-h-[92vh] w-full flex-col items-center justify-center gap-5 md:min-h-[max(92vh,56.25vw)]">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.6, ease: EASE }}
          className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/25 px-3 py-1 text-xs font-mono text-zinc-200"
        >
          <span
            className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-400"
            aria-hidden="true"
          />
          PRIVATE BETA · LIMITED ACCESS
        </motion.div>

        <div className="w-screen max-w-[100vw] px-4 text-center sm:px-6 lg:px-8">
          <ScrambleHeadline
            key={contentKey}
            text={copy.headline}
            startDelay={startDelay}
          />
        </div>

        <div className="flex w-full max-w-6xl flex-col items-center gap-6 px-4 sm:px-6">
          <p className="mx-auto max-w-2xl text-center text-base leading-relaxed text-zinc-100/95 sm:text-lg">
            {copy.sub}
          </p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.6, ease: EASE }}
            className="flex flex-col items-center gap-4"
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
                  className="cursor-pointer text-sm text-zinc-300 underline decoration-zinc-600 underline-offset-4 transition-colors hover:text-white hover:decoration-zinc-300"
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
