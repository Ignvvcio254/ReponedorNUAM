'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { COUNTRIES } from '@/lib/constants'

interface Qualification {
  id: string
  emisorName: string
  taxId?: string
  country: string
  period: string
  amount: number
  currency: string
  calculatedValue?: number
  status: string
  processingDate?: string
  approvalDate?: string
  rejectionReason?: string
  observations?: string
  documentUrl?: string
  createdAt: string
  updatedAt: string
  user?: {
    id: string
    name: string
    email: string
  }
}

interface QualificationsListProps {
  qualifications: Qualification[]
  onAddNew: () => void
  onView: (qualification: Qualification) => void
  onEdit: (qualification: Qualification) => void
  onDelete: (qualification: Qualification) => void
  onApprove: (qualification: Qualification) => void
  onReject: (qualification: Qualification) => void
  isLoading?: boolean
}

const STATUS_LABELS = {
  DRAFT: { label: 'Borrador', color: 'bg-gray-100 text-gray-800' },
  PENDING: { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-800' },
  APPROVED: { label: 'Aprobada', color: 'bg-green-100 text-green-800' },
  REJECTED: { label: 'Rechazada', color: 'bg-red-100 text-red-800' },
  EXPIRED: { label: 'Expirada', color: 'bg-orange-100 text-orange-800' }
}

export default function QualificationsList({ 
  qualifications, 
  onAddNew, 
  onView, 
  onEdit, 
  onDelete, 
  onApprove,
  onReject,
  isLoading = false 
}: QualificationsListProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [countryFilter, setCountryFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [periodFilter, setPeriodFilter] = useState('')

  const filteredQualifications = qualifications.filter(qualification => {
    const matchesSearch = 
      qualification.emisorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (qualification.taxId && qualification.taxId.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesCountry = !countryFilter || qualification.country === countryFilter
    const matchesStatus = !statusFilter || qualification.status === statusFilter
    const matchesPeriod = !periodFilter || qualification.period === periodFilter

    return matchesSearch && matchesCountry && matchesStatus && matchesPeriod
  })

  // Obtener períodos únicos para el filtro
  const uniquePeriods = Array.from(new Set(qualifications.map(q => q.period))).sort().reverse()

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-2">Cargando calificaciones tributarias...</p>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header y controles */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Calificaciones Tributarias</h1>
          <p className="text-gray-600 mt-1">
            {filteredQualifications.length} calificaciones encontradas
          </p>
        </div>
        <Button onClick={onAddNew}>
          + Nueva Calificación
        </Button>
      </div>

      {/* Filtros */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Buscar
            </label>
            <Input
              type="text"
              placeholder="Buscar por emisor o ID tributario..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              País
            </label>
            <select
              value={countryFilter}
              onChange={(e) => setCountryFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos los países</option>
              {Object.values(COUNTRIES).map(country => (
                <option key={country.code} value={country.code}>
                  {country.flag} {country.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estado
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos los estados</option>
              {Object.entries(STATUS_LABELS).map(([value, { label }]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Período
            </label>
            <select
              value={periodFilter}
              onChange={(e) => setPeriodFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos los períodos</option>
              {uniquePeriods.map(period => (
                <option key={period} value={period}>{period}</option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Lista de calificaciones */}
      {filteredQualifications.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No hay calificaciones tributarias registradas
          </h3>
          <p className="text-gray-600 mb-4">
            Comienza creando tu primera calificación tributaria.
          </p>
          <Button onClick={onAddNew}>
            + Crear Primera Calificación
          </Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredQualifications.map((qualification) => {
            const country = COUNTRIES[qualification.country as keyof typeof COUNTRIES]
            const statusInfo = STATUS_LABELS[qualification.status as keyof typeof STATUS_LABELS]
            
            return (
              <Card key={qualification.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {qualification.emisorName}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusInfo?.color}`}>
                        {statusInfo?.label}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-4">
                      <div>
                        <span className="font-medium">País:</span>
                        <div className="flex items-center mt-1">
                          {country?.flag} <span className="ml-1">{country?.name}</span>
                        </div>
                      </div>
                      <div>
                        <span className="font-medium">Período:</span>
                        <p className="mt-1">{qualification.period}</p>
                      </div>
                      <div>
                        <span className="font-medium">ID Tributario:</span>
                        <p className="mt-1">{qualification.taxId || 'No especificado'}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-4">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <span className="font-medium text-gray-700">Monto Original:</span>
                        <div className="text-lg font-bold text-gray-900 mt-1">
                          {qualification.amount.toLocaleString()} {qualification.currency}
                        </div>
                      </div>
                      {qualification.calculatedValue && (
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <span className="font-medium text-blue-700">Valor Calculado:</span>
                          <div className="text-lg font-bold text-blue-900 mt-1">
                            {Number(qualification.calculatedValue).toFixed(6)} {country?.factor}
                          </div>
                        </div>
                      )}
                    </div>

                    {qualification.observations && (
                      <div className="mb-4">
                        <span className="font-medium text-gray-700 text-sm">Observaciones:</span>
                        <p className="text-gray-600 text-sm mt-1">{qualification.observations}</p>
                      </div>
                    )}

                    {qualification.rejectionReason && (
                      <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <span className="font-medium text-red-700 text-sm">Motivo de Rechazo:</span>
                        <p className="text-red-600 text-sm mt-1">{qualification.rejectionReason}</p>
                      </div>
                    )}

                    <div className="text-xs text-gray-500 mb-4">
                      Creado: {new Date(qualification.createdAt).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                      {qualification.user && (
                        <span className="ml-2">por {qualification.user.name}</span>
                      )}
                    </div>
                  </div>

                  {/* Acciones */}
                  <div className="flex flex-col lg:flex-row gap-2 lg:ml-6">
                    {qualification.status === 'PENDING' && (
                      <>
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={() => onApprove(qualification)}
                        >
                          Aprobar
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => onReject(qualification)}
                        >
                          Rechazar
                        </Button>
                      </>
                    )}
                    
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => onView(qualification)}
                    >
                      Ver
                    </Button>
                    
                    {qualification.status === 'DRAFT' && (
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => onEdit(qualification)}
                      >
                        Editar
                      </Button>
                    )}
                    
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => onDelete(qualification)}
                    >
                      Eliminar
                    </Button>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}