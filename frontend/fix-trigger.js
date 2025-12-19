require('dotenv').config();
const { Client } = require('pg');

/**
 * FIX: Update trigger function to use proper quoted column names
 *
 * Problem: NEW.updatedAt gets converted to lowercase "updatedat"
 * Solution: Use NEW."updatedAt" with double quotes to preserve camelCase
 */

async function fixTrigger() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();
    console.log('\n🔧 === FIXING TRIGGER FUNCTION ===\n');

    // Drop the old function
    console.log('1. Dropping old update_updated_at_column function...');
    await client.query(`
      DROP FUNCTION IF EXISTS public.update_updated_at_column() CASCADE;
    `);
    console.log('✅ Old function dropped\n');

    // Create the corrected function with quoted column name
    console.log('2. Creating corrected update_updated_at_column function...');
    await client.query(`
      CREATE OR REPLACE FUNCTION public.update_updated_at_column()
      RETURNS TRIGGER
      LANGUAGE plpgsql
      AS $$
      BEGIN
        NEW."updatedAt" = CURRENT_TIMESTAMP;
        RETURN NEW;
      END;
      $$;
    `);
    console.log('✅ Corrected function created\n');

    // Recreate the trigger
    console.log('3. Recreating trigger on public.users...');
    await client.query(`
      CREATE TRIGGER update_users_updatedat
      BEFORE UPDATE ON public.users
      FOR EACH ROW
      EXECUTE FUNCTION public.update_updated_at_column();
    `);
    console.log('✅ Trigger recreated\n');

    // Test the fix
    console.log('4. Testing the fix with an UPDATE query...');
    const testUser = await client.query(`
      SELECT id, email, role FROM public.users LIMIT 1;
    `);

    if (testUser.rows.length > 0) {
      const userId = testUser.rows[0].id;
      const currentRole = testUser.rows[0].role;

      try {
        const updateResult = await client.query(`
          UPDATE public.users
          SET role = $1
          WHERE id = $2
          RETURNING id, email, role, "updatedAt";
        `, [currentRole, userId]);

        console.log('✅ UPDATE TEST SUCCEEDED!');
        console.log('Updated user:', updateResult.rows[0]);
        console.log('\n🎉 TRIGGER FIX COMPLETE - All updates should now work!\n');
      } catch (updateError) {
        console.error('❌ UPDATE TEST FAILED:', updateError.message);
        throw updateError;
      }
    } else {
      console.log('⚠️  No users found to test with');
    }

  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

fixTrigger();
