/**
 * API: /api/audit-logs/stats
 * Method: GET
 * Auth: Required (Admin only)
 * Purpose: Get audit log statistics
 */

import { NextRequest } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { createErrorResponse, createSuccessResponse } from '@/lib/api-helpers'
import { auditService } from '@/services/AuditService'

export async function GET(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return createErrorResponse('Unauthorized - Authentication required', 401)
    }

    if (currentUser.role !== 'ADMIN') {
      return createErrorResponse('Forbidden - Admin access required', 403)
    }

    const { searchParams } = new URL(request.url)
    const days = parseInt(searchParams.get('days') || '30')

    const stats = await auditService.getAuditStats(days)
    return createSuccessResponse(stats)
  } catch (error) {
    console.error('Error fetching audit stats:', error)
    const errorMessage = error instanceof Error ? error.message : 'Error interno del servidor'
    return createErrorResponse(errorMessage, 500)
  }
}
