/**
 * Admin Stats Component
 * Modern statistics dashboard for admin panel with animations
 */

'use client'

import { useState, useEffect } from 'react'
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

// Animated Counter Hook
function useAnimatedCounter(end: number, duration: number = 1000) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (end === 0) return setCount(0)
    
    let startTime: number
    let animationFrame: number

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      setCount(Math.floor(easeOutQuart * end))
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrame)
  }, [end, duration])

  return count
}

// Stat Card Component
function StatCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  gradient, 
  textColor,
  delay = 0 
}: {
  title: string
  value: number
  subtitle?: string
  icon: React.ComponentType<{ className?: string }>
  gradient: string
  textColor: string
  delay?: number
}) {
  const [isVisible, setIsVisible] = useState(false)
  const animatedValue = useAnimatedCounter(value, 1200)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay)
    return () => clearTimeout(timer)
  }, [delay])

  return (
    <div 
      className={`relative overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
      }`}
    >
      {/* Gradient decoration */}
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${gradient} opacity-10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2`} />
      
      <div className="relative p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className={`text-3xl font-bold mt-2 ${textColor}`}>
              {animatedValue.toLocaleString()}
            </p>
            {subtitle && (
              <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
            )}
          </div>
          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg`}>
            <Icon className="w-7 h-7 text-white" />
          </div>
        </div>
      </div>
    </div>
  )
}

// Progress Bar Component
function AnimatedProgressBar({ value, max, gradient }: { value: number; max: number; gradient: string }) {
  const [width, setWidth] = useState(0)
  const percentage = max > 0 ? (value / max) * 100 : 0

  useEffect(() => {
    const timer = setTimeout(() => setWidth(percentage), 300)
    return () => clearTimeout(timer)
  }, [percentage])

  return (
    <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
      <div 
        className={`h-full rounded-full bg-gradient-to-r ${gradient} transition-all duration-1000 ease-out`}
        style={{ width: `${width}%` }}
      />
    </div>
  )
}

export function AdminStats({ stats, auditCount }: AdminStatsProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  if (!stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="relative overflow-hidden rounded-2xl bg-white border border-gray-100 p-6 shadow-lg">
            <div className="animate-pulse">
              <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-100 rounded-full w-3/4 mb-3" />
              <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-100 rounded-lg w-1/2 mb-2" />
              <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-100 rounded-full w-full" />
            </div>
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-50 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 animate-pulse" />
          </div>
        ))}
      </div>
    )
  }

  const roleConfig: Record<string, { label: string; gradient: string; textColor: string }> = {
    ADMIN: { label: 'Administradores', gradient: 'from-purple-400 to-violet-500', textColor: 'text-purple-700' },
    MANAGER: { label: 'Gerentes', gradient: 'from-blue-400 to-indigo-500', textColor: 'text-blue-700' },
    ACCOUNTANT: { label: 'Contadores', gradient: 'from-green-400 to-emerald-500', textColor: 'text-green-700' },
    AUDITOR: { label: 'Auditores', gradient: 'from-yellow-400 to-amber-500', textColor: 'text-yellow-700' },
    VIEWER: { label: 'Visores', gradient: 'from-gray-400 to-gray-500', textColor: 'text-gray-700' },
  }

  return (
    <>
      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Usuarios Totales"
          value={stats.total}
          icon={UserGroupIcon}
          gradient="from-blue-400 to-indigo-500"
          textColor="text-gray-900"
          delay={0}
        />
        <StatCard
          title="Usuarios Activos"
          value={stats.active}
          subtitle={`${((stats.active / stats.total) * 100).toFixed(1)}% del total`}
          icon={ShieldCheckIcon}
          gradient="from-green-400 to-emerald-500"
          textColor="text-green-600"
          delay={100}
        />
        <StatCard
          title="Usuarios Inactivos"
          value={stats.inactive}
          subtitle={`${((stats.inactive / stats.total) * 100).toFixed(1)}% del total`}
          icon={ChartBarIcon}
          gradient="from-red-400 to-rose-500"
          textColor="text-red-600"
          delay={200}
        />
        <StatCard
          title="Eventos de Auditoría"
          value={auditCount}
          subtitle="Últimas 24 horas"
          icon={ClockIcon}
          gradient="from-purple-400 to-violet-500"
          textColor="text-purple-600"
          delay={300}
        />
      </div>

      {/* Users by Role and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Users by Role */}
        <div className={`relative overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-lg transition-all duration-500 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
          <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-purple-500/5 to-pink-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          
          <div className="relative p-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-violet-500 flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900">Usuarios por Rol</h3>
            </div>
            
            <div className="space-y-4">
              {stats.byRole.map((roleData, index) => {
                const config = roleConfig[roleData.role] || { label: roleData.role, gradient: 'from-gray-400 to-gray-500', textColor: 'text-gray-700' }
                return (
                  <div key={roleData.role} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className={`text-sm font-medium ${config.textColor}`}>
                        {config.label}
                      </span>
                      <span className="text-sm font-bold text-gray-900">
                        {roleData.count}
                      </span>
                    </div>
                    <AnimatedProgressBar 
                      value={roleData.count} 
                      max={stats.total} 
                      gradient={config.gradient}
                    />
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Recent Logins */}
        <div className={`relative overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-lg transition-all duration-500 delay-400 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
          <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          
          <div className="relative p-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900">Últimos Accesos</h3>
            </div>
            
            <div className="space-y-3">
              {stats.recentLogins.length > 0 ? (
                stats.recentLogins.map((user, index) => (
                  <div 
                    key={user.id} 
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center shadow-sm">
                        <span className="text-white font-bold text-sm">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-lg">
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
                <div className="text-center py-8">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gray-100 flex items-center justify-center">
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-sm text-gray-500">No hay accesos recientes registrados</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
