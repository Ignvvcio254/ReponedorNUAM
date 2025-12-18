/**
 * NextAuth.js Configuration
 *
 * Enterprise-grade authentication system with:
 * - JWT-based sessions
 * - Password hashing with bcryptjs
 * - Failed login attempt tracking
 * - Account locking mechanism
 * - Audit logging
 * - RBAC integration
 */

import { NextAuthOptions } from 'next-auth'
import NextAuth from 'next-auth/next'
import CredentialsProvider from 'next-auth/providers/credentials'
import { compare } from 'bcryptjs'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { db } from '@/lib/db'
import type { AuthUser } from '@/types/auth'

// ============================================================================
// Constants
// ============================================================================

const MAX_FAILED_ATTEMPTS = 5
const LOCK_DURATION_MINUTES = 30

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Check if account is locked due to failed login attempts
 */
async function isAccountLocked(userId: string): Promise<boolean> {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { lockedUntil: true, failedLoginAttempts: true },
  })

  if (!user) return false

  // Check if account is currently locked
  if (user.lockedUntil && user.lockedUntil > new Date()) {
    return true
  }

  // Reset lock if expired
  if (user.lockedUntil && user.lockedUntil <= new Date()) {
    await db.user.update({
      where: { id: userId },
      data: {
        lockedUntil: null,
        failedLoginAttempts: 0,
      },
    })
  }

  return false
}

/**
 * Handle failed login attempt
 */
async function handleFailedLogin(userId: string): Promise<void> {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { failedLoginAttempts: true },
  })

  if (!user) return

  const attempts = user.failedLoginAttempts + 1
  const isLocked = attempts >= MAX_FAILED_ATTEMPTS

  await db.user.update({
    where: { id: userId },
    data: {
      failedLoginAttempts: attempts,
      lockedUntil: isLocked
        ? new Date(Date.now() + LOCK_DURATION_MINUTES * 60 * 1000)
        : null,
    },
  })

  // Create audit log for failed attempt
  await db.auditLog.create({
    data: {
      action: 'LOGIN_FAILED',
      entityType: 'User',
      entityId: userId,
      userId: userId,
      details: {
        attempts,
        locked: isLocked,
      },
    },
  })
}

/**
 * Handle successful login
 */
async function handleSuccessfulLogin(
  userId: string,
  ipAddress?: string
): Promise<void> {
  await db.user.update({
    where: { id: userId },
    data: {
      failedLoginAttempts: 0,
      lockedUntil: null,
      lastLoginAt: new Date(),
      lastLoginIp: ipAddress || null,
    },
  })

  // Create audit log for successful login
  await db.auditLog.create({
    data: {
      action: 'LOGIN_SUCCESS',
      entityType: 'User',
      entityId: userId,
      userId: userId,
      details: {
        ipAddress,
        timestamp: new Date().toISOString(),
      },
    },
  })
}

// ============================================================================
// NextAuth Configuration
// ============================================================================

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db) as any,

  // JWT-based sessions for scalability
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  // Security pages
  pages: {
    signIn: '/login',
    signOut: '/login',
    error: '/login',
  },

  // Authentication providers
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required')
        }

        // Find user by email
        const user = await db.user.findUnique({
          where: { email: credentials.email },
        })

        if (!user) {
          throw new Error('Invalid email or password')
        }

        // Check if account is active
        if (!user.isActive) {
          throw new Error('Account is inactive. Contact administrator.')
        }

        // Check if account is locked
        const locked = await isAccountLocked(user.id)
        if (locked) {
          throw new Error(
            `Account locked due to multiple failed attempts. Try again in ${LOCK_DURATION_MINUTES} minutes.`
          )
        }

        // Verify password
        const isPasswordValid = await compare(
          credentials.password,
          user.password
        )

        if (!isPasswordValid) {
          await handleFailedLogin(user.id)
          throw new Error('Invalid email or password')
        }

        // Handle successful login
        const ipAddress = req.headers?.['x-forwarded-for'] as string
        await handleSuccessfulLogin(user.id, ipAddress)

        // Return user object for session
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          image: user.image,
          emailVerified: user.emailVerified,
        }
      },
    }),
  ],

  // Callbacks for session and JWT management
  callbacks: {
    // JWT callback - runs when JWT is created or updated
    async jwt({ token, user, trigger, session }) {
      // Initial sign in
      if (user) {
        token.id = user.id
        token.email = user.email
        token.name = user.name
        token.role = (user as AuthUser).role
        token.image = user.image
      }

      // Update session (for profile updates)
      if (trigger === 'update' && session) {
        token.name = session.name
        token.image = session.image
      }

      return token
    },

    // Session callback - runs when session is checked
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.email = token.email as string
        session.user.name = token.name as string
        session.user.role = token.role as any
        session.user.image = token.image as string
      }

      return session
    },
  },

  // Security events logging
  events: {
    async signIn({ user, isNewUser }) {
      if (isNewUser) {
        await db.auditLog.create({
          data: {
            action: 'USER_REGISTERED',
            entityType: 'User',
            entityId: user.id,
            userId: user.id,
            details: {
              email: user.email,
              name: user.name,
            },
          },
        })
      }
    },

    async signOut({ token }) {
      if (token?.id) {
        await db.auditLog.create({
          data: {
            action: 'LOGOUT',
            entityType: 'User',
            entityId: token.id as string,
            userId: token.id as string,
            details: {
              timestamp: new Date().toISOString(),
            },
          },
        })
      }
    },
  },

  // Enable debug in development
  debug: process.env.NODE_ENV === 'development',
}

// ============================================================================
// Route Handlers
// ============================================================================

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
