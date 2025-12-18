/**
 * API: /api/qualifications
 * Methods: GET, POST
 * Auth: Required
 * Permissions: Read, Create
 */

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAuth, requirePermission } from '@/lib/auth'

// ============================================================================
// CORS Configuration
// ============================================================================

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}

// ============================================================================
// GET Handler
// ============================================================================

export async function GET(request: NextRequest) {
  try {
    // Require authentication and read permission
    await requirePermission('qualifications', 'read')

    const { searchParams } = new URL(request.url)
    const country = searchParams.get('country') || undefined
    const status = searchParams.get('status') || undefined

    const whereClause: any = {}
    if (country) whereClause.country = country
    if (status) whereClause.status = status

    const qualifications = await db.qualification.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    const response = NextResponse.json({
      success: true,
      data: qualifications,
      total: qualifications.length
    })

    response.headers.set('Access-Control-Allow-Origin', '*')
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')

    return response
  } catch (error) {
    console.error('Error fetching qualifications:', error)

    const errorMessage = error instanceof Error ? error.message : 'Error interno del servidor'
    const statusCode = errorMessage.includes('Unauthorized') ? 401 :
                       errorMessage.includes('Forbidden') ? 403 : 500

    const response = NextResponse.json(
      { success: false, error: errorMessage },
      { status: statusCode }
    )

    response.headers.set('Access-Control-Allow-Origin', '*')
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')

    return response
  }
}

// ============================================================================
// POST Handler
// ============================================================================

export async function POST(request: NextRequest) {
  try {
    // Require authentication and create permission
    const currentUser = await requirePermission('qualifications', 'create')

    const body = await request.json()

    // Validaciones básicas
    if (!body.emisorName || !body.period || !body.amount || !body.country) {
      return NextResponse.json(
        { success: false, error: 'Campos requeridos: emisorName, period, amount, country' },
        { status: 400 }
      )
    }

    // Use authenticated user's ID
    const userId = body.userId || currentUser.id

    // Verificar que el usuario existe (if different from current user)
    if (userId !== currentUser.id) {
      const user = await db.user.findUnique({
        where: { id: userId }
      })
      if (!user) {
        return NextResponse.json(
          { success: false, error: 'Usuario no encontrado' },
          { status: 404 }
        )
      }
    }

    // Calcular valor según UTM/UIT del país
    const exchangeRates: Record<string, number> = {
      CL: 64649,  // UTM Chile
      PE: 5150,   // UIT Perú
      CO: 42412,  // UVT Colombia
      MX: 108.57, // UMA México
      AR: 25000   // UF Argentina
    }

    const factor = exchangeRates[body.country] || 1
    const calculatedValue = parseFloat(body.amount) / factor

    const newQualification = await db.qualification.create({
      data: {
        emisorName: body.emisorName,
        taxId: body.taxId || null,
        country: body.country,
        period: body.period,
        amount: parseFloat(body.amount),
        currency: body.currency || 'USD',
        calculatedValue: calculatedValue,
        status: 'DRAFT',
        observations: body.observations || null,
        documentUrl: body.documentUrl || null,
        userId: userId
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: newQualification
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating qualification:', error)

    const errorMessage = error instanceof Error ? error.message : 'Error interno del servidor'
    const statusCode = errorMessage.includes('Unauthorized') ? 401 :
                       errorMessage.includes('Forbidden') ? 403 : 500

    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: statusCode }
    )
  }
}
