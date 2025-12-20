'use client'

import { ArrowLeftIcon, PencilIcon } from '@heroicons/react/24/outline'

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

interface TaxEntityDetailViewProps {
  entity: TaxEntity
  onBack: () => void
  onEdit: () => void
}

const COUNTRIES: Record<string, { name: string; flag: string }> = {
  CL: { name: 'Chile', flag: '🇨🇱' },
  PE: { name: 'Perú', flag: '🇵🇪' },
  CO: { name: 'Colombia', flag: '🇨🇴' },
  MX: { name: 'México', flag: '🇲🇽' },
  AR: { name: 'Argentina', flag: '🇦🇷' },
  BR: { name: 'Brasil', flag: '🇧🇷' },
  UY: { name: 'Uruguay', flag: '🇺🇾' },
  PY: { name: 'Paraguay', flag: '🇵🇾' },
  BO: { name: 'Bolivia', flag: '🇧🇴' },
  EC: { name: 'Ecuador', flag: '🇪🇨' },
  VE: { name: 'Venezuela', flag: '🇻🇪' },
  PA: { name: 'Panamá', flag: '🇵🇦' },
  CR: { name: 'Costa Rica', flag: '🇨🇷' },
  GT: { name: 'Guatemala', flag: '🇬🇹' },
  US: { name: 'Estados Unidos', flag: '🇺🇸' },
}

const ENTITY_TYPES: Record<string, { label: string; icon: string }> = {
  CORPORATION: { label: 'Corporación', icon: '🏢' },
  LLC: { label: 'Sociedad de Responsabilidad Limitada', icon: '🏛️' },
  PARTNERSHIP: { label: 'Sociedad', icon: '🤝' },
  SOLE_PROPRIETOR: { label: 'Persona Natural', icon: '👤' },
  NGO: { label: 'Organización sin fines de lucro', icon: '💚' },
  GOVERNMENT: { label: 'Entidad Gubernamental', icon: '🏛️' },
  FOREIGN: { label: 'Entidad Extranjera', icon: '🌍' },
}

const STATUS_CONFIG: Record<string, { label: string; gradient: string; bg: string; icon: string }> = {
  ACTIVE: { label: 'Activa', gradient: 'from-green-400 to-emerald-500', bg: 'bg-green-100 text-green-700', icon: '🟢' },
  INACTIVE: { label: 'Inactiva', gradient: 'from-gray-400 to-gray-500', bg: 'bg-gray-100 text-gray-700', icon: '⚪' },
  SUSPENDED: { label: 'Suspendida', gradient: 'from-yellow-400 to-amber-500', bg: 'bg-yellow-100 text-yellow-700', icon: '🟡' },
  DISSOLVED: { label: 'Disuelta', gradient: 'from-red-400 to-rose-500', bg: 'bg-red-100 text-red-700', icon: '🔴' },
  UNDER_AUDIT: { label: 'En Auditoría', gradient: 'from-purple-400 to-violet-500', bg: 'bg-purple-100 text-purple-700', icon: '🔍' },
}

export default function TaxEntityDetailView({
  entity,
  onBack,
  onEdit
}: TaxEntityDetailViewProps) {
  const country = COUNTRIES[entity.country] || { name: entity.country, flag: '🌍' }
  const entityType = ENTITY_TYPES[entity.entityType] || { label: entity.entityType, icon: '🏢' }
  const statusConfig = STATUS_CONFIG[entity.status] || STATUS_CONFIG.ACTIVE

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium mb-4 transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            Volver a Entidades
          </button>
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${statusConfig.gradient} flex items-center justify-center text-2xl shadow-lg`}>
                {entityType.icon}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{entity.businessName}</h1>
                {entity.tradeName && (
                  <p className="text-gray-500">También conocido como: {entity.tradeName}</p>
                )}
              </div>
            </div>
            <span className={`px-4 py-2 rounded-xl text-sm font-semibold ${statusConfig.bg}`}>
              {statusConfig.icon} {statusConfig.label}
            </span>
          </div>
        </div>

        {/* Main Content */}
        <div className="relative overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-lg mb-8">
          <div className={`absolute top-0 left-0 right-0 h-32 bg-gradient-to-br ${statusConfig.gradient} opacity-5`} />
          
          <div className="relative p-6 sm:p-8">
            {/* Tax ID Section */}
            <div className="p-5 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 mb-6">
              <p className="text-xs font-medium text-blue-600 mb-2 uppercase tracking-wider">Identificación Tributaria</p>
              <p className="text-3xl font-bold text-blue-900 font-mono">{entity.taxId}</p>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div className="p-5 rounded-xl bg-gray-50 border border-gray-100">
                <p className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wider">Tipo de Entidad</p>
                <p className="text-lg font-bold text-gray-900">{entityType.icon} {entityType.label}</p>
              </div>
              
              <div className="p-5 rounded-xl bg-gray-50 border border-gray-100">
                <p className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wider">País</p>
                <p className="text-lg font-bold text-gray-900">{country.flag} {country.name}</p>
              </div>

              <div className="p-5 rounded-xl bg-gray-50 border border-gray-100">
                <p className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wider">Régimen Tributario</p>
                <p className="text-lg font-bold text-gray-900">{entity.taxRegime}</p>
              </div>

              {entity.registrationDate && (
                <div className="p-5 rounded-xl bg-gray-50 border border-gray-100">
                  <p className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wider">Fecha de Registro</p>
                  <p className="text-lg font-bold text-gray-900">
                    {new Date(entity.registrationDate).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              )}

              {entity.economicActivity && (
                <div className="p-5 rounded-xl bg-gray-50 border border-gray-100 col-span-2">
                  <p className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wider">Actividad Económica</p>
                  <p className="text-lg font-bold text-gray-900">{entity.economicActivity}</p>
                  {entity.naicsCode && (
                    <p className="text-sm text-gray-500 mt-1">Código NAICS: {entity.naicsCode}</p>
                  )}
                </div>
              )}
            </div>

            {/* Location Section */}
            {(entity.address || entity.city || entity.state) && (
              <div className="p-5 rounded-xl bg-gradient-to-br from-gray-50 to-slate-50 border border-gray-100 mb-6">
                <p className="text-xs font-medium text-gray-500 mb-3 uppercase tracking-wider">📍 Ubicación</p>
                <div className="space-y-2">
                  {entity.address && <p className="text-gray-900">{entity.address}</p>}
                  <p className="text-gray-700">
                    {[entity.city, entity.state, entity.postalCode].filter(Boolean).join(', ')}
                  </p>
                  <p className="text-gray-600">{country.flag} {country.name}</p>
                </div>
              </div>
            )}

            {/* Related Records */}
            {entity._count && (
              <div className="p-5 rounded-xl bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-100 mb-6">
                <p className="text-xs font-medium text-purple-600 mb-4 uppercase tracking-wider">📊 Registros Relacionados</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-white/60 rounded-lg">
                    <p className="text-2xl font-bold text-purple-900">{entity._count.taxReturns || 0}</p>
                    <p className="text-xs text-purple-600">Declaraciones</p>
                  </div>
                  <div className="text-center p-3 bg-white/60 rounded-lg">
                    <p className="text-2xl font-bold text-purple-900">{entity._count.taxPayments || 0}</p>
                    <p className="text-xs text-purple-600">Pagos</p>
                  </div>
                  <div className="text-center p-3 bg-white/60 rounded-lg">
                    <p className="text-2xl font-bold text-purple-900">{entity._count.taxCertificates || 0}</p>
                    <p className="text-xs text-purple-600">Certificados</p>
                  </div>
                  <div className="text-center p-3 bg-white/60 rounded-lg">
                    <p className="text-2xl font-bold text-purple-900">{entity._count.auditProcesses || 0}</p>
                    <p className="text-xs text-purple-600">Auditorías</p>
                  </div>
                </div>
              </div>
            )}

            {/* Metadata */}
            <div className="pt-6 border-t border-gray-100">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">ID del registro</p>
                  <p className="font-medium text-gray-900 font-mono">{entity.id}</p>
                </div>
                <div>
                  <p className="text-gray-500">Fecha de creación</p>
                  <p className="font-medium text-gray-900">
                    {new Date(entity.createdAt).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex gap-4">
          <button
            onClick={onEdit}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl"
          >
            <PencilIcon className="w-5 h-5" />
            Editar Entidad
          </button>
        </div>
      </div>
    </div>
  )
}
