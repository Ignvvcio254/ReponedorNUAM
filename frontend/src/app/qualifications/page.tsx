'use client'

import { useState, useEffect } from 'react'
import QualificationsList from '@/components/tax-container/QualificationsList'
import QualificationFormNew from '@/components/tax-container/QualificationFormNew'
import QualificationDetailView from '@/components/tax-container/QualificationDetailView'
import ConfirmationModal from '@/components/ui/ConfirmationModal'
import { useToast } from '@/components/ui/ToastContainer'

interface Qualification {
  id: string
  emisorName: string
  taxId?: string
  country: string
  period: string
  amount: number
  currency: string
  calculatedValue?: number
  status: string
  processingDate?: string
  approvalDate?: string
  rejectionReason?: string
  observations?: string
  documentUrl?: string
  createdAt: string
  updatedAt: string
  user?: {
    id: string
    name: string
    email: string
  }
}

type ViewMode = 'list' | 'detail' | 'form'

export default function QualificationsPage() {
  const toast = useToast()
  const [qualifications, setQualifications] = useState<Qualification[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [selectedQualification, setSelectedQualification] = useState<Qualification | null>(null)
  const [editingQualification, setEditingQualification] = useState<Qualification | null>(null)
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
  }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'danger',
    onConfirm: () => {},
  })

  useEffect(() => {
    fetchQualifications()
  }, [])

  const fetchQualifications = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/qualifications')
      const data = await response.json()
      
      if (data.success) {
        setQualifications(data.data)
      } else {
        console.error('Error fetching qualifications:', data.error)
      }
    } catch (error) {
      console.error('Error fetching qualifications:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddNew = () => {
    setEditingQualification(null)
    setViewMode('form')
  }

  const handleEdit = (qualification: Qualification) => {
    setEditingQualification(qualification)
    setViewMode('form')
  }

  const handleView = (qualification: Qualification) => {
    setSelectedQualification(qualification)
    setViewMode('detail')
  }

  const handleBack = () => {
    setViewMode('list')
    setSelectedQualification(null)
    setEditingQualification(null)
  }

  const handleDelete = (qualification: Qualification) => {
    setConfirmModal({
      isOpen: true,
      title: 'Eliminar Calificación',
      message: `¿Estás seguro de que deseas eliminar la calificación de "${qualification.emisorName}"? Esta acción no se puede deshacer.`,
      type: 'danger',
      confirmText: 'Eliminar',
      requireExtra: true,
      onConfirm: async () => {
        try {
          setIsProcessing(true)
          const response = await fetch(`/api/qualifications/${qualification.id}`, {
            method: 'DELETE'
          })
          const data = await response.json()
          
          if (data.success) {
            toast.success('✅ Calificación eliminada exitosamente')
            await fetchQualifications()
          } else {
            toast.error('Error al eliminar: ' + data.error)
          }
        } catch (error) {
          toast.error('Error al eliminar la calificación')
        } finally {
          setIsProcessing(false)
          setConfirmModal(prev => ({ ...prev, isOpen: false }))
        }
      }
    })
  }

  const handleApprove = async (qualification: Qualification) => {
    setConfirmModal({
      isOpen: true,
      title: 'Aprobar Calificación',
      message: `¿Confirmas la aprobación de la calificación de "${qualification.emisorName}"?`,
      type: 'success',
      confirmText: 'Aprobar',
      onConfirm: async () => {
        try {
          setIsProcessing(true)
          const response = await fetch(`/api/qualifications/${qualification.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'APPROVED' })
          })
          const data = await response.json()
          
          if (data.success) {
            toast.success('✅ Calificación aprobada exitosamente')
            setViewMode('list')
            setSelectedQualification(null)
            await fetchQualifications()
          } else {
            toast.error('Error al aprobar: ' + data.error)
          }
        } catch (error) {
          toast.error('Error al aprobar la calificación')
        } finally {
          setIsProcessing(false)
          setConfirmModal(prev => ({ ...prev, isOpen: false }))
        }
      }
    })
  }

  const handleReject = async (qualification: Qualification, reason: string) => {
    try {
      setIsProcessing(true)
      const response = await fetch(`/api/qualifications/${qualification.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'REJECTED', rejectionReason: reason })
      })
      const data = await response.json()
      
      if (data.success) {
        toast.success('❌ Calificación rechazada')
        setViewMode('list')
        setSelectedQualification(null)
        await fetchQualifications()
      } else {
        toast.error('Error al rechazar: ' + data.error)
      }
    } catch (error) {
      toast.error('Error al rechazar la calificación')
    } finally {
      setIsProcessing(false)
    }
  }

  // Handlers for list actions (with confirmation)
  const handleApproveFromList = (qualification: Qualification) => {
    handleApprove(qualification)
  }

  const handleRejectFromList = (qualification: Qualification) => {
    // Open detail view to show reject form
    setSelectedQualification(qualification)
    setViewMode('detail')
  }

  const handleSubmit = async (formData: any) => {
    try {
      setIsSubmitting(true)
      
      const submitData = { ...formData }
      
      const url = editingQualification 
        ? `/api/qualifications/${editingQualification.id}`
        : '/api/qualifications'
      
      const method = editingQualification ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData)
      })
      
      const data = await response.json()
      
      if (data.success) {
        toast.success(editingQualification ? '✅ Calificación actualizada' : '✅ Calificación creada')
        setViewMode('list')
        setEditingQualification(null)
        await fetchQualifications()
      } else {
        toast.error('Error: ' + data.error)
      }
    } catch (error) {
      toast.error('Error al guardar la calificación')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Render based on view mode
  if (viewMode === 'form') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <QualificationFormNew
            onSubmit={handleSubmit}
            onCancel={handleBack}
            isLoading={isSubmitting}
            initialData={editingQualification}
          />
        </div>
      </div>
    )
  }

  if (viewMode === 'detail' && selectedQualification) {
    return (
      <>
        <QualificationDetailView
          qualification={selectedQualification}
          onBack={handleBack}
          onApprove={() => handleApprove(selectedQualification)}
          onReject={(reason) => handleReject(selectedQualification, reason)}
          onEdit={() => handleEdit(selectedQualification)}
          isProcessing={isProcessing}
        />
        
        <ConfirmationModal
          isOpen={confirmModal.isOpen}
          onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
          onConfirm={confirmModal.onConfirm}
          title={confirmModal.title}
          message={confirmModal.message}
          type={confirmModal.type}
          confirmText={confirmModal.confirmText}
          isLoading={isProcessing}
        />
      </>
    )
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <QualificationsList
            qualifications={qualifications}
            onAddNew={handleAddNew}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onApprove={handleApproveFromList}
            onReject={handleRejectFromList}
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
        isLoading={isProcessing}
      />
    </>
  )
}