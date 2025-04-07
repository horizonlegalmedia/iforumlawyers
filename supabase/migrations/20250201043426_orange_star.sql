/*
  # Create lawyers directory schema

  1. New Tables
    - `lawyers`
      - `id` (uuid, primary key)
      - `name` (text)
      - `photo_url` (text)
      - `age` (integer)
      - `bar_license_no` (text)
      - `bar_association` (text)
      - `years_of_practice` (integer)
      - `specializations` (text array)
      - `mobile_no` (text)
      - `city` (text)
      - `preferred_language` (text)
      - `bio` (text)
      - `created_at` (timestamp)
      - `user_id` (uuid, foreign key)

  2. Security
    - Enable RLS on `lawyers` table
    - Add policies for:
      - Public read access
      - Authenticated users can create their own profile
      - Users can only update their own profile
*/

CREATE TABLE IF NOT EXISTS lawyers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  name text NOT NULL,
  photo_url text,
  age integer NOT NULL,
  bar_license_no text NOT NULL,
  bar_association text NOT NULL,
  years_of_practice integer NOT NULL,
  specializations text[] NOT NULL,
  mobile_no text NOT NULL,
  city text NOT NULL,
  preferred_language text NOT NULL,
  bio text NOT NULL,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT specializations_limit CHECK (array_length(specializations, 1) <= 3)
);

ALTER TABLE lawyers ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Anyone can view lawyers"
  ON lawyers
  FOR SELECT
  USING (true);

-- Allow authenticated users to create their own profile
CREATE POLICY "Users can create their own profile"
  ON lawyers
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile"
  ON lawyers
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);