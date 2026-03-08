ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS cta_label text,
  ADD COLUMN IF NOT EXISTS cta_url text,
  ADD COLUMN IF NOT EXISTS cta_type text DEFAULT 'contact_form',
  ADD COLUMN IF NOT EXISTS booking_url text;