-- Solution définitive : Créer un utilisateur admin via les fonctions Supabase appropriées
-- D'abord, désactiver temporairement la confirmation email pour permettre l'accès immédiat

-- Créer un utilisateur admin en utilisant la fonction Supabase sécurisée
SELECT auth.admin_create_user(
  json_build_object(
    'email', 'admin@test.com',
    'password', 'admin123',
    'email_confirm', true,
    'user_metadata', json_build_object('name', 'Admin User')
  )
);

-- Créer le profil correspondant pour cet utilisateur admin
INSERT INTO public.profiles (id, username)
SELECT id, 'Admin User'
FROM auth.users 
WHERE email = 'admin@test.com'
ON CONFLICT (id) DO NOTHING;