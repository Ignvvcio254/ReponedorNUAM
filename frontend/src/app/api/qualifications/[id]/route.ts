import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const qualification = await db.qualifications.findUnique({
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
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    
    // Verificar que la calificación existe
    const existingQualification = await db.qualifications.findUnique({
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
      const amount = body.amount ? parseFloat(body.amount) : existingQualification.amount
      calculatedValue = amount.toNumber() / factor
    }

    const updatedQualification = await db.qualifications.update({
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

    return NextResponse.json({
      success: true,
      data: updatedQualification
    })
  } catch (error) {
    console.error('Error updating qualification:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Verificar que la calificación existe
    const existingQualification = await db.qualifications.findUnique({
      where: { id: params.id }
    })

    if (!existingQualification) {
      return NextResponse.json(
        { success: false, error: 'Calificación no encontrada' },
        { status: 404 }
      )
    }

    await db.qualifications.delete({
      where: { id: params.id }
    })

    return NextResponse.json({
      success: true,
      message: 'Calificación eliminada exitosamente'
    })
  } catch (error) {
    console.error('Error deleting qualification:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}