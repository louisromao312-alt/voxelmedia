'use client'

import { motion, type MotionValue } from 'framer-motion'
import { Activity, Network, ShieldCheck, Radio } from 'lucide-react'
import { useUserJourney } from '@/context/UserJourneyContext'

const SPARK = 'M2,22 L10,18 L18,19 L26,12 L34,14 L42,8 L50,9 L58,5'

type TerminalDeepDiveProps = {
  opacity: MotionValue<number>
}

export default function TerminalDeepDive({ opacity }: TerminalDeepDiveProps) {
  const { role } = useUserJourney()

  const panels =
    role === 'creator'
      ? [
          {
            icon: Activity,
            title: 'Modpack Velocity Trace',
            metric: '4.2×',
            body: 'Realism packs accelerating faster than creator dashboards refresh — early pivot window open.',
            accent: '#4ade80',
          },
          {
            icon: Radio,
            title: 'Live Category Scanner',
            metric: '847/hr',
            body: 'Signals ingested across CurseForge, Modrinth, and server APIs in real time.',
            accent: '#4ade80',
          },
        ]
      : role === 'brand'
        ? [
            {
              icon: ShieldCheck,
              title: 'EULA Compliance Score',
              metric: '98.4%',
              body: 'Campaign-ready creators filtered by Mojang policy risk before brief delivery.',
              accent: '#60a5fa',
            },
            {
              icon: Network,
              title: 'Verified Creator Mesh',
              metric: '12.4K',
              body: 'Audience graphs cross-validated — no inflated reach, no shadow audiences.',
              accent: '#60a5fa',
            },
          ]
        : [
            {
              icon: Activity,
              title: 'Signal Pipeline',
              metric: '847/hr',
              body: 'Cross-platform momentum indexed before trends hit mainstream creator dashboards.',
              accent: '#4ade80',
            },
            {
              icon: ShieldCheck,
              title: 'Compliance Layer',
              metric: '98.4%',
              body: 'Brand-safe creator matching with automated EULA risk scoring.',
              accent: '#60a5fa',
            },
            {
              icon: Network,
              title: 'Network Depth',
              metric: '12.4K',
              body: 'Verified builders mapped across modpack, server, and content verticals.',
              accent: '#a78bfa',
            },
          ]

  return (
    <motion.div
      className="pointer-events-none absolute inset-0 z-20 flex items-stretch justify-end"
      style={{ opacity }}
      aria-hidden="true"
    >
      <div className="w-full max-w-[52%] min-w-[280px] h-full flex flex-col justify-center gap-3 p-5 sm:p-6 border-l border-green-400/15 bg-[#08080a]/92 backdrop-blur-md">
        <p className="font-mono text-[10px] uppercase tracking-widest text-green-400 mb-1">
          voxel://intelligence.terminal — deep layer
        </p>

        {panels.map((panel) => {
          const Icon = panel.icon
          return (
            <div
              key={panel.title}
              className="rounded-lg border border-white/[0.08] bg-white/[0.03] p-4"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <Icon size={14} style={{ color: panel.accent }} />
                  <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-400">
                    {panel.title}
                  </p>
                </div>
                <span
                  className="font-mono text-lg font-bold tabular-nums"
                  style={{ color: panel.accent }}
                >
                  {panel.metric}
                </span>
              </div>
              <p className="text-[11px] leading-relaxed text-zinc-400">{panel.body}</p>
            </div>
          )
        })}

        <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3 mt-1">
          <p className="font-mono text-[9px] uppercase tracking-widest text-zinc-500 mb-2">
            Signal Density · 24h
          </p>
          <svg viewBox="0 0 60 24" className="h-8 w-full">
            <defs>
              <linearGradient id="terminal-deep-spark" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4ade80" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#4ade80" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d={`${SPARK} L58,24 L2,24 Z`} fill="url(#terminal-deep-spark)" />
            <path
              d={SPARK}
              fill="none"
              stroke="#4ade80"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>
    </motion.div>
  )
}
