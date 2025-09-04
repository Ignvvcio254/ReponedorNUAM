# NUAM - Mantenedor de Calificaciones Tributarias

Sistema web para automatizar la gestión de calificaciones tributarias para las bolsas de Santiago, Lima y Colombia.

## Stack Tecnológico

- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS
- **Despliegue**: Vercel
- **Backend**: Vercel Serverless Functions
- **Base de datos**: Vercel PostgreSQL
- **Autenticación**: NextAuth.js
- **UI**: shadcn/ui + Radix UI

## Funcionalidades Principales

-  CRUD de calificaciones tributarias
-  Carga masiva CSV/Excel
-  Conversión automática de factores (UTM, UIT, UVT, UTA)
-  OCR de documentos PDF
-  Dashboard con métricas en tiempo real
-  Sistema de auditoría completo
-  Autenticación MFA
-  Exportación de reportes

## Estructura del Proyecto

```
ReponedorNUAM/
 frontend/              # Aplicación Next.js
    src/
       app/          # App Router de Next.js 14
       components/   # Componentes reutilizables
       lib/          # Utilidades y configuración
    public/           # Archivos estáticos
 backend/              # APIs serverless
 docs/                 # Documentación
 scripts/              # Scripts de automatización
```

## Inicio Rápido

### Requisitos
- Node.js 18+
- npm o yarn

### Instalación

```bash
# Clonar repositorio
git clone <repository-url>
cd ReponedorNUAM

# Instalar dependencias del frontend
cd frontend
npm install

# Configurar variables de entorno
cp .env.example .env.local

# Ejecutar en desarrollo
npm run dev
```

## Despliegue en Vercel

1. Conectar repositorio a Vercel
2. Configurar variables de entorno en Vercel Dashboard
3. Deploy automático desde main branch

## Variables de Entorno

```bash
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="your-secret"
NEXTAUTH_URL="https://your-domain.vercel.app"
```

## Licencia

Propietario - NUAM Holdings

## Contacto

**Tech Lead**: Ignacio Navarrete  
**Email**: ignacio.navarrete@nuam.com
