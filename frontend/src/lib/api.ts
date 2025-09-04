const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api'

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message)
    this.name = 'ApiError'
  }
}

async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const url = ${API_BASE_URL}
  
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  })
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Error desconocido' }))
    throw new ApiError(response.status, errorData.error || 'Error en la API')
  }
  
  return response.json()
}

export const api = {
  qualifications: {
    getAll: (filters?: { country?: string; status?: string }) => {
      const params = new URLSearchParams()
      if (filters?.country) params.append('country', filters.country)
      if (filters?.status) params.append('status', filters.status)
      
      return fetchApi(/qualifications?)
    },
    
    getById: (id: string) => {
      return fetchApi(/qualifications/)
    },
    
    create: (data: any) => {
      return fetchApi('/qualifications', {
        method: 'POST',
        body: JSON.stringify(data),
      })
    },
    
    update: (id: string, data: any) => {
      return fetchApi(/qualifications/, {
        method: 'PUT',
        body: JSON.stringify(data),
      })
    },
    
    delete: (id: string) => {
      return fetchApi(/qualifications/, {
        method: 'DELETE',
      })
    }
  }
}
