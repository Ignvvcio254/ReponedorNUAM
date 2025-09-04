'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { QualificationForm } from '@/components/forms/QualificationForm'
import { api } from '@/lib/api'
import { formatCurrency, getCountryFlag, getStatusColor } from '@/lib/utils'
import { COUNTRIES } from '@/lib/constants'

export default function QualificationsPage() {
  const [qualifications, setQualifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [filter, setFilter] = useState({ country: '', status: '' })

  const fetchQualifications = async () => {
    try {
      setLoading(true)
      const response = await api.qualifications.getAll(filter)
      setQualifications(response.data || [])
    } catch (error) {
      console.error('Error fetching qualifications:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchQualifications()
  }, [filter])

  const handleFormSuccess = () => {
    setShowForm(false)
    fetchQualifications()
  }

  if (showForm) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Button 
            variant="secondary" 
            onClick={() => setShowForm(false)}
            size="sm"
          >
            ← Volver a lista
          </Button>
        </div>
        <QualificationForm onSuccess={handleFormSuccess} />
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
                Calificaciones Tributarias
              </h1>
              <p className="mt-1 sm:mt-2 text-sm sm:text-base text-gray-600">
                Gestiona y administra las calificaciones tributarias del sistema
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
              <Button 
                variant="secondary" 
                size="sm"
                onClick={() => setShowForm(true)}
                className="w-full sm:w-auto text-xs sm:text-sm"
              >
                <span className="sm:hidden">➕</span>
                <span className="hidden sm:inline">Nueva Calificación</span>
              </Button>
              <Button 
                size="sm"
                onClick={() => window.location.href = '/import'}
                className="w-full sm:w-auto text-xs sm:text-sm"
              >
                <span className="sm:hidden">📤</span>
                <span className="hidden sm:inline">Importación Masiva</span>
              </Button>
            </div>
          </div>
        </div>

      {/* Main Content */}
        {/* Filtros */}
        <Card className="mb-4 sm:mb-6">
          <CardContent className="p-3 sm:p-4">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <div className="flex-1">
                <label className="block text-xs font-medium text-gray-700 mb-1 sm:hidden">
                  País
                </label>
                <select
                  value={filter.country}
                  onChange={(e) => setFilter(prev => ({ ...prev, country: e.target.value }))}
                  className="nuam-input w-full sm:w-48 text-sm"
                >
                  <option value="">Todos los países</option>
                  {Object.entries(COUNTRIES).map(([code, country]) => (
                    <option key={code} value={code}>
                      {country.flag} {country.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex-1">
                <label className="block text-xs font-medium text-gray-700 mb-1 sm:hidden">
                  Estado
                </label>
                <select
                  value={filter.status}
                  onChange={(e) => setFilter(prev => ({ ...prev, status: e.target.value }))}
                  className="nuam-input w-full sm:w-48 text-sm"
                >
                  <option value="">Todos los estados</option>
                  <option value="DRAFT">📝 Borrador</option>
                  <option value="PENDING">⏳ Pendiente</option>
                  <option value="APPROVED">✅ Aprobado</option>
                  <option value="REJECTED">❌ Rechazado</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabla de Calificaciones */}
        <Card className="overflow-hidden">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
              <span>📋</span>
              Lista de Calificaciones
              {qualifications.length > 0 && (
                <span className="text-sm font-normal text-gray-500 ml-2">
                  ({qualifications.length} total)
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-nuam-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Cargando calificaciones...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 p-3 text-left">Emisor</th>
                    <th className="border border-gray-300 p-3 text-left">País</th>
                    <th className="border border-gray-300 p-3 text-left">Período</th>
                    <th className="border border-gray-300 p-3 text-left">Monto</th>
                    <th className="border border-gray-300 p-3 text-left">Valor Calculado</th>
                    <th className="border border-gray-300 p-3 text-left">Estado</th>
                    <th className="border border-gray-300 p-3 text-left">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {qualifications.length > 0 ? (
                    qualifications.map((qualification: any) => (
                      <tr key={qualification.id} className="hover:bg-gray-50">
                        <td className="border border-gray-300 p-3">
                          <div>
                            <div className="font-medium">{qualification.emisorName}</div>
                            <div className="text-sm text-gray-500">{qualification.taxId || 'N/A'}</div>
                          </div>
                        </td>
                        <td className="border border-gray-300 p-3">
                          <div className="flex items-center">
                            <span className="mr-2">{getCountryFlag(qualification.country)}</span>
                            {COUNTRIES[qualification.country as keyof typeof COUNTRIES]?.name || qualification.country}
                          </div>
                        </td>
                        <td className="border border-gray-300 p-3">{qualification.period}</td>
                        <td className="border border-gray-300 p-3">
                          {formatCurrency(qualification.amount, qualification.country)}
                        </td>
                        <td className="border border-gray-300 p-3">
                          {qualification.calculatedValue?.toFixed(6)}
                        </td>
                        <td className="border border-gray-300 p-3">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(qualification.status)}`}>
                            {qualification.status}
                          </span>
                        </td>
                        <td className="border border-gray-300 p-3">
                          <Button size="sm" variant="secondary">
                            Editar
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="border border-gray-300 p-8 text-center text-gray-500">
                        No se encontraron calificaciones
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}