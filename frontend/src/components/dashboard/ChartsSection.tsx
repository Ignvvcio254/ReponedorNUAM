'use client'

import { useState, useEffect } from 'react'
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
  Area,
  RadialBarChart,
  RadialBar,
  ComposedChart,
  Sector,
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

// Modern gradient color schemes
const GRADIENT_COLORS = {
  primary: ['#667eea', '#764ba2'],
  success: ['#11998e', '#38ef7d'],
  warning: ['#F2994A', '#F2C94C'],
  danger: ['#eb3349', '#f45c43'],
  purple: ['#a855f7', '#6366f1'],
  blue: ['#3b82f6', '#06b6d4'],
  pink: ['#ec4899', '#f472b6'],
  teal: ['#14b8a6', '#22d3ee'],
}

const MODERN_COLORS = ['#667eea', '#11998e', '#F2994A', '#eb3349', '#a855f7', '#3b82f6', '#ec4899', '#14b8a6']

// Custom active shape for donut chart
const renderActiveShape = (props: any) => {
  const RADIAN = Math.PI / 180
  const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props
  const sin = Math.sin(-RADIAN * midAngle)
  const cos = Math.cos(-RADIAN * midAngle)
  const sx = cx + (outerRadius + 10) * cos
  const sy = cy + (outerRadius + 10) * sin
  const mx = cx + (outerRadius + 30) * cos
  const my = cy + (outerRadius + 30) * sin
  const ex = mx + (cos >= 0 ? 1 : -1) * 22
  const ey = my
  const textAnchor = cos >= 0 ? 'start' : 'end'

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill="#374151" className="text-lg font-bold">
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 8}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.3))' }}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 12}
        outerRadius={outerRadius + 16}
        fill={fill}
        style={{ opacity: 0.5 }}
      />
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" strokeWidth={2} />
      <circle cx={ex} cy={ey} r={4} fill={fill} stroke="none" />
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#374151" className="text-sm font-medium">
        {value} ({(percent * 100).toFixed(0)}%)
      </text>
    </g>
  )
}

// Custom tooltip component
const ModernTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 backdrop-blur-lg rounded-xl shadow-2xl border border-gray-100 p-4 min-w-[180px]">
        <p className="text-gray-900 font-semibold text-sm mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-gray-600 text-sm">{entry.name}</span>
            </div>
            <span className="text-gray-900 font-bold text-sm">
              {typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}
            </span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

// Glassmorphism card wrapper component
const GlassCard = ({ children, title, className = '', gradient = 'from-white to-gray-50' }: {
  children: React.ReactNode
  title: string
  className?: string
  gradient?: string
}) => (
  <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${gradient} border border-gray-200/50 shadow-xl backdrop-blur-sm ${className}`}>
    {/* Decorative elements */}
    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
    <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-green-500/10 to-teal-500/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
    
    <div className="relative p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <span className="w-1.5 h-6 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full" />
          {title}
        </h3>
        <div className="flex gap-1">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse delay-100" />
          <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse delay-200" />
        </div>
      </div>
      {children}
    </div>
  </div>
)

// Animated number component
const AnimatedNumber = ({ value, duration = 1000 }: { value: number, duration?: number }) => {
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    let startTime: number
    let animationFrame: number

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)
      
      setDisplayValue(Math.floor(progress * value))
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrame)
  }, [value, duration])

  return <span>{displayValue.toLocaleString()}</span>
}

export default function ChartsSection({ stats }: ChartsSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [selectedMetric, setSelectedMetric] = useState<'count' | 'amount'>('count')

  // Prepare data for charts with enhanced styling
  const qualificationStatusData = [
    { name: 'Aprobadas', value: stats.overview.qualifications.approved, color: '#10B981', gradient: GRADIENT_COLORS.success },
    { name: 'Pendientes', value: stats.overview.qualifications.pending, color: '#F59E0B', gradient: GRADIENT_COLORS.warning },
    { name: 'Rechazadas', value: stats.overview.qualifications.rejected, color: '#EF4444', gradient: GRADIENT_COLORS.danger },
    { 
      name: 'Borradores', 
      value: stats.overview.qualifications.total - stats.overview.qualifications.approved - stats.overview.qualifications.pending - stats.overview.qualifications.rejected, 
      color: '#6B7280',
      gradient: ['#6B7280', '#9CA3AF']
    }
  ].filter(item => item.value > 0)

  const countryData = stats.byCountry.map((item, index) => {
    const country = COUNTRIES[item.country as keyof typeof COUNTRIES]
    return {
      country: country?.name || item.country,
      flag: country?.flag || '🏴',
      count: item.count,
      amount: item.totalAmount,
      calculatedValue: item.totalCalculatedValue,
      percentage: stats.overview.qualifications.total > 0 
        ? (item.count / stats.overview.qualifications.total * 100).toFixed(1) 
        : '0',
      fill: MODERN_COLORS[index % MODERN_COLORS.length]
    }
  })

  const monthlyData = stats.monthlyTrends.map(item => ({
    month: new Date(item.month).toLocaleDateString('es', { month: 'short', year: 'numeric' }),
    calificaciones: item.count,
    monto: item.total_amount / 1000
  }))

  const topEmisorsData = stats.topEmisors.slice(0, 8).map((item, index) => ({
    name: item.name.length > 15 ? item.name.substring(0, 15) + '...' : item.name,
    fullName: item.name,
    count: item.count,
    amount: item.totalAmount,
    fill: MODERN_COLORS[index % MODERN_COLORS.length]
  }))

  // Radial data for overview
  const radialData = [
    { 
      name: 'Cumplimiento', 
      value: parseFloat(stats.overview.taxReturns.complianceRate) || 0,
      fill: '#10B981'
    },
    { 
      name: 'Verificación', 
      value: parseFloat(stats.overview.taxPayments.verificationRate) || 0,
      fill: '#3B82F6'
    },
    { 
      name: 'Aprobación', 
      value: parseFloat(stats.overview.qualifications.approvalRate) || 0,
      fill: '#8B5CF6'
    }
  ]

  const importStatsData = [
    { name: 'Exitosos', value: stats.imports.successfulRecords, color: '#10B981' },
    { name: 'Fallidos', value: stats.imports.failedRecords, color: '#EF4444' }
  ]

  return (
    <div className="space-y-8">
      {/* KPI Radial Gauges */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {radialData.map((item, index) => (
          <GlassCard key={item.name} title={item.name} className="text-center">
            <div className="relative">
              <ResponsiveContainer width="100%" height={180}>
                <RadialBarChart 
                  cx="50%" 
                  cy="50%" 
                  innerRadius="60%" 
                  outerRadius="90%" 
                  barSize={12} 
                  data={[item]}
                  startAngle={180}
                  endAngle={0}
                >
                  <defs>
                    <linearGradient id={`gradient-${index}`} x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor={item.fill} stopOpacity={0.8} />
                      <stop offset="100%" stopColor={item.fill} stopOpacity={1} />
                    </linearGradient>
                  </defs>
                  <RadialBar
                    dataKey="value"
                    cornerRadius={10}
                    fill={`url(#gradient-${index})`}
                    background={{ fill: '#f3f4f6' }}
                  />
                </RadialBarChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-gray-800">
                  <AnimatedNumber value={item.value} />%
                </span>
                <span className="text-sm text-gray-500">del total</span>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Interactive Donut Chart */}
        <GlassCard title="Estado de Calificaciones">
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <defs>
                {qualificationStatusData.map((entry, index) => (
                  <linearGradient key={`gradient-pie-${index}`} id={`colorPie${index}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={entry.gradient[0]} stopOpacity={0.9}/>
                    <stop offset="95%" stopColor={entry.gradient[1]} stopOpacity={0.9}/>
                  </linearGradient>
                ))}
              </defs>
              <Pie
                activeIndex={activeIndex}
                activeShape={renderActiveShape}
                data={qualificationStatusData}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={100}
                paddingAngle={4}
                dataKey="value"
                onMouseEnter={(_, index) => setActiveIndex(index)}
              >
                {qualificationStatusData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={`url(#colorPie${index})`}
                    stroke="none"
                    style={{ 
                      filter: index === activeIndex ? 'drop-shadow(0 8px 16px rgba(0,0,0,0.2))' : 'none',
                      transition: 'all 0.3s ease'
                    }}
                  />
                ))}
              </Pie>
              <Tooltip content={<ModernTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          {/* Legend */}
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            {qualificationStatusData.map((item, index) => (
              <div 
                key={item.name}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full cursor-pointer transition-all duration-300 ${
                  index === activeIndex 
                    ? 'bg-gray-100 shadow-md scale-105' 
                    : 'hover:bg-gray-50'
                }`}
                onMouseEnter={() => setActiveIndex(index)}
              >
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ background: `linear-gradient(135deg, ${item.gradient[0]}, ${item.gradient[1]})` }}
                />
                <span className="text-sm font-medium text-gray-700">{item.name}</span>
                <span className="text-sm font-bold text-gray-900">{item.value}</span>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Animated Bar Chart with Toggle */}
        <GlassCard title="Distribución por País">
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setSelectedMetric('count')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                selectedMetric === 'count'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Por Cantidad
            </button>
            <button
              onClick={() => setSelectedMetric('amount')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                selectedMetric === 'amount'
                  ? 'bg-gradient-to-r from-green-500 to-teal-500 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Por Monto
            </button>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={countryData} layout="vertical" barCategoryGap="20%">
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#667eea" />
                  <stop offset="100%" stopColor="#764ba2" />
                </linearGradient>
                <linearGradient id="barGradient2" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#11998e" />
                  <stop offset="100%" stopColor="#38ef7d" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={false} />
              <XAxis 
                type="number" 
                tick={{ fill: '#6b7280', fontSize: 12 }}
                axisLine={{ stroke: '#e5e7eb' }}
              />
              <YAxis 
                type="category" 
                dataKey="country" 
                width={100}
                tick={{ fill: '#374151', fontSize: 12, fontWeight: 500 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<ModernTooltip />} />
              <Bar 
                dataKey={selectedMetric} 
                fill={selectedMetric === 'count' ? 'url(#barGradient)' : 'url(#barGradient2)'}
                radius={[0, 8, 8, 0]}
                animationDuration={800}
                animationEasing="ease-out"
              />
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>
      </div>

      {/* Monthly Trends - Full Width */}
      {monthlyData.length > 0 && (
        <GlassCard title="Tendencias Mensuales" className="col-span-full">
          <ResponsiveContainer width="100%" height={380}>
            <ComposedChart data={monthlyData}>
              <defs>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#667eea" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#667eea" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#11998e" />
                  <stop offset="100%" stopColor="#38ef7d" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
              <XAxis 
                dataKey="month" 
                tick={{ fill: '#6b7280', fontSize: 12 }}
                axisLine={{ stroke: '#e5e7eb' }}
                tickLine={false}
              />
              <YAxis 
                yAxisId="left"
                tick={{ fill: '#6b7280', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                yAxisId="right" 
                orientation="right"
                tick={{ fill: '#6b7280', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<ModernTooltip />} />
              <Legend 
                wrapperStyle={{ paddingTop: 20 }}
                formatter={(value) => <span className="text-gray-700 font-medium">{value}</span>}
              />
              <Area 
                yAxisId="left"
                type="monotone" 
                dataKey="calificaciones" 
                stroke="#667eea" 
                strokeWidth={3}
                fill="url(#areaGradient)"
                name="Calificaciones"
                animationDuration={1200}
                dot={{ fill: '#667eea', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 8, stroke: '#667eea', strokeWidth: 2, fill: '#fff' }}
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="monto" 
                stroke="url(#lineGradient)"
                strokeWidth={3}
                name="Monto (Miles USD)"
                dot={{ fill: '#11998e', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 8, stroke: '#11998e', strokeWidth: 2, fill: '#fff' }}
                animationDuration={1500}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </GlassCard>
      )}

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Emisors with Horizontal Bars */}
        {topEmisorsData.length > 0 && (
          <GlassCard title="Top Emisores">
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={topEmisorsData} layout="vertical" barCategoryGap="15%">
                <defs>
                  {topEmisorsData.map((entry, index) => (
                    <linearGradient key={`emisorGradient${index}`} id={`emisorGradient${index}`} x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor={entry.fill} stopOpacity={0.9} />
                      <stop offset="100%" stopColor={entry.fill} stopOpacity={0.6} />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={false} />
                <XAxis 
                  type="number"
                  tick={{ fill: '#6b7280', fontSize: 11 }}
                  axisLine={{ stroke: '#e5e7eb' }}
                />
                <YAxis 
                  type="category"
                  dataKey="name"
                  width={100}
                  tick={{ fill: '#374151', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload
                      return (
                        <div className="bg-white/95 backdrop-blur-lg rounded-xl shadow-2xl border border-gray-100 p-4">
                          <p className="text-gray-900 font-semibold text-sm mb-2">{data.fullName}</p>
                          <p className="text-sm text-gray-600">
                            <span className="font-bold text-gray-900">{data.count}</span> calificaciones
                          </p>
                          <p className="text-sm text-gray-600">
                            Monto: <span className="font-bold text-gray-900">${data.amount.toLocaleString()}</span>
                          </p>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Bar 
                  dataKey="count" 
                  name="Calificaciones"
                  radius={[0, 8, 8, 0]}
                  animationDuration={1000}
                >
                  {topEmisorsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={`url(#emisorGradient${index})`} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </GlassCard>
        )}

        {/* Import Statistics with Donut */}
        <GlassCard title="Estadísticas de Importación">
          <div className="flex flex-col items-center">
            <div className="relative">
              <ResponsiveContainer width={250} height={220}>
                <PieChart>
                  <defs>
                    <linearGradient id="successGradient" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#11998e" />
                      <stop offset="100%" stopColor="#38ef7d" />
                    </linearGradient>
                    <linearGradient id="failGradient" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#eb3349" />
                      <stop offset="100%" stopColor="#f45c43" />
                    </linearGradient>
                  </defs>
                  <Pie
                    data={importStatsData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                    animationDuration={1000}
                    animationEasing="ease-out"
                  >
                    <Cell fill="url(#successGradient)" stroke="none" />
                    <Cell fill="url(#failGradient)" stroke="none" />
                  </Pie>
                  <Tooltip content={<ModernTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-gray-800">
                  <AnimatedNumber value={stats.imports.totalRecords} />
                </span>
                <span className="text-sm text-gray-500">Registros</span>
              </div>
            </div>
            
            {/* Stats below chart */}
            <div className="w-full grid grid-cols-2 gap-4 mt-4">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 text-center border border-green-200/50">
                <div className="text-2xl font-bold text-green-600">
                  <AnimatedNumber value={stats.imports.successfulRecords} />
                </div>
                <div className="text-sm text-green-700 font-medium">Exitosos</div>
                <div className="text-xs text-green-600 mt-1">{stats.imports.successRate}%</div>
              </div>
              <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-4 text-center border border-red-200/50">
                <div className="text-2xl font-bold text-red-600">
                  <AnimatedNumber value={stats.imports.failedRecords} />
                </div>
                <div className="text-sm text-red-700 font-medium">Fallidos</div>
                <div className="text-xs text-red-600 mt-1">
                  {((stats.imports.failedRecords / stats.imports.totalRecords) * 100 || 0).toFixed(1)}%
                </div>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  )
}