'use client'

import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react'

type Burst = { id: number; x: number; y: number }
type Ctx = { triggerBurst: (x: number, y: number) => void; bursts: Burst[] }

const BlockBurstCtx = createContext<Ctx>({ triggerBurst: () => {}, bursts: [] })

export function BlockBurstProvider({ children }: { children: ReactNode }) {
  const [bursts, setBursts] = useState<Burst[]>([])
  const nextId = useRef(0)

  const triggerBurst = useCallback((x: number, y: number) => {
    const id = ++nextId.current
    setBursts(prev => [...prev, { id, x, y }])
    window.setTimeout(() => {
      setBursts(prev => prev.filter(b => b.id !== id))
    }, 1100)
  }, [])

  return (
    <BlockBurstCtx.Provider value={{ triggerBurst, bursts }}>
      {children}
    </BlockBurstCtx.Provider>
  )
}

export const useBurst = () => useContext(BlockBurstCtx)
