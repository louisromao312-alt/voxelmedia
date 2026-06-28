'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import { EASE } from '@/components/SectionReveal'

type ChartConfig = {
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
  animate,
}: {
  bars: number[]
  color: string
  animate: boolean
}) {
  return (
    <div className="flex items-end gap-1 h-16 mt-4" aria-hidden="true">
      {bars.map((h, i) => (
        <motion.div
          key={i}
          className="flex-1 rounded-sm"
          style={{ backgroundColor: color, opacity: 0.85 }}
          initial={{ height: 0 }}
          animate={animate ? { height: `${h}%` } : { height: 0 }}
          transition={{ duration: 0.5, delay: 0.15 + i * 0.06, ease: EASE }}
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

export default function TerminalMetricCard({
  chart,
  index,
  inView,
  highlighted,
  role,
  isLast,
}: {
  chart: ChartConfig
  index: number
  inView: boolean
  highlighted: boolean
  role: string | null
  isLast: boolean
}) {
  const [hovered, setHovered] = useState(false)
  const Icon = chart.icon
  const detail = CHART_DETAILS[chart.label]
  const sparkId = `metric-spark-${index}`

  const ringClass = highlighted
    ? role === 'brand'
      ? 'ring-blue-400/30'
      : 'ring-green-400/30'
    : hovered
      ? 'ring-white/15'
      : 'ring-transparent'

  return (
    <div
      className="relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setHovered(false)
      }}
    >
      <motion.div
        tabIndex={0}
        role="button"
        aria-expanded={hovered}
        aria-label={`${chart.label} — ${chart.metric}. Hover for details.`}
        className={`relative z-10 bg-[#0A0A0C] p-5 outline-none cursor-default ring-1 ring-inset transition-shadow duration-300 ${ringClass} ${
          highlighted
            ? role === 'brand'
              ? 'bg-blue-400/[0.03]'
              : 'bg-green-400/[0.03]'
            : ''
        }`}
        initial={{ opacity: 0, y: 12 }}
        animate={{
          opacity: inView ? 1 : 0,
          y: inView ? (hovered ? -18 : 0) : 12,
          boxShadow: hovered
            ? `0 24px 48px rgba(0,0,0,0.45), 0 0 0 1px ${chart.color}22`
            : '0 0 0 rgba(0,0,0,0)',
        }}
        transition={{
          opacity: { duration: 0.5, delay: 0.35 + index * 0.1, ease: EASE },
          y: { duration: 0.42, ease: EASE },
          boxShadow: { duration: 0.35, ease: EASE },
        }}
      >
        <div className="flex items-center gap-2 mb-1">
          <Icon
            size={14}
            style={{ color: hovered ? chart.color : undefined }}
            className={hovered ? '' : 'text-zinc-500'}
            aria-hidden="true"
          />
          <span
            className="font-mono text-[10px] uppercase tracking-widest transition-colors duration-300"
            style={{ color: hovered ? chart.color : '#71717a' }}
          >
            {chart.label}
          </span>
        </div>
        <p className="text-2xl font-bold text-white font-mono tabular-nums">
          {chart.metric}
        </p>
        <p className="text-[10px] text-zinc-600 font-mono">{chart.sub}</p>
        <MiniBarChart bars={chart.bars} color={chart.color} animate={inView} />
      </motion.div>

      <AnimatePresence>
        {hovered && detail && (
          <motion.div
            key="detail"
            initial={{ opacity: 0, x: isLast ? 16 : -16, scale: 0.97 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: isLast ? 12 : -12, scale: 0.98 }}
            transition={{ duration: 0.38, ease: EASE }}
            className={`absolute z-30 w-[min(260px,72vw)] sm:w-[240px] ${
              isLast ? 'right-full mr-2 sm:mr-3' : 'left-full ml-2 sm:ml-3'
            }`}
            style={{ top: -18 }}
            aria-hidden="true"
          >
            <div
              className="overflow-hidden rounded-lg border bg-[#0c0c0f]/98 backdrop-blur-md shadow-[0_20px_60px_rgba(0,0,0,0.55)]"
              style={{ borderColor: `${chart.color}33` }}
            >
              <div
                className="border-b px-4 py-2.5"
                style={{
                  borderColor: `${chart.color}22`,
                  background: `linear-gradient(90deg, ${chart.color}12, transparent)`,
                }}
              >
                <p
                  className="font-mono text-[9px] uppercase tracking-widest"
                  style={{ color: chart.color }}
                >
                  {chart.label} · deep read
                </p>
              </div>

              <div className="space-y-3 p-4">
                <div>
                  <p className="text-sm font-semibold text-white leading-snug">
                    {detail.headline}
                  </p>
                  <p className="mt-1.5 text-[11px] leading-relaxed text-zinc-400">
                    {detail.body}
                  </p>
                </div>

                <div className="rounded-md border border-white/[0.06] bg-white/[0.02] p-2.5">
                  <DetailSparkline path={detail.sparkline} color={chart.color} id={sparkId} />
                </div>

                <div className="space-y-1.5">
                  {detail.stats.map((stat) => (
                    <div
                      key={stat.label}
                      className="flex items-center justify-between gap-2 rounded-md border border-white/[0.05] bg-white/[0.02] px-2.5 py-1.5"
                    >
                      <span className="text-[10px] text-zinc-500">{stat.label}</span>
                      <span
                        className="font-mono text-[10px] font-semibold tabular-nums"
                        style={{ color: chart.color }}
                      >
                        {stat.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
