
-- Ajouter la colonne price à la table consumptions
ALTER TABLE public.consumptions 
ADD COLUMN price numeric;

-- Ajouter les colonnes de prix par défaut à la table profiles
ALTER TABLE public.profiles 
ADD COLUMN default_herbe_price numeric DEFAULT 10,
ADD COLUMN default_hash_price numeric DEFAULT 15,
ADD COLUMN default_cigarette_price numeric DEFAULT 0.5;
