-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quote_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.process_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper function: get current user role
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS TEXT AS $$
  SELECT role FROM public.users WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- PUBLIC READ: products (active only)
CREATE POLICY "Public can read active products" ON public.products
  FOR SELECT USING (is_active = true);
CREATE POLICY "Admins manage products" ON public.products
  FOR ALL USING (get_user_role() IN ('super_admin','admin'));

-- PUBLIC READ: services, projects, blogs, testimonials, clients, process_steps, site_settings
CREATE POLICY "Public read services" ON public.services FOR SELECT USING (is_active = true);
CREATE POLICY "Admins manage services" ON public.services FOR ALL USING (get_user_role() IN ('super_admin','admin'));

CREATE POLICY "Public read projects" ON public.projects FOR SELECT USING (is_active = true);
CREATE POLICY "Admins manage projects" ON public.projects FOR ALL USING (get_user_role() IN ('super_admin','admin'));

CREATE POLICY "Public read published blogs" ON public.blogs FOR SELECT USING (is_published = true);
CREATE POLICY "Editors can manage own blogs" ON public.blogs FOR ALL
  USING (author_id = auth.uid() OR get_user_role() IN ('super_admin','admin'));

CREATE POLICY "Public read active testimonials" ON public.testimonials FOR SELECT USING (is_active = true);
CREATE POLICY "Admins manage testimonials" ON public.testimonials FOR ALL USING (get_user_role() IN ('super_admin','admin'));

CREATE POLICY "Public read clients" ON public.clients FOR SELECT USING (is_active = true);
CREATE POLICY "Admins manage clients" ON public.clients FOR ALL USING (get_user_role() IN ('super_admin','admin'));

CREATE POLICY "Public read process steps" ON public.process_steps FOR SELECT USING (is_active = true);
CREATE POLICY "Admins manage process steps" ON public.process_steps FOR ALL USING (get_user_role() IN ('super_admin','admin'));

CREATE POLICY "Public read site settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Super admin manages site settings" ON public.site_settings FOR ALL USING (get_user_role() = 'super_admin');

-- PUBLIC READ: active jobs
CREATE POLICY "Public read active jobs" ON public.jobs FOR SELECT USING (is_active = true);
CREATE POLICY "HR admin manage jobs" ON public.jobs FOR ALL USING (get_user_role() IN ('super_admin','hr','admin'));

-- PUBLIC INSERT: applications (anyone can apply)
CREATE POLICY "Anyone can submit application" ON public.applications FOR INSERT WITH CHECK (true);
CREATE POLICY "HR reads applications" ON public.applications FOR SELECT USING (get_user_role() IN ('super_admin','hr'));
CREATE POLICY "HR updates applications" ON public.applications FOR UPDATE USING (get_user_role() IN ('super_admin','hr'));

-- PUBLIC INSERT: contact & quote inquiries
CREATE POLICY "Anyone can submit contact" ON public.contact_inquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin reads contacts" ON public.contact_inquiries FOR SELECT
  USING (get_user_role() IN ('super_admin','admin','sales'));
CREATE POLICY "Admin updates contacts" ON public.contact_inquiries FOR UPDATE
  USING (get_user_role() IN ('super_admin','admin'));

CREATE POLICY "Anyone can submit quote" ON public.quote_inquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Sales reads quotes" ON public.quote_inquiries FOR SELECT
  USING (get_user_role() IN ('super_admin','admin','sales'));
CREATE POLICY "Sales updates quotes" ON public.quote_inquiries FOR UPDATE
  USING (get_user_role() IN ('super_admin','admin','sales'));

-- USERS: self-read + admin full access
CREATE POLICY "Users read own profile" ON public.users FOR SELECT USING (id = auth.uid());
CREATE POLICY "Super admin manages users" ON public.users FOR ALL USING (get_user_role() = 'super_admin');

-- NOTIFICATIONS
CREATE POLICY "Authenticated read notifications" ON public.notifications FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admin creates notifications" ON public.notifications FOR INSERT WITH CHECK (get_user_role() IN ('super_admin','admin'));

-- AUDIT LOGS
CREATE POLICY "Super admin reads audit logs" ON public.audit_logs FOR SELECT USING (get_user_role() = 'super_admin');
