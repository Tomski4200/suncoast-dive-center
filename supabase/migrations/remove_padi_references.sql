-- Remove PADI references from database
-- This script updates all PADI-specific text to be agency-neutral

-- Update service category name and description
UPDATE service_categories
SET
  name = 'Dive Certification',
  description = 'Dive certification courses from beginner to professional'
WHERE slug = 'certification';

-- Update service names that contain "PADI"
UPDATE services
SET name = 'Open Water Diver'
WHERE name = 'PADI Open Water Diver';

UPDATE services
SET name = 'Scuba Diver'
WHERE name = 'PADI Scuba Diver';

-- Additional safety check: Update any other services that might contain PADI
UPDATE services
SET name = REPLACE(name, 'PADI ', '')
WHERE name LIKE '%PADI%';

UPDATE services
SET description = REPLACE(description, 'PADI ', '')
WHERE description LIKE '%PADI%';

-- Verify the changes
SELECT 'Service Categories Updated:' as info;
SELECT id, name, description FROM service_categories WHERE slug = 'certification';

SELECT 'Services Updated:' as info;
SELECT id, name, description FROM services WHERE category_id = (SELECT id FROM service_categories WHERE slug = 'certification');
