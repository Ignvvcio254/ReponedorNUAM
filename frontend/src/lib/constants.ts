export const COUNTRIES = {
  CL: {
    name: 'Chile',
    code: 'CL',
    currency: 'CLP',
    factor: 'UTM',
    flag: '🇨🇱'
  },
  PE: {
    name: 'Perú',
    code: 'PE', 
    currency: 'PEN',
    factor: 'UIT',
    flag: '🇵🇪'
  },
  CO: {
    name: 'Colombia',
    code: 'CO',
    currency: 'COP', 
    factor: 'UVT',
    flag: ''
  }
} as const

export const STATUS_OPTIONS = [
  { value: 'DRAFT', label: 'Borrador' },
  { value: 'PENDING', label: 'Pendiente' },
  { value: 'APPROVED', label: 'Aprobada' },
  { value: 'REJECTED', label: 'Rechazada' }
] as const

export const TAX_FACTORS = {
  CL: {
    UTM: 64649, // Valor actual UTM Chile 2024
    name: 'Unidad Tributaria Mensual'
  },
  PE: {
    UIT: 5150, // Valor actual UIT Perú 2024
    name: 'Unidad Impositiva Tributaria'
  },
  CO: {
    UVT: 42412, // Valor actual UVT Colombia 2024
    name: 'Unidad de Valor Tributario'
  }
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
