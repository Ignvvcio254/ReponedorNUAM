'use client'

import TaxContainerDashboard from '@/components/tax-container/TaxContainerDashboard'

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-6 sm:py-8 lg:py-12">
        <TaxContainerDashboard />
      </div>
    </div>
  )
}