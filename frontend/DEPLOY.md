# NUAM Tax Frontend - Guía de Deployment en Vercel

## 🚀 Deployment en Vercel

### Prerrequisitos
- Cuenta en [Vercel](https://vercel.com)
- Repositorio de GitHub con el código
- Base de datos PostgreSQL (recomendado: Supabase, PlanetScale, o Neon)

### Paso 1: Preparación del Proyecto

1. **Asegúrate de que todos los archivos estén committeados:**
   ```bash
   git add .
   git commit -m "feat: configuración para deployment en Vercel"
   git push origin main
   ```

### Paso 2: Configuración en Vercel

1. **Conecta tu repositorio:**
   - Ve a [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Importa tu repositorio de GitHub
   - Selecciona la carpeta `frontend` como root directory

2. **Configuración del proyecto:**
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`

### Paso 3: Variables de Entorno

Configura estas variables en Vercel Dashboard > Settings > Environment Variables:

#### Variables Obligatorias:
```env
NODE_ENV=production
NEXT_PUBLIC_ENV=production
NEXTAUTH_URL=https://tu-app.vercel.app
NEXTAUTH_SECRET=tu_secreto_nextauth_seguro_32_chars
DATABASE_URL=tu_url_base_datos_postgresql
JWT_SECRET=tu_secreto_jwt_min_32_caracteres
ENCRYPTION_KEY=tu_clave_encriptacion_32_chars
```

#### Variables de APIs Externas:
```env
SII_API_URL=https://api.sii.cl/recursos/v1
SII_API_KEY=tu_clave_sii_produccion
SUNAT_API_URL=https://api.sunat.gob.pe/v1
SUNAT_API_KEY=tu_clave_sunat_produccion
DIAN_API_URL=https://api.dian.gov.co/v1
DIAN_API_KEY=tu_clave_dian_produccion
```

#### Variables de Email:
```env
SMTP_HOST=tu_servidor_smtp
SMTP_PORT=587
SMTP_USER=tu_usuario_smtp
SMTP_PASS=tu_password_smtp
```

#### Variables Opcionales:
```env
API_BASE_URL=https://tu-app.vercel.app/api
UPLOAD_MAX_SIZE=50MB
OCR_CONFIDENCE_THRESHOLD=0.95
OCR_HUMAN_REVIEW_THRESHOLD=0.80
CUSTOM_KEY=tu_clave_personalizada
```

### Paso 4: Deploy

1. **Deploy automático:**
   - Vercel deployará automáticamente cuando hagas push a la rama main
   - Puedes ver el progreso en el dashboard de Vercel

2. **Deploy manual:**
   - En Vercel Dashboard, ve a tu proyecto
   - Click "Deployments" > "Redeploy"

### Paso 5: Configuración Post-Deploy

1. **Dominio personalizado (opcional):**
   - Ve a Settings > Domains
   - Agrega tu dominio personalizado
   - Actualiza `NEXTAUTH_URL` con tu nuevo dominio

2. **Configuración de Base de Datos:**
   - Asegúrate de que tu base de datos PostgreSQL esté accesible públicamente
   - Configura las tablas necesarias (migrations)
   - Actualiza `DATABASE_URL` con la URL de producción

### Paso 6: Verificación

1. **Prueba la aplicación:**
   - Visita tu URL de Vercel
   - Verifica que la pantalla de carga funcione
   - Prueba el dashboard y las funcionalidades principales

2. **Monitoreo:**
   - Revisa los logs en Vercel Dashboard > Functions
   - Configura alertas si es necesario

## 🔧 Comandos Útiles

```bash
# Build local para verificar errores
npm run build

# Verificar tipos
npm run type-check

# Lint del código
npm run lint

# Desarrollo local
npm run dev
```

## 📁 Archivos de Configuración

- `vercel.json` - Configuración de Vercel
- `next.config.js` - Configuración de Next.js optimizada
- `.env.example` - Template de variables de entorno
- `.gitignore` - Archivos ignorados por Git

## 🛠️ Solución de Problemas

### Error: "Module not found"
- Verifica que todas las dependencias estén en `package.json`
- Ejecuta `npm install` localmente

### Error: "Environment variable not found"
- Verifica que todas las variables estén configuradas en Vercel
- Las variables que empiezan con `NEXT_PUBLIC_` son públicas

### Error: "Build failed"
- Revisa los logs de build en Vercel Dashboard
- Ejecuta `npm run build` localmente para debugear

### Error: "Database connection"
- Verifica que `DATABASE_URL` esté correctamente configurada
- Asegúrate de que la base de datos sea accesible desde Vercel

## 🔒 Seguridad

- Nunca commitees archivos `.env*` con datos reales
- Usa secretos seguros para producción (min 32 caracteres)
- Configura headers de seguridad (ya incluidos en `next.config.js`)
- Mantén actualizadas las dependencias

## 📞 Soporte

Si tienes problemas con el deployment:
1. Revisa los logs en Vercel Dashboard
2. Verifica las variables de entorno
3. Prueba el build localmente
4. Consulta la documentación de [Vercel](https://vercel.com/docs)