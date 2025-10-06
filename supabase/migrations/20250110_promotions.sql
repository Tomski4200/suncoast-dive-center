-- Create promotions table
CREATE TABLE IF NOT EXISTS promotions (
  id SERIAL PRIMARY KEY,
  location TEXT NOT NULL UNIQUE, -- e.g., 'homepage_banner', 'checkout_banner', etc.
  heading TEXT NOT NULL,
  subheading TEXT,
  button_text TEXT,
  button_link TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS
ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (active promotions only)
CREATE POLICY "Active promotions are viewable by everyone"
  ON promotions FOR SELECT
  USING (is_active = true);

-- Create policy for authenticated users to manage
CREATE POLICY "Authenticated users can manage promotions"
  ON promotions FOR ALL
  USING (auth.role() = 'authenticated');

-- Insert default homepage banner promotion
INSERT INTO promotions (location, heading, subheading, button_text, button_link, is_active) VALUES
  ('homepage_banner', '20% Off Your First Purchase', 'Sign up for our newsletter and receive an exclusive discount on your first order', 'Shop Now', '/diveshop', true)
ON CONFLICT (location) DO NOTHING;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_promotions_location ON promotions(location);
CREATE INDEX IF NOT EXISTS idx_promotions_is_active ON promotions(is_active);
