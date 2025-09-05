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
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-6 sm:py-8 lg:py-12">
        {/* Page Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div className="min-w-0 flex-1">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 truncate">
                Calificaciones Tributarias
              </h1>
              <p className="mt-2 sm:mt-3 text-base sm:text-lg lg:text-xl text-gray-600">
                Gestiona y administra las calificaciones tributarias del sistema
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
              <Button 
                variant="secondary" 
                size="lg"
                onClick={() => setShowForm(true)}
                className="w-full sm:w-auto text-sm sm:text-base lg:text-lg px-6 py-3"
              >
                <span className="mr-2">➕</span>
                Nueva Calificación
              </Button>
              <Button 
                size="lg"
                onClick={() => window.location.href = '/import'}
                className="w-full sm:w-auto text-sm sm:text-base lg:text-lg px-6 py-3"
              >
                <span className="mr-2">📤</span>
                Importación Masiva
              </Button>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <Card className="mb-6 sm:mb-8">
          <CardContent className="p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 lg:gap-8">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2 sm:hidden">
                  País
                </label>
                <select
                  value={filter.country}
                  onChange={(e) => setFilter(prev => ({ ...prev, country: e.target.value }))}
                  className="nuam-input w-full sm:w-64 lg:w-80 text-sm sm:text-base h-12"
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
                <label className="block text-sm font-medium text-gray-700 mb-2 sm:hidden">
                  Estado
                </label>
                <select
                  value={filter.status}
                  onChange={(e) => setFilter(prev => ({ ...prev, status: e.target.value }))}
                  className="nuam-input w-full sm:w-64 lg:w-80 text-sm sm:text-base h-12"
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
          <CardHeader className="pb-4 p-4 sm:p-6 lg:p-8">
            <CardTitle className="text-xl sm:text-2xl lg:text-3xl flex items-center gap-3">
              <span className="text-2xl sm:text-3xl">📋</span>
              Lista de Calificaciones
              {qualifications.length > 0 && (
                <span className="text-lg font-normal text-gray-500 ml-3">
                  ({qualifications.length} total)
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-nuam-500 mx-auto"></div>
              <p className="mt-6 text-lg text-gray-600">Cargando calificaciones...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 p-4 sm:p-5 lg:p-6 text-left text-sm sm:text-base lg:text-lg font-semibold text-gray-700">Emisor</th>
                    <th className="border border-gray-300 p-4 sm:p-5 lg:p-6 text-left text-sm sm:text-base lg:text-lg font-semibold text-gray-700">País</th>
                    <th className="border border-gray-300 p-4 sm:p-5 lg:p-6 text-left text-sm sm:text-base lg:text-lg font-semibold text-gray-700">Período</th>
                    <th className="border border-gray-300 p-4 sm:p-5 lg:p-6 text-left text-sm sm:text-base lg:text-lg font-semibold text-gray-700">Monto</th>
                    <th className="border border-gray-300 p-4 sm:p-5 lg:p-6 text-left text-sm sm:text-base lg:text-lg font-semibold text-gray-700">Valor Calculado</th>
                    <th className="border border-gray-300 p-4 sm:p-5 lg:p-6 text-left text-sm sm:text-base lg:text-lg font-semibold text-gray-700">Estado</th>
                    <th className="border border-gray-300 p-4 sm:p-5 lg:p-6 text-left text-sm sm:text-base lg:text-lg font-semibold text-gray-700">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {qualifications.length > 0 ? (
                    qualifications.map((qualification: any) => (
                      <tr key={qualification.id} className="hover:bg-gray-50">
                        <td className="border border-gray-300 p-4 sm:p-5 lg:p-6">
                          <div>
                            <div className="font-semibold text-sm sm:text-base lg:text-lg">{qualification.emisorName}</div>
                            <div className="text-sm sm:text-base text-gray-500">{qualification.taxId || 'N/A'}</div>
                          </div>
                        </td>
                        <td className="border border-gray-300 p-4 sm:p-5 lg:p-6">
                          <div className="flex items-center">
                            <span className="mr-2 text-lg sm:text-xl lg:text-2xl">{getCountryFlag(qualification.country)}</span>
                            <span className="text-sm sm:text-base lg:text-lg">{COUNTRIES[qualification.country as keyof typeof COUNTRIES]?.name || qualification.country}</span>
                          </div>
                        </td>
                        <td className="border border-gray-300 p-4 sm:p-5 lg:p-6 text-sm sm:text-base lg:text-lg">{qualification.period}</td>
                        <td className="border border-gray-300 p-4 sm:p-5 lg:p-6 text-sm sm:text-base lg:text-lg font-semibold">
                          {formatCurrency(qualification.amount, qualification.country)}
                        </td>
                        <td className="border border-gray-300 p-4 sm:p-5 lg:p-6 text-sm sm:text-base lg:text-lg">
                          {qualification.calculatedValue?.toFixed(6)}
                        </td>
                        <td className="border border-gray-300 p-4 sm:p-5 lg:p-6">
                          <span className={`inline-flex px-3 py-2 text-sm font-semibold rounded-full ${getStatusColor(qualification.status)}`}>
                            {qualification.status}
                          </span>
                        </td>
                        <td className="border border-gray-300 p-4 sm:p-5 lg:p-6">
                          <Button size="lg" variant="secondary" className="text-sm sm:text-base px-4 py-2">
                            Editar
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="border border-gray-300 p-12 text-center text-gray-500 text-lg">
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
    </div>
  )
}