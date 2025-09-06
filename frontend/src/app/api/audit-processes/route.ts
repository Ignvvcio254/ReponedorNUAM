import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const taxEntityId = searchParams.get('taxEntityId')
    const auditType = searchParams.get('auditType')
    const status = searchParams.get('status')
    const active = searchParams.get('active') === 'true'
    
    const whereClause: any = {}
    if (taxEntityId) whereClause.taxEntityId = taxEntityId
    if (auditType) whereClause.auditType = auditType
    if (status) whereClause.status = status
    if (active) {
      whereClause.status = { 
        in: ['INITIATED', 'IN_PROGRESS', 'PENDING_RESPONSE', 'UNDER_REVIEW'] 
      }
    }
    
    const auditProcesses = await db.auditProcess.findMany({
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
        taxReturn: {
          select: {
            id: true,
            taxYear: true,
            taxPeriod: true,
            returnType: true
          }
        }
      },
      orderBy: {
        startDate: 'desc'
      }
    })
    
    return NextResponse.json({
      success: true,
      data: auditProcesses,
      total: auditProcesses.length
    })
  } catch (error) {
    console.error('Error fetching audit processes:', error)
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
    if (!body.taxEntityId || !body.auditNumber || !body.auditType || !body.scope || !body.startDate) {
      return NextResponse.json(
        { success: false, error: 'Campos requeridos: taxEntityId, auditNumber, auditType, scope, startDate' },
        { status: 400 }
      )
    }
    
    // Verificar que la entidad tributaria existe
    const taxEntity = await db.taxEntity.findUnique({
      where: { id: body.taxEntityId }
    })
    if (!taxEntity) {
      return NextResponse.json(
        { success: false, error: 'Entidad tributaria no encontrada' },
        { status: 404 }
      )
    }
    
    // Verificar que el número de auditoría no existe
    const existingAudit = await db.auditProcess.findUnique({
      where: { auditNumber: body.auditNumber }
    })
    if (existingAudit) {
      return NextResponse.json(
        { success: false, error: 'Ya existe una auditoría con este número' },
        { status: 409 }
      )
    }
    
    // Verificar que la declaración existe si se especifica
    if (body.taxReturnId) {
      const taxReturn = await db.taxReturn.findUnique({
        where: { id: body.taxReturnId }
      })
      if (!taxReturn) {
        return NextResponse.json(
          { success: false, error: 'Declaración tributaria no encontrada' },
          { status: 404 }
        )
      }
    }
    
    const newAuditProcess = await db.auditProcess.create({
      data: {
        taxEntityId: body.taxEntityId,
        taxReturnId: body.taxReturnId || null,
        auditNumber: body.auditNumber,
        auditType: body.auditType,
        scope: body.scope,
        startDate: new Date(body.startDate),
        endDate: body.endDate ? new Date(body.endDate) : null,
        notificationDate: body.notificationDate ? new Date(body.notificationDate) : null,
        status: body.status || 'INITIATED',
        auditor: body.auditor || null,
        team: body.team || null,
        findings: body.findings || null,
        recommendations: body.recommendations || null,
        additionalTax: body.additionalTax ? parseFloat(body.additionalTax) : null,
        penalties: body.penalties ? parseFloat(body.penalties) : null,
        interest: body.interest ? parseFloat(body.interest) : null,
        documents: body.documents || null,
        finalReport: body.finalReport || null
      },
      include: {
        taxEntity: {
          select: {
            id: true,
            businessName: true,
            taxId: true,
            country: true
          }
        },
        taxReturn: {
          select: {
            id: true,
            taxYear: true,
            taxPeriod: true,
            returnType: true
          }
        }
      }
    })
    
    return NextResponse.json({
      success: true,
      data: newAuditProcess
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating audit process:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}