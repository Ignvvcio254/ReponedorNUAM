/**
 * Direct Database Migration Script
 * Runs SQL migration directly using node-postgres
 */

require('dotenv').config();
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function runMigration() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    console.log('Connecting to database...');
    await client.connect();
    console.log('Connected successfully!');

    // Read the migration SQL file
    const sqlPath = path.join(__dirname, 'migration-add-auth-fields.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    console.log('Running migration...');
    await client.query(sql);

    console.log('Migration completed successfully!');

    // Verify the changes
    console.log('\nVerifying users table structure...');
    const result = await client.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_name = 'users'
      ORDER BY ordinal_position;
    `);

    console.log('\nUsers table columns:');
    result.rows.forEach(row => {
      console.log(`  - ${row.column_name} (${row.data_type})`);
    });

  } catch (error) {
    console.error('Error running migration:', error);
    process.exit(1);
  } finally {
    await client.end();
    console.log('\nDisconnected from database');
  }
}

runMigration();
