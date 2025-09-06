'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

export default function QuickActionsPanel() {
  const [isExpanded, setIsExpanded] = useState(false)

  const quickActions = [
    {
      title: 'Nueva Calificación',
      description: 'Crear una nueva calificación tributaria',
      href: '/qualifications',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      color: 'bg-blue-500 hover:bg-blue-600',
      textColor: 'text-white'
    },
    {
      title: 'Nueva Entidad',
      description: 'Registrar una nueva entidad tributaria',
      href: '/tax-entities',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      color: 'bg-green-500 hover:bg-green-600',
      textColor: 'text-white'
    },
    {
      title: 'Importar Datos',
      description: 'Importación masiva de archivos CSV/Excel',
      href: '/import',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
      ),
      color: 'bg-purple-500 hover:bg-purple-600',
      textColor: 'text-white'
    },
    {
      title: 'Generar Reporte',
      description: 'Crear reportes personalizados',
      href: '/reports',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      color: 'bg-orange-500 hover:bg-orange-600',
      textColor: 'text-white'
    }
  ]

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Acciones Rápidas
        </h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs"
        >
          {isExpanded ? 'Ocultar' : 'Ver más'}
        </Button>
      </div>

      <div className={`grid grid-cols-1 sm:grid-cols-2 ${isExpanded ? 'lg:grid-cols-4' : 'lg:grid-cols-2'} gap-4`}>
        {quickActions.slice(0, isExpanded ? 4 : 2).map((action, index) => (
          <Link key={index} href={action.href} className="block">
            <div className={`${action.color} ${action.textColor} p-4 rounded-lg transition-all duration-200 transform hover:scale-105 hover:shadow-lg cursor-pointer`}>
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  {action.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-sm">
                    {action.title}
                  </p>
                  <p className="text-xs opacity-90 truncate">
                    {action.description}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Activity Section */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-900 mb-3">
          Actividad Reciente
        </h4>
        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-600">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
            <span>Calificación aprobada para Minera Los Andes</span>
            <span className="ml-auto text-xs text-gray-400">hace 2h</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
            <span>Nueva entidad registrada: ConsulMex</span>
            <span className="ml-auto text-xs text-gray-400">hace 4h</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <div className="w-2 h-2 bg-purple-400 rounded-full mr-2"></div>
            <span>Importación completada: 2,487 registros</span>
            <span className="ml-auto text-xs text-gray-400">hace 1d</span>
          </div>
        </div>
      </div>
    </Card>
  )
}