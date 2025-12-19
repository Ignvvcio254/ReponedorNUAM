'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { api } from '@/lib/api'
import { COUNTRIES, TAX_FACTORS, PERIODS } from '@/lib/constants'
import { useToast } from '@/components/ui/ToastContainer'

interface QualificationFormProps {
  onSuccess?: () => void
  initialData?: any
}

export function QualificationForm({ onSuccess, initialData }: QualificationFormProps) {
  const toast = useToast()
  const [formData, setFormData] = useState({
    emisorId: initialData?.emisorId || '',
    emisorName: initialData?.emisorName || '',
    period: initialData?.period || '',
    amount: initialData?.amount || '',
    country: initialData?.country || 'CL',
    taxId: initialData?.taxId || ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Calcular factor automáticamente
      const factor = TAX_FACTORS[formData.country as keyof typeof TAX_FACTORS]
      const factorValue = Object.values(factor)[0] as number

      const payload = {
        emisorId: formData.emisorId || 'temp-' + Date.now(),
        emisorName: formData.emisorName,
        period: formData.period,
        amount: parseFloat(formData.amount),
        factorApplied: factorValue,
        country: formData.country,
        taxId: formData.taxId
      }

      await api.qualifications.create(payload)
      
      if (onSuccess) {
        onSuccess()
      }
      
      // Limpiar formulario
      setFormData({
        emisorId: '',
        emisorName: '',
        period: '',
        amount: '',
        country: 'CL',
        taxId: ''
      })

      toast.success('Calificación creada exitosamente')
    } catch (err: any) {
      setError(err.message || 'Error al crear la calificación')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Nueva Calificación Tributaria</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                País
              </label>
              <select
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="nuam-input"
                required
              >
                {Object.entries(COUNTRIES).map(([code, country]) => (
                  <option key={code} value={code}>
                    {country.flag} {country.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                RUT/ID Tributario
              </label>
              <Input
                name="taxId"
                value={formData.taxId}
                onChange={handleChange}
                placeholder="76.123.456-7"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre del Emisor
            </label>
            <Input
              name="emisorName"
              value={formData.emisorName}
              onChange={handleChange}
              placeholder="Empresa Ejemplo S.A."
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Período
              </label>
              <select
                name="period"
                value={formData.period}
                onChange={handleChange}
                className="nuam-input"
                required
              >
                <option value="">Seleccionar período</option>
                {PERIODS.map(period => (
                  <option key={period} value={period}>
                    {period}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Monto ({COUNTRIES[formData.country as keyof typeof COUNTRIES].currency})
              </label>
              <Input
                name="amount"
                type="number"
                value={formData.amount}
                onChange={handleChange}
                placeholder="150000"
                required
              />
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-700 mb-2">Información del Factor</h4>
            <p className="text-sm text-gray-600">
              Factor aplicable: {TAX_FACTORS[formData.country as keyof typeof TAX_FACTORS] ? 
                Object.keys(TAX_FACTORS[formData.country as keyof typeof TAX_FACTORS])[0] : ''} = {' '}
              {TAX_FACTORS[formData.country as keyof typeof TAX_FACTORS] ? 
                Object.values(TAX_FACTORS[formData.country as keyof typeof TAX_FACTORS])[0] as number : 0}
            </p>
            {formData.amount && (
              <p className="text-sm text-gray-600 mt-1">
                Valor calculado: {(parseFloat(formData.amount) / 
                  (TAX_FACTORS[formData.country as keyof typeof TAX_FACTORS] ? 
                    Object.values(TAX_FACTORS[formData.country as keyof typeof TAX_FACTORS])[0] as number : 1)
                ).toFixed(6)}
              </p>
            )}
          </div>

          <div className="flex gap-2">
            <Button
              type="submit"
              disabled={loading}
              className="flex-1"
            >
              {loading ? 'Guardando...' : 'Crear Calificación'}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setFormData({
                emisorId: '',
                emisorName: '',
                period: '',
                amount: '',
                country: 'CL',
                taxId: ''
              })}
            >
              Limpiar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
