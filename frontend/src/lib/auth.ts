/**
 * Authentication Utilities
 *
 * Provides helper functions for authentication and session management.
 * Used across the application for consistent auth handling.
 */

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { UserRole } from '@prisma/client'
import { PermissionChecker } from '@/lib/permissions'
import type { AuthUser, Resource, Action } from '@/types/auth'

// ============================================================================
// Session Management
// ============================================================================

/**
 * Get current authenticated user from session
 * Server-side only
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return null
  }

  return {
    id: session.user.id,
    email: session.user.email,
    name: session.user.name,
    role: session.user.role,
    image: session.user.image,
  }
}

/**
 * Require authentication or throw error
 * Server-side only
 */
export async function requireAuth(): Promise<AuthUser> {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error('Unauthorized - Authentication required')
  }

  return user
}

/**
 * Require specific role or throw error
 * Server-side only
 */
export async function requireRole(
  allowedRoles: UserRole[]
): Promise<AuthUser> {
  const user = await requireAuth()

  if (!allowedRoles.includes(user.role)) {
    throw new Error(
      `Forbidden - Required role: ${allowedRoles.join(' or ')}`
    )
  }

  return user
}

/**
 * Require specific permission or throw error
 * Server-side only
 */
export async function requirePermission(
  resource: Resource,
  action: Action
): Promise<AuthUser> {
  const user = await requireAuth()
  const checker = new PermissionChecker(user.role)

  if (!checker.can(resource, action)) {
    throw new Error(
      `Forbidden - Required permission: ${action} on ${resource}`
    )
  }

  return user
}

// ============================================================================
// Permission Checks
// ============================================================================

/**
 * Check if current user has permission
 * Server-side only
 */
export async function hasPermission(
  resource: Resource,
  action: Action
): Promise<boolean> {
  const user = await getCurrentUser()

  if (!user) {
    return false
  }

  const checker = new PermissionChecker(user.role)
  return checker.can(resource, action)
}

/**
 * Check if current user has role
 * Server-side only
 */
export async function hasRole(role: UserRole | UserRole[]): Promise<boolean> {
  const user = await getCurrentUser()

  if (!user) {
    return false
  }

  if (Array.isArray(role)) {
    return role.includes(user.role)
  }

  return user.role === role
}

/**
 * Check if current user is admin
 * Server-side only
 */
export async function isAdmin(): Promise<boolean> {
  return hasRole('ADMIN')
}

/**
 * Check if current user can approve
 * Server-side only
 */
export async function canApprove(): Promise<boolean> {
  const user = await getCurrentUser()

  if (!user) {
    return false
  }

  const checker = new PermissionChecker(user.role)
  return checker.canApprove()
}

// ============================================================================
// Validation Helpers
// ============================================================================

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate password strength
 * Requirements: min 8 chars, uppercase, lowercase, number, special char
 */
export function isValidPassword(password: string): boolean {
  const minLength = 8
  const hasUpperCase = /[A-Z]/.test(password)
  const hasLowerCase = /[a-z]/.test(password)
  const hasNumber = /[0-9]/.test(password)
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)

  return (
    password.length >= minLength &&
    hasUpperCase &&
    hasLowerCase &&
    hasNumber &&
    hasSpecialChar
  )
}

/**
 * Get password strength message
 */
export function getPasswordStrengthMessage(password: string): string {
  if (password.length < 8) {
    return 'Password must be at least 8 characters long'
  }
  if (!/[A-Z]/.test(password)) {
    return 'Password must contain at least one uppercase letter'
  }
  if (!/[a-z]/.test(password)) {
    return 'Password must contain at least one lowercase letter'
  }
  if (!/[0-9]/.test(password)) {
    return 'Password must contain at least one number'
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return 'Password must contain at least one special character'
  }
  return 'Password is strong'
}

// ============================================================================
// Error Handlers
// ============================================================================

/**
 * Create standardized auth error response
 */
export function createAuthError(message: string, status: number = 401) {
  return {
    error: message,
    status,
    timestamp: new Date().toISOString(),
  }
}

/**
 * Check if error is authentication error
 */
export function isAuthError(error: unknown): boolean {
  if (error instanceof Error) {
    return (
      error.message.includes('Unauthorized') ||
      error.message.includes('Authentication required') ||
      error.message.includes('Invalid credentials')
    )
  }
  return false
}

/**
 * Check if error is authorization error
 */
export function isAuthorizationError(error: unknown): boolean {
  if (error instanceof Error) {
    return (
      error.message.includes('Forbidden') ||
      error.message.includes('Required permission') ||
      error.message.includes('Required role')
    )
  }
  return false
}
