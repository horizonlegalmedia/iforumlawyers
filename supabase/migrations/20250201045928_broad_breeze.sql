/*
  # Final cleanup of admin policies
  
  1. Changes
    - Remove any remaining role references
    - Ensure consistent email-based admin checks
    - Clean up and simplify policies
  
  2. Security
    - Uses email-based admin verification
    - Maintains RLS security
    - Preserves existing permissions
*/

-- Drop all existing policies to start fresh
DROP POLICY IF EXISTS "view_approved_lawyers" ON lawyers;
DROP POLICY IF EXISTS "view_own_profile" ON lawyers;
DROP POLICY IF EXISTS "create_own_profile" ON lawyers;
DROP POLICY IF EXISTS "update_own_profile" ON lawyers;
DROP POLICY IF EXISTS "admin_select" ON lawyers;
DROP POLICY IF EXISTS "admin_insert" ON lawyers;
DROP POLICY IF EXISTS "admin_update" ON lawyers;
DROP POLICY IF EXISTS "admin_delete" ON lawyers;

-- Public access to approved lawyers
CREATE POLICY "public_view_approved"
  ON lawyers
  FOR SELECT
  USING (approved = true);

-- Authenticated user policies
CREATE POLICY "user_view_own"
  ON lawyers
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "user_create_own"
  ON lawyers
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "user_update_own"
  ON lawyers
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Admin policies (using email only, no role checks)
CREATE POLICY "admin_view_all"
  ON lawyers
  FOR SELECT
  TO authenticated
  USING (
    CASE 
      WHEN auth.jwt() ->> 'email' = 'admin@iforum-lawyers.com' THEN true
      ELSE approved = true OR auth.uid() = user_id
    END
  );

CREATE POLICY "admin_manage"
  ON lawyers
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'email' = 'admin@iforum-lawyers.com')
  WITH CHECK (auth.jwt() ->> 'email' = 'admin@iforum-lawyers.com');

-- Reset grants
REVOKE ALL ON lawyers FROM authenticated;
REVOKE ALL ON lawyers FROM anon;

GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON lawyers TO authenticated;
GRANT USAGE ON SCHEMA public TO anon;
GRANT SELECT ON lawyers TO anon;