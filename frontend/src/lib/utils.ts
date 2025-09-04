import { clsx, type ClassValue } from 'clsx'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

export function formatCurrency(amount: number, country: 'CL' | 'PE' | 'CO' = 'CL') {
  const locales = {
    CL: 'es-CL',
    PE: 'es-PE', 
    CO: 'es-CO'
  }
  
  const currencies = {
    CL: 'CLP',
    PE: 'PEN',
    CO: 'COP'
  }
  
  return new Intl.NumberFormat(locales[country], {
    style: 'currency',
    currency: currencies[country],
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

export function formatDate(date: string | Date) {
  return new Intl.DateTimeFormat('es', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date(date))
}

export function formatPeriod(period: string) {
  const [year, month] = period.split('-')
  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ]
  
  return ${monthNames[parseInt(month) - 1]} 
}

export function getCountryFlag(country: 'CL' | 'PE' | 'CO') {
  const flags = {
    CL: '',
    PE: '',
    CO: ''
  }
  return flags[country]
}

export function getStatusColor(status: string) {
  const colors = {
    DRAFT: 'bg-gray-100 text-gray-800',
    PENDING: 'bg-yellow-100 text-yellow-800',
    APPROVED: 'bg-green-100 text-green-800',
    REJECTED: 'bg-red-100 text-red-800'
  }
  return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'
}

export function generateId() {
  return Math.random().toString(36).substr(2, 9)
}
