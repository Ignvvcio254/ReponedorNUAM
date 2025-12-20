'use client'

import { useState, useEffect } from 'react'

interface DesktopOnlyWrapperProps {
  children: React.ReactNode
  minWidth?: number // Minimum screen width in pixels (default: 1024px for laptops)
}

/**
 * DesktopOnlyWrapper Component
 * Shows a friendly message for mobile/tablet users and displays the app normally for desktop users.
 * The app is designed for desktop computers for optimal productivity.
 */
export function DesktopOnlyWrapper({ children, minWidth = 1024 }: DesktopOnlyWrapperProps) {
  const [isDesktop, setIsDesktop] = useState(true)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= minWidth)
    }

    // Initial check
    checkScreenSize()
    setIsLoading(false)

    // Listen for resize events
    window.addEventListener('resize', checkScreenSize)
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [minWidth])

  // Show nothing while loading to avoid flash
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    )
  }

  // Show mobile/tablet restriction message
  if (!isDesktop) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 flex items-center justify-center p-6">
        <div className="max-w-md w-full">
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
          </div>

          <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl text-center">
            {/* Icon */}
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>

            {/* Logo placeholder */}
            <h1 className="text-3xl font-bold text-white mb-2">
              NUAM Tax System
            </h1>
            
            <p className="text-indigo-200 text-lg mb-6">
              Sistema de Contenedor Tributario
            </p>

            {/* Message */}
            <div className="bg-white/5 rounded-2xl p-6 mb-6">
              <h2 className="text-xl font-semibold text-white mb-3">
                Accede desde un Computador
              </h2>
              <p className="text-indigo-100/80 text-sm leading-relaxed">
                Este sistema está diseñado para ofrecer la mejor experiencia en computadoras de escritorio o laptops.
                Para aprovechar todas las funcionalidades y trabajar de manera óptima, te recomendamos acceder desde un dispositivo con pantalla más grande.
              </p>
            </div>

            {/* Features list */}
            <div className="text-left space-y-3 mb-6">
              <div className="flex items-center gap-3 text-indigo-100/70 text-sm">
                <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span>Gestión completa de calificaciones tributarias</span>
              </div>
              <div className="flex items-center gap-3 text-indigo-100/70 text-sm">
                <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span>Importación masiva de datos</span>
              </div>
              <div className="flex items-center gap-3 text-indigo-100/70 text-sm">
                <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span>Reportes y análisis avanzados</span>
              </div>
            </div>

            {/* Minimum requirements */}
            <div className="pt-4 border-t border-white/10">
              <p className="text-xs text-indigo-200/50">
                Resolución mínima recomendada: 1024 × 768 px
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Desktop users see the normal app
  return <>{children}</>
}
