/**
 * Delete User Modal Component
 * Premium confirmation modal with dramatic design for user deletion
 */

'use client'

import { useState } from 'react'
import { XMarkIcon, ExclamationTriangleIcon, TrashIcon, UserMinusIcon } from '@heroicons/react/24/outline'

interface DeleteUserModalProps {
  user: {
    id: string
    name: string
    email: string
    role: string
  }
  isOpen: boolean
  onClose: () => void
  onDelete: (userId: string, permanent: boolean) => Promise<void>
}

export function DeleteUserModal({ user, isOpen, onClose, onDelete }: DeleteUserModalProps) {
  const [deleteType, setDeleteType] = useState<'soft' | 'permanent'>('soft')
  const [confirmText, setConfirmText] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (!isOpen) return null

  const requiredConfirmText = 'ELIMINAR'
  const isConfirmed = confirmText.toUpperCase() === requiredConfirmText

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (deleteType === 'permanent' && !isConfirmed) {
      setError('Debes escribir ELIMINAR para confirmar')
      return
    }

    setLoading(true)
    setError('')

    try {
      await onDelete(user.id, deleteType === 'permanent')
      setConfirmText('')
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar usuario')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setError('')
    setConfirmText('')
    setDeleteType('soft')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-gray-900/70 backdrop-blur-sm transition-opacity"
          onClick={handleClose}
        />

        {/* Modal */}
        <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden">
          {/* Danger Header */}
          <div className="relative bg-gradient-to-r from-red-600 via-rose-600 to-red-700 px-6 py-6">
            {/* Animated warning pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px)'
              }} />
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
            
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-lg"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
            
            <div className="relative flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg animate-pulse">
                <ExclamationTriangleIcon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Eliminar Usuario</h3>
                <p className="text-white/80 text-sm mt-0.5">
                  Esta acción requiere confirmación
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            )}

            {/* User Card */}
            <div className="flex items-center gap-4 bg-gray-50 border border-gray-100 p-4 rounded-xl">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center shadow-md">
                <span className="text-xl font-bold text-white">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">{user.name}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
                <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium bg-gray-200 text-gray-600 rounded-full">
                  {user.role}
                </span>
              </div>
            </div>

            {/* Delete Type Selection */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700">
                Tipo de eliminación:
              </label>

              {/* Soft Delete Option */}
              <label
                className={`relative flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                  deleteType === 'soft'
                    ? 'border-amber-300 bg-amber-50 ring-2 ring-amber-500/30'
                    : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                }`}
              >
                <input
                  type="radio"
                  name="deleteType"
                  value="soft"
                  checked={deleteType === 'soft'}
                  onChange={(e) => setDeleteType(e.target.value as 'soft')}
                  className="sr-only"
                />
                
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  deleteType === 'soft' 
                    ? 'bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg' 
                    : 'bg-gray-100'
                }`}>
                  <UserMinusIcon className={`w-6 h-6 ${deleteType === 'soft' ? 'text-white' : 'text-gray-400'}`} />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`font-semibold ${deleteType === 'soft' ? 'text-amber-800' : 'text-gray-900'}`}>
                      Desactivar Usuario
                    </span>
                    <span className="px-2 py-0.5 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                      Recomendado
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    El usuario será desactivado pero sus datos se mantienen. Podrás reactivarlo más tarde.
                  </p>
                </div>
                
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                  deleteType === 'soft' 
                    ? 'bg-gradient-to-br from-amber-400 to-orange-500 border-transparent' 
                    : 'border-gray-300'
                }`}>
                  {deleteType === 'soft' && (
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </label>

              {/* Permanent Delete Option */}
              <label
                className={`relative flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                  deleteType === 'permanent'
                    ? 'border-red-300 bg-red-50 ring-2 ring-red-500/30'
                    : 'border-gray-100 hover:border-red-100 hover:bg-red-50/30'
                }`}
              >
                <input
                  type="radio"
                  name="deleteType"
                  value="permanent"
                  checked={deleteType === 'permanent'}
                  onChange={(e) => setDeleteType(e.target.value as 'permanent')}
                  className="sr-only"
                />
                
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  deleteType === 'permanent' 
                    ? 'bg-gradient-to-br from-red-500 to-rose-600 shadow-lg' 
                    : 'bg-gray-100'
                }`}>
                  <TrashIcon className={`w-6 h-6 ${deleteType === 'permanent' ? 'text-white' : 'text-gray-400'}`} />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`font-semibold ${deleteType === 'permanent' ? 'text-red-800' : 'text-gray-900'}`}>
                      Eliminar Permanentemente
                    </span>
                    <span className="px-2 py-0.5 text-xs font-medium bg-red-100 text-red-700 rounded-full">
                      Irreversible
                    </span>
                  </div>
                  <p className="text-sm text-red-600 mt-1">
                    ⚠️ Se eliminarán TODOS los datos: calificaciones, importaciones y logs de auditoría.
                  </p>
                </div>
                
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                  deleteType === 'permanent' 
                    ? 'bg-gradient-to-br from-red-500 to-rose-600 border-transparent' 
                    : 'border-gray-300'
                }`}>
                  {deleteType === 'permanent' && (
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </label>
            </div>

            {/* Confirmation Input for Permanent Delete */}
            {deleteType === 'permanent' && (
              <div className="bg-red-50 border-2 border-red-200 p-5 rounded-xl space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                    <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-red-900">
                      Confirmar Eliminación Permanente
                    </p>
                    <p className="text-xs text-red-700">
                      Escribe <span className="font-bold">{requiredConfirmText}</span> para continuar
                    </p>
                  </div>
                </div>
                
                <input
                  type="text"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder="Escribe ELIMINAR aquí"
                  className={`w-full px-4 py-3 border-2 rounded-xl text-center font-bold uppercase tracking-wider transition-all ${
                    isConfirmed 
                      ? 'border-green-400 bg-green-50 text-green-700' 
                      : 'border-red-300 bg-white text-red-700 focus:ring-2 focus:ring-red-500 focus:border-transparent'
                  }`}
                />
                
                {isConfirmed && (
                  <div className="flex items-center justify-center gap-2 text-green-700 text-sm">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Confirmación válida
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={handleClose}
                disabled={loading}
                className="flex-1 px-4 py-3 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-all font-medium disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading || (deleteType === 'permanent' && !isConfirmed)}
                className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-50 ${
                  deleteType === 'permanent'
                    ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg shadow-red-500/25 hover:from-red-700 hover:to-rose-700'
                    : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/25 hover:from-amber-600 hover:to-orange-600'
                }`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Procesando...
                  </>
                ) : deleteType === 'soft' ? (
                  <>
                    <UserMinusIcon className="w-5 h-5" />
                    Desactivar Usuario
                  </>
                ) : (
                  <>
                    <TrashIcon className="w-5 h-5" />
                    Eliminar Permanentemente
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
