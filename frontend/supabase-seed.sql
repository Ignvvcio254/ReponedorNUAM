-- NUAM Tax Container System - Sample Data
-- Execute this SQL in your Supabase SQL Editor to populate with example data

-- Insert sample users
INSERT INTO "users" (id, email, name, role) VALUES
('user-admin-001', 'admin@nuam.com', 'Administrador NUAM', 'ADMIN'),
('user-analyst-002', 'analista@nuam.com', 'María González Analista', 'USER'),
('user-viewer-003', 'consultor@nuam.com', 'Carlos Mendoza Consultor', 'VIEWER'),
('user-operator-004', 'operador@nuam.com', 'Ana Rodríguez Operadora', 'USER'),
('user-manager-005', 'gerente@nuam.com', 'Luis Fernández Gerente', 'ADMIN');

-- Insert sample tax entities from different countries
INSERT INTO "tax_entities" (id, "businessName", "tradeName", "taxId", "entityType", country, state, city, address, "postalCode", "taxRegime", "economicActivity", "naicsCode", status, "registrationDate") VALUES
-- Chile
('entity-cl-001', 'Comercial Santiago S.A.', 'Santiago Store', '76.123.456-7', 'CORPORATION', 'CL', 'Región Metropolitana', 'Santiago', 'Av. Providencia 1234', '7510000', 'GENERAL', 'Comercio al por menor', '452110', 'ACTIVE', '2020-03-15T00:00:00Z'),

-- Perú  
('entity-pe-001', 'Distribuidora Lima E.I.R.L.', 'Lima Distribuidora', '20123456789', 'LLC', 'PE', 'Lima', 'Lima', 'Jr. Lampa 456', '15001', 'GENERAL', 'Distribución de productos', '423110', 'ACTIVE', '2019-08-22T00:00:00Z'),

-- Colombia
('entity-co-001', 'Inversiones Bogotá Ltda.', 'Bogotá Inversiones', '900.123.456-1', 'LLC', 'CO', 'Cundinamarca', 'Bogotá', 'Carrera 7 No. 71-21', '110231', 'SIMPLIFIED', 'Servicios financieros', '641110', 'ACTIVE', '2021-01-10T00:00:00Z'),

-- México
('entity-mx-001', 'Manufacturas Guadalajara S.A. de C.V.', 'Guadalajara Manufacturing', 'MGU123456789', 'CORPORATION', 'MX', 'Jalisco', 'Guadalajara', 'Av. Chapultepec 123', '44100', 'GENERAL', 'Manufactura textil', '313110', 'ACTIVE', '2018-11-05T00:00:00Z'),

-- Argentina
('entity-ar-001', 'Servicios Buenos Aires S.R.L.', 'BA Servicios', '30-12345678-9', 'LLC', 'AR', 'Buenos Aires', 'Ciudad de Buenos Aires', 'Av. Corrientes 1234', 'C1043', 'GENERAL', 'Servicios profesionales', '541110', 'ACTIVE', '2020-06-18T00:00:00Z');

-- Insert sample qualifications
INSERT INTO "qualifications" (id, "emisorName", "taxId", country, period, amount, currency, "calculatedValue", status, "processingDate", "approvalDate", observations, "userId") VALUES
-- Chile - UTM 64,649
('qual-cl-001', 'Comercial Santiago S.A.', '76.123.456-7', 'CL', '2024-08', 1500000.00, 'CLP', 23.20, 'APPROVED', '2024-08-15T10:30:00Z', '2024-08-16T14:20:00Z', 'Calificación aprobada sin observaciones', 'user-analyst-002'),
('qual-cl-002', 'Exportadora Valparaíso Ltda.', '96.789.123-4', 'CL', '2024-09', 2800000.00, 'CLP', 43.31, 'PENDING', '2024-09-10T09:15:00Z', NULL, 'Pendiente de documentación adicional', 'user-analyst-002'),

-- Perú - UIT 5,150
('qual-pe-001', 'Distribuidora Lima E.I.R.L.', '20123456789', 'PE', '2024-08', 85000.00, 'PEN', 16.50, 'APPROVED', '2024-08-20T11:45:00Z', '2024-08-21T16:30:00Z', 'Calificación procesada correctamente', 'user-analyst-002'),
('qual-pe-002', 'Minera Arequipa S.A.C.', '20987654321', 'PE', '2024-09', 180000.00, 'PEN', 34.95, 'DRAFT', NULL, NULL, 'En proceso de revisión inicial', 'user-operator-004'),

-- Colombia - UVT 42,412
('qual-co-001', 'Inversiones Bogotá Ltda.', '900.123.456-1', 'CO', '2024-08', 420000.00, 'COP', 9.90, 'APPROVED', '2024-08-25T13:20:00Z', '2024-08-26T10:15:00Z', 'Aprobada con todos los requisitos', 'user-analyst-002'),
('qual-co-002', 'Constructora Medellín S.A.S.', '901.234.567-8', 'CO', '2024-09', 890000.00, 'COP', 20.98, 'REJECTED', '2024-09-05T08:30:00Z', NULL, 'Documentación incompleta', 'user-operator-004'),

-- México - UMA 108.57
('qual-mx-001', 'Manufacturas Guadalajara S.A. de C.V.', 'MGU123456789', 'MX', '2024-08', 15000.00, 'MXN', 138.18, 'APPROVED', '2024-08-18T14:10:00Z', '2024-08-19T11:25:00Z', 'Procesamiento exitoso', 'user-analyst-002'),

-- Argentina - UF 25,000  
('qual-ar-001', 'Servicios Buenos Aires S.R.L.', '30-12345678-9', 'AR', '2024-08', 750000.00, 'ARS', 30.00, 'PENDING', '2024-08-28T16:45:00Z', NULL, 'En proceso de validación', 'user-operator-004');

-- Insert sample tax returns
INSERT INTO "tax_returns" (id, "taxEntityId", "taxYear", "taxPeriod", "periodType", "returnType", "formCode", "grossIncome", "taxableIncome", "taxOwed", "taxPaid", "currency", status, "filingDate", "dueDate") VALUES
-- Chile
('return-cl-001', 'entity-cl-001', 2024, '2024-Q2', 'QUARTERLY', 'VAT', 'F29', 45000000.00, 40000000.00, 7600000.00, 7600000.00, 'CLP', 'SUBMITTED', '2024-07-20T00:00:00Z', '2024-07-31T23:59:59Z'),

-- Perú
('return-pe-001', 'entity-pe-001', 2024, '2024-08', 'MONTHLY', 'VAT', 'PDT621', 2800000.00, 2500000.00, 450000.00, 450000.00, 'PEN', 'ACCEPTED', '2024-09-10T00:00:00Z', '2024-09-12T23:59:59Z'),

-- Colombia  
('return-co-001', 'entity-co-001', 2024, '2024-Q2', 'QUARTERLY', 'INCOME_TAX', 'F110', 15000000.00, 12000000.00, 3960000.00, 4000000.00, 'COP', 'SUBMITTED', '2024-07-25T00:00:00Z', '2024-07-31T23:59:59Z'),

-- México
('return-mx-001', 'entity-mx-001', 2024, '2024-08', 'MONTHLY', 'VAT', 'DIOT', 890000.00, 800000.00, 128000.00, 128000.00, 'MXN', 'ACCEPTED', '2024-09-08T00:00:00Z', '2024-09-17T23:59:59Z');

-- Insert sample tax payments  
INSERT INTO "tax_payments" (id, "taxReturnId", amount, currency, "paymentDate", "paymentMethod", "referenceNumber", "paymentType", description, verified) VALUES
('payment-001', 'return-cl-001', 7600000.00, 'CLP', '2024-07-30T00:00:00Z', 'BANK_TRANSFER', 'BT202407301234', 'TAX_PAYMENT', 'Pago IVA Q2 2024', true),
('payment-002', 'return-pe-001', 450000.00, 'PEN', '2024-09-11T00:00:00Z', 'ELECTRONIC', 'EP202409111567', 'TAX_PAYMENT', 'Pago IGV Agosto 2024', true),
('payment-003', 'return-co-001', 4000000.00, 'COP', '2024-07-29T00:00:00Z', 'BANK_TRANSFER', 'CO202407292890', 'TAX_PAYMENT', 'Pago Renta Q2 2024', true),
('payment-004', 'return-mx-001', 128000.00, 'MXN', '2024-09-15T00:00:00Z', 'ELECTRONIC', 'MX202409153445', 'TAX_PAYMENT', 'Pago IVA Agosto 2024', true);

-- Insert sample tax certificates
INSERT INTO "tax_certificates" (id, "taxEntityId", "certificateType", "certificateNumber", title, description, "issuedDate", "expirationDate", status, "issuedBy") VALUES
('cert-cl-001', 'entity-cl-001', 'TAX_COMPLIANCE', 'SII-TC-2024-001234', 'Certificado de Cumplimiento Tributario', 'Certifica que la entidad se encuentra al día en sus obligaciones tributarias', '2024-08-01T00:00:00Z', '2024-11-01T23:59:59Z', 'ACTIVE', 'SII Chile'),
('cert-pe-001', 'entity-pe-001', 'NO_DEBT', 'SUNAT-ND-2024-005678', 'Certificado de No Adeudo', 'Certifica que no existen deudas tributarias pendientes', '2024-08-15T00:00:00Z', '2024-11-15T23:59:59Z', 'ACTIVE', 'SUNAT Perú'),
('cert-co-001', 'entity-co-001', 'GOOD_STANDING', 'DIAN-GS-2024-009012', 'Certificado de Buen Contribuyente', 'Certifica el buen comportamiento tributario', '2024-07-20T00:00:00Z', '2025-07-20T23:59:59Z', 'ACTIVE', 'DIAN Colombia');

-- Insert sample audit processes
INSERT INTO "audit_processes" (id, "taxEntityId", "taxReturnId", "auditNumber", "auditType", scope, "startDate", "endDate", status, auditor, findings, recommendations) VALUES
('audit-001', 'entity-cl-001', 'return-cl-001', 'AUD-SII-2024-001', 'DESK_AUDIT', 'Revisión declaración IVA Q2 2024', '2024-08-01T00:00:00Z', '2024-08-15T00:00:00Z', 'COMPLETED', 'Inspector Juan Pérez', 'Sin hallazgos significativos', 'Mantener registro detallado de facturas'),
('audit-002', 'entity-pe-001', NULL, 'AUD-SUNAT-2024-002', 'RANDOM', 'Auditoría integral ejercicio 2023', '2024-07-15T00:00:00Z', NULL, 'IN_PROGRESS', 'Auditora María Silva', NULL, NULL);

-- Insert sample import batches
INSERT INTO "import_batches" (id, "fileName", "totalRecords", "processedRecords", "successfulRecords", "failedRecords", status, "userId") VALUES
('import-001', 'calificaciones_agosto_2024.csv', 150, 150, 148, 2, 'COMPLETED', 'user-analyst-002'),
('import-002', 'entidades_nuevas_septiembre.csv', 75, 75, 73, 2, 'COMPLETED', 'user-operator-004'),
('import-003', 'declaraciones_q2_2024.csv', 200, 180, 175, 5, 'PROCESSING', 'user-analyst-002');

-- Insert sample system configuration
INSERT INTO "system_config" (id, key, value, description) VALUES
('config-001', 'utm_chile_2024', '64649', 'Valor UTM Chile para 2024'),
('config-002', 'uit_peru_2024', '5150', 'Valor UIT Perú para 2024'),
('config-003', 'uvt_colombia_2024', '42412', 'Valor UVT Colombia para 2024'),
('config-004', 'uma_mexico_2024', '108.57', 'Valor UMA México para 2024'),
('config-005', 'max_file_size_mb', '50', 'Tamaño máximo de archivo en MB'),
('config-006', 'notification_email', 'admin@nuam.com', 'Email para notificaciones del sistema');

-- Insert sample audit logs
INSERT INTO "audit_logs" (id, action, "entityType", "entityId", "newValues", "userId", "qualificationId") VALUES
('log-001', 'CREATE', 'qualification', 'qual-cl-001', '{"status": "DRAFT", "amount": 1500000}', 'user-analyst-002', 'qual-cl-001'),
('log-002', 'UPDATE', 'qualification', 'qual-cl-001', '{"status": "APPROVED", "approvalDate": "2024-08-16T14:20:00Z"}', 'user-manager-005', 'qual-cl-001'),
('log-003', 'CREATE', 'tax_entity', 'entity-cl-001', '{"businessName": "Comercial Santiago S.A.", "country": "CL"}', 'user-admin-001', NULL),
('log-004', 'CREATE', 'qualification', 'qual-pe-001', '{"status": "DRAFT", "amount": 85000}', 'user-analyst-002', 'qual-pe-001'),
('log-005', 'UPDATE', 'qualification', 'qual-co-002', '{"status": "REJECTED", "rejectionReason": "Documentación incompleta"}', 'user-manager-005', 'qual-co-002');