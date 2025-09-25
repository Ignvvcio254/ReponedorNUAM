'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
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

interface QualificationFormProps {
  onSubmit: (data: QualificationFormData & { calculatedValue: number }) => void
  onCancel: () => void
  isLoading?: boolean
}

export default function QualificationFormNew({ onSubmit, onCancel, isLoading = false }: QualificationFormProps) {
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

  // Calcular valor cuando cambian el monto o país
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

  // Generar períodos disponibles (últimos 12 meses)
  const generatePeriods = () => {
    const periods = []
    const now = new Date()
    for (let i = 0; i < 12; i++) {
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

    // Auto-ajustar moneda según país
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

    // Validar formato de período
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
    <Card className="max-w-3xl mx-auto p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Nueva Calificación Tributaria</h2>
        <p className="text-gray-600 mt-2">Registra una nueva calificación en el contenedor tributario</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Información del Emisor */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre del Emisor *
            </label>
            <Input
              value={formData.emisorName}
              onChange={(e) => handleChange('emisorName', e.target.value)}
              error={errors.emisorName}
              placeholder="Ej: Empresa S.A."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ID Tributario
            </label>
            <Input
              value={formData.taxId}
              onChange={(e) => handleChange('taxId', e.target.value)}
              error={errors.taxId}
              placeholder="Ej: 76.123.456-7"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              País *
            </label>
            <select
              value={formData.country}
              onChange={(e) => handleChange('country', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.country ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Seleccionar país</option>
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
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.period ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Seleccionar período</option>
              {generatePeriods().map(period => (
                <option key={period} value={period}>{period}</option>
              ))}
            </select>
            {errors.period && (
              <p className="text-red-500 text-sm mt-1">{errors.period}</p>
            )}
          </div>
        </div>

        {/* Información Financiera */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Monto *
            </label>
            <Input
              type="number"
              step="0.01"
              min="0"
              value={formData.amount}
              onChange={(e) => handleChange('amount', e.target.value)}
              error={errors.amount}
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Moneda *
            </label>
            <Input
              value={formData.currency}
              onChange={(e) => handleChange('currency', e.target.value)}
              error={errors.currency}
              placeholder="USD"
              disabled={!!selectedCountry}
            />
          </div>
        </div>

        {/* Cálculo Automático */}
        {calculatedValue !== null && taxFactor && selectedCountry && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-blue-800 mb-2">Cálculo Automático</h3>
            <div className="space-y-2 text-sm text-blue-700">
              <div className="flex justify-between">
                <span>Monto:</span>
                <span className="font-medium">{parseFloat(formData.amount).toLocaleString()} {formData.currency}</span>
              </div>
              <div className="flex justify-between">
                <span>Factor {factorName} ({selectedCountry.name}):</span>
                <span className="font-medium">{taxFactor.toLocaleString()}</span>
              </div>
              <div className="flex justify-between border-t border-blue-300 pt-2">
                <span className="font-medium">Valor Calculado:</span>
                <span className="font-bold">{Number(calculatedValue).toFixed(6)} {factorName}</span>
              </div>
            </div>
          </div>
        )}

        {/* Información Adicional */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Observaciones
          </label>
          <textarea
            value={formData.observations}
            onChange={(e) => handleChange('observations', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Comentarios adicionales sobre la calificación..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            URL del Documento
          </label>
          <Input
            type="url"
            value={formData.documentUrl}
            onChange={(e) => handleChange('documentUrl', e.target.value)}
            placeholder="https://..."
          />
        </div>

        {/* Botones */}
        <div className="flex justify-end space-x-4 pt-6 border-t">
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={isLoading || calculatedValue === null}
          >
            {isLoading ? 'Creando...' : 'Crear Calificación'}
          </Button>
        </div>
      </form>
    </Card>
  )
}