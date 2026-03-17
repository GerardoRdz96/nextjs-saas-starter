-- =============================================================================
-- Next.js SaaS Starter — Supabase Schema
-- =============================================================================
-- Run this in the Supabase SQL Editor to set up your database.
-- =============================================================================

-- Enable UUID extension (usually enabled by default in Supabase)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ---------------------------------------------------------------------------
-- ENUM TYPES
-- ---------------------------------------------------------------------------

CREATE TYPE org_role AS ENUM ('owner', 'admin', 'member');
CREATE TYPE invite_role AS ENUM ('admin', 'member');

-- ---------------------------------------------------------------------------
-- PROFILES
-- ---------------------------------------------------------------------------
-- Automatically created when a user signs up via the trigger below.

CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  stripe_customer_id TEXT UNIQUE,
  subscription_status TEXT DEFAULT 'inactive',
  subscription_tier TEXT DEFAULT 'free',
  onboarding_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Users can read their own profile
CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Service role can insert (for trigger)
CREATE POLICY "Service role can insert profiles"
  ON profiles FOR INSERT
  WITH CHECK (TRUE);

-- ---------------------------------------------------------------------------
-- ORGANIZATIONS
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  logo_url TEXT,
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_customer_id TEXT UNIQUE,
  subscription_status TEXT,
  subscription_tier TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;

-- Members can view their organizations
CREATE POLICY "Members can view org"
  ON organizations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM org_members
      WHERE org_members.org_id = organizations.id
      AND org_members.user_id = auth.uid()
    )
  );

-- Authenticated users can create organizations
CREATE POLICY "Authenticated users can create orgs"
  ON organizations FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

-- Owners and admins can update organizations
CREATE POLICY "Owners and admins can update org"
  ON organizations FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM org_members
      WHERE org_members.org_id = organizations.id
      AND org_members.user_id = auth.uid()
      AND org_members.role IN ('owner', 'admin')
    )
  );

-- Only owners can delete organizations
CREATE POLICY "Only owners can delete org"
  ON organizations FOR DELETE
  USING (auth.uid() = owner_id);

-- ---------------------------------------------------------------------------
-- ORGANIZATION MEMBERS
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS org_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role org_role NOT NULL DEFAULT 'member',
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(org_id, user_id)
);

ALTER TABLE org_members ENABLE ROW LEVEL SECURITY;

-- Members can view other members in their org
CREATE POLICY "Members can view org members"
  ON org_members FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM org_members AS my_membership
      WHERE my_membership.org_id = org_members.org_id
      AND my_membership.user_id = auth.uid()
    )
  );

-- Owners and admins can add members
CREATE POLICY "Owners and admins can add members"
  ON org_members FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM org_members AS my_membership
      WHERE my_membership.org_id = org_members.org_id
      AND my_membership.user_id = auth.uid()
      AND my_membership.role IN ('owner', 'admin')
    )
    OR
    -- Allow the org creator to add themselves as owner
    auth.uid() = user_id
  );

-- Owners can modify members
CREATE POLICY "Owners can modify members"
  ON org_members FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM org_members AS my_membership
      WHERE my_membership.org_id = org_members.org_id
      AND my_membership.user_id = auth.uid()
      AND my_membership.role = 'owner'
    )
  );

-- Owners can remove members (members can remove themselves)
CREATE POLICY "Owners can remove members or self"
  ON org_members FOR DELETE
  USING (
    auth.uid() = user_id
    OR EXISTS (
      SELECT 1 FROM org_members AS my_membership
      WHERE my_membership.org_id = org_members.org_id
      AND my_membership.user_id = auth.uid()
      AND my_membership.role = 'owner'
    )
  );

-- ---------------------------------------------------------------------------
-- ORGANIZATION INVITES
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS org_invites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role invite_role NOT NULL DEFAULT 'member',
  invited_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  token UUID NOT NULL DEFAULT uuid_generate_v4(),
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '7 days'),
  accepted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(org_id, email)
);

ALTER TABLE org_invites ENABLE ROW LEVEL SECURITY;

-- Org admins/owners can view invites
CREATE POLICY "Admins can view invites"
  ON org_invites FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM org_members
      WHERE org_members.org_id = org_invites.org_id
      AND org_members.user_id = auth.uid()
      AND org_members.role IN ('owner', 'admin')
    )
  );

-- Admins/owners can create invites
CREATE POLICY "Admins can create invites"
  ON org_invites FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM org_members
      WHERE org_members.org_id = org_invites.org_id
      AND org_members.user_id = auth.uid()
      AND org_members.role IN ('owner', 'admin')
    )
  );

-- Admins/owners can delete invites
CREATE POLICY "Admins can delete invites"
  ON org_invites FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM org_members
      WHERE org_members.org_id = org_invites.org_id
      AND org_members.user_id = auth.uid()
      AND org_members.role IN ('owner', 'admin')
    )
  );

-- ---------------------------------------------------------------------------
-- ACTIVITY LOG
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS activity_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;

-- Members can view activity in their org
CREATE POLICY "Members can view org activity"
  ON activity_log FOR SELECT
  USING (
    org_id IS NULL AND user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM org_members
      WHERE org_members.org_id = activity_log.org_id
      AND org_members.user_id = auth.uid()
    )
  );

-- Authenticated users can insert activity
CREATE POLICY "Users can insert activity"
  ON activity_log FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- INDEXES
-- ---------------------------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_org_members_org_id ON org_members(org_id);
CREATE INDEX IF NOT EXISTS idx_org_members_user_id ON org_members(user_id);
CREATE INDEX IF NOT EXISTS idx_org_invites_token ON org_invites(token);
CREATE INDEX IF NOT EXISTS idx_org_invites_email ON org_invites(email);
CREATE INDEX IF NOT EXISTS idx_activity_log_org_id ON activity_log(org_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_created_at ON activity_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_stripe ON profiles(stripe_customer_id);

-- ---------------------------------------------------------------------------
-- TRIGGER: Auto-create profile on user signup
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if exists, then create
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
