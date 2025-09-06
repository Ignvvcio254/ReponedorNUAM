import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { Country } from '../../../../../generated/prisma'

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const country = searchParams.get('country')
    const period = searchParams.get('period') // 'month', 'quarter', 'year'
    const year = searchParams.get('year')
    
    // Calcular rango de fechas
    const now = new Date()
    let startDate: Date
    let endDate: Date = now
    
    switch (period) {
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1)
        break
      case 'quarter':
        const quarterStartMonth = Math.floor(now.getMonth() / 3) * 3
        startDate = new Date(now.getFullYear(), quarterStartMonth, 1)
        break
      case 'year':
        startDate = new Date(parseInt(year || now.getFullYear().toString()), 0, 1)
        endDate = new Date(parseInt(year || now.getFullYear().toString()), 11, 31)
        break
      default:
        startDate = new Date(now.getFullYear(), 0, 1) // Año actual por defecto
    }

    const whereClause: any = {
      createdAt: {
        gte: startDate,
        lte: endDate
      }
    }
    if (country) whereClause.country = country

    // Estadísticas generales
    const [
      totalQualifications,
      approvedQualifications,
      pendingQualifications,
      rejectedQualifications,
      totalTaxEntities,
      activeTaxEntities,
      totalTaxReturns,
      overdueTaxReturns,
      totalTaxPayments,
      verifiedPayments,
      totalAudits,
      activeAudits
    ] = await Promise.all([
      // Calificaciones
      db.qualification.count({ where: whereClause }),
      db.qualification.count({ where: { ...whereClause, status: 'APPROVED' } }),
      db.qualification.count({ where: { ...whereClause, status: 'PENDING' } }),
      db.qualification.count({ where: { ...whereClause, status: 'REJECTED' } }),
      
      // Entidades tributarias
      db.taxEntity.count({ where: country ? { country: country as Country } : {} }),
      db.taxEntity.count({ where: { status: 'ACTIVE', ...(country && { country: country as Country }) } }),
      
      // Declaraciones tributarias
      db.taxReturn.count({ where: { taxEntity: country ? { country: country as Country } : {}, createdAt: { gte: startDate, lte: endDate } } }),
      db.taxReturn.count({ 
        where: { 
          dueDate: { lt: now },
          status: { notIn: ['SUBMITTED', 'ACCEPTED'] },
          taxEntity: country ? { country: country as Country } : {}
        } 
      }),
      
      // Pagos tributarios
      db.taxPayment.count({ where: { paymentDate: { gte: startDate, lte: endDate } } }),
      db.taxPayment.count({ 
        where: { 
          verified: true,
          paymentDate: { gte: startDate, lte: endDate } 
        } 
      }),
      
      // Auditorías
      db.auditProcess.count({ where: { startDate: { gte: startDate, lte: endDate } } }),
      db.auditProcess.count({ 
        where: { 
          status: { in: ['INITIATED', 'IN_PROGRESS', 'PENDING_RESPONSE', 'UNDER_REVIEW'] }
        } 
      })
    ])

    // Estadísticas por país
    const qualificationsByCountry = await db.qualification.groupBy({
      by: ['country'],
      where: whereClause,
      _count: true,
      _sum: {
        amount: true,
        calculatedValue: true
      }
    })

    // Estadísticas por mes (últimos 6 meses)
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1)
    const monthlyQualifications = country 
      ? await db.$queryRaw`
          SELECT 
            DATE_TRUNC('month', "createdAt") as month,
            COUNT(*)::integer as count,
            SUM("amount")::float as total_amount
          FROM "qualifications" 
          WHERE "createdAt" >= ${sixMonthsAgo} AND "createdAt" <= ${endDate}
            AND "country" = ${country}
          GROUP BY DATE_TRUNC('month', "createdAt")
          ORDER BY month ASC
        `
      : await db.$queryRaw`
          SELECT 
            DATE_TRUNC('month', "createdAt") as month,
            COUNT(*)::integer as count,
            SUM("amount")::float as total_amount
          FROM "qualifications" 
          WHERE "createdAt" >= ${sixMonthsAgo} AND "createdAt" <= ${endDate}
          GROUP BY DATE_TRUNC('month', "createdAt")
          ORDER BY month ASC
        `

    // Top emisores por calificaciones
    const topEmisors = await db.qualification.groupBy({
      by: ['emisorName'],
      where: whereClause,
      _count: true,
      _sum: {
        amount: true
      },
      orderBy: {
        _count: {
          emisorName: 'desc'
        }
      },
      take: 10
    })

    // Estadísticas de importaciones
    const importStats = await db.importBatch.aggregate({
      where: {
        createdAt: { gte: startDate, lte: endDate }
      },
      _count: true,
      _sum: {
        totalRecords: true,
        successfulRecords: true,
        failedRecords: true
      }
    })

    const response = NextResponse.json({
      success: true,
      data: {
        period: {
          start: startDate,
          end: endDate,
          type: period || 'year'
        },
        overview: {
          qualifications: {
            total: totalQualifications,
            approved: approvedQualifications,
            pending: pendingQualifications,
            rejected: rejectedQualifications,
            approvalRate: totalQualifications > 0 ? ((approvedQualifications / totalQualifications) * 100).toFixed(1) : '0'
          },
          taxEntities: {
            total: totalTaxEntities,
            active: activeTaxEntities,
            activeRate: totalTaxEntities > 0 ? ((activeTaxEntities / totalTaxEntities) * 100).toFixed(1) : '0'
          },
          taxReturns: {
            total: totalTaxReturns,
            overdue: overdueTaxReturns,
            complianceRate: totalTaxReturns > 0 ? (((totalTaxReturns - overdueTaxReturns) / totalTaxReturns) * 100).toFixed(1) : '100'
          },
          taxPayments: {
            total: totalTaxPayments,
            verified: verifiedPayments,
            verificationRate: totalTaxPayments > 0 ? ((verifiedPayments / totalTaxPayments) * 100).toFixed(1) : '0'
          },
          audits: {
            total: totalAudits,
            active: activeAudits
          }
        },
        byCountry: qualificationsByCountry.map((item: any) => ({
          country: item.country,
          count: item._count,
          totalAmount: item._sum.amount || 0,
          totalCalculatedValue: item._sum.calculatedValue || 0
        })),
        monthlyTrends: monthlyQualifications,
        topEmisors: topEmisors.map((item: any) => ({
          name: item.emisorName,
          count: item._count,
          totalAmount: item._sum.amount || 0
        })),
        imports: {
          totalBatches: importStats._count,
          totalRecords: importStats._sum.totalRecords || 0,
          successfulRecords: importStats._sum.successfulRecords || 0,
          failedRecords: importStats._sum.failedRecords || 0,
          successRate: (importStats._sum.totalRecords || 0) > 0 ? 
            (((importStats._sum.successfulRecords || 0) / (importStats._sum.totalRecords || 0)) * 100).toFixed(1) : '0'
        }
      }
    })
    
    // Add CORS headers
    response.headers.set('Access-Control-Allow-Origin', '*')
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type')
    
    return response
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    const response = NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
    
    // Add CORS headers to error response
    response.headers.set('Access-Control-Allow-Origin', '*')
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type')
    
    return response
  }
}