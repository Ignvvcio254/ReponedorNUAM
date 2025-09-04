import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Header } from '@/components/layout/Header'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'NUAM - Mantenedor de Calificaciones Tributarias',
  description: 'Sistema para gestión de calificaciones tributarias de las bolsas de Santiago, Lima y Colombia',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <main>
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}
