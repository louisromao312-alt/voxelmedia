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

const CARD_H = 152

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

function MetricCard({
  chart,
  index,
  inView,
  highlighted,
  role,
}: {
  chart: ChartConfig
  index: number
  inView: boolean
  highlighted: boolean
  role: string | null
}) {
  const Icon = chart.icon

  return (
    <motion.div
      className={`w-full h-full p-5 bg-[#0A0A0C] ${
        highlighted
          ? role === 'brand'
            ? 'ring-1 ring-inset ring-blue-400/25 bg-blue-400/[0.03]'
            : 'ring-1 ring-inset ring-green-400/25 bg-green-400/[0.03]'
          : ''
      }`}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 12 }}
      transition={{
        opacity: { duration: 0.35, ease: EASE },
        y: { duration: 0.5, delay: 0.35 + index * 0.08, ease: EASE },
      }}
    >
      <div className="flex items-center gap-2 mb-1">
        <Icon
          size={14}
          className={highlighted ? '' : 'text-zinc-500'}
          style={highlighted ? { color: chart.color } : undefined}
          aria-hidden="true"
        />
        <span
          className="font-mono text-[10px] uppercase tracking-widest"
          style={{ color: highlighted ? chart.color : '#71717a' }}
        >
          {chart.label}
        </span>
      </div>
      <p className="text-2xl font-bold text-white font-mono tabular-nums">
        {chart.metric}
      </p>
      <p className="text-[10px] text-zinc-600 font-mono">{chart.sub}</p>
      <MiniBarChart bars={chart.bars} color={chart.color} show={inView} />
    </motion.div>
  )
}

export default function TerminalMetricsStrip({
  charts,
  inView,
  highlightedChart,
  role,
}: {
  charts: ChartConfig[]
  inView: boolean
  highlightedChart: number
  role: string | null
}) {
  return (
    <div className="border-t border-white/[0.06]">
      <div
        className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-white/[0.06]"
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
            />
          </div>
        ))}
      </div>
    </div>
  )
}
