/**
 * RBAC Permission System
 *
 * Role-Based Access Control system with a clear permission matrix.
 * Uses OOP principles for maintainability and scalability.
 *
 * Architecture:
 * - PermissionMatrix: Centralized permission definitions
 * - PermissionChecker: Business logic for permission validation
 * - Helper functions: Convenient access to permission checks
 */

import { UserRole } from '../../generated/prisma'
import type { Resource, Action, Permission, RoleConfig } from '@/types/auth'

// ============================================================================
// Permission Matrix Configuration
// ============================================================================

/**
 * Centralized permission matrix defining what each role can do.
 * Add new resources or actions here to extend the system.
 */
class PermissionMatrix {
  private static readonly ROLE_CONFIGS: Record<UserRole, RoleConfig> = {
    ADMIN: {
      name: 'Administrator',
      description: 'Full system access with user management capabilities',
      level: 5,
      permissions: [
        { resource: 'qualifications', actions: ['create', 'read', 'update', 'delete', 'approve', 'export'] },
        { resource: 'tax-entities', actions: ['create', 'read', 'update', 'delete', 'export'] },
        { resource: 'tax-returns', actions: ['create', 'read', 'update', 'delete', 'approve', 'export'] },
        { resource: 'tax-payments', actions: ['create', 'read', 'update', 'delete', 'export'] },
        { resource: 'certificates', actions: ['create', 'read', 'update', 'delete', 'export'] },
        { resource: 'audit-processes', actions: ['create', 'read', 'update', 'delete', 'export'] },
        { resource: 'users', actions: ['create', 'read', 'update', 'delete'] },
        { resource: 'audit-logs', actions: ['read', 'export'] },
        { resource: 'system-config', actions: ['create', 'read', 'update', 'delete'] },
        { resource: 'import', actions: ['create', 'read', 'export'] },
        { resource: 'reports', actions: ['read', 'export'] },
      ],
    },

    MANAGER: {
      name: 'Manager',
      description: 'Management operations with approval capabilities',
      level: 4,
      permissions: [
        { resource: 'qualifications', actions: ['create', 'read', 'update', 'approve', 'export'] },
        { resource: 'tax-entities', actions: ['create', 'read', 'update', 'export'] },
        { resource: 'tax-returns', actions: ['create', 'read', 'update', 'approve', 'export'] },
        { resource: 'tax-payments', actions: ['create', 'read', 'update', 'export'] },
        { resource: 'certificates', actions: ['create', 'read', 'update', 'export'] },
        { resource: 'audit-processes', actions: ['read', 'export'] },
        { resource: 'users', actions: ['read'] },
        { resource: 'audit-logs', actions: ['read', 'export'] },
        { resource: 'import', actions: ['create', 'read', 'export'] },
        { resource: 'reports', actions: ['read', 'export'] },
      ],
    },

    ACCOUNTANT: {
      name: 'Accountant',
      description: 'CRUD operations on tax records',
      level: 3,
      permissions: [
        { resource: 'qualifications', actions: ['create', 'read', 'update', 'export'] },
        { resource: 'tax-entities', actions: ['create', 'read', 'update', 'export'] },
        { resource: 'tax-returns', actions: ['create', 'read', 'update', 'export'] },
        { resource: 'tax-payments', actions: ['create', 'read', 'update', 'export'] },
        { resource: 'certificates', actions: ['read', 'export'] },
        { resource: 'audit-processes', actions: ['read'] },
        { resource: 'import', actions: ['create', 'read', 'export'] },
        { resource: 'reports', actions: ['read', 'export'] },
      ],
    },

    AUDITOR: {
      name: 'Auditor',
      description: 'Read-only access with audit capabilities',
      level: 2,
      permissions: [
        { resource: 'qualifications', actions: ['read', 'export'] },
        { resource: 'tax-entities', actions: ['read', 'export'] },
        { resource: 'tax-returns', actions: ['read', 'export'] },
        { resource: 'tax-payments', actions: ['read', 'export'] },
        { resource: 'certificates', actions: ['read', 'export'] },
        { resource: 'audit-processes', actions: ['read', 'export'] },
        { resource: 'audit-logs', actions: ['read', 'export'] },
        { resource: 'reports', actions: ['read', 'export'] },
      ],
    },

    VIEWER: {
      name: 'Viewer',
      description: 'Limited read-only access',
      level: 1,
      permissions: [
        { resource: 'qualifications', actions: ['read'] },
        { resource: 'tax-entities', actions: ['read'] },
        { resource: 'tax-returns', actions: ['read'] },
        { resource: 'reports', actions: ['read'] },
      ],
    },
  }

  /**
   * Get role configuration
   */
  static getRoleConfig(role: UserRole): RoleConfig {
    return this.ROLE_CONFIGS[role]
  }

  /**
   * Get all role configurations
   */
  static getAllRoles(): RoleConfig[] {
    return Object.values(this.ROLE_CONFIGS)
  }

  /**
   * Get permissions for a specific role
   */
  static getPermissions(role: UserRole): Permission[] {
    return this.ROLE_CONFIGS[role]?.permissions || []
  }
}

// ============================================================================
// Permission Checker Class
// ============================================================================

/**
 * Main class for checking permissions.
 * Encapsulates all permission logic.
 */
export class PermissionChecker {
  private role: UserRole
  private permissions: Permission[]

  constructor(role: UserRole) {
    this.role = role
    this.permissions = PermissionMatrix.getPermissions(role)
  }

  /**
   * Check if user has permission for a specific action on a resource
   */
  can(resource: Resource, action: Action): boolean {
    const permission = this.permissions.find((p) => p.resource === resource)
    return permission ? permission.actions.includes(action) : false
  }

  /**
   * Check if user can perform any action on a resource
   */
  canAccessResource(resource: Resource): boolean {
    return this.permissions.some((p) => p.resource === resource)
  }

  /**
   * Get all allowed actions for a resource
   */
  getAllowedActions(resource: Resource): Action[] {
    const permission = this.permissions.find((p) => p.resource === resource)
    return permission?.actions || []
  }

  /**
   * Check if user has approval rights
   */
  canApprove(): boolean {
    return ['ADMIN', 'MANAGER'].includes(this.role)
  }

  /**
   * Check if user can manage other users
   */
  canManageUsers(): boolean {
    return this.role === 'ADMIN'
  }

  /**
   * Check if user can view audit logs
   */
  canViewAuditLogs(): boolean {
    return ['ADMIN', 'MANAGER', 'AUDITOR'].includes(this.role)
  }

  /**
   * Check if user can modify system configuration
   */
  canModifySystemConfig(): boolean {
    return this.role === 'ADMIN'
  }

  /**
   * Get role level (higher = more privileges)
   */
  getRoleLevel(): number {
    return PermissionMatrix.getRoleConfig(this.role).level
  }

  /**
   * Check if this role has higher privileges than another
   */
  hasHigherPrivilegesThan(otherRole: UserRole): boolean {
    const thisLevel = this.getRoleLevel()
    const otherLevel = PermissionMatrix.getRoleConfig(otherRole).level
    return thisLevel > otherLevel
  }
}

// ============================================================================
// Convenience Functions
// ============================================================================

/**
 * Quick permission check without instantiating class
 */
export function hasPermission(
  role: UserRole,
  resource: Resource,
  action: Action
): boolean {
  const checker = new PermissionChecker(role)
  return checker.can(resource, action)
}

/**
 * Check if role can approve
 */
export function canApprove(role: UserRole): boolean {
  const checker = new PermissionChecker(role)
  return checker.canApprove()
}

/**
 * Check if role can manage users
 */
export function canManageUsers(role: UserRole): boolean {
  const checker = new PermissionChecker(role)
  return checker.canManageUsers()
}

/**
 * Check if role can view audit logs
 */
export function canViewAuditLogs(role: UserRole): boolean {
  const checker = new PermissionChecker(role)
  return checker.canViewAuditLogs()
}

/**
 * Get all permissions for a role
 */
export function getPermissionsForRole(role: UserRole): Permission[] {
  return PermissionMatrix.getPermissions(role)
}

/**
 * Get role configuration
 */
export function getRoleConfig(role: UserRole): RoleConfig {
  return PermissionMatrix.getRoleConfig(role)
}

/**
 * Get all available roles with their configurations
 */
export function getAllRoles(): RoleConfig[] {
  return PermissionMatrix.getAllRoles()
}

// ============================================================================
// Export Class for Advanced Usage
// ============================================================================

export { PermissionMatrix }
