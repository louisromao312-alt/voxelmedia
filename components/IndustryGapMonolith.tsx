'use client'

import { motion, type MotionValue } from 'framer-motion'
import { TrendingDown, BarChart3, Layers } from 'lucide-react'
import { useUserJourney } from '@/context/UserJourneyContext'

const SPARKLINE = 'M4,28 L14,24 L24,26 L34,18 L44,20 L54,12 L64,14 L74,8 L84,10 L96,6'

const SIGNALS = [
  {
    label: 'Campaigns without verified audience data',
    value: '72%',
    change: '+18% YoY',
  },
  {
    label: 'Unified cross-platform signal layer',
    value: '0',
    change: 'fragmented',
  },
  {
    label: 'Average trend detection lag',
    value: '14 days',
    change: 'vs. 48h possible',
  },
] as const

type IndustryGapMonolithProps = {
  rotateX: MotionValue<number>
  rotateY: MotionValue<number>
}

export default function IndustryGapMonolith({
  rotateX,
  rotateY,
}: IndustryGapMonolithProps) {
  const { role } = useUserJourney()
  const size = 340
  const depth = size * 0.38

  const insight =
    role === 'creator'
      ? 'Modpack momentum shifts 3× faster than creator dashboards update.'
      : role === 'brand'
        ? 'Brand-safe creator matches drop 41% without compliance scoring.'
        : 'Intuition scales poorly — signal density is the bottleneck.'

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size + 80, height: size + 80 }}
      aria-hidden="true"
    >
      <div
        className="pointer-events-none absolute inset-0 rounded-full opacity-70"
        style={{
          background:
            'radial-gradient(circle, rgba(74,222,128,0.14) 0%, transparent 68%)',
        }}
      />

      {/* 3D voxel shell */}
      <div
        className="absolute"
        style={{ width: size, height: size + depth, perspective: 1100 }}
      >
        <motion.div
          style={{
            width: size,
            height: size,
            position: 'relative',
            transformStyle: 'preserve-3d',
            rotateX,
            rotateY,
          }}
        >
          <div
            className="absolute inset-0 rounded-md"
            style={{
              background:
                'linear-gradient(135deg, rgba(74,222,128,0.16), rgba(255,255,255,0.05))',
              border: '1px solid rgba(74,222,128,0.28)',
              transform: `translateZ(${depth}px)`,
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.14)',
            }}
          />
          <div
            className="absolute left-0 top-0 rounded-md"
            style={{
              width: size,
              height: depth,
              bottom: 0,
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.09)',
              transformOrigin: 'bottom',
              transform: 'rotateX(-90deg)',
            }}
          />
          <div
            className="absolute top-0 right-0 rounded-md"
            style={{
              width: depth,
              height: size,
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.07)',
              transformOrigin: 'right',
              transform: 'rotateY(90deg)',
            }}
          />
        </motion.div>
      </div>

      {/* Front data panel — stays readable */}
      <motion.div
        className="relative z-10 overflow-hidden rounded-xl border border-white/[0.12] bg-[#0c0c0f]/95 shadow-[0_32px_100px_rgba(0,0,0,0.65)] backdrop-blur-sm"
        style={{
          width: size * 0.88,
          rotateX,
          rotateY,
        }}
      >
        <div className="border-b border-white/[0.06] bg-white/[0.03] px-4 py-2.5 flex items-center gap-2">
          <BarChart3 size={13} className="text-green-400" />
          <p className="font-mono text-[10px] uppercase tracking-widest text-green-400">
            Signal Gap · Live
          </p>
          <span className="ml-auto flex items-center gap-1 font-mono text-[9px] text-zinc-500">
            <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
            streaming
          </span>
        </div>

        <div className="space-y-2.5 p-4">
          {SIGNALS.map((row) => (
            <div
              key={row.label}
              className="rounded-lg border border-white/[0.07] bg-white/[0.03] px-3 py-2.5"
            >
              <p className="text-[10px] text-zinc-500 leading-snug">{row.label}</p>
              <div className="mt-1 flex items-baseline justify-between gap-2">
                <span className="font-mono text-lg font-bold text-white tabular-nums">
                  {row.value}
                </span>
                <span className="flex items-center gap-0.5 font-mono text-[9px] text-red-400">
                  <TrendingDown size={10} aria-hidden="true" />
                  {row.change}
                </span>
              </div>
            </div>
          ))}

          <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
            <p className="mb-2 font-mono text-[9px] uppercase tracking-widest text-zinc-500">
              7-Day Ecosystem Drift
            </p>
            <svg viewBox="0 0 100 32" className="h-10 w-full">
              <defs>
                <linearGradient id="gap-spark-fill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f87171" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#f87171" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d={`${SPARKLINE} L96,32 L4,32 Z`} fill="url(#gap-spark-fill)" />
              <path
                d={SPARKLINE}
                fill="none"
                stroke="#f87171"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <p className="text-[11px] leading-relaxed text-zinc-400">{insight}</p>
        </div>

        <div className="flex items-center justify-center gap-1.5 border-t border-white/[0.05] py-2">
          <Layers size={11} className="text-green-400/50" />
          <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-600">
            Voxel Intelligence Layer
          </span>
        </div>
      </motion.div>
    </div>
  )
}
