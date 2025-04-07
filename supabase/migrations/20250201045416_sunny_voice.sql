/*
  # Fix admin permissions for lawyers table

  1. Changes
    - Drop existing policies
    - Create new policies with proper admin access
    - Add policy for admin to view all lawyers
  
  2. Security
    - Maintains RLS
    - Ensures proper admin access
    - Preserves existing user permissions
*/

-- First drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Anyone can view approved lawyers or admin can view all" ON lawyers;
DROP POLICY IF EXISTS "Admin can update lawyers" ON lawyers;

-- Create new policies with proper access control
CREATE POLICY "Public can view approved lawyers"
  ON lawyers
  FOR SELECT
  USING (approved = true);

CREATE POLICY "Admin can view all lawyers"
  ON lawyers
  FOR SELECT
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admin can update lawyers"
  ON lawyers
  FOR UPDATE
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- Ensure lawyers can view their own profiles
CREATE POLICY "Lawyers can view own profile"
  ON lawyers
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);