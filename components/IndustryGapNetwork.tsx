'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'

const VIEW_W = 520
const VIEW_H = 360

function seeded(i: number, salt = 0) {
  const x = Math.sin(i * 127.1 + salt * 311.7) * 43758.5453
  return x - Math.floor(x)
}

function dist(a: { x: number; y: number }, b: { x: number; y: number }) {
  return Math.hypot(a.x - b.x, a.y - b.y)
}

/** Organic clusters — loose, asymmetric placement */
const NODES: { x: number; y: number }[] = (() => {
  const anchors = [
    { cx: 155, cy: 145, spread: 72, count: 6 },
    { cx: 300, cy: 118, spread: 64, count: 5 },
    { cx: 248, cy: 248, spread: 78, count: 5 },
    { cx: 92, cy: 248, spread: 58, count: 4 },
  ]

  const nodes: { x: number; y: number }[] = []
  let seed = 0

  for (const { cx, cy, spread, count } of anchors) {
    for (let n = 0; n < count; n++) {
      const angle = seeded(seed, 1) * Math.PI * 2
      const radius = (0.25 + seeded(seed, 2) * 0.75) * spread
      nodes.push({
        x: cx + Math.cos(angle) * radius,
        y: cy + Math.sin(angle) * radius * 0.82,
      })
      seed++
    }
  }

  return nodes
})()

const MAX_EDGE_DIST = 118
const NEIGHBORS_PER_NODE = 2

function buildEdges(nodes: { x: number; y: number }[]) {
  const edges: [number, number][] = []
  const seen = new Set<string>()

  const addEdge = (a: number, b: number) => {
    if (a === b) return
    const key = a < b ? `${a}-${b}` : `${b}-${a}`
    if (seen.has(key)) return
    seen.add(key)
    edges.push([a, b])
  }

  for (let i = 0; i < nodes.length; i++) {
    const neighbors: { j: number; d: number }[] = []
    for (let j = 0; j < nodes.length; j++) {
      if (i === j) continue
      const d = dist(nodes[i], nodes[j])
      if (d <= MAX_EDGE_DIST) neighbors.push({ j, d })
    }
    neighbors.sort((a, b) => a.d - b.d)
    for (const { j } of neighbors.slice(0, NEIGHBORS_PER_NODE)) {
      addEdge(i, j)
    }
  }

  return edges
}

const PULSE_INDICES = new Set([2, 8, 14, 17])

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
          width: 'min(900px, 110vw)',
          height: 'min(520px, 75vh)',
          background:
            'radial-gradient(ellipse at center, rgba(251,191,36,0.16) 0%, rgba(245,158,11,0.08) 38%, rgba(234,179,8,0.03) 58%, transparent 74%)',
          filter: 'blur(56px)',
        }}
      />

      <motion.svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        className="relative h-auto w-[min(680px,95vw)] opacity-[0.88]"
        initial={{ opacity: 0, scale: 0.97 }}
        whileInView={{ opacity: 0.88, scale: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      >
        <defs>
          <filter id="ig-node-glow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="3.6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="ig-line-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <radialGradient id="ig-node-fill" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fff7d6" />
            <stop offset="45%" stopColor="#fcd34d" />
            <stop offset="100%" stopColor="#d97706" />
          </radialGradient>
          <linearGradient id="ig-line-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fde68a" stopOpacity="0.45" />
            <stop offset="50%" stopColor="#fbbf24" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.5" />
          </linearGradient>
        </defs>

        <g filter="url(#ig-line-glow)" opacity="0.58">
          {edges.map(([a, b], i) => (
            <motion.line
              key={`${a}-${b}`}
              x1={NODES[a].x}
              y1={NODES[a].y}
              x2={NODES[b].x}
              y2={NODES[b].y}
              stroke="url(#ig-line-grad)"
              strokeWidth="0.7"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.7,
                delay: 0.02 * (i % 16),
                ease: [0.16, 1, 0.3, 1],
              }}
            />
          ))}
        </g>

        <g filter="url(#ig-node-glow)">
          {NODES.map((node, i) =>
            PULSE_INDICES.has(i) ? (
              <motion.circle
                key={i}
                cx={node.x}
                cy={node.y}
                r={2.6}
                fill="url(#ig-node-fill)"
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                animate={{ opacity: [0.55, 1, 0.55], scale: [0.9, 1.1, 0.9] }}
                transition={{
                  opacity: {
                    duration: 2.6 + (i % 4) * 0.35,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  },
                  scale: {
                    duration: 2.6 + (i % 4) * 0.35,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  },
                  default: {
                    duration: 0.45,
                    delay: 0.02 * i,
                    ease: [0.16, 1, 0.3, 1],
                  },
                }}
              />
            ) : (
              <motion.circle
                key={i}
                cx={node.x}
                cy={node.y}
                r={2}
                fill="url(#ig-node-fill)"
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.45,
                  delay: 0.02 * i,
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
