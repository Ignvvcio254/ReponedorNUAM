'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import {
  DocumentArrowDownIcon,
  FunnelIcon,
  ChartBarIcon,
  TableCellsIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline'
import {
  exportQualificationsToExcel,
  exportTaxEntitiesToExcel,
  exportSummaryToExcel,
  exportCompleteReport,
  type QualificationReport,
  type TaxEntityReport,
  type SummaryReport,
} from '@/lib/excel-export'
import { useToast } from '@/components/ui/ToastContainer'

const COUNTRIES = [
  { code: 'CL', name: 'Chile', flag: '🇨🇱' },
  { code: 'PE', name: 'Perú', flag: '🇵🇪' },
  { code: 'CO', name: 'Colombia', flag: '🇨🇴' },
  { code: 'MX', name: 'México', flag: '🇲🇽' },
  { code: 'AR', name: 'Argentina', flag: '🇦🇷' },
  { code: 'BR', name: 'Brasil', flag: '🇧🇷' },
  { code: 'UY', name: 'Uruguay', flag: '🇺🇾' },
  { code: 'PY', name: 'Paraguay', flag: '🇵🇾' },
  { code: 'BO', name: 'Bolivia', flag: '🇧🇴' },
  { code: 'EC', name: 'Ecuador', flag: '🇪🇨' },
  { code: 'VE', name: 'Venezuela', flag: '🇻🇪' },
  { code: 'PA', name: 'Panamá', flag: '🇵🇦' },
  { code: 'CR', name: 'Costa Rica', flag: '🇨🇷' },
  { code: 'GT', name: 'Guatemala', flag: '🇬🇹' },
  { code: 'US', name: 'Estados Unidos', flag: '🇺🇸' },
]

const STATUS_OPTIONS = [
  { value: 'DRAFT', label: 'Borrador' },
  { value: 'PENDING', label: 'Pendiente' },
  { value: 'APPROVED', label: 'Aprobado' },
  { value: 'REJECTED', label: 'Rechazado' },
  { value: 'EXPIRED', label: 'Expirado' },
]

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
  icon: Icon, 
  gradient, 
  delay = 0 
}: {
  title: string
  value: number
  icon: React.ComponentType<{ className?: string }>
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
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${gradient} opacity-10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2`} />
      
      <div className="relative p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {animatedValue.toLocaleString()}
            </p>
          </div>
          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg`}>
            <Icon className="w-7 h-7 text-white" />
          </div>
        </div>
      </div>
    </div>
  )
}

// Report Type Button
function ReportTypeButton({ 
  label, 
  icon: Icon, 
  isActive, 
  onClick,
  gradient
}: {
  label: string
  icon: React.ComponentType<{ className?: string }>
  isActive: boolean
  onClick: () => void
  gradient: string
}) {
  return (
    <button
      onClick={onClick}
      className={`relative overflow-hidden p-4 rounded-xl border-2 transition-all duration-300 ${
        isActive
          ? 'border-transparent bg-gradient-to-br ' + gradient + ' text-white shadow-lg scale-105'
          : 'border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50'
      }`}
    >
      <Icon className={`w-6 h-6 mx-auto mb-2 ${isActive ? 'text-white' : 'text-gray-600'}`} />
      <div className={`text-sm font-medium ${isActive ? 'text-white' : 'text-gray-700'}`}>{label}</div>
    </button>
  )
}

export function ReportsContent() {
  const toast = useToast()
  const { data: session, status } = useSession()
  const router = useRouter()
  const [reportType, setReportType] = useState<'qualifications' | 'entities' | 'summary' | 'complete'>('summary')
  const [country, setCountry] = useState<string>('')
  const [status_filter, setStatusFilter] = useState<string>('')
  const [startDate, setStartDate] = useState<string>('')
  const [endDate, setEndDate] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<any>(null)
  const [showFilters, setShowFilters] = useState(true)
  const [stats, setStats] = useState<any>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  useEffect(() => {
    if (status === 'authenticated') {
      loadStats()
    }
  }, [status])

  const loadStats = async () => {
    try {
      const res = await fetch('/api/reports?type=stats')
      const result = await res.json()
      if (result.success) {
        // API returns { success: true, data: { data: {...}, filters: {...} } }
        // Extract the actual stats data
        const statsData = result.data?.data !== undefined ? result.data.data : result.data
        setStats(statsData)
      }
    } catch (error) {
      console.error('Error loading stats:', error)
    }
  }


  const loadReport = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        type: reportType,
        ...(country && { country }),
        ...(status_filter && { status: status_filter }),
        ...(startDate && { startDate }),
        ...(endDate && { endDate }),
      })

      const res = await fetch(`/api/reports?${params}`)
      const result = await res.json()

      if (result.success) {
        // API returns { success: true, data: { data: [...], filters: {...} } }
        // We need to extract the actual data from result.data.data
        const responseData = result.data?.data !== undefined ? result.data.data : result.data
        setData(responseData)
      } else {
        toast.error('Error al cargar el reporte: ' + result.error)
      }
    } catch (error) {
      console.error('Error loading report:', error)
      toast.error('Error al cargar el reporte')
    } finally {
      setLoading(false)
    }
  }


  const handleExport = () => {
    if (!data) {
      toast.info('No hay datos para exportar. Genera un reporte primero.')
      return
    }

    try {
      switch (reportType) {
        case 'qualifications':
          const qualData: QualificationReport[] = data.map((item: any) => ({
            id: item.id,
            emisorName: item.emisorName,
            taxId: item.taxId,
            country: item.country,
            period: item.period,
            amount: Number(item.amount),
            currency: item.currency,
            calculatedValue: item.calculatedValue ? Number(item.calculatedValue) : null,
            status: item.status,
            createdAt: item.createdAt,
            userName: item.user?.name || 'N/A',
            userEmail: item.user?.email || 'N/A',
          }))
          exportQualificationsToExcel(qualData)
          break

        case 'entities':
          const entData: TaxEntityReport[] = data.map((item: any) => ({
            id: item.id,
            businessName: item.businessName,
            taxId: item.taxId,
            entityType: item.entityType,
            country: item.country,
            taxRegime: item.taxRegime,
            status: item.status,
            registrationDate: item.registrationDate,
            createdAt: item.createdAt,
          }))
          exportTaxEntitiesToExcel(entData)
          break

        case 'summary':
          const summaryData: SummaryReport[] = data.map((item: any) => ({
            country: item.country,
            totalQualifications: item.totalQualifications,
            approved: item.approved,
            pending: item.pending,
            rejected: item.rejected,
            totalAmount: item.totalAmount,
            averageAmount: item.averageAmount,
          }))
          exportSummaryToExcel(summaryData)
          break

        case 'complete':
          const completeQual: QualificationReport[] = data.qualifications.map((item: any) => ({
            id: item.id,
            emisorName: item.emisorName,
            taxId: item.taxId,
            country: item.country,
            period: item.period,
            amount: Number(item.amount),
            currency: item.currency,
            calculatedValue: item.calculatedValue ? Number(item.calculatedValue) : null,
            status: item.status,
            createdAt: item.createdAt,
            userName: item.user?.name || 'N/A',
            userEmail: item.user?.email || 'N/A',
          }))

          const completeEnt: TaxEntityReport[] = data.entities.map((item: any) => ({
            id: item.id,
            businessName: item.businessName,
            taxId: item.taxId,
            entityType: item.entityType,
            country: item.country,
            taxRegime: item.taxRegime,
            status: item.status,
            registrationDate: item.registrationDate,
            createdAt: item.createdAt,
          }))

          const completeSummary: SummaryReport[] = data.summary.map((item: any) => ({
            country: item.country,
            totalQualifications: item.totalQualifications,
            approved: item.approved,
            pending: item.pending,
            rejected: item.rejected,
            totalAmount: item.totalAmount,
            averageAmount: item.averageAmount,
          }))

          exportCompleteReport(completeQual, completeEnt, completeSummary)
          break
      }

      toast.success('Archivo Excel exportado exitosamente')
    } catch (error) {
      console.error('Error exporting:', error)
      toast.error('Error al exportar el archivo')
    }
  }

  const clearFilters = () => {
    setCountry('')
    setStatusFilter('')
    setStartDate('')
    setEndDate('')
    setData(null)
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
            <ArrowPathIcon className="w-8 h-8 text-white animate-spin" />
          </div>
          <p className="text-gray-600 font-medium">Cargando reportes...</p>
        </div>
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className={`mb-8 transition-all duration-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent">
            Reportes
          </h1>
          <p className="mt-2 text-gray-500">
            Genera y exporta reportes del sistema tributario
          </p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total Calificaciones"
              value={stats.totalQualifications || 0}
              icon={ChartBarIcon}
              gradient="from-blue-400 to-indigo-500"
              delay={0}
            />
            <StatCard
              title="Total Entidades"
              value={stats.totalEntities || 0}
              icon={TableCellsIcon}
              gradient="from-emerald-400 to-teal-500"
              delay={100}
            />
            <StatCard
              title="Países Activos"
              value={stats.byCountry?.length || 0}
              icon={(props) => (
                <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
                </svg>
              )}
              gradient="from-purple-400 to-violet-500"
              delay={200}
            />
            <StatCard
              title="Reportes Disponibles"
              value={4}
              icon={DocumentArrowDownIcon}
              gradient="from-orange-400 to-amber-500"
              delay={300}
            />
          </div>
        )}

        {/* Main Card */}
        <div className={`relative overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-lg transition-all duration-500 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          
          {/* Filters Section */}
          <div className="relative border-b border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                  <FunnelIcon className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-lg font-bold text-gray-900">Filtros y Configuración</h2>
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
              >
                {showFilters ? 'Ocultar' : 'Mostrar'} Filtros
              </button>
            </div>

            {showFilters && (
              <div className="space-y-6">
                {/* Report Type Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-3">
                    Tipo de Reporte
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <ReportTypeButton
                      label="Resumen por País"
                      icon={ChartBarIcon}
                      isActive={reportType === 'summary'}
                      onClick={() => setReportType('summary')}
                      gradient="from-blue-500 to-indigo-600"
                    />
                    <ReportTypeButton
                      label="Calificaciones"
                      icon={TableCellsIcon}
                      isActive={reportType === 'qualifications'}
                      onClick={() => setReportType('qualifications')}
                      gradient="from-emerald-500 to-teal-600"
                    />
                    <ReportTypeButton
                      label="Entidades"
                      icon={TableCellsIcon}
                      isActive={reportType === 'entities'}
                      onClick={() => setReportType('entities')}
                      gradient="from-purple-500 to-violet-600"
                    />
                    <ReportTypeButton
                      label="Reporte Completo"
                      icon={DocumentArrowDownIcon}
                      isActive={reportType === 'complete'}
                      onClick={() => setReportType('complete')}
                      gradient="from-orange-500 to-amber-600"
                    />
                  </div>
                </div>

                {/* Filter Inputs */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">País</label>
                    <div className="relative">
                      <select
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="w-full appearance-none px-4 py-2.5 pr-10 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white"
                      >
                        <option value="">🌍 Todos los países</option>
                        {COUNTRIES.map((c) => (
                          <option key={c.code} value={c.code}>
                            {c.flag} {c.name}
                          </option>
                        ))}
                      </select>
                      <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">Estado</label>
                    <div className="relative">
                      <select
                        value={status_filter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full appearance-none px-4 py-2.5 pr-10 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white"
                      >
                        <option value="">📋 Todos los estados</option>
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s.value} value={s.value}>
                            {s.label}
                          </option>
                        ))}
                      </select>
                      <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">Fecha Inicio</label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">Fecha Fin</label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 pt-4">
                  <button
                    onClick={loadReport}
                    disabled={loading}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <ArrowPathIcon className="w-5 h-5 animate-spin" />
                        Generando...
                      </>
                    ) : (
                      <>
                        <ChartBarIcon className="w-5 h-5" />
                        Generar Reporte
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleExport}
                    disabled={!data || loading}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <DocumentArrowDownIcon className="w-5 h-5" />
                    Exportar Excel
                  </button>

                  <button
                    onClick={clearFilters}
                    className="px-6 py-3 text-gray-700 font-medium bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                  >
                    Limpiar
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Results Section */}
          <div className="relative p-6">
            {!data && !loading && (
              <div className="text-center py-16">
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <ChartBarIcon className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Sin datos para mostrar</h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  Selecciona los filtros y haz clic en "Generar Reporte" para ver los resultados
                </p>
              </div>
            )}

            {loading && (
              <div className="text-center py-16">
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                  <ArrowPathIcon className="w-10 h-10 text-blue-600 animate-spin" />
                </div>
                <p className="text-gray-600 font-medium">Generando reporte...</p>
              </div>
            )}

            {data && !loading && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Resultados del Reporte</h3>
                  </div>
                  <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                    {Array.isArray(data) ? data.length : Object.keys(data).length} registro(s)
                  </span>
                </div>

                <div className="overflow-x-auto rounded-xl border border-gray-200">
                  {reportType === 'summary' && Array.isArray(data) && (
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">País</th>
                          <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Total</th>
                          <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Aprobadas</th>
                          <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Pendientes</th>
                          <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Rechazadas</th>
                          <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Monto Total</th>
                          <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Promedio</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-100">
                        {data.map((item: any, index: number) => (
                          <tr key={index} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                              {COUNTRIES.find(c => c.code === item.country)?.flag} {item.country}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-medium">
                              {item.totalQualifications}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                              <span className="px-2 py-1 bg-green-50 text-green-700 rounded-lg font-medium">{item.approved}</span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                              <span className="px-2 py-1 bg-yellow-50 text-yellow-700 rounded-lg font-medium">{item.pending}</span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                              <span className="px-2 py-1 bg-red-50 text-red-700 rounded-lg font-medium">{item.rejected}</span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-medium">
                              ${item.totalAmount.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-right">
                              ${item.averageAmount.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}

                  {reportType === 'qualifications' && Array.isArray(data) && (
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Emisor</th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">País</th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Período</th>
                          <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Monto</th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Estado</th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Usuario</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-100">
                        {data.slice(0, 50).map((item: any) => (
                          <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {item.emisorName}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {COUNTRIES.find(c => c.code === item.country)?.flag} {item.country}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {item.period}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-medium">
                              ${Number(item.amount).toLocaleString('es-ES')}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-lg ${
                                item.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                                item.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                item.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {item.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {item.user?.name || 'N/A'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}

                  {reportType === 'entities' && Array.isArray(data) && (
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Razón Social</th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">RUT/RUC/RFC</th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">País</th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Tipo</th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Régimen</th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Estado</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-100">
                        {data.slice(0, 50).map((item: any) => (
                          <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {item.businessName}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {item.taxId}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {COUNTRIES.find(c => c.code === item.country)?.flag} {item.country}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {item.entityType}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {item.taxRegime}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-lg ${
                                item.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                                item.status === 'INACTIVE' ? 'bg-gray-100 text-gray-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {item.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}

                  {reportType === 'complete' && data && (
                    <div className="p-6 space-y-4">
                      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 p-6 border border-blue-100">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-indigo-500/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                        <div className="relative">
                          <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                            <h4 className="font-bold text-blue-900">Reporte Completo Generado</h4>
                          </div>
                          <div className="grid grid-cols-3 gap-4">
                            <div className="bg-white/60 rounded-lg p-3 text-center">
                              <p className="text-2xl font-bold text-blue-700">{data.qualifications?.length || 0}</p>
                              <p className="text-sm text-blue-600">Calificaciones</p>
                            </div>
                            <div className="bg-white/60 rounded-lg p-3 text-center">
                              <p className="text-2xl font-bold text-blue-700">{data.entities?.length || 0}</p>
                              <p className="text-sm text-blue-600">Entidades</p>
                            </div>
                            <div className="bg-white/60 rounded-lg p-3 text-center">
                              <p className="text-2xl font-bold text-blue-700">{data.summary?.length || 0}</p>
                              <p className="text-sm text-blue-600">Países</p>
                            </div>
                          </div>
                          <p className="mt-4 text-sm text-blue-700">
                            Haz clic en "Exportar Excel" para descargar el reporte completo con todas las pestañas.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {Array.isArray(data) && data.length > 50 && (
                  <p className="mt-4 text-sm text-gray-500 text-center">
                    Mostrando los primeros 50 resultados de {data.length}. Exporta a Excel para ver todos los datos.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
