-- Migration: Move private_verification into an owner-only table.
-- Run this in the Supabase SQL Editor AFTER the base supabase-schema.sql.
-- Safe to re-run (idempotent guards included).

-- 1. Create the owner-only table
CREATE TABLE IF NOT EXISTS item_private_details (
  item_id uuid PRIMARY KEY REFERENCES items(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  private_verification text NOT NULL CHECK (char_length(private_verification) <= 500),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 2. Backfill from existing items.private_verification (if the column still exists)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'items' AND column_name = 'private_verification'
  ) THEN
    INSERT INTO item_private_details (item_id, user_id, private_verification)
    SELECT id, user_id, private_verification FROM items
    WHERE private_verification IS NOT NULL AND private_verification <> ''
    ON CONFLICT (item_id) DO UPDATE SET
      private_verification = EXCLUDED.private_verification,
      updated_at = now();
  END IF;
END $$;

-- 3. Enable RLS + owner-only policies
ALTER TABLE item_private_details ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Owners can view private details" ON item_private_details;
CREATE POLICY "Owners can view private details" ON item_private_details
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Owners can insert private details" ON item_private_details;
CREATE POLICY "Owners can insert private details" ON item_private_details
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Owners can update private details" ON item_private_details;
CREATE POLICY "Owners can update private details" ON item_private_details
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Owners can delete private details" ON item_private_details;
CREATE POLICY "Owners can delete private details" ON item_private_details
  FOR DELETE USING (auth.uid() = user_id);

-- 4. updated_at trigger
DROP TRIGGER IF EXISTS update_item_private_details_updated_at ON item_private_details;
CREATE TRIGGER update_item_private_details_updated_at
  BEFORE UPDATE ON item_private_details
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 5. Drop the column from items (PostgREST can no longer expose it at all)
ALTER TABLE items DROP COLUMN IF EXISTS private_verification;
