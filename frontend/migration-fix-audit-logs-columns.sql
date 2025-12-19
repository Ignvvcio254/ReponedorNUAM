-- Migration to fix audit_logs table column names
-- The columns 'old' and 'new' are SQL reserved words and cause issues
-- This renames them to 'old_values' and 'new_values'
-- Run this in Supabase SQL Editor

-- Check if old columns exist and rename them
DO $$
BEGIN
    -- Rename 'old' column to 'old_values' if it exists
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'audit_logs' 
        AND column_name = 'old'
    ) THEN
        ALTER TABLE audit_logs RENAME COLUMN "old" TO old_values;
        RAISE NOTICE 'Renamed column old to old_values';
    END IF;

    -- Rename 'new' column to 'new_values' if it exists
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'audit_logs' 
        AND column_name = 'new'
    ) THEN
        ALTER TABLE audit_logs RENAME COLUMN "new" TO new_values;
        RAISE NOTICE 'Renamed column new to new_values';
    END IF;

    -- Verify the columns now have the correct names
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'audit_logs' 
        AND column_name = 'old_values'
    ) THEN
        RAISE EXCEPTION 'Column old_values does not exist after migration';
    END IF;

    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'audit_logs' 
        AND column_name = 'new_values'
    ) THEN
        RAISE EXCEPTION 'Column new_values does not exist after migration';
    END IF;

    RAISE NOTICE 'Migration completed successfully';
END $$;

-- Show the current structure of audit_logs table
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'audit_logs'
ORDER BY ordinal_position;
