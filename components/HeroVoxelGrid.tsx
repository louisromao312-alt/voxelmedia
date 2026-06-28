'use client'

import { useEffect, useRef, useState } from 'react'
import { VoxelCell } from '@/components/VoxelBlock'
import {
  buildHeroGrid,
  HERO_BLOCK,
  HERO_CELL,
  HERO_PAD,
  type HeroGridLayout,
} from '@/lib/heroGridLayout'

const RADIUS = 130
const MAX_RISE = 22
const MAX_SCALE = 1.08

export default function HeroVoxelGrid() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [layout, setLayout] = useState<HeroGridLayout | null>(null)

  useEffect(() => {
    const calc = () => setLayout(buildHeroGrid(window.innerWidth, window.innerHeight))
    calc()
    window.addEventListener('resize', calc)
    return () => window.removeEventListener('resize', calc)
  }, [])

  useEffect(() => {
    if (!layout) return
    const el = containerRef.current
    if (!el) return

    let raf = 0
    let mx = -9999
    let my = -9999

    const onMove = (e: MouseEvent) => {
      mx = e.clientX
      my = e.clientY
    }
    window.addEventListener('mousemove', onMove, { passive: true })

    const tick = () => {
      const rect = el.getBoundingClientRect()
      el.querySelectorAll<HTMLElement>('[data-voxel]').forEach(cell => {
        const lx = Number(cell.dataset.lx)
        const ly = Number(cell.dataset.ly)
        const dist = Math.hypot(mx - (rect.left + lx), my - (rect.top + ly))
        const f = Math.max(0, 1 - dist / RADIUS)
        const eased = f * f * (3 - 2 * f)
        const rise = eased * MAX_RISE
        const scale = 1 + eased * (MAX_SCALE - 1)
        const borderAlpha = 0.1 + eased * 0.25

        cell.style.transform = `translateY(${-rise}px) scale(${scale})`
        cell.style.borderColor = `rgba(255,255,255,${borderAlpha})`
        cell.style.background =
          eased > 0.05
            ? `rgba(74,222,128,${0.04 + eased * 0.1})`
            : 'rgba(255,255,255,0.035)'
        cell.style.boxShadow =
          eased > 0.05
            ? `0 ${4 + eased * 8}px ${12 + eased * 16}px rgba(0,0,0,${0.2 + eased * 0.15}), inset 0 1px 0 rgba(255,255,255,0.1)`
            : 'inset 0 1px 0 rgba(255,255,255,0.06)'
        cell.style.zIndex = eased > 0.1 ? '2' : '1'
      })
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [layout])

  if (!layout) return null

  return (
    <div
      ref={containerRef}
      className="absolute inset-x-0 bottom-0 pointer-events-none overflow-hidden select-none"
      style={{ height: layout.height }}
      aria-hidden="true"
    >
      {layout.cells.map(({ key, left, top, lx, ly }) => (
          <div
            key={key}
            data-voxel
            data-lx={lx}
            data-ly={ly}
            className="absolute"
            style={{
              left,
              top,
              width: HERO_BLOCK,
              height: HERO_BLOCK,
              padding: HERO_PAD,
              transition:
                'transform 0.14s ease-out, border-color 0.14s, background 0.14s, box-shadow 0.14s',
              willChange: 'transform',
            }}
          >
            <VoxelCell size={HERO_CELL} />
          </div>
      ))}
    </div>
  )
}
