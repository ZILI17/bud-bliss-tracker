
-- Ajouter les nouveaux champs pour enrichir le profil utilisateur

-- Champs pour les déclencheurs
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS triggers_moments TEXT[] DEFAULT NULL;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS triggers_specific TEXT[] DEFAULT NULL;

-- Champs pour les motivations
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS motivation_reasons TEXT[] DEFAULT NULL;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS motivation_personal TEXT DEFAULT NULL;

-- Champs pour le soutien
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS support_entourage BOOLEAN DEFAULT NULL;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS support_preference TEXT DEFAULT NULL;

-- Champs pour les activités alternatives
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS alternative_activities TEXT[] DEFAULT NULL;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS wants_daily_suggestions BOOLEAN DEFAULT TRUE;

-- Champs pour l'objectif détaillé (certains existent déjà)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS goal_timeline TEXT DEFAULT NULL;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS goal_motivation TEXT DEFAULT NULL;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS goal_description TEXT DEFAULT NULL;
