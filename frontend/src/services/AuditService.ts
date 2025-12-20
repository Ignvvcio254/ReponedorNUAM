/**
 * Audit Service
 * Manages audit logs and system activity tracking
 */

import { db } from '@/lib/db'

export interface AuditSearchParams {
  userId?: string
  action?: string
  entityType?: string
  startDate?: Date
  endDate?: Date
  page?: number
  limit?: number
}

export class AuditService {
  /**
   * Log an action to the audit log
   */
  async logAction(params: {
    userId: string
    action: string
    entityType: string
    entityId: string
    oldValues?: any
    newValues?: any
    description?: string
  }) {
    try {
      const log = await db.auditLog.create({
        data: {
          userId: params.userId,
          action: params.action,
          entityType: params.entityType,
          entityId: params.entityId,
          oldValues: params.oldValues || null,
          newValues: params.newValues || null,
        },
      })
      return log
    } catch (error) {
      console.error('Error creating audit log:', error)
      // Don't throw - audit logging should not break the main operation
      return null
    }
  }

  /**
   * Search audit logs with filters
   */
  async searchAuditLogs(params: AuditSearchParams) {
    const { userId, action, entityType, startDate, endDate, page = 1, limit = 50 } = params
    const skip = (page - 1) * limit

    const whereClause: any = {}

    if (userId) {
      whereClause.userId = userId
    }

    if (action) {
      // Support multiple actions separated by comma (e.g., "LOGIN,LOGOUT,FAILED_LOGIN")
      const actions = action.split(',').map(a => a.trim()).filter(a => a.length > 0)
      if (actions.length === 1) {
        whereClause.action = actions[0]
      } else if (actions.length > 1) {
        whereClause.action = { in: actions }
      }
    }

    if (entityType) {
      whereClause.entityType = entityType
    }

    if (startDate || endDate) {
      whereClause.createdAt = {}
      if (startDate) whereClause.createdAt.gte = startDate
      if (endDate) whereClause.createdAt.lte = endDate
    }

    const [logs, total] = await Promise.all([
      db.auditLog.findMany({
        where: whereClause,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      db.auditLog.count({ where: whereClause }),
    ])

    return {
      logs,
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
   * Get audit statistics
   */
  async getAuditStats(days: number = 30) {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const [totalLogs, byAction, byEntity, byUser] = await Promise.all([
      db.auditLog.count({
        where: {
          createdAt: { gte: startDate },
        },
      }),
      db.auditLog.groupBy({
        by: ['action'],
        _count: true,
        where: {
          createdAt: { gte: startDate },
        },
      }),
      db.auditLog.groupBy({
        by: ['entityType'],
        _count: true,
        where: {
          createdAt: { gte: startDate },
        },
      }),
      db.auditLog.groupBy({
        by: ['userId'],
        _count: true,
        where: {
          createdAt: { gte: startDate },
        },
        orderBy: {
          _count: {
            userId: 'desc',
          },
        },
        take: 10,
      }),
    ])

    return {
      totalLogs,
      byAction: byAction.map((a) => ({
        action: a.action,
        count: a._count,
      })),
      byEntity: byEntity.map((e) => ({
        entityType: e.entityType,
        count: e._count,
      })),
      topUsers: byUser.map((u) => ({
        userId: u.userId,
        count: u._count,
      })),
      period: days,
    }
  }

  /**
   * Get recent activity for a specific user
   */
  async getUserActivity(userId: string, limit: number = 20) {
    const logs = await db.auditLog.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    return logs
  }

  /**
   * Export audit logs to JSON
   */
  async exportAuditLogs(params: AuditSearchParams) {
    const { logs } = await this.searchAuditLogs({ ...params, limit: 10000 })

    return {
      exportDate: new Date().toISOString(),
      filters: params,
      totalRecords: logs.length,
      data: logs,
    }
  }

  /**
   * Clean old audit logs (data retention policy)
   */
  async cleanOldLogs(retentionDays: number = 365) {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - retentionDays)

    const result = await db.auditLog.deleteMany({
      where: {
        createdAt: { lt: cutoffDate },
      },
    })

    return {
      deletedCount: result.count,
      cutoffDate,
    }
  }
}

// Export singleton instance
export const auditService = new AuditService()
