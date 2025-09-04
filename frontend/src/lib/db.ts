// Simulación de base de datos para desarrollo
// En producción, esto se conectaría a Vercel PostgreSQL

export interface TaxQualification {
  id: string
  emisorId: string
  emisorName: string
  period: string
  amount: number
  factorApplied: number
  calculatedValue: number
  status: 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED'
  country: 'CL' | 'PE' | 'CO'
  createdAt: string
  updatedAt: string
}

export interface Emisor {
  id: string
  taxId: string
  businessName: string
  country: 'CL' | 'PE' | 'CO'
  active: boolean
}

// Datos de ejemplo
const mockQualifications: TaxQualification[] = [
  {
    id: '1',
    emisorId: 'e1',
    emisorName: 'Empresa Ejemplo S.A.',
    period: '2024-08',
    amount: 150000,
    factorApplied: 64649,
    calculatedValue: 2.32,
    status: 'APPROVED',
    country: 'CL',
    createdAt: '2024-08-15T10:30:00Z',
    updatedAt: '2024-08-15T10:30:00Z'
  },
  {
    id: '2',
    emisorId: 'e2',
    emisorName: 'Corporación Lima EIRL',
    period: '2024-08',
    amount: 85000,
    factorApplied: 5150,
    calculatedValue: 16.5,
    status: 'PENDING',
    country: 'PE',
    createdAt: '2024-08-16T14:20:00Z',
    updatedAt: '2024-08-16T14:20:00Z'
  },
  {
    id: '3',
    emisorId: 'e3',
    emisorName: 'Inversiones Bogotá Ltda.',
    period: '2024-08',
    amount: 320000,
    factorApplied: 42412,
    calculatedValue: 7.55,
    status: 'DRAFT',
    country: 'CO',
    createdAt: '2024-08-17T09:15:00Z',
    updatedAt: '2024-08-17T09:15:00Z'
  }
]

const mockEmisors: Emisor[] = [
  {
    id: 'e1',
    taxId: '76.123.456-7',
    businessName: 'Empresa Ejemplo S.A.',
    country: 'CL',
    active: true
  },
  {
    id: 'e2',
    taxId: '20123456789',
    businessName: 'Corporación Lima EIRL',
    country: 'PE',
    active: true
  },
  {
    id: 'e3',
    taxId: '900.123.456-1',
    businessName: 'Inversiones Bogotá Ltda.',
    country: 'CO',
    active: true
  }
]

// Funciones de simulación de DB
export const db = {
  qualifications: {
    findMany: async (filters?: { country?: string; status?: string }) => {
      let result = [...mockQualifications]
      
      if (filters?.country) {
        result = result.filter(q => q.country === filters.country)
      }
      
      if (filters?.status) {
        result = result.filter(q => q.status === filters.status)
      }
      
      return result
    },
    
    findById: async (id: string) => {
      return mockQualifications.find(q => q.id === id) || null
    },
    
    create: async (data: Omit<TaxQualification, 'id' | 'createdAt' | 'updatedAt'>) => {
      const newQualification: TaxQualification = {
        ...data,
        id: Math.random().toString(36).substr(2, 9),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      mockQualifications.push(newQualification)
      return newQualification
    },
    
    update: async (id: string, data: Partial<TaxQualification>) => {
      const index = mockQualifications.findIndex(q => q.id === id)
      if (index === -1) return null
      
      mockQualifications[index] = {
        ...mockQualifications[index],
        ...data,
        updatedAt: new Date().toISOString()
      }
      
      return mockQualifications[index]
    }
  },
  
  emisors: {
    findMany: async () => mockEmisors,
    findById: async (id: string) => mockEmisors.find(e => e.id === id) || null
  }
}
