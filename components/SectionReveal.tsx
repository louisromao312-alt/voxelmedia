'use client'

import { useRef, type ReactNode } from 'react'
import { motion, useInView, type Transition } from 'framer-motion'

export const EASE = [0.16, 1, 0.3, 1] as const

const hidden = { opacity: 0, scale: 0.97, y: 28 }
const visible = { opacity: 1, scale: 1, y: 0 }

type RevealTransitionOptions = {
  duration?: number
  index?: number
  count?: number
  stagger?: number
}

/** Enter uses forward delay; exit reverses stagger with no enter hold. */
export function revealTransition(
  inView: boolean,
  enterDelay = 0,
  {
    duration = 0.75,
    index = 0,
    count = 1,
    stagger = 0.1,
  }: RevealTransitionOptions = {},
): Transition {
  const delay = inView
    ? enterDelay + index * stagger
    : Math.max(0, (count - 1 - index) * stagger * 0.65)

  return { duration, ease: EASE, delay }
}

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
  const isInView = useInView(ref, { once: false, amount: 0.18 })

  const transition = revealTransition(isInView, delay)

  if (as === 'div') {
    return (
      <motion.div
        ref={ref as React.RefObject<HTMLDivElement>}
        id={id}
        initial={hidden}
        animate={isInView ? visible : hidden}
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
      initial={hidden}
      animate={isInView ? visible : hidden}
      transition={transition}
      className={className}
    >
      {children}
    </motion.section>
  )
}
