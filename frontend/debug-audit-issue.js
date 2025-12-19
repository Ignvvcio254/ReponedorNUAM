require('dotenv').config();
const { Client } = require('pg');

async function debugAuditIssue() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();
    console.log('Connected to database\n');

    // Test 1: Check audit_logs table structure
    console.log('=== Audit Logs Table Structure ===');
    const tableInfo = await client.query(`
      SELECT column_name, data_type, udt_name, column_default
      FROM information_schema.columns
      WHERE table_name = 'audit_logs'
      ORDER BY ordinal_position;
    `);
    console.table(tableInfo.rows);

    // Test 2: Check if there are any triggers
    console.log('\n=== Triggers on audit_logs ===');
    const triggers = await client.query(`
      SELECT trigger_name, event_manipulation, action_statement
      FROM information_schema.triggers
      WHERE event_object_table = 'audit_logs';
    `);
    console.table(triggers.rows);

    // Test 3: Try to insert a simple audit log manually (using correct snake_case column names)
    console.log('\n=== Test Insert ===');
    try {
      const testInsert = await client.query(`
        INSERT INTO audit_logs (id, action, entity_type, entity_id, user_id, old_values, new_values, created_at)
        VALUES (
          'test_' || gen_random_uuid()::text,
          'UPDATE',
          'User',
          'test-user-id',
          'test-admin-id',
          '{"role": "ACCOUNTANT"}'::jsonb,
          '{"role": "AUDITOR"}'::jsonb,
          NOW()
        )
        RETURNING id, action, new_values;
      `);
      console.log('✅ Test insert successful:');
      console.log(testInsert.rows[0]);

      // Clean up test data
      await client.query(`DELETE FROM audit_logs WHERE entity_id = 'test-user-id'`);
      console.log('✅ Test data cleaned up');
    } catch (error) {
      console.error('❌ Test insert failed:', error.message);
      console.error('Full error:', error);
    }

    // Test 4: Check existing audit logs for patterns
    console.log('\n=== Sample of Recent Audit Logs ===');
    const samples = await client.query(`
      SELECT id, action, "entityType", "newValues"
      FROM audit_logs
      ORDER BY "createdAt" DESC
      LIMIT 5;
    `);
    console.table(samples.rows);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.end();
  }
}

debugAuditIssue();
