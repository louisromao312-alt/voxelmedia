'use client'

import { motion } from 'framer-motion'
import { revealTransition } from '@/components/SectionReveal'

const FLOAT = {
  duration: 3.4,
  repeat: Infinity,
  ease: 'easeInOut' as const,
}

function SpriteImg({
  src,
  className,
}: {
  src: string
  className?: string
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      draggable={false}
      className={className}
    />
  )
}

function LevitateSprite({
  src,
  className,
  inView,
  enter,
  floatDelay = 0,
  floatY = 10,
  imageClassName = 'h-auto w-full',
}: {
  src: string
  className?: string
  inView: boolean
  enter: { x?: number; y?: number; scale?: number }
  floatDelay?: number
  floatY?: number
  imageClassName?: string
}) {
  const enterT = revealTransition(inView, floatDelay, { duration: 0.75 })

  return (
    <motion.div
      className={`pointer-events-none ${className ?? ''}`}
      initial={{
        opacity: 0,
        x: enter.x ?? 0,
        y: enter.y ?? 0,
        scale: enter.scale ?? 1,
      }}
      animate={
        inView
          ? { opacity: 1, x: 0, y: 0, scale: 1 }
          : {
              opacity: 0,
              x: enter.x ?? 0,
              y: enter.y ?? 0,
              scale: enter.scale ?? 1,
            }
      }
      transition={enterT}
      aria-hidden="true"
    >
      <motion.div
        animate={inView ? { y: [0, -floatY, 0] } : { y: 0 }}
        transition={{ ...FLOAT, delay: inView ? floatDelay + 0.65 : 0 }}
      >
        <SpriteImg src={src} className={imageClassName} />
      </motion.div>
    </motion.div>
  )
}

export function BrandSprite({ inView }: { inView: boolean }) {
  return (
    <LevitateSprite
      src="/agency-bridge/brand.png"
      className="absolute z-30 bottom-0 left-0 w-[160px] -translate-x-10 sm:w-[200px] md:-left-10 md:w-[240px] lg:-left-14 lg:w-[280px]"
      inView={inView}
      enter={{ x: -48, y: 32 }}
      floatDelay={0.15}
      floatY={12}
    />
  )
}

export function StarSprite({ inView }: { inView: boolean }) {
  return (
    <LevitateSprite
      src="/agency-bridge/star.png"
      className="relative z-30 w-24 sm:w-28 md:w-32 lg:w-36"
      inView={inView}
      enter={{ y: -20, scale: 0.7 }}
      floatDelay={0.5}
      floatY={9}
      imageClassName="h-auto w-full drop-shadow-[0_0_24px_rgba(250,204,21,0.35)]"
    />
  )
}

export function CreatorSprite({ inView }: { inView: boolean }) {
  return (
    <LevitateSprite
      src="/agency-bridge/creator.png"
      className="absolute z-30 bottom-0 right-0 w-[160px] translate-x-10 sm:w-[200px] md:-right-10 md:w-[240px] lg:-right-14 lg:w-[280px]"
      inView={inView}
      enter={{ x: 48, y: 32 }}
      floatDelay={0.25}
      floatY={12}
    />
  )
}
