require('dotenv').config();
const { Client } = require('pg');

async function checkUsersTable() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();
    console.log('Connected to database\n');

    // Check users table structure
    console.log('=== Users Table Structure ===');
    const tableInfo = await client.query(`
      SELECT column_name, data_type, udt_name, column_default
      FROM information_schema.columns
      WHERE table_name = 'users'
      ORDER BY ordinal_position;
    `);
    console.table(tableInfo.rows);

    // Check triggers on users table
    console.log('\n=== Triggers on users table ===');
    const triggers = await client.query(`
      SELECT trigger_name, event_manipulation, action_statement, action_timing
      FROM information_schema.triggers
      WHERE event_object_table = 'users';
    `);
    console.table(triggers.rows);

    // Check functions related to users
    console.log('\n=== Functions that might affect users ===');
    const functions = await client.query(`
      SELECT
        p.proname as function_name,
        pg_get_functiondef(p.oid) as definition
      FROM pg_proc p
      JOIN pg_namespace n ON p.pronamespace = n.oid
      WHERE n.nspname = 'public'
      AND (
        pg_get_functiondef(p.oid) LIKE '%users%'
        OR pg_get_functiondef(p.oid) LIKE '%audit%'
      )
      LIMIT 10;
    `);

    if (functions.rows.length > 0) {
      console.log('Found functions:');
      functions.rows.forEach(f => {
        console.log(`\n--- ${f.function_name} ---`);
        console.log(f.definition);
      });
    } else {
      console.log('No related functions found');
    }

    // Try a simple update
    console.log('\n=== Testing simple update ===');
    try {
      await client.query(`
        UPDATE users
        SET role = 'AUDITOR'
        WHERE email = 'vgracia04@gmail.com'
        RETURNING id, email, name, role;
      `);
      console.log('✅ Direct SQL update works!');
    } catch (error) {
      console.error('❌ Direct SQL update failed:', error.message);
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.end();
  }
}

checkUsersTable();
