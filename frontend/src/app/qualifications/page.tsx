'use client'

import { useState, useEffect } from 'react'
import QualificationsList from '@/components/tax-container/QualificationsList'
import QualificationFormNew from '@/components/tax-container/QualificationFormNew'
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
    setEditingQualification(qualification)
    setShowForm(true)
  }

  const handleView = (qualification: Qualification) => {
    // TODO: Implement view modal or navigate to detail page
    console.log('View qualification:', qualification)
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
          await fetchQualifications() // Refresh the list
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
    if (window.confirm(`¿Aprobar la calificación de "${qualification.emisorName}"?`)) {
      try {
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
          toast.success('Calificación aprobada exitosamente')
          await fetchQualifications() // Refresh the list
        } else {
          toast.error('Error al aprobar la calificación: ' + data.error)
        }
      } catch (error) {
        console.error('Error approving qualification:', error)
        toast.error('Error al aprobar la calificación')
      }
    }
  }

  const handleReject = async (qualification: Qualification) => {
    const reason = window.prompt('Motivo del rechazo:')
    if (reason) {
      try {
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
          toast.success('Calificación rechazada')
          await fetchQualifications() // Refresh the list
        } else {
          toast.error('Error al rechazar la calificación: ' + data.error)
        }
      } catch (error) {
        console.error('Error rejecting qualification:', error)
        toast.error('Error al rechazar la calificación')
      }
    }
  }

  const handleSubmit = async (formData: any) => {
    try {
      setIsSubmitting(true)
      
      // Add a default userId for now (in production, this should come from authentication)
      const submitData = {
        ...formData,
        userId: 'admin-setup-001' // This should be the current user's ID
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
        await fetchQualifications() // Refresh the list
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
        onApprove={handleApprove}
        onReject={handleReject}
        isLoading={isLoading}
      />
    </div>
  )
}