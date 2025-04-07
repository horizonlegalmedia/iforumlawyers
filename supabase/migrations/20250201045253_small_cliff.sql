/*
  # Update admin access policies

  1. Changes
    - Add policy for admin users to view all lawyers
    - Add policy for admin users to manage lawyer approvals
  
  2. Security
    - Admins can view and manage all lawyer profiles
    - Regular users can still only view approved lawyers
    - Maintains existing user policies
*/

-- Create a function to check if a user is an admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update the existing policy for viewing lawyers to include admin access
DROP POLICY IF EXISTS "Anyone can view approved lawyers" ON lawyers;
CREATE POLICY "Anyone can view approved lawyers or admin can view all"
  ON lawyers
  FOR SELECT
  USING (
    approved = true 
    OR 
    is_admin()
  );

-- Allow admin to update lawyer profiles (especially for approval)
DROP POLICY IF EXISTS "Admin can update lawyers" ON lawyers;
CREATE POLICY "Admin can update lawyers"
  ON lawyers
  FOR UPDATE
  USING (is_admin())
  WITH CHECK (is_admin());