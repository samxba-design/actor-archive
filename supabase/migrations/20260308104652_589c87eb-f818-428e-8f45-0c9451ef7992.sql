
-- Pipeline tracker for script submissions
CREATE TABLE public.pipeline_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  project_id uuid REFERENCES public.projects(id) ON DELETE SET NULL,
  company_name text NOT NULL,
  contact_name text,
  contact_email text,
  submission_type text DEFAULT 'query',
  status text NOT NULL DEFAULT 'submitted',
  submitted_at date DEFAULT CURRENT_DATE,
  response_at date,
  notes text,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.pipeline_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own submissions" ON public.pipeline_submissions
  FOR SELECT TO authenticated USING (profile_id = auth.uid());

CREATE POLICY "Users can insert own submissions" ON public.pipeline_submissions
  FOR INSERT TO authenticated WITH CHECK (profile_id = auth.uid());

CREATE POLICY "Users can update own submissions" ON public.pipeline_submissions
  FOR UPDATE TO authenticated USING (profile_id = auth.uid());

CREATE POLICY "Users can delete own submissions" ON public.pipeline_submissions
  FOR DELETE TO authenticated USING (profile_id = auth.uid());
