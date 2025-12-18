/**
 * Check database triggers
 */

require('dotenv').config();
const { Client } = require('pg');

async function checkTriggers() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();

    const result = await client.query(`
      SELECT trigger_name, event_manipulation, action_statement
      FROM information_schema.triggers
      WHERE event_object_table = 'users'
    `);

    console.log('Triggers on users table:');
    console.log('========================\n');
    result.rows.forEach(row => {
      console.log('Trigger:', row.trigger_name);
      console.log('Event:', row.event_manipulation);
      console.log('Action:', row.action_statement);
      console.log('---');
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.end();
  }
}

checkTriggers();
