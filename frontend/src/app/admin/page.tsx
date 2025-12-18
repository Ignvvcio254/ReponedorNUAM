'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import {
  UserGroupIcon,
  ShieldCheckIcon,
  ClockIcon,
  ChartBarIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline'

export default function AdminPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [users, setUsers] = useState<any[]>([])
  const [auditLogs, setAuditLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'users' | 'audit' | 'settings'>('users')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [createLoading, setCreateLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'ACCOUNTANT',
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    } else if (status === 'authenticated' && session?.user.role !== 'ADMIN') {
      router.push('/dashboard')
    }
  }, [status, session, router])

  useEffect(() => {
    if (status === 'authenticated' && session?.user.role === 'ADMIN') {
      loadData()
    }
  }, [status, session])

  const loadData = async () => {
    setLoading(true)
    try {
      const [usersRes, auditRes] = await Promise.all([
        fetch('/api/users'),
        fetch('/api/audit-logs?limit=50'),
      ])

      console.log('Users response status:', usersRes.status)
      console.log('Audit response status:', auditRes.status)

      const usersData = await usersRes.json()
      const auditData = await auditRes.json()

      console.log('Users data:', usersData)
      console.log('Audit data:', auditData)

      if (usersData.success && Array.isArray(usersData.data)) {
        console.log('Setting users:', usersData.data)
        setUsers(usersData.data)
      } else {
        console.log('Users data not valid, setting empty array')
        setUsers([])
      }

      if (auditData.success && Array.isArray(auditData.data)) {
        setAuditLogs(auditData.data)
      } else {
        setAuditLogs([])
      }
    } catch (error) {
      console.error('Error loading admin data:', error)
      setUsers([])
      setAuditLogs([])
    } finally {
      setLoading(false)
    }
  }

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreateLoading(true)

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.success) {
        alert('Usuario creado exitosamente')
        setShowCreateModal(false)
        setFormData({
          name: '',
          email: '',
          password: '',
          role: 'ACCOUNTANT',
        })
        loadData() // Recargar la lista de usuarios
      } else {
        alert('Error al crear usuario: ' + data.error)
      }
    } catch (error) {
      console.error('Error creating user:', error)
      alert('Error al crear usuario')
    } finally {
      setCreateLoading(false)
    }
  }

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
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <ShieldCheckIcon className="w-10 h-10 text-nuam-600" />
            Panel de Administración
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Gestión de usuarios y auditoría del sistema
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Usuarios Totales</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {(users?.length || 0).toLocaleString()}
                </p>
              </div>
              <UserGroupIcon className="w-12 h-12 text-nuam-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Usuarios Activos</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {(Array.isArray(users) ? users.filter(u => u.isActive).length : 0).toLocaleString()}
                </p>
              </div>
              <ShieldCheckIcon className="w-12 h-12 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Eventos de Auditoría</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {(auditLogs?.length || 0).toLocaleString()}
                </p>
              </div>
              <ClockIcon className="w-12 h-12 text-blue-500" />
            </div>
          </div>
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
                <UserGroupIcon className="w-5 h-5 inline-block mr-2" />
                Usuarios
              </button>
              <button
                onClick={() => setActiveTab('audit')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'audit'
                    ? 'border-nuam-500 text-nuam-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <ClockIcon className="w-5 h-5 inline-block mr-2" />
                Auditoría
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'settings'
                    ? 'border-nuam-500 text-nuam-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <ChartBarIcon className="w-5 h-5 inline-block mr-2" />
                Configuración
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'users' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Gestión de Usuarios
                  </h2>
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="px-4 py-2 bg-nuam-600 text-white rounded-lg hover:bg-nuam-700 transition-colors"
                  >
                    Crear Usuario
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Usuario
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Rol
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Estado
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Último Login
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users && users.length > 0 ? users.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-nuam-600 rounded-full flex items-center justify-center">
                                <span className="text-white font-medium">
                                  {user.name?.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {user.name}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {user.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${roleColors[user.role] || 'bg-gray-100 text-gray-800'}`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {user.isActive ? 'Activo' : 'Inactivo'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {user.lastLoginAt
                              ? new Date(user.lastLoginAt).toLocaleString('es-ES')
                              : 'Nunca'}
                          </td>
                        </tr>
                      )) : (
                        <tr>
                          <td colSpan={5} className="px-6 py-8 text-center text-sm text-gray-500">
                            No hay usuarios para mostrar
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'audit' && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Registro de Auditoría (Últimos 50 eventos)
                </h2>

                <div className="space-y-4">
                  {auditLogs && auditLogs.length > 0 ? auditLogs.map((log) => (
                    <div
                      key={log.id}
                      className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${actionColors[log.action] || 'bg-gray-100 text-gray-800'}`}>
                              {log.action}
                            </span>
                            <span className="text-sm font-medium text-gray-900">
                              {log.entityType} #{log.entityId?.substring(0, 8)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">
                            Usuario: {log.user?.name || 'Sistema'} ({log.user?.email || 'N/A'})
                          </p>
                          {log.newValues && (
                            <pre className="mt-2 text-xs text-gray-500 bg-gray-50 p-2 rounded overflow-x-auto">
                              {JSON.stringify(log.newValues, null, 2)}
                            </pre>
                          )}
                        </div>
                        <div className="text-right text-sm text-gray-500">
                          {new Date(log.createdAt).toLocaleString('es-ES')}
                        </div>
                      </div>
                    </div>
                  )) : (
                    <div className="text-center py-12 text-gray-500">
                      No hay eventos de auditoría para mostrar
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Configuración del Sistema
                </h2>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-800">
                    Panel de configuración en desarrollo. Próximamente podrás gestionar:
                  </p>
                  <ul className="mt-2 text-sm text-blue-700 list-disc list-inside">
                    <li>Configuración de seguridad</li>
                    <li>Límites de intentos de login</li>
                    <li>Duración de sesiones</li>
                    <li>Notificaciones por email</li>
                    <li>Configuración de permisos</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Crear Usuario */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Crear Nuevo Usuario
                  </h3>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <form onSubmit={handleCreateUser}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nombre Completo
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nuam-500 focus:border-transparent"
                        placeholder="Juan Pérez"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nuam-500 focus:border-transparent"
                        placeholder="usuario@ejemplo.com"
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
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nuam-500 focus:border-transparent"
                        placeholder="Mínimo 8 caracteres"
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        La contraseña debe tener al menos 8 caracteres
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Rol
                      </label>
                      <select
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nuam-500 focus:border-transparent"
                      >
                        <option value="VIEWER">Viewer - Solo lectura limitada</option>
                        <option value="AUDITOR">Auditor - Lectura + logs de auditoría</option>
                        <option value="ACCOUNTANT">Contador - CRUD de calificaciones</option>
                        <option value="MANAGER">Manager - Aprobaciones + gestión</option>
                        <option value="ADMIN">Admin - Acceso completo</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-6 flex gap-3">
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
                      className="flex-1 px-4 py-2 bg-nuam-600 text-white rounded-lg hover:bg-nuam-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {createLoading ? 'Creando...' : 'Crear Usuario'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
