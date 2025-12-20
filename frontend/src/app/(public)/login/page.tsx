'use client'

/**
 * Login Page - Premium Modern Design
 *
 * Features:
 * - Animated gradient background
 * - Glassmorphism card
 * - Modern input styling
 * - Password visibility toggle
 * - Animated elements
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
      newErrors.email = 'El correo es requerido'
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
      setErrors({ general: 'Error inesperado. Intenta de nuevo.' })
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
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
      {/* Animated Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
        {/* Floating orbs */}
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/20 rounded-full blur-3xl" />
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-10" style={{ 
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }} />
      </div>

      {/* Content */}
      <div className={`relative z-10 w-full max-w-md transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl">
              <Logo size="xl" showText={false} />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">
            Bienvenido
          </h1>
          <p className="text-blue-200/80">
            Sistema de Contenedor Tributario NUAM
          </p>
        </div>

        {/* Login Card */}
        <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-8">
          {/* Decorative gradient */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 rounded-t-3xl" />
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* General Error */}
            {errors.general && (
              <div className="flex items-start gap-3 bg-red-500/20 border border-red-400/30 backdrop-blur-sm text-red-200 px-4 py-3 rounded-xl text-sm">
                <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div>
                  <p className="font-medium">Error de autenticación</p>
                  <p className="text-red-300/80 text-xs mt-0.5">{errors.general}</p>
                </div>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-blue-100 mb-2">
                Correo electrónico
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <EnvelopeIcon className="h-5 w-5 text-blue-300/60" />
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
                    w-full pl-12 pr-4 py-3.5 rounded-xl
                    bg-white/5 border backdrop-blur-sm
                    text-white placeholder-blue-200/40
                    focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50
                    disabled:opacity-50 disabled:cursor-not-allowed
                    transition-all duration-200
                    ${errors.email ? 'border-red-400/50 focus:ring-red-400/50' : 'border-white/10 hover:border-white/20'}
                  `}
                  placeholder="usuario@ejemplo.com"
                />
              </div>
              {errors.email && (
                <p className="mt-2 text-sm text-red-300 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-blue-100 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <LockClosedIcon className="h-5 w-5 text-blue-300/60" />
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
                    w-full pl-12 pr-12 py-3.5 rounded-xl
                    bg-white/5 border backdrop-blur-sm
                    text-white placeholder-blue-200/40
                    focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50
                    disabled:opacity-50 disabled:cursor-not-allowed
                    transition-all duration-200
                    ${errors.password ? 'border-red-400/50 focus:ring-red-400/50' : 'border-white/10 hover:border-white/20'}
                  `}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-blue-300/60 hover:text-blue-200 transition-colors"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-2 text-sm text-red-300 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {errors.password}
                </p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-white/20 bg-white/5 text-blue-500 focus:ring-blue-400/50 focus:ring-offset-0"
                  disabled={isLoading}
                />
                <span className="text-sm text-blue-200/80">Recordarme</span>
              </label>
              <a href="#" className="text-sm font-medium text-blue-300 hover:text-blue-200 transition-colors">
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`
                w-full flex justify-center items-center gap-2 py-4 px-6 rounded-xl
                font-semibold text-white
                transition-all duration-300
                ${isLoading
                  ? 'bg-blue-500/50 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-lg hover:shadow-blue-500/25 hover:scale-[1.02] active:scale-[0.98]'
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
          <div className="mt-8 pt-6 border-t border-white/10">
            <p className="text-xs text-blue-200/60 text-center mb-3 flex items-center justify-center gap-1">
              <ShieldCheckIcon className="w-4 h-4" />
              Acceso rápido de demostración
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => fillDemoCredentials('admin')}
                className="py-2 px-3 rounded-lg bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-400/30 text-purple-200 text-xs font-medium hover:from-purple-500/30 hover:to-purple-600/30 transition-all"
              >
                👑 Admin
              </button>
              <button
                type="button"
                onClick={() => fillDemoCredentials('accountant')}
                className="py-2 px-3 rounded-lg bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-400/30 text-green-200 text-xs font-medium hover:from-green-500/30 hover:to-green-600/30 transition-all"
              >
                📊 Contador
              </button>
              <button
                type="button"
                onClick={() => fillDemoCredentials('auditor')}
                className="py-2 px-3 rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-400/30 text-blue-200 text-xs font-medium hover:from-blue-500/30 hover:to-blue-600/30 transition-all"
              >
                🔍 Auditor
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-blue-200/50">
            NUAM Tax Container System v1.0.0
          </p>
          <p className="text-xs text-blue-200/30 mt-1 flex items-center justify-center gap-1">
            <LockClosedIcon className="w-3 h-3" />
            Conexión segura SSL/TLS
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 relative">
          <div className="absolute inset-0 rounded-full border-4 border-blue-500/30" />
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-400 animate-spin" />
        </div>
        <p className="text-blue-200/60">Cargando...</p>
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
