ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS professional_status text DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS status_badge_color text DEFAULT 'green',
  ADD COLUMN IF NOT EXISTS status_badge_animation text DEFAULT 'pulse';