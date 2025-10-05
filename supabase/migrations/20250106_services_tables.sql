-- Create service categories table
CREATE TABLE IF NOT EXISTS service_categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  icon TEXT,
  description TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create service subcategories table
CREATE TABLE IF NOT EXISTS service_subcategories (
  id SERIAL PRIMARY KEY,
  category_id INTEGER NOT NULL REFERENCES service_categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(category_id, slug)
);

-- Create services table
CREATE TABLE IF NOT EXISTS services (
  id SERIAL PRIMARY KEY,
  category_id INTEGER NOT NULL REFERENCES service_categories(id) ON DELETE CASCADE,
  subcategory_id INTEGER REFERENCES service_subcategories(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2),
  price_text TEXT, -- For ranges like "$85-120" or "Quote"
  duration TEXT,
  depth TEXT,
  includes JSONB,
  service_type TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(category_id, slug)
);

-- Create indexes for better performance
CREATE INDEX idx_services_category_id ON services(category_id);
CREATE INDEX idx_services_subcategory_id ON services(subcategory_id);
CREATE INDEX idx_service_subcategories_category_id ON service_subcategories(category_id);

-- Enable RLS
ALTER TABLE service_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_subcategories ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Service categories are viewable by everyone" 
  ON service_categories FOR SELECT USING (true);

CREATE POLICY "Service subcategories are viewable by everyone" 
  ON service_subcategories FOR SELECT USING (true);

CREATE POLICY "Services are viewable by everyone" 
  ON services FOR SELECT USING (true);

-- Create policies for authenticated users to manage
CREATE POLICY "Authenticated users can manage service categories" 
  ON service_categories FOR ALL 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage service subcategories" 
  ON service_subcategories FOR ALL 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage services" 
  ON services FOR ALL 
  USING (auth.role() = 'authenticated');

-- Insert service categories
INSERT INTO service_categories (name, slug, icon, description, display_order) VALUES
  ('PADI Certification', 'certification', 'GraduationCap', 'PADI certification courses from beginner to professional', 1),
  ('Chartered Dives', 'charters', 'Anchor', 'Explore the best dive sites in the Gulf of Mexico', 2),
  ('Tank Services', 'tank', 'Gauge', 'Air fills, rentals, and tank maintenance', 3),
  ('Gear Service', 'gear', 'Wrench', 'Equipment service and repair for all major brands', 4)
ON CONFLICT (name) DO NOTHING;

-- Insert subcategories for certification
INSERT INTO service_subcategories (category_id, name, slug, description, display_order)
SELECT 
  id,
  subcategory.name,
  subcategory.slug,
  subcategory.description,
  subcategory.display_order
FROM service_categories,
LATERAL (VALUES
  ('Beginner Courses', 'beginner', 'Start your diving journey', 1),
  ('Advanced & Specialty Courses', 'advanced', 'Expand your skills and explore new depths', 2)
) AS subcategory(name, slug, description, display_order)
WHERE service_categories.slug = 'certification';

-- Insert subcategories for charters
INSERT INTO service_subcategories (category_id, name, slug, description, display_order)
SELECT 
  id,
  subcategory.name,
  subcategory.slug,
  subcategory.description,
  subcategory.display_order
FROM service_categories,
LATERAL (VALUES
  ('Local Reef Dives', 'local-reef', 'Explore vibrant artificial reefs teeming with marine life', 1),
  ('Wreck Dives', 'wreck', 'Visit historic shipwrecks and artificial reef structures', 2),
  ('Deep & Technical', 'deep-technical', 'Advanced dives for experienced divers', 3),
  ('Special Trips', 'special', 'Unique diving experiences', 4)
) AS subcategory(name, slug, description, display_order)
WHERE service_categories.slug = 'charters';

-- Insert certification services
INSERT INTO services (category_id, subcategory_id, name, slug, price, duration, description, includes, display_order)
SELECT 
  cat.id,
  sub.id,
  service.name,
  service.slug,
  service.price,
  service.duration,
  service.description,
  service.includes,
  service.display_order
FROM service_categories cat
JOIN service_subcategories sub ON sub.category_id = cat.id
JOIN LATERAL (
  -- Beginner Courses
  SELECT 'beginner' as sub_slug, 'Discover Scuba Diving' as name, 'discover-scuba' as slug, 
    149.00 as price, '1 Day' as duration,
    'No certification required. Experience breathing underwater for the first time!' as description,
    '["Pool session", "Basic equipment", "Professional instruction"]'::jsonb as includes,
    1 as display_order
  UNION ALL
  SELECT 'beginner', 'PADI Open Water Diver', 'open-water', 
    499.00, '3-4 Days',
    'Your first certification! Learn the basics and explore to 60 feet.',
    '["E-learning materials", "Pool sessions", "4 open water dives", "Equipment rental", "Certification card"]'::jsonb,
    2
  UNION ALL
  SELECT 'beginner', 'PADI Scuba Diver', 'scuba-diver',
    349.00, '2 Days',
    'Limited certification for those short on time. Dive to 40 feet with a professional.',
    '["E-learning", "Pool sessions", "2 open water dives", "Certification"]'::jsonb,
    3
  UNION ALL
  -- Advanced Courses
  SELECT 'advanced', 'Advanced Open Water', 'advanced-open-water',
    399.00, '2 Days',
    'Expand your skills with 5 adventure dives including deep and navigation.',
    '["5 adventure dives", "Deep dive to 100ft", "Navigation training", "Certification"]'::jsonb,
    1
  UNION ALL
  SELECT 'advanced', 'Rescue Diver', 'rescue-diver',
    449.00, '3 Days',
    'Learn to prevent and manage diving emergencies. Be a better dive buddy!',
    '["Emergency scenarios", "First aid training", "Rescue techniques", "Certification"]'::jsonb,
    2
  UNION ALL
  SELECT 'advanced', 'Divemaster', 'divemaster',
    899.00, '4-6 Weeks',
    'First professional level. Lead dives and assist instructors.',
    '["Professional training", "Leadership skills", "Dive theory", "Internship opportunity"]'::jsonb,
    3
  UNION ALL
  SELECT 'advanced', 'Nitrox Specialty', 'nitrox-specialty',
    199.00, '1 Day',
    'Dive longer with enriched air. Most popular specialty course!',
    '["Theory & analysis", "2 nitrox dives", "Certification"]'::jsonb,
    4
  UNION ALL
  SELECT 'advanced', 'Deep Diver Specialty', 'deep-diver',
    349.00, '2 Days',
    'Explore depths to 130 feet safely. Learn deep dive planning.',
    '["4 deep dives", "Narcosis management", "Deep dive planning"]'::jsonb,
    5
  UNION ALL
  SELECT 'advanced', 'Wreck Diver Specialty', 'wreck-diver',
    379.00, '2 Days',
    'Explore sunken vessels safely. Popular Florida specialty!',
    '["4 wreck dives", "Penetration basics", "Mapping & navigation"]'::jsonb,
    6
) AS service
ON sub.slug = service.sub_slug
WHERE cat.slug = 'certification';

-- Insert charter services
INSERT INTO services (category_id, subcategory_id, name, slug, price, duration, depth, display_order)
SELECT 
  cat.id,
  sub.id,
  service.name,
  service.slug,
  service.price,
  service.duration,
  service.depth,
  service.display_order
FROM service_categories cat
JOIN service_subcategories sub ON sub.category_id = cat.id
JOIN LATERAL (
  -- Local Reef Dives
  SELECT 'local-reef' as sub_slug, 'Morning 2-Tank Reef Dive' as name, 'morning-reef' as slug,
    95.00 as price, '4 hours' as duration, '40-60 ft' as depth, 1 as display_order
  UNION ALL
  SELECT 'local-reef', 'Afternoon 2-Tank Dive', 'afternoon-reef',
    85.00, '4 hours', '40-60 ft', 2
  UNION ALL
  SELECT 'local-reef', 'Twilight/Night Dive', 'twilight-night',
    75.00, '3 hours', '30-50 ft', 3
  UNION ALL
  -- Wreck Dives
  SELECT 'wreck', 'USS Narcissus Wreck', 'uss-narcissus',
    125.00, '5 hours', '80-90 ft', 1
  UNION ALL
  SELECT 'wreck', 'Sheridan Wreck Complex', 'sheridan-wreck',
    115.00, '5 hours', '70-80 ft', 2
  UNION ALL
  SELECT 'wreck', 'Blackthorn Memorial', 'blackthorn-memorial',
    135.00, '5 hours', '80 ft', 3
  UNION ALL
  -- Deep & Technical
  SELECT 'deep-technical', 'Deep Ledge Exploration', 'deep-ledge',
    165.00, '6 hours', '100-130 ft', 1
  UNION ALL
  SELECT 'deep-technical', 'Technical Wreck Penetration', 'tech-wreck',
    225.00, '6 hours', '90-130 ft', 2
  UNION ALL
  SELECT 'deep-technical', 'Trimix Deep Dive', 'trimix-deep',
    295.00, '6 hours', '130+ ft', 3
  UNION ALL
  -- Special Trips
  SELECT 'special', 'Shark Tooth Dive', 'shark-tooth',
    89.00, '4 hours', '20-40 ft', 1
  UNION ALL
  SELECT 'special', 'Spearfishing Charter', 'spearfishing',
    145.00, '5 hours', 'Varies', 2
  UNION ALL
  SELECT 'special', 'Photography Workshop Dive', 'photography-workshop',
    135.00, '5 hours', '40-60 ft', 3
) AS service
ON sub.slug = service.sub_slug
WHERE cat.slug = 'charters';

-- Insert tank services (no subcategories)
INSERT INTO services (category_id, name, slug, price, price_text, service_type, display_order)
SELECT 
  id,
  service.name,
  service.slug,
  service.price,
  service.price_text,
  service.service_type,
  service.display_order
FROM service_categories,
LATERAL (VALUES
  -- Air Fills
  ('Standard Air Fill', 'air-fill', 8.00, '$8', 'Air Fills', 1),
  ('10-Fill Card', '10-fill-card', 70.00, '$70', 'Air Fills', 2),
  ('Monthly Unlimited', 'monthly-unlimited', 99.00, '$99', 'Air Fills', 3),
  -- Nitrox Fills
  ('32% Nitrox', 'nitrox-32', 12.00, '$12', 'Nitrox Fills', 4),
  ('36% Nitrox', 'nitrox-36', 14.00, '$14', 'Nitrox Fills', 5),
  ('Custom Mix', 'custom-mix', 16.00, '$16', 'Nitrox Fills', 6),
  -- Tank Rentals
  ('Aluminum 80', 'aluminum-80', 15.00, '$15/day', 'Tank Rentals', 7),
  ('Steel 100', 'steel-100', 20.00, '$20/day', 'Tank Rentals', 8),
  ('Pony Bottle', 'pony-bottle', 10.00, '$10/day', 'Tank Rentals', 9),
  -- Visual Inspections
  ('Annual VIP', 'annual-vip', 25.00, '$25', 'Visual Inspections', 10),
  ('VIP + Fill', 'vip-fill', 30.00, '$30', 'Visual Inspections', 11),
  ('O2 Clean VIP', 'o2-clean-vip', 35.00, '$35', 'Visual Inspections', 12),
  -- Hydrostatic Testing
  ('Aluminum Tank Hydro', 'aluminum-hydro', 45.00, '$45', 'Hydrostatic Testing', 13),
  ('Steel Tank Hydro', 'steel-hydro', 50.00, '$50', 'Hydrostatic Testing', 14),
  ('Rush Service', 'rush-service', 15.00, '+$15', 'Hydrostatic Testing', 15),
  -- Valve Services
  ('Valve Service', 'valve-service', 20.00, '$20', 'Valve Services', 16),
  ('Valve Replacement', 'valve-replacement', 75.00, '$75', 'Valve Services', 17),
  ('DIN/Yoke Convert', 'din-yoke-convert', 30.00, '$30', 'Valve Services', 18)
) AS service(name, slug, price, price_text, service_type, display_order)
WHERE service_categories.slug = 'tank';

-- Insert gear services (no subcategories)
INSERT INTO services (category_id, name, slug, price_text, duration, service_type, display_order)
SELECT 
  id,
  service.name,
  service.slug,
  service.price_text,
  service.duration,
  service.service_type,
  service.display_order
FROM service_categories,
LATERAL (VALUES
  -- Regulator Service
  ('Annual Regulator Service', 'annual-regulator', '$85', '3-5 days', 'Regulator Service', 1),
  ('First & Second Stage', 'first-second-stage', '$125', '3-5 days', 'Regulator Service', 2),
  ('Octopus Service', 'octopus-service', '$45', '2-3 days', 'Regulator Service', 3),
  ('Rush Service Available', 'rush-regulator', '+$25', '24 hours', 'Regulator Service', 4),
  -- BCD Service
  ('Annual BCD Service', 'annual-bcd', '$65', '2-3 days', 'BCD Service', 5),
  ('Inflator Service', 'inflator-service', '$35', '1-2 days', 'BCD Service', 6),
  ('Bladder Repair', 'bladder-repair', '$45-95', '3-5 days', 'BCD Service', 7),
  ('Dump Valve Replace', 'dump-valve', '$40', '2-3 days', 'BCD Service', 8),
  -- Computer Service
  ('Battery Replacement', 'battery-replacement', '$25-45', 'Same day', 'Computer Service', 9),
  ('Pressure Test', 'pressure-test', '$35', '1 day', 'Computer Service', 10),
  ('Software Update', 'software-update', '$20', 'Same day', 'Computer Service', 11),
  ('Screen Replacement', 'screen-replacement', 'Quote', '1-2 weeks', 'Computer Service', 12),
  -- Wetsuit Repair
  ('Seam Repair', 'seam-repair', '$25-45', '2-3 days', 'Wetsuit Repair', 13),
  ('Zipper Replacement', 'zipper-replacement', '$85-120', '1 week', 'Wetsuit Repair', 14),
  ('Knee Pad Install', 'knee-pad-install', '$35', '3-4 days', 'Wetsuit Repair', 15),
  ('Minor Tears', 'minor-tears', '$20-40', '2-3 days', 'Wetsuit Repair', 16)
) AS service(name, slug, price_text, duration, service_type, display_order)
WHERE service_categories.slug = 'gear';

-- Create a view for convenient service queries with category info
CREATE OR REPLACE VIEW services_with_categories AS
SELECT 
  s.*,
  sc.name as category_name,
  sc.slug as category_slug,
  sc.icon as category_icon,
  ssc.name as subcategory_name,
  ssc.slug as subcategory_slug
FROM services s
JOIN service_categories sc ON s.category_id = sc.id
LEFT JOIN service_subcategories ssc ON s.subcategory_id = ssc.id;