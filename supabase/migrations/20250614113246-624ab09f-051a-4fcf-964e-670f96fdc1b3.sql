
-- Corriger les problèmes de sécurité identifiés dans le Security Advisor

-- 1. Corriger la fonction handle_new_user pour sécuriser le search_path
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, username)
  VALUES (new.id, new.raw_user_meta_data->>'email');
  RETURN new;
END;
$$;

-- 2. Corriger la fonction calculate_personalized_recommendations pour sécuriser le search_path
CREATE OR REPLACE FUNCTION public.calculate_personalized_recommendations(user_uuid uuid)
RETURNS TABLE(rec_type text, rec_title text, rec_content text, rec_priority integer)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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
