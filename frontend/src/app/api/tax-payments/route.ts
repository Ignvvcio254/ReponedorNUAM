import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { PaymentMethod, PaymentType } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const taxReturnId = searchParams.get('taxReturnId')
    const paymentType = searchParams.get('paymentType') as PaymentType
    const verified = searchParams.get('verified')
    const fromDate = searchParams.get('fromDate')
    const toDate = searchParams.get('toDate')
    
    const whereClause: any = {}
    if (taxReturnId) whereClause.taxReturnId = taxReturnId
    if (paymentType) whereClause.paymentType = paymentType
    if (verified !== null) whereClause.verified = verified === 'true'
    if (fromDate || toDate) {
      whereClause.paymentDate = {}
      if (fromDate) whereClause.paymentDate.gte = new Date(fromDate)
      if (toDate) whereClause.paymentDate.lte = new Date(toDate)
    }
    
    const taxPayments = await db.taxPayments.findMany({
      where: whereClause,
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
      },
      orderBy: {
        paymentDate: 'desc'
      }
    })
    
    return NextResponse.json({
      success: true,
      data: taxPayments,
      total: taxPayments.length
    })
  } catch (error) {
    console.error('Error fetching tax payments:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validaciones básicas
    if (!body.amount || !body.paymentDate || !body.paymentMethod || !body.paymentType) {
      return NextResponse.json(
        { success: false, error: 'Campos requeridos: amount, paymentDate, paymentMethod, paymentType' },
        { status: 400 }
      )
    }
    
    // Verificar que la declaración existe si se especifica
    if (body.taxReturnId) {
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
    
    const newTaxPayment = await db.taxPayments.create({
      data: {
        taxReturnId: body.taxReturnId || null,
        amount: parseFloat(body.amount),
        currency: body.currency || 'USD',
        paymentDate: new Date(body.paymentDate),
        paymentMethod: body.paymentMethod as PaymentMethod,
        referenceNumber: body.referenceNumber || null,
        paymentType: body.paymentType as PaymentType,
        description: body.description || null,
        verified: body.verified || false,
        verificationDate: body.verified ? new Date() : null
      },
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
      data: newTaxPayment
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating tax payment:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}