import { PrismaClient } from '../generated/prisma'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seeding completo del Contenedor Tributario NUAM...')

  // ===== USUARIOS =====
  // Hash passwords for demo users (not for production use)
  const demoPassword = await hash('Demo123!NUAM', 12)

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@nuam.com' },
    update: {},
    create: {
      id: 'admin-nuam-001',
      email: 'admin@nuam.com',
      name: 'Administrador NUAM',
      password: demoPassword,
      role: 'ADMIN',
      emailVerified: new Date(),
      isActive: true,
    }
  })

  const regularUser = await prisma.user.upsert({
    where: { email: 'usuario@nuam.com' },
    update: {},
    create: {
      id: 'user-nuam-002',
      email: 'usuario@nuam.com',
      name: 'Usuario Regular',
      password: demoPassword,
      role: 'ACCOUNTANT',
      emailVerified: new Date(),
      isActive: true,
    }
  })

  const viewerUser = await prisma.user.upsert({
    where: { email: 'auditor@nuam.com' },
    update: {},
    create: {
      id: 'auditor-nuam-003',
      email: 'auditor@nuam.com',
      name: 'Auditor NUAM',
      password: demoPassword,
      role: 'AUDITOR',
      emailVerified: new Date(),
      isActive: true,
    }
  })

  console.log('👥 Usuarios creados: Admin, Accountant, Auditor')
  console.log('🔑 Password para todos: Demo123!NUAM')

  // ===== ENTIDADES TRIBUTARIAS =====
  const taxEntities = await Promise.all([
    // Entidades de Chile
    prisma.taxEntity.create({
      data: {
        id: 'entity-cl-001',
        businessName: 'Minera Los Andes S.A.',
        tradeName: 'Los Andes Mining',
        taxId: '76.123.456-7',
        entityType: 'CORPORATION',
        country: 'CL',
        state: 'Región Metropolitana',
        city: 'Santiago',
        address: 'Av. Providencia 1234, Las Condes',
        postalCode: '7550000',
        taxRegime: 'GENERAL',
        economicActivity: 'Extracción de cobre',
        naicsCode: '212234',
        status: 'ACTIVE',
        registrationDate: new Date('2020-03-15')
      }
    }),

    // Entidades de Perú  
    prisma.taxEntity.create({
      data: {
        id: 'entity-pe-001',
        businessName: 'Textiles Peruanos S.A.C.',
        tradeName: 'TexPeru',
        taxId: '20123456789',
        entityType: 'CORPORATION',
        country: 'PE',
        state: 'Lima',
        city: 'Lima',
        address: 'Jr. de la Unión 123, Centro de Lima',
        postalCode: '15001',
        taxRegime: 'GENERAL',
        economicActivity: 'Fabricación de textiles',
        naicsCode: '313210',
        status: 'ACTIVE',
        registrationDate: new Date('2019-08-20')
      }
    }),

    // Entidades de Colombia
    prisma.taxEntity.create({
      data: {
        id: 'entity-co-001',
        businessName: 'Café Colombiano Exportadores S.A.S.',
        tradeName: 'CafeColombia',
        taxId: '900123456-1',
        entityType: 'CORPORATION',
        country: 'CO',
        state: 'Cundinamarca',
        city: 'Bogotá',
        address: 'Carrera 7 # 123-45, Chapinero',
        postalCode: '110111',
        taxRegime: 'GENERAL',
        economicActivity: 'Exportación de café',
        naicsCode: '111320',
        status: 'ACTIVE',
        registrationDate: new Date('2018-12-10')
      }
    }),

    // Entidad Pequeña Empresa
    prisma.taxEntity.create({
      data: {
        id: 'entity-mx-001',
        businessName: 'Consulting Services México S. de R.L.',
        tradeName: 'ConsulMex',
        taxId: 'CSM180515ABC',
        entityType: 'LLC',
        country: 'MX',
        state: 'Ciudad de México',
        city: 'México D.F.',
        address: 'Paseo de la Reforma 456, Juárez',
        postalCode: '06600',
        taxRegime: 'SMALL_BUSINESS',
        economicActivity: 'Servicios de consultoría empresarial',
        naicsCode: '541611',
        status: 'ACTIVE',
        registrationDate: new Date('2021-05-15')
      }
    }),

    // Entidad en Auditoría
    prisma.taxEntity.create({
      data: {
        id: 'entity-br-001',
        businessName: 'Indústria Brasileira de Tecnologia Ltda.',
        tradeName: 'BrazilTech',
        taxId: '12.345.678/0001-90',
        entityType: 'LLC',
        country: 'BR',
        state: 'São Paulo',
        city: 'São Paulo',
        address: 'Av. Paulista 1000, Bela Vista',
        postalCode: '01310-100',
        taxRegime: 'SIMPLES',
        economicActivity: 'Desenvolvimento de software',
        naicsCode: '541511',
        status: 'UNDER_AUDIT',
        registrationDate: new Date('2017-11-03')
      }
    })
  ])

  console.log('Entidades tributarias creadas:', taxEntities.length)

  // ===== DECLARACIONES DE IMPUESTOS =====
  const taxReturns = await Promise.all([
    // Declaración de Renta - Chile
    prisma.taxReturn.create({
      data: {
        id: 'return-cl-001',
        taxEntityId: taxEntities[0].id,
        taxYear: 2024,
        taxPeriod: '2024',
        periodType: 'ANNUAL',
        returnType: 'INCOME_TAX',
        formCode: '22',
        grossIncome: 5000000.00,
        taxableIncome: 4500000.00,
        taxOwed: 675000.00,
        taxPaid: 600000.00,
        taxRefund: 0.00,
        penalties: 15000.00,
        interest: 2500.00,
        currency: 'CLP',
        status: 'SUBMITTED',
        filingDate: new Date('2024-04-30'),
        dueDate: new Date('2024-04-30'),
        validationScore: 0.95,
        requiresReview: false
      }
    }),

    // Declaración IVA - Perú
    prisma.taxReturn.create({
      data: {
        id: 'return-pe-001',
        taxEntityId: taxEntities[1].id,
        taxYear: 2024,
        taxPeriod: '2024-12',
        periodType: 'MONTHLY',
        returnType: 'VAT',
        formCode: '621',
        grossIncome: 850000.00,
        taxableIncome: 850000.00,
        taxOwed: 153000.00,
        taxPaid: 150000.00,
        taxRefund: 0.00,
        penalties: 0.00,
        interest: 0.00,
        currency: 'PEN',
        status: 'ACCEPTED',
        filingDate: new Date('2024-01-15'),
        dueDate: new Date('2024-01-20'),
        validationScore: 0.98,
        requiresReview: false
      }
    }),

    // Declaración en Borrador - Colombia
    prisma.taxReturn.create({
      data: {
        id: 'return-co-001',
        taxEntityId: taxEntities[2].id,
        taxYear: 2024,
        taxPeriod: '2024-Q4',
        periodType: 'QUARTERLY',
        returnType: 'INCOME_TAX',
        formCode: '110',
        grossIncome: 2500000.00,
        taxableIncome: 2200000.00,
        taxOwed: 550000.00,
        currency: 'COP',
        status: 'DRAFT',
        dueDate: new Date('2025-01-31'),
        validationScore: 0.75,
        requiresReview: true,
        reviewNotes: 'Verificar deducciones de exportación'
      }
    }),

    // Declaración Rechazada
    prisma.taxReturn.create({
      data: {
        id: 'return-mx-001',
        taxEntityId: taxEntities[3].id,
        taxYear: 2024,
        taxPeriod: '2024-11',
        periodType: 'MONTHLY',
        returnType: 'VAT',
        formCode: 'A-29',
        grossIncome: 180000.00,
        taxableIncome: 180000.00,
        taxOwed: 28800.00,
        currency: 'MXN',
        status: 'REJECTED',
        filingDate: new Date('2024-12-15'),
        dueDate: new Date('2024-12-17'),
        validationScore: 0.60,
        requiresReview: true,
        reviewNotes: 'Inconsistencias en facturas de proveedores'
      }
    })
  ])

  console.log('Declaraciones de impuestos creadas:', taxReturns.length)

  // ===== PAGOS TRIBUTARIOS =====
  const taxPayments = await Promise.all([
    prisma.taxPayment.create({
      data: {
        taxReturnId: taxReturns[0].id,
        amount: 600000.00,
        currency: 'CLP',
        paymentDate: new Date('2024-04-25'),
        paymentMethod: 'BANK_TRANSFER',
        referenceNumber: 'TRX-CL-240425-001',
        paymentType: 'TAX_PAYMENT',
        description: 'Pago impuesto a la renta 2024',
        verified: true,
        verificationDate: new Date('2024-04-26')
      }
    }),

    prisma.taxPayment.create({
      data: {
        taxReturnId: taxReturns[0].id,
        amount: 15000.00,
        currency: 'CLP',
        paymentDate: new Date('2024-05-15'),
        paymentMethod: 'ELECTRONIC',
        referenceNumber: 'PEN-CL-240515-001',
        paymentType: 'PENALTY',
        description: 'Multa por presentación tardía',
        verified: true,
        verificationDate: new Date('2024-05-15')
      }
    }),

    prisma.taxPayment.create({
      data: {
        taxReturnId: taxReturns[1].id,
        amount: 150000.00,
        currency: 'PEN',
        paymentDate: new Date('2024-01-18'),
        paymentMethod: 'BANK_TRANSFER',
        referenceNumber: 'IGV-PE-240118-001',
        paymentType: 'TAX_PAYMENT',
        description: 'Pago IGV diciembre 2024',
        verified: true,
        verificationDate: new Date('2024-01-19')
      }
    })
  ])

  console.log('Pagos tributarios creados:', taxPayments.length)

  // ===== OBLIGACIONES TRIBUTARIAS =====
  const taxObligations = await Promise.all([
    prisma.taxObligation.create({
      data: {
        taxEntityId: taxEntities[0].id,
        obligationType: 'INCOME_TAX',
        description: 'Declaración Anual de Impuesto a la Renta',
        frequency: 'ANNUAL',
        dueDay: 30,
        dueMonth: 4,
        status: 'ACTIVE',
        autoGenerate: true,
        reminderDays: 30
      }
    }),

    prisma.taxObligation.create({
      data: {
        taxEntityId: taxEntities[1].id,
        obligationType: 'VAT',
        description: 'Declaración Mensual de IGV',
        frequency: 'MONTHLY',
        dueDay: 20,
        status: 'ACTIVE',
        autoGenerate: true,
        reminderDays: 5
      }
    }),

    prisma.taxObligation.create({
      data: {
        taxEntityId: taxEntities[2].id,
        obligationType: 'INCOME_TAX',
        description: 'Declaración Trimestral de Renta',
        frequency: 'QUARTERLY',
        dueDay: 31,
        status: 'ACTIVE',
        autoGenerate: false,
        reminderDays: 15
      }
    })
  ])

  console.log('Obligaciones tributarias creadas:', taxObligations.length)

  // ===== CERTIFICADOS TRIBUTARIOS =====
  const taxCertificates = await Promise.all([
    prisma.taxCertificate.create({
      data: {
        taxEntityId: taxEntities[0].id,
        certificateType: 'TAX_COMPLIANCE',
        certificateNumber: 'CERT-CL-2024-001',
        title: 'Certificado de Cumplimiento Tributario',
        description: 'Certifica el cumplimiento de obligaciones tributarias al 31/12/2023',
        issuedDate: new Date('2024-01-15'),
        expirationDate: new Date('2024-12-31'),
        status: 'ACTIVE',
        issuedBy: 'Servicio de Impuestos Internos - Chile',
        verificationCode: 'SII-CC-240115-789'
      }
    }),

    prisma.taxCertificate.create({
      data: {
        taxEntityId: taxEntities[1].id,
        certificateType: 'NO_DEBT',
        certificateNumber: 'CERT-PE-2024-002',
        title: 'Certificado de No Adeudo',
        description: 'Certifica que no mantiene deudas tributarias pendientes',
        issuedDate: new Date('2024-02-20'),
        expirationDate: new Date('2024-08-20'),
        status: 'ACTIVE',
        issuedBy: 'SUNAT - Perú',
        verificationCode: 'SUNAT-NA-240220-456'
      }
    }),

    prisma.taxCertificate.create({
      data: {
        taxEntityId: taxEntities[4].id,
        certificateType: 'GOOD_STANDING',
        certificateNumber: 'CERT-BR-2024-003',
        title: 'Certidão de Regularidade Fiscal',
        description: 'Certifica situação regular perante a Receita Federal',
        issuedDate: new Date('2024-03-10'),
        expirationDate: new Date('2024-09-10'),
        status: 'SUSPENDED',
        issuedBy: 'Receita Federal - Brasil',
        verificationCode: 'RFB-CRF-240310-123'
      }
    })
  ])

  console.log('📜 Certificados tributarios creados:', taxCertificates.length)

  // ===== PROCESOS DE AUDITORÍA =====
  const auditProcesses = await Promise.all([
    prisma.auditProcess.create({
      data: {
        taxEntityId: taxEntities[4].id, // BrazilTech en auditoría
        taxReturnId: null,
        auditNumber: 'AUD-BR-2024-001',
        auditType: 'FIELD_AUDIT',
        scope: 'Revisión integral de declaraciones 2022-2024, enfoque en deducciones de I+D',
        startDate: new Date('2024-09-15'),
        notificationDate: new Date('2024-09-01'),
        status: 'IN_PROGRESS',
        auditor: 'Maria Silva Santos',
        team: ['João Oliveira', 'Ana Costa'],
        findings: 'Identificadas inconsistencias en clasificación de gastos de desarrollo de software como gastos de I+D. Revisión de contratos con terceros.',
        recommendations: 'Regularizar clasificación de gastos. Presentar documentación de soporte de proyectos de I+D.',
        additionalTax: 125000.00,
        penalties: 62500.00,
        interest: 18750.00
      }
    }),

    prisma.auditProcess.create({
      data: {
        taxEntityId: taxEntities[2].id, // CafeColombia
        auditNumber: 'AUD-CO-2024-002',
        auditType: 'DESK_AUDIT',
        scope: 'Verificación de deducciones por exportaciones 2023',
        startDate: new Date('2024-11-01'),
        endDate: new Date('2024-11-30'),
        notificationDate: new Date('2024-10-15'),
        status: 'COMPLETED',
        auditor: 'Carlos Rodríguez Mendoza',
        findings: 'Documentación de exportaciones completa y correcta. Deducciones aplicadas apropiadamente.',
        recommendations: 'Mantener archivo organizado de documentos de exportación.',
        additionalTax: 0.00,
        penalties: 0.00,
        interest: 0.00
      }
    })
  ])

  console.log('Procesos de auditoría creados:', auditProcesses.length)

  // ===== AJUSTES TRIBUTARIOS =====
  const taxAdjustments = await Promise.all([
    prisma.taxAdjustment.create({
      data: {
        taxReturnId: taxReturns[0].id,
        adjustmentType: 'CORRECTION',
        reason: 'Corrección en cálculo de depreciación de maquinaria minera',
        originalAmount: 675000.00,
        adjustedAmount: 692500.00,
        difference: 17500.00,
        adjustmentDate: new Date('2024-06-15'),
        effectiveDate: new Date('2024-06-15'),
        approvedBy: 'Sistema Automatizado',
        approvedAt: new Date('2024-06-15')
      }
    }),

    prisma.taxAdjustment.create({
      data: {
        taxReturnId: taxReturns[1].id,
        adjustmentType: 'PENALTY_WAIVER',
        reason: 'Condonación de multa por primera infracción y buen historial',
        originalAmount: 5000.00,
        adjustedAmount: 0.00,
        difference: -5000.00,
        adjustmentDate: new Date('2024-03-20'),
        effectiveDate: new Date('2024-03-20'),
        approvedBy: 'Ana García - Supervisor',
        approvedAt: new Date('2024-03-22')
      }
    })
  ])

  console.log('🔧 Ajustes tributarios creados:', taxAdjustments.length)

  // ===== CONFIGURACIÓN DEL SISTEMA =====
  const systemConfigs = await Promise.all([
    prisma.systemConfig.upsert({
      where: { key: 'tax_rate_income_cl' },
      update: { value: '25.0' },
      create: {
        key: 'tax_rate_income_cl',
        value: '25.0',
        description: 'Tasa impuesto a la renta Chile (%)'
      }
    }),

    prisma.systemConfig.upsert({
      where: { key: 'tax_rate_vat_pe' },
      update: { value: '18.0' },
      create: {
        key: 'tax_rate_vat_pe',
        value: '18.0', 
        description: 'Tasa IGV Perú (%)'
      }
    }),

    prisma.systemConfig.upsert({
      where: { key: 'audit_threshold_usd' },
      update: { value: '1000000' },
      create: {
        key: 'audit_threshold_usd',
        value: '1000000',
        description: 'Umbral para auditoría automática (USD)'
      }
    }),

    prisma.systemConfig.upsert({
      where: { key: 'max_import_size' },
      update: { value: '50000' },
      create: {
        key: 'max_import_size',
        value: '50000',
        description: 'Máximo registros por importación masiva'
      }
    }),

    prisma.systemConfig.upsert({
      where: { key: 'system_timezone' },
      update: { value: 'America/Santiago' },
      create: {
        key: 'system_timezone',
        value: 'America/Santiago',
        description: 'Zona horaria del sistema'
      }
    })
  ])

  console.log('Configuraciones del sistema creadas:', systemConfigs.length)

  // ===== LOGS DE AUDITORÍA =====
  const auditLogs = await Promise.all([
    prisma.auditLog.create({
      data: {
        action: 'CREATE',
        entityType: 'tax_entity',
        entityId: taxEntities[0].id,
        newValues: {
          businessName: taxEntities[0].businessName,
          taxId: taxEntities[0].taxId,
          status: taxEntities[0].status
        },
        userId: adminUser.id
      }
    }),

    prisma.auditLog.create({
      data: {
        action: 'UPDATE',
        entityType: 'tax_return',
        entityId: taxReturns[0].id,
        oldValues: { status: 'DRAFT' },
        newValues: { status: 'SUBMITTED' },
        userId: regularUser.id
      }
    }),

    prisma.auditLog.create({
      data: {
        action: 'CREATE',
        entityType: 'tax_payment',
        entityId: taxPayments[0].id,
        newValues: {
          amount: taxPayments[0].amount,
          paymentMethod: taxPayments[0].paymentMethod,
          verified: taxPayments[0].verified
        },
        userId: adminUser.id
      }
    })
  ])

  console.log('Logs de auditoría creados:', auditLogs.length)

  // ===== LOTES DE IMPORTACIÓN =====
  const importBatches = await Promise.all([
    prisma.importBatch.create({
      data: {
        fileName: 'declaraciones_chile_2024_q4.xlsx',
        totalRecords: 2500,
        processedRecords: 2500,
        successfulRecords: 2487,
        failedRecords: 13,
        status: 'COMPLETED',
        errors: {
          failed_rows: [45, 156, 789, 1023, 1456, 1789, 2001, 2134, 2267, 2345, 2456, 2478, 2499],
          error_types: ['missing_tax_id', 'invalid_amount', 'invalid_date_format']
        },
        userId: adminUser.id
      }
    }),

    prisma.importBatch.create({
      data: {
        fileName: 'pagos_peru_enero_2024.csv',
        totalRecords: 1200,
        processedRecords: 856,
        successfulRecords: 834,
        failedRecords: 22,
        status: 'PROCESSING',
        errors: {
          failed_rows: [12, 45, 78, 156, 234, 345, 456, 567, 678, 789, 834, 845],
          error_types: ['duplicate_reference', 'invalid_currency', 'amount_mismatch']
        },
        userId: regularUser.id
      }
    })
  ])

  console.log('📤 Lotes de importación creados:', importBatches.length)

  // ===== CALIFICACIONES ORIGINALES (LEGACY) =====
  const qualifications = await Promise.all([
    prisma.qualification.create({
      data: {
        emisorName: taxEntities[0].businessName,
        taxId: taxEntities[0].taxId,
        country: taxEntities[0].country,
        period: '2024-Q4',
        amount: 1500000.50,
        currency: 'CLP',
        calculatedValue: 0.876543,
        status: 'APPROVED',
        userId: adminUser.id,
        observations: 'Migrado del sistema legacy - Calificación aprobada'
      }
    }),

    prisma.qualification.create({
      data: {
        emisorName: taxEntities[1].businessName,
        taxId: taxEntities[1].taxId,
        country: taxEntities[1].country,
        period: '2024-Q4',
        amount: 850000.75,
        currency: 'PEN',
        calculatedValue: 0.654321,
        status: 'PENDING',
        userId: regularUser.id,
        observations: 'Pendiente de validación con nuevo sistema'
      }
    })
  ])

  console.log('Calificaciones legacy migradas:', qualifications.length)

  // ===== RESUMEN FINAL =====
  console.log('\nSeeding del Contenedor Tributario NUAM completado exitosamente!')
  console.log('\nRESUMEN DE DATOS CREADOS:')
  console.log(`   • ${3} Usuarios (Admin, User, Viewer)`)
  console.log(`   • ${taxEntities.length} Entidades Tributarias`)
  console.log(`   • ${taxReturns.length} Declaraciones de Impuestos`)  
  console.log(`   • ${taxPayments.length} Pagos Tributarios`)
  console.log(`   • ${taxObligations.length} Obligaciones Tributarias`)
  console.log(`   • ${taxCertificates.length} Certificados Tributarios`)
  console.log(`   • ${auditProcesses.length} Procesos de Auditoría`)
  console.log(`   • ${taxAdjustments.length} Ajustes Tributarios`)
  console.log(`   • ${systemConfigs.length} Configuraciones del Sistema`)
  console.log(`   • ${auditLogs.length} Logs de Auditoría`)
  console.log(`   • ${importBatches.length} Lotes de Importación`)
  console.log(`   • ${qualifications.length} Calificaciones Legacy`)
  
  console.log('\nPAÍSES REPRESENTADOS:')
  console.log('   • Chile: Minera Los Andes S.A.')
  console.log('   • Perú: Textiles Peruanos S.A.C.')
  console.log('   • Colombia: Café Colombiano Exportadores S.A.S.')
  console.log('   • México: Consulting Services México S. de R.L.')
  console.log('   • Brasil: Indústria Brasileira de Tecnologia Ltda.')
  
  console.log('\nCASOS DE USO INCLUIDOS:')
  console.log('   • Entidades activas en diferentes regímenes')
  console.log('   • Declaraciones en múltiples estados')
  console.log('   • Proceso de auditoría en curso')
  console.log('   • Pagos verificados y pendientes')
  console.log('   • Certificados vigentes y suspendidos')
  console.log('   • Importaciones exitosas y con errores')
  
  console.log('\nBase de datos lista para pruebas del contenedor tributario!')
}

main()
  .catch((e) => {
    console.error('Error durante el seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })