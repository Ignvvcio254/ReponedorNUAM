# NUAM Tax Container System - Agent Context

**Last Updated:** 2024-12-18
**Project Status:** Active Development - Security Implementation Phase
**Tech Lead:** Senior Full Stack Developer
**Architecture:** Enterprise-grade, Scalable, Clean Code with OOP Principles

---

## 🎯 PROJECT OVERVIEW

**Name:** NUAM - Sistema de Contenedor Tributario Latinoamericano
**Type:** Tax Management System
**Scope:** 15 Latin American Countries + United States
**Deployment:** Vercel (Production) + Supabase (PostgreSQL)

### Purpose
Comprehensive web-based system to automate management of:
- Tax qualifications
- Tax entities (companies/organizations)
- Tax returns and payments
- Audit processes
- Compliance certificates
- Bulk CSV imports

---

## 🏗️ ARCHITECTURE PRINCIPLES

### 1. Code Quality Standards
- **Clean Code:** Self-documenting code with strategic comments
- **OOP:** Object-Oriented Programming where applicable
- **SOLID Principles:** Single Responsibility, Open/Closed, etc.
- **DRY:** Don't Repeat Yourself
- **Type Safety:** Full TypeScript with strict mode
- **Scalability:** Built to handle 10,000+ users and millions of records

### 2. Project Structure Philosophy
```
Single Repository (Monorepo)
├── Clear separation of concerns
├── Modular component architecture
├── Layered architecture (Presentation → Business → Data)
└── Scalable folder structure
```

### 3. Documentation Strategy
- Section comments for code organization
- Function/method documentation only when logic is complex
- No excessive comments - code should be self-explanatory
- Strategic README files at key directories

---

## 📊 TECH STACK

### Frontend
- **Framework:** Next.js 14.2.32 (App Router, React Server Components)
- **Language:** TypeScript 5.3.2 (Strict Mode)
- **Styling:** Tailwind CSS 3.3.6 + Radix UI + Headless UI
- **Forms:** React Hook Form 7.48.2 + Zod 3.22.4
- **Charts:** Recharts 2.8.0
- **Icons:** Heroicons 2.0.18 + Lucide React 0.292.0

### Backend
- **Runtime:** Next.js API Routes (Serverless Functions)
- **ORM:** Prisma 6.15.0
- **Database:** PostgreSQL (Supabase)
- **Authentication:** NextAuth.js (In Progress)

### DevOps
- **Hosting:** Vercel (Automatic deployments from main branch)
- **Database:** Supabase (Hosted PostgreSQL)
- **Version Control:** Git + GitHub
- **CI/CD:** Vercel automatic builds

---

## 🗂️ PROJECT STRUCTURE

```
ReponedorNUAM/
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── (public)/           # Public routes (landing, login)
│   │   │   ├── (protected)/        # Auth required routes
│   │   │   │   ├── dashboard/
│   │   │   │   ├── qualifications/
│   │   │   │   ├── tax-entities/
│   │   │   │   ├── import/
│   │   │   │   └── reports/        ✅ NEW: Excel export
│   │   │   ├── (admin)/            # Admin-only routes (TODO)
│   │   │   └── api/
│   │   │       ├── auth/           # NextAuth (TODO)
│   │   │       ├── qualifications/
│   │   │       ├── tax-entities/
│   │   │       ├── tax-returns/
│   │   │       ├── tax-payments/
│   │   │       ├── reports/        ✅ NEW: Reports API
│   │   │       ├── import/
│   │   │       └── admin/          # Admin APIs (TODO)
│   │   ├── components/
│   │   │   ├── ui/                 # Base components (Button, Input, etc.)
│   │   │   ├── forms/              # Form components
│   │   │   ├── dashboard/          # Dashboard-specific
│   │   │   ├── tax-container/      # Business logic components
│   │   │   ├── admin/              # Admin components (TODO)
│   │   │   └── layout/             # Layout components (Header, etc.)
│   │   ├── lib/
│   │   │   ├── db.ts               # Prisma client singleton
│   │   │   ├── auth.ts             # Auth utilities (TODO)
│   │   │   ├── permissions.ts      # RBAC logic (TODO)
│   │   │   ├── validations.ts      # Zod schemas (TODO)
│   │   │   ├── excel-export.ts     ✅ NEW: Excel utilities
│   │   │   ├── api.ts              # API client
│   │   │   ├── constants.ts        # Constants
│   │   │   └── utils.ts            # Helpers
│   │   ├── hooks/                  # Custom React hooks (TODO)
│   │   └── types/                  # TypeScript types (TODO)
│   ├── prisma/
│   │   ├── schema.prisma           # Database schema (14 models)
│   │   ├── seed.ts                 # Seed data
│   │   └── seed-admin.ts           # Admin user seed (TODO)
│   ├── public/                     # Static assets
│   ├── middleware.ts               # Route protection (TODO)
│   └── [config files]
├── docs/                           # Documentation (TODO)
└── [root files]
```

---

## 📋 DATABASE SCHEMA (14 MODELS)

### Core System Models
1. **User** - System users with roles
2. **SystemConfig** - System configuration (key-value)
3. **AuditLog** - Complete audit trail
4. **ImportBatch** - Bulk import tracking

### Tax Container Models
5. **Qualification** - Tax qualifications (core model)
6. **TaxEntity** - Companies/organizations
7. **TaxReturn** - Tax declarations
8. **TaxObligation** - Tax obligations
9. **TaxPayment** - Payment tracking
10. **TaxAdjustment** - Corrections/amendments
11. **TaxCertificate** - Compliance certificates
12. **AuditProcess** - Tax audit management

### Enums (13 types)
- UserRole, Country, QualificationStatus, ImportStatus
- EntityType, EntityStatus, TaxRegime, PeriodType
- ReturnType, ReturnStatus, ObligationStatus
- PaymentMethod, PaymentType, AdjustmentType
- CertificateType, CertificateStatus, AuditType, AuditStatus

---

## 🚀 IMPLEMENTATION HISTORY

### Phase 1: Core Functionality ✅ (Completed)
- **Database Setup:** Prisma schema with 14 models
- **Landing Page:** Splash screen with auto-redirect
- **Dashboard:** Statistics, charts, and analytics
- **Qualifications Management:** Full CRUD with filters
- **Tax Entities Management:** Complete entity tracking
- **Bulk Import:** CSV import with validation and error handling
- **Reports Page:** ✅ NEW - Excel export with 4 report types
- **12 API Endpoints:** RESTful APIs with CORS

### Phase 2: Security Implementation 🔄 (In Progress)
**Current Focus:** Enterprise-grade authentication and authorization

**Goals:**
1. ✅ NextAuth.js integration with JWT
2. ✅ Multi-role system (5 roles)
3. ✅ RBAC (Role-Based Access Control)
4. ✅ Login/Logout flows
5. ✅ Route protection middleware
6. ✅ Admin panel for user management
7. ✅ Session management
8. ✅ Audit logging for security events

**Roles Definition:**
- **ADMIN:** Full system access + user management
- **MANAGER:** Approvals + management operations
- **ACCOUNTANT:** CRUD operations on qualifications
- **AUDITOR:** Read-only + audit logs access
- **VIEWER:** Read-only limited access

### Phase 3: Advanced Features 📅 (Planned)
- External API integrations (SII, SUNAT, DIAN)
- OCR for PDF processing
- Email notifications (SMTP)
- 2FA for admin users
- Advanced analytics
- Mobile responsiveness enhancements

---

## 🔑 CURRENT SECURITY STATUS

### ❌ Critical Vulnerabilities (Pre-Phase 2)
1. **No Authentication:** All routes publicly accessible
2. **No Authorization:** No role-based access control
3. **Open APIs:** All endpoints accessible without credentials
4. **No Audit:** Limited security event logging
5. **CORS Wide Open:** `Access-Control-Allow-Origin: *`

### ✅ Security To Be Implemented (Phase 2)
1. **NextAuth.js Setup:**
   - JWT-based authentication
   - Secure session management
   - HTTP-only cookies
   - CSRF protection

2. **RBAC System:**
   - Permission matrix per role
   - Granular access control
   - Resource-level permissions

3. **Route Protection:**
   - Middleware for automatic route guarding
   - Layout-based verification
   - API endpoint protection

4. **Admin Panel:**
   - User management (CRUD)
   - Role assignment
   - Password reset
   - Session monitoring

5. **Audit System:**
   - Security event logging
   - Failed login tracking
   - Unauthorized access attempts
   - IP tracking

---

## 📦 DEPENDENCIES (KEY PACKAGES)

### Production
```json
{
  "@prisma/client": "^6.15.0",
  "next": "^14.2.32",
  "next-auth": "TODO",          // To be installed
  "bcryptjs": "TODO",            // To be installed
  "react": "^18.2.0",
  "react-hook-form": "^7.48.2",
  "zod": "^3.22.4",
  "xlsx": "^0.18.5",
  "tailwindcss": "^3.3.6",
  "recharts": "^2.8.0",
  "@headlessui/react": "^1.7.17",
  "@radix-ui/react-*": "various"
}
```

### Development
```json
{
  "prisma": "^6.15.0",
  "typescript": "^5.3.2",
  "@types/node": "^20.9.4",
  "@types/react": "^18.2.38",
  "eslint": "^8.54.0",
  "tsx": "^4.20.5"
}
```

---

## 🎨 CODE STYLE GUIDE

### 1. File Naming
- **Components:** PascalCase (e.g., `UserTable.tsx`)
- **Utilities:** camelCase (e.g., `excel-export.ts`)
- **API Routes:** kebab-case (e.g., `tax-entities/route.ts`)
- **Types:** PascalCase (e.g., `UserTypes.ts`)

### 2. Component Structure
```typescript
/**
 * Component: ComponentName
 * Purpose: Brief description
 * Author: NUAM Development Team
 */

'use client' // If client component

import { /* dependencies */ } from 'package'

// ============================================================================
// Types & Interfaces
// ============================================================================

interface Props {
  // Props definition
}

// ============================================================================
// Constants
// ============================================================================

const CONSTANT_NAME = 'value'

// ============================================================================
// Component
// ============================================================================

export default function ComponentName({ props }: Props) {
  // State
  const [state, setState] = useState()

  // Effects
  useEffect(() => {
    // Effect logic
  }, [dependencies])

  // Handlers
  const handleAction = () => {
    // Handler logic
  }

  // Render
  return (
    <div>
      {/* JSX */}
    </div>
  )
}

// ============================================================================
// Helper Functions (if needed)
// ============================================================================

function helperFunction() {
  // Helper logic
}
```

### 3. API Route Structure
```typescript
/**
 * API: /api/resource
 * Methods: GET, POST, PUT, DELETE
 * Auth: Required (after Phase 2)
 */

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
// import { getServerSession } from 'next-auth' // TODO: Add after Phase 2

// ============================================================================
// CORS Configuration
// ============================================================================

export async function OPTIONS() {
  // CORS preflight
}

// ============================================================================
// GET Handler
// ============================================================================

export async function GET(request: NextRequest) {
  try {
    // TODO: Add authentication check
    // const session = await getServerSession()

    // Business logic

    return NextResponse.json({ success: true, data })
  } catch (error) {
    return NextResponse.json({ success: false, error }, { status: 500 })
  }
}

// Additional handlers (POST, PUT, DELETE)...
```

### 4. Utility Function Structure
```typescript
/**
 * Utility: utility-name
 * Purpose: Brief description
 */

// ============================================================================
// Types
// ============================================================================

export interface TypeName {
  // Type definition
}

// ============================================================================
// Main Functions
// ============================================================================

/**
 * Performs specific action
 * @param param - Description
 * @returns Description
 */
export function functionName(param: Type): ReturnType {
  // Function logic
  return result
}

// ============================================================================
// Helper Functions
// ============================================================================

function helperFunction() {
  // Helper logic
}
```

---

## 🔄 DEVELOPMENT WORKFLOW

### Git Workflow
```bash
# Feature development
1. Create feature branch (optional for solo dev)
2. Implement feature with clean commits
3. Test locally
4. Commit with descriptive message
5. Push to main
6. Vercel auto-deploys

# Commit Message Format
type: brief description

- Bullet point details
- What changed
- Why it changed
```

### Commit Types
- `feat:` New feature
- `fix:` Bug fix
- `refactor:` Code refactoring
- `chore:` Maintenance tasks
- `docs:` Documentation
- `style:` Code style (formatting)
- `test:` Tests
- `perf:` Performance improvement

### Testing Checklist
- [ ] TypeScript compilation (`npm run type-check`)
- [ ] Local development build (`npm run dev`)
- [ ] Production build (`npm run build`)
- [ ] Manual testing of changed features
- [ ] Database migration test (if schema changed)

---

## 📈 PERFORMANCE METRICS

### Current Performance
- **Build Time:** ~30-40 seconds
- **API Response:** < 500ms average
- **Database Queries:** Optimized with Prisma
- **Bundle Size:** Optimized with Next.js standalone mode

### Optimization Strategies
1. **Code Splitting:** Automatic with Next.js App Router
2. **Image Optimization:** Next.js Image component
3. **Database Indexes:** Strategic indexes on frequently queried fields
4. **Caching:** To be implemented (Redis/Vercel KV)
5. **CDN:** Vercel Edge Network

---

## 🚦 NEXT STEPS (Phase 2 Implementation Order)

### Week 1: Authentication Foundation
1. ✅ Update Prisma schema (User model enhancements)
2. ✅ Install NextAuth.js + bcryptjs
3. ✅ Create NextAuth configuration
4. ✅ Implement login page
5. ✅ Create seed script for first admin user

### Week 2: Authorization & Protection
6. ✅ Implement RBAC permission system
7. ✅ Create middleware for route protection
8. ✅ Protect all existing API endpoints
9. ✅ Update components with permission checks

### Week 3: Admin Panel
10. ✅ Create admin layout structure
11. ✅ Build user management page (list)
12. ✅ Build user creation form
13. ✅ Build user edit/delete functionality
14. ✅ Implement role assignment

### Week 4: Polish & Security Enhancements
15. ✅ Implement session monitoring
16. ✅ Add failed login tracking
17. ✅ Create audit log viewer
18. ✅ Security testing and hardening
19. ✅ Documentation update

---

## 📝 NOTES FOR AGENT

### Development Approach
- **Incremental:** Implement one feature completely before moving to next
- **Test-Driven:** Test each feature immediately after implementation
- **Documentation:** Update this file after each major milestone
- **Clean Commits:** Commit working code with clear messages
- **No Breaking Changes:** Maintain backward compatibility during development

### Code Quality Checklist
- [ ] TypeScript strict mode compliance
- [ ] No `any` types (use proper typing or `unknown`)
- [ ] Proper error handling (try-catch blocks)
- [ ] CORS headers on all API responses
- [ ] Input validation (Zod schemas)
- [ ] Strategic comments only
- [ ] DRY principle applied
- [ ] SOLID principles followed

### Security Checklist (Post-Phase 2)
- [ ] All routes protected with authentication
- [ ] All APIs validate session
- [ ] RBAC implemented correctly
- [ ] Sensitive data encrypted
- [ ] SQL injection prevented (Prisma ORM)
- [ ] XSS prevention (React's built-in escaping)
- [ ] CSRF tokens (NextAuth built-in)
- [ ] Rate limiting implemented
- [ ] Audit logs complete

---

## 📚 REFERENCE LINKS

- **Next.js 14 Docs:** https://nextjs.org/docs
- **Prisma Docs:** https://www.prisma.io/docs
- **NextAuth.js Docs:** https://next-auth.js.org/
- **Tailwind CSS:** https://tailwindcss.com/docs
- **TypeScript Handbook:** https://www.typescriptlang.org/docs/

---

## 🏁 CONCLUSION

This project follows enterprise-grade standards with:
- Clean, scalable architecture
- Type-safe implementation
- Comprehensive data modeling
- Professional UI/UX
- Security-first approach (Phase 2)

**Current Phase:** Security Implementation
**Next Milestone:** Complete authentication and authorization system
**Timeline:** 2-4 weeks for Phase 2 completion

---

**Last Review:** 2024-12-18
**Agent Role:** Senior Full Stack Developer
**Focus:** Security, Scalability, Clean Code, OOP
