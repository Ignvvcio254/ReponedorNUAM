'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/Card'
import { COUNTRIES } from '@/lib/constants'
import ChartsSection from '@/components/dashboard/ChartsSection'
import QuickActionsPanel from '@/components/dashboard/QuickActionsPanel'
import AdvancedMetrics from '@/components/dashboard/AdvancedMetrics'

interface DashboardStats {
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
  // NEW: Real compliance metrics
  compliance?: {
    riskEntities: number
    compliantEntities: number
    entitiesWithObservations: number
    nonCompliantEntities: number
    riskPercentage: string
  }
  recentActivity?: Array<{
    id: string
    action: string
    entityType: string
    entityId: string
    createdAt: string
    userName: string
    description: string
  }>
  processingTime?: {
    averageDays: string | null
    unit: string
  }
}

interface TaxContainerDashboardProps {
  userId?: string
}

export default function TaxContainerDashboard({ userId }: TaxContainerDashboardProps) {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCountry, setSelectedCountry] = useState('')
  const [selectedPeriod, setSelectedPeriod] = useState('year')

  useEffect(() => {
    fetchStats()
  }, [selectedCountry, selectedPeriod])

  const fetchStats = async () => {
    try {
      setIsLoading(true)
      const params = new URLSearchParams({
        ...(selectedCountry && { country: selectedCountry }),
        period: selectedPeriod
      })
      
      const response = await fetch(`/api/dashboard/stats?${params}`)
      const data = await response.json()
      
      if (data.success) {
        setStats(data.data)
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-full"></div>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (!stats) {
    return (
      <Card className="p-12 text-center">
        <div className="text-gray-400 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No hay datos disponibles
        </h3>
        <p className="text-gray-600">
          Los datos del dashboard aparecerán cuando haya información en el sistema.
        </p>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header y controles */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Tributario</h1>
          <p className="text-gray-600 mt-1">
            Resumen ejecutivo del contenedor tributario NUAM
          </p>
        </div>

        <div className="flex gap-4">
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todos los países</option>
            {Object.values(COUNTRIES).map(country => (
              <option key={country.code} value={country.code}>
                {country.flag} {country.name}
              </option>
            ))}
          </select>

          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="month">Este mes</option>
            <option value="quarter">Este trimestre</option>
            <option value="year">Este año</option>
          </select>
        </div>
      </div>

      {/* Quick Actions Panel */}
      <QuickActionsPanel recentActivity={stats.recentActivity} />

      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">Calificaciones Totales</p>
              <p className="text-3xl font-bold text-gray-900">{stats.overview.qualifications.total}</p>
              <p className="text-sm text-green-600">
                {stats.overview.qualifications.approvalRate}% aprobadas
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">Entidades Activas</p>
              <p className="text-3xl font-bold text-gray-900">{stats.overview.taxEntities.active}</p>
              <p className="text-sm text-gray-500">
                de {stats.overview.taxEntities.total} registradas
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">Cumplimiento</p>
              <p className="text-3xl font-bold text-gray-900">{stats.overview.taxReturns.complianceRate}%</p>
              <p className="text-sm text-gray-500">
                {stats.overview.taxReturns.overdue} vencidas
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">Importaciones</p>
              <p className="text-3xl font-bold text-gray-900">{stats.imports.totalRecords}</p>
              <p className="text-sm text-green-600">
                {stats.imports.successRate}% exitosas
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Distribución por país */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Distribución por País
          </h3>
          <div className="space-y-4">
            {stats.byCountry.map((item) => {
              const country = COUNTRIES[item.country as keyof typeof COUNTRIES]
              const percentage = stats.overview.qualifications.total > 0 
                ? (item.count / stats.overview.qualifications.total * 100).toFixed(1) 
                : '0'
              
              return (
                <div key={item.country} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-xl mr-2">{country?.flag}</span>
                    <div>
                      <p className="font-medium text-gray-900">{country?.name}</p>
                      <p className="text-sm text-gray-500">
                        {item.count} calificaciones
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{percentage}%</p>
                    <p className="text-sm text-gray-500">
                      {Number(item.totalCalculatedValue || 0).toFixed(2)} {country?.factor}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </Card>

        {/* Top emisores */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Top Emisores
          </h3>
          <div className="space-y-4">
            {stats.topEmisors.slice(0, 5).map((emisor, index) => (
              <div key={emisor.name} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white mr-3 ${
                    index === 0 ? 'bg-yellow-500' : 
                    index === 1 ? 'bg-gray-400' : 
                    index === 2 ? 'bg-orange-500' : 'bg-blue-500'
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 truncate max-w-48">
                      {emisor.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {emisor.count} calificaciones
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    ${emisor.totalAmount.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Estado de calificaciones */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Estado de Calificaciones
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {stats.overview.qualifications.approved}
            </div>
            <div className="text-sm font-medium text-green-800">
              Aprobadas
            </div>
            <div className="text-xs text-green-600">
              {stats.overview.qualifications.approvalRate}%
            </div>
          </div>
          
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">
              {stats.overview.qualifications.pending}
            </div>
            <div className="text-sm font-medium text-yellow-800">
              Pendientes
            </div>
          </div>
          
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <div className="text-2xl font-bold text-red-600">
              {stats.overview.qualifications.rejected}
            </div>
            <div className="text-sm font-medium text-red-800">
              Rechazadas
            </div>
          </div>
          
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-600">
              {stats.overview.qualifications.total - stats.overview.qualifications.approved - stats.overview.qualifications.pending - stats.overview.qualifications.rejected}
            </div>
            <div className="text-sm font-medium text-gray-800">
              Borradores
            </div>
          </div>
        </div>
      </Card>

      {/* Advanced Metrics */}
      <AdvancedMetrics stats={stats} />

      {/* Charts Section */}
      <ChartsSection stats={stats} />
    </div>
  )
}