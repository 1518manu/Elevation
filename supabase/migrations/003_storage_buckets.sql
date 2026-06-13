-- Create all 7 storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES
  ('products', 'products', true),
  ('projects', 'projects', true),
  ('blogs', 'blogs', true),
  ('testimonials', 'testimonials', true),
  ('clients', 'clients', true),
  ('company-assets', 'company-assets', true),
  ('resumes', 'resumes', false);

-- Storage RLS: Public buckets — anyone can read
CREATE POLICY "Public read products" ON storage.objects FOR SELECT USING (bucket_id = 'products');
CREATE POLICY "Public read projects" ON storage.objects FOR SELECT USING (bucket_id = 'projects');
CREATE POLICY "Public read blogs" ON storage.objects FOR SELECT USING (bucket_id = 'blogs');
CREATE POLICY "Public read testimonials" ON storage.objects FOR SELECT USING (bucket_id = 'testimonials');
CREATE POLICY "Public read clients" ON storage.objects FOR SELECT USING (bucket_id = 'clients');
CREATE POLICY "Public read company-assets" ON storage.objects FOR SELECT USING (bucket_id = 'company-assets');

-- Admin upload policies for public buckets
CREATE POLICY "Admins upload products" ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'products' AND (SELECT role FROM public.users WHERE id = auth.uid()) IN ('super_admin','admin'));
CREATE POLICY "Admins upload projects" ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'projects' AND (SELECT role FROM public.users WHERE id = auth.uid()) IN ('super_admin','admin'));
CREATE POLICY "Editors upload blogs" ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'blogs' AND (SELECT role FROM public.users WHERE id = auth.uid()) IN ('super_admin','admin','editor'));
CREATE POLICY "Admins upload testimonials" ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'testimonials' AND (SELECT role FROM public.users WHERE id = auth.uid()) IN ('super_admin','admin'));
CREATE POLICY "Admins upload clients" ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'clients' AND (SELECT role FROM public.users WHERE id = auth.uid()) IN ('super_admin','admin'));
CREATE POLICY "Super admin upload assets" ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'company-assets' AND (SELECT role FROM public.users WHERE id = auth.uid()) = 'super_admin');

-- Resumes: public INSERT (applicants upload), HR/Super Admin SELECT only
CREATE POLICY "Anyone uploads resume" ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'resumes');
CREATE POLICY "HR reads resumes" ON storage.objects FOR SELECT
  USING (bucket_id = 'resumes' AND (SELECT role FROM public.users WHERE id = auth.uid()) IN ('super_admin','hr'));
