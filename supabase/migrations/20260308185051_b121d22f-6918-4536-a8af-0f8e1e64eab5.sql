
CREATE TABLE public.client_logos_profile (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  company_name text NOT NULL,
  logo_url text,
  website_url text,
  display_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.client_logos_profile ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Client logos viewable on published profiles"
  ON public.client_logos_profile FOR SELECT
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = client_logos_profile.profile_id AND profiles.is_published = true));

CREATE POLICY "Users can view own client logos"
  ON public.client_logos_profile FOR SELECT
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = client_logos_profile.profile_id AND profiles.id = auth.uid()));

CREATE POLICY "Users can insert own client logos"
  ON public.client_logos_profile FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = client_logos_profile.profile_id AND profiles.id = auth.uid()));

CREATE POLICY "Users can update own client logos"
  ON public.client_logos_profile FOR UPDATE
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = client_logos_profile.profile_id AND profiles.id = auth.uid()));

CREATE POLICY "Users can delete own client logos"
  ON public.client_logos_profile FOR DELETE
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = client_logos_profile.profile_id AND profiles.id = auth.uid()));
