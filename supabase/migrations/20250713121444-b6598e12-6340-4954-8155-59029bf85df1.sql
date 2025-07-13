-- Ajouter des données de consommation pour jeanracine111@gmail.com

-- Pour le samedi 12 juillet 2025 (7 hash et 15 cigarettes)
INSERT INTO public.consumptions (user_id, date, type, quantity, price, note)
SELECT 
  au.id,
  '2025-07-12 14:00:00+00'::timestamptz,
  'hash',
  '0.3g',
  4.50,
  'Ajout manuel - samedi après-midi'
FROM auth.users au 
WHERE au.email = 'jeanracine111@gmail.com';

INSERT INTO public.consumptions (user_id, date, type, quantity, price, note)
SELECT 
  au.id,
  '2025-07-12 16:30:00+00'::timestamptz,
  'hash',
  '0.3g',
  4.50,
  'Ajout manuel - samedi après-midi'
FROM auth.users au 
WHERE au.email = 'jeanracine111@gmail.com';

INSERT INTO public.consumptions (user_id, date, type, quantity, price, note)
SELECT 
  au.id,
  '2025-07-12 19:00:00+00'::timestamptz,
  'hash',
  '0.3g',
  4.50,
  'Ajout manuel - samedi soir'
FROM auth.users au 
WHERE au.email = 'jeanracine111@gmail.com';

INSERT INTO public.consumptions (user_id, date, type, quantity, price, note)
SELECT 
  au.id,
  '2025-07-12 21:00:00+00'::timestamptz,
  'hash',
  '0.3g',
  4.50,
  'Ajout manuel - samedi soir'
FROM auth.users au 
WHERE au.email = 'jeanracine111@gmail.com';

INSERT INTO public.consumptions (user_id, date, type, quantity, price, note)
SELECT 
  au.id,
  '2025-07-12 22:30:00+00'::timestamptz,
  'hash',
  '0.3g',
  4.50,
  'Ajout manuel - samedi soir'
FROM auth.users au 
WHERE au.email = 'jeanracine111@gmail.com';

INSERT INTO public.consumptions (user_id, date, type, quantity, price, note)
SELECT 
  au.id,
  '2025-07-12 23:15:00+00'::timestamptz,
  'hash',
  '0.3g',
  4.50,
  'Ajout manuel - samedi soir'
FROM auth.users au 
WHERE au.email = 'jeanracine111@gmail.com';

INSERT INTO public.consumptions (user_id, date, type, quantity, price, note)
SELECT 
  au.id,
  '2025-07-12 23:45:00+00'::timestamptz,
  'hash',
  '0.3g',
  4.50,
  'Ajout manuel - samedi soir'
FROM auth.users au 
WHERE au.email = 'jeanracine111@gmail.com';

-- Cigarettes pour le samedi 12 juillet (15 cigarettes réparties sur la journée)
INSERT INTO public.consumptions (user_id, date, type, quantity, price, note)
SELECT 
  au.id,
  '2025-07-12 08:00:00+00'::timestamptz,
  'cigarette',
  '1',
  0.50,
  'Ajout manuel - samedi matin'
FROM auth.users au 
WHERE au.email = 'jeanracine111@gmail.com';

INSERT INTO public.consumptions (user_id, date, type, quantity, price, note)
SELECT 
  au.id,
  '2025-07-12 09:30:00+00'::timestamptz,
  'cigarette',
  '1',
  0.50,
  'Ajout manuel - samedi matin'
FROM auth.users au 
WHERE au.email = 'jeanracine111@gmail.com';

INSERT INTO public.consumptions (user_id, date, type, quantity, price, note)
SELECT 
  au.id,
  '2025-07-12 11:00:00+00'::timestamptz,
  'cigarette',
  '1',
  0.50,
  'Ajout manuel - samedi matin'
FROM auth.users au 
WHERE au.email = 'jeanracine111@gmail.com';

INSERT INTO public.consumptions (user_id, date, type, quantity, price, note)
SELECT 
  au.id,
  '2025-07-12 12:30:00+00'::timestamptz,
  'cigarette',
  '1',
  0.50,
  'Ajout manuel - samedi midi'
FROM auth.users au 
WHERE au.email = 'jeanracine111@gmail.com';

INSERT INTO public.consumptions (user_id, date, type, quantity, price, note)
SELECT 
  au.id,
  '2025-07-12 14:15:00+00'::timestamptz,
  'cigarette',
  '1',
  0.50,
  'Ajout manuel - samedi après-midi'
FROM auth.users au 
WHERE au.email = 'jeanracine111@gmail.com';

INSERT INTO public.consumptions (user_id, date, type, quantity, price, note)
SELECT 
  au.id,
  '2025-07-12 15:45:00+00'::timestamptz,
  'cigarette',
  '1',
  0.50,
  'Ajout manuel - samedi après-midi'
FROM auth.users au 
WHERE au.email = 'jeanracine111@gmail.com';

INSERT INTO public.consumptions (user_id, date, type, quantity, price, note)
SELECT 
  au.id,
  '2025-07-12 17:00:00+00'::timestamptz,
  'cigarette',
  '1',
  0.50,
  'Ajout manuel - samedi après-midi'
FROM auth.users au 
WHERE au.email = 'jeanracine111@gmail.com';

INSERT INTO public.consumptions (user_id, date, type, quantity, price, note)
SELECT 
  au.id,
  '2025-07-12 18:30:00+00'::timestamptz,
  'cigarette',
  '1',
  0.50,
  'Ajout manuel - samedi soir'
FROM auth.users au 
WHERE au.email = 'jeanracine111@gmail.com';

INSERT INTO public.consumptions (user_id, date, type, quantity, price, note)
SELECT 
  au.id,
  '2025-07-12 19:15:00+00'::timestamptz,
  'cigarette',
  '1',
  0.50,
  'Ajout manuel - samedi soir'
FROM auth.users au 
WHERE au.email = 'jeanracine111@gmail.com';

INSERT INTO public.consumptions (user_id, date, type, quantity, price, note)
SELECT 
  au.id,
  '2025-07-12 20:45:00+00'::timestamptz,
  'cigarette',
  '1',
  0.50,
  'Ajout manuel - samedi soir'
FROM auth.users au 
WHERE au.email = 'jeanracine111@gmail.com';

INSERT INTO public.consumptions (user_id, date, type, quantity, price, note)
SELECT 
  au.id,
  '2025-07-12 21:30:00+00'::timestamptz,
  'cigarette',
  '1',
  0.50,
  'Ajout manuel - samedi soir'
FROM auth.users au 
WHERE au.email = 'jeanracine111@gmail.com';

INSERT INTO public.consumptions (user_id, date, type, quantity, price, note)
SELECT 
  au.id,
  '2025-07-12 22:15:00+00'::timestamptz,
  'cigarette',
  '1',
  0.50,
  'Ajout manuel - samedi soir'
FROM auth.users au 
WHERE au.email = 'jeanracine111@gmail.com';

INSERT INTO public.consumptions (user_id, date, type, quantity, price, note)
SELECT 
  au.id,
  '2025-07-12 23:00:00+00'::timestamptz,
  'cigarette',
  '1',
  0.50,
  'Ajout manuel - samedi soir'
FROM auth.users au 
WHERE au.email = 'jeanracine111@gmail.com';

INSERT INTO public.consumptions (user_id, date, type, quantity, price, note)
SELECT 
  au.id,
  '2025-07-12 23:30:00+00'::timestamptz,
  'cigarette',
  '1',
  0.50,
  'Ajout manuel - samedi soir'
FROM auth.users au 
WHERE au.email = 'jeanracine111@gmail.com';

INSERT INTO public.consumptions (user_id, date, type, quantity, price, note)
SELECT 
  au.id,
  '2025-07-12 23:55:00+00'::timestamptz,
  'cigarette',
  '1',
  0.50,
  'Ajout manuel - samedi soir'
FROM auth.users au 
WHERE au.email = 'jeanracine111@gmail.com';

-- Pour le vendredi 11 juillet 2025 (2 hash et 5 cigarettes)
INSERT INTO public.consumptions (user_id, date, type, quantity, price, note)
SELECT 
  au.id,
  '2025-07-11 18:00:00+00'::timestamptz,
  'hash',
  '0.3g',
  4.50,
  'Ajout manuel - vendredi soir'
FROM auth.users au 
WHERE au.email = 'jeanracine111@gmail.com';

INSERT INTO public.consumptions (user_id, date, type, quantity, price, note)
SELECT 
  au.id,
  '2025-07-11 22:00:00+00'::timestamptz,
  'hash',
  '0.3g',
  4.50,
  'Ajout manuel - vendredi soir'
FROM auth.users au 
WHERE au.email = 'jeanracine111@gmail.com';

-- Cigarettes pour le vendredi 11 juillet (5 cigarettes)
INSERT INTO public.consumptions (user_id, date, type, quantity, price, note)
SELECT 
  au.id,
  '2025-07-11 09:00:00+00'::timestamptz,
  'cigarette',
  '1',
  0.50,
  'Ajout manuel - vendredi matin'
FROM auth.users au 
WHERE au.email = 'jeanracine111@gmail.com';

INSERT INTO public.consumptions (user_id, date, type, quantity, price, note)
SELECT 
  au.id,
  '2025-07-11 13:00:00+00'::timestamptz,
  'cigarette',
  '1',
  0.50,
  'Ajout manuel - vendredi midi'
FROM auth.users au 
WHERE au.email = 'jeanracine111@gmail.com';

INSERT INTO public.consumptions (user_id, date, type, quantity, price, note)
SELECT 
  au.id,
  '2025-07-11 17:00:00+00'::timestamptz,
  'cigarette',
  '1',
  0.50,
  'Ajout manuel - vendredi après-midi'
FROM auth.users au 
WHERE au.email = 'jeanracine111@gmail.com';

INSERT INTO public.consumptions (user_id, date, type, quantity, price, note)
SELECT 
  au.id,
  '2025-07-11 20:00:00+00'::timestamptz,
  'cigarette',
  '1',
  0.50,
  'Ajout manuel - vendredi soir'
FROM auth.users au 
WHERE au.email = 'jeanracine111@gmail.com';

INSERT INTO public.consumptions (user_id, date, type, quantity, price, note)
SELECT 
  au.id,
  '2025-07-11 23:00:00+00'::timestamptz,
  'cigarette',
  '1',
  0.50,
  'Ajout manuel - vendredi soir'
FROM auth.users au 
WHERE au.email = 'jeanracine111@gmail.com';