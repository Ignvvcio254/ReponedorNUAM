'use client'

import { useEffect, useState } from 'react'
import { Logo } from '@/components/ui/Logo'

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)
  const [isSliding, setIsSliding] = useState(false)

  useEffect(() => {
    // Simular carga y luego iniciar animación de salida
    const loadingTimer = setTimeout(() => {
      setIsLoading(false)
      setIsSliding(true)
      
      // Después de la animación, redirigir
      setTimeout(() => {
        window.location.href = '/dashboard'
      }, 600) // Tiempo para que complete la animación
    }, 1800) // Reducido un poco el tiempo de carga

    return () => clearTimeout(loadingTimer)
  }, [])

  return (
    <div className={`min-h-screen flex items-center justify-center bg-white transition-all duration-600 ease-in-out ${
      isSliding ? 'transform -translate-y-full opacity-0' : 'transform translate-y-0 opacity-100'
    }`}>
      <div className={`transition-all duration-500 ease-in-out ${
        isLoading ? 'transform scale-100 opacity-100' : 'transform scale-105 opacity-95'
      }`}>
        <div className="flex justify-center">
          <div className={`transition-all duration-500 ease-in-out ${
            isLoading ? 'transform scale-100' : 'transform scale-105'
          }`}>
            <Logo size="3xl" showText={false} />
          </div>
        </div>
      </div>
    </div>
  )
}
