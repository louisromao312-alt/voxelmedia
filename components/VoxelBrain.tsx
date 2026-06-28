'use client'

import { useMemo } from 'react'
import { generateBrainVoxels, type BrainVoxel } from '@/lib/voxelBrainLayout'

const GLOW_STYLES: Record<
  BrainVoxel['glow'],
  { top: string; front: string; side: string; border: string; glow?: string }
> = {
  core: {
    top: 'rgba(74,222,128,0.42)',
    front: 'rgba(74,222,128,0.2)',
    side: 'rgba(74,222,128,0.14)',
    border: 'rgba(74,222,128,0.55)',
    glow: '0 0 20px rgba(74,222,128,0.45)',
  },
  mid: {
    top: 'rgba(74,222,128,0.2)',
    front: 'rgba(74,222,128,0.1)',
    side: 'rgba(74,222,128,0.07)',
    border: 'rgba(74,222,128,0.35)',
    glow: '0 0 10px rgba(74,222,128,0.2)',
  },
  surface: {
    top: 'rgba(255,255,255,0.08)',
    front: 'rgba(255,255,255,0.04)',
    side: 'rgba(255,255,255,0.03)',
    border: 'rgba(255,255,255,0.14)',
  },
  none: {
    top: 'rgba(255,255,255,0.055)',
    front: 'rgba(255,255,255,0.03)',
    side: 'rgba(255,255,255,0.02)',
    border: 'rgba(255,255,255,0.1)',
  },
}

function VoxelCube({ v, size }: { v: BrainVoxel; size: number }) {
  const s = GLOW_STYLES[v.glow]
  const d = size * 0.4
  const half = size / 2

  return (
    <div
      className="absolute"
      style={{
        width: size,
        height: size,
        left: -half,
        top: -half,
        transform: `translate3d(${v.x}px, ${v.y}px, ${v.z}px)`,
        transformStyle: 'preserve-3d',
        willChange: 'transform',
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
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 3,
            background: s.top,
            border: `1px solid ${s.border}`,
            boxShadow: s.glow,
            transform: `translateZ(${d}px)`,
            backfaceVisibility: 'hidden',
          }}
        />
        <div
          style={{
            position: 'absolute',
            width: size,
            height: d,
            bottom: 0,
            left: 0,
            borderRadius: 2,
            background: s.front,
            border: `1px solid ${s.border}`,
            transformOrigin: 'bottom',
            transform: 'rotateX(-90deg)',
            backfaceVisibility: 'hidden',
          }}
        />
        <div
          style={{
            position: 'absolute',
            width: d,
            height: size,
            top: 0,
            right: 0,
            borderRadius: 2,
            background: s.side,
            border: `1px solid ${s.border}`,
            transformOrigin: 'right',
            transform: 'rotateY(90deg)',
            backfaceVisibility: 'hidden',
          }}
        />
      </div>
    </div>
  )
}

export default function VoxelBrain() {
  const voxels = useMemo(() => generateBrainVoxels(), [])
  const blockSize = 22

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
          perspective: 1600,
          contain: 'layout style',
        }}
      >
        <div
          className="pointer-events-none absolute rounded-full"
          style={{
            width: '48%',
            height: '48%',
            background:
              'radial-gradient(circle, rgba(74,222,128,0.24) 0%, rgba(74,222,128,0.08) 40%, transparent 72%)',
            filter: 'blur(40px)',
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
            <VoxelCube key={i} v={v} size={blockSize} />
          ))}
        </div>
      </div>

      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 82% 76% at 50% 48%, transparent 0%, rgba(10,10,12,0.32) 64%, rgba(10,10,12,0.92) 100%)',
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, rgba(74,222,128,0.1) 0%, transparent 54%)',
        }}
      />
    </div>
  )
}
