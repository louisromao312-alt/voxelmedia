'use client'

import { memo, useMemo } from 'react'
import { generateBrainVoxels, BRAIN_BLOCK_SIZE, type BrainVoxel } from '@/lib/voxelBrainLayout'

const BLOCK_COLORS: Record<
  BrainVoxel['glow'],
  { top: string; front: string; side: string; back: string; bottom: string }
> = {
  core: {
    top: 'rgba(134,239,172,0.42)',
    front: 'rgba(74,222,128,0.32)',
    side: 'rgba(34,197,94,0.26)',
    back: 'rgba(22,163,74,0.2)',
    bottom: 'rgba(21,128,61,0.16)',
  },
  mid: {
    top: 'rgba(110,231,183,0.28)',
    front: 'rgba(52,211,153,0.22)',
    side: 'rgba(16,185,129,0.18)',
    back: 'rgba(5,150,105,0.14)',
    bottom: 'rgba(4,120,87,0.1)',
  },
  surface: {
    top: 'rgba(212,228,212,0.18)',
    front: 'rgba(184,204,184,0.14)',
    side: 'rgba(156,176,156,0.11)',
    back: 'rgba(132,152,132,0.09)',
    bottom: 'rgba(112,128,112,0.07)',
  },
  none: {
    top: 'rgba(196,208,196,0.14)',
    front: 'rgba(168,180,168,0.11)',
    side: 'rgba(140,152,140,0.09)',
    back: 'rgba(120,136,120,0.07)',
    bottom: 'rgba(100,112,100,0.06)',
  },
}

const VoxelCube = memo(function VoxelCube({ v, size }: { v: BrainVoxel; size: number }) {
  const c = BLOCK_COLORS[v.glow]
  const h = size / 2

  const faces = [
    { name: 'front', bg: c.front, transform: `rotateY(0deg) translateZ(${h}px)` },
    { name: 'back', bg: c.back, transform: `rotateY(180deg) translateZ(${h}px)` },
    { name: 'right', bg: c.side, transform: `rotateY(90deg) translateZ(${h}px)` },
    { name: 'left', bg: c.back, transform: `rotateY(-90deg) translateZ(${h}px)` },
    { name: 'top', bg: c.top, transform: `rotateX(90deg) translateZ(${h}px)` },
    { name: 'bottom', bg: c.bottom, transform: `rotateX(-90deg) translateZ(${h}px)` },
  ] as const

  return (
    <div
      className="absolute"
      style={{
        width: size,
        height: size,
        left: -h,
        top: -h,
        transform: `translate3d(${v.x}px, ${v.y}px, ${v.z}px)`,
        transformStyle: 'preserve-3d',
      }}
    >
      <div style={{ width: size, height: size, transformStyle: 'preserve-3d' }}>
        {faces.map((f) => (
          <div
            key={f.name}
            style={{
              position: 'absolute',
              inset: 0,
              background: f.bg,
              transform: f.transform,
              backfaceVisibility: 'hidden',
            }}
          />
        ))}
      </div>
    </div>
  )
})

export default function VoxelBrain() {
  const voxels = useMemo(() => generateBrainVoxels(), [])

  return (
    <>
      <div
        className="pointer-events-none absolute left-1/2 top-[52%] z-0 -translate-x-1/2 -translate-y-1/2"
        aria-hidden="true"
        style={{
          width: 'min(3200px, 280vw)',
          height: 'min(3200px, 260vh)',
          background:
            'radial-gradient(ellipse 48% 52% at 50% 44%, rgba(74,222,128,0.035) 0%, rgba(74,222,128,0.012) 32%, transparent 52%)',
          filter: 'blur(72px)',
        }}
      />

      <div
        className="pointer-events-none absolute inset-x-0 -top-[12vh] -bottom-[45vh] z-[1] flex items-center justify-center overflow-visible"
        aria-hidden="true"
        style={{ opacity: 0.62 }}
      >
        <div
          className="relative flex items-center justify-center"
          style={{
            width: 'min(2200px, 200vw)',
            height: 'min(2000px, 190vw)',
            perspective: 1800,
            transform: 'translateY(-40px)',
          }}
        >
          <div className="voxel-brain-rotate" style={{ transformStyle: 'preserve-3d' }}>
            {voxels.map((v) => (
              <VoxelCube key={`${v.x}-${v.y}-${v.z}`} v={v} size={BRAIN_BLOCK_SIZE} />
            ))}
          </div>
        </div>

        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 88% 80% at 50% 46%, transparent 0%, rgba(10,10,12,0.22) 55%, rgba(10,10,12,0.62) 100%)',
            maskImage: 'linear-gradient(to bottom, black 0%, black 72%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 72%, transparent 100%)',
          }}
        />
      </div>
    </>
  )
}
