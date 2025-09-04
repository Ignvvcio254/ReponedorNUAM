import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const country = searchParams.get('country') || undefined
    const status = searchParams.get('status') || undefined
    
    const qualifications = await db.qualifications.findMany({ country, status })
    
    return NextResponse.json({
      success: true,
      data: qualifications,
      total: qualifications.length
    })
  } catch (error) {
    console.error('Error fetching qualifications:', error)
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
    if (!body.emisorId || !body.period || !body.amount) {
      return NextResponse.json(
        { success: false, error: 'Campos requeridos: emisorId, period, amount' },
        { status: 400 }
      )
    }
    
    // Verificar que el emisor existe
    const emisor = await db.emisors.findById(body.emisorId)
    if (!emisor) {
      return NextResponse.json(
        { success: false, error: 'Emisor no encontrado' },
        { status: 404 }
      )
    }
    
    const newQualification = await db.qualifications.create({
      emisorId: body.emisorId,
      emisorName: emisor.businessName,
      period: body.period,
      amount: parseFloat(body.amount),
      factorApplied: body.factorApplied || 64649, // UTM por defecto para Chile
      calculatedValue: parseFloat(body.amount) / (body.factorApplied || 64649),
      status: 'DRAFT',
      country: emisor.country
    })
    
    return NextResponse.json({
      success: true,
      data: newQualification
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating qualification:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
