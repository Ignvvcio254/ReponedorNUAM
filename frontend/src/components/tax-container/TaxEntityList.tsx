'use client'

import { useState, useEffect } from 'react'
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

const STATUS_CONFIG = {
  ACTIVE: { label: 'Activa', color: 'bg-green-100 text-green-800', gradient: 'from-green-400 to-emerald-500' },
  INACTIVE: { label: 'Inactiva', color: 'bg-gray-100 text-gray-800', gradient: 'from-gray-400 to-gray-500' },
  SUSPENDED: { label: 'Suspendida', color: 'bg-yellow-100 text-yellow-800', gradient: 'from-yellow-400 to-amber-500' },
  DISSOLVED: { label: 'Disuelta', color: 'bg-red-100 text-red-800', gradient: 'from-red-400 to-rose-500' },
  UNDER_AUDIT: { label: 'En Auditoría', color: 'bg-orange-100 text-orange-800', gradient: 'from-orange-400 to-orange-500' }
}

// Animated Entity Card Component
function EntityCard({ 
  entity, 
  index,
  onView, 
  onEdit, 
  onDelete 
}: { 
  entity: TaxEntity
  index: number
  onView: (entity: TaxEntity) => void
  onEdit: (entity: TaxEntity) => void
  onDelete: (entity: TaxEntity) => void
}) {
  const [isVisible, setIsVisible] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  
  const country = COUNTRIES[entity.country as keyof typeof COUNTRIES]
  const statusInfo = STATUS_CONFIG[entity.status as keyof typeof STATUS_CONFIG]

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), index * 100)
    return () => clearTimeout(timer)
  }, [index])

  return (
    <div 
      className={`relative overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-lg hover:shadow-xl transition-all duration-500 transform ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
      } ${isHovered ? '-translate-y-1' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Decorative gradient */}
      <div className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-br ${statusInfo?.gradient || 'from-gray-400 to-gray-500'} opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 transition-transform duration-500 ${isHovered ? 'scale-125' : ''}`} />
      
      <div className="relative p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">{country?.flag}</span>
              <h3 className="text-lg font-bold text-gray-900 truncate">{entity.businessName}</h3>
            </div>
            {entity.tradeName && (
              <p className="text-sm text-gray-500 truncate ml-8">
                DBA: {entity.tradeName}
              </p>
            )}
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusInfo?.color} shrink-0`}>
            {statusInfo?.label}
          </span>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center gap-2 text-sm">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
              </svg>
            </div>
            <div>
              <p className="text-gray-500 text-xs">ID Tributario</p>
              <p className="font-medium text-gray-900">{entity.taxId}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
              <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <p className="text-gray-500 text-xs">Tipo</p>
              <p className="font-medium text-gray-900 truncate">{ENTITY_TYPE_LABELS[entity.entityType as keyof typeof ENTITY_TYPE_LABELS]}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-100 to-teal-100 flex items-center justify-center">
              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <p className="text-gray-500 text-xs">Régimen</p>
              <p className="font-medium text-gray-900 truncate">{entity.taxRegime}</p>
            </div>
          </div>
          {entity.city && (
            <div className="flex items-center gap-2 text-sm">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center">
                <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <p className="text-gray-500 text-xs">Ubicación</p>
                <p className="font-medium text-gray-900 truncate">{entity.city}{entity.state && `, ${entity.state}`}</p>
              </div>
            </div>
          )}
        </div>

        {/* Stats Row */}
        {entity._count && (
          <div className="grid grid-cols-4 gap-2 mb-4">
            {[
              { value: entity._count.taxReturns, label: 'Declaraciones', gradient: 'from-blue-50 to-indigo-50', textColor: 'text-blue-600' },
              { value: entity._count.taxPayments, label: 'Pagos', gradient: 'from-green-50 to-emerald-50', textColor: 'text-green-600' },
              { value: entity._count.taxCertificates, label: 'Certificados', gradient: 'from-purple-50 to-pink-50', textColor: 'text-purple-600' },
              { value: entity._count.auditProcesses, label: 'Auditorías', gradient: 'from-orange-50 to-amber-50', textColor: 'text-orange-600' }
            ].map((stat, i) => (
              <div key={i} className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${stat.gradient} p-2 text-center`}>
                <div className={`text-lg font-bold ${stat.textColor}`}>{stat.value}</div>
                <div className="text-xs text-gray-500 truncate">{stat.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
          <button
            onClick={() => onView(entity)}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
          >
            Ver
          </button>
          <button
            onClick={() => onEdit(entity)}
            className="px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
          >
            Editar
          </button>
          <button
            onClick={() => onDelete(entity)}
            className="px-4 py-2 text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 rounded-xl transition-colors"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  )
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
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

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
      <div className="space-y-6">
        <div className="relative overflow-hidden rounded-2xl bg-white border border-gray-100 p-8 shadow-lg">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <p className="text-gray-600 font-medium">Cargando entidades tributarias...</p>
              <p className="text-gray-400 text-sm mt-1">Por favor espera un momento</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all duration-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent">
            Entidades Tributarias
          </h1>
          <p className="text-gray-500 mt-1">
            {filteredEntities.length} de {entities.length} entidades
          </p>
        </div>
        <button 
          onClick={onAddNew}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nueva Entidad
        </button>
      </div>

      {/* Filters */}
      <div className={`relative overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-lg transition-all duration-500 delay-100 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        
        <div className="relative p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-800">Filtros</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">Buscar</label>
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Nombre o ID tributario..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">País</label>
              <div className="relative">
                <select
                  value={countryFilter}
                  onChange={(e) => setCountryFilter(e.target.value)}
                  className="w-full appearance-none px-4 py-2.5 pr-10 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white"
                >
                  <option value="">🌍 Todos los países</option>
                  {Object.values(COUNTRIES).map(country => (
                    <option key={country.code} value={country.code}>
                      {country.flag} {country.name}
                    </option>
                  ))}
                </select>
                <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">Estado</label>
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full appearance-none px-4 py-2.5 pr-10 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white"
                >
                  <option value="">📋 Todos los estados</option>
                  {Object.entries(STATUS_CONFIG).map(([value, { label }]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
                <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Entity List or Empty State */}
      {filteredEntities.length === 0 ? (
        <div className={`relative overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-lg p-12 text-center transition-all duration-500 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
          <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-full blur-3xl" />
          
          <div className="relative">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No hay entidades tributarias
            </h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              {searchTerm || countryFilter || statusFilter 
                ? 'No se encontraron entidades con los filtros seleccionados.' 
                : 'Comienza agregando tu primera entidad tributaria al contenedor.'}
            </p>
            <button 
              onClick={onAddNew}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Crear Primera Entidad
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredEntities.map((entity, index) => (
            <EntityCard
              key={entity.id}
              entity={entity}
              index={index}
              onView={onView}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  )
}