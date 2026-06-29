'use client'

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from 'react'

export type UserRole = 'creator' | 'brand' | null

type UserJourneyContextValue = {
  role: UserRole
  setRole: (role: UserRole) => void
}

const UserJourneyContext = createContext<UserJourneyContextValue | null>(null)

export function UserJourneyProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<UserRole>(null)

  return (
    <UserJourneyContext.Provider value={{ role, setRole }}>
      {children}
    </UserJourneyContext.Provider>
  )
}

export function useUserJourney() {
  const ctx = useContext(UserJourneyContext)
  if (!ctx) {
    throw new Error('useUserJourney must be used within UserJourneyProvider')
  }
  return ctx
}

export const HERO_COPY = {
  default: {
    headline: 'THE INDUSTRY RECORD FOR\nTHE UGC GAME ECONOMY.',
    sub: 'The data engine for the Minecraft creator economy. Uncover the mechanics behind viral modpacks, server trends, and content formats. Choose your path below.',
  },
  creator: {
    headline: 'SCALE YOUR CRAFT\nWITH DATA.',
    sub: 'Real-time trend analysis and performance insights for Minecraft creators.',
  },
  brand: {
    headline: 'MARKET ENTRY,\nMADE COMPLIANT.',
    sub: 'Bridge the gap between your brand and 182M+ monthly active players with EULA-compliant strategies.',
  },
} as const
