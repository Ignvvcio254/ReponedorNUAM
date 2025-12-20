'use client'

/**
 * Login Page - Polished Light Theme
 *
 * Features:
 * - Clean white design with subtle gradients
 * - Polished input styling
 * - Password visibility toggle
 * - Smooth animations
 * - Professional aesthetic
 */

import { useState, useEffect, Suspense } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Logo } from '@/components/ui/Logo'
import { isValidEmail } from '@/lib/auth'
import { EyeIcon, EyeSlashIcon, LockClosedIcon, EnvelopeIcon, ArrowRightIcon, ShieldCheckIcon } from '@heroicons/react/24/outline'

// ============================================================================
// Types
// ============================================================================

interface LoginFormData {
  email: string
  password: string
}

interface FormErrors {
  email?: string
  password?: string
  general?: string
}

// ============================================================================
// Login Form Component
// ============================================================================

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard'

  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  // ============================================================================
  // Handlers
  // ============================================================================

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.email) {
      newErrors.email = 'El correo electrónico es requerido'
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Formato de correo inválido'
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida'
    } else if (formData.password.length < 8) {
      newErrors.password = 'Mínimo 8 caracteres'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    if (!validateForm()) return

    setIsLoading(true)

    try {
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
        callbackUrl,
      })

      if (result?.error) {
        setErrors({ general: result.error })
        setIsLoading(false)
        return
      }

      if (result?.ok) {
        router.push(callbackUrl)
        router.refresh()
      }
    } catch (error) {
      setErrors({ general: 'Error inesperado. Por favor, intenta de nuevo.' })
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const fillDemoCredentials = (role: 'admin' | 'accountant' | 'auditor') => {
    const credentials = {
      admin: { email: 'admin@nuam.com', password: 'Admin123!NUAM' },
      accountant: { email: 'accountant@nuam.com', password: 'Demo123!NUAM' },
      auditor: { email: 'auditor@nuam.com', password: 'Demo123!NUAM' },
    }
    setFormData(credentials[role])
  }

  // ============================================================================
  // Render
  // ============================================================================

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      {/* Decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-full opacity-60 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-indigo-100 to-purple-200 rounded-full opacity-60 blur-3xl" />
      </div>

      <div className={`relative z-10 max-w-md w-full transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="p-4 rounded-2xl bg-white shadow-xl shadow-blue-500/10 border border-gray-100">
              <Logo size="xl" showText={true} />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            Bienvenido a NUAM
          </h1>
          <p className="mt-2 text-gray-600">
            Sistema de Contenedor Tributario Latinoamericano
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* General Error */}
            {errors.general && (
              <div className="flex items-start gap-3 bg-red-50 border border-red-100 text-red-800 px-4 py-3 rounded-xl text-sm">
                <svg className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div>
                  <p className="font-semibold">Error de autenticación</p>
                  <p className="text-red-600 text-xs mt-0.5">{errors.general}</p>
                </div>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Correo electrónico
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className={`
                    w-full pl-12 pr-4 py-3 rounded-xl
                    border bg-gray-50
                    text-gray-900 placeholder-gray-400
                    focus:outline-none focus:ring-2 focus:bg-white
                    disabled:opacity-50 disabled:cursor-not-allowed
                    transition-all duration-200
                    ${errors.email 
                      ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500' 
                      : 'border-gray-200 focus:ring-blue-500/20 focus:border-blue-500 hover:border-gray-300'}
                  `}
                  placeholder="usuario@ejemplo.com"
                />
              </div>
              {errors.email && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <LockClosedIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className={`
                    w-full pl-12 pr-12 py-3 rounded-xl
                    border bg-gray-50
                    text-gray-900 placeholder-gray-400
                    focus:outline-none focus:ring-2 focus:bg-white
                    disabled:opacity-50 disabled:cursor-not-allowed
                    transition-all duration-200
                    ${errors.password 
                      ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500' 
                      : 'border-gray-200 focus:ring-blue-500/20 focus:border-blue-500 hover:border-gray-300'}
                  `}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {errors.password}
                </p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-offset-0"
                  disabled={isLoading}
                />
                <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">Recordarme</span>
              </label>
              <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`
                w-full flex justify-center items-center gap-2 py-3.5 px-6 rounded-xl
                font-semibold text-white
                transition-all duration-300
                ${isLoading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98]'
                }
              `}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Iniciando sesión...
                </>
              ) : (
                <>
                  Iniciar Sesión
                  <ArrowRightIcon className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <p className="text-xs text-gray-500 text-center mb-3 flex items-center justify-center gap-1.5">
              <ShieldCheckIcon className="w-4 h-4" />
              Credenciales de demostración
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => fillDemoCredentials('admin')}
                className="group py-2.5 px-3 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 text-purple-700 text-xs font-medium hover:from-purple-100 hover:to-purple-150 hover:border-purple-300 hover:shadow-md transition-all"
              >
                <span className="block text-base mb-0.5">👑</span>
                Admin
              </button>
              <button
                type="button"
                onClick={() => fillDemoCredentials('accountant')}
                className="group py-2.5 px-3 rounded-xl bg-gradient-to-br from-green-50 to-green-100 border border-green-200 text-green-700 text-xs font-medium hover:from-green-100 hover:to-green-150 hover:border-green-300 hover:shadow-md transition-all"
              >
                <span className="block text-base mb-0.5">📊</span>
                Contador
              </button>
              <button
                type="button"
                onClick={() => fillDemoCredentials('auditor')}
                className="group py-2.5 px-3 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 text-blue-700 text-xs font-medium hover:from-blue-100 hover:to-blue-150 hover:border-blue-300 hover:shadow-md transition-all"
              >
                <span className="block text-base mb-0.5">🔍</span>
                Auditor
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            NUAM Tax Container System v1.0.0
          </p>
          <p className="text-xs text-gray-400 mt-1 flex items-center justify-center gap-1">
            <LockClosedIcon className="w-3 h-3" />
            Conexión Segura SSL/TLS
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// Loading Fallback
// ============================================================================

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 relative">
          <div className="absolute inset-0 rounded-full border-4 border-blue-100" />
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-600 animate-spin" />
        </div>
        <p className="text-gray-500">Cargando...</p>
      </div>
    </div>
  )
}

// ============================================================================
// Page Component
// ============================================================================

export default function LoginPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <LoginForm />
    </Suspense>
  )
}
