/*
  # Simplify admin access control

  1. Changes
    - Remove all role-based checks
    - Use email-based admin verification
    - Simplify policy structure
  
  2. Security
    - Uses email for admin identification
    - Maintains RLS security
    - Preserves existing permissions
*/

-- Drop all existing policies to start fresh
DROP POLICY IF EXISTS "Public can view approved lawyers" ON lawyers;
DROP POLICY IF EXISTS "Admin full access" ON lawyers;
DROP POLICY IF EXISTS "Lawyers can manage own profile" ON lawyers;
DROP POLICY IF EXISTS "Anyone can view approved lawyers" ON lawyers;
DROP POLICY IF EXISTS "Users can create their profile" ON lawyers;
DROP POLICY IF EXISTS "Users can view own profile" ON lawyers;
DROP POLICY IF EXISTS "Admin can manage all profiles" ON lawyers;

-- Create simplified policies
-- Allow anyone to view approved lawyers
CREATE POLICY "view_approved_lawyers"
  ON lawyers
  FOR SELECT
  USING (approved = true);

-- Allow authenticated users to view their own profiles
CREATE POLICY "view_own_profile"
  ON lawyers
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Allow authenticated users to create their profile
CREATE POLICY "create_own_profile"
  ON lawyers
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Allow authenticated users to update their own profile
CREATE POLICY "update_own_profile"
  ON lawyers
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Admin policies (using email check)
CREATE POLICY "admin_select"
  ON lawyers
  FOR SELECT
  TO authenticated
  USING (auth.jwt() ->> 'email' = 'admin@iforum-lawyers.com');

CREATE POLICY "admin_insert"
  ON lawyers
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.jwt() ->> 'email' = 'admin@iforum-lawyers.com');

CREATE POLICY "admin_update"
  ON lawyers
  FOR UPDATE
  TO authenticated
  USING (auth.jwt() ->> 'email' = 'admin@iforum-lawyers.com')
  WITH CHECK (auth.jwt() ->> 'email' = 'admin@iforum-lawyers.com');

CREATE POLICY "admin_delete"
  ON lawyers
  FOR DELETE
  TO authenticated
  USING (auth.jwt() ->> 'email' = 'admin@iforum-lawyers.com');

-- Ensure proper grants are in place
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON lawyers TO authenticated;
GRANT USAGE ON SCHEMA public TO anon;
GRANT SELECT ON lawyers TO anon;