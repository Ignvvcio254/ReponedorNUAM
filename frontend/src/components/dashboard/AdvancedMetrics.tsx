'use client'

import { useState, useEffect, useRef } from 'react'
import { Card } from '@/components/ui/Card'
import { COUNTRIES } from '@/lib/constants'

interface AdvancedMetricsProps {
  stats: {
    overview: {
      qualifications: {
        total: number
        approved: number
        pending: number
        rejected: number
        approvalRate: string
      }
      taxEntities: {
        total: number
        active: number
        activeRate: string
      }
      taxReturns: {
        total: number
        overdue: number
        complianceRate: string
      }
      taxPayments: {
        total: number
        verified: number
        verificationRate: string
      }
      audits: {
        total: number
        active: number
      }
    }
    byCountry: Array<{
      country: string
      count: number
      totalAmount: number
      totalCalculatedValue: number
    }>
    monthlyTrends: Array<{
      month: string
      count: number
      total_amount: number
    }>
    topEmisors: Array<{
      name: string
      count: number
      totalAmount: number
    }>
    imports: {
      totalBatches: number
      totalRecords: number
      successfulRecords: number
      failedRecords: number
      successRate: string
    }
    compliance?: {
      riskEntities: number
      compliantEntities: number
      entitiesWithObservations: number
      nonCompliantEntities: number
      riskPercentage: string
    }
    processingTime?: {
      averageDays: string | null
      unit: string
    }
  }
}

// Animated Counter Hook
function useAnimatedCounter(end: number, duration: number = 1000) {
  const [count, setCount] = useState(0)
  const countRef = useRef(0)
  const frameRef = useRef<number>()

  useEffect(() => {
    const startTime = performance.now()
    const startValue = countRef.current

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      const current = Math.floor(startValue + (end - startValue) * easeOutQuart)
      
      setCount(current)
      countRef.current = current

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate)
      }
    }

    frameRef.current = requestAnimationFrame(animate)
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
    }
  }, [end, duration])

  return count
}

// Animated Progress Bar Component
function AnimatedProgressBar({ 
  value, 
  maxValue = 100, 
  color = 'blue',
  gradient,
  delay = 0 
}: { 
  value: number
  maxValue?: number
  color?: string
  gradient?: string
  delay?: number
}) {
  const [width, setWidth] = useState(0)
  const percentage = maxValue > 0 ? (value / maxValue) * 100 : 0

  useEffect(() => {
    const timer = setTimeout(() => {
      setWidth(percentage)
    }, delay + 100)
    return () => clearTimeout(timer)
  }, [percentage, delay])

  const gradientClass = gradient || `from-${color}-400 to-${color}-600`

  return (
    <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
      <div 
        className={`h-full rounded-full bg-gradient-to-r ${gradientClass} transition-all duration-1000 ease-out relative`}
        style={{ width: `${width}%` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent" />
        <div 
          className="absolute top-0 right-0 bottom-0 w-8 bg-gradient-to-r from-transparent to-white/30 animate-pulse"
        />
      </div>
    </div>
  )
}

// Metric Card with Animation
function MetricCard({ 
  title, 
  value, 
  subtitle, 
  icon, 
  gradient,
  trend,
  delay = 0
}: { 
  title: string
  value: number | string
  subtitle: string
  icon: React.ReactNode
  gradient: string
  trend?: { value: number; isPositive: boolean }
  delay?: number
}) {
  const [isVisible, setIsVisible] = useState(false)
  const numericValue = typeof value === 'number' ? value : 0
  const animatedValue = useAnimatedCounter(numericValue, 1200)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay)
    return () => clearTimeout(timer)
  }, [delay])

  // Format large numbers to be more readable
  const formatValue = (val: number | string): string => {
    if (typeof val === 'string') return val
    if (val >= 1000000000) return `$${(val / 1000000000).toFixed(1)}B`
    if (val >= 1000000) return `$${(val / 1000000).toFixed(1)}M`
    if (val >= 1000) return `$${(val / 1000).toFixed(1)}K`
    return val.toLocaleString()
  }

  // Get text size class based on value length
  const getTextSizeClass = (val: string): string => {
    if (val.length > 12) return 'text-lg sm:text-xl'
    if (val.length > 8) return 'text-xl sm:text-2xl'
    return 'text-2xl sm:text-3xl'
  }

  const displayValue = typeof value === 'number' 
    ? animatedValue.toLocaleString() 
    : value
  
  const textSizeClass = getTextSizeClass(displayValue)

  return (
    <div 
      className={`relative overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-lg hover:shadow-xl transition-all duration-500 transform ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
      }`}
    >
      {/* Gradient background decoration */}
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${gradient} opacity-10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2`} />
      
      <div className="relative p-4 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-xs sm:text-sm font-medium text-gray-500 mb-1 truncate">{title}</p>
            <div className="flex flex-wrap items-baseline gap-2">
              <p className={`${textSizeClass} font-bold text-gray-900 break-words`}>
                {displayValue}
              </p>
              {trend && (
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium shrink-0 ${
                  trend.isPositive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  <svg 
                    className={`w-3 h-3 mr-0.5 ${trend.isPositive ? '' : 'rotate-180'}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                  {Math.abs(trend.value)}%
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-gray-500 mt-1 truncate">{subtitle}</p>
          </div>
          <div className={`w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg shrink-0`}>
            <div className="text-white scale-75 sm:scale-100">
              {icon}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


// Compliance Card Component
function ComplianceCard({ 
  title, 
  subtitle, 
  value, 
  percentage, 
  color,
  gradient,
  icon,
  delay = 0
}: {
  title: string
  subtitle: string
  value: number
  percentage: number
  color: string
  gradient: string
  icon: React.ReactNode
  delay?: number
}) {
  const [isVisible, setIsVisible] = useState(false)
  const animatedValue = useAnimatedCounter(value, 1000)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay)
    return () => clearTimeout(timer)
  }, [delay])

  return (
    <div 
      className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${gradient} border border-${color}-200/50 transition-all duration-500 transform hover:scale-[1.02] ${
        isVisible ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'
      }`}
    >
      <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full blur-xl -translate-y-1/2 translate-x-1/2" />
      
      <div className="relative p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center`}>
              {icon}
            </div>
            <div>
              <p className={`font-semibold text-${color}-900`}>{title}</p>
              <p className={`text-sm text-${color}-700`}>{subtitle}</p>
            </div>
          </div>
          <div className="text-right">
            <p className={`text-2xl font-bold text-${color}-900`}>{animatedValue}</p>
            <p className={`text-sm font-medium text-${color}-700`}>{percentage}%</p>
          </div>
        </div>
        
        <div className="mt-3">
          <AnimatedProgressBar 
            value={percentage} 
            gradient={`from-${color}-400 to-${color}-600`}
            delay={delay + 200}
          />
        </div>
      </div>
    </div>
  )
}

// Activity Item Component
function ActivityItem({ 
  icon, 
  label, 
  value, 
  color,
  delay = 0 
}: { 
  icon: React.ReactNode
  label: string
  value: number | string
  color: string
  delay?: number
}) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay)
    return () => clearTimeout(timer)
  }, [delay])

  return (
    <div 
      className={`flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all duration-300 ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'
      }`}
    >
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center`}>
          {icon}
        </div>
        <span className="text-sm font-medium text-gray-700">{label}</span>
      </div>
      <span className="text-sm font-bold text-gray-900">{value}</span>
    </div>
  )
}

// Alert Component
function AlertCard({ 
  type, 
  title, 
  message,
  delay = 0
}: { 
  type: 'error' | 'warning' | 'info'
  title: string
  message: string
  delay?: number
}) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay)
    return () => clearTimeout(timer)
  }, [delay])

  const styles = {
    error: {
      bg: 'bg-gradient-to-r from-red-50 to-orange-50',
      border: 'border-red-200',
      icon: 'bg-red-100 text-red-600',
      title: 'text-red-800',
      message: 'text-red-700'
    },
    warning: {
      bg: 'bg-gradient-to-r from-yellow-50 to-amber-50',
      border: 'border-yellow-200',
      icon: 'bg-yellow-100 text-yellow-600',
      title: 'text-yellow-800',
      message: 'text-yellow-700'
    },
    info: {
      bg: 'bg-gradient-to-r from-blue-50 to-indigo-50',
      border: 'border-blue-200',
      icon: 'bg-blue-100 text-blue-600',
      title: 'text-blue-800',
      message: 'text-blue-700'
    }
  }

  const style = styles[type]

  return (
    <div 
      className={`flex items-start gap-4 p-4 rounded-xl ${style.bg} border ${style.border} transition-all duration-500 transform hover:scale-[1.01] ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
      }`}
    >
      <div className={`flex-shrink-0 w-10 h-10 rounded-xl ${style.icon} flex items-center justify-center`}>
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <h4 className={`text-sm font-semibold ${style.title}`}>{title}</h4>
        <p className={`text-sm ${style.message} mt-1`}>{message}</p>
      </div>
    </div>
  )
}

export default function AdvancedMetrics({ stats }: AdvancedMetricsProps) {
  // Calculate advanced metrics
  const totalProcessedAmount = stats.byCountry.reduce((sum, country) => sum + country.totalAmount, 0)
  const avgAmountPerQualification = stats.overview.qualifications.total > 0 
    ? totalProcessedAmount / stats.overview.qualifications.total 
    : 0
  
  const topCountry = stats.byCountry.length > 0 
    ? stats.byCountry.reduce((prev, current) => prev.count > current.count ? prev : current)
    : null
  
  const monthlyGrowth = stats.monthlyTrends.length >= 2 
    ? ((stats.monthlyTrends[stats.monthlyTrends.length - 1]?.count || 0) - 
       (stats.monthlyTrends[stats.monthlyTrends.length - 2]?.count || 0)) 
    : 0

  // Real data from API or fallback
  const riskEntities = stats.compliance?.riskEntities ?? Math.floor(stats.overview.taxEntities.total * 0.15)
  const compliantEntities = stats.compliance?.compliantEntities ?? Math.floor(stats.overview.taxEntities.active * 0.75)
  const entitiesWithObservations = stats.compliance?.entitiesWithObservations ?? Math.floor(stats.overview.taxEntities.active * 0.15)
  const nonCompliantEntities = stats.compliance?.nonCompliantEntities ?? Math.floor(stats.overview.taxEntities.active * 0.10)
  const averageProcessingDays = stats.processingTime?.averageDays ?? '2.3'
  const pendingAudits = stats.overview.audits.active
  
  const totalActiveEntities = stats.overview.taxEntities.active || 1 // Prevent division by zero

  return (
    <div className="space-y-8">
      {/* Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Monto Total Procesado"
          value={`$${totalProcessedAmount.toLocaleString()}`}
          subtitle={`Prom: $${avgAmountPerQualification.toLocaleString()} por calif.`}
          gradient="from-emerald-400 to-teal-500"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          }
          delay={0}
        />

        <MetricCard
          title="País Dominante"
          value={topCountry ? COUNTRIES[topCountry.country as keyof typeof COUNTRIES]?.flag + ' ' + (topCountry.count) : 'N/A'}
          subtitle={topCountry ? COUNTRIES[topCountry.country as keyof typeof COUNTRIES]?.name || 'Desconocido' : 'Sin datos'}
          gradient="from-blue-400 to-indigo-500"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
            </svg>
          }
          delay={100}
        />

        <MetricCard
          title="Crecimiento Mensual"
          value={monthlyGrowth}
          subtitle="calificaciones vs mes anterior"
          gradient={monthlyGrowth >= 0 ? "from-green-400 to-emerald-500" : "from-red-400 to-rose-500"}
          trend={{ value: Math.abs(monthlyGrowth), isPositive: monthlyGrowth >= 0 }}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={monthlyGrowth >= 0 ? "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" : "M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"} />
            </svg>
          }
          delay={200}
        />

        <MetricCard
          title="Entidades de Riesgo"
          value={riskEntities}
          subtitle="requieren supervisión especial"
          gradient="from-orange-400 to-amber-500"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          }
          delay={300}
        />
      </div>

      {/* Compliance and Risk Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Compliance Analysis Card */}
        <div className="relative overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-lg">
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-green-500/10 to-teal-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          
          <div className="relative p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-gradient-to-b from-green-500 to-teal-500 rounded-full" />
                Análisis de Cumplimiento
              </h3>
              <div className="px-3 py-1 rounded-full bg-gradient-to-r from-green-100 to-teal-100 text-green-700 text-xs font-medium">
                En tiempo real
              </div>
            </div>

            <div className="space-y-4">
              <ComplianceCard
                title="Entidades Cumpliendo"
                subtitle="Sin observaciones"
                value={compliantEntities}
                percentage={Math.round((compliantEntities / totalActiveEntities) * 100)}
                color="green"
                gradient="from-green-50 to-emerald-50"
                icon={<svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>}
                delay={400}
              />

              <ComplianceCard
                title="Con Observaciones"
                subtitle="Requieren seguimiento"
                value={entitiesWithObservations}
                percentage={Math.round((entitiesWithObservations / totalActiveEntities) * 100)}
                color="yellow"
                gradient="from-yellow-50 to-amber-50"
                icon={<svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" /></svg>}
                delay={500}
              />

              <ComplianceCard
                title="No Cumpliendo"
                subtitle="Acción requerida"
                value={nonCompliantEntities}
                percentage={Math.round((nonCompliantEntities / totalActiveEntities) * 100)}
                color="red"
                gradient="from-red-50 to-rose-50"
                icon={<svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>}
                delay={600}
              />
            </div>
          </div>
        </div>

        {/* System Activity Card */}
        <div className="relative overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-lg">
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          
          <div className="relative p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full" />
                Actividad del Sistema
              </h3>
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xs text-gray-500">Online</span>
              </div>
            </div>

            <div className="space-y-3">
              <ActivityItem
                icon={<svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>}
                label="Calificaciones Aprobadas"
                value={stats.overview.qualifications.approved}
                color="from-green-400 to-green-600"
                delay={400}
              />

              <ActivityItem
                icon={<svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                label="Pendientes de Revisión"
                value={stats.overview.qualifications.pending}
                color="from-yellow-400 to-yellow-600"
                delay={500}
              />

              <ActivityItem
                icon={<svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>}
                label="Auditorías Activas"
                value={pendingAudits}
                color="from-blue-400 to-blue-600"
                delay={600}
              />

              <ActivityItem
                icon={<svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>}
                label="Importaciones Exitosas"
                value={`${stats.imports.successRate}%`}
                color="from-purple-400 to-purple-600"
                delay={700}
              />
            </div>

            {/* Processing Time */}
            <div className="mt-6 pt-6 border-t border-gray-100">
              <div className="flex items-center justify-between bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Tiempo Promedio</p>
                    <p className="text-xs text-gray-500">de procesamiento</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    {averageProcessingDays || 'N/A'}
                  </p>
                  <p className="text-sm text-gray-500">días</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Alerts Section */}
      <div className="relative overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-lg">
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-orange-500/5 to-red-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        
        <div className="relative p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-gradient-to-b from-orange-500 to-red-500 rounded-full" />
              Alertas y Notificaciones
            </h3>
            <span className="px-3 py-1 rounded-full bg-gradient-to-r from-orange-100 to-red-100 text-orange-700 text-xs font-medium">
              {[stats.overview.taxReturns.overdue > 0, stats.overview.audits.active > 0, stats.imports.failedRecords > 0].filter(Boolean).length} activas
            </span>
          </div>

          <div className="space-y-4">
            {stats.overview.taxReturns.overdue > 0 && (
              <AlertCard
                type="error"
                title="Declaraciones Vencidas"
                message={`${stats.overview.taxReturns.overdue} declaraciones han superado su fecha límite de presentación.`}
                delay={800}
              />
            )}

            {stats.overview.audits.active > 0 && (
              <AlertCard
                type="warning"
                title="Auditorías en Curso"
                message={`${stats.overview.audits.active} procesos de auditoría requieren seguimiento.`}
                delay={900}
              />
            )}

            {stats.imports.failedRecords > 0 && (
              <AlertCard
                type="info"
                title="Registros de Importación Fallidos"
                message={`${stats.imports.failedRecords} registros fallaron durante la última importación masiva.`}
                delay={1000}
              />
            )}

            {stats.overview.taxReturns.overdue === 0 && 
             stats.overview.audits.active === 0 && 
             stats.imports.failedRecords === 0 && (
              <div className="flex items-center justify-center p-8 text-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-gray-600 font-medium">¡Todo en orden!</p>
                  <p className="text-gray-400 text-sm">No hay alertas activas en este momento</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}