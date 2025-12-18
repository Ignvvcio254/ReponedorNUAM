/**
 * API: /api/users
 * Methods: GET, POST
 * Auth: Required (Admin only for POST)
 */

import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { UserRole } from '../../../../generated/prisma'
import { hash } from 'bcryptjs'
import { getCurrentUser } from '@/lib/auth'
import { createErrorResponse, createSuccessResponse } from '@/lib/api-helpers'

// ============================================================================
// GET - List Users
// ============================================================================

export async function GET(request: NextRequest) {
  try {
    // Authentication check
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return createErrorResponse('Unauthorized - Authentication required', 401)
    }

    const { searchParams } = new URL(request.url)
    const role = searchParams.get('role') as UserRole
    const search = searchParams.get('search')
    
    const whereClause: any = {}
    if (role) whereClause.role = role
    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ]
    }
    
    const users = await db.user.findMany({
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
            auditLogs: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return createSuccessResponse({ data: users, total: users.length })
  } catch (error) {
    console.error('Error fetching users:', error)
    const errorMessage = error instanceof Error ? error.message : 'Error interno del servidor'
    return createErrorResponse(`Error al obtener usuarios: ${errorMessage}`, 500)
  }
}

// ============================================================================
// POST - Create User (Admin only)
// ============================================================================

export async function POST(request: NextRequest) {
  try {
    // Authentication and authorization check
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return createErrorResponse('Unauthorized - Authentication required', 401)
    }
    if (currentUser.role !== 'ADMIN') {
      return createErrorResponse('Forbidden - Admin access required', 403)
    }

    const body = await request.json()
    
    // Validate required fields
    if (!body.email || !body.name) {
      return createErrorResponse('Email y nombre son requeridos', 400)
    }
    
    // Validate password
    if (!body.password || body.password.length < 8) {
      return createErrorResponse('Password debe tener al menos 8 caracteres', 400)
    }
    
    // Check if email already exists
    const existingUser = await db.user.findUnique({
      where: { email: body.email }
    })
    if (existingUser) {
      return createErrorResponse('Ya existe un usuario con este email', 409)
    }
    
    // Hash password
    const hashedPassword = await hash(body.password, 12)
    
    const newUser = await db.user.create({
      data: {
        email: body.email,
        name: body.name,
        password: hashedPassword,
        role: (body.role as UserRole) || 'ACCOUNTANT',
        isActive: true,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    })

    // Create audit log
    await db.auditLog.create({
      data: {
        action: 'CREATE',
        entityType: 'User',
        entityId: newUser.id,
        userId: currentUser.id,
        newValues: {
          created_email: newUser.email,
          created_role: newUser.role,
        },
      },
    })
    
    return createSuccessResponse(newUser, 201)
  } catch (error) {
    console.error('Error creating user:', error)
    const errorMessage = error instanceof Error ? error.message : 'Error interno del servidor'
    return createErrorResponse(`Error al crear usuario: ${errorMessage}`, 500)
  }
}