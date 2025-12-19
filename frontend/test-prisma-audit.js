require('dotenv').config();
const { PrismaClient } = require('./generated/prisma');

const prisma = new PrismaClient();

async function testAuditLog() {
  try {
    console.log('Testing Prisma AuditLog creation...\n');

    // Get a real user ID
    const firstUser = await prisma.user.findFirst({
      where: { isActive: true },
      select: { id: true, name: true, email: true, role: true },
    });

    if (!firstUser) {
      console.log('❌ No users found in database');
      return;
    }

    console.log('✅ Found user:', firstUser);

    // Test 1: Simple audit log
    console.log('\n=== Test 1: Creating audit log with simple values ===');
    const auditLog1 = await prisma.auditLog.create({
      data: {
        action: 'UPDATE',
        entityType: 'User',
        entityId: firstUser.id,
        userId: firstUser.id,
        oldValues: { role: 'ACCOUNTANT' },
        newValues: { role: 'AUDITOR' },
      },
    });
    console.log('✅ Test 1 passed:', auditLog1.id);

    // Test 2: Audit log with more fields
    console.log('\n=== Test 2: Creating audit log with multiple fields ===');
    const auditLog2 = await prisma.auditLog.create({
      data: {
        action: 'UPDATE',
        entityType: 'User',
        entityId: firstUser.id,
        userId: firstUser.id,
        oldValues: {
          name: 'Old Name',
          email: 'old@example.com',
          role: 'ACCOUNTANT',
        },
        newValues: {
          name: 'New Name',
          email: 'new@example.com',
          role: 'MANAGER',
        },
      },
    });
    console.log('✅ Test 2 passed:', auditLog2.id);

    // Clean up test data
    await prisma.auditLog.deleteMany({
      where: {
        id: {
          in: [auditLog1.id, auditLog2.id],
        },
      },
    });
    console.log('\n✅ Test data cleaned up');
    console.log('\n🎉 All tests passed! Prisma is working correctly.');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('\nFull error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testAuditLog();
