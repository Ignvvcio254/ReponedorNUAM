'use client'

import { useState, useEffect } from 'react'
import { XMarkIcon, ExclamationTriangleIcon, CheckCircleIcon, TrashIcon } from '@heroicons/react/24/outline'

type ConfirmationType = 'danger' | 'warning' | 'success' | 'info'

interface ConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  type?: ConfirmationType
  isLoading?: boolean
  requireExtraConfirmation?: boolean
  extraConfirmationText?: string
}

const TYPE_CONFIG: Record<ConfirmationType, { gradient: string; icon: typeof TrashIcon; iconBg: string }> = {
  danger: {
    gradient: 'from-red-500 to-rose-600',
    icon: TrashIcon,
    iconBg: 'bg-red-100 text-red-600'
  },
  warning: {
    gradient: 'from-yellow-500 to-amber-600',
    icon: ExclamationTriangleIcon,
    iconBg: 'bg-yellow-100 text-yellow-600'
  },
  success: {
    gradient: 'from-green-500 to-emerald-600',
    icon: CheckCircleIcon,
    iconBg: 'bg-green-100 text-green-600'
  },
  info: {
    gradient: 'from-blue-500 to-indigo-600',
    icon: CheckCircleIcon,
    iconBg: 'bg-blue-100 text-blue-600'
  }
}

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  type = 'danger',
  isLoading = false,
  requireExtraConfirmation = false,
  extraConfirmationText = 'ELIMINAR'
}: ConfirmationModalProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [extraConfirmInput, setExtraConfirmInput] = useState('')

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true)
      setExtraConfirmInput('')
    } else {
      setIsVisible(false)
    }
  }, [isOpen])

  const handleClose = () => {
    if (!isLoading) {
      setIsVisible(false)
      setTimeout(onClose, 200)
    }
  }

  const handleConfirm = () => {
    if (requireExtraConfirmation && extraConfirmInput !== extraConfirmationText) {
      return
    }
    onConfirm()
  }

  const config = TYPE_CONFIG[type]
  const Icon = config.icon
  const canConfirm = !requireExtraConfirmation || extraConfirmInput === extraConfirmationText

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div 
          className={`relative w-full max-w-md transform rounded-2xl bg-white shadow-2xl transition-all duration-300 ${
            isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
          }`}
        >
          {/* Header */}
          <div className="flex items-start gap-4 p-6 pb-4">
            <div className={`flex-shrink-0 w-12 h-12 rounded-xl ${config.iconBg} flex items-center justify-center`}>
              <Icon className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-gray-900">{title}</h3>
              <p className="mt-2 text-sm text-gray-600">{message}</p>
            </div>
            <button
              onClick={handleClose}
              disabled={isLoading}
              className="flex-shrink-0 p-1 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              <XMarkIcon className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* Extra Confirmation */}
          {requireExtraConfirmation && (
            <div className="px-6 pb-4">
              <div className="p-4 rounded-xl bg-red-50 border border-red-100">
                <p className="text-sm text-red-800 mb-2">
                  Para confirmar, escribe <span className="font-mono font-bold">{extraConfirmationText}</span> abajo:
                </p>
                <input
                  type="text"
                  value={extraConfirmInput}
                  onChange={(e) => setExtraConfirmInput(e.target.value)}
                  placeholder={extraConfirmationText}
                  className="w-full px-4 py-2 rounded-lg border border-red-200 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all text-center font-mono"
                  disabled={isLoading}
                />
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 p-6 pt-2">
            <button
              onClick={handleClose}
              disabled={isLoading}
              className="flex-1 px-4 py-3 text-gray-700 font-medium bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors disabled:opacity-50"
            >
              {cancelText}
            </button>
            <button
              onClick={handleConfirm}
              disabled={isLoading || !canConfirm}
              className={`flex-1 px-4 py-3 text-white font-medium bg-gradient-to-r ${config.gradient} rounded-xl transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Procesando...
                </>
              ) : (
                confirmText
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
