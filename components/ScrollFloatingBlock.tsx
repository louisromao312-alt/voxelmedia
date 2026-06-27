'use client'

import { useRef, type ReactNode } from 'react'
import Image from 'next/image'
import { motion, useScroll, useTransform } from 'framer-motion'

export default function ScrollFloatingBlock({
  children,
}: {
  children: ReactNode
}) {
  const trackRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ['start end', 'end start'],
  })

  // Cross the viewport once while the middle section scrolls through
  const x = useTransform(scrollYProgress, [0, 1], ['-62vw', '62vw'])
  const y = useTransform(scrollYProgress, [0, 0.25, 0.5, 0.75, 1], [30, -18, 8, -12, 24])
  const rotate = useTransform(scrollYProgress, [0, 0.5, 1], [-18, 6, 20])
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.06, 0.94, 1],
    [0, 1, 1, 0],
  )
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.72, 1, 0.78])

  return (
    <div ref={trackRef} className="relative">
      {/* Scroll-driven grass block — fixed to viewport while track is active */}
      <motion.div
        className="pointer-events-none fixed top-[44%] left-1/2 z-[12] -translate-x-1/2 -translate-y-1/2"
        style={{ x, y, rotate, opacity, scale }}
        aria-hidden="true"
      >
        <div
          className="relative w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44"
          style={{ mixBlendMode: 'screen' }}
        >
          <Image
            src="/grass-block.png"
            alt=""
            fill
            className="object-contain drop-shadow-[0_0_40px_rgba(74,222,128,0.2)]"
            sizes="(max-width: 768px) 112px, 176px"
          />
        </div>
      </motion.div>

      {children}
    </div>
  )
}
