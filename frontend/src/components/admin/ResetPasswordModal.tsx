/**
 * Reset Password Modal Component
 * Modal for resetting user password by admin
 */

'use client'

import { useState } from 'react'
import { XMarkIcon, KeyIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'

interface ResetPasswordModalProps {
  user: {
    id: string
    name: string
    email: string
  }
  isOpen: boolean
  onClose: () => void
  onReset: (userId: string, newPassword: string) => Promise<void>
}

export function ResetPasswordModal({ user, isOpen, onClose, onReset }: ResetPasswordModalProps) {
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (!isOpen) return null

  const validatePassword = () => {
    if (newPassword.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres')
      return false
    }

    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden')
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!validatePassword()) {
      return
    }

    setLoading(true)

    try {
      await onReset(user.id, newPassword)
      setNewPassword('')
      setConfirmPassword('')
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al restablecer contraseña')
    } finally {
      setLoading(false)
    }
  }

  const generateRandomPassword = () => {
    const length = 12
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*'
    let password = ''
    
    // Asegurar al menos una mayúscula, minúscula, número y símbolo
    password += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.charAt(Math.floor(Math.random() * 26))
    password += 'abcdefghijklmnopqrstuvwxyz'.charAt(Math.floor(Math.random() * 26))
    password += '0123456789'.charAt(Math.floor(Math.random() * 10))
    password += '!@#$%&*'.charAt(Math.floor(Math.random() * 7))
    
    // Completar el resto
    for (let i = 4; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length))
    }
    
    // Mezclar
    password = password.split('').sort(() => Math.random() - 0.5).join('')
    
    setNewPassword(password)
    setConfirmPassword(password)
    setShowPassword(true)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <KeyIcon className="h-6 w-6 text-nuam-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Restablecer Contraseña
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
              <strong>Email:</strong> {user.email}
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
            <p className="text-xs text-blue-800">
              💡 La nueva contraseña debe tener al menos 8 caracteres. El usuario podrá cambiarla después de iniciar sesión.
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Nueva Contraseña
              </label>
              <button
                type="button"
                onClick={generateRandomPassword}
                className="text-xs text-nuam-600 hover:text-nuam-700 font-medium"
              >
                Generar Automática
              </button>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                minLength={8}
                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nuam-500 focus:border-transparent"
                placeholder="Mínimo 8 caracteres"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirmar Contraseña
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              minLength={8}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nuam-500 focus:border-transparent"
              placeholder="Repetir contraseña"
            />
          </div>

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
              disabled={loading}
              className="flex-1 px-4 py-2 bg-nuam-600 text-white rounded-lg hover:bg-nuam-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Restableciendo...' : 'Restablecer Contraseña'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
