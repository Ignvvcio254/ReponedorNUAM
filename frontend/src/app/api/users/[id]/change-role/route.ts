/**
 * API: /api/users/[id]/change-role
 * Method: POST
 * Auth: Required (Admin only)
 * Purpose: Change user role
 */

import { NextRequest } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { createErrorResponse, createSuccessResponse } from '@/lib/api-helpers'
import { userManagementService } from '@/services/UserManagementService'
import { UserRole } from '../../../../../../generated/prisma'

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
    const { role } = body

    if (!role) {
      return createErrorResponse('Rol es requerido', 400)
    }

    const validRoles = ['ADMIN', 'MANAGER', 'ACCOUNTANT', 'AUDITOR', 'VIEWER']
    if (!validRoles.includes(role)) {
      return createErrorResponse('Rol inválido', 400)
    }

    if (currentUser.id === params.id && role !== 'ADMIN') {
      return createErrorResponse('No puedes cambiar tu propio rol de administrador', 400)
    }

    const result = await userManagementService.changeUserRole(
      params.id,
      role as UserRole,
      currentUser.id
    )

    return createSuccessResponse(result)
  } catch (error) {
    console.error('Error changing user role:', error)
    const errorMessage = error instanceof Error ? error.message : 'Error interno del servidor'
    return createErrorResponse(errorMessage, 500)
  }
}
