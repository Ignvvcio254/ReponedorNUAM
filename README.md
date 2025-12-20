# NUAM - Sistema de Contenedor Tributario

Sistema empresarial para la gestión de calificaciones tributarias, entidades fiscales y procesos de cumplimiento para América Latina.

# [PRODUCCION](https://reponedor-nuam.vercel.app/)

Desde dispositivos moviles cuenta con un bloqueo de pantalla para que no se pueda acceder a la aplicacion por resolucion de pantalla, solo se permite acceder desde computadoras.

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Supabase-green)
![Vercel](https://img.shields.io/badge/Deploy-Vercel-black)

## 🎯 Propósito

NUAM automatiza la gestión tributaria para 15 países latinoamericanos, incluyendo:

- **Calificaciones tributarias** con cálculo automático de factores (UTM, UIT, UVT, etc.)
- **Gestión de entidades fiscales** con soporte multi-país
- **Importación masiva** de datos vía CSV
- **Dashboard analítico** con métricas en tiempo real
- **Sistema de auditoría** completo con trazabilidad

## 🛠️ Stack Tecnológico

| Capa          | Tecnología              |
| ------------- | ----------------------- |
| Framework     | Next.js 14 (App Router) |
| Lenguaje      | TypeScript              |
| Estilos       | Tailwind CSS            |
| Base de Datos | PostgreSQL (Supabase)   |
| ORM           | Prisma                  |
| Autenticación | NextAuth.js (JWT)       |
| Deploy        | Vercel                  |

## 📁 Estructura del Proyecto

```
frontend/
├── src/
│   ├── app/                    # Páginas y API routes
│   │   ├── api/               # Endpoints REST
│   │   ├── admin/             # Panel de administración
│   │   ├── dashboard/         # Dashboard principal
│   │   ├── qualifications/    # Calificaciones
│   │   ├── tax-entities/      # Entidades fiscales
│   │   ├── reports/           # Reportes
│   │   └── import/            # Importación masiva
│   ├── components/            # Componentes React
│   ├── lib/                   # Utilidades y configuración
│   ├── services/              # Lógica de negocio
│   └── types/                 # Definiciones TypeScript
├── prisma/
│   └── schema.prisma          # Esquema de base de datos
└── public/                    # Archivos estáticos
```

## 🔐 Sistema de Roles y Permisos

El sistema implementa RBAC (Role-Based Access Control) con 5 niveles:

| Rol            | Nivel | Descripción                             |
| -------------- | ----- | --------------------------------------- |
| **ADMIN**      | 5     | Acceso total + gestión de usuarios      |
| **MANAGER**    | 4     | Aprobación de calificaciones + reportes |
| **ACCOUNTANT** | 3     | CRUD de calificaciones y entidades      |
| **AUDITOR**    | 2     | Solo lectura + logs de auditoría        |
| **VIEWER**     | 1     | Visualización limitada                  |

### Matriz de Permisos

| Recurso        | ADMIN  | MANAGER | ACCOUNTANT | AUDITOR | VIEWER |
| -------------- | :----: | :-----: | :--------: | :-----: | :----: |
| Calificaciones | CRUD+A |  CRU+A  |    CRU     |    R    |   R    |
| Entidades      |  CRUD  |   CRU   |    CRU     |    R    |   R    |
| Usuarios       |  CRUD  |    R    |     -      |    -    |   -    |
| Audit Logs     |   R    |    R    |     -      |    R    |   -    |
| Importación    |   CR   |   CR    |     CR     |    -    |   -    |
| Reportes       |   R    |    R    |     R      |    R    |   R    |

> **Leyenda:** C=Crear, R=Leer, U=Actualizar, D=Eliminar, A=Aprobar

## 🌎 Países Soportados

El sistema incluye los factores tributarios actualizados para:

| País           | Factor | Código |
| -------------- | ------ | ------ |
| Chile          | UTM    | CL     |
| Perú           | UIT    | PE     |
| Colombia       | UVT    | CO     |
| México         | UMA    | MX     |
| Argentina      | UF     | AR     |
| Brasil         | UFIR   | BR     |
| Uruguay        | UI     | UY     |
| Paraguay       | JSM    | PY     |
| Bolivia        | UFV    | BO     |
| Ecuador        | SBU    | EC     |
| Venezuela      | PT     | VE     |
| Panamá         | TB     | PA     |
| Costa Rica     | SB     | CR     |
| Guatemala      | SM     | GT     |
| Estados Unidos | USD    | US     |

## 🚀 Inicio Rápido

### Requisitos

- Node.js 18+
- PostgreSQL (o cuenta en Supabase)

### Instalación

```bash
# Clonar repositorio
git clone https://github.com/Ignvvcio254/ReponedorNUAM.git
cd ReponedorNUAM/frontend

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env

# Ejecutar en desarrollo
npm run dev
```

### Variables de Entorno

```env
# Base de datos (requerido)
DATABASE_URL="postgresql://..."

# Autenticación (requerido)
NEXTAUTH_SECRET="tu-secreto-seguro"
NEXTAUTH_URL="http://localhost:3000"
```

## 📊 APIs Disponibles

| Endpoint                   | Métodos          | Descripción                |
| -------------------------- | ---------------- | -------------------------- |
| `/api/qualifications`      | GET, POST        | Calificaciones tributarias |
| `/api/qualifications/[id]` | GET, PUT, DELETE | Calificación individual    |
| `/api/tax-entities`        | GET, POST        | Entidades fiscales         |
| `/api/tax-entities/[id]`   | GET, PUT, DELETE | Entidad individual         |
| `/api/dashboard/stats`     | GET              | Estadísticas del sistema   |
| `/api/reports`             | GET              | Generación de reportes     |
| `/api/import`              | POST             | Importación masiva CSV     |
| `/api/users`               | GET, POST        | Gestión de usuarios        |
| `/api/audit-logs`          | GET              | Logs de auditoría          |

## 🔒 Seguridad

- Autenticación JWT con NextAuth.js
- Verificación de permisos en cada endpoint API
- Bloqueo de cuenta por intentos fallidos
- Registro completo de auditoría
- Diseño responsive solo para desktop (1024px+)

## 📈 Características del Dashboard

- **Métricas en tiempo real**: Calificaciones, entidades, pagos
- **Gráficos interactivos**: Tendencias mensuales, distribución por país
- **Top emisores**: Ranking de contribuyentes
- **Indicadores de cumplimiento**: Entidades en riesgo, auditorías activas
- **Actividad reciente**: Últimas acciones del sistema

## 📄 Licencia

Propietario - Ignaio Navarrete.
Colaborador - Vicente Garcia.

## 👤 Contacto

**Project Manager Full Stack**: Ignacio Navarrete.  
**Email**: ignacio.andres.navarrete.silva@gmail.com
**GitHub**: [Ignvvcio254](https://github.com/Ignvvcio254)
**LinkedIn**: [Ignacio Navarrete Silva](https://www.linkedin.com/in/ignacio-navarrete-223b9b336/)
**Portafolio**: [Ignacio Navarrete Silva](https://portafolio-254.vercel.app/)

**Colaborador y desarrollador Full Stack**
**Email**: vgarcia04@gmail.com
**GitHub**: [Vicho1937](https://github.com/Vicho1937)

