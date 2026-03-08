
-- =============================================
-- ENUMS
-- =============================================

CREATE TYPE public.profile_type AS ENUM (
  'screenwriter', 'tv_writer', 'playwright', 'author', 'journalist',
  'copywriter', 'actor', 'director_producer', 'corporate_video', 'multi_hyphenate'
);

CREATE TYPE public.project_type AS ENUM (
  'screenplay', 'pilot', 'spec_script', 'play', 'novel', 'short_story',
  'article', 'case_study', 'campaign', 'video', 'film', 'tv_show',
  'book', 'writing_sample', 'series_bible', 'comedy_packet', 'other'
);

CREATE TYPE public.access_level AS ENUM (
  'public', 'gated', 'password_protected', 'private', 'nda_required'
);

CREATE TYPE public.contact_subject_type AS ENUM (
  'script_request', 'commission', 'meeting', 'press', 'representation',
  'casting', 'rights_enquiry', 'general', 'quote_request', 'booking'
);

CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

CREATE TYPE public.subscription_tier AS ENUM ('free', 'pro', 'premium');

-- =============================================
-- UTILITY FUNCTION
-- =============================================

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- =============================================
-- PROFILES
-- =============================================

CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  profile_type public.profile_type,
  secondary_types TEXT[],
  slug TEXT UNIQUE,
  display_name TEXT,
  first_name TEXT,
  last_name TEXT,
  tagline TEXT,
  bio TEXT,
  location TEXT,
  profile_photo_url TEXT,
  banner_url TEXT,
  is_published BOOLEAN DEFAULT FALSE,
  is_draft BOOLEAN DEFAULT TRUE,
  theme TEXT DEFAULT 'minimal',
  accent_color TEXT DEFAULT '#C41E3A',
  font_pairing TEXT DEFAULT 'default',
  layout_density TEXT DEFAULT 'spacious',
  section_order TEXT[],
  sections_visible JSONB DEFAULT '{}',
  custom_css TEXT,
  custom_domain TEXT,
  subscription_tier public.subscription_tier DEFAULT 'free',
  onboarding_completed BOOLEAN DEFAULT FALSE,
  seeking_representation BOOLEAN DEFAULT FALSE,
  available_for_hire BOOLEAN DEFAULT FALSE,
  show_contact_form BOOLEAN DEFAULT TRUE,
  auto_responder_enabled BOOLEAN DEFAULT FALSE,
  auto_responder_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (is_published = true);

CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================
-- ACTOR STATS
-- =============================================

CREATE TABLE public.actor_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
  height_cm INTEGER,
  height_display TEXT,
  weight_range TEXT,
  age_range_min INTEGER,
  age_range_max INTEGER,
  hair_color TEXT,
  eye_color TEXT,
  ethnicity TEXT[],
  body_type TEXT,
  gender_identity TEXT,
  union_status TEXT[],
  accents TEXT[],
  languages JSONB DEFAULT '[]',
  vocal_range TEXT,
  dance_styles TEXT[],
  special_skills TEXT[],
  passport_countries TEXT[],
  work_permits JSONB DEFAULT '{}',
  self_tape_turnaround TEXT,
  willing_to_travel BOOLEAN DEFAULT TRUE,
  travel_regions TEXT[],
  based_in_primary TEXT,
  based_in_secondary TEXT[],
  casting_availability TEXT,
  availability_note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.actor_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Actor stats viewable on published profiles"
  ON public.actor_stats FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = actor_stats.profile_id AND profiles.is_published = true));

CREATE POLICY "Users can view own actor stats"
  ON public.actor_stats FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = actor_stats.profile_id AND profiles.id = auth.uid()));

CREATE POLICY "Users can insert own actor stats"
  ON public.actor_stats FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = actor_stats.profile_id AND profiles.id = auth.uid()));

CREATE POLICY "Users can update own actor stats"
  ON public.actor_stats FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = actor_stats.profile_id AND profiles.id = auth.uid()));

CREATE POLICY "Users can delete own actor stats"
  ON public.actor_stats FOR DELETE
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = actor_stats.profile_id AND profiles.id = auth.uid()));

CREATE TRIGGER update_actor_stats_updated_at
  BEFORE UPDATE ON public.actor_stats
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================
-- REPRESENTATION
-- =============================================

CREATE TABLE public.representation (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  rep_type TEXT NOT NULL,
  name TEXT,
  company TEXT,
  department TEXT,
  email TEXT,
  phone TEXT,
  market TEXT,
  logo_url TEXT,
  is_primary BOOLEAN DEFAULT FALSE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.representation ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Reps viewable on published profiles"
  ON public.representation FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = representation.profile_id AND profiles.is_published = true));

CREATE POLICY "Users can view own reps"
  ON public.representation FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = representation.profile_id AND profiles.id = auth.uid()));

CREATE POLICY "Users can manage own reps"
  ON public.representation FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = representation.profile_id AND profiles.id = auth.uid()));

CREATE POLICY "Users can update own reps"
  ON public.representation FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = representation.profile_id AND profiles.id = auth.uid()));

CREATE POLICY "Users can delete own reps"
  ON public.representation FOR DELETE
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = representation.profile_id AND profiles.id = auth.uid()));

-- =============================================
-- PROJECTS (Universal)
-- =============================================

CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  project_type public.project_type NOT NULL,
  title TEXT NOT NULL,
  project_slug TEXT,
  description TEXT,
  logline TEXT,
  page_count INTEGER,
  genre TEXT[],
  format TEXT,
  status TEXT,
  script_pdf_url TEXT,
  comparable_titles JSONB,
  coverage_excerpt TEXT,
  series_bible_url TEXT,
  episode_count INTEGER,
  network TEXT,
  show_role TEXT,
  season_number INTEGER,
  tmdb_id INTEGER,
  poster_url TEXT,
  backdrop_url TEXT,
  year INTEGER,
  director TEXT,
  notable_cast TEXT[],
  synopsis TEXT,
  runtime_minutes INTEGER,
  network_or_studio TEXT,
  role_name TEXT,
  role_type TEXT,
  production_company TEXT,
  imdb_link TEXT,
  is_notable BOOLEAN DEFAULT FALSE,
  credit_medium TEXT,
  cast_size_notation TEXT,
  duration TEXT,
  set_requirements TEXT,
  rights_status TEXT,
  purchase_links JSONB,
  publisher TEXT,
  isbn TEXT,
  publication TEXT,
  article_url TEXT,
  beat TEXT,
  client TEXT,
  challenge TEXT,
  solution TEXT,
  results TEXT,
  metric_callouts JSONB,
  writing_samples_category TEXT,
  access_level public.access_level DEFAULT 'public',
  password_hash TEXT,
  nda_url TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  display_order INTEGER DEFAULT 0,
  thumbnail_url TEXT,
  custom_image_url TEXT,
  tags TEXT[],
  video_url TEXT,
  video_thumbnail_url TEXT,
  video_type TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(profile_id, project_slug)
);

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public projects viewable on published profiles"
  ON public.projects FOR SELECT
  USING (
    access_level = 'public' AND
    EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = projects.profile_id AND profiles.is_published = true)
  );

CREATE POLICY "Users can view own projects"
  ON public.projects FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = projects.profile_id AND profiles.id = auth.uid()));

CREATE POLICY "Users can insert own projects"
  ON public.projects FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = projects.profile_id AND profiles.id = auth.uid()));

CREATE POLICY "Users can update own projects"
  ON public.projects FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = projects.profile_id AND profiles.id = auth.uid()));

CREATE POLICY "Users can delete own projects"
  ON public.projects FOR DELETE
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = projects.profile_id AND profiles.id = auth.uid()));

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================
-- PRODUCTION HISTORY
-- =============================================

CREATE TABLE public.production_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  theatre_name TEXT,
  city TEXT,
  country TEXT,
  year INTEGER,
  director TEXT,
  cast_names TEXT[],
  production_photos TEXT[],
  run_dates TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.production_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Production history viewable on published profiles"
  ON public.production_history FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = production_history.profile_id AND profiles.is_published = true));

CREATE POLICY "Users can view own production history"
  ON public.production_history FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = production_history.profile_id AND profiles.id = auth.uid()));

CREATE POLICY "Users can manage own production history"
  ON public.production_history FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = production_history.profile_id AND profiles.id = auth.uid()));

CREATE POLICY "Users can update own production history"
  ON public.production_history FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = production_history.profile_id AND profiles.id = auth.uid()));

CREATE POLICY "Users can delete own production history"
  ON public.production_history FOR DELETE
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = production_history.profile_id AND profiles.id = auth.uid()));

-- =============================================
-- AWARDS
-- =============================================

CREATE TABLE public.awards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  organization TEXT,
  result TEXT,
  year INTEGER,
  category TEXT,
  laurel_image_url TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.awards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Awards viewable on published profiles"
  ON public.awards FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = awards.profile_id AND profiles.is_published = true));

CREATE POLICY "Users can view own awards"
  ON public.awards FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = awards.profile_id AND profiles.id = auth.uid()));

CREATE POLICY "Users can manage own awards"
  ON public.awards FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = awards.profile_id AND profiles.id = auth.uid()));

CREATE POLICY "Users can update own awards"
  ON public.awards FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = awards.profile_id AND profiles.id = auth.uid()));

CREATE POLICY "Users can delete own awards"
  ON public.awards FOR DELETE
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = awards.profile_id AND profiles.id = auth.uid()));

-- =============================================
-- PRESS
-- =============================================

CREATE TABLE public.press (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  publication TEXT,
  publication_logo_url TEXT,
  article_url TEXT,
  date DATE,
  excerpt TEXT,
  pull_quote TEXT,
  press_type TEXT,
  star_rating INTEGER,
  is_featured BOOLEAN DEFAULT FALSE,
  image_url TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.press ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Press viewable on published profiles"
  ON public.press FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = press.profile_id AND profiles.is_published = true));

CREATE POLICY "Users can view own press"
  ON public.press FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = press.profile_id AND profiles.id = auth.uid()));

CREATE POLICY "Users can manage own press"
  ON public.press FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = press.profile_id AND profiles.id = auth.uid()));

CREATE POLICY "Users can update own press"
  ON public.press FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = press.profile_id AND profiles.id = auth.uid()));

CREATE POLICY "Users can delete own press"
  ON public.press FOR DELETE
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = press.profile_id AND profiles.id = auth.uid()));

-- =============================================
-- TESTIMONIALS
-- =============================================

CREATE TABLE public.testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
  author_name TEXT NOT NULL,
  author_role TEXT,
  author_company TEXT,
  author_photo_url TEXT,
  quote TEXT NOT NULL,
  is_featured BOOLEAN DEFAULT FALSE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Testimonials viewable on published profiles"
  ON public.testimonials FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = testimonials.profile_id AND profiles.is_published = true));

CREATE POLICY "Users can view own testimonials"
  ON public.testimonials FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = testimonials.profile_id AND profiles.id = auth.uid()));

CREATE POLICY "Users can manage own testimonials"
  ON public.testimonials FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = testimonials.profile_id AND profiles.id = auth.uid()));

CREATE POLICY "Users can update own testimonials"
  ON public.testimonials FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = testimonials.profile_id AND profiles.id = auth.uid()));

CREATE POLICY "Users can delete own testimonials"
  ON public.testimonials FOR DELETE
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = testimonials.profile_id AND profiles.id = auth.uid()));

-- =============================================
-- SERVICES
-- =============================================

CREATE TABLE public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  deliverables TEXT[],
  starting_price TEXT,
  currency TEXT DEFAULT 'USD',
  turnaround TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Services viewable on published profiles"
  ON public.services FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = services.profile_id AND profiles.is_published = true));

CREATE POLICY "Users can view own services"
  ON public.services FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = services.profile_id AND profiles.id = auth.uid()));

CREATE POLICY "Users can manage own services"
  ON public.services FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = services.profile_id AND profiles.id = auth.uid()));

CREATE POLICY "Users can update own services"
  ON public.services FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = services.profile_id AND profiles.id = auth.uid()));

CREATE POLICY "Users can delete own services"
  ON public.services FOR DELETE
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = services.profile_id AND profiles.id = auth.uid()));

-- =============================================
-- EDUCATION
-- =============================================

CREATE TABLE public.education (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  institution TEXT NOT NULL,
  degree_or_certificate TEXT,
  field_of_study TEXT,
  teacher_name TEXT,
  education_type TEXT,
  year_start INTEGER,
  year_end INTEGER,
  is_ongoing BOOLEAN DEFAULT FALSE,
  description TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.education ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Education viewable on published profiles"
  ON public.education FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = education.profile_id AND profiles.is_published = true));

CREATE POLICY "Users can view own education"
  ON public.education FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = education.profile_id AND profiles.id = auth.uid()));

CREATE POLICY "Users can manage own education"
  ON public.education FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = education.profile_id AND profiles.id = auth.uid()));

CREATE POLICY "Users can update own education"
  ON public.education FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = education.profile_id AND profiles.id = auth.uid()));

CREATE POLICY "Users can delete own education"
  ON public.education FOR DELETE
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = education.profile_id AND profiles.id = auth.uid()));

-- =============================================
-- SKILLS
-- =============================================

CREATE TABLE public.skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  category TEXT,
  proficiency TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Skills viewable on published profiles"
  ON public.skills FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = skills.profile_id AND profiles.is_published = true));

CREATE POLICY "Users can view own skills"
  ON public.skills FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = skills.profile_id AND profiles.id = auth.uid()));

CREATE POLICY "Users can manage own skills"
  ON public.skills FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = skills.profile_id AND profiles.id = auth.uid()));

CREATE POLICY "Users can update own skills"
  ON public.skills FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = skills.profile_id AND profiles.id = auth.uid()));

CREATE POLICY "Users can delete own skills"
  ON public.skills FOR DELETE
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = skills.profile_id AND profiles.id = auth.uid()));

-- =============================================
-- SOCIAL LINKS
-- =============================================

CREATE TABLE public.social_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  platform TEXT NOT NULL,
  url TEXT NOT NULL,
  label TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Social links viewable on published profiles"
  ON public.social_links FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = social_links.profile_id AND profiles.is_published = true));

CREATE POLICY "Users can view own social links"
  ON public.social_links FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = social_links.profile_id AND profiles.id = auth.uid()));

CREATE POLICY "Users can manage own social links"
  ON public.social_links FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = social_links.profile_id AND profiles.id = auth.uid()));

CREATE POLICY "Users can update own social links"
  ON public.social_links FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = social_links.profile_id AND profiles.id = auth.uid()));

CREATE POLICY "Users can delete own social links"
  ON public.social_links FOR DELETE
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = social_links.profile_id AND profiles.id = auth.uid()));

-- =============================================
-- EVENTS
-- =============================================

CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  event_type TEXT,
  date DATE,
  end_date DATE,
  venue TEXT,
  city TEXT,
  country TEXT,
  ticket_url TEXT,
  description TEXT,
  is_upcoming BOOLEAN DEFAULT TRUE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Events viewable on published profiles"
  ON public.events FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = events.profile_id AND profiles.is_published = true));

CREATE POLICY "Users can view own events"
  ON public.events FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = events.profile_id AND profiles.id = auth.uid()));

CREATE POLICY "Users can manage own events"
  ON public.events FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = events.profile_id AND profiles.id = auth.uid()));

CREATE POLICY "Users can update own events"
  ON public.events FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = events.profile_id AND profiles.id = auth.uid()));

CREATE POLICY "Users can delete own events"
  ON public.events FOR DELETE
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = events.profile_id AND profiles.id = auth.uid()));

-- =============================================
-- GALLERY IMAGES
-- =============================================

CREATE TABLE public.gallery_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
  image_url TEXT NOT NULL,
  thumbnail_url TEXT,
  image_type TEXT NOT NULL,
  caption TEXT,
  photographer_credit TEXT,
  is_primary BOOLEAN DEFAULT FALSE,
  tags TEXT[],
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Gallery viewable on published profiles"
  ON public.gallery_images FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = gallery_images.profile_id AND profiles.is_published = true));

CREATE POLICY "Users can view own gallery"
  ON public.gallery_images FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = gallery_images.profile_id AND profiles.id = auth.uid()));

CREATE POLICY "Users can manage own gallery"
  ON public.gallery_images FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = gallery_images.profile_id AND profiles.id = auth.uid()));

CREATE POLICY "Users can update own gallery"
  ON public.gallery_images FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = gallery_images.profile_id AND profiles.id = auth.uid()));

CREATE POLICY "Users can delete own gallery"
  ON public.gallery_images FOR DELETE
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = gallery_images.profile_id AND profiles.id = auth.uid()));

-- =============================================
-- CONTACT SUBMISSIONS
-- =============================================

CREATE TABLE public.contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
  sender_name TEXT NOT NULL,
  sender_email TEXT NOT NULL,
  subject_type public.contact_subject_type DEFAULT 'general',
  subject TEXT,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  is_starred BOOLEAN DEFAULT FALSE,
  is_archived BOOLEAN DEFAULT FALSE,
  reply_sent BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit contact"
  ON public.contact_submissions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Profile owners can view submissions"
  ON public.contact_submissions FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = contact_submissions.profile_id AND profiles.id = auth.uid()));

CREATE POLICY "Profile owners can update submissions"
  ON public.contact_submissions FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = contact_submissions.profile_id AND profiles.id = auth.uid()));

CREATE POLICY "Profile owners can delete submissions"
  ON public.contact_submissions FOR DELETE
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = contact_submissions.profile_id AND profiles.id = auth.uid()));

-- =============================================
-- DOWNLOAD LOGS
-- =============================================

CREATE TABLE public.download_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
  document_url TEXT,
  downloader_email TEXT,
  downloader_name TEXT,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.download_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create download log"
  ON public.download_logs FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Profile owners can view download logs"
  ON public.download_logs FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = download_logs.profile_id AND profiles.id = auth.uid()));

-- =============================================
-- PAGE VIEWS
-- =============================================

CREATE TABLE public.page_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
  referrer TEXT,
  user_agent TEXT,
  country TEXT,
  city TEXT,
  device_type TEXT,
  path TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create page view"
  ON public.page_views FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Profile owners can view page views"
  ON public.page_views FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = page_views.profile_id AND profiles.id = auth.uid()));

-- =============================================
-- EMAIL CAPTURES
-- =============================================

CREATE TABLE public.email_captures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
  email TEXT NOT NULL,
  name TEXT,
  source TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.email_captures ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit email"
  ON public.email_captures FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Profile owners can view email captures"
  ON public.email_captures FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = email_captures.profile_id AND profiles.id = auth.uid()));

-- =============================================
-- COMPANY LOGOS (Cache)
-- =============================================

CREATE TABLE public.company_logos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name TEXT NOT NULL UNIQUE,
  domain TEXT,
  logo_url TEXT NOT NULL,
  logo_source TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.company_logos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Company logos are viewable by everyone"
  ON public.company_logos FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert logos"
  ON public.company_logos FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- =============================================
-- TMDB CACHE
-- =============================================

CREATE TABLE public.tmdb_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tmdb_id INTEGER NOT NULL,
  media_type TEXT NOT NULL,
  title TEXT NOT NULL,
  year INTEGER,
  poster_url TEXT,
  backdrop_url TEXT,
  genre TEXT[],
  director TEXT,
  notable_cast TEXT[],
  synopsis TEXT,
  runtime_minutes INTEGER,
  network_or_studio TEXT,
  raw_data JSONB,
  fetched_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tmdb_id, media_type)
);

ALTER TABLE public.tmdb_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "TMDB cache is viewable by everyone"
  ON public.tmdb_cache FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert tmdb cache"
  ON public.tmdb_cache FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update tmdb cache"
  ON public.tmdb_cache FOR UPDATE
  USING (auth.uid() IS NOT NULL);

-- =============================================
-- USER ROLES
-- =============================================

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL,
  UNIQUE(user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

CREATE POLICY "Users can view own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

-- =============================================
-- AUTH TRIGGER
-- =============================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, created_at, updated_at)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.raw_user_meta_data ->> 'name', split_part(NEW.email, '@', 1)),
    NOW(),
    NOW()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================
-- STORAGE BUCKETS
-- =============================================

INSERT INTO storage.buckets (id, name, public) VALUES ('headshots', 'headshots', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('banners', 'banners', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('project-images', 'project-images', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('scripts', 'scripts', false);
INSERT INTO storage.buckets (id, name, public) VALUES ('gallery', 'gallery', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('logos', 'logos', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('thumbnails', 'thumbnails', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('documents', 'documents', false);

-- Public bucket read policies
CREATE POLICY "Public read headshots" ON storage.objects FOR SELECT USING (bucket_id = 'headshots');
CREATE POLICY "Public read banners" ON storage.objects FOR SELECT USING (bucket_id = 'banners');
CREATE POLICY "Public read project-images" ON storage.objects FOR SELECT USING (bucket_id = 'project-images');
CREATE POLICY "Public read gallery" ON storage.objects FOR SELECT USING (bucket_id = 'gallery');
CREATE POLICY "Public read logos" ON storage.objects FOR SELECT USING (bucket_id = 'logos');
CREATE POLICY "Public read thumbnails" ON storage.objects FOR SELECT USING (bucket_id = 'thumbnails');

-- Upload policies (user folder pattern)
CREATE POLICY "Users upload headshots" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'headshots' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users upload banners" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'banners' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users upload project-images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'project-images' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users upload gallery" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'gallery' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users upload logos" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'logos' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users upload thumbnails" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'thumbnails' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users upload scripts" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'scripts' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users upload documents" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Private bucket read policies
CREATE POLICY "Users read own scripts" ON storage.objects FOR SELECT USING (bucket_id = 'scripts' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users read own documents" ON storage.objects FOR SELECT USING (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Update policies
CREATE POLICY "Users update own headshots" ON storage.objects FOR UPDATE USING (bucket_id = 'headshots' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users update own banners" ON storage.objects FOR UPDATE USING (bucket_id = 'banners' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users update own project-images" ON storage.objects FOR UPDATE USING (bucket_id = 'project-images' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users update own gallery" ON storage.objects FOR UPDATE USING (bucket_id = 'gallery' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users update own logos" ON storage.objects FOR UPDATE USING (bucket_id = 'logos' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users update own thumbnails" ON storage.objects FOR UPDATE USING (bucket_id = 'thumbnails' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users update own scripts" ON storage.objects FOR UPDATE USING (bucket_id = 'scripts' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users update own documents" ON storage.objects FOR UPDATE USING (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Delete policies
CREATE POLICY "Users delete own headshots" ON storage.objects FOR DELETE USING (bucket_id = 'headshots' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users delete own banners" ON storage.objects FOR DELETE USING (bucket_id = 'banners' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users delete own project-images" ON storage.objects FOR DELETE USING (bucket_id = 'project-images' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users delete own gallery" ON storage.objects FOR DELETE USING (bucket_id = 'gallery' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users delete own logos" ON storage.objects FOR DELETE USING (bucket_id = 'logos' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users delete own thumbnails" ON storage.objects FOR DELETE USING (bucket_id = 'thumbnails' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users delete own scripts" ON storage.objects FOR DELETE USING (bucket_id = 'scripts' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users delete own documents" ON storage.objects FOR DELETE USING (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);
