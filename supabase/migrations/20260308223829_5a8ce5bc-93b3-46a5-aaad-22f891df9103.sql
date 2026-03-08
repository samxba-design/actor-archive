-- Fix: Create a secure view for public project access that excludes password_hash
CREATE OR REPLACE VIEW public.public_projects AS
SELECT 
  id, profile_id, title, project_type, description, logline, genre, format, status,
  year, display_order, is_featured, is_notable, poster_url, backdrop_url, custom_image_url,
  thumbnail_url, video_url, video_type, video_thumbnail_url, role_name, role_type,
  director, notable_cast, network_or_studio, production_company, runtime_minutes,
  synopsis, network, show_role, credit_medium, cast_size_notation, duration,
  set_requirements, rights_status, publisher, isbn, publication, article_url,
  beat, client, challenge, solution, results, writing_samples_category,
  tags, page_count, access_level, project_slug, imdb_link, season_number,
  episode_count, coverage_excerpt, script_pdf_url, series_bible_url, nda_url,
  comparable_titles, metric_callouts, purchase_links, chapters, created_at, updated_at,
  tmdb_id
FROM public.projects;

-- Grant SELECT on the view to anon and authenticated roles
GRANT SELECT ON public.public_projects TO anon, authenticated;