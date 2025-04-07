/*
  # Fix directory permissions for lawyers table

  1. Changes
    - Drop existing policies
    - Create simplified policies with proper public access
    - Ensure proper access for both public and authenticated users
  
  2. Security
    - Maintains RLS
    - Ensures public can view approved lawyers
    - Preserves admin and lawyer access
*/

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Public can view approved lawyers" ON lawyers;
DROP POLICY IF EXISTS "Admin can view all lawyers" ON lawyers;
DROP POLICY IF EXISTS "Admin can update lawyers" ON lawyers;
DROP POLICY IF EXISTS "Lawyers can view own profile" ON lawyers;

-- Create simplified policies
-- Public access to approved lawyers (no auth required)
CREATE POLICY "Public can view approved lawyers"
  ON lawyers
  FOR SELECT
  TO anon, authenticated
  USING (approved = true);

-- Admin access to all lawyers
CREATE POLICY "Admin can view and manage lawyers"
  ON lawyers
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- Lawyers can view and edit their own profiles
CREATE POLICY "Lawyers can manage own profile"
  ON lawyers
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);