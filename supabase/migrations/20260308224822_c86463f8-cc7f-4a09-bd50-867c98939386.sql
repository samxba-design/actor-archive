
-- Add contact_mode to profiles: 'form', 'agent', 'both'
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS contact_mode text DEFAULT 'form';

-- Create custom_sections table for user-defined free-text sections
CREATE TABLE IF NOT EXISTS public.custom_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  content text,
  section_type text DEFAULT 'custom',
  icon text DEFAULT 'Sparkles',
  display_order integer DEFAULT 0,
  is_visible boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- RLS for custom_sections
ALTER TABLE public.custom_sections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Custom sections viewable on published profiles" ON public.custom_sections
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM profiles WHERE profiles.id = custom_sections.profile_id AND profiles.is_published = true
  ));

CREATE POLICY "Users can view own custom sections" ON public.custom_sections
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM profiles WHERE profiles.id = custom_sections.profile_id AND profiles.id = auth.uid()
  ));

CREATE POLICY "Users can insert own custom sections" ON public.custom_sections
  FOR INSERT WITH CHECK (EXISTS (
    SELECT 1 FROM profiles WHERE profiles.id = custom_sections.profile_id AND profiles.id = auth.uid()
  ));

CREATE POLICY "Users can update own custom sections" ON public.custom_sections
  FOR UPDATE USING (EXISTS (
    SELECT 1 FROM profiles WHERE profiles.id = custom_sections.profile_id AND profiles.id = auth.uid()
  ));

CREATE POLICY "Users can delete own custom sections" ON public.custom_sections
  FOR DELETE USING (EXISTS (
    SELECT 1 FROM profiles WHERE profiles.id = custom_sections.profile_id AND profiles.id = auth.uid()
  ));
