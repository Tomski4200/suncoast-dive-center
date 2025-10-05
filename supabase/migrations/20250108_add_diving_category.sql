-- Add general "Diving" category for posts that don't fit other specific categories
INSERT INTO blog_categories (name, slug, description, display_order) VALUES
  ('Diving', 'diving', 'General diving news, marine life, and underwater adventures', 7)
ON CONFLICT (slug) DO NOTHING;

-- Update posts that are currently categorized as "conditions" but are really general diving
-- These are posts about sharks, fish, and general diving topics
UPDATE blog_posts
SET category_id = (SELECT id FROM blog_categories WHERE slug = 'diving')
WHERE id IN (
  SELECT bp.id FROM blog_posts bp
  JOIN blog_categories bc ON bp.category_id = bc.id
  WHERE bc.slug = 'conditions'
  AND (
    bp.title ILIKE '%shark%' OR
    bp.title ILIKE '%kingfish%' OR
    bp.title ILIKE '%facilities%' OR
    bp.title ILIKE '%dive season%'
  )
);
