'use client'

import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export default function VoxelCursor() {
  const mouseX = useMotionValue(-100)
  const mouseY = useMotionValue(-100)
  const springX = useSpring(mouseX, { stiffness: 120, damping: 22, mass: 0.8 })
  const springY = useSpring(mouseY, { stiffness: 120, damping: 22, mass: 0.8 })
  const [isTouch, setIsTouch] = useState(true)
  const [visible, setVisible] = useState(false)
  const [pressing, setPressing] = useState(false)

  useEffect(() => {
    const coarse = window.matchMedia('(pointer: coarse)').matches
    setIsTouch(coarse)
    if (coarse) return

    document.body.classList.add('voxel-cursor-active')

    const onMove = (e: MouseEvent) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
      if (!visible) setVisible(true)
    }

    const onLeave = () => setVisible(false)
    const onEnter = () => setVisible(true)
    const onDown = () => setPressing(true)
    const onUp = () => setPressing(false)

    window.addEventListener('mousemove', onMove, { passive: true })
    document.documentElement.addEventListener('mouseleave', onLeave)
    document.documentElement.addEventListener('mouseenter', onEnter)
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)

    return () => {
      document.body.classList.remove('voxel-cursor-active')
      window.removeEventListener('mousemove', onMove)
      document.documentElement.removeEventListener('mouseleave', onLeave)
      document.documentElement.removeEventListener('mouseenter', onEnter)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
    }
  }, [mouseX, mouseY])

  if (isTouch) return null

  return (
    <motion.div
      className="pointer-events-none fixed top-0 left-0 z-[10000]"
      style={{ x: springX, y: springY }}
      animate={{
        opacity: visible ? 1 : 0,
        scale: pressing ? 0.82 : 1,
      }}
      transition={{ opacity: { duration: 0.15 }, scale: { duration: 0.12 } }}
      aria-hidden="true"
    >
      {/* Voxel logo mark — rotated wireframe cube */}
      <div
        className="relative -translate-x-1/2 -translate-y-1/2"
        style={{ width: 22, height: 22 }}
      >
        <div
          className="absolute inset-0 border border-white/50 rotate-45 rounded-[1px]"
          style={{
            boxShadow:
              '0 0 12px rgba(255,255,255,0.25), 0 0 24px rgba(74,222,128,0.12)',
          }}
        />
        <div
          className="absolute inset-[5px] border border-white/20 rotate-45 rounded-[1px]"
          aria-hidden="true"
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-green-400/80" />
      </div>
    </motion.div>
  )
}
