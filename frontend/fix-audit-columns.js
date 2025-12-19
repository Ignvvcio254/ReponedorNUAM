const { Client } = require('pg');

async function fixColumns() {
  const client = new Client({
    connectionString: 'postgresql://postgres.epoytibyizkyjncbtlew:Elignaciopro250426.@aws-1-us-east-1.pooler.supabase.com:5432/postgres',
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('🔌 Conectado a la base de datos\n');

    console.log('📝 Renombrando columnas de camelCase a snake_case...\n');

    // Rename oldValues to old_values
    console.log('1️⃣  Renombrando "oldValues" → "old_values"');
    await client.query(`
      ALTER TABLE audit_logs 
      RENAME COLUMN "oldValues" TO old_values;
    `);
    console.log('   ✅ Hecho\n');

    // Rename newValues to new_values
    console.log('2️⃣  Renombrando "newValues" → "new_values"');
    await client.query(`
      ALTER TABLE audit_logs 
      RENAME COLUMN "newValues" TO new_values;
    `);
    console.log('   ✅ Hecho\n');

    // Rename entityType to entity_type
    console.log('3️⃣  Renombrando "entityType" → "entity_type"');
    await client.query(`
      ALTER TABLE audit_logs 
      RENAME COLUMN "entityType" TO entity_type;
    `);
    console.log('   ✅ Hecho\n');

    // Rename entityId to entity_id
    console.log('4️⃣  Renombrando "entityId" → "entity_id"');
    await client.query(`
      ALTER TABLE audit_logs 
      RENAME COLUMN "entityId" TO entity_id;
    `);
    console.log('   ✅ Hecho\n');

    // Rename createdAt to created_at
    console.log('5️⃣  Renombrando "createdAt" → "created_at"');
    await client.query(`
      ALTER TABLE audit_logs 
      RENAME COLUMN "createdAt" TO created_at;
    `);
    console.log('   ✅ Hecho\n');

    // Rename userId to user_id
    console.log('6️⃣  Renombrando "userId" → "user_id"');
    await client.query(`
      ALTER TABLE audit_logs 
      RENAME COLUMN "userId" TO user_id;
    `);
    console.log('   ✅ Hecho\n');

    // Rename qualificationId to qualification_id
    console.log('7️⃣  Renombrando "qualificationId" → "qualification_id"');
    await client.query(`
      ALTER TABLE audit_logs 
      RENAME COLUMN "qualificationId" TO qualification_id;
    `);
    console.log('   ✅ Hecho\n');

    // Verify the changes
    console.log('🔍 Verificando cambios...\n');
    const result = await client.query(`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_name = 'audit_logs'
      ORDER BY ordinal_position
    `);

    console.log('✅ Nueva estructura de audit_logs:');
    console.table(result.rows);

    console.log('\n🎉 ¡Migración completada exitosamente!');
    console.log('💡 Ahora el schema de Prisma coincide con la base de datos');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (error.code) console.error('Código:', error.code);
    if (error.detail) console.error('Detalle:', error.detail);
    process.exit(1);
  } finally {
    await client.end();
    console.log('\n🔌 Conexión cerrada');
  }
}

fixColumns();
