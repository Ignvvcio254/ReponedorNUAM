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

  useEffect(() => {
    loadQualifications()
  }, [filter])

  const loadQualifications = async () => {
    try {
      setLoading(true)
      const response = await api.qualifications.getAll(filter)
      setQualifications(response.data)
    } catch (error) {
      console.error('Error loading qualifications:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFormSuccess = () => {
    setShowForm(false)
    loadQualifications()
  }

  if (showForm) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <Button 
              variant="secondary" 
              onClick={() => setShowForm(false)}
            >
              ← Volver a la lista
            </Button>
          </div>
          <QualificationForm onSuccess={handleFormSuccess} />
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
              <h1 className="text-2xl font-bold text-white">Calificaciones Tributarias</h1>
            </div>
            <div className="flex space-x-2">
              <Button 
                variant="secondary" 
                size="sm"
                onClick={() => setShowForm(true)}
              >
                Nueva Calificación
              </Button>
              <Button 
                variant="secondary" 
                size="sm"
                onClick={() => window.location.href = '/import'}
              >
                Importación Masiva
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filtros */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex gap-4">
              <select
                value={filter.country}
                onChange={(e) => setFilter(prev => ({ ...prev, country: e.target.value }))}
                className="nuam-input w-48"
              >
                <option value="">Todos los países</option>
                {Object.entries(COUNTRIES).map(([code, country]) => (
                  <option key={code} value={code}>
                    {country.flag} {country.name}
                  </option>
                ))}
              </select>

              <select
                value={filter.status}
                onChange={(e) => setFilter(prev => ({ ...prev, status: e.target.value }))}
                className="nuam-input w-48"
              >
                <option value="">Todos los estados</option>
                <option value="DRAFT">Borrador</option>
                <option value="PENDING">Pendiente</option>
                <option value="APPROVED">Aprobada</option>
                <option value="REJECTED">Rechazada</option>
              </select>

              <Button 
                variant="secondary"
                onClick={() => setFilter({ country: '', status: '' })}
              >
                Limpiar Filtros
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Calificaciones */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Calificaciones ({qualifications.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-nuam-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Cargando...</p>
              </div>
            ) : qualifications.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">No se encontraron calificaciones</p>
                <Button 
                  className="mt-4"
                  onClick={() => setShowForm(true)}
                >
                  Crear Primera Calificación
                </Button>
              </div>
            ) : (
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
                        Valor Calculado
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Estado
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {qualifications.map((qualification: any) => (
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
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {qualification.calculatedValue?.toFixed(6)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={inline-flex px-2 py-1 text-xs font-semibold rounded-full }>
                            {qualification.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => {
                              // TODO: Implementar edición
                              alert('Función de edición en desarrollo')
                            }}
                          >
                            Editar
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
