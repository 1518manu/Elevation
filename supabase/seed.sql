-- Sample seed data for Alfa Elevator

-- Insert sample products
INSERT INTO products (name, slug, category, short_description, description, is_featured, is_active) VALUES
('Home Lifts', 'home-lifts', 'home', 'Residential elevators for home use', 'Compact and elegant home lifts that blend seamlessly with residential architecture.', true, true),
('Passenger Elevator', 'passenger-elevator', 'passenger', 'High-quality passenger elevator for commercial buildings', 'Our passenger elevators are designed for safety, comfort, and efficiency in commercial buildings.', true, true),
('Hospital Lift', 'hospital-lift', 'hospital', 'Specialized lift for healthcare facilities', 'Hospital lifts with smooth operation, hygiene features, and space for stretchers, optimized for patient comfort and facility workflow.', false, true),
('Pneumatic Elevator', 'pneumatic-elevator', 'pneumatic', 'Innovative pneumatic elevator for compact spaces', 'Pneumatic elevators use air pressure technology for a sleek, space-saving vertical lift solution ideal for residential and small commercial applications.', false, true),
('MRL Elevator', 'mrl-elevator', 'mrl', 'Machine room-less elevator for efficient installation', 'MRL elevators save building space by eliminating the separate machine room while delivering reliable, energy-efficient performance.', false, true),
('Panoramic Lift', 'panoramic-lift', 'panoramic', 'Glass panoramic lift for premium spaces', 'Panoramic lifts provide stunning views and an elegant experience for hotels, malls, and high-end residential buildings.', false, true),
('Platform Lift', 'platform-lift', 'platform', 'Accessible platform lift for mobility needs', 'Platform lifts are designed for easy access and safe vertical transport, especially in environments where traditional elevators are not feasible.', false, true),
('Cargo Elevator', 'cargo-elevator', 'cargo', 'Heavy-duty cargo elevator for material handling', 'Cargo elevators are engineered to move goods safely and efficiently in warehouses, factories, and logistics facilities.', false, true),
('Car Elevator', 'car-elevator', 'car', 'Vehicle elevator for parking and showroom use', 'Car elevators provide secure vertical transport for vehicles in parking systems and automotive showrooms.', false, true),
('Chair Lift', 'chair-lift', 'chair', 'Staircase chair lift for accessible homes', 'Chair lifts help people with mobility challenges move easily between floors, offering a safe and comfortable seated ride.', false, true),
('Scissor Elevator', 'scissor-elevator', 'scissor', 'Durable scissor elevator for industrial heights', 'Scissor elevators deliver stable vertical access for maintenance, construction, and warehousing tasks.', false, true),
('Dumbwaiter', 'dumbwaiter', 'dumbwaiter', 'Compact dumbwaiter for kitchens and service spaces', 'Dumbwaiters transport small loads between floors, ideal for restaurants, hotels, and residential service areas.', false, true),
('Freight Elevator', 'freight-elevator', 'freight', 'Heavy-duty freight elevator for industrial use', 'Industrial-grade freight elevators capable of handling heavy loads in warehouses and factories.', false, true),
('Escalator', 'escalator', 'escalator', 'Reliable escalator systems for pedestrian traffic flow', 'Escalators move people smoothly between floors in commercial spaces such as malls, airports, and transit hubs.', false, true);

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
