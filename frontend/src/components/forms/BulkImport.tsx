'use client'

import { useState, useCallback, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { useToast } from '@/components/ui/ToastContainer'

interface ImportResult {
  success: number
  errors: number
  errorDetails: Array<{
    row: number
    error: string
    data: any
  }>
}

export function BulkImport({ onSuccess }: { onSuccess?: () => void }) {
  const toast = useToast()
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<any[]>([])
  const [importing, setImporting] = useState(false)
  const [result, setResult] = useState<ImportResult | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const handleFileSelect = useCallback((selectedFile: File) => {
    setFile(selectedFile)
    setResult(null)
    
    if (selectedFile.type === 'text/csv' || selectedFile.name.endsWith('.csv')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const csv = e.target?.result as string
        const lines = csv.split('\n')
        const headers = lines[0].split(',').map(h => h.trim())
        const rows = lines.slice(1, 6).map(line => {
          const values = line.split(',').map(v => v.trim())
          const row: any = {}
          headers.forEach((header, index) => {
            row[header] = values[index] || ''
          })
          return row
        }).filter(row => Object.values(row).some(v => v))
        
        setPreview(rows)
      }
      reader.readAsText(selectedFile)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
    
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) {
      handleFileSelect(droppedFile)
    }
  }, [handleFileSelect])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
  }, [])

  const processImport = async () => {
    if (!file) return
    
    setImporting(true)
    const formData = new FormData()
    formData.append('file', file)
    
    try {
      const response = await fetch('/api/import', {
        method: 'POST',
        body: formData
      })
      
      const result = await response.json()
      setResult(result)
      
      if (result.success > 0) {
        if (onSuccess) onSuccess()
      } else {
        toast.error('Error en la importación: ' + result.error)
      }
    } catch (error) {
      toast.error('Error al procesar el archivo: ' + (error as Error).message)
    } finally {
      setImporting(false)
    }
  }

  const downloadTemplate = () => {
    const template = [
      'emisorName,taxId,period,amount,country',
      'Empresa Ejemplo S.A.,76.123.456-7,2024-08,150000,CL',
      'Corporación Lima EIRL,20123456789,2024-08,85000,PE',
      'Inversiones Bogotá Ltda.,900.123.456-1,2024-08,320000,CO'
    ].join('\n')

    const blob = new Blob([template], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'plantilla_calificaciones.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Instructions Card */}
      <div className={`relative overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-lg transition-all duration-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        
        <div className="relative p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Importación Masiva de Calificaciones</h2>
              <p className="text-sm text-gray-500">Carga un archivo CSV con calificaciones tributarias</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {[
              { field: 'emisorName', desc: 'Nombre de la empresa', icon: '🏢' },
              { field: 'taxId', desc: 'RUT o ID tributario', icon: '🆔' },
              { field: 'period', desc: 'Período (YYYY-MM)', icon: '📅' },
              { field: 'amount', desc: 'Monto', icon: '💰' },
              { field: 'country', desc: 'País (CL, PE, CO)', icon: '🌍' }
            ].map((item, i) => (
              <div key={item.field} className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100">
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <p className="font-medium text-gray-900 text-sm">{item.field}</p>
                  <p className="text-xs text-gray-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
          
          <button 
            onClick={downloadTemplate}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 font-medium rounded-xl hover:from-gray-200 hover:to-gray-300 transition-all shadow-sm"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Descargar Plantilla CSV
          </button>
        </div>
      </div>

      {/* Upload Area */}
      <div className={`relative overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-lg transition-all duration-500 delay-100 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
        <div className="p-6">
          <div
            className={`relative overflow-hidden rounded-2xl border-2 border-dashed p-12 text-center transition-all duration-300 ${
              dragActive 
                ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 scale-[1.02]' 
                : file
                  ? 'border-green-400 bg-gradient-to-br from-green-50 to-emerald-50'
                  : 'border-gray-200 hover:border-gray-300 bg-gray-50/50'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            {/* Background decoration */}
            <div className="absolute inset-0 pointer-events-none">
              <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full blur-3xl transition-opacity duration-300 ${
                dragActive ? 'bg-blue-400/20 opacity-100' : 'opacity-0'
              }`} />
            </div>
            
            <div className="relative">
              {file ? (
                <div className="space-y-4">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-lg">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-gray-900">{file.name}</p>
                    <p className="text-sm text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
                  </div>
                  <div className="flex justify-center gap-3">
                    <button
                      onClick={processImport}
                      disabled={importing}
                      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {importing ? (
                        <>
                          <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                          Procesando...
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          Importar Datos
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setFile(null)
                        setPreview([])
                      }}
                      className="px-6 py-3 text-gray-700 font-medium bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                    >
                      Cambiar
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-lg font-medium text-gray-700">
                      Arrastra tu archivo CSV aquí
                    </p>
                    <p className="text-sm text-gray-500">o</p>
                  </div>
                  <button
                    onClick={() => {
                      const input = document.createElement('input')
                      input.type = 'file'
                      input.accept = '.csv'
                      input.onchange = (e) => {
                        const selectedFile = (e.target as HTMLInputElement).files?.[0]
                        if (selectedFile) handleFileSelect(selectedFile)
                      }
                      input.click()
                    }}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl"
                  >
                    Seleccionar Archivo
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Preview Table */}
      {preview.length > 0 && (
        <div className={`relative overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-lg transition-all duration-500 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Vista Previa</h3>
                <p className="text-sm text-gray-500">Primeras {preview.length} filas</p>
              </div>
            </div>
            
            <div className="overflow-x-auto rounded-xl border border-gray-200">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                    {Object.keys(preview[0] || {}).map((header) => (
                      <th key={header} className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {preview.map((row, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      {Object.values(row).map((value: any, cellIndex) => (
                        <td key={cellIndex} className="px-4 py-3 text-sm text-gray-700">
                          {value}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      {result && (
        <div className={`relative overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-lg transition-all duration-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg ${
                result.errors === 0 
                  ? 'bg-gradient-to-br from-green-400 to-emerald-500' 
                  : 'bg-gradient-to-br from-yellow-400 to-amber-500'
              }`}>
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {result.errors === 0 ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
                  )}
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Resultado de la Importación</h3>
                <p className="text-sm text-gray-500">
                  {result.errors === 0 ? 'Importación exitosa' : 'Importación con errores'}
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 p-4 border border-green-100">
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-green-400/20 to-emerald-500/20 rounded-full blur-xl -translate-y-1/2 translate-x-1/2" />
                <p className="text-sm font-medium text-green-600">Exitosos</p>
                <p className="text-3xl font-bold text-green-700">{result.success}</p>
              </div>
              <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-red-50 to-rose-50 p-4 border border-red-100">
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-red-400/20 to-rose-500/20 rounded-full blur-xl -translate-y-1/2 translate-x-1/2" />
                <p className="text-sm font-medium text-red-600">Errores</p>
                <p className="text-3xl font-bold text-red-700">{result.errors}</p>
              </div>
            </div>
            
            {result.errorDetails && result.errorDetails.length > 0 && (
              <div className="rounded-xl bg-red-50 border border-red-100 p-4">
                <p className="font-medium text-red-700 mb-3">Detalles de errores:</p>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {result.errorDetails.map((error, index) => (
                    <div key={index} className="flex items-start gap-2 text-sm bg-white rounded-lg p-2 border border-red-100">
                      <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs font-medium shrink-0">
                        Fila {error.row}
                      </span>
                      <span className="text-red-600">{error.error}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}