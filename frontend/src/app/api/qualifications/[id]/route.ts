/**
 * API: /api/qualifications/[id]
 * Methods: GET, PUT, DELETE
 * Auth: Required
 * Permissions: Read, Update, Delete on qualifications
 */

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { Country, QualificationStatus, Prisma } from '../../../../../generated/prisma'
import { requirePermission } from '@/lib/auth'
import { auditService } from '@/services/AuditService'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Require authentication and read permission for qualifications
    await requirePermission('qualifications', 'read')

    const qualification = await db.qualification.findUnique({
      where: { id: params.id },
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

    if (!qualification) {
      return NextResponse.json(
        { success: false, error: 'Calificación no encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: qualification
    })
  } catch (error) {
    console.error('Error fetching qualification:', error)
    const errorMessage = error instanceof Error ? error.message : 'Error interno del servidor'
    const statusCode = errorMessage.includes('Unauthorized') ? 401 :
                       errorMessage.includes('Forbidden') ? 403 : 500
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: statusCode }
    )
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Require authentication
    const currentUser = await requirePermission('qualifications', 'update')
    
    const body = await request.json()
    
    // Verificar que la calificación existe
    const existingQualification = await db.qualification.findUnique({
      where: { id: params.id }
    })

    if (!existingQualification) {
      return NextResponse.json(
        { success: false, error: 'Calificación no encontrada' },
        { status: 404 }
      )
    }

    // Recalcular valor si cambia el monto o país
    let calculatedValue = existingQualification.calculatedValue
    if (body.amount || body.country) {
      const exchangeRates: Record<string, number> = {
        CL: 64649,  // UTM Chile
        PE: 5150,   // UIT Perú
        CO: 42412,  // UVT Colombia
        MX: 108.57, // UMA México
        AR: 25000   // UF Argentina
      }
      
      const factor = exchangeRates[body.country || existingQualification.country] || 1
      const amount = body.amount ? parseFloat(body.amount) : existingQualification.amount.toNumber()
      calculatedValue = new Prisma.Decimal(amount / factor)
    }

    // Determine action type based on status change
    let actionType = 'UPDATE'
    if (body.status === 'APPROVED') actionType = 'APPROVE'
    if (body.status === 'REJECTED') actionType = 'REJECT'

    const updatedQualification = await db.qualification.update({
      where: { id: params.id },
      data: {
        ...(body.emisorName && { emisorName: body.emisorName }),
        ...(body.taxId && { taxId: body.taxId }),
        ...(body.country && { country: body.country as Country }),
        ...(body.period && { period: body.period }),
        ...(body.amount && { amount: parseFloat(body.amount) }),
        ...(body.currency && { currency: body.currency }),
        ...(calculatedValue && { calculatedValue: calculatedValue }),
        ...(body.status && { status: body.status as QualificationStatus }),
        ...(body.observations !== undefined && { observations: body.observations }),
        ...(body.documentUrl !== undefined && { documentUrl: body.documentUrl }),
        ...(body.status === 'APPROVED' && { approvalDate: new Date() }),
        ...(body.status === 'REJECTED' && { rejectionReason: body.rejectionReason || 'No especificada' })
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

    // Log the action to audit log
    await auditService.logAction({
      userId: currentUser.id,
      action: actionType,
      entityType: 'qualification',
      entityId: params.id,
      oldValues: {
        status: existingQualification.status,
        emisorName: existingQualification.emisorName,
      },
      newValues: {
        status: updatedQualification.status,
        emisorName: updatedQualification.emisorName,
        country: updatedQualification.country,
      }
    })

    return NextResponse.json({
      success: true,
      data: updatedQualification
    })
  } catch (error) {
    console.error('Error updating qualification:', error)
    const errorMessage = error instanceof Error ? error.message : 'Error interno del servidor'
    const statusCode = errorMessage.includes('Unauthorized') ? 401 :
                       errorMessage.includes('Forbidden') ? 403 : 500
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: statusCode }
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Require authentication
    const currentUser = await requirePermission('qualifications', 'delete')
    
    // Verificar que la calificación existe
    const existingQualification = await db.qualification.findUnique({
      where: { id: params.id }
    })

    if (!existingQualification) {
      return NextResponse.json(
        { success: false, error: 'Calificación no encontrada' },
        { status: 404 }
      )
    }

    await db.qualification.delete({
      where: { id: params.id }
    })

    // Log the deletion to audit log
    await auditService.logAction({
      userId: currentUser.id,
      action: 'DELETE',
      entityType: 'qualification',
      entityId: params.id,
      oldValues: {
        emisorName: existingQualification.emisorName,
        country: existingQualification.country,
        status: existingQualification.status,
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Calificación eliminada exitosamente'
    })
  } catch (error) {
    console.error('Error deleting qualification:', error)
    const errorMessage = error instanceof Error ? error.message : 'Error interno del servidor'
    const statusCode = errorMessage.includes('Unauthorized') ? 401 :
                       errorMessage.includes('Forbidden') ? 403 : 500
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: statusCode }
    )
  }
}