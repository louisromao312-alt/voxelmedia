'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion } from 'framer-motion'
import { useBurst } from '@/context/BlockBurstContext'
import { VoxelCell } from '@/components/VoxelBlock'

const COUNT = 8

function BurstParticles({ burstId, x, y }: { burstId: number; x: number; y: number }) {
  return (
    <>
      {Array.from({ length: COUNT }, (_, i) => {
        const angle = (i / COUNT) * 2 * Math.PI + (burstId % 7) * 0.08
        const dist = 48 + ((burstId * 13 + i * 17) % 48)
        const tx = Math.cos(angle) * dist
        const ty = Math.sin(angle) * dist - 16
        const size = 12 + ((burstId + i * 3) % 10)
        const spinDir = burstId % 2 === 0 ? 1 : -1

        return (
          <motion.div
            key={`${burstId}-${i}`}
            initial={{ x: 0, y: 0, opacity: 1, scale: 1, rotate: 0 }}
            animate={{
              x: tx,
              y: ty + 32,
              opacity: 0,
              scale: 0.3,
              rotate: spinDir * (90 + (i % 4) * 30),
            }}
            transition={{
              duration: 0.55 + (i % 3) * 0.05,
              ease: [0.15, 0, 0.7, 1],
            }}
            style={{
              position: 'fixed',
              left: x - size / 2,
              top: y - size / 2,
              width: size,
              height: size,
              pointerEvents: 'none',
              zIndex: 9999,
            }}
            aria-hidden="true"
          >
            <VoxelCell size={size} />
          </motion.div>
        )
      })}
    </>
  )
}

export default function BlockBurstLayer() {
  const { bursts } = useBurst()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  return createPortal(
    <>
      {bursts.map(({ id, x, y }) => (
        <BurstParticles key={id} burstId={id} x={x} y={y} />
      ))}
    </>,
    document.body,
  )
}
