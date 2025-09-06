'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { COUNTRIES } from '@/lib/constants'

interface TaxEntity {
  id: string
  businessName: string
  tradeName?: string
  taxId: string
  entityType: string
  country: string
  state?: string
  city?: string
  address?: string
  postalCode?: string
  taxRegime: string
  economicActivity?: string
  naicsCode?: string
  status: string
  registrationDate?: string
  createdAt: string
  updatedAt: string
  _count?: {
    taxReturns: number
    taxPayments: number
    taxCertificates: number
    auditProcesses: number
  }
}

interface TaxEntityListProps {
  entities: TaxEntity[]
  onAddNew: () => void
  onView: (entity: TaxEntity) => void
  onEdit: (entity: TaxEntity) => void
  onDelete: (entity: TaxEntity) => void
  isLoading?: boolean
}

const ENTITY_TYPE_LABELS = {
  CORPORATION: 'Corporación',
  LLC: 'SRL',
  PARTNERSHIP: 'Sociedad',
  SOLE_PROPRIETOR: 'Persona Natural',
  NGO: 'ONG',
  GOVERNMENT: 'Gubernamental',
  FOREIGN: 'Extranjera'
}

const STATUS_LABELS = {
  ACTIVE: { label: 'Activa', color: 'bg-green-100 text-green-800' },
  INACTIVE: { label: 'Inactiva', color: 'bg-gray-100 text-gray-800' },
  SUSPENDED: { label: 'Suspendida', color: 'bg-yellow-100 text-yellow-800' },
  DISSOLVED: { label: 'Disuelta', color: 'bg-red-100 text-red-800' },
  UNDER_AUDIT: { label: 'En Auditoría', color: 'bg-orange-100 text-orange-800' }
}

export default function TaxEntityList({ 
  entities, 
  onAddNew, 
  onView, 
  onEdit, 
  onDelete, 
  isLoading = false 
}: TaxEntityListProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [countryFilter, setCountryFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const filteredEntities = entities.filter(entity => {
    const matchesSearch = 
      entity.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entity.taxId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (entity.tradeName && entity.tradeName.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesCountry = !countryFilter || entity.country === countryFilter
    const matchesStatus = !statusFilter || entity.status === statusFilter

    return matchesSearch && matchesCountry && matchesStatus
  })

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-2">Cargando entidades tributarias...</p>
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
          <h1 className="text-2xl font-bold text-gray-900">Entidades Tributarias</h1>
          <p className="text-gray-600 mt-1">
            {filteredEntities.length} entidades encontradas
          </p>
        </div>
        <Button onClick={onAddNew}>
          + Nueva Entidad
        </Button>
      </div>

      {/* Filtros */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Buscar
            </label>
            <Input
              type="text"
              placeholder="Buscar por nombre o ID tributario..."
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
        </div>
      </Card>

      {/* Lista de entidades */}
      {filteredEntities.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No hay entidades tributarias registradas
          </h3>
          <p className="text-gray-600 mb-4">
            Comienza agregando tu primera entidad tributaria al contenedor.
          </p>
          <Button onClick={onAddNew}>
            + Crear Primera Entidad
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredEntities.map((entity) => {
            const country = COUNTRIES[entity.country as keyof typeof COUNTRIES]
            const statusInfo = STATUS_LABELS[entity.status as keyof typeof STATUS_LABELS]
            
            return (
              <Card key={entity.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {entity.businessName}
                    </h3>
                    {entity.tradeName && (
                      <p className="text-sm text-gray-600 mb-2">
                        DBA: {entity.tradeName}
                      </p>
                    )}
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span className="flex items-center">
                        {country?.flag} {country?.name}
                      </span>
                      <span>{entity.taxId}</span>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo?.color}`}>
                    {statusInfo?.label}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                  <div>
                    <span className="font-medium">Tipo:</span>
                    <p>{ENTITY_TYPE_LABELS[entity.entityType as keyof typeof ENTITY_TYPE_LABELS]}</p>
                  </div>
                  <div>
                    <span className="font-medium">Régimen:</span>
                    <p>{entity.taxRegime}</p>
                  </div>
                  {entity.city && (
                    <div>
                      <span className="font-medium">Ubicación:</span>
                      <p>{entity.city}{entity.state && `, ${entity.state}`}</p>
                    </div>
                  )}
                  {entity.economicActivity && (
                    <div>
                      <span className="font-medium">Actividad:</span>
                      <p>{entity.economicActivity}</p>
                    </div>
                  )}
                </div>

                {/* Estadísticas rápidas */}
                {entity._count && (
                  <div className="grid grid-cols-4 gap-2 mb-4 text-xs text-gray-500">
                    <div className="text-center p-2 bg-gray-50 rounded">
                      <div className="font-semibold text-gray-900">{entity._count.taxReturns}</div>
                      <div>Declaraciones</div>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded">
                      <div className="font-semibold text-gray-900">{entity._count.taxPayments}</div>
                      <div>Pagos</div>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded">
                      <div className="font-semibold text-gray-900">{entity._count.taxCertificates}</div>
                      <div>Certificados</div>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded">
                      <div className="font-semibold text-gray-900">{entity._count.auditProcesses}</div>
                      <div>Auditorías</div>
                    </div>
                  </div>
                )}

                {/* Acciones */}
                <div className="flex justify-end space-x-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => onView(entity)}
                  >
                    Ver
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => onEdit(entity)}
                  >
                    Editar
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => onDelete(entity)}
                  >
                    Eliminar
                  </Button>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}