
-- Create work_collections table
CREATE TABLE public.work_collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  cover_image_url TEXT,
  display_order INTEGER DEFAULT 0,
  is_expanded_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Add collection_id to published_works
ALTER TABLE public.published_works 
  ADD COLUMN collection_id UUID REFERENCES public.work_collections(id) ON DELETE SET NULL;

-- Enable RLS
ALTER TABLE public.work_collections ENABLE ROW LEVEL SECURITY;

-- RLS: owner can CRUD
CREATE POLICY "Users can view own collections"
  ON public.work_collections FOR SELECT
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = work_collections.profile_id AND profiles.id = auth.uid()));

CREATE POLICY "Users can insert own collections"
  ON public.work_collections FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = work_collections.profile_id AND profiles.id = auth.uid()));

CREATE POLICY "Users can update own collections"
  ON public.work_collections FOR UPDATE
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = work_collections.profile_id AND profiles.id = auth.uid()));

CREATE POLICY "Users can delete own collections"
  ON public.work_collections FOR DELETE
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = work_collections.profile_id AND profiles.id = auth.uid()));

-- RLS: public can view on published profiles
CREATE POLICY "Collections viewable on published profiles"
  ON public.work_collections FOR SELECT
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = work_collections.profile_id AND profiles.is_published = true));
