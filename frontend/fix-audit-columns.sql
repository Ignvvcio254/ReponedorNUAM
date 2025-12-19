-- Migration: Rename audit_logs columns from snake_case to camelCase
-- This fixes the Prisma client mismatch in production

-- Rename columns to match Prisma's expected camelCase format
ALTER TABLE audit_logs RENAME COLUMN entity_type TO "entityType";
ALTER TABLE audit_logs RENAME COLUMN entity_id TO "entityId";
ALTER TABLE audit_logs RENAME COLUMN old_values TO "oldValues";
ALTER TABLE audit_logs RENAME COLUMN new_values TO "newValues";
ALTER TABLE audit_logs RENAME COLUMN created_at TO "createdAt";
ALTER TABLE audit_logs RENAME COLUMN user_id TO "userId";
ALTER TABLE audit_logs RENAME COLUMN qualification_id TO "qualificationId";

-- Verify the changes
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'audit_logs'
ORDER BY ordinal_position;
