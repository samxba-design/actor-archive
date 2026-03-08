ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS hero_style text DEFAULT 'full',
  ADD COLUMN IF NOT EXISTS hero_background_preset text DEFAULT NULL;