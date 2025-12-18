'use client'

import { useState, useEffect } from 'react'
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

const COUNTRIES = [
  { code: 'CL', name: 'Chile' },
  { code: 'PE', name: 'Perú' },
  { code: 'CO', name: 'Colombia' },
  { code: 'MX', name: 'México' },
  { code: 'AR', name: 'Argentina' },
  { code: 'BR', name: 'Brasil' },
  { code: 'UY', name: 'Uruguay' },
  { code: 'PY', name: 'Paraguay' },
  { code: 'BO', name: 'Bolivia' },
  { code: 'EC', name: 'Ecuador' },
  { code: 'VE', name: 'Venezuela' },
  { code: 'PA', name: 'Panamá' },
  { code: 'CR', name: 'Costa Rica' },
  { code: 'GT', name: 'Guatemala' },
  { code: 'US', name: 'Estados Unidos' },
]

const STATUS_OPTIONS = [
  { value: 'DRAFT', label: 'Borrador' },
  { value: 'PENDING', label: 'Pendiente' },
  { value: 'APPROVED', label: 'Aprobado' },
  { value: 'REJECTED', label: 'Rechazado' },
  { value: 'EXPIRED', label: 'Expirado' },
]

export default function ReportsPage() {
  const [reportType, setReportType] = useState<'qualifications' | 'entities' | 'summary' | 'complete'>('summary')
  const [country, setCountry] = useState<string>('')
  const [status, setStatus] = useState<string>('')
  const [startDate, setStartDate] = useState<string>('')
  const [endDate, setEndDate] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<any>(null)
  const [showFilters, setShowFilters] = useState(true)
  const [stats, setStats] = useState<any>(null)

  // Cargar estadísticas al inicio
  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const res = await fetch('/api/reports?type=stats')
      const result = await res.json()
      if (result.success) {
        setStats(result.data)
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
        ...(status && { status }),
        ...(startDate && { startDate }),
        ...(endDate && { endDate }),
      })

      const res = await fetch(`/api/reports?${params}`)
      const result = await res.json()

      if (result.success) {
        setData(result.data)
      } else {
        alert('Error al cargar el reporte: ' + result.error)
      }
    } catch (error) {
      console.error('Error loading report:', error)
      alert('Error al cargar el reporte')
    } finally {
      setLoading(false)
    }
  }

  const handleExport = () => {
    if (!data) {
      alert('No hay datos para exportar. Genera un reporte primero.')
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

      alert('Archivo Excel exportado exitosamente')
    } catch (error) {
      console.error('Error exporting:', error)
      alert('Error al exportar el archivo')
    }
  }

  const clearFilters = () => {
    setCountry('')
    setStatus('')
    setStartDate('')
    setEndDate('')
    setData(null)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Reportes</h1>
          <p className="mt-2 text-sm text-gray-600">
            Genera y exporta reportes del sistema tributario
          </p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Calificaciones</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">
                    {stats.totalQualifications.toLocaleString()}
                  </p>
                </div>
                <ChartBarIcon className="w-12 h-12 text-nuam-500" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Entidades</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">
                    {stats.totalEntities.toLocaleString()}
                  </p>
                </div>
                <TableCellsIcon className="w-12 h-12 text-blue-500" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Países Activos</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">
                    {stats.byCountry.length}
                  </p>
                </div>
                <div className="w-12 h-12 flex items-center justify-center bg-green-100 rounded-full">
                  <span className="text-2xl font-bold text-green-600">
                    {stats.byCountry.length}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Reportes Disponibles</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">4</p>
                </div>
                <DocumentArrowDownIcon className="w-12 h-12 text-purple-500" />
              </div>
            </div>
          </div>
        )}

        {/* Main Card */}
        <div className="bg-white rounded-lg shadow">
          {/* Filters Section */}
          <div className="border-b border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Filtros y Configuración
              </h2>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 text-sm text-nuam-600 hover:text-nuam-700"
              >
                <FunnelIcon className="w-5 h-5" />
                {showFilters ? 'Ocultar' : 'Mostrar'} Filtros
              </button>
            </div>

            {showFilters && (
              <div className="space-y-4">
                {/* Tipo de Reporte */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Reporte
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <button
                      onClick={() => setReportType('summary')}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        reportType === 'summary'
                          ? 'border-nuam-500 bg-nuam-50 text-nuam-700'
                          : 'border-gray-200 hover:border-nuam-300'
                      }`}
                    >
                      <ChartBarIcon className="w-6 h-6 mx-auto mb-2" />
                      <div className="text-sm font-medium">Resumen por País</div>
                    </button>

                    <button
                      onClick={() => setReportType('qualifications')}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        reportType === 'qualifications'
                          ? 'border-nuam-500 bg-nuam-50 text-nuam-700'
                          : 'border-gray-200 hover:border-nuam-300'
                      }`}
                    >
                      <TableCellsIcon className="w-6 h-6 mx-auto mb-2" />
                      <div className="text-sm font-medium">Calificaciones</div>
                    </button>

                    <button
                      onClick={() => setReportType('entities')}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        reportType === 'entities'
                          ? 'border-nuam-500 bg-nuam-50 text-nuam-700'
                          : 'border-gray-200 hover:border-nuam-300'
                      }`}
                    >
                      <TableCellsIcon className="w-6 h-6 mx-auto mb-2" />
                      <div className="text-sm font-medium">Entidades</div>
                    </button>

                    <button
                      onClick={() => setReportType('complete')}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        reportType === 'complete'
                          ? 'border-nuam-500 bg-nuam-50 text-nuam-700'
                          : 'border-gray-200 hover:border-nuam-300'
                      }`}
                    >
                      <DocumentArrowDownIcon className="w-6 h-6 mx-auto mb-2" />
                      <div className="text-sm font-medium">Reporte Completo</div>
                    </button>
                  </div>
                </div>

                {/* Filtros */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      País
                    </label>
                    <select
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nuam-500 focus:border-transparent"
                    >
                      <option value="">Todos los países</option>
                      {COUNTRIES.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Estado
                    </label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nuam-500 focus:border-transparent"
                    >
                      <option value="">Todos los estados</option>
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s.value} value={s.value}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fecha Inicio
                    </label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nuam-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fecha Fin
                    </label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nuam-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={loadReport}
                    disabled={loading}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-nuam-600 text-white rounded-lg hover:bg-nuam-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                    className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <DocumentArrowDownIcon className="w-5 h-5" />
                    Exportar Excel
                  </button>

                  <button
                    onClick={clearFilters}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Limpiar
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Results Section */}
          <div className="p-6">
            {!data && !loading && (
              <div className="text-center py-12">
                <ChartBarIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">
                  Selecciona los filtros y haz clic en "Generar Reporte" para ver los resultados
                </p>
              </div>
            )}

            {loading && (
              <div className="text-center py-12">
                <ArrowPathIcon className="w-16 h-16 text-nuam-500 mx-auto mb-4 animate-spin" />
                <p className="text-gray-500">Generando reporte...</p>
              </div>
            )}

            {data && !loading && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Resultados del Reporte
                  </h3>
                  <span className="text-sm text-gray-500">
                    {Array.isArray(data) ? data.length : Object.keys(data).length} registro(s)
                  </span>
                </div>

                <div className="overflow-x-auto">
                  {reportType === 'summary' && Array.isArray(data) && (
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">País</th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total</th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Aprobadas</th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Pendientes</th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Rechazadas</th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Monto Total</th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Promedio</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {data.map((item: any, index: number) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {item.country}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                              {item.totalQualifications}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 text-right font-medium">
                              {item.approved}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-600 text-right font-medium">
                              {item.pending}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 text-right font-medium">
                              {item.rejected}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                              ${item.totalAmount.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                              ${item.averageAmount.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}

                  {reportType === 'qualifications' && Array.isArray(data) && (
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Emisor</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">País</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Período</th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Monto</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usuario</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {data.slice(0, 50).map((item: any) => (
                          <tr key={item.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {item.emisorName}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {item.country}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {item.period}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                              ${Number(item.amount).toLocaleString('es-ES')}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
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
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Razón Social</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">RUT/RUC/RFC</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">País</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Régimen</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {data.slice(0, 50).map((item: any) => (
                          <tr key={item.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {item.businessName}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {item.taxId}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {item.country}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {item.entityType}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {item.taxRegime}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
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
                    <div className="space-y-6">
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h4 className="font-medium text-blue-900 mb-2">Reporte Completo Generado</h4>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-blue-700 font-medium">Calificaciones:</span>
                            <span className="ml-2 text-blue-900">{data.qualifications?.length || 0}</span>
                          </div>
                          <div>
                            <span className="text-blue-700 font-medium">Entidades:</span>
                            <span className="ml-2 text-blue-900">{data.entities?.length || 0}</span>
                          </div>
                          <div>
                            <span className="text-blue-700 font-medium">Países:</span>
                            <span className="ml-2 text-blue-900">{data.summary?.length || 0}</span>
                          </div>
                        </div>
                        <p className="mt-3 text-sm text-blue-700">
                          Haz clic en "Exportar Excel" para descargar el reporte completo con todas las pestañas.
                        </p>
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
