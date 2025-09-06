import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { PeriodType, ReturnType, ReturnStatus } from '@prisma/client'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const taxReturn = await db.taxReturns.findUnique({
      where: { id: params.id },
      include: {
        taxEntity: true,
        taxPayments: {
          orderBy: { paymentDate: 'desc' }
        },
        taxAdjustments: {
          orderBy: { adjustmentDate: 'desc' }
        },
        auditProcesses: {
          orderBy: { startDate: 'desc' }
        }
      }
    })

    if (!taxReturn) {
      return NextResponse.json(
        { success: false, error: 'Declaración tributaria no encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: taxReturn
    })
  } catch (error) {
    console.error('Error fetching tax return:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    
    // Verificar que la declaración existe
    const existingReturn = await db.taxReturns.findUnique({
      where: { id: params.id }
    })

    if (!existingReturn) {
      return NextResponse.json(
        { success: false, error: 'Declaración tributaria no encontrada' },
        { status: 404 }
      )
    }

    // Si se está cambiando el status a SUBMITTED, agregar fecha de presentación
    const updateData: any = {
      ...(body.taxYear && { taxYear: parseInt(body.taxYear) }),
      ...(body.taxPeriod && { taxPeriod: body.taxPeriod }),
      ...(body.periodType && { periodType: body.periodType as PeriodType }),
      ...(body.returnType && { returnType: body.returnType as ReturnType }),
      ...(body.formCode !== undefined && { formCode: body.formCode }),
      ...(body.grossIncome !== undefined && { grossIncome: body.grossIncome ? parseFloat(body.grossIncome) : null }),
      ...(body.taxableIncome !== undefined && { taxableIncome: body.taxableIncome ? parseFloat(body.taxableIncome) : null }),
      ...(body.taxOwed !== undefined && { taxOwed: body.taxOwed ? parseFloat(body.taxOwed) : null }),
      ...(body.taxPaid !== undefined && { taxPaid: body.taxPaid ? parseFloat(body.taxPaid) : null }),
      ...(body.taxRefund !== undefined && { taxRefund: body.taxRefund ? parseFloat(body.taxRefund) : null }),
      ...(body.penalties !== undefined && { penalties: body.penalties ? parseFloat(body.penalties) : null }),
      ...(body.interest !== undefined && { interest: body.interest ? parseFloat(body.interest) : null }),
      ...(body.currency && { currency: body.currency }),
      ...(body.status && { status: body.status as ReturnStatus }),
      ...(body.dueDate && { dueDate: new Date(body.dueDate) }),
      ...(body.extensionDate !== undefined && { extensionDate: body.extensionDate ? new Date(body.extensionDate) : null }),
      ...(body.filingDate !== undefined && { filingDate: body.filingDate ? new Date(body.filingDate) : null }),
      ...(body.originalDocument !== undefined && { originalDocument: body.originalDocument }),
      ...(body.processedDocument !== undefined && { processedDocument: body.processedDocument }),
      ...(body.attachments !== undefined && { attachments: body.attachments }),
      ...(body.validationScore !== undefined && { validationScore: body.validationScore ? parseFloat(body.validationScore) : null }),
      ...(body.requiresReview !== undefined && { requiresReview: body.requiresReview }),
      ...(body.reviewNotes !== undefined && { reviewNotes: body.reviewNotes })
    }

    // Automatizar fechas según el estado
    if (body.status === 'SUBMITTED' && !existingReturn.submittedAt) {
      updateData.submittedAt = new Date()
    }
    if (body.status === 'SUBMITTED' && !updateData.filingDate) {
      updateData.filingDate = new Date()
    }

    const updatedTaxReturn = await db.taxReturns.update({
      where: { id: params.id },
      data: updateData,
      include: {
        taxEntity: {
          select: {
            id: true,
            businessName: true,
            taxId: true,
            country: true
          }
        },
        taxPayments: {
          select: {
            id: true,
            amount: true,
            currency: true,
            paymentDate: true,
            paymentType: true
          }
        },
        taxAdjustments: {
          select: {
            id: true,
            adjustmentType: true,
            difference: true,
            adjustmentDate: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: updatedTaxReturn
    })
  } catch (error) {
    console.error('Error updating tax return:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Verificar que la declaración existe
    const existingReturn = await db.taxReturns.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: {
            taxPayments: true,
            taxAdjustments: true,
            auditProcesses: true
          }
        }
      }
    })

    if (!existingReturn) {
      return NextResponse.json(
        { success: false, error: 'Declaración tributaria no encontrada' },
        { status: 404 }
      )
    }

    // No permitir eliminar si ya fue enviada o tiene registros asociados
    if (existingReturn.status === 'SUBMITTED' || existingReturn.status === 'ACCEPTED') {
      return NextResponse.json(
        { success: false, error: 'No se puede eliminar una declaración ya enviada o aceptada' },
        { status: 409 }
      )
    }

    const hasRelatedRecords = existingReturn._count.taxPayments > 0 || 
                              existingReturn._count.taxAdjustments > 0 || 
                              existingReturn._count.auditProcesses > 0

    if (hasRelatedRecords) {
      return NextResponse.json(
        { success: false, error: 'No se puede eliminar la declaración porque tiene registros asociados' },
        { status: 409 }
      )
    }

    await db.taxReturns.delete({
      where: { id: params.id }
    })

    return NextResponse.json({
      success: true,
      message: 'Declaración tributaria eliminada exitosamente'
    })
  } catch (error) {
    console.error('Error deleting tax return:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}