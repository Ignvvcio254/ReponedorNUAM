import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { Country, EntityType, EntityStatus, TaxRegime } from '../../../../generated/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const country = searchParams.get('country') as Country || undefined
    const status = searchParams.get('status') as EntityStatus || undefined
    const entityType = searchParams.get('entityType') as EntityType || undefined
    const search = searchParams.get('search') || undefined
    
    const whereClause: any = {}
    if (country) whereClause.country = country
    if (status) whereClause.status = status
    if (entityType) whereClause.entityType = entityType
    if (search) {
      whereClause.OR = [
        { businessName: { contains: search, mode: 'insensitive' } },
        { taxId: { contains: search, mode: 'insensitive' } },
        { tradeName: { contains: search, mode: 'insensitive' } }
      ]
    }
    
    const taxEntities = await db.taxEntity.findMany({
      where: whereClause,
      include: {
        taxReturns: {
          take: 5,
          orderBy: { createdAt: 'desc' }
        },
        certificates: {
          take: 3,
          orderBy: { issuedDate: 'desc' }
        },
        _count: {
          select: {
            taxReturns: true,
            obligations: true,
            certificates: true,
            auditProcesses: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    
    return NextResponse.json({
      success: true,
      data: taxEntities,
      total: taxEntities.length
    })
  } catch (error) {
    console.error('Error fetching tax entities:', error)
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
    if (!body.businessName || !body.taxId || !body.country || !body.entityType || !body.taxRegime) {
      return NextResponse.json(
        { success: false, error: 'Campos requeridos: businessName, taxId, country, entityType, taxRegime' },
        { status: 400 }
      )
    }
    
    // Verificar que el taxId no existe ya
    const existingEntity = await db.taxEntity.findUnique({
      where: { taxId: body.taxId }
    })
    if (existingEntity) {
      return NextResponse.json(
        { success: false, error: 'Ya existe una entidad con este Tax ID' },
        { status: 409 }
      )
    }
    
    const newTaxEntity = await db.taxEntity.create({
      data: {
        businessName: body.businessName,
        tradeName: body.tradeName || null,
        taxId: body.taxId,
        entityType: body.entityType as EntityType,
        country: body.country as Country,
        state: body.state || null,
        city: body.city || null,
        address: body.address || null,
        postalCode: body.postalCode || null,
        taxRegime: body.taxRegime as TaxRegime,
        economicActivity: body.economicActivity || null,
        naicsCode: body.naicsCode || null,
        status: body.status as EntityStatus || 'ACTIVE',
        registrationDate: body.registrationDate ? new Date(body.registrationDate) : null
      },
      include: {
        _count: {
          select: {
            taxReturns: true,
            obligations: true,
            certificates: true,
            auditProcesses: true
          }
        }
      }
    })
    
    return NextResponse.json({
      success: true,
      data: newTaxEntity
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating tax entity:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}