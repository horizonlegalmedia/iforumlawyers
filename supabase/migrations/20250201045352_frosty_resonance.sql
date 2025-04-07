/*
  # Update admin access policies

  1. Changes
    - Update admin check to use JWT claims
    - Modify existing policies to use new admin check
    - Avoid dependency issues with function drops
  
  2. Security
    - Uses JWT claims for admin role check
    - Maintains secure access control
*/

-- First drop the dependent policies
DROP POLICY IF EXISTS "Anyone can view approved lawyers or admin can view all" ON lawyers;
DROP POLICY IF EXISTS "Admin can update lawyers" ON lawyers;

-- Now we can safely drop and recreate the function
DROP FUNCTION IF EXISTS is_admin();

-- Create the new admin check function
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (auth.jwt() ->> 'role')::text = 'admin';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the policies using the new function
CREATE POLICY "Anyone can view approved lawyers or admin can view all"
  ON lawyers
  FOR SELECT
  USING (
    approved = true 
    OR 
    (auth.role() = 'authenticated' AND is_admin())
  );

CREATE POLICY "Admin can update lawyers"
  ON lawyers
  FOR UPDATE
  USING (auth.role() = 'authenticated' AND is_admin())
  WITH CHECK (auth.role() = 'authenticated' AND is_admin());