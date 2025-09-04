import { Card, CardContent } from '@/components/ui/Card'

interface StatsCardProps {
  title: string
  value: string | number
  description?: string
  icon?: React.ReactNode
  trend?: {
    value: number
    isPositive: boolean
  }
}

export function StatsCard({ title, value, description, icon, trend }: StatsCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between space-y-0 pb-2">
          <h3 className="tracking-tight text-sm font-medium text-gray-600">
            {title}
          </h3>
          {icon && (
            <div className="h-4 w-4 text-gray-400">
              {icon}
            </div>
          )}
        </div>
        <div>
          <div className="text-2xl font-bold text-gray-900">{value}</div>
          {description && (
            <p className="text-xs text-gray-500 mt-1">
              {description}
            </p>
          )}
          {trend && (
            <div className="flex items-center pt-1">
              <span
                className={clsx(
                  'text-xs font-medium',
                  trend.isPositive ? 'text-green-600' : 'text-red-600'
                )}
              >
                {trend.isPositive ? '+' : '-'}{Math.abs(trend.value)}%
              </span>
              <span className="text-xs text-gray-500 ml-1">vs último mes</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
