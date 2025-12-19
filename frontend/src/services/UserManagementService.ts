/**
 * User Management Service
 * Handles all user-related operations with clean architecture
 */

import { db } from '@/lib/db'
import { UserRole } from '../../generated/prisma'
import { hash } from 'bcryptjs'

export interface UserUpdateData {
  name?: string
  email?: string
  role?: UserRole
  isActive?: boolean
  password?: string
}

export interface UserSearchParams {
  search?: string
  role?: UserRole
  isActive?: boolean
  page?: number
  limit?: number
}

export class UserManagementService {
  private readonly SALT_ROUNDS = 12

  /**
   * Get user by ID with full details
   */
  async getUserById(userId: string) {
    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        lastLoginAt: true,
        lastLoginIp: true,
        emailVerified: true,
        failedLoginAttempts: true,
        lockedUntil: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            qualifications: true,
            importBatches: true,
            auditLogs: true,
          },
        },
      },
    })

    if (!user) {
      throw new Error('Usuario no encontrado')
    }

    return user
  }

  /**
   * Search and filter users with pagination
   */
  async searchUsers(params: UserSearchParams) {
    const { search, role, isActive, page = 1, limit = 50 } = params
    const skip = (page - 1) * limit

    const whereClause: any = {}

    if (role) {
      whereClause.role = role
    }

    if (isActive !== undefined) {
      whereClause.isActive = isActive
    }

    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ]
    }

    const [users, total] = await Promise.all([
      db.user.findMany({
        where: whereClause,
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          isActive: true,
          lastLoginAt: true,
          lastLoginIp: true,
          emailVerified: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              qualifications: true,
              importBatches: true,
              auditLogs: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      db.user.count({ where: whereClause }),
    ])

    return {
      users,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrevious: page > 1,
      },
    }
  }

  /**
   * Update user information
   */
  async updateUser(userId: string, data: UserUpdateData, updatedBy: string) {
    const user = await this.getUserById(userId)

    // Prepare update data
    const updateData: any = {}

    if (data.name !== undefined) updateData.name = data.name
    if (data.email !== undefined) updateData.email = data.email
    if (data.role !== undefined) updateData.role = data.role
    if (data.isActive !== undefined) updateData.isActive = data.isActive

    if (data.password) {
      updateData.password = await hash(data.password, this.SALT_ROUNDS)
    }

    const updatedUser = await db.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        updatedAt: true,
      },
    })

    // Create audit log
    await db.auditLog.create({
      data: {
        action: 'UPDATE',
        entityType: 'User',
        entityId: userId,
        userId: updatedBy,
        oldValues: {
          name: user.name,
          email: user.email,
          role: user.role,
          isActive: user.isActive,
        },
        newValues: updateData,
      },
    })

    return updatedUser
  }

  /**
   * Toggle user active status
   */
  async toggleUserStatus(userId: string, updatedBy: string) {
    const user = await this.getUserById(userId)

    const updatedUser = await db.user.update({
      where: { id: userId },
      data: { isActive: !user.isActive },
      select: {
        id: true,
        email: true,
        name: true,
        isActive: true,
      },
    })

    await db.auditLog.create({
      data: {
        action: 'UPDATE',
        entityType: 'User',
        entityId: userId,
        userId: updatedBy,
        oldValues: { isActive: user.isActive },
        newValues: { isActive: updatedUser.isActive },
      },
    })

    return updatedUser
  }

  /**
   * Change user role
   */
  async changeUserRole(userId: string, targetRole: UserRole, updatedBy: string) {
    const user = await this.getUserById(userId)

    const updatedUser = await db.user.update({
      where: { id: userId },
      data: { role: targetRole },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    })

    await db.auditLog.create({
      data: {
        action: 'UPDATE',
        entityType: 'User',
        entityId: userId,
        userId: updatedBy,
        oldValues: { role: user.role },
        newValues: { role: targetRole },
      },
    })

    return updatedUser
  }

  /**
   * Soft delete user (deactivate)
   */
  async deactivateUser(userId: string, deletedBy: string) {
    const user = await this.getUserById(userId)

    if (user.role === 'ADMIN') {
      // Check if this is the last admin
      const adminCount = await db.user.count({
        where: { role: 'ADMIN', isActive: true },
      })

      if (adminCount <= 1) {
        throw new Error('No se puede desactivar el último administrador del sistema')
      }
    }

    const updatedUser = await db.user.update({
      where: { id: userId },
      data: { isActive: false },
      select: {
        id: true,
        email: true,
        name: true,
        isActive: true,
      },
    })

    await db.auditLog.create({
      data: {
        action: 'DELETE',
        entityType: 'User',
        entityId: userId,
        userId: deletedBy,
        oldValues: { isActive: true },
        newValues: { isActive: false },
      },
    })

    return updatedUser
  }

  /**
   * Hard delete user (permanent)
   * WARNING: This permanently removes the user and all related data
   */
  async permanentlyDeleteUser(userId: string, deletedBy: string) {
    const user = await this.getUserById(userId)

    if (user.role === 'ADMIN') {
      const adminCount = await db.user.count({
        where: { role: 'ADMIN', isActive: true },
      })

      if (adminCount <= 1) {
        throw new Error('No se puede eliminar el último administrador del sistema')
      }
    }

    // Log before deletion
    await db.auditLog.create({
      data: {
        action: 'DELETE',
        entityType: 'User',
        entityId: userId,
        userId: deletedBy,
        oldValues: {
          email: user.email,
          name: user.name,
          role: user.role,
        },
        newValues: { deleted: true },
      },
    })

    // Delete user (cascade will handle related records)
    await db.user.delete({
      where: { id: userId },
    })

    return { success: true, message: 'Usuario eliminado permanentemente' }
  }

  /**
   * Reset user password
   */
  async resetUserPassword(userId: string, targetPassword: string, resetBy: string) {
    const hashedPassword = await hash(targetPassword, this.SALT_ROUNDS)

    await db.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
        failedLoginAttempts: 0,
        lockedUntil: null,
      },
    })

    await db.auditLog.create({
      data: {
        action: 'UPDATE',
        entityType: 'User',
        entityId: userId,
        userId: resetBy,
        newValues: { password_reset: true },
      },
    })

    return { success: true, message: 'Contraseña restablecida exitosamente' }
  }

  /**
   * Unlock user account
   */
  async unlockUserAccount(userId: string, unlockedBy: string) {
    await db.user.update({
      where: { id: userId },
      data: {
        failedLoginAttempts: 0,
        lockedUntil: null,
      },
    })

    await db.auditLog.create({
      data: {
        action: 'UPDATE',
        entityType: 'User',
        entityId: userId,
        userId: unlockedBy,
        newValues: { account_unlocked: true },
      },
    })

    return { success: true, message: 'Cuenta desbloqueada exitosamente' }
  }

  /**
   * Get user statistics
   */
  async getUserStats() {
    const [total, active, byRole, recentLogins] = await Promise.all([
      db.user.count(),
      db.user.count({ where: { isActive: true } }),
      db.user.groupBy({
        by: ['role'],
        _count: true,
      }),
      db.user.findMany({
        where: {
          lastLoginAt: { not: null },
        },
        orderBy: { lastLoginAt: 'desc' },
        take: 10,
        select: {
          id: true,
          name: true,
          email: true,
          lastLoginAt: true,
        },
      }),
    ])

    return {
      total,
      active,
      inactive: total - active,
      byRole: byRole.map((r) => ({
        role: r.role,
        count: r._count,
      })),
      recentLogins,
    }
  }
}

// Export singleton instance
export const userManagementService = new UserManagementService()
