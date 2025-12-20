'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { BulkImport } from '@/components/forms/BulkImport'
import { useToast } from '@/components/ui/ToastContainer'

export default function ImportPage() {
  const toast = useToast()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className={`mb-8 transition-all duration-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent">
                Importación Masiva
              </h1>
              <p className="mt-2 text-gray-500">
                Carga archivos CSV con calificaciones tributarias de forma masiva
              </p>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => window.location.href = '/qualifications'}
                className="flex items-center gap-2 px-4 py-2.5 text-gray-700 font-medium bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Ver Calificaciones
              </button>
              <button 
                onClick={() => window.location.href = '/dashboard'}
                className="flex items-center gap-2 px-4 py-2.5 text-white font-medium bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
                Dashboard
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <BulkImport
          onSuccess={() => {
            toast.success('Importación completada exitosamente')
          }}
        />
      </div>
    </div>
  )
}
