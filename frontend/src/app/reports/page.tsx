import { Suspense } from 'react'
import { ArrowPathIcon } from '@heroicons/react/24/outline'
import { ReportsContent } from './ReportsContent'

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <ArrowPathIcon className="w-12 h-12 text-nuam-600 animate-spin mx-auto mb-4" />
        <p className="text-gray-600">Cargando reportes...</p>
      </div>
    </div>
  )
}

export default function ReportsPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ReportsContent />
    </Suspense>
  )
}
