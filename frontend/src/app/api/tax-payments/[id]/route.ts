import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { PaymentMethod, PaymentType } from '@prisma/client'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const taxPayment = await db.taxPayments.findUnique({
      where: { id: params.id },
      include: {
        taxReturn: {
          include: {
            taxEntity: true
          }
        }
      }
    })

    if (!taxPayment) {
      return NextResponse.json(
        { success: false, error: 'Pago tributario no encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: taxPayment
    })
  } catch (error) {
    console.error('Error fetching tax payment:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    
    // Verificar que el pago existe
    const existingPayment = await db.taxPayments.findUnique({
      where: { id: params.id }
    })

    if (!existingPayment) {
      return NextResponse.json(
        { success: false, error: 'Pago tributario no encontrado' },
        { status: 404 }
      )
    }

    // Verificar que la declaración existe si se especifica
    if (body.taxReturnId && body.taxReturnId !== existingPayment.taxReturnId) {
      const taxReturn = await db.taxReturns.findUnique({
        where: { id: body.taxReturnId }
      })
      if (!taxReturn) {
        return NextResponse.json(
          { success: false, error: 'Declaración tributaria no encontrada' },
          { status: 404 }
        )
      }
    }

    const updateData: any = {
      ...(body.amount && { amount: parseFloat(body.amount) }),
      ...(body.currency && { currency: body.currency }),
      ...(body.paymentDate && { paymentDate: new Date(body.paymentDate) }),
      ...(body.paymentMethod && { paymentMethod: body.paymentMethod as PaymentMethod }),
      ...(body.referenceNumber !== undefined && { referenceNumber: body.referenceNumber }),
      ...(body.paymentType && { paymentType: body.paymentType as PaymentType }),
      ...(body.description !== undefined && { description: body.description }),
      ...(body.taxReturnId !== undefined && { taxReturnId: body.taxReturnId })
    }

    // Manejar verificación
    if (body.verified !== undefined) {
      updateData.verified = body.verified
      if (body.verified && !existingPayment.verified) {
        updateData.verificationDate = new Date()
      } else if (!body.verified) {
        updateData.verificationDate = null
      }
    }

    const updatedTaxPayment = await db.taxPayments.update({
      where: { id: params.id },
      data: updateData,
      include: {
        taxReturn: {
          include: {
            taxEntity: {
              select: {
                id: true,
                businessName: true,
                taxId: true,
                country: true
              }
            }
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: updatedTaxPayment
    })
  } catch (error) {
    console.error('Error updating tax payment:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Verificar que el pago existe
    const existingPayment = await db.taxPayments.findUnique({
      where: { id: params.id }
    })

    if (!existingPayment) {
      return NextResponse.json(
        { success: false, error: 'Pago tributario no encontrado' },
        { status: 404 }
      )
    }

    // No permitir eliminar pagos verificados
    if (existingPayment.verified) {
      return NextResponse.json(
        { success: false, error: 'No se puede eliminar un pago verificado' },
        { status: 409 }
      )
    }

    await db.taxPayments.delete({
      where: { id: params.id }
    })

    return NextResponse.json({
      success: true,
      message: 'Pago tributario eliminado exitosamente'
    })
  } catch (error) {
    console.error('Error deleting tax payment:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}