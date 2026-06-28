'use client'

import { useState } from 'react'
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

function CollapsedCard({
  chart,
  index,
  inView,
  highlighted,
  role,
  dimmed,
  onEnter,
}: {
  chart: ChartConfig
  index: number
  inView: boolean
  highlighted: boolean
  role: string | null
  dimmed: boolean
  onEnter: () => void
}) {
  const Icon = chart.icon

  return (
    <motion.button
      type="button"
      className={`w-full h-full min-h-[152px] p-5 text-left bg-[#0A0A0C] outline-none transition-colors ${
        highlighted
          ? role === 'brand'
            ? 'ring-1 ring-inset ring-blue-400/25 bg-blue-400/[0.03]'
            : 'ring-1 ring-inset ring-green-400/25 bg-green-400/[0.03]'
          : 'ring-1 ring-inset ring-transparent hover:ring-white/10'
      }`}
      initial={{ opacity: 0, y: 12 }}
      animate={{
        opacity: dimmed ? 0.25 : inView ? 1 : 0,
        y: inView ? 0 : 12,
      }}
      transition={{
        opacity: { duration: 0.35, ease: EASE },
        y: { duration: 0.5, delay: 0.35 + index * 0.08, ease: EASE },
      }}
      onMouseEnter={onEnter}
      onFocus={onEnter}
      aria-label={`${chart.label} — ${chart.metric}`}
    >
      <div className="flex items-center gap-2 mb-1">
        <Icon size={14} className="text-zinc-500" aria-hidden="true" />
        <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">
          {chart.label}
        </span>
      </div>
      <p className="text-2xl font-bold text-white font-mono tabular-nums">
        {chart.metric}
      </p>
      <p className="text-[10px] text-zinc-600 font-mono">{chart.sub}</p>
      <MiniBarChart bars={chart.bars} color={chart.color} show={inView} />
    </motion.button>
  )
}

function ExpandedCard({
  chart,
  index,
}: {
  chart: ChartConfig
  index: number
}) {
  const Icon = chart.icon
  const detail = CHART_DETAILS[chart.label]
  const sparkId = `metric-spark-expanded-${index}`

  return (
    <motion.div
      className="mx-0 overflow-hidden border border-white/[0.1] bg-[#0A0A0C] shadow-[0_28px_64px_rgba(0,0,0,0.55)]"
      style={{ borderColor: `${chart.color}35` }}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.38, ease: EASE }}
    >
      <div className="flex flex-col sm:flex-row">
        <div className="shrink-0 border-b sm:border-b-0 sm:border-r border-white/[0.07] p-5 sm:w-[38%] sm:min-w-[200px]">
          <div className="flex items-center gap-2 mb-1">
            <Icon size={14} style={{ color: chart.color }} aria-hidden="true" />
            <span
              className="font-mono text-[10px] uppercase tracking-widest"
              style={{ color: chart.color }}
            >
              {chart.label}
            </span>
          </div>
          <p className="text-2xl font-bold text-white font-mono tabular-nums">
            {chart.metric}
          </p>
          <p className="text-[10px] text-zinc-600 font-mono">{chart.sub}</p>
          <MiniBarChart bars={chart.bars} color={chart.color} show />
        </div>

        {detail && (
          <motion.div
            className="flex-1 p-5"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.38, delay: 0.06, ease: EASE }}
          >
            <p
              className="font-mono text-[9px] uppercase tracking-widest mb-2"
              style={{ color: chart.color }}
            >
              {chart.label} · deep read
            </p>
            <p className="text-sm font-semibold text-white leading-snug">
              {detail.headline}
            </p>
            <p className="mt-1.5 text-[11px] leading-relaxed text-zinc-400">
              {detail.body}
            </p>
            <div className="mt-3 rounded-md border border-white/[0.06] bg-white/[0.02] p-2.5">
              <DetailSparkline path={detail.sparkline} color={chart.color} id={sparkId} />
            </div>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2">
              {detail.stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-md border border-white/[0.05] bg-white/[0.02] px-2.5 py-2"
                >
                  <p className="text-[9px] text-zinc-500">{stat.label}</p>
                  <p
                    className="mt-0.5 font-mono text-[11px] font-semibold tabular-nums"
                    style={{ color: chart.color }}
                  >
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
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
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)

  const open = (index: number) => {
    setExpandedIndex(index)
    onExpandChange(true)
  }

  const close = () => {
    setExpandedIndex(null)
    onExpandChange(false)
  }

  return (
    <div
      className="relative border-t border-white/[0.06]"
      onMouseLeave={(e) => {
        const next = e.relatedTarget
        if (!next || !e.currentTarget.contains(next as Node)) close()
      }}
    >
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-white/[0.06]">
        {charts.map((chart, i) => (
          <div key={chart.label} className="relative min-h-[152px] bg-[#0A0A0C]">
            <CollapsedCard
              chart={chart}
              index={i}
              inView={inView}
              highlighted={i === highlightedChart}
              role={role}
              dimmed={expandedIndex !== null && expandedIndex !== i}
              onEnter={() => open(i)}
            />
          </div>
        ))}
      </div>

      <AnimatePresence>
        {expandedIndex !== null && (
          <motion.div
            key={expandedIndex}
            className="absolute left-0 right-0 z-40 px-0"
            style={{ bottom: 'calc(100% - 2px)' }}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 12, opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
          >
            <ExpandedCard
              chart={charts[expandedIndex]}
              index={expandedIndex}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
