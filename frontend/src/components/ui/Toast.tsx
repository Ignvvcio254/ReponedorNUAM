'use client'

import { useEffect } from 'react'
import { XMarkIcon, CheckCircleIcon, ExclamationCircleIcon, InformationCircleIcon } from '@heroicons/react/24/outline'

export type ToastType = 'success' | 'error' | 'info' | 'warning'

interface ToastProps {
  message: string
  type?: ToastType
  duration?: number
  onClose: () => void
}

export default function Toast({ message, type = 'info', duration = 5000, onClose }: ToastProps) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose()
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [duration, onClose])

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-green-50 border-green-200',
          icon: 'text-green-600',
          text: 'text-green-800',
          IconComponent: CheckCircleIcon,
        }
      case 'error':
        return {
          bg: 'bg-red-50 border-red-200',
          icon: 'text-red-600',
          text: 'text-red-800',
          IconComponent: ExclamationCircleIcon,
        }
      case 'warning':
        return {
          bg: 'bg-yellow-50 border-yellow-200',
          icon: 'text-yellow-600',
          text: 'text-yellow-800',
          IconComponent: ExclamationCircleIcon,
        }
      default:
        return {
          bg: 'bg-blue-50 border-blue-200',
          icon: 'text-blue-600',
          text: 'text-blue-800',
          IconComponent: InformationCircleIcon,
        }
    }
  }

  const styles = getTypeStyles()
  const Icon = styles.IconComponent

  return (
    <div
      className={`
        ${styles.bg} ${styles.text}
        border rounded-lg shadow-lg p-4
        flex items-start gap-3
        min-w-[320px] max-w-md
        animate-slide-in-right
      `}
      role="alert"
    >
      <Icon className={`h-6 w-6 ${styles.icon} flex-shrink-0`} />
      <div className="flex-1">
        <p className="text-sm font-medium">{message}</p>
      </div>
      <button
        onClick={onClose}
        className={`${styles.icon} hover:opacity-70 transition-opacity flex-shrink-0`}
        aria-label="Cerrar notificación"
      >
        <XMarkIcon className="h-5 w-5" />
      </button>
    </div>
  )
}
