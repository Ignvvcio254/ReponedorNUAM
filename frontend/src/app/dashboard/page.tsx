'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { api } from '@/lib/api'
import { formatCurrency, getCountryFlag, getStatusColor } from '@/lib/utils'
import { COUNTRIES } from '@/lib/constants'

interface DashboardStats {
  totalQualifications: number
  pendingApprovals: number
  approvedThisMonth: number
  averageAmount: number
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalQualifications: 0,
    pendingApprovals: 0,
    approvedThisMonth: 0,
    averageAmount: 0
  })
  const [qualifications, setQualifications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      const response = await api.qualifications.getAll()
      const data = response.data

      setQualifications(data)
      
      // Calcular estadísticas
      const total = data.length
      const pending = data.filter((q: any) => q.status === 'PENDING').length
      const approved = data.filter((q: any) => q.status === 'APPROVED').length
      const avgAmount = data.reduce((sum: number, q: any) => sum + q.amount, 0) / total

      setStats({
        totalQualifications: total,
        pendingApprovals: pending,
        approvedThisMonth: approved,
        averageAmount: avgAmount
      })
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-nuam-600"></div>
          <p className="mt-4 text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-4 sm:py-6 lg:py-8">
        {/* Page Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 truncate">
                Dashboard
              </h1>
              <p className="mt-1 sm:mt-2 text-sm sm:text-base text-gray-600">
                Vista general del sistema de calificaciones tributarias NUAM
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
              <Button 
                variant="secondary" 
                size="sm"
                className="w-full sm:w-auto text-xs sm:text-sm"
              >
                <span className="sm:hidden">➕</span>
                <span className="hidden sm:inline">Nueva Calificación</span>
              </Button>
              <Button 
                size="sm"
                className="w-full sm:w-auto text-xs sm:text-sm"
              >
                <span className="sm:hidden">📤</span>
                <span className="hidden sm:inline">Carga Masiva</span>
              </Button>
            </div>
          </div>
        </div>

      {/* Main Content */}
      <div>
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card className="hover:shadow-md transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-gray-600 truncate">
                Total Calificaciones
              </CardTitle>
              <div className="text-lg sm:text-xl">📊</div>
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                {stats.totalQualifications}
              </div>
              <p className="text-xs text-gray-500 mt-1">Todas las calificaciones</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-gray-600 truncate">
                Pendientes
              </CardTitle>
              <div className="text-lg sm:text-xl">⏳</div>
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-yellow-600">
                {stats.pendingApprovals}
              </div>
              <p className="text-xs text-gray-500 mt-1">Esperando aprobación</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-gray-600 truncate">
                Aprobadas este mes
              </CardTitle>
              <div className="text-lg sm:text-xl">✅</div>
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-600">
                {stats.approvedThisMonth}
              </div>
              <p className="text-xs text-gray-500 mt-1">En los últimos 30 días</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-gray-600 truncate">
                Monto Promedio
              </CardTitle>
              <div className="text-lg sm:text-xl">💰</div>
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-nuam-600">
                {formatCurrency(stats.averageAmount)}
              </div>
              <p className="text-xs text-gray-500 mt-1">Por calificación</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Qualifications */}
        <Card className="overflow-hidden">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
              <span>📋</span>
              Calificaciones Recientes
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {/* Mobile View */}
            <div className="block sm:hidden">
              <div className="divide-y divide-gray-200">
                {qualifications.slice(0, 5).map((qualification: any) => (
                  <div key={qualification.id} className="p-4 hover:bg-gray-50">
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-medium text-gray-900 truncate">
                        {qualification.emisorName}
                      </div>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(qualification.status)}`}>
                        {qualification.status}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500 space-y-1">
                      <div className="flex items-center gap-2">
                        <span>{getCountryFlag(qualification.country)}</span>
                        <span>{qualification.period}</span>
                      </div>
                      <div className="font-medium text-gray-900">
                        {formatCurrency(qualification.amount, qualification.country)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Desktop/Tablet View */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Emisor
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      País
                    </th>
                    <th className="hidden md:table-cell px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Período
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Monto
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {qualifications.slice(0, 5).map((qualification: any) => (
                    <tr key={qualification.id} className="hover:bg-gray-50">
                      <td className="px-3 sm:px-6 py-3 sm:py-4 text-sm text-gray-900">
                        <div className="truncate max-w-32 sm:max-w-none" title={qualification.emisorName}>
                          {qualification.emisorName}
                        </div>
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 text-sm text-gray-900">
                        <div className="flex items-center">
                          <span className="text-base sm:text-lg">{getCountryFlag(qualification.country)}</span>
                          <span className="ml-1 sm:ml-2 hidden lg:inline">
                            {COUNTRIES[qualification.country as keyof typeof COUNTRIES].name}
                          </span>
                        </div>
                      </td>
                      <td className="hidden md:table-cell px-3 sm:px-6 py-3 sm:py-4 text-sm text-gray-900">
                        {qualification.period}
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 text-sm text-gray-900">
                        <div className="truncate">
                          {formatCurrency(qualification.amount, qualification.country)}
                        </div>
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(qualification.status)}`}>
                          <span className="sm:hidden">
                            {qualification.status === 'APPROVED' ? '✅' : 
                             qualification.status === 'PENDING' ? '⏳' : 
                             qualification.status === 'REJECTED' ? '❌' : '📝'}
                          </span>
                          <span className="hidden sm:inline">{qualification.status}</span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
