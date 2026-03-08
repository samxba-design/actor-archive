
-- Create published_works table
CREATE TABLE public.published_works (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  summary text,
  category text,
  publication text,
  date text,
  read_time text,
  cover_image_url text,
  pdf_thumbnail_url text,
  pdf_url text,
  article_url text,
  is_featured boolean DEFAULT false,
  show_text_overlay boolean DEFAULT true,
  display_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.published_works ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Published works viewable on published profiles"
  ON public.published_works FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM profiles WHERE profiles.id = published_works.profile_id AND profiles.is_published = true
  ));

CREATE POLICY "Users can view own published works"
  ON public.published_works FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM profiles WHERE profiles.id = published_works.profile_id AND profiles.id = auth.uid()
  ));

CREATE POLICY "Users can insert own published works"
  ON public.published_works FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM profiles WHERE profiles.id = published_works.profile_id AND profiles.id = auth.uid()
  ));

CREATE POLICY "Users can update own published works"
  ON public.published_works FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM profiles WHERE profiles.id = published_works.profile_id AND profiles.id = auth.uid()
  ));

CREATE POLICY "Users can delete own published works"
  ON public.published_works FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM profiles WHERE profiles.id = published_works.profile_id AND profiles.id = auth.uid()
  ));
