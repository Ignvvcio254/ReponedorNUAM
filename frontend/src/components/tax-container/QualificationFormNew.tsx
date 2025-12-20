'use client'

import { useState, useEffect } from 'react'
import { ArrowLeftIcon, DocumentTextIcon, CalculatorIcon, CheckCircleIcon } from '@heroicons/react/24/outline'
import { COUNTRIES, TAX_FACTORS } from '@/lib/constants'

interface QualificationFormData {
  emisorName: string
  taxId: string
  country: string
  period: string
  amount: string
  currency: string
  observations: string
  documentUrl: string
}

interface InitialData {
  id?: string
  emisorName: string
  taxId?: string
  country: string
  period: string
  amount: number
  currency: string
  observations?: string
  documentUrl?: string
}

interface QualificationFormProps {
  onSubmit: (data: QualificationFormData & { calculatedValue: number }) => void
  onCancel: () => void
  isLoading?: boolean
  initialData?: InitialData | null
}

export default function QualificationFormNew({ onSubmit, onCancel, isLoading = false, initialData = null }: QualificationFormProps) {
  const isEditMode = !!initialData

  const [formData, setFormData] = useState<QualificationFormData>({
    emisorName: '',
    taxId: '',
    country: '',
    period: '',
    amount: '',
    currency: 'USD',
    observations: '',
    documentUrl: ''
  })

  const [errors, setErrors] = useState<Partial<QualificationFormData>>({})
  const [calculatedValue, setCalculatedValue] = useState<number | null>(null)
  const [taxFactor, setTaxFactor] = useState<number | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  // Initialize form with data if editing
  useEffect(() => {
    if (initialData) {
      setFormData({
        emisorName: initialData.emisorName || '',
        taxId: initialData.taxId || '',
        country: initialData.country || '',
        period: initialData.period || '',
        amount: initialData.amount?.toString() || '',
        currency: initialData.currency || 'USD',
        observations: initialData.observations || '',
        documentUrl: initialData.documentUrl || ''
      })
    }
    setIsVisible(true)
  }, [initialData])

  // Calculate value when amount or country changes
  useEffect(() => {
    if (formData.amount && formData.country) {
      const amount = parseFloat(formData.amount)
      if (!isNaN(amount) && amount > 0) {
        const countryFactors = TAX_FACTORS[formData.country as keyof typeof TAX_FACTORS]
        if (countryFactors) {
          const factor = Object.values(countryFactors)[0] as number
          setTaxFactor(factor)
          setCalculatedValue(amount / factor)
        }
      }
    } else {
      setCalculatedValue(null)
      setTaxFactor(null)
    }
  }, [formData.amount, formData.country])

  // Generate available periods (last 24 months)
  const generatePeriods = () => {
    const periods = []
    const now = new Date()
    for (let i = 0; i < 24; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const year = date.getFullYear()
      const month = (date.getMonth() + 1).toString().padStart(2, '0')
      periods.push(`${year}-${month}`)
    }
    return periods
  }

  const handleChange = (field: keyof QualificationFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }

    // Auto-adjust currency based on country
    if (field === 'country' && value) {
      const country = COUNTRIES[value as keyof typeof COUNTRIES]
      if (country) {
        setFormData(prev => ({ ...prev, currency: country.currency }))
      }
    }
  }

  const validateForm = () => {
    const newErrors: Partial<QualificationFormData> = {}

    if (!formData.emisorName.trim()) newErrors.emisorName = 'Nombre del emisor es requerido'
    if (!formData.country) newErrors.country = 'País es requerido'
    if (!formData.period) newErrors.period = 'Período es requerido'
    if (!formData.amount.trim()) {
      newErrors.amount = 'Monto es requerido'
    } else {
      const amount = parseFloat(formData.amount)
      if (isNaN(amount) || amount <= 0) {
        newErrors.amount = 'Monto debe ser un número válido mayor a 0'
      }
    }
    if (!formData.currency) newErrors.currency = 'Moneda es requerida'

    if (formData.period && !/^\d{4}-\d{2}$/.test(formData.period)) {
      newErrors.period = 'Período debe estar en formato YYYY-MM'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm() && calculatedValue !== null) {
      onSubmit({
        ...formData,
        calculatedValue
      })
    }
  }

  const selectedCountry = formData.country ? COUNTRIES[formData.country as keyof typeof COUNTRIES] : null
  const factorName = selectedCountry ? selectedCountry.factor : ''

  return (
    <div className={`transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      {/* Header */}
      <div className="mb-8">
        <button
          type="button"
          onClick={onCancel}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium mb-4 transition-colors"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          Volver a Calificaciones
        </button>
        
        <div className="flex items-center gap-4">
          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${isEditMode ? 'from-blue-500 to-indigo-600' : 'from-green-500 to-emerald-600'} flex items-center justify-center shadow-lg`}>
            {isEditMode ? (
              <DocumentTextIcon className="w-7 h-7 text-white" />
            ) : (
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isEditMode ? 'Editar Calificación Tributaria' : 'Nueva Calificación Tributaria'}
            </h1>
            <p className="text-gray-500">
              {isEditMode 
                ? 'Modifica los datos de la calificación existente' 
                : 'Registra una nueva calificación en el contenedor tributario'
              }
            </p>
          </div>
        </div>
      </div>

      {/* Form Card */}
      <div className="relative overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-lg">
        <div className={`absolute top-0 left-0 right-0 h-24 bg-gradient-to-br ${isEditMode ? 'from-blue-500 to-indigo-600' : 'from-green-500 to-emerald-600'} opacity-5`} />
        
        <form onSubmit={handleSubmit} className="relative p-6 sm:p-8">
          {/* Section: Issuer Info */}
          <div className="mb-8">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-800 mb-4 uppercase tracking-wider">
              <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">1</span>
              Información del Emisor
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre del Emisor *
                </label>
                <input
                  type="text"
                  value={formData.emisorName}
                  onChange={(e) => handleChange('emisorName', e.target.value)}
                  placeholder="Ej: Empresa Internacional S.A."
                  className={`w-full px-4 py-3 rounded-xl border transition-all focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${
                    errors.emisorName ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:bg-white bg-gray-50'
                  }`}
                />
                {errors.emisorName && (
                  <p className="text-red-500 text-sm mt-1">{errors.emisorName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ID Tributario (RUT/RUC/RFC)
                </label>
                <input
                  type="text"
                  value={formData.taxId}
                  onChange={(e) => handleChange('taxId', e.target.value)}
                  placeholder="Ej: 76.123.456-7"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all"
                />
              </div>
            </div>
          </div>

          {/* Section: Classification */}
          <div className="mb-8">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-800 mb-4 uppercase tracking-wider">
              <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs font-bold">2</span>
              Clasificación
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  País *
                </label>
                <select
                  value={formData.country}
                  onChange={(e) => handleChange('country', e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border transition-all focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${
                    errors.country ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:bg-white bg-gray-50'
                  }`}
                >
                  <option value="">🌍 Seleccionar país</option>
                  {Object.values(COUNTRIES).map(country => (
                    <option key={country.code} value={country.code}>
                      {country.flag} {country.name}
                    </option>
                  ))}
                </select>
                {errors.country && (
                  <p className="text-red-500 text-sm mt-1">{errors.country}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Período *
                </label>
                <select
                  value={formData.period}
                  onChange={(e) => handleChange('period', e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border transition-all focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${
                    errors.period ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:bg-white bg-gray-50'
                  }`}
                >
                  <option value="">📅 Seleccionar período</option>
                  {generatePeriods().map(period => (
                    <option key={period} value={period}>{period}</option>
                  ))}
                </select>
                {errors.period && (
                  <p className="text-red-500 text-sm mt-1">{errors.period}</p>
                )}
              </div>
            </div>
          </div>

          {/* Section: Financial Info */}
          <div className="mb-8">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-800 mb-4 uppercase tracking-wider">
              <span className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs font-bold">3</span>
              Información Financiera
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Monto *
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">
                    {formData.currency || '$'}
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.amount}
                    onChange={(e) => handleChange('amount', e.target.value)}
                    placeholder="0.00"
                    className={`w-full pl-14 pr-4 py-3 rounded-xl border transition-all focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${
                      errors.amount ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:bg-white bg-gray-50'
                    }`}
                  />
                </div>
                {errors.amount && (
                  <p className="text-red-500 text-sm mt-1">{errors.amount}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Moneda *
                </label>
                <input
                  type="text"
                  value={formData.currency}
                  onChange={(e) => handleChange('currency', e.target.value)}
                  placeholder="USD"
                  disabled={!!selectedCountry}
                  className={`w-full px-4 py-3 rounded-xl border border-gray-200 transition-all ${
                    selectedCountry ? 'bg-gray-100 text-gray-600 cursor-not-allowed' : 'bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500'
                  }`}
                />
                {selectedCountry && (
                  <p className="text-xs text-gray-400 mt-1">Moneda ajustada automáticamente según el país</p>
                )}
              </div>
            </div>

            {/* Auto Calculation */}
            {calculatedValue !== null && taxFactor && selectedCountry && (
              <div className="mt-6 p-5 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100">
                <div className="flex items-center gap-2 mb-3">
                  <CalculatorIcon className="w-5 h-5 text-emerald-600" />
                  <h4 className="text-sm font-semibold text-emerald-800">Cálculo Automático</h4>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-emerald-700">
                    <span>Monto:</span>
                    <span className="font-medium">{parseFloat(formData.amount).toLocaleString()} {formData.currency}</span>
                  </div>
                  <div className="flex justify-between text-emerald-700">
                    <span>Factor {factorName} ({selectedCountry.name}):</span>
                    <span className="font-medium">{taxFactor.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between border-t border-emerald-200 pt-2">
                    <span className="font-semibold text-emerald-800">Valor Calculado:</span>
                    <span className="font-bold text-emerald-900">{Number(calculatedValue).toFixed(6)} {factorName}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section: Additional Info */}
          <div className="mb-8">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-800 mb-4 uppercase tracking-wider">
              <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-xs font-bold">4</span>
              Información Adicional
            </h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Observaciones
                </label>
                <textarea
                  value={formData.observations}
                  onChange={(e) => handleChange('observations', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all resize-none"
                  placeholder="Comentarios adicionales sobre la calificación..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL del Documento
                </label>
                <input
                  type="url"
                  value={formData.documentUrl}
                  onChange={(e) => handleChange('documentUrl', e.target.value)}
                  placeholder="https://..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-6 border-t border-gray-100">
            <button
              type="button"
              onClick={onCancel}
              disabled={isLoading}
              className="px-6 py-3 text-gray-700 font-medium bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading || calculatedValue === null}
              className={`flex items-center justify-center gap-2 px-8 py-3 text-white font-medium rounded-xl transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed ${
                isEditMode 
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700' 
                  : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700'
              }`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  {isEditMode ? 'Guardando...' : 'Creando...'}
                </>
              ) : (
                <>
                  <CheckCircleIcon className="w-5 h-5" />
                  {isEditMode ? 'Guardar Cambios' : 'Crear Calificación'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}