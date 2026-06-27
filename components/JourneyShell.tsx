'use client'

import { UserJourneyProvider } from '@/context/UserJourneyContext'
import type { ReactNode } from 'react'

export default function JourneyShell({ children }: { children: ReactNode }) {
  return <UserJourneyProvider>{children}</UserJourneyProvider>
}
