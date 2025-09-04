'use client'

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="nuam-gradient shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-white">
                NUAM
              </h1>
              <span className="ml-2 text-white/80 text-sm">
                Calificaciones Tributarias
              </span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="/dashboard" className="text-white/90 hover:text-white transition-colors">
                Dashboard
              </a>
              <a href="/qualifications" className="text-white/90 hover:text-white transition-colors">
                Calificaciones
              </a>
              <a href="/import" className="text-white/90 hover:text-white transition-colors">
                Importación
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Bienvenido al Sistema NUAM
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Gestiona calificaciones tributarias de forma eficiente para las bolsas de 
            Santiago, Lima y Colombia con herramientas avanzadas de procesamiento y análisis.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="nuam-card text-center">
            <div className="text-3xl font-bold text-nuam-600 mb-2">1,247</div>
            <div className="text-gray-600">Calificaciones Procesadas</div>
          </div>
          <div className="nuam-card text-center">
            <div className="text-3xl font-bold text-nuam-600 mb-2">98.5%</div>
            <div className="text-gray-600">Precisión OCR</div>
          </div>
          <div className="nuam-card text-center">
            <div className="text-3xl font-bold text-nuam-600 mb-2">3</div>
            <div className="text-gray-600">Países Conectados</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <a href="/qualifications" className="nuam-card hover:shadow-md transition-shadow cursor-pointer">
            <div className="text-center">
              <div className="w-12 h-12 bg-nuam-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-nuam-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Nueva Calificación</h3>
              <p className="text-sm text-gray-600">Agregar manualmente una nueva calificación tributaria</p>
            </div>
          </a>

          <a href="/import" className="nuam-card hover:shadow-md transition-shadow cursor-pointer">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Carga Masiva</h3>
              <p className="text-sm text-gray-600">Importar múltiples calificaciones desde CSV o Excel</p>
            </div>
          </a>

          <div className="nuam-card hover:shadow-md transition-shadow cursor-pointer">
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Procesar PDF</h3>
              <p className="text-sm text-gray-600">Extraer datos usando tecnología OCR avanzada</p>
            </div>
          </div>

          <a href="/dashboard" className="nuam-card hover:shadow-md transition-shadow cursor-pointer">
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Ver Dashboard</h3>
              <p className="text-sm text-gray-600">Analizar métricas y ver resumen general</p>
            </div>
          </a>
        </div>
      </main>
    </div>
  )
}
