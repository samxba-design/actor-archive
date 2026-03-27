ALTER TABLE public.published_works 
ADD COLUMN IF NOT EXISTS content_text TEXT,
ADD COLUMN IF NOT EXISTS content_type TEXT DEFAULT 'link';