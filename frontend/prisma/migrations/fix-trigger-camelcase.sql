-- Migration: Fix update_updated_at_column trigger to use quoted column names
-- Date: 2025-12-19
-- Problem: Trigger function was using unquoted NEW.updatedAt which PostgreSQL
--          converted to lowercase "updatedat", causing "column new does not exist" error
-- Solution: Use quoted NEW."updatedAt" to preserve camelCase column name

-- Drop the old function (CASCADE will drop dependent triggers)
DROP FUNCTION IF EXISTS public.update_updated_at_column() CASCADE;

-- Create the corrected function with quoted column name
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW."updatedAt" = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$;

-- Recreate the trigger on users table
CREATE TRIGGER update_users_updatedat
BEFORE UPDATE ON public.users
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Verify the fix
DO $$
DECLARE
  test_id text;
  test_role text;
BEGIN
  -- Get first user
  SELECT id, role INTO test_id, test_role FROM public.users LIMIT 1;

  IF test_id IS NOT NULL THEN
    -- Test UPDATE (set role to current value - no actual change)
    UPDATE public.users
    SET role = test_role::text::"UserRole"
    WHERE id = test_id;

    RAISE NOTICE 'Trigger test passed - UPDATE successful';
  ELSE
    RAISE NOTICE 'No users found for testing';
  END IF;
END;
$$;
