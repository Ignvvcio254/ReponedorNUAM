'use client'

import { useState, useEffect } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'

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

interface QualificationDetailModalProps {
  qualification: Qualification | null
  isOpen: boolean
  onClose: () => void
  onApprove: (qualification: Qualification) => void
  onReject: (qualification: Qualification, reason: string) => void
  onEdit: (qualification: Qualification) => void
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

const STATUS_CONFIG: Record<string, { label: string; color: string; gradient: string; icon: string }> = {
  DRAFT: { 
    label: 'Borrador', 
    color: 'text-gray-700 bg-gray-100', 
    gradient: 'from-gray-400 to-gray-500',
    icon: '📝'
  },
  PENDING: { 
    label: 'Pendiente', 
    color: 'text-yellow-700 bg-yellow-100', 
    gradient: 'from-yellow-400 to-amber-500',
    icon: '⏳'
  },
  APPROVED: { 
    label: 'Aprobado', 
    color: 'text-green-700 bg-green-100', 
    gradient: 'from-green-400 to-emerald-500',
    icon: '✅'
  },
  REJECTED: { 
    label: 'Rechazado', 
    color: 'text-red-700 bg-red-100', 
    gradient: 'from-red-400 to-rose-500',
    icon: '❌'
  },
  EXPIRED: { 
    label: 'Expirado', 
    color: 'text-orange-700 bg-orange-100', 
    gradient: 'from-orange-400 to-amber-500',
    icon: '⚠️'
  },
}

export default function QualificationDetailModal({
  qualification,
  isOpen,
  onClose,
  onApprove,
  onReject,
  onEdit,
  isProcessing = false
}: QualificationDetailModalProps) {
  const [showRejectForm, setShowRejectForm] = useState(false)
  const [rejectReason, setRejectReason] = useState('')
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true)
      setShowRejectForm(false)
      setRejectReason('')
    } else {
      setIsVisible(false)
    }
  }, [isOpen])

  if (!isOpen || !qualification) return null

  const country = COUNTRIES[qualification.country] || { name: qualification.country, flag: '🌍', unit: 'N/A' }
  const statusConfig = STATUS_CONFIG[qualification.status] || STATUS_CONFIG.DRAFT

  const handleApprove = () => {
    onApprove(qualification)
  }

  const handleReject = () => {
    if (rejectReason.trim()) {
      onReject(qualification, rejectReason)
      setShowRejectForm(false)
      setRejectReason('')
    }
  }

  const canChangeStatus = qualification.status === 'DRAFT' || qualification.status === 'PENDING'

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div 
          className={`relative w-full max-w-2xl transform rounded-2xl bg-white shadow-2xl transition-all duration-300 ${
            isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
          }`}
        >
          {/* Decorative gradient */}
          <div className={`absolute top-0 left-0 right-0 h-32 bg-gradient-to-br ${statusConfig.gradient} opacity-10 rounded-t-2xl`} />
          
          {/* Header */}
          <div className="relative px-6 pt-6 pb-4 border-b border-gray-100">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${statusConfig.gradient} flex items-center justify-center text-xl shadow-lg`}>
                  {statusConfig.icon}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{qualification.emisorName}</h2>
                  <p className="text-sm text-gray-500">ID: {qualification.id.substring(0, 12)}...</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <XMarkIcon className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="relative px-6 py-6 space-y-6">
            {/* Status Badge */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">Estado actual</span>
              <span className={`px-4 py-2 rounded-xl text-sm font-semibold ${statusConfig.color}`}>
                {statusConfig.icon} {statusConfig.label}
              </span>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-gray-50">
                <p className="text-xs font-medium text-gray-500 mb-1">País</p>
                <p className="text-lg font-semibold text-gray-900">{country.flag} {country.name}</p>
                <p className="text-xs text-gray-400">Unidad: {country.unit}</p>
              </div>
              
              <div className="p-4 rounded-xl bg-gray-50">
                <p className="text-xs font-medium text-gray-500 mb-1">Período</p>
                <p className="text-lg font-semibold text-gray-900">{qualification.period}</p>
              </div>

              <div className="p-4 rounded-xl bg-gray-50">
                <p className="text-xs font-medium text-gray-500 mb-1">Monto</p>
                <p className="text-lg font-semibold text-gray-900">
                  {qualification.currency} {qualification.amount.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-gray-50">
                <p className="text-xs font-medium text-gray-500 mb-1">Valor Calculado</p>
                <p className="text-lg font-semibold text-gray-900">
                  {qualification.calculatedValue 
                    ? `${qualification.calculatedValue.toFixed(4)} ${country.unit}`
                    : 'N/A'
                  }
                </p>
              </div>

              {qualification.taxId && (
                <div className="p-4 rounded-xl bg-gray-50 col-span-2">
                  <p className="text-xs font-medium text-gray-500 mb-1">RUT/RUC/RFC</p>
                  <p className="text-lg font-semibold text-gray-900">{qualification.taxId}</p>
                </div>
              )}
            </div>

            {/* Observations */}
            {qualification.observations && (
              <div className="p-4 rounded-xl bg-blue-50 border border-blue-100">
                <p className="text-xs font-medium text-blue-600 mb-1">📝 Observaciones</p>
                <p className="text-sm text-blue-900">{qualification.observations}</p>
              </div>
            )}

            {/* Rejection Reason */}
            {qualification.status === 'REJECTED' && qualification.rejectionReason && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-100">
                <p className="text-xs font-medium text-red-600 mb-1">❌ Motivo de Rechazo</p>
                <p className="text-sm text-red-900">{qualification.rejectionReason}</p>
              </div>
            )}

            {/* Approval Date */}
            {qualification.status === 'APPROVED' && qualification.approvalDate && (
              <div className="p-4 rounded-xl bg-green-50 border border-green-100">
                <p className="text-xs font-medium text-green-600 mb-1">✅ Fecha de Aprobación</p>
                <p className="text-sm text-green-900">
                  {new Date(qualification.approvalDate).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            )}

            {/* Metadata */}
            <div className="pt-4 border-t border-gray-100 text-xs text-gray-400 space-y-1">
              <div className="flex justify-between">
                <span>Creado por:</span>
                <span className="text-gray-600">{qualification.user?.name || 'N/A'} ({qualification.user?.email || 'N/A'})</span>
              </div>
              <div className="flex justify-between">
                <span>Fecha de creación:</span>
                <span className="text-gray-600">
                  {new Date(qualification.createdAt).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            </div>

            {/* Reject Form */}
            {showRejectForm && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 space-y-3">
                <p className="text-sm font-medium text-red-800">Motivo del rechazo</p>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Ingresa el motivo del rechazo..."
                  className="w-full px-4 py-3 rounded-xl border border-red-200 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 resize-none"
                  rows={3}
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleReject}
                    disabled={!rejectReason.trim() || isProcessing}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                  >
                    Confirmar Rechazo
                  </button>
                  <button
                    onClick={() => setShowRejectForm(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="relative px-6 py-4 bg-gray-50 rounded-b-2xl border-t border-gray-100">
            <div className="flex flex-wrap gap-3">
              {/* Approve/Reject buttons only for DRAFT or PENDING */}
              {canChangeStatus && !showRejectForm && (
                <>
                  <button
                    onClick={handleApprove}
                    disabled={isProcessing}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium rounded-xl hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Aprobar Calificación
                  </button>
                  <button
                    onClick={() => setShowRejectForm(true)}
                    disabled={isProcessing}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-rose-600 text-white font-medium rounded-xl hover:from-red-600 hover:to-rose-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Rechazar
                  </button>
                </>
              )}

              {/* Edit button */}
              <button
                onClick={() => onEdit(qualification)}
                disabled={isProcessing}
                className={`${canChangeStatus && !showRejectForm ? '' : 'flex-1'} flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-xl hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Editar
              </button>

              {/* Close button */}
              <button
                onClick={onClose}
                className="px-6 py-3 bg-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-300 transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
