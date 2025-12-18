/**
 * API: /api/audit-logs
 * Methods: GET
 * Auth: Required
 * Permissions: Admin only
 */

import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { requirePermission } from '@/lib/auth'
import { createOptionsResponse, createSuccessResponse, createErrorResponse } from '@/lib/api-helpers'

// ============================================================================
// CORS Configuration
// ============================================================================

export async function OPTIONS() {
  return createOptionsResponse()
}

// ============================================================================
// GET Handler
// ============================================================================

export async function GET(request: NextRequest) {
  try {
    // Require admin permission
    await requirePermission('users', 'delete') // Only admins have delete permission

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    const entityType = searchParams.get('entityType') || undefined
    const action = searchParams.get('action') || undefined

    const whereClause: any = {}
    if (entityType) whereClause.entityType = entityType
    if (action) whereClause.action = action

    const auditLogs = await db.auditLog.findMany({
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
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    })

    return createSuccessResponse({
      data: auditLogs,
      total: auditLogs.length,
    })
  } catch (error) {
    console.error('Error fetching audit logs:', error)
    return createErrorResponse(error as Error)
  }
}
