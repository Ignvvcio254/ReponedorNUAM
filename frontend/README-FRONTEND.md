# NUAM - Sistema de Calificaciones Tributarias Frontend

## Descripción
Sistema web completo para la gestión de calificaciones tributarias de empresas en Chile, Perú y Colombia. Permite crear, importar masivamente y gestionar calificaciones tributarias con factores específicos por país.

## Características Principales

### 🏢 Dashboard Completo
- Vista general de estadísticas de calificaciones
- Filtros por país y estado
- Visualización de datos con gráficos
- Navegación intuitiva

### 📊 Gestión de Calificaciones
- Crear calificaciones individuales
- Editar y actualizar calificaciones existentes
- Eliminar calificaciones
- Estados: DRAFT, PENDING, APPROVED, REJECTED
- Cálculo automático de valores con factores tributarios

### 📤 Importación Masiva
- Carga de archivos CSV
- Validación de datos en tiempo real
- Vista previa antes de importar
- Reporte detallado de errores
- Plantilla CSV descargable

### 🌎 Soporte Multi-País
- **Chile**: Factor UTM (64,649 CLP)
- **Perú**: Factor UIT (5,150 PEN)  
- **Colombia**: Factor UVT (42,412 COP)

## Tecnologías Utilizadas

### Core
- **Next.js 14.2.32** - Framework React con App Router
- **React 18** - Biblioteca de UI
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Framework CSS

### UI Components
- **Headless UI** - Componentes accesibles
- **Radix UI** - Primitivos de componentes
- **Lucide React** - Iconos
- **Heroicons** - Iconos adicionales

### Funcionalidades
- **React Hook Form** - Gestión de formularios
- **Zod** - Validación de esquemas
- **Axios** - Cliente HTTP
- **Papa Parse** - Parser CSV
- **Recharts** - Gráficos y visualización
- **Date-fns** - Manipulación de fechas

## Estructura del Proyecto

```
src/
├── app/                    # App Router de Next.js
│   ├── api/               # Endpoints API
│   │   ├── import/        # Importación masiva
│   │   └── qualifications/# CRUD calificaciones
│   ├── dashboard/         # Dashboard principal
│   ├── import/           # Página importación
│   ├── qualifications/   # Gestión calificaciones
│   └── globals.css       # Estilos globales
├── components/            # Componentes reutilizables
│   ├── ui/               # Componentes base
│   ├── forms/            # Formularios
│   └── dashboard/        # Componentes dashboard
└── lib/                  # Utilidades y configuración
    ├── api.ts            # Cliente API
    ├── constants.ts      # Constantes del sistema
    ├── db.ts            # Simulador base datos
    └── utils.ts         # Utilidades generales
```

## Instalación y Configuración

### Prerrequisitos
- Node.js 18+ 
- npm o yarn

### Pasos de Instalación

1. **Instalar dependencias**
   ```bash
   cd frontend
   npm install
   ```

2. **Configurar variables de entorno**
   ```bash
   # Crear .env.local
   NEXT_PUBLIC_API_URL=http://localhost:3000
   ```

3. **Ejecutar en desarrollo**
   ```bash
   npm run dev
   ```

4. **Construir para producción**
   ```bash
   npm run build
   npm start
   ```

## Scripts Disponibles

- `npm run dev` - Servidor de desarrollo
- `npm run build` - Construcción para producción  
- `npm run start` - Servidor de producción
- `npm run lint` - Linting del código
- `npm run type-check` - Verificación de tipos

## API Endpoints

### Calificaciones
- `GET /api/qualifications` - Listar calificaciones
- `POST /api/qualifications` - Crear calificación
- `GET /api/qualifications/[id]` - Obtener calificación
- `PUT /api/qualifications/[id]` - Actualizar calificación
- `DELETE /api/qualifications/[id]` - Eliminar calificación

### Importación
- `POST /api/import` - Importar archivo CSV

## Formato CSV para Importación

```csv
emisorName,taxId,period,amount,country
Empresa Ejemplo S.A.,76.123.456-7,2024-08,150000,CL
Corporación Lima EIRL,20123456789,2024-08,85000,PE
Inversiones Bogotá Ltda.,900.123.456-1,2024-08,320000,CO
```

### Campos Requeridos
- **emisorName**: Nombre de la empresa
- **taxId**: RUT o identificación tributaria
- **period**: Período en formato YYYY-MM
- **amount**: Monto numérico
- **country**: Código de país (CL, PE, CO)

## Factores Tributarios

| País | Código | Factor | Moneda |
|------|--------|--------|--------|
| Chile | CL | 64,649 | CLP |
| Perú | PE | 5,150 | PEN |
| Colombia | CO | 42,412 | COP |

## Estados de Calificación

- **DRAFT**: Borrador, en edición
- **PENDING**: Pendiente de aprobación
- **APPROVED**: Aprobada
- **REJECTED**: Rechazada

## Características Técnicas

### Responsive Design
- Optimizado para desktop, tablet y móvil
- Componentes adaptativos con Tailwind CSS

### Accesibilidad
- Componentes accesibles con Headless UI
- Navegación por teclado
- Lectores de pantalla soportados

### Performance
- Server-side rendering con Next.js
- Optimización automática de imágenes
- Code splitting automático

### Validación
- Validación client-side con Zod
- Validación server-side en APIs
- Mensajes de error descriptivos

## Desarrollo

### Añadir Nueva Funcionalidad

1. **Crear componente**
   ```tsx
   // src/components/ui/NewComponent.tsx
   export function NewComponent() {
     return <div>...</div>
   }
   ```

2. **Agregar endpoint API**
   ```tsx
   // src/app/api/new-endpoint/route.ts
   import { NextRequest, NextResponse } from 'next/server'
   
   export async function GET(request: NextRequest) {
     return NextResponse.json({ data: 'response' })
   }
   ```

3. **Actualizar cliente API**
   ```tsx
   // src/lib/api.ts
   export const api = {
     newEndpoint: {
       get: () => fetchApi('/new-endpoint')
     }
   }
   ```

### Estilo y Temas

Los estilos utilizan CSS custom properties para temas:

```css
/* src/app/globals.css */
:root {
  --primary: 221.2 83.2% 53.3%;
  --background: 0 0% 100%;
  /* ... */
}
```

## Próximas Mejoras

- [ ] Integración con base de datos real (PostgreSQL)
- [ ] Autenticación y autorización
- [ ] Exportación a PDF/Excel
- [ ] Notificaciones en tiempo real
- [ ] Audit logs
- [ ] Más formatos de importación
- [ ] APIs REST completas
- [ ] Tests automatizados

## Soporte

Para soporte técnico o reportar bugs, crear un issue en el repositorio del proyecto.

---

**NUAM Tax Qualification System v1.0**  
Desarrollado con ❤️ para la gestión tributaria empresarial