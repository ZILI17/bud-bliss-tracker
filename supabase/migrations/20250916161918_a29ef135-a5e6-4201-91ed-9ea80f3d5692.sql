-- Ajouter les nouveaux champs pour les habitudes de consommation avec les cigarettes
ALTER TABLE public.profiles 
ADD COLUMN smokes_with_cannabis boolean DEFAULT false,
ADD COLUMN cigarettes_per_joint numeric DEFAULT 1;