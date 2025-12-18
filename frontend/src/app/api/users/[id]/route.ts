/**
 * API: /api/users/[id]
 * Methods: GET, PUT, DELETE
 * Auth: Required (Admin only)
 */

import { NextRequest } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { createErrorResponse, createSuccessResponse } from '@/lib/api-helpers'
import { userManagementService } from '@/services/UserManagementService'
import { UserRole } from '../../../../../generated/prisma'

// ============================================================================
// GET - Get User by ID
// ============================================================================

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return createErrorResponse('Unauthorized - Authentication required', 401)
    }

    if (currentUser.role !== 'ADMIN' && currentUser.id !== params.id) {
      return createErrorResponse('Forbidden - Admin access required', 403)
    }

    const user = await userManagementService.getUserById(params.id)
    return createSuccessResponse(user)
  } catch (error) {
    console.error('Error fetching user:', error)
    const errorMessage = error instanceof Error ? error.message : 'Error interno del servidor'
    return createErrorResponse(errorMessage, 500)
  }
}

// ============================================================================
// PUT - Update User
// ============================================================================

export async function PUT(
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

    // Validate role if provided
    if (body.role && !['ADMIN', 'MANAGER', 'ACCOUNTANT', 'AUDITOR', 'VIEWER'].includes(body.role)) {
      return createErrorResponse('Rol inválido', 400)
    }

    // Prevent self-demotion from admin
    if (currentUser.id === params.id && body.role && body.role !== 'ADMIN') {
      return createErrorResponse('No puedes cambiar tu propio rol de administrador', 400)
    }

    // Prevent self-deactivation
    if (currentUser.id === params.id && body.isActive === false) {
      return createErrorResponse('No puedes desactivar tu propia cuenta', 400)
    }

    const updatedUser = await userManagementService.updateUser(
      params.id,
      body,
      currentUser.id
    )

    return createSuccessResponse(updatedUser)
  } catch (error) {
    console.error('Error updating user:', error)
    const errorMessage = error instanceof Error ? error.message : 'Error interno del servidor'
    return createErrorResponse(errorMessage, 500)
  }
}

// ============================================================================
// DELETE - Deactivate User (Soft Delete)
// ============================================================================

export async function DELETE(
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

    // Prevent self-deletion
    if (currentUser.id === params.id) {
      return createErrorResponse('No puedes eliminar tu propia cuenta', 400)
    }

    const { searchParams } = new URL(request.url)
    const permanent = searchParams.get('permanent') === 'true'

    let result
    if (permanent) {
      result = await userManagementService.permanentlyDeleteUser(params.id, currentUser.id)
    } else {
      result = await userManagementService.deactivateUser(params.id, currentUser.id)
    }

    return createSuccessResponse(result)
  } catch (error) {
    console.error('Error deleting user:', error)
    const errorMessage = error instanceof Error ? error.message : 'Error interno del servidor'
    return createErrorResponse(errorMessage, 500)
  }
}
