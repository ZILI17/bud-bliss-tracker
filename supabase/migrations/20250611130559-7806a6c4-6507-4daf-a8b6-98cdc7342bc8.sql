
-- Étendre la table profiles pour inclure les données de santé et préférences
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS age INTEGER;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS weight_kg DECIMAL(5,2);
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS height_cm INTEGER;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS activity_level TEXT CHECK (activity_level IN ('sedentaire', 'leger', 'modere', 'intense', 'tres_intense'));
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS medical_conditions TEXT[];
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS medications TEXT[];
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS consumption_goal TEXT CHECK (consumption_goal IN ('reduction', 'arret', 'medical', 'recreatif', 'maintenance'));

-- Ajouter les quantités par défaut pour les enregistrements rapides
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS default_herbe_quantity DECIMAL(4,2) DEFAULT 0.5; -- en grammes
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS default_hash_quantity DECIMAL(4,2) DEFAULT 0.3; -- en grammes
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS default_cigarette_quantity INTEGER DEFAULT 1; -- nombre de cigarettes

-- Ajouter une colonne pour savoir si le profil a été complété
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS profile_completed BOOLEAN DEFAULT FALSE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE;

-- Créer une table pour les recommandations personnalisées
CREATE TABLE IF NOT EXISTS public.recommendations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('daily_limit', 'health_warning', 'reduction_tip', 'motivation')),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  priority INTEGER DEFAULT 1 CHECK (priority BETWEEN 1 AND 5),
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE
);

-- RLS pour les recommandations
ALTER TABLE public.recommendations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own recommendations" 
  ON public.recommendations 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own recommendations" 
  ON public.recommendations 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Fonction pour calculer les recommandations personnalisées
CREATE OR REPLACE FUNCTION public.calculate_personalized_recommendations(user_uuid UUID)
RETURNS TABLE(
  rec_type TEXT,
  rec_title TEXT,
  rec_content TEXT,
  rec_priority INTEGER
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_profile RECORD;
  weekly_consumption INTEGER;
  daily_average DECIMAL;
  bmi DECIMAL;
BEGIN
  -- Récupérer le profil utilisateur
  SELECT * INTO user_profile 
  FROM public.profiles 
  WHERE id = user_uuid;
  
  -- Calculer la consommation de la semaine
  SELECT COUNT(*) INTO weekly_consumption
  FROM public.consumptions 
  WHERE user_id = user_uuid 
  AND date >= NOW() - INTERVAL '7 days';
  
  daily_average := weekly_consumption / 7.0;
  
  -- Calculer l'IMC si les données sont disponibles
  IF user_profile.weight_kg IS NOT NULL AND user_profile.height_cm IS NOT NULL THEN
    bmi := user_profile.weight_kg / POWER(user_profile.height_cm / 100.0, 2);
  END IF;
  
  -- Recommandations basées sur l'âge
  IF user_profile.age IS NOT NULL AND user_profile.age < 25 THEN
    RETURN QUERY VALUES (
      'health_warning',
      'Attention développement cérébral',
      'Votre cerveau continue de se développer jusqu''à 25 ans. Une consommation modérée est recommandée.',
      4
    );
  END IF;
  
  -- Recommandations basées sur la fréquence
  IF daily_average > 3 THEN
    RETURN QUERY VALUES (
      'daily_limit',
      'Consommation élevée détectée',
      'Votre consommation dépasse 3 fois par jour en moyenne. Considérez une réduction progressive.',
      5
    );
  ELSIF daily_average > 1 AND daily_average <= 3 THEN
    RETURN QUERY VALUES (
      'reduction_tip',
      'Optimisation possible',
      'Essayez d''espacer vos consommations pour maintenir les effets tout en réduisant la tolérance.',
      2
    );
  END IF;
  
  -- Recommandations basées sur l'objectif
  IF user_profile.consumption_goal = 'reduction' THEN
    RETURN QUERY VALUES (
      'motivation',
      'Progression vers votre objectif',
      'Chaque jour sans augmentation est une victoire. Restez concentré sur votre objectif de réduction.',
      3
    );
  ELSIF user_profile.consumption_goal = 'arret' THEN
    RETURN QUERY VALUES (
      'motivation',
      'Soutien pour l''arrêt',
      'L''arrêt est un processus. Soyez patient avec vous-même et célébrez chaque petite victoire.',
      4
    );
  END IF;
  
  -- Recommandations basées sur l'activité physique et l'IMC
  IF user_profile.activity_level = 'sedentaire' THEN
    RETURN QUERY VALUES (
      'health_warning',
      'Activité physique recommandée',
      'L''exercice peut aider à gérer le stress et réduire le besoin de consommation.',
      2
    );
  END IF;
  
  RETURN;
END;
$$;
