require('dotenv').config();
const { Client } = require('pg');
const fs = require('fs');

async function fixColumns() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();
    console.log('✅ Connected to database\n');

    console.log('📋 Current column names:');
    const before = await client.query(`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_name = 'audit_logs'
      ORDER BY ordinal_position;
    `);
    console.table(before.rows);

    console.log('\n🔄 Renaming columns to camelCase...\n');

    // Rename columns one by one
    const migrations = [
      { from: 'entity_type', to: 'entityType' },
      { from: 'entity_id', to: 'entityId' },
      { from: 'old_values', to: 'oldValues' },
      { from: 'new_values', to: 'newValues' },
      { from: 'created_at', to: 'createdAt' },
      { from: 'user_id', to: 'userId' },
      { from: 'qualification_id', to: 'qualificationId' },
    ];

    for (const { from, to } of migrations) {
      try {
        await client.query(`ALTER TABLE audit_logs RENAME COLUMN ${from} TO "${to}"`);
        console.log(`✅ Renamed ${from} → ${to}`);
      } catch (error) {
        if (error.code === '42703') {
          console.log(`⚠️  Column ${from} doesn't exist (might already be renamed)`);
        } else if (error.code === '42P01') {
          console.log(`⚠️  Column ${to} already exists`);
        } else {
          throw error;
        }
      }
    }

    console.log('\n✅ Column names after migration:');
    const after = await client.query(`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_name = 'audit_logs'
      ORDER BY ordinal_position;
    `);
    console.table(after.rows);

    console.log('\n🎉 Migration completed successfully!');
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.end();
  }
}

fixColumns();
