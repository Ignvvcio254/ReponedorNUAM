import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { PeriodType, ReturnType, ReturnStatus } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const taxEntityId = searchParams.get('taxEntityId')
    const taxYear = searchParams.get('taxYear')
    const returnType = searchParams.get('returnType') as ReturnType
    const status = searchParams.get('status') as ReturnStatus
    const overdue = searchParams.get('overdue') === 'true'
    
    const whereClause: any = {}
    if (taxEntityId) whereClause.taxEntityId = taxEntityId
    if (taxYear) whereClause.taxYear = parseInt(taxYear)
    if (returnType) whereClause.returnType = returnType
    if (status) whereClause.status = status
    if (overdue) {
      whereClause.dueDate = { lt: new Date() }
      whereClause.status = { notIn: ['SUBMITTED', 'ACCEPTED'] }
    }
    
    const taxReturns = await db.taxReturns.findMany({
      where: whereClause,
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
        },
        _count: {
          select: {
            taxPayments: true,
            taxAdjustments: true
          }
        }
      },
      orderBy: [
        { taxYear: 'desc' },
        { dueDate: 'desc' }
      ]
    })
    
    return NextResponse.json({
      success: true,
      data: taxReturns,
      total: taxReturns.length
    })
  } catch (error) {
    console.error('Error fetching tax returns:', error)
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
    if (!body.taxEntityId || !body.taxYear || !body.taxPeriod || !body.periodType || !body.returnType || !body.dueDate) {
      return NextResponse.json(
        { success: false, error: 'Campos requeridos: taxEntityId, taxYear, taxPeriod, periodType, returnType, dueDate' },
        { status: 400 }
      )
    }
    
    // Verificar que la entidad tributaria existe
    const taxEntity = await db.taxEntities.findUnique({
      where: { id: body.taxEntityId }
    })
    if (!taxEntity) {
      return NextResponse.json(
        { success: false, error: 'Entidad tributaria no encontrada' },
        { status: 404 }
      )
    }
    
    // Verificar duplicados
    const existingReturn = await db.taxReturns.findUnique({
      where: {
        taxEntityId_taxYear_taxPeriod_returnType: {
          taxEntityId: body.taxEntityId,
          taxYear: parseInt(body.taxYear),
          taxPeriod: body.taxPeriod,
          returnType: body.returnType as ReturnType
        }
      }
    })
    if (existingReturn) {
      return NextResponse.json(
        { success: false, error: 'Ya existe una declaración para este período y tipo' },
        { status: 409 }
      )
    }
    
    const newTaxReturn = await db.taxReturns.create({
      data: {
        taxEntityId: body.taxEntityId,
        taxYear: parseInt(body.taxYear),
        taxPeriod: body.taxPeriod,
        periodType: body.periodType as PeriodType,
        returnType: body.returnType as ReturnType,
        formCode: body.formCode || null,
        grossIncome: body.grossIncome ? parseFloat(body.grossIncome) : null,
        taxableIncome: body.taxableIncome ? parseFloat(body.taxableIncome) : null,
        taxOwed: body.taxOwed ? parseFloat(body.taxOwed) : null,
        taxPaid: body.taxPaid ? parseFloat(body.taxPaid) : null,
        taxRefund: body.taxRefund ? parseFloat(body.taxRefund) : null,
        penalties: body.penalties ? parseFloat(body.penalties) : null,
        interest: body.interest ? parseFloat(body.interest) : null,
        currency: body.currency || 'USD',
        status: body.status as ReturnStatus || 'DRAFT',
        dueDate: new Date(body.dueDate),
        extensionDate: body.extensionDate ? new Date(body.extensionDate) : null,
        filingDate: body.filingDate ? new Date(body.filingDate) : null,
        originalDocument: body.originalDocument || null,
        processedDocument: body.processedDocument || null,
        attachments: body.attachments || null,
        validationScore: body.validationScore ? parseFloat(body.validationScore) : null,
        requiresReview: body.requiresReview || false,
        reviewNotes: body.reviewNotes || null
      },
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
    })
    
    return NextResponse.json({
      success: true,
      data: newTaxReturn
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating tax return:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}