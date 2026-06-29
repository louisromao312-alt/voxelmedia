'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'

/** Lateral brain silhouette — nodes in normalized 0–420 × 0–380 space */
const NODES: { x: number; y: number }[] = [
  { x: 52, y: 188 },
  { x: 68, y: 148 },
  { x: 78, y: 108 },
  { x: 98, y: 72 },
  { x: 132, y: 48 },
  { x: 168, y: 36 },
  { x: 208, y: 32 },
  { x: 248, y: 38 },
  { x: 286, y: 52 },
  { x: 318, y: 78 },
  { x: 342, y: 112 },
  { x: 362, y: 148 },
  { x: 372, y: 186 },
  { x: 358, y: 224 },
  { x: 332, y: 258 },
  { x: 298, y: 286 },
  { x: 258, y: 304 },
  { x: 214, y: 312 },
  { x: 168, y: 306 },
  { x: 128, y: 288 },
  { x: 96, y: 262 },
  { x: 74, y: 228 },
  { x: 108, y: 118 },
  { x: 142, y: 88 },
  { x: 182, y: 68 },
  { x: 224, y: 62 },
  { x: 266, y: 72 },
  { x: 302, y: 96 },
  { x: 328, y: 132 },
  { x: 340, y: 172 },
  { x: 318, y: 208 },
  { x: 284, y: 238 },
  { x: 244, y: 258 },
  { x: 200, y: 268 },
  { x: 156, y: 262 },
  { x: 118, y: 238 },
  { x: 92, y: 204 },
  { x: 148, y: 148 },
  { x: 188, y: 128 },
  { x: 228, y: 122 },
  { x: 268, y: 134 },
  { x: 298, y: 162 },
  { x: 276, y: 198 },
  { x: 236, y: 218 },
  { x: 192, y: 222 },
  { x: 152, y: 208 },
  { x: 124, y: 178 },
  { x: 176, y: 178 },
  { x: 216, y: 168 },
  { x: 256, y: 176 },
  { x: 284, y: 204 },
  { x: 248, y: 192 },
  { x: 208, y: 188 },
  { x: 168, y: 192 },
]

const MAX_EDGE_DIST = 52

function dist(a: { x: number; y: number }, b: { x: number; y: number }) {
  return Math.hypot(a.x - b.x, a.y - b.y)
}

function buildEdges(nodes: { x: number; y: number }[]) {
  const edges: [number, number][] = []
  for (let i = 0; i < nodes.length; i++) {
    const neighbors: { j: number; d: number }[] = []
    for (let j = i + 1; j < nodes.length; j++) {
      const d = dist(nodes[i], nodes[j])
      if (d <= MAX_EDGE_DIST) neighbors.push({ j, d })
    }
    neighbors.sort((a, b) => a.d - b.d)
    for (const { j } of neighbors.slice(0, 3)) {
      edges.push([i, j])
    }
  }
  const seen = new Set<string>()
  return edges.filter(([a, b]) => {
    const key = a < b ? `${a}-${b}` : `${b}-${a}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

const PULSE_INDICES = [4, 11, 18, 25, 32, 39, 46, 51]

export default function IndustryGapNetwork() {
  const edges = useMemo(() => buildEdges(NODES), [])

  return (
    <div
      className="pointer-events-none absolute left-1/2 top-1/2 z-0 -translate-x-1/2 -translate-y-1/2"
      aria-hidden="true"
    >
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          width: 'min(720px, 95vw)',
          height: 'min(620px, 70vh)',
          background:
            'radial-gradient(ellipse at center, rgba(56,189,248,0.14) 0%, rgba(14,165,233,0.06) 38%, transparent 68%)',
          filter: 'blur(48px)',
        }}
      />

      <motion.svg
        viewBox="0 0 420 380"
        className="relative h-auto w-[min(560px,88vw)] opacity-[0.88]"
        initial={{ opacity: 0, scale: 0.96 }}
        whileInView={{ opacity: 0.88, scale: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      >
        <defs>
          <filter id="ig-node-glow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="2.8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="ig-line-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <radialGradient id="ig-node-fill" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#e0f7ff" />
            <stop offset="55%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#0284c7" />
          </radialGradient>
        </defs>

          <linearGradient id="ig-line-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7dd3fc" stopOpacity="0.35" />
            <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.4" />
          </linearGradient>
        </defs>

        <g filter="url(#ig-line-glow)" opacity="0.55">
          {edges.map(([a, b], i) => (
            <motion.line
              key={`${a}-${b}`}
              x1={NODES[a].x}
              y1={NODES[a].y}
              x2={NODES[b].x}
              y2={NODES[b].y}
              stroke="url(#ig-line-grad)"
              strokeWidth="0.65"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.8,
                delay: 0.015 * (i % 24),
                ease: [0.16, 1, 0.3, 1],
              }}
            />
          ))}
        </g>

        <g filter="url(#ig-node-glow)">
          {NODES.map((node, i) =>
            PULSE_INDICES.includes(i) ? (
              <motion.circle
                key={i}
                cx={node.x}
                cy={node.y}
                r={2.8}
                fill="url(#ig-node-fill)"
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                animate={{ opacity: [0.6, 1, 0.6], scale: [0.92, 1.12, 0.92] }}
                transition={{
                  opacity: {
                    duration: 2.8 + (i % 4) * 0.4,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  },
                  scale: {
                    duration: 2.8 + (i % 4) * 0.4,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  },
                  default: {
                    duration: 0.5,
                    delay: 0.015 * i,
                    ease: [0.16, 1, 0.3, 1],
                  },
                }}
              />
            ) : (
              <motion.circle
                key={i}
                cx={node.x}
                cy={node.y}
                r={2.1}
                fill="url(#ig-node-fill)"
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: 0.015 * i,
                  ease: [0.16, 1, 0.3, 1],
                }}
              />
            ),
          )}
        </g>
      </motion.svg>
    </div>
  )
}
