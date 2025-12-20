'use client'

import { useState, useEffect } from 'react'
import QualificationsList from '@/components/tax-container/QualificationsList'
import QualificationFormNew from '@/components/tax-container/QualificationFormNew'
import QualificationDetailModal from '@/components/tax-container/QualificationDetailModal'
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

export default function QualificationsPage() {
  const toast = useToast()
  const [qualifications, setQualifications] = useState<Qualification[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingQualification, setEditingQualification] = useState<Qualification | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Modal state
  const [selectedQualification, setSelectedQualification] = useState<Qualification | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

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
    setShowForm(true)
  }

  const handleEdit = (qualification: Qualification) => {
    setIsModalOpen(false)
    setEditingQualification(qualification)
    setShowForm(true)
  }

  const handleView = (qualification: Qualification) => {
    setSelectedQualification(qualification)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedQualification(null)
  }

  const handleDelete = async (qualification: Qualification) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar la calificación de "${qualification.emisorName}"?`)) {
      try {
        const response = await fetch(`/api/qualifications/${qualification.id}`, {
          method: 'DELETE'
        })
        const data = await response.json()
        
        if (data.success) {
          toast.success('Calificación eliminada exitosamente')
          await fetchQualifications()
        } else {
          toast.error('Error al eliminar la calificación: ' + data.error)
        }
      } catch (error) {
        console.error('Error deleting qualification:', error)
        toast.error('Error al eliminar la calificación')
      }
    }
  }

  const handleApprove = async (qualification: Qualification) => {
    try {
      setIsProcessing(true)
      const response = await fetch(`/api/qualifications/${qualification.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status: 'APPROVED'
        })
      })
      const data = await response.json()
      
      if (data.success) {
        toast.success('✅ Calificación aprobada exitosamente')
        setIsModalOpen(false)
        setSelectedQualification(null)
        await fetchQualifications()
      } else {
        toast.error('Error al aprobar la calificación: ' + data.error)
      }
    } catch (error) {
      console.error('Error approving qualification:', error)
      toast.error('Error al aprobar la calificación')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleReject = async (qualification: Qualification, reason: string) => {
    try {
      setIsProcessing(true)
      const response = await fetch(`/api/qualifications/${qualification.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status: 'REJECTED',
          rejectionReason: reason
        })
      })
      const data = await response.json()
      
      if (data.success) {
        toast.success('❌ Calificación rechazada')
        setIsModalOpen(false)
        setSelectedQualification(null)
        await fetchQualifications()
      } else {
        toast.error('Error al rechazar la calificación: ' + data.error)
      }
    } catch (error) {
      console.error('Error rejecting qualification:', error)
      toast.error('Error al rechazar la calificación')
    } finally {
      setIsProcessing(false)
    }
  }

  // Legacy handlers for list buttons (still work from the list)
  const handleApproveFromList = async (qualification: Qualification) => {
    if (window.confirm(`¿Aprobar la calificación de "${qualification.emisorName}"?`)) {
      await handleApprove(qualification)
    }
  }

  const handleRejectFromList = async (qualification: Qualification) => {
    const reason = window.prompt('Motivo del rechazo:')
    if (reason) {
      await handleReject(qualification, reason)
    }
  }

  const handleSubmit = async (formData: any) => {
    try {
      setIsSubmitting(true)
      
      const submitData = {
        ...formData,
        userId: 'admin-setup-001'
      }
      
      const url = editingQualification 
        ? `/api/qualifications/${editingQualification.id}`
        : '/api/qualifications'
      
      const method = editingQualification ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(submitData)
      })
      
      const data = await response.json()
      
      if (data.success) {
        toast.success(editingQualification ? 'Calificación actualizada exitosamente' : 'Calificación creada exitosamente')
        setShowForm(false)
        setEditingQualification(null)
        await fetchQualifications()
      } else {
        toast.error('Error al guardar la calificación: ' + data.error)
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      toast.error('Error al guardar la calificación')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingQualification(null)
  }

  if (showForm) {
    return (
      <div className="container mx-auto px-4 py-8">
        <QualificationFormNew
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isSubmitting}
        />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
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

      {/* Detail Modal */}
      <QualificationDetailModal
        qualification={selectedQualification}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onApprove={handleApprove}
        onReject={handleReject}
        onEdit={handleEdit}
        isProcessing={isProcessing}
      />
    </div>
  )
}