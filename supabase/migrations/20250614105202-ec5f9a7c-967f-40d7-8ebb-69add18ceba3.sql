
-- Créer les politiques RLS manquantes pour la table profiles
DO $$ 
BEGIN
  -- Politique pour INSERT
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'profiles' 
    AND policyname = 'Users can insert their own profile'
  ) THEN
    CREATE POLICY "Users can insert their own profile" 
      ON public.profiles 
      FOR INSERT 
      WITH CHECK (auth.uid() = id);
  END IF;

  -- Politique pour UPDATE
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'profiles' 
    AND policyname = 'Users can update their own profile'
  ) THEN
    CREATE POLICY "Users can update their own profile" 
      ON public.profiles 
      FOR UPDATE 
      USING (auth.uid() = id);
  END IF;
END $$;

-- Activer RLS sur consumptions et créer les politiques manquantes
ALTER TABLE public.consumptions ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
  -- Politiques pour consumptions
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'consumptions' 
    AND policyname = 'Users can view their own consumptions'
  ) THEN
    CREATE POLICY "Users can view their own consumptions" 
      ON public.consumptions 
      FOR SELECT 
      USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'consumptions' 
    AND policyname = 'Users can insert their own consumptions'
  ) THEN
    CREATE POLICY "Users can insert their own consumptions" 
      ON public.consumptions 
      FOR INSERT 
      WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'consumptions' 
    AND policyname = 'Users can update their own consumptions'
  ) THEN
    CREATE POLICY "Users can update their own consumptions" 
      ON public.consumptions 
      FOR UPDATE 
      USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'consumptions' 
    AND policyname = 'Users can delete their own consumptions'
  ) THEN
    CREATE POLICY "Users can delete their own consumptions" 
      ON public.consumptions 
      FOR DELETE 
      USING (auth.uid() = user_id);
  END IF;
END $$;
