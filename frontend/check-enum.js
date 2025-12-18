require('dotenv').config();
const { Client } = require('pg');

async function checkEnum() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();
    console.log('Connected to database');

    // Query to check enum values
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

    console.log('\nCurrent UserRole enum values in database:');
    result.rows.forEach((row, index) => {
      console.log(`${index + 1}. ${row.enumlabel}`);
    });

    // Also check what the users table expects
    const tableInfo = await client.query(`
      SELECT column_name, data_type, udt_name
      FROM information_schema.columns
      WHERE table_name = 'users' AND column_name = 'role';
    `);

    console.log('\nUsers table role column info:');
    console.log(tableInfo.rows[0]);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.end();
  }
}

checkEnum();
