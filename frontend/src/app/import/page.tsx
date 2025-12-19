'use client'

import { Button } from '@/components/ui/Button'
import { BulkImport } from '@/components/forms/BulkImport'
import { useToast } from '@/components/ui/ToastContainer'

export default function ImportPage() {
  const toast = useToast()
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Importación Masiva</h1>
            <p className="mt-2 text-gray-600">
              Carga archivos CSV con calificaciones tributarias de forma masiva
            </p>
          </div>
          <div className="flex space-x-3">
            <Button 
              variant="secondary" 
              size="sm"
              onClick={() => window.location.href = '/qualifications'}
            >
              Ver Calificaciones
            </Button>
            <Button 
              variant="secondary" 
              size="sm"
              onClick={() => window.location.href = '/dashboard'}
            >
              Dashboard
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <BulkImport
        onSuccess={() => {
          toast.success('Importación completada exitosamente')
          // Opcional: redirigir a la lista de calificaciones
          // window.location.href = '/qualifications'
        }}
      />
    </div>
  )
}
