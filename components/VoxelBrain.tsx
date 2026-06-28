'use client'

import { useMemo } from 'react'
import { generateBrainVoxels, BRAIN_BLOCK_SIZE, type BrainVoxel } from '@/lib/voxelBrainLayout'

const GLOW_STYLES: Record<
  BrainVoxel['glow'],
  { face: string; glow?: string }
> = {
  core: {
    face: 'rgba(74,222,128,0.4)',
    glow: '0 0 16px rgba(74,222,128,0.4)',
  },
  mid: {
    face: 'rgba(74,222,128,0.18)',
    glow: '0 0 8px rgba(74,222,128,0.18)',
  },
  surface: {
    face: 'rgba(255,255,255,0.075)',
  },
  none: {
    face: 'rgba(255,255,255,0.05)',
  },
}

function VoxelCube({ v, size }: { v: BrainVoxel; size: number }) {
  const s = GLOW_STYLES[v.glow]
  const h = size / 2

  const face = (shade: number) =>
    v.glow === 'core' || v.glow === 'mid'
      ? `rgba(74,222,128,${shade})`
      : `rgba(255,255,255,${shade})`

  const faces = [
    {
      name: 'front',
      bg: face(0.07),
      transform: `rotateY(0deg) translateZ(${h}px)`,
      shadow: s.glow,
    },
    {
      name: 'back',
      bg: face(0.04),
      transform: `rotateY(180deg) translateZ(${h}px)`,
    },
    {
      name: 'right',
      bg: face(0.05),
      transform: `rotateY(90deg) translateZ(${h}px)`,
    },
    {
      name: 'left',
      bg: face(0.04),
      transform: `rotateY(-90deg) translateZ(${h}px)`,
    },
    {
      name: 'top',
      bg: s.face,
      transform: `rotateX(90deg) translateZ(${h}px)`,
      shadow: s.glow,
    },
    {
      name: 'bottom',
      bg: face(0.03),
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
              'radial-gradient(circle, rgba(74,222,128,0.26) 0%, rgba(74,222,128,0.09) 38%, transparent 70%)',
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
