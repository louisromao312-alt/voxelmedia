'use client'

import { useMemo } from 'react'
import { generateBrainVoxels, type BrainVoxel } from '@/lib/voxelBrainLayout'

const GLOW_STYLES: Record<
  BrainVoxel['glow'],
  { bg: string; border: string; shadow: string }
> = {
  core: {
    bg: 'rgba(74,222,128,0.38)',
    border: '1px solid rgba(74,222,128,0.65)',
    shadow:
      '0 0 18px rgba(74,222,128,0.55), 0 0 32px rgba(74,222,128,0.2), inset 0 0 8px rgba(74,222,128,0.35)',
  },
  mid: {
    bg: 'rgba(74,222,128,0.18)',
    border: '1px solid rgba(74,222,128,0.42)',
    shadow:
      '0 0 12px rgba(74,222,128,0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
  },
  surface: {
    bg: 'rgba(255,255,255,0.07)',
    border: '1px solid rgba(255,255,255,0.14)',
    shadow: 'inset 0 1px 0 rgba(255,255,255,0.08)',
  },
  none: {
    bg: 'rgba(255,255,255,0.045)',
    border: '1px solid rgba(255,255,255,0.1)',
    shadow: 'inset 0 1px 0 rgba(255,255,255,0.05)',
  },
}

function VoxelCell({ v, size }: { v: BrainVoxel; size: number }) {
  const style = GLOW_STYLES[v.glow]
  const half = size / 2
  const depth = size * 0.35

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
            borderRadius: 2,
            background: style.bg,
            border: style.border,
            boxShadow: style.shadow,
            transform: `translateZ(${depth}px)`,
          }}
        />
        <div
          style={{
            position: 'absolute',
            width: size,
            height: depth,
            bottom: 0,
            left: 0,
            background:
              v.glow === 'core' || v.glow === 'mid'
                ? 'rgba(74,222,128,0.12)'
                : 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.06)',
            transformOrigin: 'bottom',
            transform: 'rotateX(-90deg)',
            borderRadius: 1,
          }}
        />
        <div
          style={{
            position: 'absolute',
            width: depth,
            height: size,
            top: 0,
            right: 0,
            background: 'rgba(255,255,255,0.025)',
            border: '1px solid rgba(255,255,255,0.05)',
            transformOrigin: 'right',
            transform: 'rotateY(90deg)',
            borderRadius: 1,
          }}
        />
      </div>
    </div>
  )
}

export default function VoxelBrain() {
  const voxels = useMemo(() => generateBrainVoxels(), [])
  const voxelSize = 11

  return (
    <div
      className="pointer-events-none absolute inset-0 z-[1] flex items-center justify-center overflow-visible"
      aria-hidden="true"
    >
      <div
        className="relative flex items-center justify-center"
        style={{
          width: 'min(1100px, 150vw)',
          height: 'min(1000px, 115vw)',
          perspective: 1400,
        }}
      >
        <div
          className="pointer-events-none absolute rounded-full"
          style={{
            width: '42%',
            height: '42%',
            background:
              'radial-gradient(circle, rgba(74,222,128,0.22) 0%, rgba(74,222,128,0.08) 35%, transparent 70%)',
            filter: 'blur(28px)',
          }}
        />

        <div
          className="voxel-brain-rotate"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {voxels.map((v, i) => (
            <VoxelCell key={i} v={v} size={voxelSize} />
          ))}
        </div>
      </div>

      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 78% 72% at 50% 48%, transparent 0%, rgba(10,10,12,0.35) 62%, rgba(10,10,12,0.9) 100%)',
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, rgba(74,222,128,0.09) 0%, transparent 52%)',
        }}
      />
    </div>
  )
}
