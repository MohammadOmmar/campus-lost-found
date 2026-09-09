-- Campus Lost & Found - Database Schema
-- Run this SQL in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- CAMPUSES
-- =============================================
CREATE TABLE campuses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- =============================================
-- PROFILES
-- =============================================
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text NOT NULL,
  avatar_url text,
  campus_id uuid NOT NULL REFERENCES campuses(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- =============================================
-- CATEGORIES
-- =============================================
CREATE TABLE categories (
  id serial PRIMARY KEY,
  name text NOT NULL UNIQUE,
  slug text NOT NULL UNIQUE
);

-- =============================================
-- ITEMS
-- =============================================
CREATE TABLE items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  campus_id uuid NOT NULL REFERENCES campuses(id),
  title text NOT NULL CHECK (char_length(title) >= 3 AND char_length(title) <= 100),
  description text NOT NULL CHECK (char_length(description) >= 10 AND char_length(description) <= 1000),
  category text NOT NULL,
  type text NOT NULL CHECK (type IN ('LOST', 'FOUND')),
  status text NOT NULL DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'CLAIMED', 'RETURNED', 'CLOSED')),
  location text NOT NULL CHECK (char_length(location) >= 2 AND char_length(location) <= 200),
  date_lost_found date NOT NULL,
  image_url text,
  private_verification text CHECK (char_length(private_verification) <= 500),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- =============================================
-- CLAIMS
-- =============================================
CREATE TABLE claims (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id uuid NOT NULL REFERENCES items(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  proof text NOT NULL CHECK (char_length(proof) >= 20 AND char_length(proof) <= 500),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (item_id, user_id)
);

-- =============================================
-- INDEXES
-- =============================================
CREATE INDEX idx_profiles_campus ON profiles(campus_id);
CREATE INDEX idx_items_campus ON items(campus_id);
CREATE INDEX idx_items_status ON items(status);
CREATE INDEX idx_items_type ON items(type);
CREATE INDEX idx_items_category ON items(category);
CREATE INDEX idx_items_user ON items(user_id);
CREATE INDEX idx_items_created ON items(created_at DESC);
CREATE INDEX idx_items_type_status ON items(type, status);
CREATE INDEX idx_claims_item ON claims(item_id);
CREATE INDEX idx_claims_user ON claims(user_id);
CREATE INDEX idx_claims_status ON claims(status);
CREATE INDEX idx_claims_item_user ON claims(item_id, user_id);

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================
ALTER TABLE campuses ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE items ENABLE ROW LEVEL SECURITY;
ALTER TABLE claims ENABLE ROW LEVEL SECURITY;

-- Campuses: Public read
CREATE POLICY "Campuses are publicly visible" ON campuses
  FOR SELECT USING (true);

-- Profiles: Owner only
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Categories: Public read
CREATE POLICY "Categories are publicly visible" ON categories
  FOR SELECT USING (true);

-- Items: Public read of non-sensitive columns, owner write
-- NOTE: private_verification must NEVER be readable through the public policy.
-- Owners read their private notes via the item_private_details view below.
CREATE POLICY "Items are publicly visible" ON items
  FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create items" ON items
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own items" ON items
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own items" ON items
  FOR DELETE USING (auth.uid() = user_id);

-- Revoke direct column-level access to private_verification from anon/authenticated.
-- Owners regain access through item_private_details; all public code paths
-- must select explicit public columns (never SELECT *).
REVOKE SELECT (private_verification) ON items FROM anon;
REVOKE SELECT (private_verification) ON items FROM authenticated;

-- Private verification detail: owner-only view.
-- RLS on the base table still applies (row must belong to the caller).
CREATE OR REPLACE VIEW item_private_details AS
SELECT id, private_verification
FROM items
WHERE user_id = auth.uid();

GRANT SELECT ON item_private_details TO authenticated;

-- Claims: Owner and item owner only (proof is PRIVATE)
CREATE POLICY "Users can view own claims" ON claims
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Item owners can view claims on their items" ON claims
  FOR SELECT USING (
    auth.uid() IN (SELECT user_id FROM items WHERE items.id = claims.item_id)
  );
CREATE POLICY "Authenticated users can create claims" ON claims
  FOR INSERT WITH CHECK (auth.uid() = user_id);
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
-- =============================================
-- TRIGGER: Auto-create profile on signup
-- =============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  default_campus_id uuid;
BEGIN
  SELECT id INTO default_campus_id FROM public.campuses LIMIT 1;
  
  INSERT INTO public.profiles (id, email, full_name, campus_id)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    default_campus_id
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================
-- TRIGGER: Update updated_at timestamp
-- =============================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_items_updated_at
  BEFORE UPDATE ON items
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_claims_updated_at
  BEFORE UPDATE ON claims
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================
-- VIEW: Owner-only private verification details
-- Only the item owner can read private_verification.
-- All UI must use explicit public column lists on `items`;
-- this view is the ONLY path to the private note.
-- =============================================
CREATE OR REPLACE VIEW item_private_details AS
SELECT id, user_id, private_verification
FROM items
WHERE private_verification IS NOT NULL
  AND user_id = auth.uid();

-- =============================================
-- FUNCTION: Enforce claim eligibility at the DB layer
-- Mirrors Server Action checks (defense in depth).
-- =============================================
CREATE OR REPLACE FUNCTION public.enforce_claim_rules()
RETURNS trigger AS $$
DECLARE
  v_type text;
  v_status text;
  v_owner uuid;
BEGIN
  SELECT type, status, user_id INTO v_type, v_status, v_owner
  FROM public.items WHERE id = NEW.item_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Item not found.';
  END IF;

  IF v_type <> 'FOUND' THEN
    RAISE EXCEPTION 'Only found items can be claimed.';
  END IF;

  IF v_status <> 'OPEN' THEN
    RAISE EXCEPTION 'This item is not accepting claims.';
  END IF;

  IF v_owner = NEW.user_id THEN
    RAISE EXCEPTION 'You cannot claim your own item.';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_enforce_claim_rules ON claims;
CREATE TRIGGER trg_enforce_claim_rules
  BEFORE INSERT ON claims
  FOR EACH ROW EXECUTE FUNCTION public.enforce_claim_rules();

-- =============================================
-- FUNCTION: Enforce legal item state transitions
-- OPEN -> CLAIMED | CLOSED ; CLAIMED -> RETURNED ; terminal states locked.
-- =============================================
CREATE OR REPLACE FUNCTION public.enforce_item_transition()
RETURNS trigger AS $$
BEGIN
  IF OLD.status = NEW.status THEN
    RETURN NEW;
  END IF;

  IF OLD.status = 'OPEN' AND NEW.status IN ('CLAIMED', 'CLOSED') THEN
    RETURN NEW;
  END IF;

  IF OLD.status = 'CLAIMED' AND NEW.status = 'RETURNED' THEN
    RETURN NEW;
  END IF;

  RAISE EXCEPTION 'Invalid item status transition: % -> %', OLD.status, NEW.status;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_enforce_item_transition ON items;
CREATE TRIGGER trg_enforce_item_transition
  BEFORE UPDATE OF status ON items
  FOR EACH ROW EXECUTE FUNCTION public.enforce_item_transition();

-- =============================================
-- SEED DATA
-- =============================================
INSERT INTO campuses (name, slug) VALUES ('University of Example', 'university-of-example') ON CONFLICT (slug) DO NOTHING;
INSERT INTO categories (name, slug) VALUES
  ('Electronics', 'electronics'),
  ('Keys', 'keys'),
  ('ID Cards', 'id-cards'),
  ('Bags & Backpacks', 'bags'),
  ('Clothing', 'clothing'),
  ('Books & Notebooks', 'books'),
  ('Jewelry & Watches', 'jewelry'),
  ('Other', 'other');

-- =============================================
-- RLS POLICIES: claims
-- =============================================

-- Authenticated users may submit claims (trigger enforces eligibility)
CREATE POLICY "Authenticated users can submit claims" ON claims
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can read their own claims
CREATE POLICY "Users can read own claims" ON claims
  FOR SELECT USING (auth.uid() = user_id);

-- Item owners can read claims submitted against their items
CREATE POLICY "Item owners can read claims on their items" ON claims
  FOR SELECT USING (
    auth.uid() IN (SELECT user_id FROM items WHERE items.id = claims.item_id)
  );

-- Users can update their own pending claims (proof edits before review)
CREATE POLICY "Users can update own pending claims" ON claims
  FOR UPDATE USING (auth.uid() = user_id AND status = 'pending');

-- Item owners can update claim status (approve / reject)
CREATE POLICY "Item owners can update claim status" ON claims
  FOR UPDATE USING (
    auth.uid() IN (SELECT user_id FROM items WHERE items.id = claims.item_id)
  );

