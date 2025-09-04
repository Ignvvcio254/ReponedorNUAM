'use client'

import { Button } from '@/components/ui/Button'
import { BulkImport } from '@/components/forms/BulkImport'

export default function ImportPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="nuam-gradient shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-white">Importación Masiva</h1>
            </div>
            <div className="flex space-x-2">
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
      </header>

      {/* Main Content */}
      <main className="py-8">
        <BulkImport 
          onSuccess={() => {
            alert('Importación completada exitosamente')
            // Opcional: redirigir a la lista de calificaciones
            // window.location.href = '/qualifications'
          }} 
        />
      </main>
    </div>
  )
}
