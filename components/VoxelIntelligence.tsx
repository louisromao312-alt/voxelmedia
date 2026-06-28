'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Shield, Zap, Users } from 'lucide-react'
import SectionReveal, { EASE, revealTransition } from '@/components/SectionReveal'
import { RoleBadge } from '@/components/JourneySelector'
import { useUserJourney } from '@/context/UserJourneyContext'

const TABLE_ROWS = [
  { platform: 'Minecraft', category: 'Realism Packs', momentum: '+24%', delta: '▲', signal: 'STRONG' },
  { platform: 'Minecraft', category: 'Horror / Backrooms', momentum: '+18%', delta: '▲', signal: 'RISING' },
  { platform: 'Minecraft', category: 'Skyblock Economy', momentum: '+12%', delta: '▲', signal: 'STABLE' },
  { platform: 'Minecraft', category: 'Hardcore Survival', momentum: '+9%', delta: '▲', signal: 'WATCH' },
  { platform: 'Minecraft', category: 'Cartoon / Cute', momentum: '-6%', delta: '▼', signal: 'COOLING' },
]

const CHARTS = [
  {
    icon: Zap,
    label: 'Trend Velocity',
    metric: '4.2×',
    sub: 'vs. category avg',
    bars: [28, 42, 38, 55, 62, 71, 84],
    color: '#4ade80',
  },
  {
    icon: Shield,
    label: 'Brand Compliance',
    metric: '98.4%',
    sub: 'verified creators',
    bars: [72, 78, 80, 85, 88, 92, 98],
    color: '#60a5fa',
  },
  {
    icon: Users,
    label: 'Creator Network',
    metric: '12.4K',
    sub: 'active builders',
    bars: [40, 48, 52, 58, 64, 70, 76],
    color: '#a78bfa',
  },
]

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
          transition={revealTransition(animate, 0.15, {
            duration: 0.5,
            index: i,
            count: bars.length,
            stagger: 0.06,
          })}
        />
      ))}
    </div>
  )
}

export default function VoxelIntelligence() {
  const terminalRef = useRef<HTMLDivElement>(null)
  const terminalInView = useInView(terminalRef, { once: false, amount: 0.2 })
  const { role } = useUserJourney()

  const highlightedRow = role === 'creator' ? 0 : role === 'brand' ? 2 : -1
  const highlightedChart = role === 'creator' ? 0 : role === 'brand' ? 1 : -1

  const sectionCopy =
    role === 'creator'
      ? 'Spot rising modpack categories and server trends before they peak — built for creators who ship fast.'
      : role === 'brand'
        ? 'EULA-compliant market entry intelligence — verified creator networks and campaign-safe data.'
        : 'Bloomberg-grade market intelligence for the Minecraft creator economy — real-time signals, compliance scoring, and creator network depth.'

  return (
    <SectionReveal
      className="relative px-4 py-24 md:py-32 bg-[#0A0A0C]"
      aria-labelledby="voxel-terminal-heading"
    >
      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-3">
            <RoleBadge />
          </div>
          <p className="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-3">
            Voxel Intelligence
          </p>
          <h2
            id="voxel-terminal-heading"
            className="text-3xl sm:text-4xl font-bold text-white"
          >
            The Terminal
          </h2>
          <motion.p
            key={role ?? 'default'}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: EASE }}
            className="mt-3 text-zinc-400 max-w-xl mx-auto text-sm sm:text-base"
          >
            {sectionCopy}
          </motion.p>
        </div>

        {/* Terminal window */}
        <div
          ref={terminalRef}
          className="rounded-xl border border-white/[0.08] bg-[#0A0A0C] overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.6)]"
        >
          {/* Title bar */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06] bg-white/[0.02]">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5" aria-hidden="true">
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
              </div>
              <span className="font-mono text-[11px] text-zinc-500 tracking-widest uppercase">
                voxel://intelligence.terminal
              </span>
            </div>
            <div
              className="flex items-center gap-2 font-mono text-[10px] text-green-400 uppercase tracking-widest"
              role="status"
              aria-label="Live signal active"
            >
              <motion.span
                className="relative flex h-2 w-2"
                animate={{
                  scale: [1, 1.4, 1],
                  opacity: [0.7, 1, 0.7],
                }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              >
                <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-60 animate-ping" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-400" />
              </motion.span>
              Live Signal
            </div>
          </div>

          {/* Data table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="border-b border-white/[0.06] text-zinc-500 uppercase tracking-wider">
                  <th className="px-4 py-3 font-medium" scope="col">Platform</th>
                  <th className="px-4 py-3 font-medium" scope="col">Category</th>
                  <th className="px-4 py-3 font-medium text-right" scope="col">Momentum</th>
                  <th className="px-4 py-3 font-medium text-center" scope="col">7d</th>
                  <th className="px-4 py-3 font-medium text-right" scope="col">Signal</th>
                </tr>
              </thead>
              <tbody>
                {TABLE_ROWS.map((row, i) => (
                  <motion.tr
                    key={`${row.platform}-${row.category}`}
                    className={`border-b border-white/[0.04] transition-colors ${
                      i === highlightedRow
                        ? role === 'brand'
                          ? 'bg-blue-400/8 ring-1 ring-inset ring-blue-400/20'
                          : 'bg-green-400/8 ring-1 ring-inset ring-green-400/20'
                        : 'hover:bg-white/[0.02]'
                    }`}
                    initial={{ opacity: 0, x: -8 }}
                    animate={terminalInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -8 }}
                    transition={revealTransition(terminalInView, 0.1, {
                      duration: 0.4,
                      index: i,
                      count: TABLE_ROWS.length,
                      stagger: 0.07,
                    })}
                  >
                    <td className="px-4 py-3 text-zinc-300">{row.platform}</td>
                    <td className="px-4 py-3 text-white">{row.category}</td>
                    <td
                      className={`px-4 py-3 text-right font-semibold ${
                        row.momentum.startsWith('+') ? 'text-green-400' : 'text-red-400'
                      }`}
                    >
                      {row.momentum}
                    </td>
                    <td
                      className={`px-4 py-3 text-center ${
                        row.delta === '▲' ? 'text-green-400' : 'text-red-400'
                      }`}
                      aria-hidden="true"
                    >
                      {row.delta}
                    </td>
                    <td className="px-4 py-3 text-right text-zinc-500">{row.signal}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 3-column chart grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-white/[0.06] border-t border-white/[0.06]">
            {CHARTS.map((chart, i) => {
              const Icon = chart.icon
              const isHighlighted = i === highlightedChart
              return (
                <motion.div
                  key={chart.label}
                  className={`bg-[#0A0A0C] p-5 transition-colors duration-500 ${
                    isHighlighted
                      ? role === 'brand'
                        ? 'ring-1 ring-inset ring-blue-400/25 bg-blue-400/[0.03]'
                        : 'ring-1 ring-inset ring-green-400/25 bg-green-400/[0.03]'
                      : ''
                  }`}
                  initial={{ opacity: 0, y: 12 }}
                  animate={terminalInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
                  transition={revealTransition(terminalInView, 0.35, {
                    duration: 0.5,
                    index: i,
                    count: CHARTS.length,
                    stagger: 0.1,
                  })}
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
                  <MiniBarChart
                    bars={chart.bars}
                    color={chart.color}
                    animate={terminalInView}
                  />
                  <span className="sr-only">
                    {chart.label} chart showing upward trend
                  </span>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </SectionReveal>
  )
}
