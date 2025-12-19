require('dotenv').config();
const { Client } = require('pg');

async function checkTriggers() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();
    console.log('Checking triggers on public.users');

    const triggers = await client.query(`
      SELECT trigger_name, event_manipulation, action_statement
      FROM information_schema.triggers
      WHERE event_object_schema = 'public'
      AND event_object_table = 'users'
      ORDER BY trigger_name;
    `);

    console.log('Triggers found:', triggers.rows.length);
    triggers.rows.forEach(t => console.log(t));

    const funcDef = await client.query(`
      SELECT pg_get_functiondef(oid) as definition
      FROM pg_proc
      WHERE proname = 'update_updated_at_column';
    `);

    if (funcDef.rows.length > 0) {
      console.log('Function definition:');
      console.log(funcDef.rows[0].definition);
    }

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await client.end();
  }
}

checkTriggers();
