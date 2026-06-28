'use client'

import { useMemo } from 'react'
import { generateBrainVoxels, BRAIN_BLOCK_SIZE, type BrainVoxel } from '@/lib/voxelBrainLayout'

const BLOCK_COLORS: Record<
  BrainVoxel['glow'],
  { top: string; front: string; side: string; back: string; bottom: string; glow?: string }
> = {
  core: {
    top: '#86efac',
    front: '#4ade80',
    side: '#22c55e',
    back: '#16a34a',
    bottom: '#15803d',
    glow: '0 0 10px rgba(74,222,128,0.25)',
  },
  mid: {
    top: '#6ee7b7',
    front: '#34d399',
    side: '#10b981',
    back: '#059669',
    bottom: '#047857',
    glow: '0 0 6px rgba(52,211,153,0.18)',
  },
  surface: {
    top: '#d4e4d4',
    front: '#b8ccb8',
    side: '#9cb09c',
    back: '#849884',
    bottom: '#708070',
  },
  none: {
    top: '#c4d0c4',
    front: '#a8b4a8',
    side: '#8c988c',
    back: '#788878',
    bottom: '#647064',
  },
}

function VoxelCube({ v, size }: { v: BrainVoxel; size: number }) {
  const c = BLOCK_COLORS[v.glow]
  const h = size / 2

  const faces = [
    { name: 'front', bg: c.front, transform: `rotateY(0deg) translateZ(${h}px)`, glow: c.glow },
    { name: 'back', bg: c.back, transform: `rotateY(180deg) translateZ(${h}px)` },
    { name: 'right', bg: c.side, transform: `rotateY(90deg) translateZ(${h}px)` },
    { name: 'left', bg: c.back, transform: `rotateY(-90deg) translateZ(${h}px)` },
    { name: 'top', bg: c.top, transform: `rotateX(90deg) translateZ(${h}px)`, glow: c.glow },
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
      <div
        style={{
          width: size,
          height: size,
          position: 'relative',
          transformStyle: 'preserve-3d',
        }}
      >
        {faces.map((f) => (
          <div
            key={f.name}
            style={{
              position: 'absolute',
              inset: 0,
              background: f.bg,
              boxShadow: 'glow' in f ? f.glow : undefined,
              transform: f.transform,
              backfaceVisibility: 'hidden',
            }}
          />
        ))}
      </div>
    </div>
  )
}

export default function VoxelBrain() {
  const voxels = useMemo(() => generateBrainVoxels(), [])

  return (
    <>
      {/* Ambient glow — extends beyond section into Terminal */}
      <div
        className="pointer-events-none absolute left-1/2 top-[52%] z-0 -translate-x-1/2 -translate-y-1/2"
        aria-hidden="true"
        style={{
          width: 'min(3200px, 280vw)',
          height: 'min(3200px, 260vh)',
          background:
            'radial-gradient(ellipse 48% 52% at 50% 44%, rgba(74,222,128,0.12) 0%, rgba(74,222,128,0.05) 32%, rgba(74,222,128,0.02) 52%, transparent 72%)',
          filter: 'blur(72px)',
        }}
      />

      <div
        className="pointer-events-none absolute inset-x-0 -top-[12vh] -bottom-[45vh] z-[1] flex items-center justify-center overflow-visible"
        aria-hidden="true"
      >
        <div
          className="relative flex items-center justify-center"
          style={{
            width: 'min(2200px, 200vw)',
            height: 'min(2000px, 190vw)',
            perspective: 1800,
            contain: 'layout style',
          }}
        >
          <div
            className="pointer-events-none absolute rounded-full"
            style={{
              width: '55%',
              height: '55%',
              background:
                'radial-gradient(circle, rgba(74,222,128,0.16) 0%, rgba(74,222,128,0.06) 40%, transparent 72%)',
              filter: 'blur(52px)',
            }}
          />

          <div
            className="voxel-brain-rotate"
            style={{
              transformStyle: 'preserve-3d',
              willChange: 'transform',
            }}
          >
            {voxels.map((v) => (
              <VoxelCube key={`${v.x}-${v.y}-${v.z}`} v={v} size={BRAIN_BLOCK_SIZE} />
            ))}
          </div>
        </div>

        {/* Side softening only — no hard bottom edge */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 88% 80% at 50% 46%, transparent 0%, rgba(10,10,12,0.12) 68%, rgba(10,10,12,0.45) 100%)',
            maskImage: 'linear-gradient(to bottom, black 0%, black 72%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 72%, transparent 100%)',
          }}
        />
      </div>
    </>
  )
}
