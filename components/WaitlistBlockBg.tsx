'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { VoxelCube } from '@/components/VoxelBlock'
import { EASE } from '@/components/SectionReveal'

function seeded(i: number, salt = 0) {
  const x = Math.sin(i * 127.1 + salt * 311.7) * 43758.5453
  return x - Math.floor(x)
}

type HillBlock = {
  left: string
  bottom: string
  size: number
  rotate: number
  tilt: number
  opacity: number
}

function buildHillScatter(): HillBlock[] {
  const blocks: HillBlock[] = []
  const count = 28

  for (let i = 0; i < count; i++) {
    const x = seeded(i, 1) * 94 + 3
    const centerDist = Math.abs(x - 50) / 50
    const hillBase = (1 - centerDist * centerDist) * 38
    const jitter = (seeded(i, 2) - 0.5) * 14
    const scatterY = seeded(i, 3) * 18
    const bottom = Math.max(2, hillBase + jitter + scatterY)

    blocks.push({
      left: `${x.toFixed(2)}%`,
      bottom: `${bottom.toFixed(2)}%`,
      size: 12 + Math.floor(seeded(i, 4) * 24),
      rotate: Math.floor((seeded(i, 5) - 0.5) * 70),
      tilt: 50 + Math.floor(seeded(i, 6) * 14),
      opacity: Math.round((0.3 + seeded(i, 7) * 0.5) * 1000) / 1000,
    })
  }

  return blocks
}

const FLOOR_BLOCKS = buildHillScatter()

export default function WaitlistBlockBg() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) return null

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      {FLOOR_BLOCKS.map((b, i) => (
        <motion.div
          key={i}
          className="absolute pointer-events-auto"
          style={{
            left: b.left,
            bottom: b.bottom,
          }}
          initial={{ x: '-50%', opacity: b.opacity }}
          animate={{ x: '-50%', opacity: b.opacity }}
          whileHover={{
            x: '-50%',
            y: -7,
            scale: 1.05,
            opacity: Math.min(b.opacity + 0.22, 1),
          }}
          transition={{ duration: 0.25, ease: EASE }}
        >
          <VoxelCube
            size={b.size}
            rotate={b.rotate}
            tilt={b.tilt}
            hoverable
          />
        </motion.div>
      ))}
    </div>
  )
}
