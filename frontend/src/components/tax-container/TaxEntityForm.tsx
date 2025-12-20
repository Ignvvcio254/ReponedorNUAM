'use client'

import { useState, useEffect } from 'react'
import { ArrowLeftIcon, BuildingOfficeIcon, CheckCircleIcon } from '@heroicons/react/24/outline'
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

interface InitialData {
  id?: string
  businessName: string
  tradeName?: string
  taxId: string
  entityType: string
  country: string
  state?: string
  city?: string
  address?: string
  postalCode?: string
  taxRegime: string
  economicActivity?: string
  naicsCode?: string
}

interface TaxEntityFormProps {
  onSubmit: (data: TaxEntityFormData) => void
  onCancel: () => void
  isLoading?: boolean
  initialData?: InitialData | null
}

const ENTITY_TYPES = [
  { value: 'CORPORATION', label: 'Corporación', icon: '🏢' },
  { value: 'LLC', label: 'Sociedad de Responsabilidad Limitada', icon: '🏛️' },
  { value: 'PARTNERSHIP', label: 'Sociedad', icon: '🤝' },
  { value: 'SOLE_PROPRIETOR', label: 'Persona Natural', icon: '👤' },
  { value: 'NGO', label: 'Organización Sin Fines de Lucro', icon: '💚' },
  { value: 'GOVERNMENT', label: 'Entidad Gubernamental', icon: '🏛️' },
  { value: 'FOREIGN', label: 'Entidad Extranjera', icon: '🌍' }
]

const TAX_REGIMES = [
  { value: 'GENERAL', label: 'Régimen General', desc: 'Contribuyente regular' },
  { value: 'SIMPLIFIED', label: 'Régimen Simplificado', desc: 'Pequeños contribuyentes' },
  { value: 'SPECIAL', label: 'Régimen Especial', desc: 'Sectores específicos' },
  { value: 'EXEMPT', label: 'Exento', desc: 'Sin obligaciones fiscales' },
  { value: 'SMALL_BUSINESS', label: 'Pequeña Empresa', desc: 'PyME' },
  { value: 'MONOTAX', label: 'Monotributo', desc: 'Impuesto único' },
  { value: 'SIMPLES', label: 'Simples Nacional', desc: 'Brasil' }
]

export default function TaxEntityForm({ onSubmit, onCancel, isLoading = false, initialData = null }: TaxEntityFormProps) {
  const isEditMode = !!initialData

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
  const [isVisible, setIsVisible] = useState(false)

  // Initialize form with data if editing
  useEffect(() => {
    if (initialData) {
      setFormData({
        businessName: initialData.businessName || '',
        tradeName: initialData.tradeName || '',
        taxId: initialData.taxId || '',
        entityType: initialData.entityType || '',
        country: initialData.country || '',
        state: initialData.state || '',
        city: initialData.city || '',
        address: initialData.address || '',
        postalCode: initialData.postalCode || '',
        taxRegime: initialData.taxRegime || '',
        economicActivity: initialData.economicActivity || '',
        naicsCode: initialData.naicsCode || ''
      })
    }
    setIsVisible(true)
  }, [initialData])

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
    <div className={`transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      {/* Header */}
      <div className="mb-8">
        <button
          type="button"
          onClick={onCancel}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium mb-4 transition-colors"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          Volver a Entidades
        </button>
        
        <div className="flex items-center gap-4">
          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${isEditMode ? 'from-blue-500 to-indigo-600' : 'from-purple-500 to-violet-600'} flex items-center justify-center shadow-lg`}>
            <BuildingOfficeIcon className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isEditMode ? 'Editar Entidad Tributaria' : 'Nueva Entidad Tributaria'}
            </h1>
            <p className="text-gray-500">
              {isEditMode 
                ? 'Modifica los datos de la entidad existente' 
                : 'Registra una nueva entidad en el contenedor tributario'
              }
            </p>
          </div>
        </div>
      </div>

      {/* Form Card */}
      <div className="relative overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-lg">
        <div className={`absolute top-0 left-0 right-0 h-24 bg-gradient-to-br ${isEditMode ? 'from-blue-500 to-indigo-600' : 'from-purple-500 to-violet-600'} opacity-5`} />
        
        <form onSubmit={handleSubmit} className="relative p-6 sm:p-8">
          {/* Section: Basic Info */}
          <div className="mb-8">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-800 mb-4 uppercase tracking-wider">
              <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs font-bold">1</span>
              Información Básica
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Razón Social *
                </label>
                <input
                  type="text"
                  value={formData.businessName}
                  onChange={(e) => handleChange('businessName', e.target.value)}
                  placeholder="Ej: Empresa Internacional S.A."
                  className={`w-full px-4 py-3 rounded-xl border transition-all focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 ${
                    errors.businessName ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:bg-white bg-gray-50'
                  }`}
                />
                {errors.businessName && (
                  <p className="text-red-500 text-sm mt-1">{errors.businessName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre Comercial
                </label>
                <input
                  type="text"
                  value={formData.tradeName}
                  onChange={(e) => handleChange('tradeName', e.target.value)}
                  placeholder="Ej: Tienda ABC"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ID Tributario (RUT/RUC/RFC) *
                </label>
                <input
                  type="text"
                  value={formData.taxId}
                  onChange={(e) => handleChange('taxId', e.target.value)}
                  placeholder="Ej: 76.123.456-7"
                  className={`w-full px-4 py-3 rounded-xl border transition-all focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 ${
                    errors.taxId ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:bg-white bg-gray-50'
                  }`}
                />
                {errors.taxId && (
                  <p className="text-red-500 text-sm mt-1">{errors.taxId}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Entidad *
                </label>
                <select
                  value={formData.entityType}
                  onChange={(e) => handleChange('entityType', e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border transition-all focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 ${
                    errors.entityType ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:bg-white bg-gray-50'
                  }`}
                >
                  <option value="">🏢 Seleccionar tipo</option>
                  {ENTITY_TYPES.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.icon} {type.label}
                    </option>
                  ))}
                </select>
                {errors.entityType && (
                  <p className="text-red-500 text-sm mt-1">{errors.entityType}</p>
                )}
              </div>
            </div>
          </div>

          {/* Section: Location */}
          <div className="mb-8">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-800 mb-4 uppercase tracking-wider">
              <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">2</span>
              Ubicación
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  País *
                </label>
                <select
                  value={formData.country}
                  onChange={(e) => handleChange('country', e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border transition-all focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 ${
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
                  Estado/Región
                </label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => handleChange('state', e.target.value)}
                  placeholder="Ej: Región Metropolitana"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ciudad
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => handleChange('city', e.target.value)}
                  placeholder="Ej: Santiago"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dirección
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  placeholder="Ej: Av. Providencia 1234, Oficina 501"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Código Postal
                </label>
                <input
                  type="text"
                  value={formData.postalCode}
                  onChange={(e) => handleChange('postalCode', e.target.value)}
                  placeholder="Ej: 7510000"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 focus:bg-white transition-all"
                />
              </div>
            </div>
          </div>

          {/* Section: Tax Info */}
          <div className="mb-8">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-800 mb-4 uppercase tracking-wider">
              <span className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs font-bold">3</span>
              Información Tributaria
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Régimen Tributario *
                </label>
                <select
                  value={formData.taxRegime}
                  onChange={(e) => handleChange('taxRegime', e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border transition-all focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 ${
                    errors.taxRegime ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:bg-white bg-gray-50'
                  }`}
                >
                  <option value="">📋 Seleccionar régimen</option>
                  {TAX_REGIMES.map(regime => (
                    <option key={regime.value} value={regime.value}>
                      {regime.label} - {regime.desc}
                    </option>
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
                <input
                  type="text"
                  value={formData.economicActivity}
                  onChange={(e) => handleChange('economicActivity', e.target.value)}
                  placeholder="Ej: Comercio al por menor"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 focus:bg-white transition-all"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Código NAICS
                </label>
                <input
                  type="text"
                  value={formData.naicsCode}
                  onChange={(e) => handleChange('naicsCode', e.target.value)}
                  placeholder="Ej: 452110 (Tiendas departamentales)"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 focus:bg-white transition-all"
                />
                <p className="text-xs text-gray-400 mt-1">Sistema de Clasificación Industrial de América del Norte</p>
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
              disabled={isLoading}
              className={`flex items-center justify-center gap-2 px-8 py-3 text-white font-medium rounded-xl transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed ${
                isEditMode 
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700' 
                  : 'bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700'
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
                  {isEditMode ? 'Guardar Cambios' : 'Crear Entidad'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}