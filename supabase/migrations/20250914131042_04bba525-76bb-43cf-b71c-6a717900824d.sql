-- Créer un utilisateur administrateur pré-confirmé pour contourner le problème de confirmation email
-- Cet utilisateur peut se connecter immédiatement sans confirmation

INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@test.com',
  crypt('admin123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider": "email", "providers": ["email"]}',
  '{"email": "admin@test.com"}',
  false,
  '',
  '',
  '',
  ''
);

-- Créer le profil correspondant dans la table profiles
INSERT INTO public.profiles (id, username)
SELECT id, 'admin@test.com'
FROM auth.users 
WHERE email = 'admin@test.com';