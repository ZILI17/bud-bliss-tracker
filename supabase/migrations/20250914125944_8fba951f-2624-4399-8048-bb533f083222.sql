-- Créer un utilisateur de test directement dans la table auth.users (via fonction)
-- Pour éviter les problèmes de confirmation d'email

-- Fonction pour créer un utilisateur de test
CREATE OR REPLACE FUNCTION create_test_user()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  test_user_id uuid;
BEGIN
  -- Vérifier si l'utilisateur test existe déjà
  IF NOT EXISTS (
    SELECT 1 FROM auth.users WHERE email = 'test@admin.com'
  ) THEN
    -- Générer un UUID pour l'utilisateur test
    test_user_id := gen_random_uuid();
    
    -- Insérer l'utilisateur test directement
    INSERT INTO auth.users (
      id,
      instance_id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      confirmation_sent_at,
      confirmation_token,
      recovery_token,
      email_change_token_new,
      email_change,
      raw_app_meta_data,
      raw_user_meta_data,
      is_super_admin,
      created_at,
      updated_at,
      phone,
      phone_confirmed_at,
      phone_change,
      phone_change_token,
      phone_change_sent_at,
      email_change_token_current,
      email_change_confirm_status,
      banned_until,
      reauthentication_token,
      reauthentication_sent_at,
      is_sso_user,
      deleted_at,
      is_anonymous
    ) VALUES (
      test_user_id,
      '00000000-0000-0000-0000-000000000000',
      'authenticated',
      'authenticated',
      'test@admin.com',
      '$2a$10$gDzMdKT9V9lGgaP9D9E7H.u7rGNYRGnG5k.yBUFpZOGZ8jgJZmYxK', -- Hash pour 'admin123'
      NOW(),
      NOW(),
      '',
      '',
      '',
      '',
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      false,
      NOW(),
      NOW(),
      null,
      null,
      '',
      '',
      null,
      '',
      0,
      null,
      '',
      null,
      false,
      null,
      false
    );

    -- Créer le profil correspondant
    INSERT INTO public.profiles (id, username, profile_completed, onboarding_completed)
    VALUES (test_user_id, 'test@admin.com', true, true);
    
    RAISE NOTICE 'Utilisateur test créé: test@admin.com / admin123';
  ELSE
    RAISE NOTICE 'Utilisateur test existe déjà: test@admin.com / admin123';
  END IF;
END;
$$;

-- Exécuter la fonction
SELECT create_test_user();