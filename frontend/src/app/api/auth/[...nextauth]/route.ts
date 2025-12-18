/**
 * NextAuth.js Route Handler
 *
 * Handles authentication API routes.
 * Configuration is separated in /lib/auth-options.ts
 */

import NextAuth from 'next-auth/next'
import { authOptions } from '@/lib/auth-options'

// ============================================================================
// Route Handlers
// ============================================================================

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
