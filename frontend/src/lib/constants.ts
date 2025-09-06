export const COUNTRIES = {
  CL: { name: 'Chile', code: 'CL', currency: 'CLP', factor: 'UTM', flag: '🇨🇱' },
  PE: { name: 'Perú', code: 'PE', currency: 'PEN', factor: 'UIT', flag: '🇵🇪' },
  CO: { name: 'Colombia', code: 'CO', currency: 'COP', factor: 'UVT', flag: '🇨🇴' },
  MX: { name: 'México', code: 'MX', currency: 'MXN', factor: 'UMA', flag: '🇲🇽' },
  AR: { name: 'Argentina', code: 'AR', currency: 'ARS', factor: 'UF', flag: '🇦🇷' },
  BR: { name: 'Brasil', code: 'BR', currency: 'BRL', factor: 'UFIR', flag: '🇧🇷' },
  UY: { name: 'Uruguay', code: 'UY', currency: 'UYU', factor: 'UI', flag: '🇺🇾' },
  PY: { name: 'Paraguay', code: 'PY', currency: 'PYG', factor: 'JSM', flag: '🇵🇾' },
  BO: { name: 'Bolivia', code: 'BO', currency: 'BOB', factor: 'UFV', flag: '🇧🇴' },
  EC: { name: 'Ecuador', code: 'EC', currency: 'USD', factor: 'SBU', flag: '🇪🇨' },
  VE: { name: 'Venezuela', code: 'VE', currency: 'VES', factor: 'PT', flag: '🇻🇪' },
  PA: { name: 'Panamá', code: 'PA', currency: 'PAB', factor: 'TB', flag: '🇵🇦' },
  CR: { name: 'Costa Rica', code: 'CR', currency: 'CRC', factor: 'SB', flag: '🇨🇷' },
  GT: { name: 'Guatemala', code: 'GT', currency: 'GTQ', factor: 'SM', flag: '🇬🇹' },
  US: { name: 'Estados Unidos', code: 'US', currency: 'USD', factor: 'USD', flag: '🇺🇸' }
} as const

export const STATUS_OPTIONS = [
  { value: 'DRAFT', label: 'Borrador' },
  { value: 'PENDING', label: 'Pendiente' },
  { value: 'APPROVED', label: 'Aprobada' },
  { value: 'REJECTED', label: 'Rechazada' }
] as const

export const TAX_FACTORS = {
  CL: { UTM: 64649, name: 'Unidad Tributaria Mensual' },
  PE: { UIT: 5150, name: 'Unidad Impositiva Tributaria' },
  CO: { UVT: 42412, name: 'Unidad de Valor Tributario' },
  MX: { UMA: 108.57, name: 'Unidad de Medida y Actualización' },
  AR: { UF: 25000, name: 'Unidad Fiscal' },
  BR: { UFIR: 7239, name: 'Unidade Fiscal de Referência' },
  UY: { UI: 5650, name: 'Unidad Indexada' },
  PY: { JSM: 4200, name: 'Jornales de Salario Mínimo' },
  BO: { UFV: 23600, name: 'Unidad de Fomento a la Vivienda' },
  EC: { SBU: 760, name: 'Salario Básico Unificado' },
  VE: { PT: 0.5, name: 'Petro' },
  PA: { TB: 0.05, name: 'Tarifa Base' },
  CR: { SB: 946, name: 'Salario Base' },
  GT: { SM: 300, name: 'Salario Mínimo' },
  US: { USD: 1, name: 'US Dollar' }
} as const

export const PERIODS = [
  '2024-01', '2024-02', '2024-03', '2024-04', '2024-05', '2024-06',
  '2024-07', '2024-08', '2024-09', '2024-10', '2024-11', '2024-12'
]

export const FILE_UPLOAD = {
  MAX_SIZE: 50 * 1024 * 1024, // 50MB
  ALLOWED_TYPES: [
    'application/pdf',
    'text/csv',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ]
}
