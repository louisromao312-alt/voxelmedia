'use client'

import { CSSProperties } from 'react'

type VoxelCellProps = {
  size: number
  className?: string
  style?: CSSProperties
  highlight?: boolean
}

/** Flat 2D grid tile — hero raster, scroll block, fly block, burst */
export function VoxelCell({ size, className = '', style, highlight }: VoxelCellProps) {
  return (
    <div
      className={className}
      style={{
        width: size,
        height: size,
        borderRadius: 2,
        border: highlight
          ? '1px solid rgba(74,222,128,0.45)'
          : '1px solid rgba(255,255,255,0.1)',
        background: highlight
          ? 'rgba(74,222,128,0.12)'
          : 'rgba(255,255,255,0.035)',
        boxShadow: highlight
          ? '0 0 16px rgba(74,222,128,0.15), inset 0 1px 0 rgba(255,255,255,0.08)'
          : 'inset 0 1px 0 rgba(255,255,255,0.06)',
        ...style,
      }}
      aria-hidden="true"
    />
  )
}

type VoxelCubeProps = {
  size: number
  rotate?: number
  tilt?: number
  opacity?: number
  className?: string
  style?: CSSProperties
}

/** Small isometric cube — floor scatter around waitlist */
export function VoxelCube({
  size,
  rotate = 0,
  tilt = 58,
  opacity = 1,
  className = '',
  style,
}: VoxelCubeProps) {
  const s = size
  const depth = s * 0.38

  return (
    <div
      className={className}
      style={{
        width: s,
        height: s + depth,
        opacity,
        perspective: 400,
        ...style,
      }}
      aria-hidden="true"
    >
      <div
        style={{
          width: s,
          height: s,
          position: 'relative',
          transformStyle: 'preserve-3d',
          transform: `rotateZ(${rotate}deg) rotateX(${tilt}deg)`,
        }}
      >
        {/* top */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(255,255,255,0.07)',
            border: '1px solid rgba(255,255,255,0.14)',
            borderRadius: 2,
            transform: `translateZ(${depth}px)`,
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.12)',
          }}
        />
        {/* front */}
        <div
          style={{
            position: 'absolute',
            width: s,
            height: depth,
            bottom: 0,
            left: 0,
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            transformOrigin: 'bottom',
            transform: 'rotateX(-90deg)',
          }}
        />
        {/* side */}
        <div
          style={{
            position: 'absolute',
            width: depth,
            height: s,
            top: 0,
            right: 0,
            background: 'rgba(255,255,255,0.025)',
            border: '1px solid rgba(255,255,255,0.06)',
            transformOrigin: 'right',
            transform: 'rotateY(90deg)',
          }}
        />
      </div>
    </div>
  )
}
