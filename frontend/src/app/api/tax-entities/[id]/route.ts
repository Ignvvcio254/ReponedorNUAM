import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { Country, EntityType, EntityStatus, TaxRegime } from '@prisma/client'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const taxEntity = await db.taxEntities.findUnique({
      where: { id: params.id },
      include: {
        taxReturns: {
          orderBy: { createdAt: 'desc' }
        },
        taxPayments: {
          orderBy: { paymentDate: 'desc' }
        },
        taxCertificates: {
          orderBy: { issuedDate: 'desc' }
        },
        taxObligations: {
          where: { status: 'ACTIVE' }
        },
        auditProcesses: {
          orderBy: { startDate: 'desc' }
        },
        _count: {
          select: {
            taxReturns: true,
            taxPayments: true,
            taxCertificates: true,
            auditProcesses: true
          }
        }
      }
    })

    if (!taxEntity) {
      return NextResponse.json(
        { success: false, error: 'Entidad tributaria no encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: taxEntity
    })
  } catch (error) {
    console.error('Error fetching tax entity:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    
    // Verificar que la entidad existe
    const existingEntity = await db.taxEntities.findUnique({
      where: { id: params.id }
    })

    if (!existingEntity) {
      return NextResponse.json(
        { success: false, error: 'Entidad tributaria no encontrada' },
        { status: 404 }
      )
    }

    // Si se actualiza el taxId, verificar que no exista otro
    if (body.taxId && body.taxId !== existingEntity.taxId) {
      const duplicateEntity = await db.taxEntities.findUnique({
        where: { taxId: body.taxId }
      })
      if (duplicateEntity) {
        return NextResponse.json(
          { success: false, error: 'Ya existe una entidad con este Tax ID' },
          { status: 409 }
        )
      }
    }

    const updatedTaxEntity = await db.taxEntities.update({
      where: { id: params.id },
      data: {
        ...(body.businessName && { businessName: body.businessName }),
        ...(body.tradeName !== undefined && { tradeName: body.tradeName }),
        ...(body.taxId && { taxId: body.taxId }),
        ...(body.entityType && { entityType: body.entityType as EntityType }),
        ...(body.country && { country: body.country as Country }),
        ...(body.state !== undefined && { state: body.state }),
        ...(body.city !== undefined && { city: body.city }),
        ...(body.address !== undefined && { address: body.address }),
        ...(body.postalCode !== undefined && { postalCode: body.postalCode }),
        ...(body.taxRegime && { taxRegime: body.taxRegime as TaxRegime }),
        ...(body.economicActivity !== undefined && { economicActivity: body.economicActivity }),
        ...(body.naicsCode !== undefined && { naicsCode: body.naicsCode }),
        ...(body.status && { status: body.status as EntityStatus }),
        ...(body.registrationDate && { registrationDate: new Date(body.registrationDate) })
      },
      include: {
        _count: {
          select: {
            taxReturns: true,
            taxPayments: true,
            taxCertificates: true,
            auditProcesses: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: updatedTaxEntity
    })
  } catch (error) {
    console.error('Error updating tax entity:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Verificar que la entidad existe
    const existingEntity = await db.taxEntities.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: {
            taxReturns: true,
            taxPayments: true,
            taxCertificates: true,
            auditProcesses: true
          }
        }
      }
    })

    if (!existingEntity) {
      return NextResponse.json(
        { success: false, error: 'Entidad tributaria no encontrada' },
        { status: 404 }
      )
    }

    // Verificar si tiene registros relacionados
    const hasRelatedRecords = existingEntity._count.taxReturns > 0 || 
                              existingEntity._count.taxPayments > 0 || 
                              existingEntity._count.taxCertificates > 0 || 
                              existingEntity._count.auditProcesses > 0

    if (hasRelatedRecords) {
      return NextResponse.json(
        { success: false, error: 'No se puede eliminar la entidad porque tiene registros asociados. Considere cambiar el estado a INACTIVE.' },
        { status: 409 }
      )
    }

    await db.taxEntities.delete({
      where: { id: params.id }
    })

    return NextResponse.json({
      success: true,
      message: 'Entidad tributaria eliminada exitosamente'
    })
  } catch (error) {
    console.error('Error deleting tax entity:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}