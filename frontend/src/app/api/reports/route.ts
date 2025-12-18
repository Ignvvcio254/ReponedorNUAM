import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const reportType = searchParams.get('type') || 'summary'
    const country = searchParams.get('country') || undefined
    const startDate = searchParams.get('startDate') || undefined
    const endDate = searchParams.get('endDate') || undefined
    const status = searchParams.get('status') || undefined

    // Construir filtros
    const whereClause: any = {}
    if (country) whereClause.country = country
    if (status) whereClause.status = status
    if (startDate || endDate) {
      whereClause.createdAt = {}
      if (startDate) whereClause.createdAt.gte = new Date(startDate)
      if (endDate) whereClause.createdAt.lte = new Date(endDate)
    }

    let data = null

    switch (reportType) {
      case 'qualifications':
        // Reporte de calificaciones
        data = await db.qualification.findMany({
          where: whereClause,
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        })
        break

      case 'entities':
        // Reporte de entidades tributarias
        const entityWhereClause: any = {}
        if (country) entityWhereClause.country = country as any
        if (status) entityWhereClause.status = status as any

        data = await db.taxEntity.findMany({
          where: entityWhereClause,
          orderBy: {
            createdAt: 'desc',
          },
        })
        break

      case 'summary':
        // Reporte resumen por país
        const qualifications = await db.qualification.findMany({
          where: whereClause,
          select: {
            country: true,
            status: true,
            amount: true,
          },
        })

        // Agrupar por país
        const summaryByCountry: Record<
          string,
          {
            country: string
            totalQualifications: number
            approved: number
            pending: number
            rejected: number
            totalAmount: number
            averageAmount: number
          }
        > = {}

        qualifications.forEach((qual) => {
          if (!summaryByCountry[qual.country]) {
            summaryByCountry[qual.country] = {
              country: qual.country,
              totalQualifications: 0,
              approved: 0,
              pending: 0,
              rejected: 0,
              totalAmount: 0,
              averageAmount: 0,
            }
          }

          const summary = summaryByCountry[qual.country]
          summary.totalQualifications++
          summary.totalAmount += Number(qual.amount)

          if (qual.status === 'APPROVED') summary.approved++
          if (qual.status === 'PENDING') summary.pending++
          if (qual.status === 'REJECTED') summary.rejected++
        })

        // Calcular promedios
        Object.values(summaryByCountry).forEach((summary) => {
          summary.averageAmount =
            summary.totalQualifications > 0
              ? summary.totalAmount / summary.totalQualifications
              : 0
        })

        data = Object.values(summaryByCountry).sort(
          (a, b) => b.totalQualifications - a.totalQualifications
        )
        break

      case 'complete':
        // Reporte completo con todas las secciones
        const [qualificationsData, entitiesData, summaryData] =
          await Promise.all([
            // Calificaciones
            db.qualification.findMany({
              where: whereClause,
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                  },
                },
              },
              orderBy: {
                createdAt: 'desc',
              },
            }),

            // Entidades
            db.taxEntity.findMany({
              where: country ? { country: country as any } : {},
              orderBy: {
                createdAt: 'desc',
              },
            }),

            // Resumen (calculado)
            db.qualification
              .findMany({
                where: whereClause,
                select: {
                  country: true,
                  status: true,
                  amount: true,
                },
              })
              .then((quals) => {
                const summaryMap: Record<string, any> = {}
                quals.forEach((qual) => {
                  if (!summaryMap[qual.country]) {
                    summaryMap[qual.country] = {
                      country: qual.country,
                      totalQualifications: 0,
                      approved: 0,
                      pending: 0,
                      rejected: 0,
                      totalAmount: 0,
                      averageAmount: 0,
                    }
                  }
                  const summary = summaryMap[qual.country]
                  summary.totalQualifications++
                  summary.totalAmount += Number(qual.amount)
                  if (qual.status === 'APPROVED') summary.approved++
                  if (qual.status === 'PENDING') summary.pending++
                  if (qual.status === 'REJECTED') summary.rejected++
                })
                Object.values(summaryMap).forEach((summary: any) => {
                  summary.averageAmount =
                    summary.totalQualifications > 0
                      ? summary.totalAmount / summary.totalQualifications
                      : 0
                })
                return Object.values(summaryMap)
              }),
          ])

        data = {
          qualifications: qualificationsData,
          entities: entitiesData,
          summary: summaryData,
        }
        break

      case 'stats':
        // Estadísticas generales
        const totalQuals = await db.qualification.count({ where: whereClause })
        const totalEntities = await db.taxEntity.count({
          where: country ? { country: country as any } : {},
        })

        const statusCounts = await db.qualification.groupBy({
          by: ['status'],
          where: whereClause,
          _count: {
            status: true,
          },
        })

        const countryCounts = await db.qualification.groupBy({
          by: ['country'],
          where: whereClause,
          _count: {
            country: true,
          },
          orderBy: {
            _count: {
              country: 'desc',
            },
          },
        })

        data = {
          totalQualifications: totalQuals,
          totalEntities: totalEntities,
          byStatus: statusCounts.map((item) => ({
            status: item.status,
            count: item._count.status,
          })),
          byCountry: countryCounts.map((item) => ({
            country: item.country,
            count: item._count.country,
          })),
        }
        break

      default:
        return NextResponse.json(
          { success: false, error: 'Tipo de reporte inválido' },
          { status: 400 }
        )
    }

    const response = NextResponse.json({
      success: true,
      data: data,
      filters: {
        type: reportType,
        country,
        startDate,
        endDate,
        status,
      },
    })

    response.headers.set('Access-Control-Allow-Origin', '*')
    response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type')

    return response
  } catch (error) {
    console.error('Error generating report:', error)
    const response = NextResponse.json(
      { success: false, error: 'Error al generar el reporte' },
      { status: 500 }
    )

    response.headers.set('Access-Control-Allow-Origin', '*')
    response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type')

    return response
  }
}
