'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { revealTransition } from '@/components/SectionReveal'

const FLOAT = {
  duration: 3.4,
  repeat: Infinity,
  ease: 'easeInOut' as const,
}

function LevitateSprite({
  src,
  width,
  height,
  className,
  inView,
  enter,
  floatDelay = 0,
  floatY = 10,
  imageClassName = 'h-auto w-full drop-shadow-[0_8px_24px_rgba(0,0,0,0.45)]',
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
      className={`pointer-events-none absolute ${className ?? ''}`}
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
      width={200}
      height={280}
      className="z-0 -bottom-8 -left-6 w-[130px] sm:w-[155px] md:-left-12 md:-bottom-6 md:w-[185px] lg:w-[210px]"
      inView={inView}
      enter={{ x: -52, y: 28 }}
      floatDelay={0.15}
      floatY={11}
    />
  )
}

export function StarSprite({ inView }: { inView: boolean }) {
  return (
    <LevitateSprite
      src="/agency-bridge/star.png"
      width={96}
      height={96}
      className="z-10 -top-10 left-1/2 w-14 -translate-x-1/2 sm:w-16 md:-top-12 md:w-[72px]"
      inView={inView}
      enter={{ y: -20, scale: 0.7 }}
      floatDelay={0.5}
      floatY={8}
      imageClassName="h-auto w-full drop-shadow-[0_0_20px_rgba(250,204,21,0.4)]"
    />
  )
}

export function CreatorSprite({ inView }: { inView: boolean }) {
  return (
    <LevitateSprite
      src="/agency-bridge/creator.png"
      width={200}
      height={280}
      className="z-0 -bottom-8 -right-6 w-[130px] sm:w-[155px] md:-right-12 md:-bottom-6 md:w-[185px] lg:w-[210px]"
      inView={inView}
      enter={{ x: 52, y: 28 }}
      floatDelay={0.25}
      floatY={11}
    />
  )
}
