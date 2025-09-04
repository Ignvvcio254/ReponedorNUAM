'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Logo } from '@/components/ui/Logo'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: '📊' },
  { name: 'Calificaciones', href: '/qualifications', icon: '📋' },
  { name: 'Importar', href: '/import', icon: '📤' },
]

export function Header() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

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
                  'flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                  pathname === item.href
                    ? 'bg-nuam-100 text-nuam-700 shadow-sm'
                    : 'text-gray-600 hover:text-nuam-600 hover:bg-nuam-50'
                )}
              >
                <span className="text-lg">{item.icon}</span>
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
                  'flex items-center space-x-1 px-2 py-2 rounded-lg text-xs font-medium transition-all duration-200',
                  pathname === item.href
                    ? 'bg-nuam-100 text-nuam-700 shadow-sm'
                    : 'text-gray-600 hover:text-nuam-600 hover:bg-nuam-50'
                )}
                title={item.name}
              >
                <span className="text-base">{item.icon}</span>
                <span className="hidden sm:inline">{item.name}</span>
              </Link>
            ))}
          </nav>

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
              ? 'max-h-64 opacity-100 pb-4'
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
                  'flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium transition-all duration-200',
                  pathname === item.href
                    ? 'bg-nuam-100 text-nuam-700 shadow-sm border-l-4 border-nuam-500'
                    : 'text-gray-700 hover:text-nuam-600 hover:bg-nuam-50 active:bg-nuam-100'
                )}
              >
                <span className="text-xl">{item.icon}</span>
                <span>{item.name}</span>
                {pathname === item.href && (
                  <div className="ml-auto w-2 h-2 bg-nuam-500 rounded-full"></div>
                )}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  )
}