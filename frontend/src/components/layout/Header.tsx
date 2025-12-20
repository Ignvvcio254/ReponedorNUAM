'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { Logo } from '@/components/ui/Logo'
import { cn } from '@/lib/utils'

const getNavigation = (userRole?: string) => {
  const baseNavigation = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Calificaciones', href: '/qualifications' },
    { name: 'Entidades', href: '/tax-entities' },
    { name: 'Importar', href: '/import' },
    { name: 'Reportes', href: '/reports' },
  ]

  if (userRole === 'ADMIN') {
    return [...baseNavigation, { name: 'Admin', href: '/admin' }]
  }

  return baseNavigation
}

export function Header() {
  const pathname = usePathname()
  const { data: session, status } = useSession()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  // Hide header on public pages (login, register, etc.)
  const publicRoutes = ['/login', '/register', '/forgot-password']
  if (publicRoutes.some(route => pathname?.startsWith(route))) {
    return null
  }

  const navigation = getNavigation(session?.user.role)

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/login' })
  }

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Logo - solo logo, sin texto */}
          <Link href="/dashboard" className="flex-shrink-0 flex items-center">
            <Logo size="lg" showText={false} />
          </Link>

          {/* Navigation Desktop */}
          <nav className="hidden lg:flex space-x-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                  pathname === item.href
                    ? 'bg-nuam-100 text-nuam-700 shadow-sm'
                    : 'text-gray-600 hover:text-nuam-600 hover:bg-nuam-50'
                )}
              >
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>

          {/* Navigation Tablet */}
          <nav className="hidden md:flex lg:hidden space-x-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center px-2 py-2 rounded-lg text-xs font-medium transition-all duration-200',
                  pathname === item.href
                    ? 'bg-nuam-100 text-nuam-700 shadow-sm'
                    : 'text-gray-600 hover:text-nuam-600 hover:bg-nuam-50'
                )}
                title={item.name}
              >
                <span className="sm:inline">{item.name}</span>
              </Link>
            ))}
          </nav>

          {/* User Menu - Desktop & Tablet */}
          {status === 'authenticated' && session?.user && (
            <div className="hidden md:flex items-center space-x-4">
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {session.user.name}
                    </p>
                    <p className="text-xs text-gray-500">{session.user.role}</p>
                  </div>
                  <div className="w-8 h-8 bg-nuam-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {session.user.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      Cerrar sesión
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="relative p-2 rounded-lg text-gray-400 hover:text-nuam-600 hover:bg-nuam-50 focus:outline-none focus:ring-2 focus:ring-nuam-500 focus:ring-offset-2 transition-colors"
            >
              <span className="sr-only">
                {mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú principal'}
              </span>
              <div className="w-6 h-6 relative">
                <span
                  className={cn(
                    'absolute h-0.5 w-6 bg-current transform transition-all duration-300',
                    mobileMenuOpen 
                      ? 'rotate-45 translate-y-0' 
                      : 'rotate-0 -translate-y-2'
                  )}
                />
                <span
                  className={cn(
                    'absolute h-0.5 w-6 bg-current transform transition-all duration-300',
                    mobileMenuOpen ? 'opacity-0' : 'opacity-100'
                  )}
                />
                <span
                  className={cn(
                    'absolute h-0.5 w-6 bg-current transform transition-all duration-300',
                    mobileMenuOpen 
                      ? '-rotate-45 translate-y-0' 
                      : 'rotate-0 translate-y-2'
                  )}
                />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div
          className={cn(
            'md:hidden transition-all duration-300 ease-in-out overflow-hidden',
            mobileMenuOpen
              ? 'max-h-96 opacity-100 pb-4'
              : 'max-h-0 opacity-0 pb-0'
          )}
        >
          <nav className="flex flex-col space-y-2 pt-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  'flex items-center px-4 py-3 rounded-lg text-base font-medium transition-all duration-200',
                  pathname === item.href
                    ? 'bg-nuam-100 text-nuam-700 shadow-sm border-l-4 border-nuam-500'
                    : 'text-gray-700 hover:text-nuam-600 hover:bg-nuam-50 active:bg-nuam-100'
                )}
              >
                <span>{item.name}</span>
                {pathname === item.href && (
                  <div className="ml-auto w-2 h-2 bg-nuam-500 rounded-full"></div>
                )}
              </Link>
            ))}

            {/* User Info & Logout - Mobile */}
            {status === 'authenticated' && session?.user && (
              <>
                <div className="border-t border-gray-200 mt-2 pt-2 px-4 py-2">
                  <p className="text-sm font-medium text-gray-900">
                    {session.user.name}
                  </p>
                  <p className="text-xs text-gray-500">{session.user.email}</p>
                  <p className="text-xs text-nuam-600 font-medium mt-1">
                    {session.user.role}
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-left px-4 py-3 rounded-lg text-base font-medium text-red-600 hover:bg-red-50 active:bg-red-100 transition-all duration-200"
                >
                  Cerrar sesión
                </button>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}