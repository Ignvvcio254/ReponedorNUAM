'use client'

import { Card } from '@/components/ui/Card'
import { COUNTRIES } from '@/lib/constants'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
  AreaChart,
  Area
} from 'recharts'

interface ChartsSectionProps {
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
  }
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16']

export default function ChartsSection({ stats }: ChartsSectionProps) {
  // Prepare data for charts
  const qualificationStatusData = [
    { name: 'Aprobadas', value: stats.overview.qualifications.approved, color: '#10B981' },
    { name: 'Pendientes', value: stats.overview.qualifications.pending, color: '#F59E0B' },
    { name: 'Rechazadas', value: stats.overview.qualifications.rejected, color: '#EF4444' },
    { 
      name: 'Borradores', 
      value: stats.overview.qualifications.total - stats.overview.qualifications.approved - stats.overview.qualifications.pending - stats.overview.qualifications.rejected, 
      color: '#6B7280' 
    }
  ]

  const countryData = stats.byCountry.map(item => {
    const country = COUNTRIES[item.country as keyof typeof COUNTRIES]
    return {
      country: country?.name || item.country,
      flag: country?.flag || '🏴',
      count: item.count,
      amount: item.totalAmount,
      calculatedValue: item.totalCalculatedValue,
      percentage: stats.overview.qualifications.total > 0 
        ? (item.count / stats.overview.qualifications.total * 100).toFixed(1) 
        : '0'
    }
  })

  const monthlyData = stats.monthlyTrends.map(item => ({
    month: new Date(item.month).toLocaleDateString('es', { month: 'short', year: 'numeric' }),
    calificaciones: item.count,
    monto: item.total_amount / 1000 // Convert to thousands
  }))

  const topEmisorsData = stats.topEmisors.slice(0, 8).map(item => ({
    name: item.name.length > 20 ? item.name.substring(0, 20) + '...' : item.name,
    count: item.count,
    amount: item.totalAmount
  }))

  const overviewData = [
    { name: 'Calificaciones', total: stats.overview.qualifications.total, active: stats.overview.qualifications.approved },
    { name: 'Entidades', total: stats.overview.taxEntities.total, active: stats.overview.taxEntities.active },
    { name: 'Declaraciones', total: stats.overview.taxReturns.total, active: stats.overview.taxReturns.total - stats.overview.taxReturns.overdue },
    { name: 'Pagos', total: stats.overview.taxPayments.total, active: stats.overview.taxPayments.verified }
  ]

  const importStatsData = [
    { name: 'Exitosos', value: stats.imports.successfulRecords, color: '#10B981' },
    { name: 'Fallidos', value: stats.imports.failedRecords, color: '#EF4444' }
  ]

  return (
    <div className="space-y-6">
      {/* Overview Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution Pie Chart */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Estado de Calificaciones
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={qualificationStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percentage }) => `${name}: ${percentage}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {qualificationStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value, name) => [`${value} calificaciones`, name]} />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Overview Bar Chart */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Resumen General
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={overviewData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="total" fill="#E5E7EB" name="Total" />
              <Bar dataKey="active" fill="#3B82F6" name="Activo/Aprobado" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Country Distribution */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Distribución por País
        </h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={countryData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis 
              type="category" 
              dataKey="country" 
              width={120}
              tick={{ fontSize: 12 }}
            />
            <Tooltip 
              formatter={(value, name) => {
                if (name === 'count') return [`${value} calificaciones`, 'Calificaciones']
                if (name === 'amount') return [`$${Number(value).toLocaleString()}`, 'Monto Total']
                return [value, name]
              }}
            />
            <Legend />
            <Bar dataKey="count" fill="#3B82F6" name="Calificaciones" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Monthly Trends */}
      {monthlyData.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Tendencias Mensuales
          </h3>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip 
                formatter={(value, name) => {
                  if (name === 'calificaciones') return [`${value}`, 'Calificaciones']
                  if (name === 'monto') return [`$${Number(value).toLocaleString()}K`, 'Monto (Miles)']
                  return [value, name]
                }}
              />
              <Legend />
              <Area 
                yAxisId="left"
                type="monotone" 
                dataKey="calificaciones" 
                stroke="#3B82F6" 
                fill="#3B82F6" 
                fillOpacity={0.3}
                name="Calificaciones"
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="monto" 
                stroke="#10B981" 
                strokeWidth={2}
                name="Monto (Miles USD)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Issuers */}
        {topEmisorsData.length > 0 && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Top Emisores
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topEmisorsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  tick={{ fontSize: 11 }}
                />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => {
                    if (name === 'count') return [`${value} calificaciones`, 'Calificaciones']
                    if (name === 'amount') return [`$${Number(value).toLocaleString()}`, 'Monto Total']
                    return [value, name]
                  }}
                />
                <Bar dataKey="count" fill="#8B5CF6" name="Calificaciones" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        )}

        {/* Import Statistics */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Estadísticas de Importación
          </h3>
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900">{stats.imports.totalRecords}</p>
              <p className="text-sm text-gray-600">Registros Totales</p>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={importStatsData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={60}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {importStatsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="text-center">
              <p className="text-sm text-green-600 font-semibold">
                Tasa de éxito: {stats.imports.successRate}%
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}