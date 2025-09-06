'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { COUNTRIES } from '@/lib/constants'

interface TaxEntityFormData {
  businessName: string
  tradeName: string
  taxId: string
  entityType: string
  country: string
  state: string
  city: string
  address: string
  postalCode: string
  taxRegime: string
  economicActivity: string
  naicsCode: string
}

interface TaxEntityFormProps {
  onSubmit: (data: TaxEntityFormData) => void
  onCancel: () => void
  isLoading?: boolean
}

const ENTITY_TYPES = [
  { value: 'CORPORATION', label: 'Corporación' },
  { value: 'LLC', label: 'Sociedad de Responsabilidad Limitada' },
  { value: 'PARTNERSHIP', label: 'Sociedad' },
  { value: 'SOLE_PROPRIETOR', label: 'Persona Natural' },
  { value: 'NGO', label: 'Organización Sin Fines de Lucro' },
  { value: 'GOVERNMENT', label: 'Entidad Gubernamental' },
  { value: 'FOREIGN', label: 'Entidad Extranjera' }
]

const TAX_REGIMES = [
  { value: 'GENERAL', label: 'Régimen General' },
  { value: 'SIMPLIFIED', label: 'Régimen Simplificado' },
  { value: 'SPECIAL', label: 'Régimen Especial' },
  { value: 'EXEMPT', label: 'Exento' },
  { value: 'SMALL_BUSINESS', label: 'Pequeña Empresa' },
  { value: 'MONOTAX', label: 'Monotributo' },
  { value: 'SIMPLES', label: 'Simples Nacional' }
]

export default function TaxEntityForm({ onSubmit, onCancel, isLoading = false }: TaxEntityFormProps) {
  const [formData, setFormData] = useState<TaxEntityFormData>({
    businessName: '',
    tradeName: '',
    taxId: '',
    entityType: '',
    country: '',
    state: '',
    city: '',
    address: '',
    postalCode: '',
    taxRegime: '',
    economicActivity: '',
    naicsCode: ''
  })

  const [errors, setErrors] = useState<Partial<TaxEntityFormData>>({})

  const handleChange = (field: keyof TaxEntityFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors: Partial<TaxEntityFormData> = {}

    if (!formData.businessName.trim()) newErrors.businessName = 'Razón social es requerida'
    if (!formData.taxId.trim()) newErrors.taxId = 'ID tributario es requerido'
    if (!formData.entityType) newErrors.entityType = 'Tipo de entidad es requerido'
    if (!formData.country) newErrors.country = 'País es requerido'
    if (!formData.taxRegime) newErrors.taxRegime = 'Régimen tributario es requerido'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit(formData)
    }
  }

  return (
    <Card className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Nueva Entidad Tributaria</h2>
        <p className="text-gray-600 mt-2">Registra una nueva entidad en el contenedor tributario</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Información Básica */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Razón Social *
            </label>
            <Input
              value={formData.businessName}
              onChange={(e) => handleChange('businessName', e.target.value)}
              error={errors.businessName}
              placeholder="Ej: Empresa S.A."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre Comercial
            </label>
            <Input
              value={formData.tradeName}
              onChange={(e) => handleChange('tradeName', e.target.value)}
              placeholder="Ej: Tienda ABC"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ID Tributario *
            </label>
            <Input
              value={formData.taxId}
              onChange={(e) => handleChange('taxId', e.target.value)}
              error={errors.taxId}
              placeholder="Ej: 76.123.456-7, 20123456789"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Entidad *
            </label>
            <select
              value={formData.entityType}
              onChange={(e) => handleChange('entityType', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.entityType ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Seleccionar tipo</option>
              {ENTITY_TYPES.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
            {errors.entityType && (
              <p className="text-red-500 text-sm mt-1">{errors.entityType}</p>
            )}
          </div>
        </div>

        {/* Ubicación */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
              Estado/Región
            </label>
            <Input
              value={formData.state}
              onChange={(e) => handleChange('state', e.target.value)}
              placeholder="Ej: Región Metropolitana"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ciudad
            </label>
            <Input
              value={formData.city}
              onChange={(e) => handleChange('city', e.target.value)}
              placeholder="Ej: Santiago"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dirección
            </label>
            <Input
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
              placeholder="Ej: Av. Providencia 1234"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Código Postal
            </label>
            <Input
              value={formData.postalCode}
              onChange={(e) => handleChange('postalCode', e.target.value)}
              placeholder="Ej: 7510000"
            />
          </div>
        </div>

        {/* Información Tributaria */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Régimen Tributario *
            </label>
            <select
              value={formData.taxRegime}
              onChange={(e) => handleChange('taxRegime', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.taxRegime ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Seleccionar régimen</option>
              {TAX_REGIMES.map(regime => (
                <option key={regime.value} value={regime.value}>{regime.label}</option>
              ))}
            </select>
            {errors.taxRegime && (
              <p className="text-red-500 text-sm mt-1">{errors.taxRegime}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Actividad Económica
            </label>
            <Input
              value={formData.economicActivity}
              onChange={(e) => handleChange('economicActivity', e.target.value)}
              placeholder="Ej: Comercio al por menor"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Código NAICS
            </label>
            <Input
              value={formData.naicsCode}
              onChange={(e) => handleChange('naicsCode', e.target.value)}
              placeholder="Ej: 452110"
            />
          </div>
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
            disabled={isLoading}
          >
            {isLoading ? 'Creando...' : 'Crear Entidad'}
          </Button>
        </div>
      </form>
    </Card>
  )
}