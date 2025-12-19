require('dotenv').config();
const { Client } = require('pg');

async function checkAllTriggers() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();
    console.log('Checking all triggers in public schema');

    const triggers = await client.query(`
      SELECT
        t.trigger_name,
        t.event_object_table as table_name,
        t.action_statement
      FROM information_schema.triggers t
      WHERE t.event_object_schema = 'public'
      ORDER BY t.event_object_table, t.trigger_name;
    `);

    console.log(`Found ${triggers.rows.length} triggers:`);
    triggers.rows.forEach(t => {
      console.log(`  ${t.table_name}.${t.trigger_name} -> ${t.action_statement}`);
    });

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await client.end();
  }
}

checkAllTriggers();
