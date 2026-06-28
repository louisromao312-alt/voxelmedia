'use client'

import { useMemo } from 'react'
import { generateBrainVoxels, BRAIN_BLOCK_SIZE, type BrainVoxel } from '@/lib/voxelBrainLayout'

const GLOW_STYLES: Record<
  BrainVoxel['glow'],
  { top: string; side: string; glow?: string }
> = {
  core: {
    top: 'rgba(74,222,128,0.82)',
    side: 'rgba(74,222,128,0.55)',
    glow: '0 0 20px rgba(74,222,128,0.55)',
  },
  mid: {
    top: 'rgba(74,222,128,0.52)',
    side: 'rgba(74,222,128,0.38)',
    glow: '0 0 12px rgba(74,222,128,0.3)',
  },
  surface: {
    top: 'rgba(200,230,210,0.38)',
    side: 'rgba(180,210,190,0.28)',
  },
  none: {
    top: 'rgba(190,205,195,0.32)',
    side: 'rgba(170,185,175,0.24)',
  },
}

function VoxelCube({ v, size }: { v: BrainVoxel; size: number }) {
  const s = GLOW_STYLES[v.glow]
  const h = size / 2
  const isGreen = v.glow === 'core' || v.glow === 'mid'

  const faces = [
    {
      name: 'front',
      bg: isGreen ? 'rgba(74,222,128,0.42)' : s.side,
      transform: `rotateY(0deg) translateZ(${h}px)`,
      shadow: s.glow,
    },
    {
      name: 'back',
      bg: isGreen ? 'rgba(74,222,128,0.32)' : 'rgba(150,170,160,0.22)',
      transform: `rotateY(180deg) translateZ(${h}px)`,
    },
    {
      name: 'right',
      bg: isGreen ? 'rgba(74,222,128,0.36)' : s.side,
      transform: `rotateY(90deg) translateZ(${h}px)`,
    },
    {
      name: 'left',
      bg: isGreen ? 'rgba(74,222,128,0.3)' : 'rgba(150,170,160,0.2)',
      transform: `rotateY(-90deg) translateZ(${h}px)`,
    },
    {
      name: 'top',
      bg: s.top,
      transform: `rotateX(90deg) translateZ(${h}px)`,
      shadow: s.glow,
    },
    {
      name: 'bottom',
      bg: isGreen ? 'rgba(74,222,128,0.28)' : 'rgba(130,145,135,0.18)',
      transform: `rotateX(-90deg) translateZ(${h}px)`,
    },
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
              boxShadow: 'shadow' in f ? f.shadow : undefined,
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
