'use client'

import { useState } from 'react'
import { ArrowLeftIcon, CheckIcon, XMarkIcon, PencilIcon } from '@heroicons/react/24/outline'

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

interface QualificationDetailViewProps {
  qualification: Qualification
  onBack: () => void
  onApprove: () => void
  onReject: (reason: string) => void
  onEdit: () => void
  isProcessing?: boolean
}

const COUNTRIES: Record<string, { name: string; flag: string; unit: string }> = {
  CL: { name: 'Chile', flag: '🇨🇱', unit: 'UTM' },
  PE: { name: 'Perú', flag: '🇵🇪', unit: 'UIT' },
  CO: { name: 'Colombia', flag: '🇨🇴', unit: 'UVT' },
  MX: { name: 'México', flag: '🇲🇽', unit: 'UMA' },
  AR: { name: 'Argentina', flag: '🇦🇷', unit: 'UF' },
  BR: { name: 'Brasil', flag: '🇧🇷', unit: 'UFIR' },
  UY: { name: 'Uruguay', flag: '🇺🇾', unit: 'UI' },
  PY: { name: 'Paraguay', flag: '🇵🇾', unit: 'JSM' },
  BO: { name: 'Bolivia', flag: '🇧🇴', unit: 'UFV' },
  EC: { name: 'Ecuador', flag: '🇪🇨', unit: 'SBU' },
  VE: { name: 'Venezuela', flag: '🇻🇪', unit: 'PT' },
  PA: { name: 'Panamá', flag: '🇵🇦', unit: 'TB' },
  CR: { name: 'Costa Rica', flag: '🇨🇷', unit: 'SB' },
  GT: { name: 'Guatemala', flag: '🇬🇹', unit: 'SM' },
  US: { name: 'Estados Unidos', flag: '🇺🇸', unit: 'USD' },
}

const STATUS_CONFIG: Record<string, { label: string; gradient: string; bg: string; icon: string }> = {
  DRAFT: { label: 'Borrador', gradient: 'from-gray-400 to-gray-500', bg: 'bg-gray-100 text-gray-700', icon: '📝' },
  PENDING: { label: 'Pendiente', gradient: 'from-yellow-400 to-amber-500', bg: 'bg-yellow-100 text-yellow-700', icon: '⏳' },
  APPROVED: { label: 'Aprobado', gradient: 'from-green-400 to-emerald-500', bg: 'bg-green-100 text-green-700', icon: '✅' },
  REJECTED: { label: 'Rechazado', gradient: 'from-red-400 to-rose-500', bg: 'bg-red-100 text-red-700', icon: '❌' },
  EXPIRED: { label: 'Expirado', gradient: 'from-orange-400 to-amber-500', bg: 'bg-orange-100 text-orange-700', icon: '⚠️' },
}

export default function QualificationDetailView({
  qualification,
  onBack,
  onApprove,
  onReject,
  onEdit,
  isProcessing = false
}: QualificationDetailViewProps) {
  const [showRejectForm, setShowRejectForm] = useState(false)
  const [rejectReason, setRejectReason] = useState('')

  const country = COUNTRIES[qualification.country] || { name: qualification.country, flag: '🌍', unit: 'N/A' }
  const statusConfig = STATUS_CONFIG[qualification.status] || STATUS_CONFIG.DRAFT
  const canChangeStatus = qualification.status === 'DRAFT' || qualification.status === 'PENDING'

  const handleReject = () => {
    if (rejectReason.trim()) {
      onReject(rejectReason)
    }
  }

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
            Volver a Calificaciones
          </button>
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${statusConfig.gradient} flex items-center justify-center text-2xl shadow-lg`}>
                {statusConfig.icon}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{qualification.emisorName}</h1>
                <p className="text-gray-500">ID: {qualification.id.substring(0, 12)}...</p>
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
            {/* Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div className="p-5 rounded-xl bg-gray-50 border border-gray-100">
                <p className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wider">País</p>
                <p className="text-xl font-bold text-gray-900">{country.flag} {country.name}</p>
                <p className="text-sm text-gray-500 mt-1">Unidad Tributaria: {country.unit}</p>
              </div>
              
              <div className="p-5 rounded-xl bg-gray-50 border border-gray-100">
                <p className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wider">Período</p>
                <p className="text-xl font-bold text-gray-900">{qualification.period}</p>
                <p className="text-sm text-gray-500 mt-1">Formato: YYYY-MM</p>
              </div>

              <div className="p-5 rounded-xl bg-gray-50 border border-gray-100">
                <p className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wider">Moneda</p>
                <p className="text-xl font-bold text-gray-900">{qualification.currency}</p>
              </div>

              <div className="p-5 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100">
                <p className="text-xs font-medium text-blue-600 mb-2 uppercase tracking-wider">Monto Original</p>
                <p className="text-2xl font-bold text-blue-900">
                  {qualification.currency} {qualification.amount.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                </p>
              </div>

              <div className="p-5 rounded-xl bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-100">
                <p className="text-xs font-medium text-purple-600 mb-2 uppercase tracking-wider">Valor Calculado</p>
                <p className="text-2xl font-bold text-purple-900">
                  {qualification.calculatedValue != null
                    ? `${Number(qualification.calculatedValue).toFixed(4)} ${country.unit}`
                    : 'N/A'
                  }
                </p>
              </div>

              {qualification.taxId && (
                <div className="p-5 rounded-xl bg-gray-50 border border-gray-100">
                  <p className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wider">RUT/RUC/RFC</p>
                  <p className="text-xl font-bold text-gray-900">{qualification.taxId}</p>
                </div>
              )}
            </div>

            {/* Observations */}
            {qualification.observations && (
              <div className="p-5 rounded-xl bg-blue-50 border border-blue-100 mb-6">
                <p className="text-xs font-medium text-blue-600 mb-2 uppercase tracking-wider">📝 Observaciones</p>
                <p className="text-gray-800">{qualification.observations}</p>
              </div>
            )}

            {/* Rejection Reason */}
            {qualification.status === 'REJECTED' && qualification.rejectionReason && (
              <div className="p-5 rounded-xl bg-red-50 border border-red-100 mb-6">
                <p className="text-xs font-medium text-red-600 mb-2 uppercase tracking-wider">❌ Motivo de Rechazo</p>
                <p className="text-red-800">{qualification.rejectionReason}</p>
              </div>
            )}

            {/* Approval Info */}
            {qualification.status === 'APPROVED' && qualification.approvalDate && (
              <div className="p-5 rounded-xl bg-green-50 border border-green-100 mb-6">
                <p className="text-xs font-medium text-green-600 mb-2 uppercase tracking-wider">✅ Información de Aprobación</p>
                <p className="text-green-800">
                  Aprobado el {new Date(qualification.approvalDate).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            )}

            {/* Document URL */}
            {qualification.documentUrl && (
              <div className="p-5 rounded-xl bg-gray-50 border border-gray-100 mb-6">
                <p className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wider">📎 Documento Adjunto</p>
                <a 
                  href={qualification.documentUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  Ver documento
                </a>
              </div>
            )}

            {/* Metadata */}
            <div className="pt-6 border-t border-gray-100">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Creado por</p>
                  <p className="font-medium text-gray-900">{qualification.user?.name || 'N/A'}</p>
                  <p className="text-gray-500">{qualification.user?.email || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-gray-500">Fecha de creación</p>
                  <p className="font-medium text-gray-900">
                    {new Date(qualification.createdAt).toLocaleDateString('es-ES', {
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

        {/* Reject Form */}
        {showRejectForm && (
          <div className="relative overflow-hidden rounded-2xl border border-red-200 bg-white shadow-lg mb-8">
            <div className="bg-gradient-to-r from-red-500 to-rose-600 px-6 py-4">
              <h3 className="text-lg font-bold text-white">Rechazar Calificación</h3>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-600 mb-4">
                Por favor, ingresa el motivo del rechazo. Esta información será visible para el usuario.
              </p>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Ingresa el motivo del rechazo..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 resize-none mb-4"
                rows={4}
                disabled={isProcessing}
              />
              <div className="flex gap-3">
                <button
                  onClick={handleReject}
                  disabled={!rejectReason.trim() || isProcessing}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-rose-600 text-white font-medium rounded-xl hover:from-red-600 hover:to-rose-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
                >
                  <XMarkIcon className="w-5 h-5" />
                  Confirmar Rechazo
                </button>
                <button
                  onClick={() => setShowRejectForm(false)}
                  disabled={isProcessing}
                  className="px-6 py-3 text-gray-700 font-medium bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4">
          {canChangeStatus && !showRejectForm && (
            <>
              <button
                onClick={onApprove}
                disabled={isProcessing}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium rounded-xl hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
              >
                <CheckIcon className="w-5 h-5" />
                Aprobar Calificación
              </button>
              <button
                onClick={() => setShowRejectForm(true)}
                disabled={isProcessing}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-red-500 to-rose-600 text-white font-medium rounded-xl hover:from-red-600 hover:to-rose-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
              >
                <XMarkIcon className="w-5 h-5" />
                Rechazar
              </button>
            </>
          )}
          <button
            onClick={onEdit}
            disabled={isProcessing}
            className="flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-xl hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
          >
            <PencilIcon className="w-5 h-5" />
            Editar
          </button>
        </div>
      </div>
    </div>
  )
}
