/**
 * API: /api/users/[id]/reset-password
 * Method: POST
 * Auth: Required (Admin only)
 * Purpose: Reset user password
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

    const body = await request.json()
    const { newPassword: passwordValue } = body

    if (!passwordValue) {
      return createErrorResponse('Nueva contraseña es requerida', 400)
    }

    if (passwordValue.length < 8) {
      return createErrorResponse('La contraseña debe tener al menos 8 caracteres', 400)
    }

    const result = await userManagementService.resetUserPassword(
      params.id,
      passwordValue,
      currentUser.id
    )

    return createSuccessResponse(result)
  } catch (error) {
    console.error('Error resetting password:', error)
    const errorMessage = error instanceof Error ? error.message : 'Error interno del servidor'
    return createErrorResponse(errorMessage, 500)
  }
}
