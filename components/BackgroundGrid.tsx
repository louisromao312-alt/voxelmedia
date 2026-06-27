'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

interface GlowPoint {
  id: number
  x: number
  y: number
}

const GRID_SIZE = 80

export default function BackgroundGrid() {
  const mouseX = useMotionValue(-1000)
  const mouseY = useMotionValue(-1000)
  const springX = useSpring(mouseX, { stiffness: 60, damping: 25 })
  const springY = useSpring(mouseY, { stiffness: 60, damping: 25 })
  const [glowPoints, setGlowPoints] = useState<GlowPoint[]>([])
  const [isMobile, setIsMobile] = useState(true)
  const counterRef = useRef(0)

  useEffect(() => {
    const check = () =>
      setIsMobile(window.matchMedia('(pointer: coarse)').matches)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    if (isMobile) return
    const handleMove = (e: MouseEvent) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
    }
    window.addEventListener('mousemove', handleMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMove)
  }, [isMobile, mouseX, mouseY])

  // Random grid intersection glows across the full page height
  useEffect(() => {
    const spawn = () => {
      const cols = Math.ceil(window.innerWidth / GRID_SIZE)
      const rows = Math.ceil(document.body.scrollHeight / GRID_SIZE)
      const x = Math.floor(Math.random() * cols) * GRID_SIZE
      const y = Math.floor(Math.random() * rows) * GRID_SIZE
      const id = ++counterRef.current
      setGlowPoints(prev => [...prev.slice(-10), { id, x, y }])
    }
    const timer = setInterval(spawn, 500)
    spawn()
    return () => clearInterval(timer)
  }, [])

  return (
    <>
      {/* Grid + glow layer */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{ zIndex: 0 }}
        aria-hidden="true"
      >
        {/* CSS background grid */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.028) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.028) 1px, transparent 1px)
            `,
            backgroundSize: `${GRID_SIZE}px ${GRID_SIZE}px`,
          }}
        />

        {/* Randomly glowing intersection dots */}
        {glowPoints.map(pt => (
          <motion.div
            key={pt.id}
            className="absolute rounded-full"
            style={{
              left: pt.x - 2,
              top: pt.y - 2,
              width: 4,
              height: 4,
              background: 'rgba(255,255,255,0.9)',
              boxShadow: '0 0 6px 2px rgba(255,255,255,0.4)',
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0, 0.7, 0], scale: [0.2, 1.6, 0.2] }}
            transition={{ duration: 1.8, ease: 'easeInOut' }}
          />
        ))}

        {/* Mouse-following glow — desktop only */}
        {!isMobile && (
          <motion.div
            className="absolute rounded-full pointer-events-none"
            style={{
              width: 420,
              height: 420,
              x: springX,
              y: springY,
              translateX: '-50%',
              translateY: '-50%',
              background:
                'radial-gradient(circle, rgba(255,255,255,0.045) 0%, rgba(255,255,255,0.01) 40%, transparent 70%)',
            }}
          />
        )}
      </div>
    </>
  )
}
