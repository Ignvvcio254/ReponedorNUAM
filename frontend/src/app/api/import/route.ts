import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { Country, ImportStatus } from '../../../generated/prisma'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const userId = formData.get('userId') as string
    
    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No se proporcionó archivo' },
        { status: 400 }
      )
    }

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'ID de usuario es requerido' },
        { status: 400 }
      )
    }

    // Verificar que el usuario existe
    const user = await db.users.findUnique({
      where: { id: userId }
    })
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Usuario no encontrado' },
        { status: 404 }
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

    // Crear registro de importación
    const importBatch = await db.importBatches.create({
      data: {
        fileName: file.name,
        totalRecords: lines.length - 1, // -1 para excluir headers
        processedRecords: 0,
        successfulRecords: 0,
        failedRecords: 0,
        status: 'PROCESSING',
        userId: userId
      }
    })

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
    const requiredHeaders = ['emisorName', 'period', 'amount', 'country']
    const missingHeaders = requiredHeaders.filter(h => !headers.includes(h))
    
    if (missingHeaders.length > 0) {
      await db.importBatches.update({
        where: { id: importBatch.id },
        data: {
          status: 'FAILED',
          errors: { message: `Faltan columnas requeridas: ${missingHeaders.join(', ')}` }
        }
      })
      
      return NextResponse.json(
        { 
          success: false, 
          error: `Faltan columnas requeridas: ${missingHeaders.join(', ')}`
        },
        { status: 400 }
      )
    }

    // Factores de conversión por país
    const exchangeRates: Record<string, number> = {
      CL: 64649,  // UTM Chile
      PE: 5150,   // UIT Perú
      CO: 42412,  // UVT Colombia
      MX: 108.57, // UMA México
      AR: 25000,  // UF Argentina
      BR: 7239,   // UFIR Brasil
      UY: 5650,   // UI Uruguay
      PY: 4200,   // JSM Paraguay
      BO: 23600,  // UFV Bolivia
      EC: 760,    // SBU Ecuador
      VE: 0.5,    // PT Venezuela
      PA: 0.05,   // TB Panamá
      CR: 946,    // SB Costa Rica
      GT: 300,    // SM Guatemala
      US: 1       // Base USD
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
        
        if (!rowData.period || !/^\d{4}-\d{2}$/.test(rowData.period)) {
          throw new Error('Período debe estar en formato YYYY-MM')
        }
        
        if (!rowData.amount || isNaN(parseFloat(rowData.amount))) {
          throw new Error('Monto debe ser un número válido')
        }
        
        if (!rowData.country || !Object.keys(exchangeRates).includes(rowData.country)) {
          throw new Error(`País debe ser uno de: ${Object.keys(exchangeRates).join(', ')}`)
        }

        // Obtener factor tributario
        const factor = exchangeRates[rowData.country] || 1
        const amount = parseFloat(rowData.amount)
        const calculatedValue = amount / factor

        // Crear calificación
        await db.qualifications.create({
          data: {
            emisorName: rowData.emisorName,
            taxId: rowData.taxId || null,
            country: rowData.country as Country,
            period: rowData.period,
            amount: amount,
            currency: rowData.currency || 'USD',
            calculatedValue: calculatedValue,
            status: 'DRAFT',
            observations: rowData.observations || null,
            documentUrl: rowData.documentUrl || null,
            userId: userId
          }
        })
        
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

    // Actualizar el registro de importación
    await db.importBatches.update({
      where: { id: importBatch.id },
      data: {
        processedRecords: results.success + results.errors,
        successfulRecords: results.success,
        failedRecords: results.errors,
        status: results.errors > 0 && results.success === 0 ? 'FAILED' : 'COMPLETED',
        errors: results.errorDetails.length > 0 ? { errors: results.errorDetails } : null
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        importBatchId: importBatch.id,
        ...results
      }
    })

  } catch (error) {
    console.error('Error processing import:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
