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
      {/* Header */}
      <header className="nuam-gradient shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-white">Dashboard NUAM</h1>
            </div>
            <nav className="flex space-x-4">
              <Button variant="secondary" size="sm">
                Nueva Calificación
              </Button>
              <Button variant="secondary" size="sm">
                Carga Masiva
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Calificaciones
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {stats.totalQualifications}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Pendientes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {stats.pendingApprovals}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Aprobadas este mes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {stats.approvedThisMonth}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Monto Promedio
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-nuam-600">
                {formatCurrency(stats.averageAmount)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Qualifications */}
        <Card>
          <CardHeader>
            <CardTitle>Calificaciones Recientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Emisor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      País
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Período
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Monto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {qualifications.slice(0, 5).map((qualification: any) => (
                    <tr key={qualification.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {qualification.emisorName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span className="flex items-center">
                          {getCountryFlag(qualification.country)}
                          <span className="ml-2">{COUNTRIES[qualification.country as keyof typeof COUNTRIES].name}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {qualification.period}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(qualification.amount, qualification.country)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={inline-flex px-2 py-1 text-xs font-semibold rounded-full }>
                          {qualification.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
