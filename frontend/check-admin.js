/**
 * Check admin user details
 */

require('dotenv').config();
const { Client } = require('pg');

async function checkAdmin() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();
    console.log('Connected to database\n');

    const result = await client.query(`
      SELECT id, email, name, role, password, "isActive", "emailVerified", "createdAt"
      FROM users
      WHERE email = 'admin@nuam.com'
    `);

    if (result.rows.length === 0) {
      console.log('❌ Admin user not found');
      return;
    }

    const admin = result.rows[0];
    console.log('Admin User Details:');
    console.log('==================');
    console.log('Email:', admin.email);
    console.log('Name:', admin.name);
    console.log('Role:', admin.role);
    console.log('Active:', admin.isActive);
    console.log('Email Verified:', admin.emailVerified);
    console.log('Password Hash:', admin.password ? admin.password.substring(0, 20) + '...' : 'NULL');
    console.log('Created:', admin.createdAt);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.end();
  }
}

checkAdmin();
