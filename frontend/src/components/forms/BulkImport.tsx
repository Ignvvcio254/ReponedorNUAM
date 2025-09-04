'use client'

import { useState, useCallback } from 'react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'

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
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<any[]>([])
  const [importing, setImporting] = useState(false)
  const [result, setResult] = useState<ImportResult | null>(null)
  const [dragActive, setDragActive] = useState(false)

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
        alert('Error en la importación: ' + result.error)
      }
    } catch (error) {
      alert('Error al procesar el archivo: ' + (error as Error).message)
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
      <Card>
        <CardHeader>
          <CardTitle>Importación Masiva de Calificaciones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-gray-600">
              Sube un archivo CSV con las calificaciones tributarias. El archivo debe contener las siguientes columnas:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <ul className="text-sm space-y-1">
                <li><strong>emisorName:</strong> Nombre de la empresa</li>
                <li><strong>taxId:</strong> RUT o identificación tributaria</li>
                <li><strong>period:</strong> Período (YYYY-MM)</li>
                <li><strong>amount:</strong> Monto</li>
                <li><strong>country:</strong> País (CL, PE, CO)</li>
              </ul>
            </div>
            <Button onClick={downloadTemplate} variant="secondary">
              Descargar Plantilla CSV
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive 
                ? 'border-nuam-500 bg-nuam-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            {file ? (
              <div className="space-y-2">
                <div className="text-green-600 font-medium">
                  ✓ Archivo seleccionado: {file.name}
                </div>
                <Button onClick={processImport} disabled={importing}>
                  {importing ? 'Procesando...' : 'Importar Datos'}
                </Button>
                <Button 
                  variant="secondary" 
                  onClick={() => {
                    setFile(null)
                    setPreview([])
                  }}
                >
                  Cambiar Archivo
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-gray-600">
                  <div className="text-4xl mb-4">📄</div>
                  <p>Arrastra tu archivo CSV aquí o</p>
                </div>
                <Button variant="secondary" onClick={() => {
                  const input = document.createElement('input')
                  input.type = 'file'
                  input.accept = '.csv'
                  input.onchange = (e) => {
                    const selectedFile = (e.target as HTMLInputElement).files?.[0]
                    if (selectedFile) handleFileSelect(selectedFile)
                  }
                  input.click()
                }}>
                  Seleccionar Archivo
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {preview.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Vista Previa (primeras 5 filas)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-50">
                    {Object.keys(preview[0] || {}).map((header) => (
                      <th key={header} className="border border-gray-300 p-2 text-left">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {preview.map((row, index) => (
                    <tr key={index}>
                      {Object.values(row).map((value: any, cellIndex) => (
                        <td key={cellIndex} className="border border-gray-300 p-2">
                          {value}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Resultado de la Importación</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex space-x-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-green-600 font-semibold">Exitosos: {result.success}</div>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <div className="text-red-600 font-semibold">Errores: {result.errors}</div>
                </div>
              </div>
              
              {result.errorDetails && result.errorDetails.length > 0 && (
                <div className="bg-red-50 p-4 rounded-lg">
                  <div className="text-red-600 font-medium mb-2">Detalles de errores:</div>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {result.errorDetails.map((error, index) => (
                      <div key={index} className="text-sm">
                        <strong>Fila {error.row}:</strong> {error.error}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}