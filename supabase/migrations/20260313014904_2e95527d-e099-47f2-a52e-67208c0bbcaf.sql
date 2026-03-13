
-- Add layout_preset column to profiles (separate from layout_density)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS layout_preset text DEFAULT 'classic';

-- Add index on contact_submissions.profile_id for query performance
CREATE INDEX IF NOT EXISTS idx_contact_submissions_profile_id ON public.contact_submissions(profile_id);
