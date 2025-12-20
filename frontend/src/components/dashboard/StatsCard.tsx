'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

interface StatsCardProps {
  title: string
  value: string | number
  description?: string
  icon?: React.ReactNode
  trend?: {
    value: number
    isPositive: boolean
  }
  gradient?: string
  delay?: number
}

// Animated Counter Hook
function useAnimatedCounter(end: number, duration: number = 1000) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    // Only animate numbers
    if (typeof end !== 'number') return

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

export function StatsCard({ 
  title, 
  value, 
  description, 
  icon, 
  trend,
  gradient = 'from-blue-400 to-indigo-500',
  delay = 0
}: StatsCardProps) {
  const [isVisible, setIsVisible] = useState(false)
  const numericValue = typeof value === 'number' ? value : 0
  const animatedValue = useAnimatedCounter(numericValue, 1200)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay)
    return () => clearTimeout(timer)
  }, [delay])

  return (
    <div 
      className={cn(
        "relative overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-lg",
        "hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1",
        isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      )}
    >
      {/* Gradient decoration */}
      <div className={cn(
        "absolute top-0 right-0 w-32 h-32 rounded-full blur-2xl",
        "-translate-y-1/2 translate-x-1/2 opacity-10",
        `bg-gradient-to-br ${gradient}`
      )} />
      
      <div className="relative p-6">
        <div className="flex items-center justify-between space-y-0 pb-2">
          <h3 className="tracking-tight text-sm font-medium text-gray-500">
            {title}
          </h3>
          {icon && (
            <div className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center shadow-lg",
              `bg-gradient-to-br ${gradient}`
            )}>
              <div className="text-white">
                {icon}
              </div>
            </div>
          )}
        </div>
        <div>
          <div className="text-3xl font-bold text-gray-900">
            {typeof value === 'number' ? animatedValue.toLocaleString() : value}
          </div>
          {description && (
            <p className="text-sm text-gray-500 mt-1">
              {description}
            </p>
          )}
          {trend && (
            <div className="flex items-center pt-2 gap-1">
              <div className={cn(
                "flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-medium",
                trend.isPositive 
                  ? "bg-green-100 text-green-700" 
                  : "bg-red-100 text-red-700"
              )}>
                <svg 
                  className={cn("w-3 h-3", !trend.isPositive && "rotate-180")} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
                <span>{Math.abs(trend.value)}%</span>
              </div>
              <span className="text-xs text-gray-500">vs último mes</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default StatsCard
