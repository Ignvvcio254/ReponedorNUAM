-- NUAM Tax Container System - Simple Database Schema
-- Execute this SQL in your Supabase SQL Editor (without RLS for now)

-- Create Enums
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'USER', 'VIEWER');
CREATE TYPE "Country" AS ENUM ('CL', 'PE', 'CO', 'MX', 'AR', 'BR', 'UY', 'PY', 'BO', 'EC', 'VE', 'PA', 'CR', 'GT', 'US');
CREATE TYPE "QualificationStatus" AS ENUM ('DRAFT', 'PENDING', 'APPROVED', 'REJECTED', 'EXPIRED');
CREATE TYPE "ImportStatus" AS ENUM ('PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED');
CREATE TYPE "EntityType" AS ENUM ('CORPORATION', 'LLC', 'PARTNERSHIP', 'SOLE_PROPRIETOR', 'NGO', 'GOVERNMENT', 'FOREIGN');
CREATE TYPE "EntityStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED', 'DISSOLVED', 'UNDER_AUDIT');
CREATE TYPE "TaxRegime" AS ENUM ('GENERAL', 'SIMPLIFIED', 'SPECIAL', 'EXEMPT', 'SMALL_BUSINESS', 'MONOTAX', 'SIMPLES');
CREATE TYPE "PeriodType" AS ENUM ('ANNUAL', 'QUARTERLY', 'MONTHLY', 'BIMONTHLY', 'WEEKLY');
CREATE TYPE "ReturnType" AS ENUM ('INCOME_TAX', 'VAT', 'PAYROLL_TAX', 'PROPERTY_TAX', 'EXCISE_TAX', 'CUSTOMS', 'SOCIAL_SECURITY', 'OTHER');
CREATE TYPE "ReturnStatus" AS ENUM ('DRAFT', 'READY', 'SUBMITTED', 'ACCEPTED', 'REJECTED', 'UNDER_REVIEW', 'AMENDED', 'AUDIT');
CREATE TYPE "ObligationStatus" AS ENUM ('ACTIVE', 'SUSPENDED', 'COMPLETED', 'CANCELLED');
CREATE TYPE "PaymentMethod" AS ENUM ('BANK_TRANSFER', 'CREDIT_CARD', 'DEBIT_CARD', 'CHECK', 'CASH', 'ELECTRONIC', 'OFFSET');
CREATE TYPE "PaymentType" AS ENUM ('TAX_PAYMENT', 'PENALTY', 'INTEREST', 'INSTALLMENT', 'ADVANCE', 'REFUND');
CREATE TYPE "AdjustmentType" AS ENUM ('CORRECTION', 'AMENDMENT', 'REASSESSMENT', 'PENALTY_WAIVER', 'INTEREST_WAIVER');
CREATE TYPE "CertificateType" AS ENUM ('TAX_COMPLIANCE', 'NO_DEBT', 'GOOD_STANDING', 'WITHHOLDING_AGENT', 'TAX_RESIDENCE', 'EXEMPT_STATUS', 'REGISTRATION');
CREATE TYPE "CertificateStatus" AS ENUM ('ACTIVE', 'EXPIRED', 'REVOKED', 'SUSPENDED', 'PENDING_RENEWAL');
CREATE TYPE "AuditType" AS ENUM ('DESK_AUDIT', 'FIELD_AUDIT', 'CORRESPONDENCE', 'RANDOM', 'TARGETED', 'FOLLOW_UP');
CREATE TYPE "AuditStatus" AS ENUM ('INITIATED', 'IN_PROGRESS', 'PENDING_RESPONSE', 'UNDER_REVIEW', 'COMPLETED', 'APPEALED', 'CLOSED');

-- Create Tables
CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "email" TEXT NOT NULL UNIQUE,
    "name" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "qualifications" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "emisorName" TEXT NOT NULL,
    "taxId" TEXT,
    "country" "Country" NOT NULL,
    "period" TEXT NOT NULL,
    "amount" DECIMAL(15,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "calculatedValue" DECIMAL(15,6),
    "status" "QualificationStatus" NOT NULL DEFAULT 'DRAFT',
    "processingDate" TIMESTAMP(3),
    "approvalDate" TIMESTAMP(3),
    "rejectionReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "observations" TEXT,
    "documentUrl" TEXT,
    "userId" TEXT NOT NULL REFERENCES "users"("id") ON DELETE CASCADE
);

CREATE TABLE "import_batches" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "fileName" TEXT NOT NULL,
    "totalRecords" INTEGER NOT NULL,
    "processedRecords" INTEGER NOT NULL DEFAULT 0,
    "successfulRecords" INTEGER NOT NULL DEFAULT 0,
    "failedRecords" INTEGER NOT NULL DEFAULT 0,
    "status" "ImportStatus" NOT NULL DEFAULT 'PROCESSING',
    "errors" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL REFERENCES "users"("id") ON DELETE CASCADE
);

CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "action" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "oldValues" JSONB,
    "newValues" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT REFERENCES "users"("id") ON DELETE SET NULL,
    "qualificationId" TEXT REFERENCES "qualifications"("id") ON DELETE CASCADE
);

CREATE TABLE "system_config" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "key" TEXT NOT NULL UNIQUE,
    "value" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "tax_entities" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "businessName" TEXT NOT NULL,
    "tradeName" TEXT,
    "taxId" TEXT NOT NULL UNIQUE,
    "entityType" "EntityType" NOT NULL,
    "country" "Country" NOT NULL,
    "state" TEXT,
    "city" TEXT,
    "address" TEXT,
    "postalCode" TEXT,
    "taxRegime" "TaxRegime" NOT NULL,
    "economicActivity" TEXT,
    "naicsCode" TEXT,
    "status" "EntityStatus" NOT NULL DEFAULT 'ACTIVE',
    "registrationDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "tax_returns" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "taxEntityId" TEXT NOT NULL REFERENCES "tax_entities"("id") ON DELETE CASCADE,
    "taxYear" INTEGER NOT NULL,
    "taxPeriod" TEXT NOT NULL,
    "periodType" "PeriodType" NOT NULL,
    "returnType" "ReturnType" NOT NULL,
    "formCode" TEXT,
    "grossIncome" DECIMAL(15,2),
    "taxableIncome" DECIMAL(15,2),
    "taxOwed" DECIMAL(15,2),
    "taxPaid" DECIMAL(15,2),
    "taxRefund" DECIMAL(15,2),
    "penalties" DECIMAL(15,2),
    "interest" DECIMAL(15,2),
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "status" "ReturnStatus" NOT NULL DEFAULT 'DRAFT',
    "filingDate" TIMESTAMP(3),
    "dueDate" TIMESTAMP(3) NOT NULL,
    "extensionDate" TIMESTAMP(3),
    "originalDocument" TEXT,
    "processedDocument" TEXT,
    "attachments" JSONB,
    "validationScore" DECIMAL(3,2),
    "requiresReview" BOOLEAN NOT NULL DEFAULT false,
    "reviewNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "submittedAt" TIMESTAMP(3),
    UNIQUE("taxEntityId", "taxYear", "taxPeriod", "returnType")
);

CREATE TABLE "tax_obligations" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "taxEntityId" TEXT NOT NULL REFERENCES "tax_entities"("id") ON DELETE CASCADE,
    "obligationType" "ReturnType" NOT NULL,
    "description" TEXT NOT NULL,
    "frequency" "PeriodType" NOT NULL,
    "dueDay" INTEGER,
    "dueMonth" INTEGER,
    "status" "ObligationStatus" NOT NULL DEFAULT 'ACTIVE',
    "autoGenerate" BOOLEAN NOT NULL DEFAULT false,
    "reminderDays" INTEGER NOT NULL DEFAULT 7,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "tax_payments" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "taxReturnId" TEXT REFERENCES "tax_returns"("id") ON DELETE SET NULL,
    "amount" DECIMAL(15,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "paymentDate" TIMESTAMP(3) NOT NULL,
    "paymentMethod" "PaymentMethod" NOT NULL,
    "referenceNumber" TEXT,
    "paymentType" "PaymentType" NOT NULL,
    "description" TEXT,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "verificationDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "tax_adjustments" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "taxReturnId" TEXT NOT NULL REFERENCES "tax_returns"("id") ON DELETE CASCADE,
    "adjustmentType" "AdjustmentType" NOT NULL,
    "reason" TEXT NOT NULL,
    "originalAmount" DECIMAL(15,2) NOT NULL,
    "adjustedAmount" DECIMAL(15,2) NOT NULL,
    "difference" DECIMAL(15,2) NOT NULL,
    "adjustmentDate" TIMESTAMP(3) NOT NULL,
    "effectiveDate" TIMESTAMP(3),
    "approvedBy" TEXT,
    "approvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "tax_certificates" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "taxEntityId" TEXT NOT NULL REFERENCES "tax_entities"("id") ON DELETE CASCADE,
    "certificateType" "CertificateType" NOT NULL,
    "certificateNumber" TEXT NOT NULL UNIQUE,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "issuedDate" TIMESTAMP(3) NOT NULL,
    "expirationDate" TIMESTAMP(3),
    "status" "CertificateStatus" NOT NULL DEFAULT 'ACTIVE',
    "documentUrl" TEXT,
    "digitalSignature" TEXT,
    "issuedBy" TEXT,
    "verificationCode" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "audit_processes" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "taxEntityId" TEXT NOT NULL REFERENCES "tax_entities"("id") ON DELETE CASCADE,
    "taxReturnId" TEXT REFERENCES "tax_returns"("id") ON DELETE SET NULL,
    "auditNumber" TEXT NOT NULL UNIQUE,
    "auditType" "AuditType" NOT NULL,
    "scope" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "notificationDate" TIMESTAMP(3),
    "status" "AuditStatus" NOT NULL DEFAULT 'INITIATED',
    "auditor" TEXT,
    "team" JSONB,
    "findings" TEXT,
    "recommendations" TEXT,
    "additionalTax" DECIMAL(15,2),
    "penalties" DECIMAL(15,2),
    "interest" DECIMAL(15,2),
    "documents" JSONB,
    "finalReport" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create Indexes for Performance
CREATE INDEX "idx_qualifications_country" ON "qualifications"("country");
CREATE INDEX "idx_qualifications_status" ON "qualifications"("status");
CREATE INDEX "idx_qualifications_userId" ON "qualifications"("userId");
CREATE INDEX "idx_qualifications_createdAt" ON "qualifications"("createdAt");

CREATE INDEX "idx_tax_entities_country" ON "tax_entities"("country");
CREATE INDEX "idx_tax_entities_status" ON "tax_entities"("status");
CREATE INDEX "idx_tax_entities_entityType" ON "tax_entities"("entityType");

CREATE INDEX "idx_tax_returns_taxEntityId" ON "tax_returns"("taxEntityId");
CREATE INDEX "idx_tax_returns_status" ON "tax_returns"("status");
CREATE INDEX "idx_tax_returns_dueDate" ON "tax_returns"("dueDate");
CREATE INDEX "idx_tax_returns_taxYear" ON "tax_returns"("taxYear");

CREATE INDEX "idx_tax_payments_taxReturnId" ON "tax_payments"("taxReturnId");
CREATE INDEX "idx_tax_payments_paymentDate" ON "tax_payments"("paymentDate");
CREATE INDEX "idx_tax_payments_verified" ON "tax_payments"("verified");

CREATE INDEX "idx_audit_processes_taxEntityId" ON "audit_processes"("taxEntityId");
CREATE INDEX "idx_audit_processes_status" ON "audit_processes"("status");
CREATE INDEX "idx_audit_processes_startDate" ON "audit_processes"("startDate");

CREATE INDEX "idx_import_batches_userId" ON "import_batches"("userId");
CREATE INDEX "idx_import_batches_status" ON "import_batches"("status");
CREATE INDEX "idx_import_batches_createdAt" ON "import_batches"("createdAt");

-- Create Functions for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updatedAt = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create Triggers for auto-updating updatedAt
CREATE TRIGGER update_users_updatedAt BEFORE UPDATE ON "users" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_qualifications_updatedAt BEFORE UPDATE ON "qualifications" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_import_batches_updatedAt BEFORE UPDATE ON "import_batches" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_system_config_updatedAt BEFORE UPDATE ON "system_config" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tax_entities_updatedAt BEFORE UPDATE ON "tax_entities" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tax_returns_updatedAt BEFORE UPDATE ON "tax_returns" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tax_obligations_updatedAt BEFORE UPDATE ON "tax_obligations" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tax_payments_updatedAt BEFORE UPDATE ON "tax_payments" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tax_certificates_updatedAt BEFORE UPDATE ON "tax_certificates" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_audit_processes_updatedAt BEFORE UPDATE ON "audit_processes" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();