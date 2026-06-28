'use client'

import { useMemo } from 'react'
import { generateBrainVoxels } from '@/lib/voxelBrainLayout'

export default function VoxelBrain() {
  const voxels = useMemo(() => generateBrainVoxels(), [])

  return (
    <div
      className="pointer-events-none absolute inset-0 z-[1] flex items-center justify-center overflow-hidden"
      aria-hidden="true"
    >
      <div
        className="relative flex items-center justify-center"
        style={{
          width: 'min(380px, 88vw)',
          height: 'min(380px, 70vw)',
          perspective: 1000,
        }}
      >
        <div className="voxel-brain-rotate" style={{ transformStyle: 'preserve-3d' }}>
          {voxels.map((v, i) => (
            <div
              key={i}
              className="absolute"
              style={{
                width: 6,
                height: 6,
                left: -3,
                top: -3,
                transform: `translate3d(${v.x}px, ${v.y}px, ${v.z}px)`,
                transformStyle: 'preserve-3d',
              }}
            >
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: 1,
                  background: v.highlight
                    ? 'rgba(74,222,128,0.22)'
                    : 'rgba(255,255,255,0.055)',
                  border: v.highlight
                    ? '1px solid rgba(74,222,128,0.4)'
                    : '1px solid rgba(255,255,255,0.11)',
                  boxShadow: v.highlight
                    ? '0 0 10px rgba(74,222,128,0.25)'
                    : 'inset 0 1px 0 rgba(255,255,255,0.06)',
                }}
              />
            </div>
          ))}
        </div>
      </div>

      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 55% 50% at 50% 48%, transparent 0%, rgba(10,10,12,0.55) 55%, rgba(10,10,12,0.92) 100%)',
        }}
      />
      <div
        className="absolute inset-0 opacity-40"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, rgba(74,222,128,0.06) 0%, transparent 55%)',
        }}
      />
    </div>
  )
}
