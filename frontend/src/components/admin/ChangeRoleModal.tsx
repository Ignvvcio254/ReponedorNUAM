/**
 * Change Role Modal Component
 * Premium modal for changing user role with modern design and icons
 */

'use client'

import { useState } from 'react'
import { XMarkIcon, CheckCircleIcon } from '@heroicons/react/24/outline'
import {
  ShieldCheckIcon,
  UserGroupIcon,
  CalculatorIcon,
  MagnifyingGlassIcon,
  EyeIcon,
} from '@heroicons/react/24/solid'

interface ChangeRoleModalProps {
  user: {
    id: string
    name: string
    email: string
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
    icon: ShieldCheckIcon,
    gradient: 'from-purple-500 to-indigo-600',
    bgLight: 'bg-purple-50',
    border: 'border-purple-200',
    text: 'text-purple-700',
    ring: 'ring-purple-500',
  },
  {
    value: 'MANAGER',
    label: 'Gerente',
    description: 'Puede aprobar calificaciones y gestionar entidades fiscales',
    icon: UserGroupIcon,
    gradient: 'from-blue-500 to-cyan-600',
    bgLight: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-700',
    ring: 'ring-blue-500',
  },
  {
    value: 'ACCOUNTANT',
    label: 'Contador',
    description: 'Puede crear y editar calificaciones tributarias',
    icon: CalculatorIcon,
    gradient: 'from-emerald-500 to-teal-600',
    bgLight: 'bg-emerald-50',
    border: 'border-emerald-200',
    text: 'text-emerald-700',
    ring: 'ring-emerald-500',
  },
  {
    value: 'AUDITOR',
    label: 'Auditor',
    description: 'Solo lectura con acceso a logs de auditoría',
    icon: MagnifyingGlassIcon,
    gradient: 'from-amber-500 to-orange-600',
    bgLight: 'bg-amber-50',
    border: 'border-amber-200',
    text: 'text-amber-700',
    ring: 'ring-amber-500',
  },
  {
    value: 'VIEWER',
    label: 'Visor',
    description: 'Solo puede visualizar información básica',
    icon: EyeIcon,
    gradient: 'from-gray-400 to-slate-600',
    bgLight: 'bg-gray-50',
    border: 'border-gray-200',
    text: 'text-gray-700',
    ring: 'ring-gray-500',
  },
]

export function ChangeRoleModal({ user, isOpen, onClose, onSave }: ChangeRoleModalProps) {
  const [selectedRole, setSelectedRole] = useState(user.role)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
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
      setSuccess(true)
      setTimeout(() => {
        onClose()
        setSuccess(false)
      }, 1000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cambiar rol')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setError('')
    setSuccess(false)
    setSelectedRole(user.role)
    onClose()
  }

  const currentRoleConfig = ROLES.find(r => r.value === user.role)

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity"
          onClick={handleClose}
        />

        {/* Modal */}
        <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden">
          {/* Header */}
          <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 px-6 py-6">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-lg"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
            
            <div className="relative flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
                <ShieldCheckIcon className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Cambiar Rol de Usuario</h3>
                <p className="text-white/70 text-sm mt-0.5">
                  Modificar permisos y nivel de acceso
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

            {success && (
              <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm">
                <CheckCircleIcon className="w-5 h-5 flex-shrink-0" />
                ¡Rol actualizado correctamente!
              </div>
            )}

            {/* Current User Info */}
            <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <span className="text-lg font-bold text-white">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">{user.name}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
              {currentRoleConfig && (
                <div className={`px-3 py-1.5 rounded-lg ${currentRoleConfig.bgLight} ${currentRoleConfig.text} text-sm font-medium flex items-center gap-1.5`}>
                  <currentRoleConfig.icon className="w-4 h-4" />
                  {currentRoleConfig.label}
                </div>
              )}
            </div>

            {/* Role Selection */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700">
                Selecciona el nuevo rol:
              </label>
              
              <div className="grid gap-3">
                {ROLES.map((role) => {
                  const isSelected = selectedRole === role.value
                  const isCurrent = user.role === role.value
                  const Icon = role.icon
                  
                  return (
                    <label
                      key={role.value}
                      className={`relative flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                        isSelected
                          ? `${role.border} ${role.bgLight} ring-2 ${role.ring} ring-opacity-50`
                          : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="role"
                        value={role.value}
                        checked={isSelected}
                        onChange={(e) => setSelectedRole(e.target.value)}
                        className="sr-only"
                      />
                      
                      {/* Role Icon */}
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${role.gradient} flex items-center justify-center shadow-lg flex-shrink-0`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      
                      {/* Role Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`font-semibold ${isSelected ? role.text : 'text-gray-900'}`}>
                            {role.label}
                          </span>
                          {isCurrent && (
                            <span className="px-2 py-0.5 text-xs font-medium bg-gray-200 text-gray-600 rounded-full">
                              Actual
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 mt-0.5">
                          {role.description}
                        </p>
                      </div>
                      
                      {/* Selection Indicator */}
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                        isSelected 
                          ? `bg-gradient-to-br ${role.gradient} border-transparent` 
                          : 'border-gray-300'
                      }`}>
                        {isSelected && (
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    </label>
                  )
                })}
              </div>
            </div>

            {/* Admin Warning */}
            {selectedRole === 'ADMIN' && user.role !== 'ADMIN' && (
              <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 p-4 rounded-xl">
                <svg className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <div>
                  <p className="text-sm font-semibold text-amber-800">
                    Advertencia: Permisos de Administrador
                  </p>
                  <p className="text-sm text-amber-700 mt-1">
                    Los administradores tienen acceso completo al sistema, incluyendo gestión de usuarios, configuración y datos sensibles.
                  </p>
                </div>
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
                disabled={loading || selectedRole === user.role || success}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all font-medium shadow-lg shadow-indigo-500/25 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Cambiando...
                  </>
                ) : success ? (
                  <>
                    <CheckCircleIcon className="w-5 h-5" />
                    ¡Cambiado!
                  </>
                ) : (
                  'Confirmar Cambio'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
