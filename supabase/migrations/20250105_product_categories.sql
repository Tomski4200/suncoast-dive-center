-- Create product_categories table
CREATE TABLE IF NOT EXISTS product_categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS on product_categories
ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Product categories are viewable by everyone" 
  ON product_categories FOR SELECT 
  USING (true);

-- Create policy for authenticated users to manage
CREATE POLICY "Authenticated users can manage categories" 
  ON product_categories FOR ALL 
  USING (auth.role() = 'authenticated');

-- Insert categories based on existing product data
INSERT INTO product_categories (name, slug, display_order) VALUES
  ('Regulators', 'regulators', 1),
  ('BCDs', 'bcds', 2),
  ('Computers', 'computers', 3),
  ('Wetsuits', 'wetsuits', 4),
  ('Masks', 'masks', 5),
  ('Fins', 'fins', 6),
  ('Snorkels', 'snorkels', 7),
  ('Gauges', 'gauges', 8),
  ('Accessories', 'accessories', 9),
  ('Lights', 'lights', 10),
  ('Bags', 'bags', 11),
  ('Knives', 'knives', 12),
  ('Spearguns', 'spearguns', 13),
  ('Gloves', 'gloves', 14),
  ('Apparel', 'apparel', 15),
  ('Packages', 'packages', 16),
  ('Services', 'services', 17),
  ('Used', 'used', 18)
ON CONFLICT (name) DO NOTHING;

-- Add category_id column to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS category_id INTEGER;

-- Add foreign key constraint
ALTER TABLE products 
  ADD CONSTRAINT fk_products_category 
  FOREIGN KEY (category_id) 
  REFERENCES product_categories(id) 
  ON DELETE SET NULL;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);

-- Update existing products to use category IDs
UPDATE products SET category_id = (
  SELECT id FROM product_categories 
  WHERE product_categories.name = products.category
)
WHERE category IS NOT NULL;

-- Create a view for convenient product queries with category names
CREATE OR REPLACE VIEW products_with_categories AS
SELECT 
  p.*,
  pc.name as category_name,
  pc.slug as category_slug
FROM products p
LEFT JOIN product_categories pc ON p.category_id = pc.id;