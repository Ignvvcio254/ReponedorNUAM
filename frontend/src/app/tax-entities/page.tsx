'use client'

import { useState, useEffect } from 'react'
import TaxEntityList from '@/components/tax-container/TaxEntityList'
import TaxEntityForm from '@/components/tax-container/TaxEntityForm'

interface TaxEntity {
  id: string
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
  status: string
  registrationDate?: string
  createdAt: string
  updatedAt: string
  _count?: {
    taxReturns: number
    taxPayments: number
    taxCertificates: number
    auditProcesses: number
  }
}

export default function TaxEntitiesPage() {
  const [entities, setEntities] = useState<TaxEntity[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingEntity, setEditingEntity] = useState<TaxEntity | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetchEntities()
  }, [])

  const fetchEntities = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/tax-entities')
      const data = await response.json()
      
      if (data.success) {
        setEntities(data.data)
      } else {
        console.error('Error fetching tax entities:', data.error)
      }
    } catch (error) {
      console.error('Error fetching tax entities:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddNew = () => {
    setEditingEntity(null)
    setShowForm(true)
  }

  const handleEdit = (entity: TaxEntity) => {
    setEditingEntity(entity)
    setShowForm(true)
  }

  const handleView = (entity: TaxEntity) => {
    // TODO: Implement view modal or navigate to detail page
    console.log('View entity:', entity)
  }

  const handleDelete = async (entity: TaxEntity) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar la entidad "${entity.businessName}"?`)) {
      try {
        const response = await fetch(`/api/tax-entities/${entity.id}`, {
          method: 'DELETE'
        })
        const data = await response.json()
        
        if (data.success) {
          await fetchEntities() // Refresh the list
        } else {
          alert('Error al eliminar la entidad: ' + data.error)
        }
      } catch (error) {
        console.error('Error deleting entity:', error)
        alert('Error al eliminar la entidad')
      }
    }
  }

  const handleSubmit = async (formData: any) => {
    try {
      setIsSubmitting(true)
      
      const url = editingEntity 
        ? `/api/tax-entities/${editingEntity.id}`
        : '/api/tax-entities'
      
      const method = editingEntity ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
      
      const data = await response.json()
      
      if (data.success) {
        setShowForm(false)
        setEditingEntity(null)
        await fetchEntities() // Refresh the list
      } else {
        alert('Error al guardar la entidad: ' + data.error)
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      alert('Error al guardar la entidad')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingEntity(null)
  }

  if (showForm) {
    return (
      <div className="container mx-auto px-4 py-8">
        <TaxEntityForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isSubmitting}
        />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <TaxEntityList
        entities={entities}
        onAddNew={handleAddNew}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isLoading={isLoading}
      />
    </div>
  )
}