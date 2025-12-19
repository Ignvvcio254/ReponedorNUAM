require('dotenv').config();
const { Client } = require('pg');

async function checkTrigger() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();

    // Get the trigger function definition
    const funcDef = await client.query(`
      SELECT pg_get_functiondef(oid) as definition
      FROM pg_proc
      WHERE proname = 'update_updated_at_column';
    `);

    if (funcDef.rows.length > 0) {
      console.log('=== Trigger Function Definition ===\n');
      console.log(funcDef.rows[0].definition);
    } else {
      console.log('Function not found');
    }

    // Check what schema the users table is in
    console.log('\n=== Users table schema ===');
    const schema = await client.query(`
      SELECT table_schema, table_name
      FROM information_schema.tables
      WHERE table_name = 'users';
    `);
    console.table(schema.rows);

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await client.end();
  }
}

checkTrigger();
