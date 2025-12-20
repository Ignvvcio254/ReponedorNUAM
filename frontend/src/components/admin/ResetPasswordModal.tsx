/**
 * Reset Password Modal Component
 * Premium modal for resetting user password with strength indicator
 */

'use client'

import { useState, useMemo } from 'react'
import { XMarkIcon, KeyIcon, EyeIcon, EyeSlashIcon, CheckCircleIcon, SparklesIcon } from '@heroicons/react/24/outline'

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

// Password strength calculator
function calculatePasswordStrength(password: string): { score: number; label: string; color: string } {
  if (!password) return { score: 0, label: '', color: 'bg-gray-200' }
  
  let score = 0
  
  // Length checks
  if (password.length >= 8) score += 1
  if (password.length >= 12) score += 1
  if (password.length >= 16) score += 1
  
  // Character variety checks
  if (/[a-z]/.test(password)) score += 1
  if (/[A-Z]/.test(password)) score += 1
  if (/[0-9]/.test(password)) score += 1
  if (/[^a-zA-Z0-9]/.test(password)) score += 1
  
  // Normalize to 0-4 scale
  const normalizedScore = Math.min(4, Math.floor(score / 2))
  
  const levels = [
    { label: 'Muy débil', color: 'bg-red-500' },
    { label: 'Débil', color: 'bg-orange-500' },
    { label: 'Aceptable', color: 'bg-yellow-500' },
    { label: 'Fuerte', color: 'bg-green-500' },
    { label: 'Muy fuerte', color: 'bg-emerald-500' },
  ]
  
  return { score: normalizedScore, ...levels[normalizedScore] }
}

export function ResetPasswordModal({ user, isOpen, onClose, onReset }: ResetPasswordModalProps) {
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const passwordStrength = useMemo(() => calculatePasswordStrength(newPassword), [newPassword])

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
      setSuccess(true)
      setTimeout(() => {
        setNewPassword('')
        setConfirmPassword('')
        setSuccess(false)
        onClose()
      }, 1500)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al restablecer contraseña')
    } finally {
      setLoading(false)
    }
  }

  const generateRandomPassword = () => {
    const length = 16
    const lowercase = 'abcdefghijklmnopqrstuvwxyz'
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const numbers = '0123456789'
    const symbols = '!@#$%&*'
    const allChars = lowercase + uppercase + numbers + symbols
    
    let password = ''
    
    // Ensure at least one of each type
    password += uppercase.charAt(Math.floor(Math.random() * uppercase.length))
    password += lowercase.charAt(Math.floor(Math.random() * lowercase.length))
    password += numbers.charAt(Math.floor(Math.random() * numbers.length))
    password += symbols.charAt(Math.floor(Math.random() * symbols.length))
    
    // Fill the rest
    for (let i = 4; i < length; i++) {
      password += allChars.charAt(Math.floor(Math.random() * allChars.length))
    }
    
    // Shuffle
    password = password.split('').sort(() => Math.random() - 0.5).join('')
    
    setNewPassword(password)
    setConfirmPassword(password)
    setShowPassword(true)
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(newPassword)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleClose = () => {
    setError('')
    setSuccess(false)
    setNewPassword('')
    setConfirmPassword('')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity"
          onClick={handleClose}
        />

        {/* Modal */}
        <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
          {/* Header */}
          <div className="relative bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-700 px-6 py-6">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
            
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-lg"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
            
            <div className="relative flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
                <KeyIcon className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Restablecer Contraseña</h3>
                <p className="text-white/70 text-sm mt-0.5">
                  Crear nueva contraseña de acceso
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
                ¡Contraseña restablecida correctamente!
              </div>
            )}

            {/* User Info */}
            <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                <span className="text-lg font-bold text-white">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">{user.name}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            </div>

            {/* Info Note */}
            <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 p-4 rounded-xl">
              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-sm text-blue-800">
                La nueva contraseña debe tener al menos 8 caracteres. El usuario recibirá las credenciales y podrá cambiarla después.
              </p>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <KeyIcon className="w-4 h-4 text-gray-400" />
                  Nueva Contraseña
                </label>
                <button
                  type="button"
                  onClick={generateRandomPassword}
                  className="flex items-center gap-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-700 transition-colors px-2 py-1 rounded-lg hover:bg-indigo-50"
                >
                  <SparklesIcon className="w-4 h-4" />
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
                  className="w-full px-4 py-3 pr-24 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-gray-50 hover:bg-white focus:bg-white font-mono"
                  placeholder="••••••••••••"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  {newPassword && (
                    <button
                      type="button"
                      onClick={copyToClipboard}
                      className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                      title="Copiar contraseña"
                    >
                      {copied ? (
                        <CheckCircleIcon className="h-5 w-5 text-green-500" />
                      ) : (
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      )}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Password Strength Indicator */}
              {newPassword && (
                <div className="space-y-2">
                  <div className="flex gap-1">
                    {[0, 1, 2, 3].map((index) => (
                      <div
                        key={index}
                        className={`h-1.5 flex-1 rounded-full transition-all ${
                          index <= passwordStrength.score 
                            ? passwordStrength.color 
                            : 'bg-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                  <p className={`text-xs font-medium ${
                    passwordStrength.score <= 1 ? 'text-red-600' :
                    passwordStrength.score <= 2 ? 'text-yellow-600' :
                    'text-green-600'
                  }`}>
                    Fortaleza: {passwordStrength.label}
                  </p>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <KeyIcon className="w-4 h-4 text-gray-400" />
                Confirmar Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  minLength={8}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all bg-gray-50 hover:bg-white focus:bg-white font-mono ${
                    confirmPassword && newPassword === confirmPassword
                      ? 'border-green-300 focus:ring-green-500'
                      : confirmPassword && newPassword !== confirmPassword
                      ? 'border-red-300 focus:ring-red-500'
                      : 'border-gray-200 focus:ring-indigo-500'
                  }`}
                  placeholder="••••••••••••"
                />
                {confirmPassword && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {newPassword === confirmPassword ? (
                      <CheckCircleIcon className="w-5 h-5 text-green-500" />
                    ) : (
                      <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                  </div>
                )}
              </div>
              {confirmPassword && newPassword !== confirmPassword && (
                <p className="text-xs text-red-600">Las contraseñas no coinciden</p>
              )}
            </div>

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
                disabled={loading || success || !newPassword || newPassword !== confirmPassword}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl hover:from-cyan-700 hover:to-blue-700 transition-all font-medium shadow-lg shadow-blue-500/25 disabled:opacity-50 flex items-center justify-center gap-2"
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
                    ¡Listo!
                  </>
                ) : (
                  <>
                    <KeyIcon className="w-5 h-5" />
                    Restablecer
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
