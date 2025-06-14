
-- Vérifier la contrainte sur consumption_goal
SELECT constraint_name, check_clause 
FROM information_schema.check_constraints 
WHERE constraint_name = 'profiles_consumption_goal_check';

-- Si la contrainte existe, la supprimer et la recréer avec les bonnes valeurs
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_consumption_goal_check;

-- Recréer la contrainte avec toutes les valeurs utilisées dans l'interface
ALTER TABLE public.profiles ADD CONSTRAINT profiles_consumption_goal_check 
CHECK (consumption_goal IN ('reduction', 'stabilisation', 'arret', 'controle', 'substitution', 'medical'));
