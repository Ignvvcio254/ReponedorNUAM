/**
 * Admin Panel - Professional User Management
 * Complete admin dashboard with full CRUD operations and advanced features
 */

'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import {
  ShieldCheckIcon,
  ClockIcon,
  PlusIcon,
  ArrowPathIcon,
  FunnelIcon,
  ArrowDownTrayIcon,
} from '@heroicons/react/24/outline'

// Import custom components
import { UserTable, type User } from '@/components/admin/UserTable'
import { AdminStats } from '@/components/admin/AdminStats'
import { EditUserModal } from '@/components/admin/EditUserModal'
import { ChangeRoleModal } from '@/components/admin/ChangeRoleModal'
import { ResetPasswordModal } from '@/components/admin/ResetPasswordModal'
import { DeleteUserModal } from '@/components/admin/DeleteUserModal'
import AdminActivityHistory from '@/components/admin/AdminActivityHistory'
import { useToast } from '@/components/ui/ToastContainer'

interface UserStats {
  total: number
  active: number
  inactive: number
  byRole: Array<{ role: string; count: number }>
  recentLogins: Array<{
    id: string
    name: string
    email: string
    lastLoginAt: string
  }>
}

export default function AdminPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const toast = useToast()

  // State management
  const [users, setUsers] = useState<User[]>([])
  const [userStats, setUserStats] = useState<UserStats | null>(null)
  const [auditLogs, setAuditLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'users' | 'audit' | 'settings'>('users')

  // Modals state
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showChangeRoleModal, setShowChangeRoleModal] = useState(false)
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  // Filters
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  // Create user form
  const [createLoading, setCreateLoading] = useState(false)
  const [createFormData, setCreateFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'ACCOUNTANT',
  })

  // Auth check
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    } else if (status === 'authenticated' && session?.user.role !== 'ADMIN') {
      router.push('/dashboard')
    }
  }, [status, session, router])

  // Load initial data
  useEffect(() => {
    if (status === 'authenticated' && session?.user.role === 'ADMIN') {
      loadData()
    }
  }, [status, session])

  // Load all data
  const loadData = async () => {
    setLoading(true)
    try {
      const [usersRes, statsRes, auditRes] = await Promise.all([
        fetch('/api/users'),
        fetch('/api/users/stats'),
        fetch('/api/audit-logs?limit=50'),
      ])

      const [usersData, statsData, auditData] = await Promise.all([
        usersRes.json(),
        statsRes.json(),
        auditRes.json(),
      ])

      if (usersData.success && Array.isArray(usersData.data)) {
        setUsers(usersData.data)
      }

      if (statsData.success) {
        setUserStats(statsData.data)
      }

      if (auditData.success && Array.isArray(auditData.data)) {
        setAuditLogs(auditData.data)
      }
    } catch (error) {
      console.error('Error loading admin data:', error)
    } finally {
      setLoading(false)
    }
  }

  // Create user handler
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreateLoading(true)

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(createFormData),
      })

      const data = await response.json()

      if (data.success) {
        toast.success('Usuario creado exitosamente')
        setShowCreateModal(false)
        setCreateFormData({ name: '', email: '', password: '', role: 'ACCOUNTANT' })
        loadData()
      } else {
        toast.error('Error: ' + data.error)
      }
    } catch (error) {
      toast.error('Error al crear usuario')
    } finally {
      setCreateLoading(false)
    }
  }

  // Edit user handler
  const handleEditUser = async (userId: string, data: any) => {
    const response = await fetch(`/api/users/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    const result = await response.json()

    if (result.success) {
      toast.success('Usuario actualizado exitosamente')
      loadData()
    } else {
      throw new Error(result.error)
    }
  }

  // Change role handler
  const handleChangeRole = async (userId: string, newRole: string) => {
    const response = await fetch(`/api/users/${userId}/change-role`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: newRole }),
    })

    const result = await response.json()

    if (result.success) {
      toast.success('Rol cambiado exitosamente')
      loadData()
    } else {
      throw new Error(result.error)
    }
  }

  // Toggle status handler
  const handleToggleStatus = async (userId: string) => {
    const response = await fetch(`/api/users/${userId}/toggle-status`, {
      method: 'POST',
    })

    const result = await response.json()

    if (result.success) {
      toast.success('Estado actualizado exitosamente')
      loadData()
    } else {
      toast.error('Error: ' + result.error)
    }
  }

  // Reset password handler
  const handleResetPassword = async (userId: string, newPassword: string) => {
    const response = await fetch(`/api/users/${userId}/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ newPassword }),
    })

    const result = await response.json()

    if (result.success) {
      toast.success('Contraseña restablecida exitosamente')
      loadData()
    } else {
      throw new Error(result.error)
    }
  }

  // Delete user handler
  const handleDeleteUser = async (userId: string, permanent: boolean) => {
    const url = `/api/users/${userId}${permanent ? '?permanent=true' : ''}`
    const response = await fetch(url, { method: 'DELETE' })

    const result = await response.json()

    if (result.success) {
      toast.success(`Usuario ${permanent ? 'eliminado permanentemente' : 'desactivado'} exitosamente`)
      loadData()
    } else {
      throw new Error(result.error)
    }
  }

  // Export audit logs
  const handleExportAuditLogs = async () => {
    try {
      const response = await fetch('/api/audit-logs/export')
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      toast.success('Audit logs exportados exitosamente')
    } catch (error) {
      toast.error('Error al exportar logs')
    }
  }

  // Filter users
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      searchQuery === '' ||
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesRole = roleFilter === 'all' || user.role === roleFilter
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && user.isActive) ||
      (statusFilter === 'inactive' && !user.isActive)

    return matchesSearch && matchesRole && matchesStatus
  })

  // Loading state
  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ArrowPathIcon className="w-12 h-12 text-nuam-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Cargando panel de administración...</p>
        </div>
      </div>
    )
  }

  // Auth check
  if (session?.user.role !== 'ADMIN') {
    return null
  }

  const roleColors: Record<string, string> = {
    ADMIN: 'bg-purple-100 text-purple-800',
    MANAGER: 'bg-blue-100 text-blue-800',
    ACCOUNTANT: 'bg-green-100 text-green-800',
    AUDITOR: 'bg-yellow-100 text-yellow-800',
    VIEWER: 'bg-gray-100 text-gray-800',
  }

  const actionColors: Record<string, string> = {
    LOGIN_SUCCESS: 'bg-green-100 text-green-800',
    LOGIN_FAILED: 'bg-red-100 text-red-800',
    LOGOUT: 'bg-gray-100 text-gray-800',
    CREATE: 'bg-blue-100 text-blue-800',
    UPDATE: 'bg-yellow-100 text-yellow-800',
    DELETE: 'bg-red-100 text-red-800',
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <ShieldCheckIcon className="w-10 h-10 text-nuam-600" />
            <h1 className="text-3xl font-bold text-gray-900">Panel de Administración</h1>
          </div>
          <p className="text-sm text-gray-600">
            Gestión completa de usuarios, roles, permisos y auditoría del sistema
          </p>
        </div>

        {/* Stats Dashboard */}
        <AdminStats stats={userStats} auditCount={auditLogs.length} />

        {/* Historial de Actividad - Visible Section */}
        <div className="mb-6">
          <AdminActivityHistory />
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('users')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'users'
                    ? 'border-nuam-500 text-nuam-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Gestión de Usuarios ({users.length})
              </button>
              <button
                onClick={() => setActiveTab('audit')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'audit'
                    ? 'border-nuam-500 text-nuam-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Historial ({auditLogs.length})
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'settings'
                    ? 'border-nuam-500 text-nuam-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Configuración
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Users Tab */}
            {activeTab === 'users' && (
              <div>
                {/* Filters and Actions */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  {/* Search */}
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Buscar por nombre o email..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nuam-500 focus:border-transparent"
                    />
                  </div>

                  {/* Role Filter */}
                  <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nuam-500 focus:border-transparent"
                  >
                    <option value="all">Todos los roles</option>
                    <option value="ADMIN">Admin</option>
                    <option value="MANAGER">Manager</option>
                    <option value="ACCOUNTANT">Accountant</option>
                    <option value="AUDITOR">Auditor</option>
                    <option value="VIEWER">Viewer</option>
                  </select>

                  {/* Status Filter */}
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nuam-500 focus:border-transparent"
                  >
                    <option value="all">Todos los estados</option>
                    <option value="active">Activos</option>
                    <option value="inactive">Inactivos</option>
                  </select>

                  {/* Create Button */}
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-nuam-600 text-white rounded-lg hover:bg-nuam-700 transition-colors whitespace-nowrap"
                  >
                    <PlusIcon className="w-5 h-5" />
                    Crear Usuario
                  </button>

                  {/* Refresh Button */}
                  <button
                    onClick={loadData}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    title="Recargar datos"
                  >
                    <ArrowPathIcon className="w-5 h-5" />
                  </button>
                </div>

                {/* Results Info */}
                <div className="mb-4 text-sm text-gray-600">
                  Mostrando {filteredUsers.length} de {users.length} usuarios
                </div>

                {/* Users Table */}
                <UserTable
                  users={filteredUsers}
                  currentUserId={session.user.id}
                  onEdit={(user) => {
                    setSelectedUser(user)
                    setShowEditModal(true)
                  }}
                  onDelete={(userId) => {
                    const user = users.find((u) => u.id === userId)
                    if (user) {
                      setSelectedUser(user)
                      setShowDeleteModal(true)
                    }
                  }}
                  onToggleStatus={handleToggleStatus}
                  onChangeRole={(userId) => {
                    const user = users.find((u) => u.id === userId)
                    if (user) {
                      setSelectedUser(user)
                      setShowChangeRoleModal(true)
                    }
                  }}
                />
              </div>
            )}

            {/* Audit Tab - Now just shows a message since Historial is above */}
            {activeTab === 'audit' && (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Historial de Actividad</h3>
                <p className="text-gray-600">
                  El historial completo de actividad se encuentra arriba, justo debajo de las estadísticas.
                </p>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Configuración del Sistema
                </h2>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <p className="text-blue-800 mb-4">
                    Panel de configuración avanzada del sistema. Las siguientes funciones estarán disponibles próximamente:
                  </p>
                  <ul className="space-y-2 text-sm text-blue-700 list-disc list-inside">
                    <li>Configuración de políticas de seguridad</li>
                    <li>Límites de intentos de login y bloqueos</li>
                    <li>Duración y gestión de sesiones</li>
                    <li>Configuración de notificaciones por email</li>
                    <li>Gestión de permisos granulares</li>
                    <li>Configuración de auditoría y retención de logs</li>
                    <li>Integración con servicios externos</li>
                    <li>Backups y restauración de datos</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modals */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Crear Nuevo Usuario
                </h3>
                <form onSubmit={handleCreateUser} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre Completo
                    </label>
                    <input
                      type="text"
                      required
                      value={createFormData.name}
                      onChange={(e) => setCreateFormData({ ...createFormData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nuam-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      value={createFormData.email}
                      onChange={(e) => setCreateFormData({ ...createFormData, email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nuam-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contraseña
                    </label>
                    <input
                      type="password"
                      required
                      minLength={8}
                      value={createFormData.password}
                      onChange={(e) => setCreateFormData({ ...createFormData, password: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nuam-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Rol
                    </label>
                    <select
                      value={createFormData.role}
                      onChange={(e) => setCreateFormData({ ...createFormData, role: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nuam-500 focus:border-transparent"
                    >
                      <option value="VIEWER">Viewer</option>
                      <option value="AUDITOR">Auditor</option>
                      <option value="ACCOUNTANT">Contador</option>
                      <option value="MANAGER">Manager</option>
                      <option value="ADMIN">Admin</option>
                    </select>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowCreateModal(false)}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={createLoading}
                      className="flex-1 px-4 py-2 bg-nuam-600 text-white rounded-lg hover:bg-nuam-700 transition-colors disabled:opacity-50"
                    >
                      {createLoading ? 'Creando...' : 'Crear Usuario'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {selectedUser && (
          <>
            <EditUserModal
              user={selectedUser}
              isOpen={showEditModal}
              onClose={() => {
                setShowEditModal(false)
                setSelectedUser(null)
              }}
              onSave={handleEditUser}
            />

            <ChangeRoleModal
              user={selectedUser}
              isOpen={showChangeRoleModal}
              onClose={() => {
                setShowChangeRoleModal(false)
                setSelectedUser(null)
              }}
              onSave={handleChangeRole}
            />

            <ResetPasswordModal
              user={selectedUser}
              isOpen={showResetPasswordModal}
              onClose={() => {
                setShowResetPasswordModal(false)
                setSelectedUser(null)
              }}
              onReset={handleResetPassword}
            />

            <DeleteUserModal
              user={selectedUser}
              isOpen={showDeleteModal}
              onClose={() => {
                setShowDeleteModal(false)
                setSelectedUser(null)
              }}
              onDelete={handleDeleteUser}
            />
          </>
        )}
      </div>
    </div>
  )
}
