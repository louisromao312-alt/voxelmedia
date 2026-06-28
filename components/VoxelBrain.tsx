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
    glow: '0 0 20px rgba(74,222,128,0.5)',
  },
  mid: {
    top: '#6ee7b7',
    front: '#34d399',
    side: '#10b981',
    back: '#059669',
    bottom: '#047857',
    glow: '0 0 12px rgba(52,211,153,0.35)',
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
    <div
      className="pointer-events-none absolute inset-0 z-[1] flex items-center justify-center overflow-visible"
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
            width: '46%',
            height: '46%',
            background:
              'radial-gradient(circle, rgba(74,222,128,0.34) 0%, rgba(74,222,128,0.12) 38%, transparent 70%)',
            filter: 'blur(44px)',
          }}
        />

        <div
          className="voxel-brain-rotate"
          style={{
            transformStyle: 'preserve-3d',
            willChange: 'transform',
          }}
        >
          {voxels.map((v, i) => (
            <VoxelCube key={`${v.x}-${v.y}-${v.z}`} v={v} size={BRAIN_BLOCK_SIZE} />
          ))}
        </div>
      </div>

      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 82% 76% at 50% 48%, transparent 0%, rgba(10,10,12,0.18) 64%, rgba(10,10,12,0.78) 100%)',
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, rgba(74,222,128,0.14) 0%, transparent 58%)',
        }}
      />
    </div>
  )
}
