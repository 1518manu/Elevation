-- Sample seed data for Alfa Elevator

-- Insert sample products
INSERT INTO products (name, slug, category, short_description, description, is_featured, is_active) VALUES
('Passenger Elevator', 'passenger-elevator', 'passenger', 'High-quality passenger elevator for commercial buildings', 'Our passenger elevators are designed for safety, comfort, and efficiency in commercial buildings.', true, true),
('Freight Elevator', 'freight-elevator', 'freight', 'Heavy-duty freight elevator for industrial use', 'Industrial-grade freight elevators capable of handling heavy loads in warehouses and factories.', false, true),
('Home Elevator', 'home-elevator', 'home', 'Residential elevator for home use', 'Compact and elegant home elevators that blend seamlessly with residential architecture.', true, true),
('Hospital Elevator', 'hospital-elevator', 'hospital', 'Specialized elevator for healthcare facilities', 'Hospital elevators with smooth operation, hygiene features, and space for stretchers.', false, true);

-- Insert sample services
INSERT INTO services (title, slug, short_description, description, is_active) VALUES
('Installation', 'installation', 'Professional elevator installation services', 'Expert installation services for all types of elevators with certified technicians.', true),
('Maintenance', 'maintenance', 'Regular maintenance and repair services', 'Comprehensive maintenance programs to keep your elevators running smoothly and safely.', true),
('Modernization', 'modernization', 'Elevator modernization and upgrades', 'Upgrade your existing elevators with latest technology for improved performance and safety.', true);

-- Insert sample clients
INSERT INTO clients (name, logo_url, website_url, display_order, is_active) VALUES
('ABC Corporation', NULL, 'https://abccorp.com', 1, true),
('XYZ Industries', NULL, 'https://xyzind.com', 2, true),
('City Hospital', NULL, 'https://cityhospital.com', 3, true);
