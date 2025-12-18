/**
 * Public Layout
 *
 * Layout for public pages (login, register, etc.)
 * No authentication required.
 */

import { ReactNode } from 'react'

interface PublicLayoutProps {
  children: ReactNode
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  return <>{children}</>
}
