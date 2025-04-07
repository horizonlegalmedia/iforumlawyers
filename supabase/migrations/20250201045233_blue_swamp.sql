/*
  # Make bar license number optional

  1. Changes
    - Make bar_license_no column optional in lawyers table
  
  2. Notes
    - This change allows lawyers to register without providing a bar license number
*/

ALTER TABLE lawyers ALTER COLUMN bar_license_no DROP NOT NULL;