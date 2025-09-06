# Vercel Environment Variables Setup

## Required Environment Variables for NUAM Tax Container System

Configure these environment variables in your Vercel project dashboard (Settings > Environment Variables):

### Database (REQUIRED)
```
DATABASE_URL=postgresql://postgres:Elignaciopro250426.@db.epoytibyizkyjncbtlew.supabase.co:5432/postgres?sslmode=require&connect_timeout=60
```

### Application Configuration (REQUIRED)
```
NODE_ENV=production
NEXT_PUBLIC_ENV=production
```

### Authentication (RECOMMENDED)
```
NEXTAUTH_URL=https://your-vercel-app-url.vercel.app
NEXTAUTH_SECRET=generate-a-random-32-character-secret-key-here
JWT_SECRET=generate-another-random-32-character-secret-key
```

### API Configuration (OPTIONAL - for future integrations)
```
API_BASE_URL=https://your-vercel-app-url.vercel.app/api
UPLOAD_MAX_SIZE=50MB
```

### Tax Authority APIs (OPTIONAL - for future integrations)
```
SII_API_URL=https://api.sii.cl/recursos/v1
SUNAT_API_URL=https://api.sunat.gob.pe/v1  
DIAN_API_URL=https://api.dian.gov.co/v1
```

## Setup Instructions

1. Go to your Vercel project dashboard
2. Navigate to Settings > Environment Variables
3. Add each variable with its corresponding value
4. Make sure to set them for all environments (Production, Preview, Development)
5. Redeploy your application after adding the variables

## Minimal Configuration for Initial Deployment

For the tax container system to work initially, you only need:

1. `DATABASE_URL` - The Supabase connection string
2. `NODE_ENV=production`
3. `NEXT_PUBLIC_ENV=production`

The other variables can be added later as you implement additional features.

## Security Notes

- Never commit actual environment variables to version control
- Use strong, unique secrets for production
- Rotate secrets regularly
- Use Vercel's encrypted storage for sensitive values