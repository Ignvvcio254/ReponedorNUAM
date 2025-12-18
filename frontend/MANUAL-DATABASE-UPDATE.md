# Manual Database Update Required

## Problem
Prisma's `db push` command is hanging when trying to connect through Supabase's connection pooler (pgbouncer). This is a known limitation - pgbouncer in transaction mode doesn't support some of the operations Prisma needs to perform for schema migrations.

## Solution
You need to manually run the SQL migration in the Supabase SQL Editor.

## Steps to Update Database

### 1. Open Supabase SQL Editor
1. Go to https://supabase.com/dashboard
2. Select your project: `epoytibyizkyjncbtlew`
3. Navigate to: **SQL Editor** (in the left sidebar)

### 2. Run the Migration SQL
Copy and paste the entire contents of `migration-add-auth-fields.sql` into the SQL Editor and click "Run".

The migration will:
- Add missing authentication columns to the `users` table:
  - emailVerified
  - password (with default 'changeme')
  - image
  - twoFactorEnabled
  - twoFactorSecret
  - lastLoginAt
  - lastLoginIp
  - isActive
  - failedLoginAttempts
  - lockedUntil
  - passwordResetToken
  - passwordResetExpires

- Create NextAuth tables:
  - accounts
  - sessions
  - verification_tokens

- Add performance indexes

### 3. Verify the Migration
After running the SQL, verify in Supabase Table Editor that the `users` table now has all the new columns.

### 4. Create Admin User
Once the database schema is updated, run this command locally:

```bash
npm run db:seed-admin
```

This will create the admin user with credentials:
- Email: admin@nuam.com
- Password: Admin123!NUAM

### 5. Test Login
Go to https://reponedor-nuam.vercel.app/login and try logging in with the admin credentials.

## Alternative: Use Supabase Direct Connection
If you want to use Prisma commands in the future, you can:

1. Get the direct connection string (not pooled) from Supabase:
   - Go to Project Settings > Database
   - Look for "Connection string" > "Direct connection"
   - It should look like: `postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres`

2. Create a separate `.env.local` file with:
   ```
   DIRECT_DATABASE_URL="postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres"
   ```

3. Update `prisma/schema.prisma` to use it:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DIRECT_DATABASE_URL")
   }
   ```

4. Then run: `npx prisma db push`

Note: Keep the pooled connection for your application runtime, only use direct connection for migrations.
