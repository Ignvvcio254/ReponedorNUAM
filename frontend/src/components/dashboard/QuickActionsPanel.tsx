'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

interface RecentActivityItem {
  id: string
  action: string
  entityType: string
  entityId: string
  createdAt: string
  userName: string
  description: string
}

interface QuickActionsPanelProps {
  recentActivity?: RecentActivityItem[]
}

// Helper function to get relative time
function getRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)
  
  if (diffMins < 1) return 'ahora'
  if (diffMins < 60) return `hace ${diffMins}m`
  if (diffHours < 24) return `hace ${diffHours}h`
  if (diffDays < 7) return `hace ${diffDays}d`
  return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })
}

// Helper function to get activity color and icon based on action type
function getActivityStyle(action: string): { gradient: string; icon: React.ReactNode; label: string } {
  switch (action) {
    case 'CREATE':
      return {
        gradient: 'from-green-400 to-emerald-500',
        icon: <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>,
        label: 'Creado'
      }
    case 'APPROVE':
      return {
        gradient: 'from-green-500 to-teal-500',
        icon: <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>,
        label: 'Aprobado'
      }
    case 'UPDATE':
      return {
        gradient: 'from-blue-400 to-indigo-500',
        icon: <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>,
        label: 'Actualizado'
      }
    case 'DELETE':
      return {
        gradient: 'from-red-400 to-rose-500',
        icon: <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>,
        label: 'Eliminado'
      }
    case 'REJECT':
      return {
        gradient: 'from-orange-400 to-amber-500',
        icon: <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>,
        label: 'Rechazado'
      }
    case 'SUBMIT':
      return {
        gradient: 'from-purple-400 to-violet-500',
        icon: <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>,
        label: 'Enviado'
      }
    default:
      return {
        gradient: 'from-gray-400 to-gray-500',
        icon: <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
        label: 'Acción'
      }
  }
}

// Animated Action Card Component
function ActionCard({ 
  action, 
  index,
  isExpanded
}: { 
  action: {
    title: string
    description: string
    href: string
    icon: React.ReactNode
    gradient: string
  }
  index: number
  isExpanded: boolean
}) {
  const [isHovered, setIsHovered] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), index * 100)
    return () => clearTimeout(timer)
  }, [index])

  return (
    <Link href={action.href} className="block">
      <div 
        className={`relative overflow-hidden rounded-2xl transition-all duration-500 transform cursor-pointer ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        } ${isHovered ? 'scale-[1.03] shadow-2xl' : 'shadow-lg'}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Gradient background */}
        <div className={`absolute inset-0 bg-gradient-to-br ${action.gradient} transition-all duration-500`} />
        
        {/* Animated gradient overlay */}
        <div 
          className={`absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transition-all duration-700 ${
            isHovered ? 'translate-x-full' : '-translate-x-full'
          }`}
        />
        
        {/* Decorative circles */}
        <div className="absolute -top-4 -right-4 w-20 h-20 bg-white/10 rounded-full blur-xl" />
        <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
        
        {/* Content */}
        <div className="relative p-5">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center transition-transform duration-300 ${
              isHovered ? 'scale-110 rotate-3' : ''
            }`}>
              <div className="text-white">
                {action.icon}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-white text-base">
                {action.title}
              </p>
              <p className="text-white/80 text-sm truncate">
                {action.description}
              </p>
            </div>
            <div className={`w-8 h-8 rounded-full bg-white/20 flex items-center justify-center transition-all duration-300 ${
              isHovered ? 'translate-x-1' : ''
            }`}>
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

// Activity Timeline Item
function ActivityTimelineItem({ 
  activity, 
  index,
  isLast
}: { 
  activity: RecentActivityItem
  index: number
  isLast: boolean
}) {
  const [isVisible, setIsVisible] = useState(false)
  const style = getActivityStyle(activity.action)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 200 + index * 100)
    return () => clearTimeout(timer)
  }, [index])

  return (
    <div 
      className={`flex gap-3 transition-all duration-500 ${
        isVisible ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'
      }`}
    >
      {/* Timeline dot and line */}
      <div className="flex flex-col items-center">
        <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${style.gradient} flex items-center justify-center text-white shadow-lg`}>
          {style.icon}
        </div>
        {!isLast && (
          <div className="w-0.5 flex-1 bg-gradient-to-b from-gray-200 to-transparent my-1" />
        )}
      </div>
      
      {/* Content */}
      <div className="flex-1 pb-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {activity.description}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              {activity.userName}
            </p>
          </div>
          <span className="text-xs text-gray-400 whitespace-nowrap bg-gray-50 px-2 py-1 rounded-full">
            {getRelativeTime(activity.createdAt)}
          </span>
        </div>
      </div>
    </div>
  )
}

export default function QuickActionsPanel({ recentActivity }: QuickActionsPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [showAllActivity, setShowAllActivity] = useState(false)

  const quickActions = [
    {
      title: 'Nueva Calificación',
      description: 'Crear una nueva calificación tributaria',
      href: '/qualifications',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      gradient: 'from-blue-500 via-blue-600 to-indigo-600'
    },
    {
      title: 'Nueva Entidad',
      description: 'Registrar una nueva entidad tributaria',
      href: '/tax-entities',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      gradient: 'from-emerald-500 via-green-500 to-teal-600'
    },
    {
      title: 'Importar Datos',
      description: 'Importación masiva de archivos CSV/Excel',
      href: '/import',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
      ),
      gradient: 'from-purple-500 via-violet-500 to-indigo-600'
    },
    {
      title: 'Generar Reporte',
      description: 'Crear reportes personalizados',
      href: '/reports',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      gradient: 'from-orange-500 via-amber-500 to-yellow-500'
    }
  ]

  // Default placeholder activity for when no real data is available
  const defaultActivity: RecentActivityItem[] = [
    { id: '1', action: 'CREATE', entityType: 'qualification', entityId: '', createdAt: new Date(Date.now() - 7200000).toISOString(), userName: 'Sistema', description: 'Se creó una nueva calificación tributaria' },
    { id: '2', action: 'UPDATE', entityType: 'tax_entity', entityId: '', createdAt: new Date(Date.now() - 14400000).toISOString(), userName: 'Sistema', description: 'Se actualizó información de entidad' },
    { id: '3', action: 'APPROVE', entityType: 'qualification', entityId: '', createdAt: new Date(Date.now() - 28800000).toISOString(), userName: 'Sistema', description: 'Calificación aprobada exitosamente' },
    { id: '4', action: 'CREATE', entityType: 'import_batch', entityId: '', createdAt: new Date(Date.now() - 86400000).toISOString(), userName: 'Sistema', description: 'Se completó una importación masiva' },
  ]

  // Filter out login/logout activities for dashboard (show only tax-related)
  const TAX_RELATED_ACTIONS = ['CREATE', 'UPDATE', 'DELETE', 'APPROVE', 'REJECT', 'SUBMIT', 'IMPORT', 'EXPORT']
  const filteredActivity = recentActivity
    ? recentActivity.filter(activity => TAX_RELATED_ACTIONS.includes(activity.action))
    : []

  const activityToShow = filteredActivity.length > 0 ? filteredActivity : defaultActivity
  const displayedActivity = showAllActivity ? activityToShow : activityToShow.slice(0, 4)

  return (
    <div className="relative overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-br from-green-500/5 to-teal-500/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
      
      <div className="relative p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">
                Acciones Rápidas
              </h3>
              <p className="text-sm text-gray-500">Accede a las funciones más utilizadas</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="gap-2 rounded-xl border-gray-200 hover:bg-gray-50 transition-all duration-300"
          >
            {isExpanded ? (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                Mostrar menos
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
                Ver todo
              </>
            )}
          </Button>
        </div>

        {/* Quick Action Cards */}
        <div className={`grid grid-cols-1 sm:grid-cols-2 ${isExpanded ? 'lg:grid-cols-4' : 'lg:grid-cols-2'} gap-4 transition-all duration-500`}>
          {quickActions.slice(0, isExpanded ? 4 : 2).map((action, index) => (
            <ActionCard 
              key={action.title}
              action={action} 
              index={index}
              isExpanded={isExpanded}
            />
          ))}
        </div>

        {/* Recent Activity Section */}
        <div className="mt-8 pt-6 border-t border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="text-sm font-semibold text-gray-800">
                Actividad Reciente
              </h4>
              {recentActivity && recentActivity.length > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 text-xs font-medium">
                  En vivo
                </span>
              )}
            </div>
            {activityToShow.length > 4 && (
              <button
                onClick={() => setShowAllActivity(!showAllActivity)}
                className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1 transition-colors"
              >
                {showAllActivity ? 'Mostrar menos' : `Ver todas (${activityToShow.length})`}
                <svg 
                  className={`w-4 h-4 transition-transform duration-300 ${showAllActivity ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            )}
          </div>

          {/* Activity Timeline */}
          <div className="space-y-0">
            {displayedActivity.map((activity, index) => (
              <ActivityTimelineItem
                key={activity.id}
                activity={activity}
                index={index}
                isLast={index === displayedActivity.length - 1}
              />
            ))}
          </div>

          {/* Empty state with placeholder */}
          {(!recentActivity || recentActivity.length === 0) && (
            <div className="flex items-center justify-center gap-2 py-2">
              <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
              <p className="text-xs text-gray-400 italic">
                Sincronizando actividad del sistema...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}