import XLSX from 'xlsx-js-style'

// =============================================================================
// Types for Reports
// =============================================================================

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

// =============================================================================
// Style Definitions - Premium Design
// =============================================================================

// Color palette
const COLORS = {
  primary: '1E3A5F',      // Dark blue
  secondary: '2563EB',    // Bright blue  
  success: '10B981',      // Green
  warning: 'F59E0B',      // Amber
  danger: 'EF4444',       // Red
  headerBg: '1E3A5F',     // Dark blue header
  headerText: 'FFFFFF',   // White text
  altRow: 'F8FAFC',       // Light gray for alternating rows
  white: 'FFFFFF',
  border: 'E2E8F0',       // Light border
  textDark: '1E293B',     // Dark text
  textMuted: '64748B',    // Muted text
}

// Header style
const headerStyle = {
  font: { 
    bold: true, 
    color: { rgb: COLORS.headerText },
    name: 'Calibri',
    sz: 11
  },
  fill: { 
    fgColor: { rgb: COLORS.headerBg },
    patternType: 'solid'
  },
  alignment: { 
    horizontal: 'center', 
    vertical: 'center',
    wrapText: true
  },
  border: {
    top: { style: 'thin', color: { rgb: COLORS.border } },
    bottom: { style: 'thin', color: { rgb: COLORS.border } },
    left: { style: 'thin', color: { rgb: COLORS.border } },
    right: { style: 'thin', color: { rgb: COLORS.border } }
  }
}

// Title style (for report headers)
const titleStyle = {
  font: { 
    bold: true, 
    color: { rgb: COLORS.primary },
    name: 'Calibri',
    sz: 16
  },
  alignment: { horizontal: 'left', vertical: 'center' }
}

// Subtitle style
const subtitleStyle = {
  font: { 
    color: { rgb: COLORS.textMuted },
    name: 'Calibri',
    sz: 10,
    italic: true
  },
  alignment: { horizontal: 'left', vertical: 'center' }
}

// Cell style (even rows)
const cellStyleEven = {
  font: { 
    color: { rgb: COLORS.textDark },
    name: 'Calibri',
    sz: 10
  },
  fill: { 
    fgColor: { rgb: COLORS.white },
    patternType: 'solid'
  },
  alignment: { vertical: 'center' },
  border: {
    bottom: { style: 'thin', color: { rgb: COLORS.border } }
  }
}

// Cell style (odd rows - alternating)
const cellStyleOdd = {
  font: { 
    color: { rgb: COLORS.textDark },
    name: 'Calibri',
    sz: 10
  },
  fill: { 
    fgColor: { rgb: COLORS.altRow },
    patternType: 'solid'
  },
  alignment: { vertical: 'center' },
  border: {
    bottom: { style: 'thin', color: { rgb: COLORS.border } }
  }
}

// Status badge styles
const statusStyles: Record<string, any> = {
  APPROVED: {
    font: { bold: true, color: { rgb: COLORS.white }, sz: 10 },
    fill: { fgColor: { rgb: COLORS.success }, patternType: 'solid' },
    alignment: { horizontal: 'center', vertical: 'center' },
    border: { bottom: { style: 'thin', color: { rgb: COLORS.border } } }
  },
  PENDING: {
    font: { bold: true, color: { rgb: COLORS.textDark }, sz: 10 },
    fill: { fgColor: { rgb: 'FEF3C7' }, patternType: 'solid' },
    alignment: { horizontal: 'center', vertical: 'center' },
    border: { bottom: { style: 'thin', color: { rgb: COLORS.border } } }
  },
  REJECTED: {
    font: { bold: true, color: { rgb: COLORS.white }, sz: 10 },
    fill: { fgColor: { rgb: COLORS.danger }, patternType: 'solid' },
    alignment: { horizontal: 'center', vertical: 'center' },
    border: { bottom: { style: 'thin', color: { rgb: COLORS.border } } }
  },
  DRAFT: {
    font: { bold: true, color: { rgb: COLORS.textDark }, sz: 10 },
    fill: { fgColor: { rgb: 'E2E8F0' }, patternType: 'solid' },
    alignment: { horizontal: 'center', vertical: 'center' },
    border: { bottom: { style: 'thin', color: { rgb: COLORS.border } } }
  },
  ACTIVE: {
    font: { bold: true, color: { rgb: COLORS.white }, sz: 10 },
    fill: { fgColor: { rgb: COLORS.success }, patternType: 'solid' },
    alignment: { horizontal: 'center', vertical: 'center' },
    border: { bottom: { style: 'thin', color: { rgb: COLORS.border } } }
  },
  INACTIVE: {
    font: { bold: true, color: { rgb: COLORS.textDark }, sz: 10 },
    fill: { fgColor: { rgb: 'E2E8F0' }, patternType: 'solid' },
    alignment: { horizontal: 'center', vertical: 'center' },
    border: { bottom: { style: 'thin', color: { rgb: COLORS.border } } }
  }
}

// Currency cell style
const currencyStyle = {
  font: { color: { rgb: COLORS.textDark }, sz: 10, name: 'Calibri' },
  numFmt: '$#,##0.00',
  alignment: { horizontal: 'right', vertical: 'center' }
}

// Country flag map
const COUNTRY_FLAGS: Record<string, string> = {
  CL: '🇨🇱 Chile',
  PE: '🇵🇪 Perú',
  CO: '🇨🇴 Colombia',
  MX: '🇲🇽 México',
  AR: '🇦🇷 Argentina',
  BR: '🇧🇷 Brasil',
  UY: '🇺🇾 Uruguay',
  PY: '🇵🇾 Paraguay',
  BO: '🇧🇴 Bolivia',
  EC: '🇪🇨 Ecuador',
  VE: '🇻🇪 Venezuela',
  PA: '🇵🇦 Panamá',
  CR: '🇨🇷 Costa Rica',
  GT: '🇬🇹 Guatemala',
  US: '🇺🇸 Estados Unidos',
}

// =============================================================================
// Helper Functions
// =============================================================================

function getCountryDisplay(code: string): string {
  return COUNTRY_FLAGS[code] || code
}

function applyStylesToSheet(ws: XLSX.WorkSheet, headerRow: number, dataStartRow: number, dataEndRow: number, numCols: number) {
  // Apply header styles
  for (let c = 0; c < numCols; c++) {
    const cellAddress = XLSX.utils.encode_cell({ r: headerRow, c })
    if (ws[cellAddress]) {
      ws[cellAddress].s = headerStyle
    }
  }

  // Apply alternating row styles
  for (let r = dataStartRow; r <= dataEndRow; r++) {
    const isOdd = (r - dataStartRow) % 2 === 1
    for (let c = 0; c < numCols; c++) {
      const cellAddress = XLSX.utils.encode_cell({ r, c })
      if (ws[cellAddress]) {
        ws[cellAddress].s = isOdd ? cellStyleOdd : cellStyleEven
      }
    }
  }
}

function applyStatusStyle(ws: XLSX.WorkSheet, row: number, col: number, status: string) {
  const cellAddress = XLSX.utils.encode_cell({ r: row, c: col })
  if (ws[cellAddress]) {
    ws[cellAddress].s = statusStyles[status] || cellStyleEven
    ws[cellAddress].v = translateStatus(status)
  }
}

// =============================================================================
// Export Functions
// =============================================================================

/**
 * Exporta calificaciones a Excel con formato profesional
 */
export function exportQualificationsToExcel(
  data: QualificationReport[],
  filename: string = 'calificaciones'
) {
  const wb = XLSX.utils.book_new()

  // Title rows
  const titleRow = [['📋 REPORTE DE CALIFICACIONES TRIBUTARIAS']]
  const subtitleRow = [[`Generado: ${new Date().toLocaleString('es-ES')} | Total registros: ${data.length}`]]
  const emptyRow = [['']]

  // Headers
  const headers = [[
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
  ]]

  // Data rows
  const dataRows = data.map((item) => [
    item.id.substring(0, 8) + '...',
    item.emisorName,
    item.taxId || 'N/A',
    getCountryDisplay(item.country),
    item.period,
    item.amount,
    item.currency,
    item.calculatedValue?.toFixed(6) || 'N/A',
    item.status, // Will be styled separately
    new Date(item.createdAt).toLocaleDateString('es-ES'),
    item.userName,
    item.userEmail,
  ])

  // Combine all rows
  const allData = [...titleRow, ...subtitleRow, ...emptyRow, ...headers, ...dataRows]
  const ws = XLSX.utils.aoa_to_sheet(allData)

  // Apply title style
  ws['A1'].s = titleStyle
  ws['A2'].s = subtitleStyle

  // Apply header and data styles
  applyStylesToSheet(ws, 3, 4, 3 + dataRows.length, 12)

  // Apply status styles (column 9, index 8)
  dataRows.forEach((_, index) => {
    const status = data[index].status
    applyStatusStyle(ws, 4 + index, 8, status)
  })

  // Column widths
  ws['!cols'] = [
    { wch: 12 },  // ID
    { wch: 30 },  // Emisor
    { wch: 15 },  // RUT
    { wch: 18 },  // País
    { wch: 12 },  // Período
    { wch: 15 },  // Monto
    { wch: 10 },  // Moneda
    { wch: 18 },  // Valor Calculado
    { wch: 14 },  // Estado
    { wch: 15 },  // Fecha
    { wch: 25 },  // Usuario
    { wch: 30 },  // Email
  ]

  // Row heights
  ws['!rows'] = [
    { hpt: 30 },  // Title
    { hpt: 18 },  // Subtitle
    { hpt: 12 },  // Empty
    { hpt: 25 },  // Header
  ]

  // Merge title cell
  ws['!merges'] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 11 } },
    { s: { r: 1, c: 0 }, e: { r: 1, c: 11 } },
  ]

  XLSX.utils.book_append_sheet(wb, ws, 'Calificaciones')

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

  const titleRow = [['🏢 REPORTE DE ENTIDADES TRIBUTARIAS']]
  const subtitleRow = [[`Generado: ${new Date().toLocaleString('es-ES')} | Total entidades: ${data.length}`]]
  const emptyRow = [['']]

  const headers = [[
    'ID',
    'Razón Social',
    'RUT/RUC/RFC',
    'Tipo de Entidad',
    'País',
    'Régimen Tributario',
    'Estado',
    'Fecha Registro',
    'Fecha Creación',
  ]]

  const dataRows = data.map((item) => [
    item.id.substring(0, 8) + '...',
    item.businessName,
    item.taxId,
    translateEntityType(item.entityType),
    getCountryDisplay(item.country),
    item.taxRegime,
    item.status,
    item.registrationDate ? new Date(item.registrationDate).toLocaleDateString('es-ES') : 'N/A',
    new Date(item.createdAt).toLocaleDateString('es-ES'),
  ])

  const allData = [...titleRow, ...subtitleRow, ...emptyRow, ...headers, ...dataRows]
  const ws = XLSX.utils.aoa_to_sheet(allData)

  ws['A1'].s = titleStyle
  ws['A2'].s = subtitleStyle

  applyStylesToSheet(ws, 3, 4, 3 + dataRows.length, 9)

  // Apply status styles (column 7, index 6)
  dataRows.forEach((_, index) => {
    const status = data[index].status
    applyStatusStyle(ws, 4 + index, 6, status)
  })

  ws['!cols'] = [
    { wch: 12 },
    { wch: 35 },
    { wch: 15 },
    { wch: 20 },
    { wch: 18 },
    { wch: 20 },
    { wch: 14 },
    { wch: 15 },
    { wch: 15 },
  ]

  ws['!rows'] = [{ hpt: 30 }, { hpt: 18 }, { hpt: 12 }, { hpt: 25 }]
  ws['!merges'] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 8 } },
    { s: { r: 1, c: 0 }, e: { r: 1, c: 8 } },
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

  const titleRow = [['📊 RESUMEN POR PAÍS - SISTEMA TRIBUTARIO NUAM']]
  const subtitleRow = [[`Generado: ${new Date().toLocaleString('es-ES')} | Países: ${data.length}`]]
  const emptyRow = [['']]

  const headers = [[
    'País',
    'Total Calificaciones',
    '✅ Aprobadas',
    '⏳ Pendientes',
    '❌ Rechazadas',
    '💰 Monto Total',
    '📈 Monto Promedio',
  ]]

  // Calculate totals
  const totals = data.reduce((acc, item) => ({
    totalQualifications: acc.totalQualifications + item.totalQualifications,
    approved: acc.approved + item.approved,
    pending: acc.pending + item.pending,
    rejected: acc.rejected + item.rejected,
    totalAmount: acc.totalAmount + item.totalAmount,
  }), { totalQualifications: 0, approved: 0, pending: 0, rejected: 0, totalAmount: 0 })

  const dataRows = data.map((item) => [
    getCountryDisplay(item.country),
    item.totalQualifications,
    item.approved,
    item.pending,
    item.rejected,
    `$${item.totalAmount.toLocaleString('es-ES', { minimumFractionDigits: 2 })}`,
    `$${item.averageAmount.toLocaleString('es-ES', { minimumFractionDigits: 2 })}`,
  ])

  // Add totals row
  const totalsRow = [[
    '🔢 TOTALES',
    totals.totalQualifications,
    totals.approved,
    totals.pending,
    totals.rejected,
    `$${totals.totalAmount.toLocaleString('es-ES', { minimumFractionDigits: 2 })}`,
    '-',
  ]]

  const allData = [...titleRow, ...subtitleRow, ...emptyRow, ...headers, ...dataRows, ...[['']], ...totalsRow]
  const ws = XLSX.utils.aoa_to_sheet(allData)

  ws['A1'].s = titleStyle
  ws['A2'].s = subtitleStyle

  applyStylesToSheet(ws, 3, 4, 3 + dataRows.length, 7)

  // Style totals row
  const totalsRowIndex = 4 + dataRows.length + 1
  for (let c = 0; c < 7; c++) {
    const cell = XLSX.utils.encode_cell({ r: totalsRowIndex, c })
    if (ws[cell]) {
      ws[cell].s = {
        font: { bold: true, color: { rgb: COLORS.white }, sz: 11 },
        fill: { fgColor: { rgb: COLORS.primary }, patternType: 'solid' },
        alignment: { horizontal: c === 0 ? 'left' : 'center', vertical: 'center' },
        border: {
          top: { style: 'medium', color: { rgb: COLORS.primary } },
          bottom: { style: 'medium', color: { rgb: COLORS.primary } }
        }
      }
    }
  }

  ws['!cols'] = [
    { wch: 20 },
    { wch: 20 },
    { wch: 15 },
    { wch: 15 },
    { wch: 15 },
    { wch: 20 },
    { wch: 20 },
  ]

  ws['!rows'] = [{ hpt: 30 }, { hpt: 18 }, { hpt: 12 }, { hpt: 25 }]
  ws['!merges'] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 6 } },
    { s: { r: 1, c: 0 }, e: { r: 1, c: 6 } },
  ]

  XLSX.utils.book_append_sheet(wb, ws, 'Resumen por País')

  const timestamp = new Date().toISOString().split('T')[0]
  XLSX.writeFile(wb, `${filename}_${timestamp}.xlsx`)
}

/**
 * Exporta múltiples pestañas en un solo archivo Excel (Reporte Completo)
 */
export function exportCompleteReport(
  qualifications: QualificationReport[],
  entities: TaxEntityReport[],
  summary: SummaryReport[],
  filename: string = 'reporte_completo'
) {
  const wb = XLSX.utils.book_new()

  // ==========================================================================
  // Sheet 1: Cover Page / Summary
  // ==========================================================================
  const coverData = [
    [''],
    [''],
    ['📋 REPORTE COMPLETO'],
    ['SISTEMA TRIBUTARIO NUAM'],
    [''],
    [`📅 Fecha de generación: ${new Date().toLocaleString('es-ES')}`],
    [''],
    [''],
    ['📊 RESUMEN EJECUTIVO'],
    [''],
    ['Métrica', 'Valor'],
    ['Total de Calificaciones', qualifications.length],
    ['Total de Entidades', entities.length],
    ['Países con Operaciones', summary.length],
    ['Monto Total Procesado', `$${summary.reduce((a, b) => a + b.totalAmount, 0).toLocaleString('es-ES', { minimumFractionDigits: 2 })}`],
    [''],
    [''],
    ['📑 CONTENIDO DEL REPORTE'],
    [''],
    ['Pestaña', 'Descripción'],
    ['1. Portada', 'Resumen ejecutivo y estadísticas'],
    ['2. Resumen por País', 'Estadísticas agrupadas por país'],
    ['3. Calificaciones', 'Listado completo de calificaciones'],
    ['4. Entidades', 'Listado completo de entidades tributarias'],
  ]

  const wsCover = XLSX.utils.aoa_to_sheet(coverData)
  
  // Style cover page
  wsCover['A3'].s = { font: { bold: true, sz: 24, color: { rgb: COLORS.primary } }, alignment: { horizontal: 'center' } }
  wsCover['A4'].s = { font: { bold: true, sz: 16, color: { rgb: COLORS.secondary } }, alignment: { horizontal: 'center' } }
  wsCover['A6'].s = { font: { sz: 12, color: { rgb: COLORS.textMuted }, italic: true }, alignment: { horizontal: 'center' } }
  wsCover['A9'].s = { font: { bold: true, sz: 14, color: { rgb: COLORS.primary } } }
  wsCover['A18'].s = { font: { bold: true, sz: 14, color: { rgb: COLORS.primary } } }

  // Style summary table headers
  ;['A11', 'B11', 'A20', 'B20'].forEach(cell => {
    if (wsCover[cell]) wsCover[cell].s = headerStyle
  })

  wsCover['!cols'] = [{ wch: 35 }, { wch: 50 }]
  wsCover['!merges'] = [
    { s: { r: 2, c: 0 }, e: { r: 2, c: 1 } },
    { s: { r: 3, c: 0 }, e: { r: 3, c: 1 } },
    { s: { r: 5, c: 0 }, e: { r: 5, c: 1 } },
    { s: { r: 8, c: 0 }, e: { r: 8, c: 1 } },
    { s: { r: 17, c: 0 }, e: { r: 17, c: 1 } },
  ]

  XLSX.utils.book_append_sheet(wb, wsCover, '1. Portada')

  // ==========================================================================
  // Sheet 2: Summary by Country
  // ==========================================================================
  const summaryHeaders = [['País', 'Total', '✅ Aprobadas', '⏳ Pendientes', '❌ Rechazadas', '💰 Monto Total', '📈 Promedio']]
  const summaryDataRows = summary.map((item) => [
    getCountryDisplay(item.country),
    item.totalQualifications,
    item.approved,
    item.pending,
    item.rejected,
    `$${item.totalAmount.toLocaleString('es-ES', { minimumFractionDigits: 2 })}`,
    `$${item.averageAmount.toLocaleString('es-ES', { minimumFractionDigits: 2 })}`,
  ])

  const wsSummary = XLSX.utils.aoa_to_sheet([...summaryHeaders, ...summaryDataRows])
  applyStylesToSheet(wsSummary, 0, 1, summaryDataRows.length, 7)
  wsSummary['!cols'] = [{ wch: 20 }, { wch: 12 }, { wch: 14 }, { wch: 14 }, { wch: 14 }, { wch: 20 }, { wch: 18 }]

  XLSX.utils.book_append_sheet(wb, wsSummary, '2. Resumen por País')

  // ==========================================================================
  // Sheet 3: Qualifications
  // ==========================================================================
  const qualHeaders = [['Emisor', 'RUT/RUC/RFC', 'País', 'Período', 'Monto', 'Moneda', 'Valor Calc.', 'Estado', 'Fecha', 'Usuario']]
  const qualDataRows = qualifications.map((item) => [
    item.emisorName,
    item.taxId || 'N/A',
    getCountryDisplay(item.country),
    item.period,
    item.amount,
    item.currency,
    item.calculatedValue?.toFixed(4) || 'N/A',
    translateStatus(item.status),
    new Date(item.createdAt).toLocaleDateString('es-ES'),
    item.userName,
  ])

  const wsQual = XLSX.utils.aoa_to_sheet([...qualHeaders, ...qualDataRows])
  applyStylesToSheet(wsQual, 0, 1, qualDataRows.length, 10)
  
  // Apply status color to column 7 (index 7)
  qualifications.forEach((item, index) => {
    applyStatusStyle(wsQual, index + 1, 7, item.status)
  })

  wsQual['!cols'] = [
    { wch: 30 }, { wch: 15 }, { wch: 18 }, { wch: 12 }, { wch: 15 },
    { wch: 10 }, { wch: 14 }, { wch: 14 }, { wch: 12 }, { wch: 20 }
  ]

  XLSX.utils.book_append_sheet(wb, wsQual, '3. Calificaciones')

  // ==========================================================================
  // Sheet 4: Entities
  // ==========================================================================
  const entHeaders = [['Razón Social', 'RUT/RUC/RFC', 'Tipo', 'País', 'Régimen', 'Estado', 'Fecha Registro']]
  const entDataRows = entities.map((item) => [
    item.businessName,
    item.taxId,
    translateEntityType(item.entityType),
    getCountryDisplay(item.country),
    item.taxRegime,
    translateStatus(item.status),
    item.registrationDate ? new Date(item.registrationDate).toLocaleDateString('es-ES') : 'N/A',
  ])

  const wsEnt = XLSX.utils.aoa_to_sheet([...entHeaders, ...entDataRows])
  applyStylesToSheet(wsEnt, 0, 1, entDataRows.length, 7)

  // Apply status color to column 5 (index 5)
  entities.forEach((item, index) => {
    applyStatusStyle(wsEnt, index + 1, 5, item.status)
  })

  wsEnt['!cols'] = [{ wch: 35 }, { wch: 15 }, { wch: 20 }, { wch: 18 }, { wch: 20 }, { wch: 14 }, { wch: 15 }]

  XLSX.utils.book_append_sheet(wb, wsEnt, '4. Entidades')

  const timestamp = new Date().toISOString().split('T')[0]
  XLSX.writeFile(wb, `${filename}_${timestamp}.xlsx`)
}

// =============================================================================
// Utility Functions
// =============================================================================

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
    DRAFT: '📝 Borrador',
    PENDING: '⏳ Pendiente',
    APPROVED: '✅ Aprobado',
    REJECTED: '❌ Rechazado',
    EXPIRED: '⚠️ Expirado',
    ACTIVE: '🟢 Activo',
    INACTIVE: '⚪ Inactivo',
    SUSPENDED: '🟡 Suspendido',
    DISSOLVED: '🔴 Disuelto',
    UNDER_AUDIT: '🔍 En Auditoría',
  }
  return translations[status] || status
}

/**
 * Traduce tipos de entidad a español
 */
export function translateEntityType(type: string): string {
  const translations: Record<string, string> = {
    CORPORATION: '🏢 Corporación',
    LLC: '🏛️ SRL',
    PARTNERSHIP: '🤝 Sociedad',
    SOLE_PROPRIETOR: '👤 Persona Natural',
    NGO: '💚 ONG',
    GOVERNMENT: '🏛️ Gubernamental',
    FOREIGN: '🌍 Extranjera',
  }
  return translations[type] || type
}
