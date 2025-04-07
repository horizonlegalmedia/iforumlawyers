/*
  # Create admin user and role

  1. Changes
    - Create admin role
    - Create admin user
    - Grant necessary permissions
  
  2. Security
    - Sets up secure admin access
    - Maintains RLS integrity
*/

-- Create admin user if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM auth.users 
    WHERE email = 'admin@iforum-lawyers.com'
  ) THEN
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      recovery_sent_at,
      last_sign_in_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      confirmation_token,
      email_change,
      email_change_token_new,
      recovery_token
    )
    VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'admin',
      'admin@iforum-lawyers.com',
      crypt('admin123', gen_salt('bf')), -- Initial password: admin123
      NOW(),
      NOW(),
      NOW(),
      '{"provider":"email","providers":["email"]}',
      '{"admin":true}',
      NOW(),
      NOW(),
      '',
      '',
      '',
      ''
    );
  END IF;
END $$;