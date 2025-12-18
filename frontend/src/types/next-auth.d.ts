/**
 * NextAuth Type Extensions
 *
 * Extends NextAuth default types to include custom user fields.
 * This ensures type safety across the authentication system.
 */

import { UserRole } from '@prisma/client'
import { DefaultSession, DefaultUser } from 'next-auth'
import { DefaultJWT } from 'next-auth/jwt'

// ============================================================================
// Module Augmentation
// ============================================================================

declare module 'next-auth' {
  /**
   * Extended Session type with custom user fields
   */
  interface Session {
    user: {
      id: string
      email: string
      name: string
      role: UserRole
      image?: string | null
    } & DefaultSession['user']
  }

  /**
   * Extended User type with custom fields
   */
  interface User extends DefaultUser {
    role: UserRole
    emailVerified?: Date | null
  }
}

declare module 'next-auth/jwt' {
  /**
   * Extended JWT type with custom fields
   */
  interface JWT extends DefaultJWT {
    id: string
    role: UserRole
  }
}
