-- Créer un utilisateur de test directement
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  confirmation_sent_at,
  role,
  aud,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'testuser@gmail.com',
  crypt('motdepasse123', gen_salt('bf')),
  NOW(),
  NOW(),
  'authenticated',
  'authenticated',
  NOW(),
  NOW()
) ON CONFLICT (email) DO NOTHING;