/**
 * Seed Script: Create First Admin User
 * Purpose: Bootstrap the system with an initial administrator account
 * Usage: npm run db:seed-admin
 *
 * IMPORTANT: Change the default password after first login!
 */

import 'dotenv/config'
import { PrismaClient } from '../generated/prisma'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

// ============================================================================
// Configuration
// ============================================================================

const ADMIN_EMAIL = process.env.FIRST_ADMIN_EMAIL || 'admin@nuam.com'
const ADMIN_PASSWORD = process.env.FIRST_ADMIN_PASSWORD || 'Admin123!NUAM'
const ADMIN_NAME = 'Administrador NUAM'

// ============================================================================
// Main Seed Function
// ============================================================================

async function main() {
  console.log('🚀 Starting admin user seed...')
  console.log('================================')

  try {
    // Check if admin already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: ADMIN_EMAIL },
    })

    if (existingAdmin) {
      console.log('⚠️  Admin user already exists')
      console.log('📧 Email:', existingAdmin.email)
      console.log('👤 Name:', existingAdmin.name)
      console.log('🎭 Role:', existingAdmin.role)
      console.log('\n✅ No action needed')
      return
    }

    // Hash password with bcrypt (12 rounds)
    console.log('🔐 Hashing password...')
    const hashedPassword = await hash(ADMIN_PASSWORD, 12)

    // Create admin user
    console.log('👤 Creating admin user...')
    const admin = await prisma.user.create({
      data: {
        email: ADMIN_EMAIL,
        name: ADMIN_NAME,
        password: hashedPassword,
        role: 'ADMIN',
        emailVerified: new Date(),
        isActive: true,
      },
    })

    console.log('\n✅ Admin user created successfully!')
    console.log('================================')
    console.log('📧 Email:', admin.email)
    console.log('👤 Name:', admin.name)
    console.log('🎭 Role:', admin.role)
    console.log('🔑 Password:', ADMIN_PASSWORD)
    console.log('================================')
    console.log('\n⚠️  IMPORTANT SECURITY NOTICE:')
    console.log('1. Change this password immediately after first login')
    console.log('2. Store this password securely')
    console.log('3. Delete this output from your terminal history')
    console.log('================================\n')

    // Create audit log
    await prisma.auditLog.create({
      data: {
        action: 'CREATE',
        entityType: 'user',
        entityId: admin.id,
        newValues: {
          email: admin.email,
          role: admin.role,
          created_by: 'seed_script',
        },
        userId: admin.id,
      },
    })

    console.log('📝 Audit log created')

    // Create system config entries
    await prisma.systemConfig.upsert({
      where: { key: 'system_initialized' },
      update: { value: 'true' },
      create: {
        key: 'system_initialized',
        value: 'true',
        description: 'Indicates if the system has been initialized with an admin user',
      },
    })

    await prisma.systemConfig.upsert({
      where: { key: 'admin_user_id' },
      update: { value: admin.id },
      create: {
        key: 'admin_user_id',
        value: admin.id,
        description: 'ID of the first admin user',
      },
    })

    console.log('⚙️  System config updated')
    console.log('\n🎉 Seed completed successfully!')
  } catch (error) {
    console.error('\n❌ Error during seed:', error)
    throw error
  }
}

// ============================================================================
// Execute
// ============================================================================

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
