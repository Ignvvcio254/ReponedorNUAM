/**
 * Update admin password to proper bcrypt hash
 */

require('dotenv').config();
const { Client } = require('pg');
const bcrypt = require('bcryptjs');

async function updateAdminPassword() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  const ADMIN_EMAIL = 'admin@nuam.com';
  const ADMIN_PASSWORD = 'Admin123!NUAM';

  try {
    await client.connect();
    console.log('Connected to database\n');

    // Hash the password
    console.log('Hashing password...');
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 12);
    console.log('Password hashed successfully');

    // Temporarily disable trigger
    console.log('\nDisabling trigger...');
    await client.query('ALTER TABLE users DISABLE TRIGGER update_users_updatedat');

    // Update the admin user
    console.log('Updating admin user...');
    const result = await client.query(
      `UPDATE users
       SET password = $1,
           "isActive" = true,
           "emailVerified" = NOW()
       WHERE email = $2
       RETURNING id, email, name, role`,
      [hashedPassword, ADMIN_EMAIL]
    );

    // Re-enable trigger
    console.log('Re-enabling trigger...');
    await client.query('ALTER TABLE users ENABLE TRIGGER update_users_updatedat');

    if (result.rows.length === 0) {
      console.log('❌ Admin user not found');
      return;
    }

    console.log('✅ Admin user updated successfully!\n');
    console.log('Admin Credentials:');
    console.log('==================');
    console.log('Email:', ADMIN_EMAIL);
    console.log('Password:', ADMIN_PASSWORD);
    console.log('\nUser Details:');
    console.log('Name:', result.rows[0].name);
    console.log('Role:', result.rows[0].role);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.end();
    console.log('\nDisconnected from database');
  }
}

updateAdminPassword();
