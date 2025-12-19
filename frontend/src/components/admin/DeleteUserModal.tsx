/**
 * Delete User Modal Component
 * Confirmation modal for deleting users with safety checks
 */

'use client'

import { useState } from 'react'
import { XMarkIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'

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

    if (!isConfirmed) {
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-red-50">
          <div className="flex items-center gap-3">
            <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
            <h3 className="text-lg font-semibold text-red-900">
              Eliminar Usuario
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-red-400 hover:text-red-600 transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-700">
              <strong>Usuario:</strong> {user.name}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              <strong>Email:</strong> {user.email}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              <strong>Rol:</strong> {user.role}
            </p>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de eliminación:
            </label>

            <label className="flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-gray-300">
              <input
                type="radio"
                name="deleteType"
                value="soft"
                checked={deleteType === 'soft'}
                onChange={(e) => setDeleteType(e.target.value as 'soft')}
                className="mt-1"
              />
              <div className="ml-3 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-900">
                    Desactivar usuario
                  </span>
                  <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded">
                    Recomendado
                  </span>
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  El usuario será desactivado pero sus datos y actividad se mantendrán en el sistema. 
                  Podrás reactivarlo más tarde si es necesario.
                </p>
              </div>
            </label>

            <label className="flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-red-300 border-red-200">
              <input
                type="radio"
                name="deleteType"
                value="permanent"
                checked={deleteType === 'permanent'}
                onChange={(e) => setDeleteType(e.target.value as 'permanent')}
                className="mt-1"
              />
              <div className="ml-3 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-red-900">
                    Eliminar permanentemente
                  </span>
                  <span className="text-xs text-red-600 bg-red-50 px-2 py-0.5 rounded">
                    Irreversible
                  </span>
                </div>
                <p className="text-xs text-red-600 mt-1">
                  ⚠️ <strong>ADVERTENCIA:</strong> Esta acción eliminará permanentemente al usuario y TODOS sus datos asociados 
                  (calificaciones, importaciones, logs de auditoría). Esta acción NO se puede deshacer.
                </p>
              </div>
            </label>
          </div>

          {deleteType === 'permanent' && (
            <div className="bg-red-50 border-2 border-red-200 p-4 rounded-lg">
              <p className="text-sm text-red-900 font-medium mb-2">
                Para confirmar la eliminación permanente, escribe exactamente:
              </p>
              <p className="text-lg font-bold text-red-700 mb-3 text-center">
                {requiredConfirmText}
              </p>
              <input
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="Escribe ELIMINAR aquí"
                className="w-full px-4 py-2 border-2 border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-center font-medium"
              />
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || (deleteType === 'permanent' && !isConfirmed)}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Eliminando...' : deleteType === 'soft' ? 'Desactivar Usuario' : 'Eliminar Permanentemente'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
