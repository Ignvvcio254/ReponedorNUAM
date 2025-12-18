/**
 * User Table Component
 * Displays users with actions (edit, delete, toggle status, change role)
 */

'use client'

import { useState } from 'react'
import {
  PencilIcon,
  TrashIcon,
  LockClosedIcon,
  LockOpenIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline'

export interface User {
  id: string
  name: string
  email: string
  role: string
  isActive: boolean
  lastLoginAt: string | null
  createdAt: string
  _count?: {
    qualifications: number
    importBatches: number
    auditLogs: number
  }
}

interface UserTableProps {
  users: User[]
  currentUserId: string
  onEdit: (user: User) => void
  onDelete: (userId: string) => void
  onToggleStatus: (userId: string) => void
  onChangeRole: (userId: string) => void
}

export function UserTable({
  users,
  currentUserId,
  onEdit,
  onDelete,
  onToggleStatus,
  onChangeRole,
}: UserTableProps) {
  const [loadingActions, setLoadingActions] = useState<Record<string, boolean>>({})

  const roleColors: Record<string, string> = {
    ADMIN: 'bg-purple-100 text-purple-800 border-purple-300',
    MANAGER: 'bg-blue-100 text-blue-800 border-blue-300',
    ACCOUNTANT: 'bg-green-100 text-green-800 border-green-300',
    AUDITOR: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    VIEWER: 'bg-gray-100 text-gray-800 border-gray-300',
  }

  const roleLabels: Record<string, string> = {
    ADMIN: 'Administrador',
    MANAGER: 'Gerente',
    ACCOUNTANT: 'Contador',
    AUDITOR: 'Auditor',
    VIEWER: 'Visor',
  }

  const handleAction = async (userId: string, action: () => void) => {
    setLoadingActions((prev) => ({ ...prev, [userId]: true }))
    try {
      await action()
    } finally {
      setLoadingActions((prev) => ({ ...prev, [userId]: false }))
    }
  }

  if (users.length === 0) {
    return (
      <div className="text-center py-12">
        <ShieldCheckIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No hay usuarios</h3>
        <p className="mt-1 text-sm text-gray-500">
          Comienza creando un nuevo usuario.
        </p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Usuario
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Rol
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Estado
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Último Acceso
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actividad
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users.map((user) => {
            const isCurrentUser = user.id === currentUserId
            const isLoading = loadingActions[user.id]

            return (
              <tr
                key={user.id}
                className={`hover:bg-gray-50 transition-colors ${
                  isCurrentUser ? 'bg-blue-50' : ''
                }`}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-nuam-500 to-nuam-700 flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {user.name}
                        {isCurrentUser && (
                          <span className="ml-2 text-xs text-blue-600">(Tú)</span>
                        )}
                      </div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => !isCurrentUser && !isLoading && handleAction(user.id, () => onChangeRole(user.id))}
                    disabled={isCurrentUser || isLoading}
                    className={`inline-flex items-center px-2.5 py-1.5 border text-xs font-medium rounded-md transition-all ${
                      roleColors[user.role] || 'bg-gray-100 text-gray-800 border-gray-300'
                    } ${
                      !isCurrentUser && !isLoading
                        ? 'hover:shadow-md cursor-pointer'
                        : 'opacity-60 cursor-not-allowed'
                    }`}
                  >
                    {roleLabels[user.role] || user.role}
                    {!isCurrentUser && !isLoading && (
                      <PencilIcon className="ml-1.5 h-3 w-3" />
                    )}
                  </button>
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => !isCurrentUser && !isLoading && handleAction(user.id, () => onToggleStatus(user.id))}
                    disabled={isCurrentUser || isLoading}
                    className={`inline-flex items-center px-2.5 py-1.5 text-xs font-semibold rounded-full transition-all ${
                      user.isActive
                        ? 'bg-green-100 text-green-800 hover:bg-green-200'
                        : 'bg-red-100 text-red-800 hover:bg-red-200'
                    } ${
                      isCurrentUser || isLoading
                        ? 'opacity-60 cursor-not-allowed'
                        : 'cursor-pointer'
                    }`}
                  >
                    {user.isActive ? (
                      <>
                        <LockOpenIcon className="mr-1 h-3 w-3" />
                        Activo
                      </>
                    ) : (
                      <>
                        <LockClosedIcon className="mr-1 h-3 w-3" />
                        Inactivo
                      </>
                    )}
                  </button>
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.lastLoginAt
                    ? new Date(user.lastLoginAt).toLocaleString('es-ES', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : 'Nunca'}
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex gap-2 text-xs">
                    {user._count && (
                      <>
                        <span title="Calificaciones">{user._count.qualifications} Q</span>
                        <span title="Importaciones">{user._count.importBatches} I</span>
                        <span title="Auditorías">{user._count.auditLogs} A</span>
                      </>
                    )}
                  </div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => !isLoading && handleAction(user.id, () => onEdit(user))}
                      disabled={isLoading}
                      className="text-nuam-600 hover:text-nuam-900 transition-colors disabled:opacity-50"
                      title="Editar usuario"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>

                    {!isCurrentUser && (
                      <button
                        onClick={() => !isLoading && handleAction(user.id, () => onDelete(user.id))}
                        disabled={isLoading}
                        className="text-red-600 hover:text-red-900 transition-colors disabled:opacity-50"
                        title="Eliminar usuario"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
