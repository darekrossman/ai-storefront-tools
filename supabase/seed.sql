-- Seed file for always having a default user
-- This file is automatically run when doing supabase db reset

-- Insert seed user into auth.users table
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
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '550e8400-e29b-41d4-a716-446655440000',
  'authenticated',
  'authenticated',
  'darek@subpopular.dev',
  crypt('test123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Darek Rossman"}',
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
);

-- Insert corresponding profile (will be created automatically by trigger, but adding explicitly to be sure)
INSERT INTO public.profiles (
  id,
  updated_at,
  username,
  full_name,
  avatar_url,
  website
) VALUES (
  '550e8400-e29b-41d4-a716-446655440000',
  NOW(),
  'darek',
  'Darek Rossman',
  NULL,
  NULL
) ON CONFLICT (id) DO NOTHING;

-- Insert seed user into auth.identities table
INSERT INTO auth.identities (
  id,
  user_id,
  identity_data,
  provider,
  provider_id,
  last_sign_in_at,
  created_at,
  updated_at
) VALUES (
  '550e8400-e29b-41d4-a716-446655440001',
  '550e8400-e29b-41d4-a716-446655440000',
  '{"sub":"550e8400-e29b-41d4-a716-446655440000","email":"darek@subpopular.dev"}',
  'email',
  '550e8400-e29b-41d4-a716-446655440000',
  NOW(),
  NOW(),
  NOW()
); 