'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/Card'
import { COUNTRIES } from '@/lib/constants'
import ChartsSection from '@/components/dashboard/ChartsSection'
import QuickActionsPanel from '@/components/dashboard/QuickActionsPanel'
import AdvancedMetrics from '@/components/dashboard/AdvancedMetrics'

interface DashboardStats {
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
  recentActivity?: Array<{
    id: string
    action: string
    entityType: string
    entityId: string
    createdAt: string
    userName: string
    description: string
  }>
  processingTime?: {
    averageDays: string | null
    unit: string
  }
}

interface TaxContainerDashboardProps {
  userId?: string
}

// Animated Counter Hook
function useAnimatedCounter(end: number, duration: number = 1200) {
  const [count, setCount] = useState(0)

  useEffect(() => {
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

// Modern Metric Card Component
function MetricCard({ 
  title, 
  value, 
  subtitle, 
  icon, 
  gradient,
  delay = 0 
}: { 
  title: string
  value: number
  subtitle: string
  icon: React.ReactNode
  gradient: string
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
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
            <p className="text-3xl font-bold text-gray-900">{animatedValue.toLocaleString()}</p>
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
          </div>
          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg`}>
            <div className="text-white">
              {icon}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Country Distribution Card
function CountryDistributionCard({ 
  data, 
  totalQualifications 
}: { 
  data: Array<{ country: string; count: number; totalCalculatedValue: number }>
  totalQualifications: number 
}) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className={`relative overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-lg transition-all duration-500 ${
      isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
    }`}>
      <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      
      <div className="relative p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-full" />
            Distribución por País
          </h3>
          <div className="px-3 py-1 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 text-xs font-medium">
            {data.length} países
          </div>
        </div>
        
        <div className="space-y-4">
          {data.map((item, index) => {
            const country = COUNTRIES[item.country as keyof typeof COUNTRIES]
            const percentage = totalQualifications > 0 
              ? (item.count / totalQualifications * 100).toFixed(1) 
              : '0'
            
            return (
              <div 
                key={item.country} 
                className="group flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-all duration-300"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl group-hover:scale-125 transition-transform duration-300">
                    {country?.flag}
                  </span>
                  <div>
                    <p className="font-semibold text-gray-900">{country?.name}</p>
                    <p className="text-sm text-gray-500">
                      {item.count} calificaciones
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">{percentage}%</p>
                  <p className="text-sm text-gray-500">
                    {Number(item.totalCalculatedValue || 0).toFixed(2)} {country?.factor}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// Top Emisors Card
function TopEmisorsCard({ 
  data 
}: { 
  data: Array<{ name: string; count: number; totalAmount: number }> 
}) {
  const [isVisible, setIsVisible] = useState(false)
  const medalColors = ['from-yellow-400 to-amber-500', 'from-gray-300 to-gray-400', 'from-orange-400 to-orange-500']

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 400)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className={`relative overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-lg transition-all duration-500 ${
      isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
    }`}>
      <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-purple-500/5 to-pink-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      
      <div className="relative p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full" />
            Top Emisores
          </h3>
          <div className="px-3 py-1 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 text-xs font-medium">
            Ranking
          </div>
        </div>
        
        <div className="space-y-3">
          {data.slice(0, 5).map((emisor, index) => (
            <div 
              key={emisor.name} 
              className="group flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-all duration-300"
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${
                  index < 3 ? medalColors[index] : 'from-blue-400 to-blue-500'
                } flex items-center justify-center text-white font-bold text-sm shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  {index + 1}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-gray-900 truncate max-w-[180px]">
                    {emisor.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {emisor.count} calificaciones
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-900">
                  ${emisor.totalAmount.toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Qualification Status Card
function QualificationStatusCard({ 
  qualifications 
}: { 
  qualifications: { total: number; approved: number; pending: number; rejected: number; approvalRate: string } 
}) {
  const [isVisible, setIsVisible] = useState(false)
  const drafts = qualifications.total - qualifications.approved - qualifications.pending - qualifications.rejected

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 500)
    return () => clearTimeout(timer)
  }, [])

  const statusItems = [
    { label: 'Aprobadas', value: qualifications.approved, percentage: qualifications.approvalRate, gradient: 'from-green-400 to-emerald-500', bg: 'from-green-50 to-emerald-50' },
    { label: 'Pendientes', value: qualifications.pending, percentage: ((qualifications.pending / qualifications.total) * 100 || 0).toFixed(0), gradient: 'from-yellow-400 to-amber-500', bg: 'from-yellow-50 to-amber-50' },
    { label: 'Rechazadas', value: qualifications.rejected, percentage: ((qualifications.rejected / qualifications.total) * 100 || 0).toFixed(0), gradient: 'from-red-400 to-rose-500', bg: 'from-red-50 to-rose-50' },
    { label: 'Borradores', value: drafts, percentage: ((drafts / qualifications.total) * 100 || 0).toFixed(0), gradient: 'from-gray-400 to-gray-500', bg: 'from-gray-50 to-gray-100' }
  ]

  return (
    <div className={`relative overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-lg transition-all duration-500 ${
      isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
    }`}>
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-green-500/5 to-teal-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      
      <div className="relative p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-gradient-to-b from-green-500 to-teal-500 rounded-full" />
            Estado de Calificaciones
          </h3>
          <div className="px-3 py-1 rounded-full bg-gradient-to-r from-green-100 to-teal-100 text-green-700 text-xs font-medium">
            {qualifications.total} total
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {statusItems.map((item, index) => (
            <div 
              key={item.label}
              className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${item.bg} p-4 text-center transition-all duration-300 hover:scale-105`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`absolute top-0 right-0 w-12 h-12 bg-gradient-to-br ${item.gradient} opacity-20 rounded-full blur-xl -translate-y-1/2 translate-x-1/2`} />
              
              <div className="relative">
                <p className={`text-3xl font-bold bg-gradient-to-br ${item.gradient} bg-clip-text text-transparent`}>
                  {item.value}
                </p>
                <p className="text-sm font-medium text-gray-700 mt-1">{item.label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{item.percentage}%</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function TaxContainerDashboard({ userId }: TaxContainerDashboardProps) {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCountry, setSelectedCountry] = useState('')
  const [selectedPeriod, setSelectedPeriod] = useState('year')

  useEffect(() => {
    fetchStats()
  }, [selectedCountry, selectedPeriod])

  const fetchStats = async () => {
    try {
      setIsLoading(true)
      const params = new URLSearchParams({
        ...(selectedCountry && { country: selectedCountry }),
        period: selectedPeriod
      })
      
      const response = await fetch(`/api/dashboard/stats?${params}`)
      const data = await response.json()
      
      if (data.success) {
        setStats(data.data)
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
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
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="relative overflow-hidden rounded-2xl bg-white border border-gray-100 p-12 text-center shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white" />
        <div className="relative">
          <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            No hay datos disponibles
          </h3>
          <p className="text-gray-600 max-w-md mx-auto">
            Los datos del dashboard aparecerán cuando haya información en el sistema.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header with modern styling */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent">
            Dashboard Tributario
          </h1>
          <p className="text-gray-500 mt-1">
            Resumen ejecutivo del contenedor tributario NUAM
          </p>
        </div>

        <div className="flex gap-3">
          <div className="relative">
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="appearance-none px-4 py-2.5 pr-10 border border-gray-200 rounded-xl bg-white hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-sm font-medium text-gray-700 shadow-sm"
            >
              <option value="">🌍 Todos los países</option>
              {Object.values(COUNTRIES).map(country => (
                <option key={country.code} value={country.code}>
                  {country.flag} {country.name}
                </option>
              ))}
            </select>
            <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>

          <div className="relative">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="appearance-none px-4 py-2.5 pr-10 border border-gray-200 rounded-xl bg-white hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-sm font-medium text-gray-700 shadow-sm"
            >
              <option value="month">📅 Este mes</option>
              <option value="quarter">📊 Este trimestre</option>
              <option value="year">📈 Este año</option>
            </select>
            <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Quick Actions Panel */}
      <QuickActionsPanel recentActivity={stats.recentActivity} />

      {/* Main Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Calificaciones Totales"
          value={stats.overview.qualifications.total}
          subtitle={`${stats.overview.qualifications.approvalRate}% aprobadas`}
          gradient="from-blue-400 to-indigo-500"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          }
          delay={0}
        />

        <MetricCard
          title="Entidades Activas"
          value={stats.overview.taxEntities.active}
          subtitle={`de ${stats.overview.taxEntities.total} registradas`}
          gradient="from-emerald-400 to-teal-500"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          }
          delay={100}
        />

        <MetricCard
          title="Cumplimiento"
          value={parseInt(stats.overview.taxReturns.complianceRate) || 0}
          subtitle={`${stats.overview.taxReturns.overdue} vencidas`}
          gradient="from-yellow-400 to-orange-500"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          delay={200}
        />

        <MetricCard
          title="Importaciones"
          value={stats.imports.totalRecords}
          subtitle={`${stats.imports.successRate}% exitosas`}
          gradient="from-purple-400 to-violet-500"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          }
          delay={300}
        />
      </div>

      {/* Distribution Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CountryDistributionCard 
          data={stats.byCountry} 
          totalQualifications={stats.overview.qualifications.total}
        />
        <TopEmisorsCard data={stats.topEmisors} />
      </div>

      {/* Qualification Status */}
      <QualificationStatusCard qualifications={stats.overview.qualifications} />

      {/* Advanced Metrics */}
      <AdvancedMetrics stats={stats} />

      {/* Charts Section */}
      <ChartsSection stats={stats} />
    </div>
  )
}