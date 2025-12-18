/**
 * Next.js Middleware
 *
 * Handles route protection and authentication checks.
 * Runs on edge runtime for optimal performance.
 *
 * Protected routes: All routes except public routes and API auth
 * Public routes: /, /login
 */

import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

// ============================================================================
// Configuration
// ============================================================================

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const pathname = req.nextUrl.pathname

    // Redirect authenticated users away from login
    if (pathname === '/login' && token) {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    // Allow authenticated users to proceed
    if (token) {
      return NextResponse.next()
    }

    // Redirect unauthenticated users to login
    return NextResponse.redirect(new URL('/login', req.url))
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const pathname = req.nextUrl.pathname

        // Public routes - no authentication required
        if (pathname === '/' || pathname === '/login') {
          return true
        }

        // API auth routes - no authentication required
        if (pathname.startsWith('/api/auth')) {
          return true
        }

        // All other routes require authentication
        return !!token
      },
    },
    pages: {
      signIn: '/login',
    },
  }
)

// ============================================================================
// Matcher Configuration
// ============================================================================

/**
 * Define which routes this middleware should run on
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
