/**
 * Edit User Modal Component
 * Premium modal for editing user information with modern design
 */

'use client'

import { useState, useEffect } from 'react'
import { XMarkIcon, UserCircleIcon, EnvelopeIcon, LockClosedIcon, CheckCircleIcon } from '@heroicons/react/24/outline'
import { User } from './UserTable'

interface EditUserModalProps {
  user: User | null
  isOpen: boolean
  onClose: () => void
  onSave: (userId: string, data: any) => Promise<void>
}

export function EditUserModal({ user, isOpen, onClose, onSave }: EditUserModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        password: '',
      })
      setError('')
      setSuccess(false)
    }
  }, [user])

  if (!isOpen || !user) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const updateData: any = {
        name: formData.name,
        email: formData.email,
      }

      if (formData.password) {
        if (formData.password.length < 8) {
          setError('La contraseña debe tener al menos 8 caracteres')
          setLoading(false)
          return
        }
        updateData.password = formData.password
      }

      await onSave(user.id, updateData)
      setSuccess(true)
      setTimeout(() => {
        onClose()
        setSuccess(false)
      }, 1000)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error al actualizar usuario')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setError('')
    setSuccess(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop with blur */}
        <div
          className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity"
          onClick={handleClose}
        />

        {/* Modal */}
        <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden transform transition-all">
          {/* Gradient Header */}
          <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 px-6 py-8">
            {/* Decorative circles */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full blur-xl translate-y-1/2 -translate-x-1/2" />
            
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-lg"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
            
            <div className="relative flex items-center gap-4">
              {/* User Avatar */}
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg ring-4 ring-white/30">
                <span className="text-2xl font-bold text-white">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Editar Usuario</h3>
                <p className="text-white/70 text-sm mt-0.5">
                  Modificar información del perfil
                </p>
              </div>
            </div>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm animate-shake">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            )}

            {success && (
              <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm">
                <CheckCircleIcon className="w-5 h-5 flex-shrink-0" />
                ¡Usuario actualizado correctamente!
              </div>
            )}

            {/* Name Field */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <UserCircleIcon className="w-4 h-4 text-gray-400" />
                Nombre Completo
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-gray-50 hover:bg-white focus:bg-white"
                placeholder="Nombre del usuario"
              />
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <EnvelopeIcon className="w-4 h-4 text-gray-400" />
                Correo Electrónico
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-gray-50 hover:bg-white focus:bg-white"
                placeholder="email@ejemplo.com"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <LockClosedIcon className="w-4 h-4 text-gray-400" />
                Nueva Contraseña
                <span className="text-gray-400 font-normal text-xs">(opcional)</span>
              </label>
              <input
                type="password"
                minLength={8}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-gray-50 hover:bg-white focus:bg-white"
                autoComplete="new-password"
              />
              {formData.password && formData.password.length > 0 && formData.password.length < 8 && (
                <p className="flex items-center gap-1 text-xs text-amber-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 16.5c-.77 .833.192 2.5 1.732 2.5z" />
                  </svg>
                  Mínimo 8 caracteres
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
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
                disabled={loading || success}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all font-medium shadow-lg shadow-indigo-500/25 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Guardando...
                  </>
                ) : success ? (
                  <>
                    <CheckCircleIcon className="w-5 h-5" />
                    ¡Guardado!
                  </>
                ) : (
                  'Guardar Cambios'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
