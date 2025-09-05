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
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-6 sm:py-8 lg:py-12">
        {/* Page Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div className="min-w-0 flex-1">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 truncate">
                Dashboard
              </h1>
              <p className="mt-2 sm:mt-3 text-base sm:text-lg lg:text-xl text-gray-600">
                Vista general del sistema de calificaciones tributarias NUAM
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
              <Button 
                variant="secondary" 
                size="lg"
                className="w-full sm:w-auto text-sm sm:text-base lg:text-lg px-6 py-3"
              >
                <span className="mr-2">➕</span>
                Nueva Calificación
              </Button>
              <Button 
                size="lg"
                className="w-full sm:w-auto text-sm sm:text-base lg:text-lg px-6 py-3"
              >
                <span className="mr-2">📤</span>
                Carga Masiva
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-8 sm:mb-12">
          <Card className="hover:shadow-lg transition-shadow duration-300 p-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm sm:text-base lg:text-lg font-medium text-gray-600">
                Total Calificaciones
              </CardTitle>
              <div className="text-2xl sm:text-3xl lg:text-4xl">📊</div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900">
                {stats.totalQualifications}
              </div>
              <p className="text-sm sm:text-base text-gray-500 mt-2">Todas las calificaciones</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300 p-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm sm:text-base lg:text-lg font-medium text-gray-600">
                Pendientes
              </CardTitle>
              <div className="text-2xl sm:text-3xl lg:text-4xl">⏳</div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-yellow-600">
                {stats.pendingApprovals}
              </div>
              <p className="text-sm sm:text-base text-gray-500 mt-2">Esperando aprobación</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300 p-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm sm:text-base lg:text-lg font-medium text-gray-600">
                Aprobadas este mes
              </CardTitle>
              <div className="text-2xl sm:text-3xl lg:text-4xl">✅</div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-green-600">
                {stats.approvedThisMonth}
              </div>
              <p className="text-sm sm:text-base text-gray-500 mt-2">En los últimos 30 días</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300 p-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm sm:text-base lg:text-lg font-medium text-gray-600">
                Monto Promedio
              </CardTitle>
              <div className="text-2xl sm:text-3xl lg:text-4xl">💰</div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-nuam-600">
                {formatCurrency(stats.averageAmount)}
              </div>
              <p className="text-sm sm:text-base text-gray-500 mt-2">Por calificación</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Qualifications */}
        <Card className="overflow-hidden">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl sm:text-2xl lg:text-3xl flex items-center gap-3">
              <span className="text-2xl sm:text-3xl">📋</span>
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
                    <th className="px-4 sm:px-6 lg:px-8 py-4 text-left text-sm sm:text-base font-semibold text-gray-700 uppercase tracking-wider">
                      Emisor
                    </th>
                    <th className="px-4 sm:px-6 lg:px-8 py-4 text-left text-sm sm:text-base font-semibold text-gray-700 uppercase tracking-wider">
                      País
                    </th>
                    <th className="hidden md:table-cell px-4 sm:px-6 lg:px-8 py-4 text-left text-sm sm:text-base font-semibold text-gray-700 uppercase tracking-wider">
                      Período
                    </th>
                    <th className="px-4 sm:px-6 lg:px-8 py-4 text-left text-sm sm:text-base font-semibold text-gray-700 uppercase tracking-wider">
                      Monto
                    </th>
                    <th className="px-4 sm:px-6 lg:px-8 py-4 text-left text-sm sm:text-base font-semibold text-gray-700 uppercase tracking-wider">
                      Estado
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {qualifications.slice(0, 5).map((qualification: any) => (
                    <tr key={qualification.id} className="hover:bg-gray-50">
                      <td className="px-4 sm:px-6 lg:px-8 py-4 sm:py-5 text-sm sm:text-base text-gray-900">
                        <div className="truncate max-w-32 sm:max-w-none" title={qualification.emisorName}>
                          {qualification.emisorName}
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 lg:px-8 py-4 sm:py-5 text-sm sm:text-base text-gray-900">
                        <div className="flex items-center">
                          <span className="text-lg sm:text-xl lg:text-2xl">{getCountryFlag(qualification.country)}</span>
                          <span className="ml-2 sm:ml-3 hidden lg:inline">
                            {COUNTRIES[qualification.country as keyof typeof COUNTRIES].name}
                          </span>
                        </div>
                      </td>
                      <td className="hidden md:table-cell px-4 sm:px-6 lg:px-8 py-4 sm:py-5 text-sm sm:text-base text-gray-900">
                        {qualification.period}
                      </td>
                      <td className="px-4 sm:px-6 lg:px-8 py-4 sm:py-5 text-sm sm:text-base text-gray-900">
                        <div className="truncate font-semibold">
                          {formatCurrency(qualification.amount, qualification.country)}
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
                        <span className={`inline-flex px-3 py-2 text-sm font-semibold rounded-full ${getStatusColor(qualification.status)}`}>
                          <span className="sm:hidden text-base">
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
