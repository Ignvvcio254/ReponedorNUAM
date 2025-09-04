import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { TAX_FACTORS } from '@/lib/constants'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No se proporcionó archivo' },
        { status: 400 }
      )
    }

    // Leer contenido del archivo
    const text = await file.text()
    const lines = text.split('\n').filter(line => line.trim())
    
    if (lines.length < 2) {
      return NextResponse.json(
        { success: false, error: 'Archivo vacío o sin datos válidos' },
        { status: 400 }
      )
    }

    // Parsear CSV
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''))
    const dataRows = lines.slice(1)

    const results = {
      success: 0,
      errors: 0,
      errorDetails: [] as Array<{
        row: number
        error: string
        data: any
      }>
    }

    // Validar headers requeridos
    const requiredHeaders = ['emisorName', 'taxId', 'period', 'amount', 'country']
    const missingHeaders = requiredHeaders.filter(h => !headers.includes(h))
    
    if (missingHeaders.length > 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: Faltan columnas requeridas:  
        },
        { status: 400 }
      )
    }

    // Procesar cada fila
    for (let i = 0; i < dataRows.length; i++) {
      const row = dataRows[i]
      const rowNumber = i + 2 // +2 porque empezamos en línea 1 (headers) y el índice es 0

      try {
        if (!row.trim()) continue // Saltar filas vacías

        const values = row.split(',').map(v => v.trim().replace(/"/g, ''))
        const rowData: any = {}
        
        headers.forEach((header, index) => {
          rowData[header] = values[index] || ''
        })

        // Validaciones
        if (!rowData.emisorName) {
          throw new Error('Nombre del emisor es requerido')
        }
        
        if (!rowData.taxId) {
          throw new Error('RUT/ID tributario es requerido')
        }
        
        if (!rowData.period || !/^\d{4}-\d{2}$/.test(rowData.period)) {
          throw new Error('Período debe estar en formato YYYY-MM')
        }
        
        if (!rowData.amount || isNaN(parseFloat(rowData.amount))) {
          throw new Error('Monto debe ser un número válido')
        }
        
        if (!rowData.country || !['CL', 'PE', 'CO'].includes(rowData.country)) {
          throw new Error('País debe ser CL, PE o CO')
        }

        // Obtener factor tributario
        const factor = TAX_FACTORS[rowData.country as keyof typeof TAX_FACTORS]
        const factorValue = Object.values(factor)[0] as number

        // Crear calificación
        const qualification = {
          emisorId: 	emp--,
          emisorName: rowData.emisorName,
          period: rowData.period,
          amount: parseFloat(rowData.amount),
          factorApplied: factorValue,
          calculatedValue: parseFloat(rowData.amount) / factorValue,
          status: 'DRAFT' as const,
          country: rowData.country
        }

        await db.qualifications.create(qualification)
        results.success++

      } catch (error) {
        results.errors++
        results.errorDetails.push({
          row: rowNumber,
          error: (error as Error).message,
          data: row
        })
      }
    }

    return NextResponse.json({
      success: true,
      data: results
    })

  } catch (error) {
    console.error('Error processing import:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
