'use client'

import { useEffect } from 'react'
import { Logo } from '@/components/ui/Logo'

export default function Home() {
  useEffect(() => {
    // Redirigir al dashboard después de mostrar la página de bienvenida
    const timer = setTimeout(() => {
      window.location.href = '/dashboard'
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="mb-8 flex justify-center">
          <Logo size="xl" showText={false} />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Bienvenido a NUAM
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Sistema de Calificaciones Tributarias
        </p>
        <div className="flex items-center justify-center space-x-2">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-nuam-500"></div>
          <span className="text-gray-600">Cargando dashboard...</span>
        </div>
      </div>
    </div>
  )
}
