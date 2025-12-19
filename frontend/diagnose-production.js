require('dotenv').config();
const { Client } = require('pg');

/**
 * DIAGNOSTIC SCRIPT: Production vs Local Database Analysis
 *
 * Purpose: Identify why "column new does not exist" error occurs in production
 * but not locally.
 *
 * This script will:
 * 1. Check both auth.users and public.users tables
 * 2. Verify which table Prisma is trying to use
 * 3. Test UPDATE queries directly
 * 4. Diagnose schema confusion issues
 */

async function diagnoseProduction() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();
    console.log('\n🔍 === PRODUCTION DATABASE DIAGNOSTIC ===\n');
    console.log('DATABASE_URL:', process.env.DATABASE_URL.replace(/:[^:@]+@/, ':****@'));

    // 1. Check which schemas exist
    console.log('\n📊 === AVAILABLE SCHEMAS ===');
    const schemas = await client.query(`
      SELECT schema_name
      FROM information_schema.schemata
      WHERE schema_name IN ('public', 'auth')
      ORDER BY schema_name;
    `);
    console.table(schemas.rows);

    // 2. Check users tables in both schemas
    console.log('\n👥 === USERS TABLES IN EACH SCHEMA ===');
    const usersTables = await client.query(`
      SELECT
        table_schema,
        table_name,
        (SELECT COUNT(*)
         FROM information_schema.columns
         WHERE table_schema = t.table_schema
         AND table_name = t.table_name) as column_count
      FROM information_schema.tables t
      WHERE table_name = 'users'
      ORDER BY table_schema;
    `);
    console.table(usersTables.rows);

    // 3. Check columns in public.users (our application table)
    console.log('\n📋 === public.users TABLE STRUCTURE ===');
    const publicUsersColumns = await client.query(`
      SELECT
        column_name,
        data_type,
        udt_name,
        is_nullable,
        column_default
      FROM information_schema.columns
      WHERE table_schema = 'public'
      AND table_name = 'users'
      ORDER BY ordinal_position;
    `);
    console.table(publicUsersColumns.rows);

    // 4. Check if 'role' column exists in public.users
    console.log('\n🎭 === ROLE COLUMN VERIFICATION ===');
    const roleColumn = await client.query(`
      SELECT
        column_name,
        data_type,
        udt_name
      FROM information_schema.columns
      WHERE table_schema = 'public'
      AND table_name = 'users'
      AND column_name = 'role';
    `);

    if (roleColumn.rows.length > 0) {
      console.log('✅ Role column EXISTS in public.users:');
      console.table(roleColumn.rows);
    } else {
      console.log('❌ Role column DOES NOT EXIST in public.users!');
    }

    // 5. Check UserRole enum
    console.log('\n🏷️  === UserRole ENUM VALUES ===');
    const enumValues = await client.query(`
      SELECT
        e.enumlabel as value,
        e.enumsortorder as sort_order
      FROM pg_enum e
      JOIN pg_type t ON e.enumtypid = t.oid
      JOIN pg_namespace n ON t.typnamespace = n.oid
      WHERE t.typname = 'UserRole'
      AND n.nspname = 'public'
      ORDER BY e.enumsortorder;
    `);
    console.table(enumValues.rows);

    // 6. Test direct UPDATE query (what Prisma should be doing)
    console.log('\n🧪 === TEST UPDATE QUERY ===');
    try {
      // First, get a test user
      const testUser = await client.query(`
        SELECT id, email, name, role
        FROM public.users
        LIMIT 1;
      `);

      if (testUser.rows.length > 0) {
        const userId = testUser.rows[0].id;
        const currentRole = testUser.rows[0].role;
        console.log(`Test user: ${testUser.rows[0].email} (current role: ${currentRole})`);

        // Try the same UPDATE that Prisma would do
        const updateResult = await client.query(`
          UPDATE public.users
          SET role = $1
          WHERE id = $2
          RETURNING id, email, name, role;
        `, [currentRole, userId]); // Set to same role (no actual change)

        console.log('✅ UPDATE query succeeded:');
        console.table(updateResult.rows);
      } else {
        console.log('⚠️  No users found in database');
      }
    } catch (error) {
      console.error('❌ UPDATE query FAILED:', error.message);
      console.error('Full error:', error);
    }

    // 7. Check if there's a search_path issue
    console.log('\n🛤️  === CURRENT SEARCH PATH ===');
    const searchPath = await client.query(`SHOW search_path;`);
    console.log('Search path:', searchPath.rows[0].search_path);

    // 8. Check connection info
    console.log('\n🔌 === CONNECTION INFO ===');
    const connInfo = await client.query(`
      SELECT
        current_database() as database,
        current_schema() as schema,
        current_user as user,
        version() as postgres_version;
    `);
    console.table(connInfo.rows);

    // 9. Final analysis
    console.log('\n📝 === DIAGNOSTIC SUMMARY ===\n');

    const hasPublicUsers = usersTables.rows.some(r => r.table_schema === 'public' && r.table_name === 'users');
    const hasAuthUsers = usersTables.rows.some(r => r.table_schema === 'auth' && r.table_name === 'users');
    const hasRoleColumn = roleColumn.rows.length > 0;

    console.log(`✓ public.users table exists: ${hasPublicUsers}`);
    console.log(`✓ auth.users table exists: ${hasAuthUsers}`);
    console.log(`✓ role column in public.users: ${hasRoleColumn}`);
    console.log(`✓ DATABASE_URL has schema=public: ${process.env.DATABASE_URL.includes('schema=public')}`);

    if (hasPublicUsers && hasAuthUsers && !process.env.DATABASE_URL.includes('schema=public')) {
      console.log('\n⚠️  PROBLEM DETECTED:');
      console.log('   - Both auth.users and public.users exist');
      console.log('   - DATABASE_URL does NOT have &schema=public parameter');
      console.log('   - Prisma may be confusing the two tables!');
      console.log('\n💡 SOLUTION:');
      console.log('   Add &schema=public to DATABASE_URL in Vercel');
    } else if (hasPublicUsers && hasAuthUsers && process.env.DATABASE_URL.includes('schema=public')) {
      console.log('\n✅ CONFIGURATION LOOKS CORRECT');
      console.log('   - Both users tables exist');
      console.log('   - DATABASE_URL has &schema=public parameter');
      console.log('   - Issue may be with Prisma client cache in Vercel');
      console.log('\n💡 NEXT STEPS:');
      console.log('   1. Force Vercel to regenerate Prisma client');
      console.log('   2. Clear Vercel build cache');
      console.log('   3. Redeploy from scratch');
    }

  } catch (error) {
    console.error('\n❌ DIAGNOSTIC ERROR:', error.message);
    console.error('Full error:', error);
  } finally {
    await client.end();
    console.log('\n🏁 Diagnostic complete\n');
  }
}

diagnoseProduction();
