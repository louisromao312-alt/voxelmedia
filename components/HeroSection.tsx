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

function ScrambleHeadline({ text, startDelay = 0 }: { text: string; startDelay?: number }) {
  const scrambled = useScramble(text, startDelay)
  const lines = scrambled.split('\n')
  const targetLines = text.split('\n')

  return (
    <h1
      id="hero-heading"
      className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.12] text-white whitespace-pre-line font-mono min-h-[2.4em] sm:min-h-[2.5em]"
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

function VoxelGeometry({ mouseX, mouseY }: { mouseX: number; mouseY: number }) {
  const cx = typeof window !== 'undefined' ? window.innerWidth / 2 : 0
  const cy = typeof window !== 'undefined' ? window.innerHeight / 2 : 0
  const dx = (mouseX - cx) / (cx || 1)
  const dy = (mouseY - cy) / (cy || 1)

  const LAYERS = [
    { size: 340, opacity: 0.1, depth: 1.0 },
    { size: 240, opacity: 0.14, depth: 1.6 },
    { size: 160, opacity: 0.18, depth: 2.4 },
    { size: 90, opacity: 0.22, depth: 3.2 },
  ]

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      {LAYERS.map((layer, i) => (
        <motion.div
          key={i}
          className="absolute"
          animate={{
            x: dx * layer.depth * 12,
            y: dy * layer.depth * 12,
            rotateX: -dy * layer.depth * 5,
            rotateY: dx * layer.depth * 5,
          }}
          transition={{ type: 'spring', stiffness: 40, damping: 18, mass: 1 }}
          style={{ perspective: 900 }}
        >
          <div
            style={{
              width: layer.size,
              height: layer.size,
              border: `1px solid rgba(255,255,255,${layer.opacity})`,
              transform: 'rotate(45deg)',
              boxShadow: `0 0 20px rgba(255,255,255,${layer.opacity * 0.5})`,
            }}
          />
        </motion.div>
      ))}
    </div>
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

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [isMobile, setIsMobile] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setIsMobile(window.matchMedia('(pointer: coarse)').matches)
    setMousePos({
      x: typeof window !== 'undefined' ? window.innerWidth / 2 : 0,
      y: typeof window !== 'undefined' ? window.innerHeight / 2 : 0,
    })
  }, [])

  useEffect(() => {
    if (isMobile) return
    const handle = (e: MouseEvent) =>
      setMousePos({ x: e.clientX, y: e.clientY })
    window.addEventListener('mousemove', handle, { passive: true })
    return () => window.removeEventListener('mousemove', handle)
  }, [isMobile])

  return (
    <section
      className="relative min-h-[88vh] flex flex-col items-center justify-center px-4 text-center overflow-hidden bg-[#0A0A0C]"
      aria-labelledby="hero-heading"
    >
      {mounted && <VoxelGeometry mouseX={mousePos.x} mouseY={mousePos.y} />}

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(10,10,12,0.0) 0%, rgba(10,10,12,0.85) 100%)',
        }}
      />

      <div className="relative z-10 flex flex-col items-center gap-6 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.6, ease: EASE }}
          className="inline-flex items-center gap-2 border border-white/10 rounded-full px-3 py-1 text-xs font-mono text-zinc-400 bg-white/[0.04] backdrop-blur-sm"
        >
          <span
            className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"
            aria-hidden="true"
          />
          PRIVATE BETA · LIMITED ACCESS
        </motion.div>

        {/* Headline + sub — no fade wrapper, scramble only */}
        <div className="flex flex-col items-center gap-5 w-full">
          <ScrambleHeadline
            key={contentKey}
            text={copy.headline}
            startDelay={startDelay}
          />

          <p className="max-w-2xl text-base sm:text-lg text-zinc-400 leading-relaxed font-sans">
            {copy.sub}
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6, ease: EASE }}
          className="flex flex-col items-center gap-4 mt-2"
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
                className="text-sm text-zinc-500 hover:text-white transition-colors underline underline-offset-4 decoration-zinc-700 hover:decoration-zinc-400 cursor-pointer"
                aria-label="Continue to waitlist signup"
              >
                Continue to join Voxel →
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>

        <WaitlistSocialProof />
      </div>
    </section>
  )
}
