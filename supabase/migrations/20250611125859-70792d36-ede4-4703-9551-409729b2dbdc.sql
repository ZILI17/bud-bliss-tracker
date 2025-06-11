
-- Créer la table pour stocker les consommations
CREATE TABLE public.consumptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('herbe', 'hash', 'cigarette')),
  quantity TEXT NOT NULL,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  note TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Activer Row Level Security (RLS) pour que chaque utilisateur ne voit que ses données
ALTER TABLE public.consumptions ENABLE ROW LEVEL SECURITY;

-- Politique pour voir ses propres consommations
CREATE POLICY "Users can view their own consumptions" 
  ON public.consumptions 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Politique pour créer ses propres consommations
CREATE POLICY "Users can create their own consumptions" 
  ON public.consumptions 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Politique pour modifier ses propres consommations
CREATE POLICY "Users can update their own consumptions" 
  ON public.consumptions 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Politique pour supprimer ses propres consommations
CREATE POLICY "Users can delete their own consumptions" 
  ON public.consumptions 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Créer une table pour les profils utilisateur (optionnel mais recommandé)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
  username TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- RLS pour les profils
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile" 
  ON public.profiles 
  FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles 
  FOR UPDATE 
  USING (auth.uid() = id);

-- Trigger pour créer automatiquement un profil quand un utilisateur s'inscrit
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username)
  VALUES (new.id, new.raw_user_meta_data->>'email');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
