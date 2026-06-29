'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { revealTransition } from '@/components/SectionReveal'

const FLOAT = {
  duration: 3.4,
  repeat: Infinity,
  ease: 'easeInOut' as const,
}

const SPRITE_IMG = 'h-auto w-full mix-blend-screen'

function LevitateSprite({
  src,
  width,
  height,
  className,
  inView,
  enter,
  floatDelay = 0,
  floatY = 10,
  imageClassName = SPRITE_IMG,
}: {
  src: string
  width: number
  height: number
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
        <Image
          src={src}
          alt=""
          width={width}
          height={height}
          className={imageClassName}
        />
      </motion.div>
    </motion.div>
  )
}

export function BrandSprite({ inView }: { inView: boolean }) {
  return (
    <LevitateSprite
      src="/agency-bridge/brand.png"
      width={320}
      height={420}
      className="absolute z-0 top-1/2 -translate-y-1/2 -left-4 w-[200px] sm:w-[240px] md:-left-24 md:w-[280px] lg:-left-32 lg:w-[320px]"
      inView={inView}
      enter={{ x: -64, y: 32 }}
      floatDelay={0.15}
      floatY={12}
    />
  )
}

export function StarSprite({ inView }: { inView: boolean }) {
  return (
    <LevitateSprite
      src="/agency-bridge/star.png"
      width={160}
      height={160}
      className="relative z-10 w-24 sm:w-28 md:w-32 lg:w-36"
      inView={inView}
      enter={{ y: -20, scale: 0.7 }}
      floatDelay={0.5}
      floatY={9}
      imageClassName={`${SPRITE_IMG} drop-shadow-[0_0_24px_rgba(250,204,21,0.35)]`}
    />
  )
}

export function CreatorSprite({ inView }: { inView: boolean }) {
  return (
    <LevitateSprite
      src="/agency-bridge/creator.png"
      width={320}
      height={420}
      className="absolute z-0 top-1/2 -translate-y-1/2 -right-4 w-[200px] sm:w-[240px] md:-right-24 md:w-[280px] lg:-right-32 lg:w-[320px]"
      inView={inView}
      enter={{ x: 64, y: 32 }}
      floatDelay={0.25}
      floatY={12}
    />
  )
}
