'use client'

import { useState, useEffect } from 'react'

interface ActivityLog {
  id: string
  action: string
  entityType: string
  entityId: string
  createdAt: string
  userId: string
  description?: string
  metadata?: any
  user?: {
    id: string
    name: string
    email: string
  }
}

interface AdminActivityHistoryProps {
  initialLogs?: ActivityLog[]
}

// Helper function
function getRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)
  
  if (diffMins < 1) return 'ahora mismo'
  if (diffMins < 60) return `hace ${diffMins} min`
  if (diffHours < 24) return `hace ${diffHours}h`
  if (diffDays < 7) return `hace ${diffDays} días`
  return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
}

function getActionConfig(action: string): { icon: React.ReactNode; gradient: string; label: string; textColor: string } {
  switch (action) {
    case 'LOGIN':
      return {
        gradient: 'from-green-400 to-emerald-500',
        textColor: 'text-green-700',
        icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" /></svg>,
        label: 'Inició sesión'
      }
    case 'LOGOUT':
      return {
        gradient: 'from-gray-400 to-slate-500',
        textColor: 'text-gray-700',
        icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>,
        label: 'Cerró sesión'
      }
    case 'FAILED_LOGIN':
      return {
        gradient: 'from-red-400 to-rose-500',
        textColor: 'text-red-700',
        icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>,
        label: 'Intento fallido'
      }
    case 'CREATE':
      return {
        gradient: 'from-blue-400 to-indigo-500',
        textColor: 'text-blue-700',
        icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>,
        label: 'Creó'
      }
    case 'UPDATE':
      return {
        gradient: 'from-amber-400 to-orange-500',
        textColor: 'text-amber-700',
        icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>,
        label: 'Actualizó'
      }
    case 'DELETE':
      return {
        gradient: 'from-red-400 to-rose-500',
        textColor: 'text-red-700',
        icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>,
        label: 'Eliminó'
      }
    case 'APPROVE':
      return {
        gradient: 'from-green-400 to-teal-500',
        textColor: 'text-green-700',
        icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>,
        label: 'Aprobó'
      }
    case 'REJECT':
      return {
        gradient: 'from-orange-400 to-amber-500',
        textColor: 'text-orange-700',
        icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>,
        label: 'Rechazó'
      }
    case 'EXPORT':
      return {
        gradient: 'from-purple-400 to-violet-500',
        textColor: 'text-purple-700',
        icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>,
        label: 'Exportó'
      }
    case 'IMPORT':
      return {
        gradient: 'from-teal-400 to-cyan-500',
        textColor: 'text-teal-700',
        icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4-4v12" /></svg>,
        label: 'Importó'
      }
    default:
      return {
        gradient: 'from-gray-400 to-gray-500',
        textColor: 'text-gray-700',
        icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
        label: 'Acción'
      }
  }
}

function getEntityLabel(entityType: string): string {
  const labels: Record<string, string> = {
    qualification: 'calificación',
    tax_entity: 'entidad tributaria',
    import_batch: 'importación',
    user: 'usuario',
    session: 'sesión',
    report: 'reporte',
    export: 'exportación'
  }
  return labels[entityType] || entityType
}

function formatDescription(log: ActivityLog): string {
  const userName = log.user?.name || 'Usuario'
  const config = getActionConfig(log.action)
  const entity = getEntityLabel(log.entityType)
  
  if (log.action === 'LOGIN') return `${userName} inició sesión`
  if (log.action === 'LOGOUT') return `${userName} cerró sesión`
  if (log.action === 'FAILED_LOGIN') return `Intento de login fallido para ${log.metadata?.email || 'email desconocido'}`
  
  return log.description || `${userName} ${config.label.toLowerCase()} una ${entity}`
}

export default function AdminActivityHistory({ initialLogs = [] }: AdminActivityHistoryProps) {
  const [logs, setLogs] = useState<ActivityLog[]>(initialLogs)
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'auth' | 'tax'>('all')
  const [limit, setLimit] = useState(20)

  useEffect(() => {
    fetchLogs()
  }, [filter, limit])

  const fetchLogs = async () => {
    try {
      setIsLoading(true)
      const params = new URLSearchParams({ limit: limit.toString() })
      if (filter === 'auth') {
        params.set('action', 'LOGIN,LOGOUT,FAILED_LOGIN')
      } else if (filter === 'tax') {
        params.set('action', 'CREATE,UPDATE,DELETE,APPROVE,REJECT,IMPORT,EXPORT')
      }
      
      const response = await fetch(`/api/audit-logs?${params}`)
      const result = await response.json()
      
      if (result.success && result.data?.data) {
        setLogs(result.data.data)
      }
    } catch (error) {
      console.error('Error fetching logs:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredLogs = logs

  return (
    <div className="relative overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-lg">
      {/* Decorative */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      
      <div className="relative p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">Historial de Actividad</h3>
              <p className="text-sm text-gray-500">Registro completo de acciones del sistema</p>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-2 bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filter === 'all'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Todo
            </button>
            <button
              onClick={() => setFilter('auth')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filter === 'auth'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Sesiones
            </button>
            <button
              onClick={() => setFilter('tax')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filter === 'tax'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Tributario
            </button>
          </div>
        </div>

        {/* Activity List */}
        {isLoading ? (
          <div className="space-y-3">
            {[1,2,3,4].map(i => (
              <div key={i} className="animate-pulse flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                <div className="w-10 h-10 bg-gray-200 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-100 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredLogs.map((log, index) => {
              const config = getActionConfig(log.action)
              const date = new Date(log.createdAt)
              
              return (
                <div
                  key={log.id}
                  className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Icon */}
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br ${config.gradient} flex items-center justify-center text-white shadow-lg`}>
                    {config.icon}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {formatDescription(log)}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${config.textColor} bg-white border`}>
                        {config.label}
                      </span>
                      <span className="text-xs text-gray-400">
                        {log.user?.email || ''}
                      </span>
                    </div>
                  </div>

                  {/* Timestamp */}
                  <div className="flex-shrink-0 text-right">
                    <p className="text-xs text-gray-500">
                      {date.toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: 'short'
                      })}
                    </p>
                    <p className="text-xs text-gray-400">
                      {date.toLocaleTimeString('es-ES', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              )
            })}

            {filteredLogs.length === 0 && (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-3">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <p className="text-gray-500">No hay actividad registrada</p>
              </div>
            )}
          </div>
        )}

        {/* Load More */}
        {filteredLogs.length >= limit && (
          <div className="mt-4 text-center">
            <button
              onClick={() => setLimit(prev => prev + 20)}
              className="px-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors"
            >
              Cargar más actividad
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
