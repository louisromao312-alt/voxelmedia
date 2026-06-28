'use client'

import { motion } from 'framer-motion'
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

type InsightPanel = {
  headline: string
  body: string
  sparkline: string
  stats: { label: string; value: string }[]
  rows: { label: string; value: string; trend?: 'up' | 'down' | 'flat' }[]
  insight: string
}

export const METRIC_INSIGHTS: Record<string, InsightPanel> = {
  'Trend Velocity': {
    headline: 'Early momentum detection',
    body: 'Category velocity indexed 48h before mainstream dashboards — Realism packs leading at 4.2× average.',
    sparkline: 'M2,26 L12,22 L22,23 L32,16 L42,18 L52,11 L62,13 L72,7 L82,9',
    stats: [
      { label: 'Top mover', value: 'Realism +24%' },
      { label: 'Detection lag', value: '48h vs 14d' },
      { label: 'Signals / hr', value: '847' },
    ],
    rows: [
      { label: 'Realism Packs', value: '+24%', trend: 'up' },
      { label: 'Horror / Backrooms', value: '+18%', trend: 'up' },
      { label: 'Skyblock Economy', value: '+12%', trend: 'up' },
      { label: 'Hardcore Survival', value: '+9%', trend: 'up' },
      { label: 'Cartoon / Cute', value: '-6%', trend: 'down' },
    ],
    insight:
      'Velocity spikes in Realism and Horror verticals 2 weeks before CurseForge trending — optimal window for creator pivots.',
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
    rows: [
      { label: 'Sponsored content', value: '100% cleared', trend: 'flat' },
      { label: 'Mod distribution', value: '98.1% cleared', trend: 'up' },
      { label: 'Server monetization', value: '97.6% cleared', trend: 'up' },
      { label: 'Creator partnerships', value: '99.2% cleared', trend: 'up' },
      { label: 'Asset licensing', value: '96.8% cleared', trend: 'flat' },
    ],
    insight:
      'Brand briefs auto-reject non-compliant creator segments before outreach — no manual legal review on 94% of campaigns.',
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
    rows: [
      { label: 'Modpack creators', value: '4.2K active', trend: 'up' },
      { label: 'Server operators', value: '2.8K active', trend: 'up' },
      { label: 'YouTube / Twitch', value: '3.1K active', trend: 'up' },
      { label: 'Build teams', value: '1.4K active', trend: 'flat' },
      { label: 'Plugin devs', value: '890 active', trend: 'up' },
    ],
    insight:
      'Network graph surfaces creators with overlapping audiences but different verticals — ideal for cross-promo without saturation.',
  },
}

const CARD_H = 152
export const TABLE_PANEL_H = 292

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
    <svg viewBox="0 0 84 32" className="h-full w-full" aria-hidden="true">
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
  hovered,
}: {
  chart: ChartConfig
  accent?: boolean
  hovered?: boolean
}) {
  const Icon = chart.icon
  return (
    <>
      <div className="flex items-center gap-2 mb-1">
        <Icon
          size={14}
          className={accent || hovered ? '' : 'text-zinc-500'}
          style={accent || hovered ? { color: chart.color } : undefined}
          aria-hidden="true"
        />
        <span
          className="font-mono text-[10px] uppercase tracking-widest"
          style={{ color: accent || hovered ? chart.color : '#71717a' }}
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

function MetricCard({
  chart,
  index,
  inView,
  highlighted,
  role,
  dimmed,
  hovered,
  onEnter,
  onLeave,
}: {
  chart: ChartConfig
  index: number
  inView: boolean
  highlighted: boolean
  role: string | null
  dimmed: boolean
  hovered: boolean
  onEnter: () => void
  onLeave: () => void
}) {
  return (
    <motion.div
      className={`w-full p-5 text-left bg-[#0A0A0C] cursor-default transition-shadow duration-200 ${
        highlighted
          ? role === 'brand'
            ? 'ring-1 ring-inset ring-blue-400/25 bg-blue-400/[0.03]'
            : 'ring-1 ring-inset ring-green-400/25 bg-green-400/[0.03]'
          : hovered
            ? 'ring-1 ring-inset'
            : 'ring-1 ring-inset ring-transparent'
      }`}
      style={{
        height: CARD_H,
        ...(hovered && !highlighted
          ? {
              boxShadow: `inset 0 0 0 1px ${chart.color}40`,
              backgroundColor: `${chart.color}08`,
            }
          : {}),
      }}
      initial={{ opacity: 0, y: 12 }}
      animate={{
        opacity: dimmed ? 0.35 : inView ? 1 : 0,
        y: inView ? 0 : 12,
      }}
      transition={{
        opacity: { duration: 0.35, ease: EASE },
        y: { duration: 0.5, delay: 0.35 + index * 0.08, ease: EASE },
      }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      role="group"
      aria-label={`${chart.label} — ${chart.metric}`}
    >
      <MetricCardContent chart={chart} hovered={hovered} accent={hovered} />
    </motion.div>
  )
}

export function MetricInsightPanel({
  chart,
  index,
}: {
  chart: ChartConfig
  index: number
}) {
  const detail = METRIC_INSIGHTS[chart.label]
  if (!detail) return null

  const sparkId = `metric-insight-spark-${index}`

  return (
    <motion.div
      className="flex h-full flex-col font-mono text-xs"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.22, ease: EASE }}
    >
      <div
        className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3"
        style={{ backgroundColor: `${chart.color}06` }}
      >
        <div>
          <p
            className="text-[9px] uppercase tracking-widest"
            style={{ color: chart.color }}
          >
            {chart.label} · deep read
          </p>
          <p className="mt-0.5 text-sm font-semibold text-white">
            {detail.headline}
          </p>
        </div>
        <div className="hidden sm:flex gap-4">
          {detail.stats.map((stat) => (
            <div key={stat.label} className="text-right">
              <p className="text-[8px] text-zinc-500">{stat.label}</p>
              <p
                className="text-[11px] font-semibold tabular-nums"
                style={{ color: chart.color }}
              >
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid flex-1 grid-cols-1 sm:grid-cols-[1.1fr_1fr] gap-0 min-h-0">
        <div className="border-b sm:border-b-0 sm:border-r border-white/[0.06] p-4 flex flex-col">
          <p className="text-[11px] leading-relaxed text-zinc-400">
            {detail.body}
          </p>
          <div className="mt-3 flex-1 min-h-[72px] rounded-md border border-white/[0.06] bg-white/[0.02] p-2.5">
            <DetailSparkline
              path={detail.sparkline}
              color={chart.color}
              id={sparkId}
            />
          </div>
          <p className="mt-3 text-[10px] leading-relaxed text-zinc-500 border-l-2 pl-2.5"
            style={{ borderColor: `${chart.color}55` }}
          >
            {detail.insight}
          </p>
        </div>

        <div className="p-4">
          <p className="mb-2 text-[9px] uppercase tracking-wider text-zinc-500">
            {chart.label === 'Trend Velocity'
              ? 'Category breakdown'
              : chart.label === 'Brand Compliance'
                ? 'Compliance by channel'
                : 'Network segments'}
          </p>
          <div className="space-y-0">
            {detail.rows.map((row, i) => (
              <motion.div
                key={row.label}
                className="flex items-center justify-between border-b border-white/[0.04] py-2.5 last:border-0"
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.04 + i * 0.05, duration: 0.25, ease: EASE }}
              >
                <span className="text-zinc-300">{row.label}</span>
                <span
                  className={`font-semibold tabular-nums ${
                    row.trend === 'up'
                      ? 'text-green-400'
                      : row.trend === 'down'
                        ? 'text-red-400'
                        : 'text-zinc-400'
                  }`}
                >
                  {row.value}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function TerminalMetricsStrip({
  charts,
  inView,
  highlightedChart,
  role,
  hoveredIndex,
  onHoverChange,
}: {
  charts: ChartConfig[]
  inView: boolean
  highlightedChart: number
  role: string | null
  hoveredIndex: number | null
  onHoverChange: (index: number | null) => void
}) {
  return (
    <div className="relative border-t border-white/[0.06]">
      <div
        className="relative grid grid-cols-1 sm:grid-cols-3 gap-px bg-white/[0.06]"
        style={{ minHeight: CARD_H }}
      >
        {charts.map((chart, i) => (
          <div key={chart.label} className="bg-[#0A0A0C]" style={{ height: CARD_H }}>
            <MetricCard
              chart={chart}
              index={i}
              inView={inView}
              highlighted={i === highlightedChart}
              role={role}
              dimmed={hoveredIndex !== null && hoveredIndex !== i}
              hovered={hoveredIndex === i}
              onEnter={() => onHoverChange(i)}
              onLeave={() => onHoverChange(null)}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
