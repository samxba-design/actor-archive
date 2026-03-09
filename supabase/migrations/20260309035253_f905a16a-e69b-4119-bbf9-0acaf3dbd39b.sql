
-- Admin can view all page_views for analytics
CREATE POLICY "Admins can view all page views"
ON public.page_views FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Admin can view all contact_submissions for analytics
CREATE POLICY "Admins can view all contact submissions"
ON public.contact_submissions FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Admin can view all projects for dashboard stats
CREATE POLICY "Admins can view all projects"
ON public.projects FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- user_roles: Admins can manage all roles
CREATE POLICY "Admins can view all roles"
ON public.user_roles FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert roles"
ON public.user_roles FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete roles"
ON public.user_roles FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));
