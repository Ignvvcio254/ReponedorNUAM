import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const country = searchParams.get('country') || undefined
    const status = searchParams.get('status') || undefined
    
    const whereClause: any = {}
    if (country) whereClause.country = country
    if (status) whereClause.status = status
    
    const qualifications = await db.qualification.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    
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
    if (!body.emisorName || !body.period || !body.amount || !body.country || !body.userId) {
      return NextResponse.json(
        { success: false, error: 'Campos requeridos: emisorName, period, amount, country, userId' },
        { status: 400 }
      )
    }
    
    // Verificar que el usuario existe
    const user = await db.user.findUnique({
      where: { id: body.userId }
    })
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Usuario no encontrado' },
        { status: 404 }
      )
    }
    
    // Calcular valor según UTM/UIT del país
    const exchangeRates: Record<string, number> = {
      CL: 64649,  // UTM Chile
      PE: 5150,   // UIT Perú
      CO: 42412,  // UVT Colombia
      MX: 108.57, // UMA México
      AR: 25000   // UF Argentina
    }
    
    const factor = exchangeRates[body.country] || 1
    const calculatedValue = parseFloat(body.amount) / factor
    
    const newQualification = await db.qualification.create({
      data: {
        emisorName: body.emisorName,
        taxId: body.taxId || null,
        country: body.country,
        period: body.period,
        amount: parseFloat(body.amount),
        currency: body.currency || 'USD',
        calculatedValue: calculatedValue,
        status: 'DRAFT',
        observations: body.observations || null,
        documentUrl: body.documentUrl || null,
        userId: body.userId
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
