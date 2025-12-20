'use client'

import { useState, useEffect } from 'react'
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

const STATUS_CONFIG = {
  DRAFT: { label: 'Borrador', color: 'bg-gray-100 text-gray-800', gradient: 'from-gray-400 to-gray-500', iconColor: 'text-gray-600' },
  PENDING: { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-800', gradient: 'from-yellow-400 to-amber-500', iconColor: 'text-yellow-600' },
  APPROVED: { label: 'Aprobada', color: 'bg-green-100 text-green-800', gradient: 'from-green-400 to-emerald-500', iconColor: 'text-green-600' },
  REJECTED: { label: 'Rechazada', color: 'bg-red-100 text-red-800', gradient: 'from-red-400 to-rose-500', iconColor: 'text-red-600' },
  EXPIRED: { label: 'Expirada', color: 'bg-orange-100 text-orange-800', gradient: 'from-orange-400 to-orange-500', iconColor: 'text-orange-600' }
}

// Animated Qualification Card
function QualificationCard({ 
  qualification, 
  index,
  onView, 
  onEdit, 
  onDelete,
  onApprove,
  onReject
}: { 
  qualification: Qualification
  index: number
  onView: (q: Qualification) => void
  onEdit: (q: Qualification) => void
  onDelete: (q: Qualification) => void
  onApprove: (q: Qualification) => void
  onReject: (q: Qualification) => void
}) {
  const [isVisible, setIsVisible] = useState(false)
  const country = COUNTRIES[qualification.country as keyof typeof COUNTRIES]
  const statusInfo = STATUS_CONFIG[qualification.status as keyof typeof STATUS_CONFIG]

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), index * 80)
    return () => clearTimeout(timer)
  }, [index])

  // Format large numbers
  const formatAmount = (amount: number): string => {
    if (amount >= 1000000) return `${(amount / 1000000).toFixed(1)}M`
    if (amount >= 1000) return `${(amount / 1000).toFixed(1)}K`
    return amount.toLocaleString()
  }

  return (
    <div 
      className={`relative overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
      }`}
    >
      {/* Decorative gradient based on status */}
      <div className={`absolute top-0 right-0 w-48 h-48 bg-gradient-to-br ${statusInfo?.gradient || 'from-gray-400 to-gray-500'} opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2`} />
      
      <div className="relative p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">{country?.flag}</span>
              <h3 className="text-lg font-bold text-gray-900 truncate">{qualification.emisorName}</h3>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
              <span className="font-medium">{qualification.period}</span>
              <span>•</span>
              <span>{qualification.taxId || 'Sin ID tributario'}</span>
            </div>
          </div>
          <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${statusInfo?.color} shrink-0`}>
            {statusInfo?.label}
          </span>
        </div>

        {/* Amount Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 p-4 border border-gray-100">
            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-gray-300/20 to-gray-400/20 rounded-full blur-xl -translate-y-1/2 translate-x-1/2" />
            <p className="text-xs font-medium text-gray-500 mb-1">Monto Original</p>
            <p className="text-xl font-bold text-gray-900">{formatAmount(qualification.amount)}</p>
            <p className="text-xs text-gray-500">{qualification.currency}</p>
          </div>
          {qualification.calculatedValue !== undefined && (
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 p-4 border border-blue-100">
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-blue-300/20 to-indigo-400/20 rounded-full blur-xl -translate-y-1/2 translate-x-1/2" />
              <p className="text-xs font-medium text-blue-600 mb-1">Valor Calculado</p>
              <p className="text-xl font-bold text-blue-900">{Number(qualification.calculatedValue).toFixed(4)}</p>
              <p className="text-xs text-blue-600">{country?.factor}</p>
            </div>
          )}
        </div>

        {/* Observations */}
        {qualification.observations && (
          <div className="mb-4 p-3 rounded-xl bg-amber-50 border border-amber-100">
            <p className="text-xs font-medium text-amber-700 mb-1">Observaciones</p>
            <p className="text-sm text-amber-800">{qualification.observations}</p>
          </div>
        )}

        {/* Rejection Reason */}
        {qualification.rejectionReason && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-100">
            <p className="text-xs font-medium text-red-700 mb-1">Motivo de Rechazo</p>
            <p className="text-sm text-red-800">{qualification.rejectionReason}</p>
          </div>
        )}

        {/* Footer Info */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-gray-400 mb-4 pb-4 border-b border-gray-100">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {new Date(qualification.createdAt).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })}
          {qualification.user && (
            <>
              <span>•</span>
              <span className="flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                {qualification.user.name}
              </span>
            </>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2">
          {qualification.status === 'PENDING' && (
            <>
              <button
                onClick={() => onApprove(qualification)}
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all shadow-sm hover:shadow-md"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Aprobar
              </button>
              <button
                onClick={() => onReject(qualification)}
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-red-500 to-rose-600 rounded-xl hover:from-red-600 hover:to-rose-700 transition-all shadow-sm hover:shadow-md"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Rechazar
              </button>
            </>
          )}
          
          <button
            onClick={() => onView(qualification)}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
          >
            Ver
          </button>
          
          {qualification.status === 'DRAFT' && (
            <button
              onClick={() => onEdit(qualification)}
              className="px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
            >
              Editar
            </button>
          )}
          
          <button
            onClick={() => onDelete(qualification)}
            className="px-4 py-2 text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 rounded-xl transition-colors"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  )
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
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const filteredQualifications = qualifications.filter(qualification => {
    const matchesSearch = 
      qualification.emisorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (qualification.taxId && qualification.taxId.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesCountry = !countryFilter || qualification.country === countryFilter
    const matchesStatus = !statusFilter || qualification.status === statusFilter
    const matchesPeriod = !periodFilter || qualification.period === periodFilter

    return matchesSearch && matchesCountry && matchesStatus && matchesPeriod
  })

  const uniquePeriods = Array.from(new Set(qualifications.map(q => q.period))).sort().reverse()

  // Calculate stats
  const stats = {
    total: qualifications.length,
    pending: qualifications.filter(q => q.status === 'PENDING').length,
    approved: qualifications.filter(q => q.status === 'APPROVED').length,
    rejected: qualifications.filter(q => q.status === 'REJECTED').length
  }

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
              <p className="text-gray-600 font-medium">Cargando calificaciones tributarias...</p>
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
            Calificaciones Tributarias
          </h1>
          <p className="text-gray-500 mt-1">
            {filteredQualifications.length} de {qualifications.length} calificaciones
          </p>
        </div>
        <button 
          onClick={onAddNew}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nueva Calificación
        </button>
      </div>

      {/* Stats Cards */}
      <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 transition-all duration-500 delay-100 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
        {[
          { label: 'Total', value: stats.total, gradient: 'from-blue-500 to-indigo-500', bg: 'from-blue-50 to-indigo-50' },
          { label: 'Pendientes', value: stats.pending, gradient: 'from-yellow-500 to-amber-500', bg: 'from-yellow-50 to-amber-50' },
          { label: 'Aprobadas', value: stats.approved, gradient: 'from-green-500 to-emerald-500', bg: 'from-green-50 to-emerald-50' },
          { label: 'Rechazadas', value: stats.rejected, gradient: 'from-red-500 to-rose-500', bg: 'from-red-50 to-rose-50' }
        ].map((stat, i) => (
          <div key={stat.label} className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${stat.bg} p-4 border border-gray-100`}>
            <div className={`absolute top-0 right-0 w-12 h-12 bg-gradient-to-br ${stat.gradient} opacity-20 rounded-full blur-xl -translate-y-1/2 translate-x-1/2`} />
            <p className="text-xs font-medium text-gray-600">{stat.label}</p>
            <p className={`text-2xl font-bold bg-gradient-to-br ${stat.gradient} bg-clip-text text-transparent`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className={`relative overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-lg transition-all duration-500 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
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
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">Buscar</label>
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Emisor o ID..."
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
                  <option value="">🌍 Todos</option>
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
                  <option value="">📋 Todos</option>
                  {Object.entries(STATUS_CONFIG).map(([value, { label }]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
                <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">Período</label>
              <div className="relative">
                <select
                  value={periodFilter}
                  onChange={(e) => setPeriodFilter(e.target.value)}
                  className="w-full appearance-none px-4 py-2.5 pr-10 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white"
                >
                  <option value="">📅 Todos</option>
                  {uniquePeriods.map(period => (
                    <option key={period} value={period}>{period}</option>
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

      {/* Empty State or List */}
      {filteredQualifications.length === 0 ? (
        <div className={`relative overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-lg p-12 text-center transition-all duration-500 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
          <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-full blur-3xl" />
          
          <div className="relative">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No hay calificaciones
            </h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              {searchTerm || countryFilter || statusFilter || periodFilter 
                ? 'No se encontraron calificaciones con los filtros seleccionados.' 
                : 'Comienza creando tu primera calificación tributaria.'}
            </p>
            <button 
              onClick={onAddNew}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Crear Primera Calificación
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredQualifications.map((qualification, index) => (
            <QualificationCard
              key={qualification.id}
              qualification={qualification}
              index={index}
              onView={onView}
              onEdit={onEdit}
              onDelete={onDelete}
              onApprove={onApprove}
              onReject={onReject}
            />
          ))}
        </div>
      )}
    </div>
  )
}