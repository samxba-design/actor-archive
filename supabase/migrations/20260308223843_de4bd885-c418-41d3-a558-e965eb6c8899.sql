-- Drop the security-definer view, not needed
DROP VIEW IF EXISTS public.public_projects;

-- Better approach: null out password_hash in the public policy using a function
-- Create a function to strip sensitive data from projects for public access
CREATE OR REPLACE FUNCTION public.strip_project_password_hash()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- This trigger doesn't help with SELECT, so we'll use a different approach
  RETURN NEW;
END;
$$;

-- Drop that unused function
DROP FUNCTION IF EXISTS public.strip_project_password_hash() CASCADE;