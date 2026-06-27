'use client'

import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from 'framer-motion'

const COLS = 5
const COLUMN_HEIGHTS = [2, 3, 4, 3, 2] as const

type HillBlock = {
  col: number
  row: number
  index: number
}

function buildHillBlocks(): HillBlock[] {
  const maxRow = Math.max(...COLUMN_HEIGHTS)
  const blocks: HillBlock[] = []
  let index = 0

  for (let row = 0; row < maxRow; row++) {
    for (let col = 0; col < COLS; col++) {
      if (row < COLUMN_HEIGHTS[col]) {
        blocks.push({ col, row, index: index++ })
      }
    }
  }

  return blocks
}

const HILL_BLOCKS = buildHillBlocks()

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3)
}

function GrassDirtBlock({ size }: { size: number }) {
  return (
    <div
      className="relative shrink-0 overflow-hidden shadow-[inset_0_0_0_1px_rgba(0,0,0,0.35)]"
      style={{
        width: size,
        height: size,
        imageRendering: 'pixelated',
      }}
    >
      <div
        className="absolute inset-x-0 top-0 h-1/2 bg-cover bg-center"
        style={{
          backgroundImage: "url('/grass-top.svg')",
          imageRendering: 'pixelated',
        }}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-1/2 bg-cover bg-center"
        style={{
          backgroundImage: "url('/dirt-block.png')",
          imageRendering: 'pixelated',
        }}
      />
    </div>
  )
}

function FallingBlock({
  block,
  total,
  scrollYProgress,
  blockSize,
  fallDistance,
}: {
  block: HillBlock
  total: number
  scrollYProgress: MotionValue<number>
  blockSize: number
  fallDistance: number
}) {
  const totalWidth = COLS * blockSize
  const left = `calc(50% - ${totalWidth / 2}px + ${block.col * blockSize}px)`
  const bottom = block.row * blockSize

  const y = useTransform(scrollYProgress, (progress) => {
    const segment = 1 / total
    const start = block.index * segment * 0.82
    const end = start + segment * 1.15

    if (progress < start) return -fallDistance
    if (progress >= end) return 0

    const t = easeOutCubic((progress - start) / (end - start))
    return -fallDistance * (1 - t)
  })

  return (
    <motion.div
      className="absolute will-change-transform"
      style={{
        left,
        bottom,
        y,
        width: blockSize,
        height: blockSize,
        zIndex: block.row * COLS + block.col,
      }}
      aria-hidden="true"
    >
      <GrassDirtBlock size={blockSize} />
    </motion.div>
  )
}

export default function ScrollHillBlocks({ children }: { children: ReactNode }) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [blockSize, setBlockSize] = useState(56)
  const [fallDistance, setFallDistance] = useState(900)

  useEffect(() => {
    const update = () => {
      const fitted = Math.floor((window.innerWidth - 24) / COLS)
      setBlockSize(Math.max(44, Math.min(64, fitted)))
      setFallDistance(window.innerHeight + 80)
    }

    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ['start end', 'end start'],
  })

  const maxRow = Math.max(...COLUMN_HEIGHTS)
  const hillHeight = maxRow * blockSize

  const blocks = useMemo(() => HILL_BLOCKS, [])

  return (
    <div ref={trackRef} className="relative [&_section]:pb-36 md:[&_section]:pb-44">
      <div
        className="pointer-events-none fixed bottom-0 left-0 right-0 z-[11] overflow-hidden"
        style={{ height: hillHeight }}
        aria-hidden="true"
      >
        <div className="relative mx-auto h-full w-full max-w-[100vw]">
          {blocks.map((block) => (
            <FallingBlock
              key={`${block.col}-${block.row}`}
              block={block}
              total={blocks.length}
              scrollYProgress={scrollYProgress}
              blockSize={blockSize}
              fallDistance={fallDistance}
            />
          ))}
        </div>

        <div
          className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-green-400/20 to-transparent"
          aria-hidden="true"
        />
      </div>

      {children}
    </div>
  )
}
