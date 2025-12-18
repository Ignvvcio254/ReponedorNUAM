/**
 * API: /api/users/[id]/toggle-status
 * Method: POST
 * Auth: Required (Admin only)
 * Purpose: Toggle user active/inactive status
 */

import { NextRequest } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { createErrorResponse, createSuccessResponse } from '@/lib/api-helpers'
import { userManagementService } from '@/services/UserManagementService'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return createErrorResponse('Unauthorized - Authentication required', 401)
    }

    if (currentUser.role !== 'ADMIN') {
      return createErrorResponse('Forbidden - Admin access required', 403)
    }

    if (currentUser.id === params.id) {
      return createErrorResponse('No puedes cambiar el estado de tu propia cuenta', 400)
    }

    const result = await userManagementService.toggleUserStatus(params.id, currentUser.id)
    return createSuccessResponse(result)
  } catch (error) {
    console.error('Error toggling user status:', error)
    const errorMessage = error instanceof Error ? error.message : 'Error interno del servidor'
    return createErrorResponse(errorMessage, 500)
  }
}
