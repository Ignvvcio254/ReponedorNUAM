/**
 * API: /api/users/stats
 * Method: GET
 * Auth: Required (Admin only)
 * Purpose: Get user statistics
 */

import { NextRequest } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { createErrorResponse, createSuccessResponse } from '@/lib/api-helpers'
import { userManagementService } from '@/services/UserManagementService'

export async function GET(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return createErrorResponse('Unauthorized - Authentication required', 401)
    }

    if (currentUser.role !== 'ADMIN') {
      return createErrorResponse('Forbidden - Admin access required', 403)
    }

    const stats = await userManagementService.getUserStats()
    return createSuccessResponse(stats)
  } catch (error) {
    console.error('Error fetching user stats:', error)
    const errorMessage = error instanceof Error ? error.message : 'Error interno del servidor'
    return createErrorResponse(errorMessage, 500)
  }
}
