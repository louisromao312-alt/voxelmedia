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
        {/* Top */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: c.top,
            transform: `translateZ(${h}px)`,
            boxShadow: c.glow,
            backfaceVisibility: 'hidden',
          }}
        />
        {/* Bottom */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: c.bottom,
            transform: `rotateX(180deg) translateZ(${h}px)`,
            backfaceVisibility: 'hidden',
          }}
        />
        {/* Front */}
        <div
          style={{
            position: 'absolute',
            width: size,
            height: size,
            left: 0,
            bottom: 0,
            background: c.front,
            transformOrigin: 'bottom center',
            transform: 'rotateX(-90deg)',
            backfaceVisibility: 'hidden',
          }}
        />
        {/* Back */}
        <div
          style={{
            position: 'absolute',
            width: size,
            height: size,
            left: 0,
            top: 0,
            background: c.back,
            transformOrigin: 'top center',
            transform: 'rotateX(90deg)',
            backfaceVisibility: 'hidden',
          }}
        />
        {/* Right */}
        <div
          style={{
            position: 'absolute',
            width: size,
            height: size,
            right: 0,
            top: 0,
            background: c.side,
            transformOrigin: 'right center',
            transform: 'rotateY(90deg)',
            backfaceVisibility: 'hidden',
          }}
        />
        {/* Left */}
        <div
          style={{
            position: 'absolute',
            width: size,
            height: size,
            left: 0,
            top: 0,
            background: c.side,
            transformOrigin: 'left center',
            transform: 'rotateY(-90deg)',
            backfaceVisibility: 'hidden',
          }}
        />
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
          {voxels.map((v) => (
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
