/*
  # Add approval system to lawyers table

  1. Changes
    - Add `approved` column to lawyers table with default false
    - Update RLS policies to:
      - Allow unauthenticated users to view only approved lawyers
      - Allow authenticated users to create their profiles
      - Allow admin role to manage all profiles
  
  2. Security
    - Enable RLS
    - Update policies for better access control
*/

-- Add approved column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'lawyers' AND column_name = 'approved'
  ) THEN
    ALTER TABLE lawyers ADD COLUMN approved boolean DEFAULT false;
  END IF;
END $$;

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can view lawyers" ON lawyers;
DROP POLICY IF EXISTS "Users can create their own profile" ON lawyers;
DROP POLICY IF EXISTS "Users can update own profile" ON lawyers;

-- Create new policies
-- Allow public to view only approved lawyers
CREATE POLICY "Anyone can view approved lawyers"
  ON lawyers
  FOR SELECT
  USING (approved = true);

-- Allow authenticated users to create their profile
CREATE POLICY "Users can create their profile"
  ON lawyers
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Allow authenticated users to view their own profile regardless of approval status
CREATE POLICY "Users can view own profile"
  ON lawyers
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Allow admin to manage all profiles
CREATE POLICY "Admin can manage all profiles"
  ON lawyers
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.role = 'admin'
    )
  );