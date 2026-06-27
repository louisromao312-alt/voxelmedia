'use client'

import { useRef, type ReactNode } from 'react'
import { motion, useInView } from 'framer-motion'

export const EASE = [0.16, 1, 0.3, 1] as const

const motionProps = {
  initial: { opacity: 0, scale: 0.97, y: 28 },
  transition: { duration: 0.75, ease: EASE },
} as const

export default function SectionReveal({
  children,
  className = '',
  id,
  delay = 0,
  as = 'section',
}: {
  children: ReactNode
  className?: string
  id?: string
  delay?: number
  as?: 'section' | 'div'
}) {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.18 })

  const animate = isInView
    ? { opacity: 1, scale: 1, y: 0 }
    : { opacity: 0, scale: 0.97, y: 28 }

  const transition = { ...motionProps.transition, delay }

  if (as === 'div') {
    return (
      <motion.div
        ref={ref as React.RefObject<HTMLDivElement>}
        id={id}
        initial={motionProps.initial}
        animate={animate}
        transition={transition}
        className={className}
      >
        {children}
      </motion.div>
    )
  }

  return (
    <motion.section
      ref={ref as React.RefObject<HTMLElement>}
      id={id}
      initial={motionProps.initial}
      animate={animate}
      transition={transition}
      className={className}
    >
      {children}
    </motion.section>
  )
}
