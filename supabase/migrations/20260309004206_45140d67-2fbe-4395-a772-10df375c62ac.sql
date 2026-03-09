-- Admin audit logs to track all admin actions
CREATE TABLE public.admin_audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE SET NULL,
  action_type text NOT NULL, -- 'user_suspend', 'user_delete', 'content_flag', 'setting_change', etc.
  target_type text, -- 'profile', 'project', 'user', 'setting'
  target_id uuid,
  details jsonb DEFAULT '{}'::jsonb,
  ip_address text,
  created_at timestamptz DEFAULT now()
);

-- Content moderation flags
CREATE TABLE public.content_flags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_type text NOT NULL, -- 'profile', 'project', 'testimonial', etc.
  content_id uuid NOT NULL,
  profile_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  reason text NOT NULL,
  details text,
  status text DEFAULT 'pending', -- 'pending', 'reviewed', 'resolved', 'dismissed'
  flagged_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewed_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Platform settings (key-value store)
CREATE TABLE public.platform_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value jsonb NOT NULL DEFAULT '{}'::jsonb,
  description text,
  category text DEFAULT 'general', -- 'general', 'features', 'limits', 'email'
  updated_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add is_suspended and suspended_reason to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS is_suspended boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS suspended_reason text,
ADD COLUMN IF NOT EXISTS suspended_at timestamptz,
ADD COLUMN IF NOT EXISTS suspended_by uuid REFERENCES auth.users(id) ON DELETE SET NULL;

-- Enable RLS
ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;

-- Admin audit logs policies (only admins can view)
CREATE POLICY "Admins can view audit logs"
ON public.admin_audit_logs FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert audit logs"
ON public.admin_audit_logs FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Content flags policies
CREATE POLICY "Admins can view all flags"
ON public.content_flags FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can create a flag"
ON public.content_flags FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can update flags"
ON public.content_flags FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete flags"
ON public.content_flags FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Platform settings policies (only admins)
CREATE POLICY "Admins can view settings"
ON public.platform_settings FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert settings"
ON public.platform_settings FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update settings"
ON public.platform_settings FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete settings"
ON public.platform_settings FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Add policy for admins to view ALL profiles (for user management)
CREATE POLICY "Admins can view all profiles"
ON public.profiles FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Add policy for admins to update ANY profile (for suspensions)
CREATE POLICY "Admins can update any profile"
ON public.profiles FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

-- Insert default platform settings
INSERT INTO public.platform_settings (key, value, description, category) VALUES
('max_projects_free', '5', 'Maximum projects for free tier', 'limits'),
('max_projects_pro', '50', 'Maximum projects for pro tier', 'limits'),
('max_gallery_images_free', '10', 'Maximum gallery images for free tier', 'limits'),
('max_gallery_images_pro', '100', 'Maximum gallery images for pro tier', 'limits'),
('allow_signups', 'true', 'Allow new user signups', 'features'),
('maintenance_mode', 'false', 'Enable maintenance mode', 'features'),
('contact_email', '"support@example.com"', 'Platform contact email', 'general'),
('site_name', '"Actor Archive"', 'Platform name', 'general');

-- Create trigger for updated_at on content_flags
CREATE TRIGGER update_content_flags_updated_at
BEFORE UPDATE ON public.content_flags
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger for updated_at on platform_settings
CREATE TRIGGER update_platform_settings_updated_at
BEFORE UPDATE ON public.platform_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();