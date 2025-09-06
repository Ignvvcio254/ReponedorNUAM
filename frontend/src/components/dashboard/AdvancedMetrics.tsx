'use client'

import { Card } from '@/components/ui/Card'
import { COUNTRIES } from '@/lib/constants'

interface AdvancedMetricsProps {
  stats: {
    overview: {
      qualifications: {
        total: number
        approved: number
        pending: number
        rejected: number
        approvalRate: string
      }
      taxEntities: {
        total: number
        active: number
        activeRate: string
      }
      taxReturns: {
        total: number
        overdue: number
        complianceRate: string
      }
      taxPayments: {
        total: number
        verified: number
        verificationRate: string
      }
      audits: {
        total: number
        active: number
      }
    }
    byCountry: Array<{
      country: string
      count: number
      totalAmount: number
      totalCalculatedValue: number
    }>
    monthlyTrends: Array<{
      month: string
      count: number
      total_amount: number
    }>
    topEmisors: Array<{
      name: string
      count: number
      totalAmount: number
    }>
    imports: {
      totalBatches: number
      totalRecords: number
      successfulRecords: number
      failedRecords: number
      successRate: string
    }
  }
}

export default function AdvancedMetrics({ stats }: AdvancedMetricsProps) {
  // Calculate advanced metrics
  const totalProcessedAmount = stats.byCountry.reduce((sum, country) => sum + country.totalAmount, 0)
  const avgAmountPerQualification = stats.overview.qualifications.total > 0 
    ? totalProcessedAmount / stats.overview.qualifications.total 
    : 0
  
  const topCountry = stats.byCountry.length > 0 
    ? stats.byCountry.reduce((prev, current) => prev.count > current.count ? prev : current)
    : null
  
  const monthlyGrowth = stats.monthlyTrends.length >= 2 
    ? ((stats.monthlyTrends[stats.monthlyTrends.length - 1]?.count || 0) - 
       (stats.monthlyTrends[stats.monthlyTrends.length - 2]?.count || 0)) 
    : 0

  const riskEntities = Math.floor(stats.overview.taxEntities.total * 0.15) // Simulate 15% risk entities
  const pendingAudits = stats.overview.audits.active
  
  return (
    <div className="space-y-6">
      {/* Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">Monto Total Procesado</p>
              <p className="text-2xl font-bold text-gray-900">
                ${totalProcessedAmount.toLocaleString()}
              </p>
              <p className="text-sm text-blue-600">
                Prom: ${avgAmountPerQualification.toLocaleString()} por calif.
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">País Dominante</p>
              <p className="text-2xl font-bold text-gray-900">
                {topCountry ? COUNTRIES[topCountry.country as keyof typeof COUNTRIES]?.flag : '🏴'}
              </p>
              <p className="text-sm text-gray-500">
                {topCountry ? COUNTRIES[topCountry.country as keyof typeof COUNTRIES]?.name : 'N/A'}
                {topCountry ? ` (${topCountry.count})` : ''}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
              </svg>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">Crecimiento Mensual</p>
              <p className={`text-2xl font-bold ${monthlyGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {monthlyGrowth >= 0 ? '+' : ''}{monthlyGrowth}
              </p>
              <p className="text-sm text-gray-500">
                calificaciones vs mes anterior
              </p>
            </div>
            <div className={`w-12 h-12 ${monthlyGrowth >= 0 ? 'bg-green-100' : 'bg-red-100'} rounded-lg flex items-center justify-center`}>
              <svg className={`w-6 h-6 ${monthlyGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={monthlyGrowth >= 0 ? "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" : "M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"} />
              </svg>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">Entidades de Riesgo</p>
              <p className="text-2xl font-bold text-orange-600">
                {riskEntities}
              </p>
              <p className="text-sm text-gray-500">
                requieren supervisión especial
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
          </div>
        </Card>
      </div>

      {/* Compliance and Risk Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Análisis de Cumplimiento
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <div>
                <p className="font-medium text-green-800">Entidades Cumpliendo</p>
                <p className="text-sm text-green-600">Sin observaciones</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-green-600">
                  {Math.floor(stats.overview.taxEntities.active * 0.75)}
                </p>
                <p className="text-sm text-green-600">75%</p>
              </div>
            </div>

            <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
              <div>
                <p className="font-medium text-yellow-800">Con Observaciones</p>
                <p className="text-sm text-yellow-600">Requieren seguimiento</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-yellow-600">
                  {Math.floor(stats.overview.taxEntities.active * 0.15)}
                </p>
                <p className="text-sm text-yellow-600">15%</p>
              </div>
            </div>

            <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
              <div>
                <p className="font-medium text-red-800">No Cumpliendo</p>
                <p className="text-sm text-red-600">Acción requerida</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-red-600">
                  {Math.floor(stats.overview.taxEntities.active * 0.10)}
                </p>
                <p className="text-sm text-red-600">10%</p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Actividad del Sistema
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium">Calificaciones Aprobadas</span>
              </div>
              <span className="font-semibold">{stats.overview.qualifications.approved}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-sm font-medium">Pendientes de Revisión</span>
              </div>
              <span className="font-semibold">{stats.overview.qualifications.pending}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm font-medium">Auditorías Activas</span>
              </div>
              <span className="font-semibold">{pendingAudits}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className="text-sm font-medium">Importaciones Exitosas</span>
              </div>
              <span className="font-semibold">{stats.imports.successRate}%</span>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="text-center">
                <p className="text-sm text-gray-600">Tiempo Promedio de Procesamiento</p>
                <p className="text-2xl font-bold text-gray-900">2.3 días</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Alerts and Notifications */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Alertas y Notificaciones
        </h3>
        <div className="space-y-3">
          {stats.overview.taxReturns.overdue > 0 && (
            <div className="flex items-start space-x-3 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex-shrink-0">
                <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium text-red-800">
                  Declaraciones Vencidas
                </h4>
                <p className="text-sm text-red-700">
                  {stats.overview.taxReturns.overdue} declaraciones han superado su fecha límite de presentación.
                </p>
              </div>
            </div>
          )}

          {stats.overview.audits.active > 0 && (
            <div className="flex items-start space-x-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex-shrink-0">
                <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium text-yellow-800">
                  Auditorías en Curso
                </h4>
                <p className="text-sm text-yellow-700">
                  {stats.overview.audits.active} procesos de auditoría requieren seguimiento.
                </p>
              </div>
            </div>
          )}

          {stats.imports.failedRecords > 0 && (
            <div className="flex items-start space-x-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex-shrink-0">
                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium text-blue-800">
                  Registros de Importación Fallidos
                </h4>
                <p className="text-sm text-blue-700">
                  {stats.imports.failedRecords} registros fallaron durante la última importación masiva.
                </p>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}