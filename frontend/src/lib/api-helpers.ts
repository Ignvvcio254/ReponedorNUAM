/**
 * API Helper Functions
 *
 * Provides standardized helpers for API routes including:
 * - CORS headers
 * - Error handling
 * - Response formatting
 */

import { NextResponse } from 'next/server'

// ============================================================================
// CORS Headers
// ============================================================================

/**
 * Standard CORS headers for API responses
 */
export const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

/**
 * Add CORS headers to response
 */
export function addCorsHeaders(response: NextResponse): NextResponse {
  Object.entries(CORS_HEADERS).forEach(([key, value]) => {
    response.headers.set(key, value)
  })
  return response
}

/**
 * Create OPTIONS response for CORS preflight
 */
export function createOptionsResponse(): NextResponse {
  return new NextResponse(null, {
    status: 200,
    headers: CORS_HEADERS,
  })
}

// ============================================================================
// Response Helpers
// ============================================================================

/**
 * Create success response with CORS headers
 */
export function createSuccessResponse(data: any, status: number = 200): NextResponse {
  const response = NextResponse.json({
    success: true,
    data,
  }, { status })

  return addCorsHeaders(response)
}

/**
 * Create error response with CORS headers
 */
export function createErrorResponse(
  error: string | Error,
  status: number = 500
): NextResponse {
  const errorMessage = error instanceof Error ? error.message : error

  // Determine status code from error message if not provided
  if (status === 500) {
    if (errorMessage.includes('Unauthorized') || errorMessage.includes('Authentication required')) {
      status = 401
    } else if (errorMessage.includes('Forbidden') || errorMessage.includes('Required permission')) {
      status = 403
    } else if (errorMessage.includes('not found') || errorMessage.includes('No encontrado')) {
      status = 404
    } else if (errorMessage.includes('requerido') || errorMessage.includes('required') || errorMessage.includes('invalid')) {
      status = 400
    }
  }

  const response = NextResponse.json({
    success: false,
    error: errorMessage,
  }, { status })

  return addCorsHeaders(response)
}

// ============================================================================
// Validation Helpers
// ============================================================================

/**
 * Validate required fields in request body
 */
export function validateRequiredFields(
  body: any,
  requiredFields: string[]
): string | null {
  const missingFields = requiredFields.filter(field => !body[field])

  if (missingFields.length > 0) {
    return `Campos requeridos: ${missingFields.join(', ')}`
  }

  return null
}

/**
 * Validate numeric field
 */
export function validateNumeric(value: any, fieldName: string): string | null {
  const num = parseFloat(value)
  if (isNaN(num)) {
    return `${fieldName} debe ser un número válido`
  }
  if (num < 0) {
    return `${fieldName} debe ser mayor o igual a cero`
  }
  return null
}

/**
 * Validate date field
 */
export function validateDate(value: any, fieldName: string): string | null {
  const date = new Date(value)
  if (isNaN(date.getTime())) {
    return `${fieldName} debe ser una fecha válida`
  }
  return null
}

// ============================================================================
// Pagination Helpers
// ============================================================================

/**
 * Extract pagination params from URL search params
 */
export function getPaginationParams(searchParams: URLSearchParams) {
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '50')
  const skip = (page - 1) * limit

  return {
    page,
    limit,
    skip,
    take: limit,
  }
}

/**
 * Create paginated response
 */
export function createPaginatedResponse(
  data: any[],
  total: number,
  page: number,
  limit: number
) {
  return {
    data,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNext: page * limit < total,
      hasPrevious: page > 1,
    },
  }
}
