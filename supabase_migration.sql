-- ============================================================
-- SUPABASE MIGRATION SCRIPT
-- Sagit Faturrakhman — AI Laboratory Portfolio
-- MULTI-ITEM CMS & SECURE ADMIN AUTHORIZATION
-- ============================================================

-- 1. Ensure Storage Bucket Exists & is Public
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('portfolio-images', 'portfolio-images', true, 20971520, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'])
ON CONFLICT (id) DO UPDATE 
SET public = true,
    file_size_limit = 20971520;

-- 2. Admin Users Table (Explicit Admin Authorization)
CREATE TABLE IF NOT EXISTS public.admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  role text DEFAULT 'admin',
  created_at timestamptz DEFAULT timezone('utc'::text, now())
);

-- 3. Robust is_admin() Function
-- Checks:
-- a) Is user's auth.uid() in admin_users?
-- b) Is user's email in admin_users?
-- c) Does user's JWT contain app_metadata.role = 'admin'?
-- d) Does user's JWT contain user_metadata.is_admin = true or role = 'admin'?
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
DECLARE
  jwt_email text;
  jwt_role text;
  jwt_app_role text;
  jwt_is_admin text;
BEGIN
  -- If not logged in, definitely not admin
  IF auth.uid() IS NULL THEN
    RETURN false;
  END IF;

  -- Check admin_users table by user_id or id
  IF EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE user_id = auth.uid() OR id = auth.uid()
  ) THEN
    RETURN true;
  END IF;

  -- Extract JWT claims safely
  jwt_email := lower(COALESCE(auth.jwt() ->> 'email', ''));
  jwt_app_role := lower(COALESCE(auth.jwt() -> 'app_metadata' ->> 'role', ''));
  jwt_role := lower(COALESCE(auth.jwt() -> 'user_metadata' ->> 'role', ''));
  jwt_is_admin := lower(COALESCE(auth.jwt() -> 'user_metadata' ->> 'is_admin', ''));

  -- Check admin_users table by email
  IF jwt_email <> '' AND EXISTS (
    SELECT 1 FROM public.admin_users WHERE lower(email) = jwt_email
  ) THEN
    RETURN true;
  END IF;

  -- Check JWT roles
  IF jwt_app_role = 'admin' OR jwt_role = 'admin' OR jwt_is_admin = 'true' THEN
    RETURN true;
  END IF;

  RETURN false;
END;
$$;

-- Helper to quickly authorize an admin by email
CREATE OR REPLACE FUNCTION public.add_admin_by_email(target_email text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  matched_user_id uuid;
BEGIN
  SELECT id INTO matched_user_id FROM auth.users WHERE lower(email) = lower(target_email);
  INSERT INTO public.admin_users (id, user_id, email, role)
  VALUES (COALESCE(matched_user_id, gen_random_uuid()), matched_user_id, lower(target_email), 'admin')
  ON CONFLICT (email) DO UPDATE 
  SET user_id = EXCLUDED.user_id, role = 'admin';
END;
$$;

-- 4. Certificates Table (Multi-Item Verified Credentials)
CREATE TABLE IF NOT EXISTS public.certificates (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title text NOT NULL,
  issuer text,
  category text DEFAULT 'CERTIFICATION',
  issued_date text DEFAULT '2024',
  credential_id text DEFAULT '',
  credential_url text DEFAULT '',
  description text DEFAULT '',
  image_url text NOT NULL,
  storage_path text,
  status text DEFAULT 'published',
  display_order int DEFAULT 0,
  created_at timestamptz DEFAULT timezone('utc'::text, now()),
  updated_at timestamptz DEFAULT timezone('utc'::text, now())
);

-- 5. Visual Gallery Table (Multi-Item Screenshots & Interface Captures)
CREATE TABLE IF NOT EXISTS public.gallery (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title text NOT NULL,
  description text DEFAULT '',
  image_url text NOT NULL,
  storage_path text,
  category text DEFAULT 'GALLERY',
  display_order int DEFAULT 0,
  status text DEFAULT 'published',
  created_at timestamptz DEFAULT timezone('utc'::text, now()),
  updated_at timestamptz DEFAULT timezone('utc'::text, now())
);

-- 6. Activities & Documentation Table (Preserve existing schema & enhance)
CREATE TABLE IF NOT EXISTS public.activities (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title text NOT NULL,
  organization text DEFAULT '',
  category text DEFAULT 'WORKSHOP',
  date text DEFAULT '',
  image_url text,
  description text DEFAULT '',
  storage_path text,
  status text DEFAULT 'published',
  display_order int DEFAULT 0,
  created_at timestamptz DEFAULT timezone('utc'::text, now()),
  updated_at timestamptz DEFAULT timezone('utc'::text, now())
);

-- Ensure columns exist in activities if table was already present
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'activities' AND column_name = 'storage_path') THEN
    ALTER TABLE public.activities ADD COLUMN storage_path text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'activities' AND column_name = 'status') THEN
    ALTER TABLE public.activities ADD COLUMN status text DEFAULT 'published';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'activities' AND column_name = 'display_order') THEN
    ALTER TABLE public.activities ADD COLUMN display_order int DEFAULT 0;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'activities' AND column_name = 'updated_at') THEN
    ALTER TABLE public.activities ADD COLUMN updated_at timestamptz DEFAULT timezone('utc'::text, now());
  END IF;
END $$;

-- 7. Projects Table (Preserve existing schema & enhance)
CREATE TABLE IF NOT EXISTS public.projects (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  main_title text,
  subtitle text DEFAULT '',
  description text DEFAULT '',
  image_url text DEFAULT '',
  project_url text DEFAULT '',
  title text DEFAULT '',
  slug text DEFAULT '',
  category text DEFAULT 'PROJECT',
  status text DEFAULT 'LIVE SYSTEM',
  technologies text DEFAULT '',
  ai_features text DEFAULT '',
  role text DEFAULT '',
  live_url text DEFAULT '',
  documentation_url text DEFAULT '',
  cover_image text DEFAULT '',
  storage_path text,
  display_order int DEFAULT 0,
  created_at timestamptz DEFAULT timezone('utc'::text, now()),
  updated_at timestamptz DEFAULT timezone('utc'::text, now())
);

-- Ensure columns exist in projects if table was already present
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'title') THEN
    ALTER TABLE public.projects ADD COLUMN title text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'slug') THEN
    ALTER TABLE public.projects ADD COLUMN slug text DEFAULT '';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'category') THEN
    ALTER TABLE public.projects ADD COLUMN category text DEFAULT 'PROJECT';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'status') THEN
    ALTER TABLE public.projects ADD COLUMN status text DEFAULT 'LIVE SYSTEM';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'technologies') THEN
    ALTER TABLE public.projects ADD COLUMN technologies text DEFAULT '';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'ai_features') THEN
    ALTER TABLE public.projects ADD COLUMN ai_features text DEFAULT '';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'role') THEN
    ALTER TABLE public.projects ADD COLUMN role text DEFAULT '';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'live_url') THEN
    ALTER TABLE public.projects ADD COLUMN live_url text DEFAULT '';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'documentation_url') THEN
    ALTER TABLE public.projects ADD COLUMN documentation_url text DEFAULT '';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'cover_image') THEN
    ALTER TABLE public.projects ADD COLUMN cover_image text DEFAULT '';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'storage_path') THEN
    ALTER TABLE public.projects ADD COLUMN storage_path text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'display_order') THEN
    ALTER TABLE public.projects ADD COLUMN display_order int DEFAULT 0;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'created_at') THEN
    ALTER TABLE public.projects ADD COLUMN created_at timestamptz DEFAULT timezone('utc'::text, now());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'updated_at') THEN
    ALTER TABLE public.projects ADD COLUMN updated_at timestamptz DEFAULT timezone('utc'::text, now());
  END IF;
END $$;

-- 8. Enable Row Level Security (RLS) on All Tables
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- 9. Setup Strict RLS Policies
-- Drop older policies to ensure clean state
DROP POLICY IF EXISTS "Public Read Certificates" ON public.certificates;
DROP POLICY IF EXISTS "Admin Insert Certificates" ON public.certificates;
DROP POLICY IF EXISTS "Admin Update Certificates" ON public.certificates;
DROP POLICY IF EXISTS "Admin Delete Certificates" ON public.certificates;

DROP POLICY IF EXISTS "Public Read Gallery" ON public.gallery;
DROP POLICY IF EXISTS "Admin Insert Gallery" ON public.gallery;
DROP POLICY IF EXISTS "Admin Update Gallery" ON public.gallery;
DROP POLICY IF EXISTS "Admin Delete Gallery" ON public.gallery;

DROP POLICY IF EXISTS "Public Read Activities" ON public.activities;
DROP POLICY IF EXISTS "Admin Insert Activities" ON public.activities;
DROP POLICY IF EXISTS "Admin Update Activities" ON public.activities;
DROP POLICY IF EXISTS "Admin Delete Activities" ON public.activities;

DROP POLICY IF EXISTS "Public Read Projects" ON public.projects;
DROP POLICY IF EXISTS "Admin Insert Projects" ON public.projects;
DROP POLICY IF EXISTS "Admin Update Projects" ON public.projects;
DROP POLICY IF EXISTS "Admin Delete Projects" ON public.projects;

DROP POLICY IF EXISTS "Admin Read Users" ON public.admin_users;

-- A) admin_users policies
CREATE POLICY "Admin Read Users" ON public.admin_users
  FOR SELECT TO authenticated
  USING (public.is_admin() OR id = auth.uid() OR user_id = auth.uid());

-- B) certificates policies
-- Public can only READ published items
CREATE POLICY "Public Read Certificates" ON public.certificates
  FOR SELECT
  USING (status = 'published' OR public.is_admin());

-- Only authorized Admin can INSERT, UPDATE, DELETE
CREATE POLICY "Admin Insert Certificates" ON public.certificates
  FOR INSERT TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "Admin Update Certificates" ON public.certificates
  FOR UPDATE TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admin Delete Certificates" ON public.certificates
  FOR DELETE TO authenticated
  USING (public.is_admin());

-- C) gallery policies
CREATE POLICY "Public Read Gallery" ON public.gallery
  FOR SELECT
  USING (status = 'published' OR public.is_admin());

CREATE POLICY "Admin Insert Gallery" ON public.gallery
  FOR INSERT TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "Admin Update Gallery" ON public.gallery
  FOR UPDATE TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admin Delete Gallery" ON public.gallery
  FOR DELETE TO authenticated
  USING (public.is_admin());

-- D) activities policies
CREATE POLICY "Public Read Activities" ON public.activities
  FOR SELECT
  USING (status = 'published' OR public.is_admin());

CREATE POLICY "Admin Insert Activities" ON public.activities
  FOR INSERT TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "Admin Update Activities" ON public.activities
  FOR UPDATE TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admin Delete Activities" ON public.activities
  FOR DELETE TO authenticated
  USING (public.is_admin());

-- E) projects policies
CREATE POLICY "Public Read Projects" ON public.projects
  FOR SELECT
  USING (status = 'published' OR public.is_admin());

CREATE POLICY "Admin Insert Projects" ON public.projects
  FOR INSERT TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "Admin Update Projects" ON public.projects
  FOR UPDATE TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admin Delete Projects" ON public.projects
  FOR DELETE TO authenticated
  USING (public.is_admin());

-- 10. Storage Policies on storage.objects for 'portfolio-images'
DROP POLICY IF EXISTS "Public Read Portfolio Images" ON storage.objects;
DROP POLICY IF EXISTS "Admin Upload Portfolio Images" ON storage.objects;
DROP POLICY IF EXISTS "Admin Update Portfolio Images" ON storage.objects;
DROP POLICY IF EXISTS "Admin Delete Portfolio Images" ON storage.objects;

-- Public can VIEW/READ images freely
CREATE POLICY "Public Read Portfolio Images" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'portfolio-images');

-- ONLY verified Admin can UPLOAD (INSERT)
CREATE POLICY "Admin Upload Portfolio Images" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'portfolio-images' AND public.is_admin());

-- ONLY verified Admin can UPDATE (Replace)
CREATE POLICY "Admin Update Portfolio Images" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'portfolio-images' AND public.is_admin())
  WITH CHECK (bucket_id = 'portfolio-images' AND public.is_admin());

-- ONLY verified Admin can DELETE
CREATE POLICY "Admin Delete Portfolio Images" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'portfolio-images' AND public.is_admin());

-- 11. Realtime Publication
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'certificates'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.certificates;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'gallery'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.gallery;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'activities'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.activities;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'projects'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.projects;
  END IF;
EXCEPTION
  WHEN OTHERS THEN
    NULL; -- Silently ignore if already in publication
END $$;