/**
 * Authentication & Authorization Types
 *
 * Defines TypeScript interfaces and types for the authentication system.
 * Used throughout the application for type safety and IntelliSense.
 */

import { UserRole } from '../../generated/prisma'

// ============================================================================
// User Types
// ============================================================================

export interface AuthUser {
  id: string
  email: string
  name: string
  role: UserRole
  image?: string | null
  emailVerified?: Date | null
}

export interface SessionUser extends AuthUser {
  // Additional session-specific fields can be added here
}

// ============================================================================
// Session Types
// ============================================================================

export interface ExtendedSession {
  user: SessionUser
  expires: string
}

// ============================================================================
// Permission Types
// ============================================================================

export type Resource =
  | 'qualifications'
  | 'tax-entities'
  | 'tax-returns'
  | 'tax-payments'
  | 'certificates'
  | 'audit-processes'
  | 'users'
  | 'audit-logs'
  | 'system-config'
  | 'import'
  | 'reports'

export type Action =
  | 'create'
  | 'read'
  | 'update'
  | 'delete'
  | 'approve'
  | 'export'

export interface Permission {
  resource: Resource
  actions: Action[]
}

// ============================================================================
// Role Configuration
// ============================================================================

export interface RoleConfig {
  name: string
  description: string
  level: number // Higher number = more privileges
  permissions: Permission[]
}

// ============================================================================
// Login Types
// ============================================================================

export interface LoginCredentials {
  email: string
  password: string
  remember?: boolean
}

export interface LoginResponse {
  success: boolean
  error?: string
  user?: AuthUser
}

// ============================================================================
// Security Types
// ============================================================================

export interface SecurityEvent {
  type: 'login' | 'logout' | 'failed_login' | 'unauthorized_access'
  userId?: string
  email?: string
  ipAddress?: string
  userAgent?: string
  timestamp: Date
  metadata?: Record<string, any>
}

export interface AccountLockStatus {
  isLocked: boolean
  lockedUntil?: Date
  failedAttempts: number
  remainingAttempts: number
}
