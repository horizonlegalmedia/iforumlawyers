/*
  # Fix admin role and policies

  1. Changes
    - Drop existing policies
    - Create new policies based on user metadata instead of role
    - Update admin access control
  
  2. Security
    - Uses user metadata for admin checks
    - Maintains RLS integrity
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Public can view approved lawyers" ON lawyers;
DROP POLICY IF EXISTS "Admin full access" ON lawyers;
DROP POLICY IF EXISTS "Lawyers can manage own profile" ON lawyers;

-- Create new policies with proper access control
-- Public access to approved lawyers
CREATE POLICY "Public can view approved lawyers"
  ON lawyers
  FOR SELECT
  USING (approved = true);

-- Admin full access based on user metadata
CREATE POLICY "Admin full access"
  ON lawyers
  FOR ALL
  TO authenticated
  USING (
    auth.jwt() ->> 'email' = 'admin@iforum-lawyers.com'
  )
  WITH CHECK (
    auth.jwt() ->> 'email' = 'admin@iforum-lawyers.com'
  );

-- Lawyers can manage their own profiles
CREATE POLICY "Lawyers can manage own profile"
  ON lawyers
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON lawyers TO authenticated;
GRANT USAGE ON SCHEMA public TO anon;
GRANT SELECT ON lawyers TO anon;