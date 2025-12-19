/**
 * Admin Stats Component
 * Displays comprehensive statistics dashboard for admin panel
 */

'use client'

import { UserGroupIcon, ShieldCheckIcon, ChartBarIcon, ClockIcon } from '@heroicons/react/24/outline'

interface AdminStatsProps {
  stats: {
    total: number
    active: number
    inactive: number
    byRole: Array<{ role: string; count: number }>
    recentLogins: Array<{
      id: string
      name: string
      email: string
      lastLoginAt: string
    }>
  } | null
  auditCount: number
}

export function AdminStats({ stats, auditCount }: AdminStatsProps) {
  if (!stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-4"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    )
  }

  const roleColors: Record<string, string> = {
    ADMIN: 'bg-purple-100 text-purple-800',
    MANAGER: 'bg-blue-100 text-blue-800',
    ACCOUNTANT: 'bg-green-100 text-green-800',
    AUDITOR: 'bg-yellow-100 text-yellow-800',
    VIEWER: 'bg-gray-100 text-gray-800',
  }

  const roleLabels: Record<string, string> = {
    ADMIN: 'Administradores',
    MANAGER: 'Gerentes',
    ACCOUNTANT: 'Contadores',
    AUDITOR: 'Auditores',
    VIEWER: 'Visores',
  }

  return (
    <>
      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Usuarios Totales</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stats.total.toLocaleString()}
              </p>
            </div>
            <UserGroupIcon className="w-12 h-12 text-nuam-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Usuarios Activos</p>
              <p className="text-3xl font-bold text-green-600 mt-2">
                {stats.active.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {((stats.active / stats.total) * 100).toFixed(1)}% del total
              </p>
            </div>
            <ShieldCheckIcon className="w-12 h-12 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Usuarios Inactivos</p>
              <p className="text-3xl font-bold text-red-600 mt-2">
                {stats.inactive.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {((stats.inactive / stats.total) * 100).toFixed(1)}% del total
              </p>
            </div>
            <ChartBarIcon className="w-12 h-12 text-red-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Eventos de Auditoría</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">
                {auditCount.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500 mt-1">Últimas 24 horas</p>
            </div>
            <ClockIcon className="w-12 h-12 text-blue-500" />
          </div>
        </div>
      </div>

      {/* Users by Role and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Users by Role */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Usuarios por Rol
          </h3>
          <div className="space-y-3">
            {stats.byRole.map((roleData) => (
              <div key={roleData.role} className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${roleColors[roleData.role]}`}>
                    {roleLabels[roleData.role] || roleData.role}
                  </span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-nuam-500 h-2 rounded-full transition-all"
                      style={{
                        width: `${(roleData.count / stats.total) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
                <span className="text-sm font-semibold text-gray-900 ml-3">
                  {roleData.count}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Logins */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Últimos Accesos
          </h3>
          <div className="space-y-3">
            {stats.recentLogins.length > 0 ? (
              stats.recentLogins.map((user) => (
                <div key={user.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-nuam-100 flex items-center justify-center">
                      <span className="text-nuam-700 font-semibold text-xs">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(user.lastLoginAt).toLocaleString('es-ES', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">
                No hay accesos recientes registrados
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
