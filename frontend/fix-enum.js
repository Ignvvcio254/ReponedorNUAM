require('dotenv').config();
const { Client } = require('pg');

async function fixEnum() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();
    console.log('Connected to database');

    // Add the missing enum values
    console.log('\nAdding MANAGER to UserRole enum...');
    await client.query(`ALTER TYPE "UserRole" ADD VALUE IF NOT EXISTS 'MANAGER'`);
    console.log('✓ MANAGER added');

    console.log('\nAdding ACCOUNTANT to UserRole enum...');
    await client.query(`ALTER TYPE "UserRole" ADD VALUE IF NOT EXISTS 'ACCOUNTANT'`);
    console.log('✓ ACCOUNTANT added');

    console.log('\nAdding AUDITOR to UserRole enum...');
    await client.query(`ALTER TYPE "UserRole" ADD VALUE IF NOT EXISTS 'AUDITOR'`);
    console.log('✓ AUDITOR added');

    // Verify the changes
    const result = await client.query(`
      SELECT enumlabel
      FROM pg_enum
      WHERE enumtypid = (
        SELECT oid
        FROM pg_type
        WHERE typname = 'UserRole'
      )
      ORDER BY enumsortorder;
    `);

    console.log('\nUpdated UserRole enum values:');
    result.rows.forEach((row, index) => {
      console.log(`${index + 1}. ${row.enumlabel}`);
    });

    console.log('\n✓ Enum migration completed successfully!');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.end();
  }
}

fixEnum();
