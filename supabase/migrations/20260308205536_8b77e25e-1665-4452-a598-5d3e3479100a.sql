ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS hero_bg_type text DEFAULT 'preset',
  ADD COLUMN IF NOT EXISTS hero_bg_solid_color text DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS hero_bg_video_url text DEFAULT NULL;