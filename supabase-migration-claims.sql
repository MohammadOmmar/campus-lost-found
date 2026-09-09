-- ============================================================================
-- MIGRATION: claim status casing + private_verification column protection
-- Run AFTER the base schema if the database already exists.
-- Safe to run on a fresh database too (guards with DO blocks).
-- ============================================================================

-- 1) Normalize any existing lowercase claim statuses to uppercase.
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'claims') THEN
    UPDATE claims SET status = UPPER(status) WHERE status <> UPPER(status);
  END IF;
END $$;

-- 2) Update the claims status CHECK to uppercase values.
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'claims') THEN
    ALTER TABLE claims DROP CONSTRAINT IF EXISTS claims_status_check;
    ALTER TABLE claims
      ADD CONSTRAINT claims_status_check CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED'));
    ALTER TABLE claims ALTER COLUMN status SET DEFAULT 'PENDING';
  END IF;
END $$;

-- 3) Rebuild claims UPDATE policies with WITH CHECK guards.
DROP POLICY IF EXISTS "Claimants can update own pending claims" ON claims;
DROP POLICY IF EXISTS "Users can update own pending claims" ON claims;
DROP POLICY IF EXISTS "Item owners can update claim status" ON claims;

CREATE POLICY "Claimants can update own pending claims" ON claims
  FOR UPDATE USING (auth.uid() = user_id AND status = 'PENDING')
  WITH CHECK (auth.uid() = user_id AND status = 'PENDING');

CREATE POLICY "Item owners can update claim status" ON claims
  FOR UPDATE USING (
    auth.uid() IN (SELECT user_id FROM items WHERE items.id = claims.item_id)
  )
  WITH CHECK (
    auth.uid() IN (SELECT user_id FROM items WHERE items.id = claims.item_id)
    AND status IN ('APPROVED', 'REJECTED')
  );

-- 4) Hide private_verification from everyone except the item owner.
--    Postgres RLS is row-level; this enforces column-level privacy through a
--    security-barrier view + column privileges. Application code reads public
--    item data through public.items_public and private notes via the base table.
DROP VIEW IF EXISTS public.items_public;

CREATE VIEW public.items_public
WITH (security_barrier = true) AS
SELECT
  id,
  user_id,
  campus_id,
  title,
  description,
  category,
  type,
  status,
  location,
  date_lost_found,
  image_url,
  created_at,
  updated_at
FROM public.items;

ALTER VIEW public.items_public OWNER TO postgres;
GRANT SELECT ON public.items_public TO anon, authenticated;

-- Direct SELECT on the base items table is restricted to the item owner
-- (plus the service role used by Server Actions for eligibility checks).
DROP POLICY IF EXISTS "Items are publicly visible" ON items;
DROP POLICY IF EXISTS "Item owners can read private verification" ON items;

CREATE POLICY "Item owners can read own items" ON items
  FOR SELECT USING (auth.uid() = user_id);
