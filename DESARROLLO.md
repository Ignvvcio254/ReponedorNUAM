# INSTRUCCIONES DE DESARROLLO - PROYECTO NUAM

## Configuración Inicial

1. Instalar dependencias:
   `bash
   cd frontend
   npm install
   `

2. Configurar variables de entorno:
   `bash
   cp .env.example .env.local
   # Editar .env.local con valores reales
   `

3. Ejecutar en desarrollo:
   `bash
   npm run dev
   `

4. Abrir navegador: http://localhost:3000

## Funcionalidades Implementadas

###  Páginas Principales
- / - Página de inicio con navegación
- /dashboard - Dashboard con estadísticas
- /qualifications - Gestión de calificaciones
- /import - Importación masiva de CSV

###  Formularios
- Crear calificación individual
- Importación masiva CSV con preview
- Filtros por país y estado
- Validaciones automáticas

### ✅ API Endpoints
- GET /api/qualifications - Listar con filtros
- POST /api/qualifications - Crear nueva
- GET /api/qualifications/[id] - Obtener por ID
- PUT /api/qualifications/[id] - Actualizar
- POST /api/import - Importación masiva

###  Características
- Cálculo automático de factores (UTM, UIT, UVT)
- Soporte para Chile, Perú, Colombia
- Preview de datos antes de importar
- Reporte de errores en importación
- Formato de moneda por país
- Estados de calificación (Draft, Pending, Approved, Rejected)

## Datos de Ejemplo Incluidos

El sistema incluye datos de ejemplo para:
- 3 calificaciones de muestra (una por país)
- Factores tributarios actualizados 2024
- Emisores de ejemplo

## Próximos Pasos para Producción

1. **Base de Datos Real**
   - Configurar Vercel PostgreSQL
   - Migrar de datos mock a DB real
   - Implementar prisma o drizzle ORM

2. **Autenticación**
   - Implementar NextAuth.js
   - Roles y permisos reales
   - Sesiones seguras

3. **OCR de PDFs**
   - Integrar servicio OCR (Azure, AWS, Google)
   - Upload de archivos a storage
   - Extracción automática de datos

4. **Integraciones Externas**
   - APIs de SII, SUNAT, DIAN
   - Validación en tiempo real
   - Sincronización de factores

5. **Mejoras UX**
   - Loading states mejorados
   - Notificaciones toast
   - Modo oscuro
   - Responsive mobile

## Estructura de Archivos CSV para Importación

`csv
emisorName,taxId,period,amount,country
"Empresa Ejemplo S.A.","76.123.456-7","2024-08",150000,"CL"
"Corporación Lima EIRL","20123456789","2024-08",85000,"PE"
"Inversiones Bogotá Ltda.","900.123.456-1","2024-08",320000,"CO"
`

## Despliegue en Vercel

1. Conectar repositorio en vercel.com
2. Configurar variables de entorno
3. Deploy automático desde main branch

¡El proyecto está listo para desarrollo y despliegue!
