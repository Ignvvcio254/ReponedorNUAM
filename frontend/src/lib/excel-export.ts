import * as XLSX from 'xlsx'

// Tipos para los reportes
export interface QualificationReport {
  id: string
  emisorName: string
  taxId: string | null
  country: string
  period: string
  amount: number
  currency: string
  calculatedValue: number | null
  status: string
  createdAt: string
  userName: string
  userEmail: string
}

export interface TaxEntityReport {
  id: string
  businessName: string
  taxId: string
  entityType: string
  country: string
  taxRegime: string
  status: string
  registrationDate: string | null
  createdAt: string
}

export interface SummaryReport {
  country: string
  totalQualifications: number
  approved: number
  pending: number
  rejected: number
  totalAmount: number
  averageAmount: number
}

/**
 * Exporta calificaciones a Excel con formato profesional
 */
export function exportQualificationsToExcel(
  data: QualificationReport[],
  filename: string = 'calificaciones'
) {
  // Crear workbook
  const wb = XLSX.utils.book_new()

  // Preparar datos con headers en español
  const worksheetData = [
    // Headers con formato
    [
      'ID',
      'Emisor',
      'RUT/RUC/RFC',
      'País',
      'Período',
      'Monto',
      'Moneda',
      'Valor Calculado',
      'Estado',
      'Fecha Creación',
      'Usuario',
      'Email Usuario',
    ],
    // Datos
    ...data.map((item) => [
      item.id,
      item.emisorName,
      item.taxId || 'N/A',
      item.country,
      item.period,
      item.amount,
      item.currency,
      item.calculatedValue?.toFixed(6) || 'N/A',
      item.status,
      new Date(item.createdAt).toLocaleDateString('es-ES'),
      item.userName,
      item.userEmail,
    ]),
  ]

  // Crear worksheet
  const ws = XLSX.utils.aoa_to_sheet(worksheetData)

  // Configurar anchos de columna
  ws['!cols'] = [
    { wch: 25 }, // ID
    { wch: 30 }, // Emisor
    { wch: 15 }, // RUT/RUC/RFC
    { wch: 8 },  // País
    { wch: 12 }, // Período
    { wch: 15 }, // Monto
    { wch: 10 }, // Moneda
    { wch: 18 }, // Valor Calculado
    { wch: 12 }, // Estado
    { wch: 15 }, // Fecha Creación
    { wch: 25 }, // Usuario
    { wch: 30 }, // Email Usuario
  ]

  // Agregar worksheet al workbook
  XLSX.utils.book_append_sheet(wb, ws, 'Calificaciones')

  // Generar archivo
  const timestamp = new Date().toISOString().split('T')[0]
  XLSX.writeFile(wb, `${filename}_${timestamp}.xlsx`)
}

/**
 * Exporta entidades tributarias a Excel con formato profesional
 */
export function exportTaxEntitiesToExcel(
  data: TaxEntityReport[],
  filename: string = 'entidades_tributarias'
) {
  const wb = XLSX.utils.book_new()

  const worksheetData = [
    // Headers
    [
      'ID',
      'Razón Social',
      'RUT/RUC/RFC',
      'Tipo de Entidad',
      'País',
      'Régimen Tributario',
      'Estado',
      'Fecha Registro',
      'Fecha Creación',
    ],
    // Datos
    ...data.map((item) => [
      item.id,
      item.businessName,
      item.taxId,
      item.entityType,
      item.country,
      item.taxRegime,
      item.status,
      item.registrationDate
        ? new Date(item.registrationDate).toLocaleDateString('es-ES')
        : 'N/A',
      new Date(item.createdAt).toLocaleDateString('es-ES'),
    ]),
  ]

  const ws = XLSX.utils.aoa_to_sheet(worksheetData)

  ws['!cols'] = [
    { wch: 25 }, // ID
    { wch: 35 }, // Razón Social
    { wch: 15 }, // RUT/RUC/RFC
    { wch: 20 }, // Tipo de Entidad
    { wch: 8 },  // País
    { wch: 20 }, // Régimen Tributario
    { wch: 12 }, // Estado
    { wch: 15 }, // Fecha Registro
    { wch: 15 }, // Fecha Creación
  ]

  XLSX.utils.book_append_sheet(wb, ws, 'Entidades Tributarias')

  const timestamp = new Date().toISOString().split('T')[0]
  XLSX.writeFile(wb, `${filename}_${timestamp}.xlsx`)
}

/**
 * Exporta reporte resumen por país a Excel con formato profesional
 */
export function exportSummaryToExcel(
  data: SummaryReport[],
  filename: string = 'resumen_por_pais'
) {
  const wb = XLSX.utils.book_new()

  const worksheetData = [
    // Headers
    [
      'País',
      'Total Calificaciones',
      'Aprobadas',
      'Pendientes',
      'Rechazadas',
      'Monto Total',
      'Monto Promedio',
    ],
    // Datos
    ...data.map((item) => [
      item.country,
      item.totalQualifications,
      item.approved,
      item.pending,
      item.rejected,
      item.totalAmount.toFixed(2),
      item.averageAmount.toFixed(2),
    ]),
  ]

  const ws = XLSX.utils.aoa_to_sheet(worksheetData)

  ws['!cols'] = [
    { wch: 8 },  // País
    { wch: 20 }, // Total Calificaciones
    { wch: 12 }, // Aprobadas
    { wch: 12 }, // Pendientes
    { wch: 12 }, // Rechazadas
    { wch: 15 }, // Monto Total
    { wch: 18 }, // Monto Promedio
  ]

  XLSX.utils.book_append_sheet(wb, ws, 'Resumen por País')

  const timestamp = new Date().toISOString().split('T')[0]
  XLSX.writeFile(wb, `${filename}_${timestamp}.xlsx`)
}

/**
 * Exporta múltiples pestañas en un solo archivo Excel
 */
export function exportCompleteReport(
  qualifications: QualificationReport[],
  entities: TaxEntityReport[],
  summary: SummaryReport[],
  filename: string = 'reporte_completo'
) {
  const wb = XLSX.utils.book_new()

  // Pestaña 1: Resumen
  const summaryData = [
    ['REPORTE COMPLETO DEL SISTEMA TRIBUTARIO NUAM'],
    ['Generado el:', new Date().toLocaleString('es-ES')],
    [],
    ['País', 'Total Calificaciones', 'Aprobadas', 'Pendientes', 'Rechazadas', 'Monto Total', 'Monto Promedio'],
    ...summary.map((item) => [
      item.country,
      item.totalQualifications,
      item.approved,
      item.pending,
      item.rejected,
      item.totalAmount.toFixed(2),
      item.averageAmount.toFixed(2),
    ]),
  ]
  const wsSummary = XLSX.utils.aoa_to_sheet(summaryData)
  wsSummary['!cols'] = [
    { wch: 8 },
    { wch: 20 },
    { wch: 12 },
    { wch: 12 },
    { wch: 12 },
    { wch: 15 },
    { wch: 18 },
  ]
  XLSX.utils.book_append_sheet(wb, wsSummary, 'Resumen')

  // Pestaña 2: Calificaciones
  const qualData = [
    ['ID', 'Emisor', 'RUT/RUC/RFC', 'País', 'Período', 'Monto', 'Moneda', 'Valor Calculado', 'Estado', 'Fecha', 'Usuario'],
    ...qualifications.map((item) => [
      item.id,
      item.emisorName,
      item.taxId || 'N/A',
      item.country,
      item.period,
      item.amount,
      item.currency,
      item.calculatedValue?.toFixed(6) || 'N/A',
      item.status,
      new Date(item.createdAt).toLocaleDateString('es-ES'),
      item.userName,
    ]),
  ]
  const wsQual = XLSX.utils.aoa_to_sheet(qualData)
  wsQual['!cols'] = [
    { wch: 25 },
    { wch: 30 },
    { wch: 15 },
    { wch: 8 },
    { wch: 12 },
    { wch: 15 },
    { wch: 10 },
    { wch: 18 },
    { wch: 12 },
    { wch: 15 },
    { wch: 25 },
  ]
  XLSX.utils.book_append_sheet(wb, wsQual, 'Calificaciones')

  // Pestaña 3: Entidades
  const entData = [
    ['ID', 'Razón Social', 'RUT/RUC/RFC', 'Tipo', 'País', 'Régimen', 'Estado', 'Fecha Registro'],
    ...entities.map((item) => [
      item.id,
      item.businessName,
      item.taxId,
      item.entityType,
      item.country,
      item.taxRegime,
      item.status,
      item.registrationDate ? new Date(item.registrationDate).toLocaleDateString('es-ES') : 'N/A',
    ]),
  ]
  const wsEnt = XLSX.utils.aoa_to_sheet(entData)
  wsEnt['!cols'] = [
    { wch: 25 },
    { wch: 35 },
    { wch: 15 },
    { wch: 20 },
    { wch: 8 },
    { wch: 20 },
    { wch: 12 },
    { wch: 15 },
  ]
  XLSX.utils.book_append_sheet(wb, wsEnt, 'Entidades')

  const timestamp = new Date().toISOString().split('T')[0]
  XLSX.writeFile(wb, `${filename}_${timestamp}.xlsx`)
}

/**
 * Formatea números para mostrar en Excel
 */
export function formatCurrency(value: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: currency,
  }).format(value)
}

/**
 * Traduce estados a español para reportes
 */
export function translateStatus(status: string): string {
  const translations: Record<string, string> = {
    DRAFT: 'Borrador',
    PENDING: 'Pendiente',
    APPROVED: 'Aprobado',
    REJECTED: 'Rechazado',
    EXPIRED: 'Expirado',
    ACTIVE: 'Activo',
    INACTIVE: 'Inactivo',
    SUSPENDED: 'Suspendido',
    DISSOLVED: 'Disuelto',
    UNDER_AUDIT: 'En Auditoría',
  }
  return translations[status] || status
}
