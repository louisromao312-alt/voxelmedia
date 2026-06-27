'use client'

import { useRef, useCallback, useEffect, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { TrendingUp, TrendingDown, Lock } from 'lucide-react'

interface TrendCard {
  title: string
  metric: string
  trend: 'Up' | 'Down'
  trailing: string
  points: number[]
}

const CARDS: TrendCard[] = [
  {
    title: 'Realism Packs',
    metric: '+24%',
    trend: 'Up',
    trailing: '2 wk average',
    points: [30, 36, 32, 44, 42, 50, 55, 58, 62, 72, 80, 88],
  },
  {
    title: 'Horror / Backrooms',
    metric: '+18%',
    trend: 'Up',
    trailing: '4 wk average',
    points: [20, 22, 26, 24, 30, 34, 36, 40, 44, 48, 52, 58],
  },
  {
    title: 'Cartoon / Cute',
    metric: '-6%',
    trend: 'Down',
    trailing: '1 wk average',
    points: [80, 78, 75, 70, 68, 64, 62, 58, 56, 52, 48, 44],
  },
]

const EASE = [0.16, 1, 0.3, 1] as const

// Build SVG polyline path from normalised data points
function buildPath(points: number[], w: number, h: number): string {
  const min = Math.min(...points)
  const max = Math.max(...points)
  const range = max - min || 1
  const pad = 4
  return points
    .map((v, i) => {
      const x = (i / (points.length - 1)) * (w - pad * 2) + pad
      const y = h - pad - ((v - min) / range) * (h - pad * 2)
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`
    })
    .join(' ')
}

function Sparkline({
  points,
  up,
  animate: shouldAnimate,
}: {
  points: number[]
  up: boolean
  animate: boolean
}) {
  const W = 120
  const H = 40
  const d = buildPath(points, W, H)
  const color = up ? '#4ade80' : '#f87171'

  return (
    <svg
      width={W}
      height={H}
      viewBox={`0 0 ${W} ${H}`}
      aria-hidden="true"
      className="overflow-visible"
    >
      {/* Glow under line */}
      <defs>
        <linearGradient
          id={`spark-fill-${up ? 'up' : 'dn'}`}
          x1="0"
          y1="0"
          x2="0"
          y2="1"
        >
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Area fill — static, revealed by clip */}
      <motion.path
        d={`${d} L${(120 - 4).toFixed(2)},${H} L4,${H} Z`}
        fill={`url(#spark-fill-${up ? 'up' : 'dn'})`}
        initial={{ opacity: 0 }}
        animate={shouldAnimate ? { opacity: 1 } : {}}
        transition={{ delay: 0.4, duration: 0.6 }}
      />

      {/* Stroke line */}
      <motion.path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={shouldAnimate ? { pathLength: 1, opacity: 1 } : {}}
        transition={{
          pathLength: { duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.1 },
          opacity: { duration: 0.2 },
        }}
      />

      {/* End dot */}
      {(() => {
        const last = points[points.length - 1]
        const min = Math.min(...points)
        const max = Math.max(...points)
        const range = max - min || 1
        const pad = 4
        const cx = 120 - pad
        const cy = H - pad - ((last - min) / range) * (H - pad * 2)
        return (
          <motion.circle
            cx={cx}
            cy={cy}
            r={3}
            fill={color}
            initial={{ scale: 0, opacity: 0 }}
            animate={shouldAnimate ? { scale: 1, opacity: 1 } : {}}
            transition={{ delay: 1.3, duration: 0.3 }}
          />
        )
      })()}
    </svg>
  )
}

function SpotlightCard({
  card,
  index,
  animate,
}: {
  card: TrendCard
  index: number
  animate: boolean
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [isTouch, setIsTouch] = useState(true)
  const up = card.trend === 'Up'
  const metricColor = up ? 'text-green-400' : 'text-red-400'

  useEffect(() => {
    setIsTouch(window.matchMedia('(pointer: coarse)').matches)
  }, [])

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (isTouch || !cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    cardRef.current.style.setProperty('--mouse-x', `${x}%`)
    cardRef.current.style.setProperty('--mouse-y', `${y}%`)
  }, [isTouch])

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={animate ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.65,
        delay: index * 0.12,
        ease: EASE,
      }}
      whileHover={isTouch ? undefined : { scale: 1.02 }}
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        className="spotlight-card rounded-xl p-5 bg-white/[0.03] backdrop-blur-sm cursor-default select-none h-full"
        role="article"
        aria-label={`${card.title}: ${card.metric} — ${card.trailing}`}
      >
        {/* Spotlight border overlay */}
        <div className="spotlight-border rounded-xl" aria-hidden="true" />

        <div className="relative z-10 flex flex-col gap-4">
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-1">
                MINECRAFT TREND
              </p>
              <h3 className="text-white font-semibold text-base leading-tight">
                {card.title}
              </h3>
            </div>
            <span
              className={`${metricColor} font-mono text-xl font-bold tabular-nums mt-0.5`}
              aria-label={`${card.metric} ${up ? 'increase' : 'decrease'}`}
            >
              {card.metric}
            </span>
          </div>

          {/* Sparkline */}
          <div className="flex items-end justify-between gap-4">
            <div className="flex-1">
              <Sparkline points={card.points} up={up} animate={animate} />
              <span className="sr-only">
                Sparkline showing {up ? 'upward' : 'downward'} trend for{' '}
                {card.title}
              </span>
            </div>

            <div className="flex flex-col items-end gap-1 pb-1 shrink-0">
              <span
                className={`inline-flex items-center gap-1 text-xs font-mono ${metricColor}`}
                aria-label={`Trend direction: ${card.trend}`}
              >
                {up ? (
                  <TrendingUp size={12} aria-hidden="true" />
                ) : (
                  <TrendingDown size={12} aria-hidden="true" />
                )}
                {card.trend}
              </span>
              <span className="text-[10px] font-mono text-zinc-600 text-right">
                {card.trailing}
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function scrollToWaitlist() {
  document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' })
}

export default function TrendRadar() {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.25 })

  return (
    <section
      ref={sectionRef}
      className="relative px-4 py-24 max-w-6xl mx-auto"
      aria-labelledby="trend-radar-heading"
    >
      {/* Section label */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.55, ease: EASE }}
        className="mb-10 text-center"
      >
        <p className="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-3">
          Live Market Intelligence
        </p>
        <h2
          id="trend-radar-heading"
          className="text-3xl sm:text-4xl font-bold text-white"
        >
          Trend Radar
        </h2>
        <p className="mt-3 text-zinc-400 max-w-xl mx-auto text-sm sm:text-base">
          Real-time momentum signals across the Minecraft creator economy. Spot
          what&apos;s rising before the crowd.
        </p>
      </motion.div>

      {/* Cards grid */}
      <div className="relative">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {CARDS.map((card, i) => (
            <SpotlightCard
              key={card.title}
              card={card}
              index={i}
              animate={isInView}
            />
          ))}
        </div>

        {/* Blur-overlay teaser */}
        <div
          className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
          style={{
            background:
              'linear-gradient(to top, #0A0A0C 30%, rgba(10,10,12,0.5) 70%, transparent 100%)',
          }}
          aria-hidden="true"
        />
      </div>

      {/* Unlock CTA */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.45, ease: EASE }}
        className="mt-6 flex flex-col items-center gap-3"
      >
        <div
          className="flex items-center gap-1.5 text-zinc-500 text-xs font-mono"
          aria-hidden="true"
        >
          {Array.from({ length: 14 }).map((_, i) => (
            <span key={i} className="w-1 h-1 rounded-full bg-zinc-700" />
          ))}
        </div>

        <button
          onClick={scrollToWaitlist}
          className="group flex items-center gap-2 border border-white/10 hover:border-white/20 rounded-lg px-5 py-3 text-sm font-medium text-zinc-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.07] transition-all duration-200 backdrop-blur-sm cursor-pointer"
          aria-label="Unlock full market data by joining the insider list"
        >
          <Lock
            size={14}
            className="text-zinc-500 group-hover:text-green-400 transition-colors duration-200"
            aria-hidden="true"
          />
          Unlock full market data · Join the insider list
        </button>
      </motion.div>
    </section>
  )
}
