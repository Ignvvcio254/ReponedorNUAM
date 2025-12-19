/**
 * Change Role Modal Component
 * Modal for changing user role with role descriptions
 */

'use client'

import { useState } from 'react'
import { XMarkIcon, ShieldCheckIcon } from '@heroicons/react/24/outline'

interface ChangeRoleModalProps {
  user: {
    id: string
    name: string
    role: string
  }
  isOpen: boolean
  onClose: () => void
  onSave: (userId: string, newRole: string) => Promise<void>
}

const ROLES = [
  {
    value: 'ADMIN',
    label: 'Administrador',
    description: 'Acceso total al sistema, gestión de usuarios y configuración',
    color: 'purple',
  },
  {
    value: 'MANAGER',
    label: 'Gerente',
    description: 'Puede aprobar calificaciones y gestionar entidades fiscales',
    color: 'blue',
  },
  {
    value: 'ACCOUNTANT',
    label: 'Contador',
    description: 'Puede crear y editar calificaciones tributarias',
    color: 'green',
  },
  {
    value: 'AUDITOR',
    label: 'Auditor',
    description: 'Solo lectura con acceso a logs de auditoría',
    color: 'yellow',
  },
  {
    value: 'VIEWER',
    label: 'Visor',
    description: 'Solo puede visualizar información básica',
    color: 'gray',
  },
]

export function ChangeRoleModal({ user, isOpen, onClose, onSave }: ChangeRoleModalProps) {
  const [selectedRole, setSelectedRole] = useState(user.role)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (selectedRole === user.role) {
      setError('El rol seleccionado es el mismo que el actual')
      return
    }

    setLoading(true)
    setError('')

    try {
      await onSave(user.id, selectedRole)
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cambiar rol')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <ShieldCheckIcon className="h-6 w-6 text-nuam-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Cambiar Rol de Usuario
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
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
              <strong>Rol actual:</strong> {ROLES.find(r => r.value === user.role)?.label}
            </p>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Selecciona el nuevo rol:
            </label>
            
            {ROLES.map((role) => (
              <label
                key={role.value}
                className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  selectedRole === role.value
                    ? 'border-nuam-500 bg-nuam-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  value={role.value}
                  checked={selectedRole === role.value}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="mt-1"
                />
                <div className="ml-3 flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-full bg-${role.color}-100 text-${role.color}-800`}>
                      {role.label}
                    </span>
                    {role.value === user.role && (
                      <span className="text-xs text-gray-500">(Actual)</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {role.description}
                  </p>
                </div>
              </label>
            ))}
          </div>

          {selectedRole === 'ADMIN' && user.role !== 'ADMIN' && (
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>⚠️ Advertencia:</strong> Estás a punto de otorgar permisos de administrador completo. 
                Los administradores tienen acceso total al sistema y pueden modificar cualquier configuración.
              </p>
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
              disabled={loading || selectedRole === user.role}
              className="flex-1 px-4 py-2 bg-nuam-600 text-white rounded-lg hover:bg-nuam-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Cambiando Rol...' : 'Confirmar Cambio'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
