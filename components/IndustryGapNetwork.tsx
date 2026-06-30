'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'

const VIEW_W = 520
const VIEW_H = 360

/** Evenly scattered nodes — wide field, no silhouette */
const NODES: { x: number; y: number }[] = (() => {
  const cols = 9
  const rows = 6
  const padX = 36
  const padY = 32
  const nodes: { x: number; y: number }[] = []

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const jitterX = (((c * 17 + r * 11) % 23) - 11) * 0.9
      const jitterY = (((c * 13 + r * 19) % 21) - 10) * 0.85
      const stagger = r % 2 === 0 ? 0 : (VIEW_W - padX * 2) / (cols - 1) / 2
      nodes.push({
        x: padX + stagger + (c / (cols - 1)) * (VIEW_W - padX * 2) + jitterX,
        y: padY + (r / (rows - 1)) * (VIEW_H - padY * 2) + jitterY,
      })
    }
  }

  return nodes
})()

const MAX_EDGE_DIST = 148
const NEIGHBORS_PER_NODE = 5

function dist(a: { x: number; y: number }, b: { x: number; y: number }) {
  return Math.hypot(a.x - b.x, a.y - b.y)
}

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

  // Sparse long-range links across the mesh
  for (let i = 0; i < nodes.length; i += 7) {
    let best = -1
    let bestD = 0
    for (let j = 0; j < nodes.length; j++) {
      if (i === j) continue
      const d = dist(nodes[i], nodes[j])
      if (d > 120 && d < 220 && d > bestD) {
        bestD = d
        best = j
      }
    }
    if (best >= 0) addEdge(i, best)
  }

  return edges
}

const PULSE_INDICES = new Set(
  [3, 12, 21, 30, 39, 48, 8, 17, 26, 35, 44].filter((i) => i < NODES.length),
)

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

        <g filter="url(#ig-line-glow)" opacity="0.62">
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
                delay: 0.01 * (i % 30),
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
                    delay: 0.01 * i,
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
                  delay: 0.01 * i,
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
