'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { revealTransition } from '@/components/SectionReveal'
import { useUserJourney } from '@/context/UserJourneyContext'

const TRENDS = [
  { category: 'Realism Packs', change: '+24%', up: true },
  { category: 'Horror / Backrooms', change: '+18%', up: true },
  { category: 'Cartoon / Cute', change: '-6%', up: false },
]

const SPARKLINE = 'M4,28 L16,22 L28,24 L40,14 L52,18 L64,10 L76,12 L88,6 L100,8'

export default function BriefReportPreview() {
  const sparkRef = useRef<SVGSVGElement>(null)
  const sparkInView = useInView(sparkRef, { once: false, amount: 0.4 })
  const { role } = useUserJourney()

  const insight =
    role === 'creator'
      ? 'Realism modpack velocity is 4.2× above category average. Early signal for Q3 content pivots.'
      : role === 'brand'
        ? 'EULA-safe campaign windows opening in Horror/Backrooms segment. 12 verified creator matches flagged.'
        : 'Realism modpack velocity is 4.2× above category average. Brands entering now see 18% lower CPM vs. peak.'

  return (
    <div
      className="relative h-full min-h-[280px] md:min-h-[320px] rounded-xl overflow-visible border border-white/[0.08] bg-[#0A0A0C] font-mono text-left"
      aria-hidden="true"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/voxel-brief/bird.png"
        alt=""
        draggable={false}
        className="pointer-events-none absolute -right-1 -top-7 z-20 h-auto w-[5.25rem] translate-x-[10px] -translate-y-[6px] sm:-right-2 sm:-top-8 sm:w-[6rem] sm:translate-x-[12px] sm:-translate-y-[8px]"
        aria-hidden="true"
      />

      <div className="relative overflow-hidden rounded-xl">
      {/* Terminal chrome */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.06] bg-white/[0.03]">
        <div className="flex items-center gap-2">
          <div className="flex gap-1" aria-hidden="true">
            <span className="w-2 h-2 rounded-full bg-zinc-700" />
            <span className="w-2 h-2 rounded-full bg-zinc-700" />
            <span className="w-2 h-2 rounded-full bg-zinc-700" />
          </div>
          <span className="text-[9px] text-zinc-500 uppercase tracking-widest">
            voxel://brief.report
          </span>
        </div>
        <span className="text-[9px] text-green-400 uppercase tracking-widest flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          WK 24
        </span>
      </div>

      <div className="p-4 sm:p-5 flex flex-col gap-4">
        {/* Report header */}
        <div>
          <p className="text-[10px] text-zinc-500 uppercase tracking-[0.2em] mb-1">
            The Voxel Brief
          </p>
          <h3 className="text-sm sm:text-base font-bold text-white leading-snug">
            Minecraft Market Intelligence
          </h3>
          <p className="text-[10px] text-zinc-600 mt-1">Jun 27, 2026 · Free Edition</p>
        </div>

        {/* Trend table */}
        <div className="rounded-lg border border-white/[0.06] overflow-hidden">
          <div className="px-3 py-1.5 bg-white/[0.03] border-b border-white/[0.05]">
            <span className="text-[9px] text-zinc-500 uppercase tracking-widest">
              Trending Categories
            </span>
          </div>
          <table className="w-full text-[10px] sm:text-[11px]">
            <tbody>
              {TRENDS.map((row) => (
                <tr
                  key={row.category}
                  className="border-b border-white/[0.04] last:border-0"
                >
                  <td className="px-3 py-2 text-zinc-300">{row.category}</td>
                  <td
                    className={`px-3 py-2 text-right font-semibold tabular-nums ${
                      row.up ? 'text-green-400' : 'text-red-400'
                    }`}
                  >
                    {row.change}
                  </td>
                  <td className="px-2 py-2 w-6">
                    {row.up ? (
                      <TrendingUp size={11} className="text-green-400" />
                    ) : (
                      <TrendingDown size={11} className="text-red-400" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Sparkline */}
        <div className="rounded-lg border border-white/[0.06] p-3 bg-white/[0.02]">
          <p className="text-[9px] text-zinc-500 uppercase tracking-widest mb-2">
            7-Day Momentum Index
          </p>
          <svg
            ref={sparkRef}
            viewBox="0 0 104 32"
            className="w-full h-10"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="brief-spark-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4ade80" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#4ade80" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              d={`${SPARKLINE} L100,32 L4,32 Z`}
              fill="url(#brief-spark-fill)"
            />
            <motion.path
              d={SPARKLINE}
              fill="none"
              stroke="#4ade80"
              strokeWidth="1.5"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={sparkInView ? { pathLength: 1 } : { pathLength: 0 }}
              transition={revealTransition(sparkInView, 0, { duration: 1.2 })}
            />
          </svg>
        </div>

        {/* Insight snippet */}
        <div className="rounded-lg border border-green-400/15 bg-green-400/[0.04] px-3 py-2.5">
          <p className="text-[9px] text-green-400 uppercase tracking-widest mb-1.5">
            Key Insight
          </p>
          <p className="text-[10px] sm:text-[11px] text-zinc-400 leading-relaxed line-clamp-3">
            {insight}
          </p>
        </div>
      </div>

      {/* Subtle bottom fade — hints more content without hiding the report */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-16"
        style={{
          background:
            'linear-gradient(to top, #0A0A0C 0%, rgba(10,10,12,0.6) 50%, transparent 100%)',
        }}
      />
      </div>
    </div>
  )
}
