'use client'

/**
 * Session Provider Component
 *
 * Wraps the application with NextAuth SessionProvider.
 * Enables client-side session management and access to useSession hook.
 */

import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react'
import { ReactNode } from 'react'

interface SessionProviderProps {
  children: ReactNode
}

export function SessionProvider({ children }: SessionProviderProps) {
  return <NextAuthSessionProvider>{children}</NextAuthSessionProvider>
}
