'use client'

import { useCallback, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import { EASE } from '@/components/SectionReveal'

export type ChartConfig = {
  icon: LucideIcon
  label: string
  metric: string
  sub: string
  bars: number[]
  color: string
}

type ChartDetail = {
  headline: string
  body: string
  sparkline: string
  stats: { label: string; value: string }[]
}

type ExpandStage = 'idle' | 'slideLeft' | 'slideUp' | 'expandRight' | 'closing'

const CHART_DETAILS: Record<string, ChartDetail> = {
  'Trend Velocity': {
    headline: 'Early momentum detection',
    body: 'Category velocity indexed 48h before mainstream dashboards — Realism packs leading at 4.2× average.',
    sparkline: 'M2,26 L12,22 L22,23 L32,16 L42,18 L52,11 L62,13 L72,7 L82,9',
    stats: [
      { label: 'Top mover', value: 'Realism +24%' },
      { label: 'Detection lag', value: '48h vs 14d' },
      { label: 'Signals / hr', value: '847' },
    ],
  },
  'Brand Compliance': {
    headline: 'EULA-safe campaign layer',
    body: 'Every creator in the mesh scored against Mojang policy risk before brief delivery — zero shadow audiences.',
    sparkline: 'M2,24 L14,22 L26,20 L38,18 L50,14 L62,11 L74,8 L86,6',
    stats: [
      { label: 'Risk flagged', value: '0 campaigns' },
      { label: 'Verified rate', value: '98.4%' },
      { label: 'Policy scans', value: '2.1K / wk' },
    ],
  },
  'Creator Network': {
    headline: 'Verified builder mesh',
    body: 'Cross-validated audience graphs across modpack, server, and content verticals — no inflated reach.',
    sparkline: 'M2,28 L16,24 L28,22 L40,18 L52,16 L64,12 L76,10 L88,8',
    stats: [
      { label: 'Active builders', value: '12.4K' },
      { label: 'New connections', value: '+847 / wk' },
      { label: 'Verticals mapped', value: '6' },
    ],
  },
}

const CARD_H = 152
const STAGE_MS = 340

function MiniBarChart({
  bars,
  color,
  show,
}: {
  bars: number[]
  color: string
  show: boolean
}) {
  return (
    <div className="flex items-end gap-1 h-14 mt-3" aria-hidden="true">
      {bars.map((h, i) => (
        <motion.div
          key={i}
          className="flex-1 rounded-sm"
          style={{ backgroundColor: color, opacity: 0.85 }}
          initial={{ height: 0 }}
          animate={show ? { height: `${h}%` } : { height: 0 }}
          transition={{ duration: 0.45, delay: 0.1 + i * 0.05, ease: EASE }}
        />
      ))}
    </div>
  )
}

function DetailSparkline({
  path,
  color,
  id,
}: {
  path: string
  color: string
  id: string
}) {
  return (
    <svg viewBox="0 0 84 32" className="h-9 w-full" aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.28" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${path} L82,32 L2,32 Z`} fill={`url(#${id})`} />
      <path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

function MetricCardContent({
  chart,
  accent,
}: {
  chart: ChartConfig
  accent?: boolean
}) {
  const Icon = chart.icon
  return (
    <>
      <div className="flex items-center gap-2 mb-1">
        <Icon
          size={14}
          className={accent ? '' : 'text-zinc-500'}
          style={accent ? { color: chart.color } : undefined}
          aria-hidden="true"
        />
        <span
          className="font-mono text-[10px] uppercase tracking-widest"
          style={{ color: accent ? chart.color : '#71717a' }}
        >
          {chart.label}
        </span>
      </div>
      <p className="text-2xl font-bold text-white font-mono tabular-nums">
        {chart.metric}
      </p>
      <p className="text-[10px] text-zinc-600 font-mono">{chart.sub}</p>
      <MiniBarChart bars={chart.bars} color={chart.color} show />
    </>
  )
}

function CollapsedCard({
  chart,
  index,
  inView,
  highlighted,
  role,
  dimmed,
  active,
  onClick,
}: {
  chart: ChartConfig
  index: number
  inView: boolean
  highlighted: boolean
  role: string | null
  dimmed: boolean
  active: boolean
  onClick: () => void
}) {
  return (
    <motion.button
      type="button"
      className={`w-full p-5 text-left bg-[#0A0A0C] outline-none ${
        highlighted
          ? role === 'brand'
            ? 'ring-1 ring-inset ring-blue-400/25 bg-blue-400/[0.03]'
            : 'ring-1 ring-inset ring-green-400/25 bg-green-400/[0.03]'
          : active
            ? 'ring-1 ring-inset ring-white/20'
            : 'ring-1 ring-inset ring-transparent hover:ring-white/10'
      }`}
      style={{ height: CARD_H }}
      initial={{ opacity: 0, y: 12 }}
      animate={{
        opacity: dimmed ? 0.22 : inView ? 1 : 0,
        y: inView ? 0 : 12,
      }}
      transition={{
        opacity: { duration: 0.35, ease: EASE },
        y: { duration: 0.5, delay: 0.35 + index * 0.08, ease: EASE },
      }}
      onClick={onClick}
      aria-expanded={active}
      aria-label={`${chart.label} — ${chart.metric}. Click to expand.`}
    >
      <MetricCardContent chart={chart} accent={active} />
    </motion.button>
  )
}

function ExpandedModule({
  chart,
  index,
  count,
  stage,
}: {
  chart: ChartConfig
  index: number
  count: number
  stage: ExpandStage
}) {
  const detail = CHART_DETAILS[chart.label]
  const sparkId = `metric-spark-expanded-${index}`
  const colW = 100 / count
  const startLeft = index * colW

  const showDetail = stage === 'expandRight'
  const moduleLeft = stage === 'idle' || stage === 'closing' ? startLeft : 0
  const moduleWidth = stage === 'expandRight' ? 100 : colW
  const moduleY =
    stage === 'slideUp' || stage === 'expandRight'
      ? -92
      : stage === 'closing'
        ? 0
        : 0

  return (
    <motion.div
      className="absolute z-40 overflow-hidden border bg-[#0A0A0C] shadow-[0_24px_56px_rgba(0,0,0,0.55)]"
      style={{
        borderColor: `${chart.color}35`,
        height: CARD_H,
        bottom: 0,
      }}
      initial={{
        left: `${startLeft}%`,
        width: `${colW}%`,
        y: 0,
        opacity: 0,
      }}
      animate={{
        left: `${moduleLeft}%`,
        width: `${moduleWidth}%`,
        y: moduleY,
        opacity: stage === 'closing' ? 0 : 1,
      }}
      exit={{
        left: `${startLeft}%`,
        width: `${colW}%`,
        y: 0,
        opacity: 0,
      }}
      transition={{ duration: STAGE_MS / 1000, ease: EASE }}
    >
      <div className="flex h-full">
        <div
          className="shrink-0 p-5 border-r border-white/[0.07]"
          style={{ width: showDetail ? '36%' : '100%', minWidth: 200 }}
        >
          <MetricCardContent chart={chart} accent />
        </div>

        <motion.div
          className="overflow-hidden h-full"
          initial={false}
          animate={{
            width: showDetail ? '64%' : 0,
            opacity: showDetail ? 1 : 0,
          }}
          transition={{ duration: STAGE_MS / 1000, ease: EASE }}
        >
          {detail && (
            <div className="h-full overflow-y-auto p-5">
              <p
                className="font-mono text-[9px] uppercase tracking-widest mb-2"
                style={{ color: chart.color }}
              >
                {chart.label} · deep read
              </p>
              <p className="text-sm font-semibold text-white leading-snug">
                {detail.headline}
              </p>
              <p className="mt-1.5 text-[11px] leading-relaxed text-zinc-400 line-clamp-3">
                {detail.body}
              </p>
              <div className="mt-3 rounded-md border border-white/[0.06] bg-white/[0.02] p-2.5">
                <DetailSparkline
                  path={detail.sparkline}
                  color={chart.color}
                  id={sparkId}
                />
              </div>
              <div className="mt-3 grid grid-cols-3 gap-1.5">
                {detail.stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-md border border-white/[0.05] bg-white/[0.02] px-2 py-1.5"
                  >
                    <p className="text-[8px] text-zinc-500 leading-tight">
                      {stat.label}
                    </p>
                    <p
                      className="mt-0.5 font-mono text-[10px] font-semibold tabular-nums"
                      style={{ color: chart.color }}
                    >
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  )
}

export default function TerminalMetricsStrip({
  charts,
  inView,
  highlightedChart,
  role,
  onExpandChange,
}: {
  charts: ChartConfig[]
  inView: boolean
  highlightedChart: number
  role: string | null
  onExpandChange: (expanded: boolean) => void
}) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [stage, setStage] = useState<ExpandStage>('idle')

  const close = useCallback(() => {
    setStage('closing')
    onExpandChange(false)
  }, [onExpandChange])

  const toggle = (index: number) => {
    if (activeIndex === index && stage === 'expandRight') {
      close()
      return
    }
    setActiveIndex(index)
    setStage('slideLeft')
    onExpandChange(true)
  }

  useEffect(() => {
    if (stage === 'slideLeft') {
      const t = window.setTimeout(() => setStage('slideUp'), STAGE_MS)
      return () => window.clearTimeout(t)
    }
    if (stage === 'slideUp') {
      const t = window.setTimeout(() => setStage('expandRight'), STAGE_MS)
      return () => window.clearTimeout(t)
    }
    if (stage === 'closing') {
      const t = window.setTimeout(() => {
        setActiveIndex(null)
        setStage('idle')
      }, STAGE_MS)
      return () => window.clearTimeout(t)
    }
  }, [stage])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && activeIndex !== null) close()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [activeIndex, close])

  return (
    <div className="relative border-t border-white/[0.06]">
      <div
        className="relative grid grid-cols-1 sm:grid-cols-3 gap-px bg-white/[0.06]"
        style={{ minHeight: CARD_H }}
      >
        {charts.map((chart, i) => (
          <div
            key={chart.label}
            className="bg-[#0A0A0C]"
            style={{ height: CARD_H }}
          >
            {activeIndex === i &&
            (stage === 'slideLeft' ||
              stage === 'slideUp' ||
              stage === 'expandRight') ? (
              <div style={{ height: CARD_H }} aria-hidden="true" />
            ) : (
              <CollapsedCard
                chart={chart}
                index={i}
                inView={inView}
                highlighted={i === highlightedChart}
                role={role}
                dimmed={activeIndex !== null && activeIndex !== i}
                active={activeIndex === i && stage === 'expandRight'}
                onClick={() => toggle(i)}
              />
            )}
          </div>
        ))}

        <AnimatePresence>
          {activeIndex !== null && stage !== 'idle' && (
            <ExpandedModule
              key={activeIndex}
              chart={charts[activeIndex]}
              index={activeIndex}
              count={charts.length}
              stage={stage}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
