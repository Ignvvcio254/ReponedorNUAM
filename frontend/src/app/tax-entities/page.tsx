'use client'

import { useState, useEffect } from 'react'
import TaxEntityList from '@/components/tax-container/TaxEntityList'
import TaxEntityForm from '@/components/tax-container/TaxEntityForm'
import TaxEntityDetailView from '@/components/tax-container/TaxEntityDetailView'
import ConfirmationModal from '@/components/ui/ConfirmationModal'
import { useToast } from '@/components/ui/ToastContainer'

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

type ViewMode = 'list' | 'detail' | 'form'

export default function TaxEntitiesPage() {
  const toast = useToast()
  const [entities, setEntities] = useState<TaxEntity[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [selectedEntity, setSelectedEntity] = useState<TaxEntity | null>(null)
  const [editingEntity, setEditingEntity] = useState<TaxEntity | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  // Confirmation modal state
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean
    title: string
    message: string
    type: 'danger' | 'warning' | 'success' | 'info'
    onConfirm: () => void
    confirmText?: string
    requireExtra?: boolean
    extraText?: string
  }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'danger',
    onConfirm: () => {},
  })

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
    setViewMode('form')
  }

  const handleEdit = (entity: TaxEntity) => {
    setEditingEntity(entity)
    setViewMode('form')
  }

  const handleView = (entity: TaxEntity) => {
    setSelectedEntity(entity)
    setViewMode('detail')
  }

  const handleBack = () => {
    setViewMode('list')
    setSelectedEntity(null)
    setEditingEntity(null)
  }

  const handleDelete = (entity: TaxEntity) => {
    // First confirmation
    setConfirmModal({
      isOpen: true,
      title: '⚠️ Eliminar Entidad Tributaria',
      message: `¿Estás seguro de que deseas eliminar la entidad "${entity.businessName}"? Esta acción eliminará también todos los registros asociados.`,
      type: 'warning',
      confirmText: 'Continuar',
      onConfirm: () => {
        // Close first modal
        setConfirmModal(prev => ({ ...prev, isOpen: false }))
        
        // Second confirmation (extra)
        setTimeout(() => {
          setConfirmModal({
            isOpen: true,
            title: '🚨 Confirmación Final',
            message: `Esta es una acción irreversible. Escribe "ELIMINAR" para confirmar la eliminación de "${entity.businessName}".`,
            type: 'danger',
            confirmText: 'Eliminar Permanentemente',
            requireExtra: true,
            extraText: 'ELIMINAR',
            onConfirm: async () => {
              try {
                setIsProcessing(true)
                const response = await fetch(`/api/tax-entities/${entity.id}`, {
                  method: 'DELETE'
                })
                const data = await response.json()
                
                if (data.success) {
                  toast.success('✅ Entidad eliminada exitosamente')
                  await fetchEntities()
                } else {
                  toast.error('Error al eliminar: ' + data.error)
                }
              } catch (error) {
                toast.error('Error al eliminar la entidad')
              } finally {
                setIsProcessing(false)
                setConfirmModal(prev => ({ ...prev, isOpen: false }))
              }
            }
          })
        }, 300)
      }
    })
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      
      const data = await response.json()
      
      if (data.success) {
        toast.success(editingEntity ? '✅ Entidad actualizada' : '✅ Entidad creada')
        setViewMode('list')
        setEditingEntity(null)
        await fetchEntities()
      } else {
        toast.error('Error: ' + data.error)
      }
    } catch (error) {
      toast.error('Error al guardar la entidad')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Render based on view mode
  if (viewMode === 'form') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <TaxEntityForm
            onSubmit={handleSubmit}
            onCancel={handleBack}
            isLoading={isSubmitting}
            initialData={editingEntity}
          />
        </div>
      </div>
    )
  }

  if (viewMode === 'detail' && selectedEntity) {
    return (
      <>
        <TaxEntityDetailView
          entity={selectedEntity}
          onBack={handleBack}
          onEdit={() => handleEdit(selectedEntity)}
        />
        
        <ConfirmationModal
          isOpen={confirmModal.isOpen}
          onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
          onConfirm={confirmModal.onConfirm}
          title={confirmModal.title}
          message={confirmModal.message}
          type={confirmModal.type}
          confirmText={confirmModal.confirmText}
          requireExtraConfirmation={confirmModal.requireExtra}
          extraConfirmationText={confirmModal.extraText}
          isLoading={isProcessing}
        />
      </>
    )
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <TaxEntityList
            entities={entities}
            onAddNew={handleAddNew}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
            isLoading={isLoading}
          />
        </div>
      </div>

      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
        type={confirmModal.type}
        confirmText={confirmModal.confirmText}
        requireExtraConfirmation={confirmModal.requireExtra}
        extraConfirmationText={confirmModal.extraText}
        isLoading={isProcessing}
      />
    </>
  )
}