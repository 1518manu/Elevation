-- Seed products
INSERT INTO public.products (name, slug, category, short_description, description, features, is_featured, display_order) VALUES
('Passenger Elevator Pro', 'passenger-elevator-pro', 'passenger', 'Premium passenger elevator for commercial buildings', 'Our flagship passenger elevator designed for high-rise commercial buildings with advanced safety features and smooth ride quality.', ARRAY['Machine-room-less design','Energy efficient','Smart destination control','Emergency backup power'], true, 1),
('Home Lift Compact', 'home-lift-compact', 'home', 'Compact home elevator for residential use', 'Perfect for villas and duplex homes. Requires minimal pit depth and fits in tight spaces.', ARRAY['Compact footprint','Quiet operation','Custom cabin finishes','Battery backup'], true, 2),
('Freight Elevator Heavy', 'freight-elevator-heavy', 'freight', 'Heavy-duty freight elevator for industrial use', 'Built for warehouses and factories with high load capacity up to 5000kg.', ARRAY['5000kg capacity','Wide door opening','Anti-corrosion coating','Heavy-duty guide rails'], true, 3),
('Hospital Stretcher Lift', 'hospital-stretcher-lift', 'hospital', 'Medical-grade elevator for hospitals', 'Designed for hospitals with stretcher compatibility and hygienic cabin materials.', ARRAY['Stretcher compatible','Anti-bacterial surfaces','Wide cabin','Priority access control'], false, 4),
('Dumbwaiter Service', 'dumbwaiter-service', 'dumbwaiter', 'Compact dumbwaiter for restaurants and hotels', 'Ideal for moving food, laundry, and supplies between floors.', ARRAY['Compact shaft','Multiple stops','Stainless steel cabin','Auto door'], false, 5),
('Escalator Standard', 'escalator-standard', 'escalator', 'Commercial escalator for malls and transit', 'Heavy-traffic escalator with energy-saving variable speed drive.', ARRAY['Variable speed','Safety comb plate','LED step lighting','Auto lubrication'], false, 6);

-- Seed services
INSERT INTO public.services (title, slug, short_description, description, icon, key_features, display_order) VALUES
('Installation', 'installation', 'Professional elevator installation by certified technicians', 'Complete installation services from pit preparation to final commissioning with statutory certification.', 'Wrench', ARRAY['Certified technicians','Turnkey installation','Statutory compliance','Quality assurance'], 1),
('Maintenance & AMC', 'maintenance-amc', 'Annual maintenance contracts for worry-free operation', 'Comprehensive AMC packages with 24/7 breakdown support and preventive maintenance schedules.', 'Settings', ARRAY['24/7 support','Preventive maintenance','Genuine spare parts','Performance reports'], 2),
('Modernization', 'modernization', 'Upgrade existing elevators to latest standards', 'Transform aging elevators with new controllers, cabins, and safety systems without full replacement.', 'RefreshCw', ARRAY['Controller upgrade','Cabin refurbishment','Safety retrofit','Energy savings'], 3);

-- Seed projects
INSERT INTO public.projects (title, slug, client_name, city, state, elevator_type, num_elevators, completion_date, short_description, is_featured) VALUES
('Prestige Tower Bengaluru', 'prestige-tower-bengaluru', 'Prestige Group', 'Bengaluru', 'Karnataka', 'passenger', 6, '2024-06-15', '6 high-speed passenger elevators for 32-floor commercial tower', true),
('Apollo Hospital Chennai', 'apollo-hospital-chennai', 'Apollo Hospitals', 'Chennai', 'Tamil Nadu', 'hospital', 4, '2023-11-20', 'Medical-grade stretcher lifts for multi-specialty hospital', true),
('DLF Mall Noida', 'dlf-mall-noida', 'DLF Limited', 'Noida', 'Uttar Pradesh', 'escalator', 8, '2024-01-10', '8 commercial escalators for premium shopping mall', true);

-- Seed testimonials
INSERT INTO public.testimonials (name, company, role, rating, content, is_featured, display_order) VALUES
('Rajesh Kumar', 'Prestige Group', 'Project Manager', 5, 'Alfa Elevator delivered exceptional quality on our Bengaluru tower project. Installation was on schedule and the elevators run flawlessly.', true, 1),
('Dr. Priya Sharma', 'Apollo Hospitals', 'Facilities Head', 5, 'Their hospital lifts meet all medical standards. The team was professional and responsive throughout the project.', true, 2),
('Amit Patel', 'DLF Limited', 'Construction Director', 5, 'We have partnered with Alfa for multiple projects. Their escalators handle heavy mall traffic without issues.', true, 3);

-- Seed clients
INSERT INTO public.clients (name, display_order, is_active) VALUES
('Prestige Group', 1, true),
('Apollo Hospitals', 2, true),
('DLF Limited', 3, true),
('Tata Housing', 4, true),
('Godrej Properties', 5, true),
('Brigade Group', 6, true);

-- Update site settings with full data
UPDATE public.site_settings SET
  tagline = 'Elevating Standards Across India',
  phones = ARRAY['+91 98765 43210', '+91 98765 43211'],
  emails = ARRAY['info@alfaelevator.in', 'sales@alfaelevator.in'],
  addresses = '[{"label":"Head Office","street":"123 Industrial Area, Phase 2","city":"Mumbai","state":"Maharashtra","pincode":"400001","maps_url":"https://maps.google.com"}]'::jsonb,
  social_links = '{"facebook":"https://facebook.com/alfaelevator","instagram":"https://instagram.com/alfaelevator","linkedin":"https://linkedin.com/company/alfaelevator","youtube":"https://youtube.com/alfaelevator"}'::jsonb,
  hero_content = '{"headline":"India''s Most Trusted Elevator Solutions","subheadline":"From residential home lifts to commercial passenger elevators — engineered for India.","cta_text":"Get Free Quote"}'::jsonb,
  seo_defaults = '{"title":"Alfa Elevator — Premium Elevator Solutions in India","description":"Leading elevator manufacturer in India. Passenger lifts, home elevators, freight lifts, escalators. Installation, maintenance & modernization services.","og_image":"/og-image.jpg"}'::jsonb,
  stats = '{"years":15,"projects":2000,"clients":350,"cities":12}'::jsonb,
  whatsapp_number = '919876543210';

-- Seed a published blog
INSERT INTO public.blogs (title, slug, category, tags, content, read_time_mins, is_published, published_at, seo_title, seo_description) VALUES
('How to Choose the Right Elevator for Your Building', 'choose-right-elevator', 'Guides', ARRAY['buying guide','passenger','commercial'],
'<h2>Understanding Your Building Requirements</h2><p>Choosing the right elevator depends on building type, traffic flow, and budget. This guide covers key factors for Indian buildings.</p><h2>Passenger vs Freight</h2><p>Commercial buildings typically need passenger elevators with capacity of 8-13 persons. Industrial facilities require freight elevators with higher load ratings.</p><h2>Home Lifts</h2><p>Residential elevators need compact designs with minimal pit depth. Machine-room-less (MRL) technology is ideal for homes.</p>',
8, true, NOW(), 'How to Choose the Right Elevator | Alfa Elevator', 'Complete guide to selecting the perfect elevator for commercial, residential, and industrial buildings in India.');

-- Seed active jobs
INSERT INTO public.jobs (title, department, location, job_type, experience_years, salary_range, description, requirements, responsibilities, deadline, is_active) VALUES
('Elevator Installation Technician', 'technical', 'Mumbai, Maharashtra', 'full_time', '2-5 years', '₹3.5L - ₹6L per annum', 'We are looking for experienced elevator installation technicians to join our field team across Maharashtra.', ARRAY['ITI/Diploma in Electrical/Mechanical','2+ years elevator installation experience','Valid driving license','Willingness to travel'], ARRAY['Install and commission elevators','Conduct site surveys','Ensure safety compliance','Maintain installation documentation'], '2026-08-31', true),
('Sales Executive — Elevators', 'sales', 'Bengaluru, Karnataka', 'full_time', '1-3 years', '₹4L - ₹8L + incentives', 'Drive B2B sales for passenger and home elevators in Karnataka region.', ARRAY['MBA/BBA preferred','B2B sales experience','Excellent communication','Own vehicle preferred'], ARRAY['Generate leads and close deals','Conduct client presentations','Coordinate with technical team','Achieve monthly sales targets'], '2026-07-31', true);
