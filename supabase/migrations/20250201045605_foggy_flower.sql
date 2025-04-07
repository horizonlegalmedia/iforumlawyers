/*
  # Fix admin permissions and access

  1. Changes
    - Drop existing policies
    - Create new policies with proper admin role checks
    - Add explicit policies for admin operations
  
  2. Security
    - Maintains RLS
    - Ensures proper admin access
    - Preserves public and lawyer access
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Public can view approved lawyers" ON lawyers;
DROP POLICY IF EXISTS "Admin can view and manage lawyers" ON lawyers;
DROP POLICY IF EXISTS "Lawyers can manage own profile" ON lawyers;

-- Create new policies with proper access control
-- Public access to approved lawyers
CREATE POLICY "Public can view approved lawyers"
  ON lawyers
  FOR SELECT
  TO anon, authenticated
  USING (approved = true);

-- Admin full access
CREATE POLICY "Admin full access"
  ON lawyers
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.email IN (
        'admin@example.com'  -- Replace with actual admin email
      )
    )
  );

-- Lawyers can manage their own profiles
CREATE POLICY "Lawyers can manage own profile"
  ON lawyers
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Grant necessary permissions to authenticated users
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON lawyers TO authenticated;

-- Grant read access to public users
GRANT USAGE ON SCHEMA public TO anon;
GRANT SELECT ON lawyers TO anon;