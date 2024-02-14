'use client'

import { ReactNode } from 'react'
import { SessionProvider } from 'next-auth/react'

interface NextAuthSessionProviderProps {
  children: ReactNode
}

export function NextAuthSessionProvider({
  children,
}: NextAuthSessionProviderProps) {
  return <SessionProvider>{children}</SessionProvider>
}
