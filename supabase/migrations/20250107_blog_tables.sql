-- Create blog categories table
CREATE TABLE IF NOT EXISTS blog_categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create blog posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id SERIAL PRIMARY KEY,
  category_id INTEGER NOT NULL REFERENCES blog_categories(id) ON DELETE CASCADE,
  author TEXT NOT NULL,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt_text TEXT,
  short_blog_entry TEXT,
  content TEXT,
  featured_image_url TEXT,
  is_published BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  published_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_blog_posts_category_id ON blog_posts(category_id);
CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_posts_published_date ON blog_posts(published_date DESC);
CREATE INDEX idx_blog_posts_is_published ON blog_posts(is_published);

-- Enable RLS
ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Blog categories are viewable by everyone"
  ON blog_categories FOR SELECT USING (true);

CREATE POLICY "Published blog posts are viewable by everyone"
  ON blog_posts FOR SELECT USING (is_published = true);

-- Create policies for authenticated users to manage
CREATE POLICY "Authenticated users can manage blog categories"
  ON blog_categories FOR ALL
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage blog posts"
  ON blog_posts FOR ALL
  USING (auth.role() = 'authenticated');

-- Insert blog categories
INSERT INTO blog_categories (name, slug, description, display_order) VALUES
  ('Scalloping', 'scalloping', 'Updates about scallop season and scalloping adventures', 1),
  ('Lobstering', 'lobstering', 'Lobster season reports and mini-season updates', 2),
  ('Wildlife', 'wildlife', 'Marine life encounters including whale sharks and other sea creatures', 3),
  ('Conditions', 'conditions', 'Water visibility, temperature, and diving condition reports', 4),
  ('Seasonal', 'seasonal', 'Seasonal updates, sales, and dive season announcements', 5),
  ('Equipment', 'equipment', 'Dive gear, equipment, and facility information', 6)
ON CONFLICT (slug) DO NOTHING;

-- Helper function to determine category_id based on content
CREATE OR REPLACE FUNCTION get_blog_category(p_title TEXT, p_content TEXT)
RETURNS INTEGER AS $$
DECLARE
  v_category_id INTEGER;
  v_title_lower TEXT := LOWER(p_title);
  v_content_lower TEXT := LOWER(p_content);
BEGIN
  -- Check for scalloping
  IF v_title_lower LIKE '%scallop%' OR v_content_lower LIKE '%scallop%' THEN
    SELECT id INTO v_category_id FROM blog_categories WHERE slug = 'scalloping';
    RETURN v_category_id;
  END IF;

  -- Check for lobstering
  IF v_title_lower LIKE '%lobster%' OR v_content_lower LIKE '%lobster%' THEN
    SELECT id INTO v_category_id FROM blog_categories WHERE slug = 'lobstering';
    RETURN v_category_id;
  END IF;

  -- Check for wildlife (whale, shark)
  IF v_title_lower LIKE '%whale%' OR v_content_lower LIKE '%whale%' OR
     v_title_lower LIKE '%shark%' OR v_content_lower LIKE '%shark%' THEN
    SELECT id INTO v_category_id FROM blog_categories WHERE slug = 'wildlife';
    RETURN v_category_id;
  END IF;

  -- Check for seasonal
  IF v_title_lower LIKE '%sale%' OR v_title_lower LIKE '%season%' OR
     v_title_lower LIKE '%memorial%' OR v_content_lower LIKE '%sale%' THEN
    SELECT id INTO v_category_id FROM blog_categories WHERE slug = 'seasonal';
    RETURN v_category_id;
  END IF;

  -- Check for equipment/gear
  IF v_title_lower LIKE '%gear%' OR v_title_lower LIKE '%equipment%' OR
     v_title_lower LIKE '%facilities%' OR v_content_lower LIKE '%equipment%' THEN
    SELECT id INTO v_category_id FROM blog_categories WHERE slug = 'equipment';
    RETURN v_category_id;
  END IF;

  -- Default to conditions
  SELECT id INTO v_category_id FROM blog_categories WHERE slug = 'conditions';
  RETURN v_category_id;
END;
$$ LANGUAGE plpgsql;

-- Insert blog posts from blogs.json
-- Post 1
INSERT INTO blog_posts (category_id, author, title, slug, excerpt_text, short_blog_entry, content, published_date, is_featured)
VALUES (
  get_blog_category('The water is starting to clean up with cooler temperatures ahead.', 'With the recent cooler weather the viability has started to clean up. Reports from 35 ft out to 70ft have been 15-25ft. Gag grouper...'),
  'suncoastdivecenter',
  'The water is starting to clean up with cooler temperatures ahead.',
  'the-water-is-starting-to-clean-up-with-cooler-temperatures-ahead-1',
  'With the recent cooler weather the viability has started to clean up. Reports from 35 ft out to 70ft have been 15-25ft. Gag grouper...',
  'The water conditions are changing! ''The water is starting to clean up with cooler temperatures ahead.'' was the report from suncoastdivecenter on Sep 13, 2025. Visibility is improving, ranging from 15-25ft with cooler temperatures. It''s time to dive!',
  E'With the recent cooler weather the viability has started to clean up. Reports from 35 ft out to 70ft have been 15-25ft. Gag grouper...\n\nThe water conditions are changing! ''The water is starting to clean up with cooler temperatures ahead.'' was the report from suncoastdivecenter on Sep 13, 2025. Visibility is improving, ranging from 15-25ft with cooler temperatures. It''s time to dive!',
  '2025-09-13',
  true
);

-- Post 2
INSERT INTO blog_posts (category_id, author, title, slug, excerpt_text, short_blog_entry, content, published_date)
VALUES (
  get_blog_category('Scallop season winding down and lobster season a full send.', 'Scallop season has been very productive over the last few weeks and is coming to an end. Lobster season is just getting started. Mini...'),
  'Chad Campbell',
  'Scallop season winding down and lobster season a full send.',
  'scallop-season-winding-down-and-lobster-season-a-full-send-2',
  'Scallop season has been very productive over the last few weeks and is coming to an end. Lobster season is just getting started. Mini...',
  'Get your nets ready for lobster season! According to Chad Campbell''s post, ''Scallop season winding down and lobster season a full send.'', on Aug 4, 2025, the season is a ''full send'' and mini-season has been a huge success, with ''plenty of bugs'' around.',
  E'Scallop season has been very productive over the last few weeks and is coming to an end. Lobster season is just getting started. Mini...\n\nGet your nets ready for lobster season! According to Chad Campbell''s post, ''Scallop season winding down and lobster season a full send.'', on Aug 4, 2025, the season is a ''full send'' and mini-season has been a huge success, with ''plenty of bugs'' around.',
  '2025-08-04'
);

-- Post 3
INSERT INTO blog_posts (category_id, author, title, slug, excerpt_text, short_blog_entry, content, published_date)
VALUES (
  get_blog_category('Scallop season is off and running. Next up Mini season!', 'Scallops are plentiful this year. Most people have been finding them between 5-10 ft in the clean waters off Pasco County. The people...'),
  'Chad Campbell',
  'Scallop season is off and running. Next up Mini season!',
  'scallop-season-is-off-and-running-next-up-mini-season-3',
  'Scallops are plentiful this year. Most people have been finding them between 5-10 ft in the clean waters off Pasco County. The people...',
  'Dive in! Scallop season is in full swing. ''Scallop season is off and running. Next up Mini season!''! As noted on Jul 23, 2025 by Chad Campbell, the waters are productive, with many finding scallops between 5-10 ft.',
  E'Scallops are plentiful this year. Most people have been finding them between 5-10 ft in the clean waters off Pasco County. The people...\n\nDive in! Scallop season is in full swing. ''Scallop season is off and running. Next up Mini season!''! As noted on Jul 23, 2025 by Chad Campbell, the waters are productive, with many finding scallops between 5-10 ft.',
  '2025-07-23'
);

-- Post 4
INSERT INTO blog_posts (category_id, author, title, slug, excerpt_text, short_blog_entry, content, published_date)
VALUES (
  get_blog_category('Scallop Time!', 'It''s that time of year again for those tasty morsels. Crystal River opened up yesterday, July 1st, and what a day it was. There are...'),
  'Chad Campbell',
  'Scallop Time!',
  'scallop-time-4',
  'It''s that time of year again for those tasty morsels. Crystal River opened up yesterday, July 1st, and what a day it was. There are...',
  'Dive in! Scallop season is in full swing. ''Scallop Time!''! As noted on Jul 2, 2025 by Chad Campbell, the waters are productive, with Crystal River having just opened and reporting an abundance of the tasty morsels.',
  E'It''s that time of year again for those tasty morsels. Crystal River opened up yesterday, July 1st, and what a day it was. There are...\n\nDive in! Scallop season is in full swing. ''Scallop Time!''! As noted on Jul 2, 2025 by Chad Campbell, the waters are productive, with Crystal River having just opened and reporting an abundance of the tasty morsels.',
  '2025-07-02'
);

-- Post 5
INSERT INTO blog_posts (category_id, author, title, slug, excerpt_text, short_blog_entry, content, published_date)
VALUES (
  get_blog_category('The water is clear and warm.', 'The water up off of Clearwater is almost top to bottom in 50ft . Off Pinellas county we only have 10-15ft but at least the water is 80...'),
  'Chad Campbell',
  'The water is clear and warm.',
  'the-water-is-clear-and-warm-5',
  'The water up off of Clearwater is almost top to bottom in 50ft . Off Pinellas county we only have 10-15ft but at least the water is 80...',
  'The water conditions are changing! ''The water is clear and warm.'' was the report from Chad Campbell on Jun 20, 2025. Visibility is improving, with the water up off of Clearwater being almost top to bottom in 50ft, making for excellent diving!',
  E'The water up off of Clearwater is almost top to bottom in 50ft . Off Pinellas county we only have 10-15ft but at least the water is 80...\n\nThe water conditions are changing! ''The water is clear and warm.'' was the report from Chad Campbell on Jun 20, 2025. Visibility is improving, with the water up off of Clearwater being almost top to bottom in 50ft, making for excellent diving!',
  '2025-06-20'
);

-- Post 6
INSERT INTO blog_posts (category_id, author, title, slug, excerpt_text, short_blog_entry, content, published_date)
VALUES (
  get_blog_category('Exploring the Essentials of Scuba Diving Facilities', 'Scuba diving is an exhilarating adventure that allows you to explore the underwater world in a way that few other activities can. From...'),
  'Chad Campbell',
  'Exploring the Essentials of Scuba Diving Facilities',
  'exploring-the-essentials-of-scuba-diving-facilities-6',
  'Scuba diving is an exhilarating adventure that allows you to explore the underwater world in a way that few other activities can. From...',
  'A new update is here: ''Exploring the Essentials of Scuba Diving Facilities''! Posted on Jun 11, 2025 by Chad Campbell, the post''s excerpt says: ''Scuba diving is an exhilarating adventure that allows you to explore the underwater world in a way that few other activities can. From...'' Check out the full post for more details on the current dive conditions and news.',
  E'Scuba diving is an exhilarating adventure that allows you to explore the underwater world in a way that few other activities can. From...\n\nA new update is here: ''Exploring the Essentials of Scuba Diving Facilities''! Posted on Jun 11, 2025 by Chad Campbell, the post''s excerpt says: ''Scuba diving is an exhilarating adventure that allows you to explore the underwater world in a way that few other activities can. From...'' Check out the full post for more details on the current dive conditions and news.',
  '2025-06-11'
);

-- Post 7
INSERT INTO blog_posts (category_id, author, title, slug, excerpt_text, short_blog_entry, content, published_date)
VALUES (
  get_blog_category('the Whale sharks have arrived', 'Whale Shark Migration The whale sharks are currently migrating in the Gulf, making their way north. This annual event attracts divers and...'),
  'Chad Campbell',
  'the Whale sharks have arrived',
  'the-whale-sharks-have-arrived-7',
  'Whale Shark Migration The whale sharks are currently migrating in the Gulf, making their way north. This annual event attracts divers and...',
  'Gentle giants have arrived! ''the Whale sharks have arrived'' announced Chad Campbell on Jun 5, 2025. These majestic whale sharks are migrating in the Gulf, making their way north and attracting divers.',
  E'Whale Shark Migration The whale sharks are currently migrating in the Gulf, making their way north. This annual event attracts divers and...\n\nGentle giants have arrived! ''the Whale sharks have arrived'' announced Chad Campbell on Jun 5, 2025. These majestic whale sharks are migrating in the Gulf, making their way north and attracting divers.',
  '2025-06-05'
);

-- Post 8
INSERT INTO blog_posts (category_id, author, title, slug, excerpt_text, short_blog_entry, content, published_date)
VALUES (
  get_blog_category('Perfect Waters and Exciting Sales: Memorial Day Weekend in Florida', 'The water is absolutely perfect on both sides of Florida. On the West coast it is top to bottom vis in Pinellas County and 78 degrees...'),
  'Chad Campbell',
  'Perfect Waters and Exciting Sales: Memorial Day Weekend in Florida',
  'perfect-waters-and-exciting-sales-memorial-day-weekend-in-8',
  'The water is absolutely perfect on both sides of Florida. On the West coast it is top to bottom vis in Pinellas County and 78 degrees...',
  'The water conditions are changing! ''Perfect Waters and Exciting Sales: Memorial Day Weekend in Florida'' was the report from Chad Campbell on May 22, 2025. The water is absolutely perfect on both sides of Florida, with top to bottom visibility in Pinellas County. It''s time to dive!',
  E'The water is absolutely perfect on both sides of Florida. On the West coast it is top to bottom vis in Pinellas County and 78 degrees...\n\nThe water conditions are changing! ''Perfect Waters and Exciting Sales: Memorial Day Weekend in Florida'' was the report from Chad Campbell on May 22, 2025. The water is absolutely perfect on both sides of Florida, with top to bottom visibility in Pinellas County. It''s time to dive!',
  '2025-05-22'
);

-- Continue with remaining posts (9-47)...
-- Post 9
INSERT INTO blog_posts (category_id, author, title, slug, excerpt_text, short_blog_entry, content, published_date)
VALUES (
  get_blog_category('The Water is Warm and Clear!', 'The water is finally 78 degrees and clear. There is a Thermocline out past 80ft. The water south of the channel is top to bottom Vis.'),
  'Chad Campbell',
  'The Water is Warm and Clear!',
  'the-water-is-warm-and-clear-9',
  'The water is finally 78 degrees and clear. There is a Thermocline out past 80ft. The water south of the channel is top to bottom Vis. ',
  'The water conditions are changing! ''The Water is Warm and Clear!'' was the report from Chad Campbell on May 8, 2025. The water is finally 78 degrees with clear, top-to-bottom visibility south of the channel. It''s time to dive!',
  E'The water is finally 78 degrees and clear. There is a Thermocline out past 80ft. The water south of the channel is top to bottom Vis.\n\nThe water conditions are changing! ''The Water is Warm and Clear!'' was the report from Chad Campbell on May 8, 2025. The water is finally 78 degrees with clear, top-to-bottom visibility south of the channel. It''s time to dive!',
  '2025-05-08'
);

-- Post 10
INSERT INTO blog_posts (category_id, author, title, slug, excerpt_text, short_blog_entry, content, published_date)
VALUES (
  get_blog_category('THE WATER IS FINALLY CLEANING UP!!!', 'After what seems like forever, the water is finally getting clean. Between two hurricanes and snowstorms in Florida, we can finally start...'),
  'Chad Campbell',
  'THE WATER IS FINALLY CLEANING UP!!!',
  'the-water-is-finally-cleaning-up-10',
  'After what seems like forever, the water is finally getting clean. Between two hurricanes and snowstorms in Florida, we can finally start...',
  'Weather conditions impact the dive! In the post ''THE WATER IS FINALLY CLEANING UP!!!'' from Apr 18, 2025, Chad Campbell discusses the effects of a hurricane or cold front. Visibility is finally cleaning up after what seemed like forever, and dive season is ready to resume.',
  E'After what seems like forever, the water is finally getting clean. Between two hurricanes and snowstorms in Florida, we can finally start...\n\nWeather conditions impact the dive! In the post ''THE WATER IS FINALLY CLEANING UP!!!'' from Apr 18, 2025, Chad Campbell discusses the effects of a hurricane or cold front. Visibility is finally cleaning up after what seemed like forever, and dive season is ready to resume.',
  '2025-04-18'
);

-- Post 11
INSERT INTO blog_posts (category_id, author, title, slug, excerpt_text, short_blog_entry, content, published_date)
VALUES (
  get_blog_category('Dive Season is Here!!!', 'As the weather warms up and the days grow longer, divers everywhere are gearing up for an exciting dive season. Whether you''re a seasoned...'),
  'suncoastdivecenter',
  'Dive Season is Here!!!',
  'dive-season-is-here-11',
  'As the weather warms up and the days grow longer, divers everywhere are gearing up for an exciting dive season. Whether you''re a seasoned...',
  'A new update is here: ''Dive Season is Here!!!''! Posted on Apr 2, 2025 by suncoastdivecenter, the post''s excerpt says: ''As the weather warms up and the days grow longer, divers everywhere are gearing up for an exciting dive season. Whether you''re a seasoned...'' Check out the full post for more details on the current dive conditions and news.',
  E'As the weather warms up and the days grow longer, divers everywhere are gearing up for an exciting dive season. Whether you''re a seasoned...\n\nA new update is here: ''Dive Season is Here!!!''! Posted on Apr 2, 2025 by suncoastdivecenter, the post''s excerpt says: ''As the weather warms up and the days grow longer, divers everywhere are gearing up for an exciting dive season. Whether you''re a seasoned...'' Check out the full post for more details on the current dive conditions and news.',
  '2025-04-02'
);

-- Post 12
INSERT INTO blog_posts (category_id, author, title, slug, excerpt_text, short_blog_entry, content, published_date)
VALUES (
  get_blog_category('Gearing up for LOBSTER SEASON!!! Scallop season initial reports!', 'With Sportman season getting ready to start July 26 and 27th of 2023 ; we are in full blown summer mode. The 2 day season is set to...'),
  'Chad Campbell',
  'Gearing up for LOBSTER SEASON!!! Scallop season initial reports!',
  'gearing-up-for-lobster-season-scallop-season-initial-repo-12',
  'With Sportman season getting ready to start July 26 and 27th of 2023 ; we are in full blown summer mode. The 2 day season is set to...',
  'Get your nets ready for lobster season! According to Chad Campbell''s post, ''Gearing up for LOBSTER SEASON!!! Scallop season initial reports!'', on Jul 7, 2023, the season is a ''full send'' and mini-season has been a huge success, with ''plenty of bugs'' around.',
  E'With Sportman season getting ready to start July 26 and 27th of 2023 ; we are in full blown summer mode. The 2 day season is set to...\n\nGet your nets ready for lobster season! According to Chad Campbell''s post, ''Gearing up for LOBSTER SEASON!!! Scallop season initial reports!'', on Jul 7, 2023, the season is a ''full send'' and mini-season has been a huge success, with ''plenty of bugs'' around.',
  '2023-07-07'
);

-- Post 13
INSERT INTO blog_posts (category_id, author, title, slug, excerpt_text, short_blog_entry, content, published_date)
VALUES (
  get_blog_category('Scallop season opens in Pasco July 1st!!!', 'Scallop season starts this weekend out of Pasco. Check with myfwc.com for all the updated info and regions. Red snapper season started...'),
  'Chad Campbell',
  'Scallop season opens in Pasco July 1st!!!',
  'scallop-season-opens-in-pasco-july-1st-13',
  'Scallop season starts this weekend out of Pasco. Check with myfwc.com for all the updated info and regions. Red snapper season started...',
  'Dive in! Scallop season is in full swing. ''Scallop season opens in Pasco July 1st!!!''! As noted on Jun 28, 2023 by Chad Campbell, the waters are productive, with the season starting this weekend out of Pasco.',
  E'Scallop season starts this weekend out of Pasco. Check with myfwc.com for all the updated info and regions. Red snapper season started...\n\nDive in! Scallop season is in full swing. ''Scallop season opens in Pasco July 1st!!!''! As noted on Jun 28, 2023 by Chad Campbell, the waters are productive, with the season starting this weekend out of Pasco.',
  '2023-06-28'
);

-- Post 14
INSERT INTO blog_posts (category_id, author, title, slug, excerpt_text, short_blog_entry, content, published_date)
VALUES (
  get_blog_category('Red Snapper and Scallops', 'Summer is definantly in full swing and plenty to keep us all busy over the next several months. Red snapper season opens this Friday and...'),
  'Chad Campbell',
  'Red Snapper and Scallops',
  'red-snapper-and-scallops-14',
  'Summer is definantly in full swing and plenty to keep us all busy over the next several months. Red snapper season opens this Friday and...',
  'Dive in! Scallop season is in full swing. ''Red Snapper and Scallops''! As noted on Jun 14, 2023 by Chad Campbell, the waters are productive, with summer keeping everyone busy and red snapper season opening this Friday.',
  E'Summer is definantly in full swing and plenty to keep us all busy over the next several months. Red snapper season opens this Friday and...\n\nDive in! Scallop season is in full swing. ''Red Snapper and Scallops''! As noted on Jun 14, 2023 by Chad Campbell, the waters are productive, with summer keeping everyone busy and red snapper season opening this Friday.',
  '2023-06-14'
);

-- Post 15
INSERT INTO blog_posts (category_id, author, title, slug, excerpt_text, short_blog_entry, content, published_date)
VALUES (
  get_blog_category('Memorial Day', 'This weekend looks to be one of the best all year. With water temps. in the high 70''s and low 80''s depending on where you are on the...'),
  'Chad Campbell',
  'Memorial Day',
  'memorial-day-15',
  'This weekend looks to be one of the best all year. With water temps. in the high 70''s and low 80''s depending on where you are on the...',
  'The water conditions are changing! ''Memorial Day'' was the report from Chad Campbell on May 27, 2023. This weekend looks to be one of the best all year, with water temps in the high 70''s and low 80''s. It''s time to dive!',
  E'This weekend looks to be one of the best all year. With water temps. in the high 70''s and low 80''s depending on where you are on the...\n\nThe water conditions are changing! ''Memorial Day'' was the report from Chad Campbell on May 27, 2023. This weekend looks to be one of the best all year, with water temps in the high 70''s and low 80''s. It''s time to dive!',
  '2023-05-27'
);

-- Post 16
INSERT INTO blog_posts (category_id, author, title, slug, excerpt_text, short_blog_entry, content, published_date)
VALUES (
  get_blog_category('The Whale Sharks are starting to move.', 'There have been a few sightings over the past week South of the channel in 100+ foot of water of these gentle giants. This weekend might...'),
  'Chad Campbell',
  'The Whale Sharks are starting to move.',
  'the-whale-sharks-are-starting-to-move-16',
  'There have been a few sightings over the past week South of the channel in 100+ foot of water of these gentle giants. This weekend might...',
  'Gentle giants have arrived! ''The Whale Sharks are starting to move.'' announced Chad Campbell on May 11, 2023. These majestic whale sharks are migrating in the Gulf, with a few sightings over the past week in 100+ foot of water.',
  E'There have been a few sightings over the past week South of the channel in 100+ foot of water of these gentle giants. This weekend might...\n\nGentle giants have arrived! ''The Whale Sharks are starting to move.'' announced Chad Campbell on May 11, 2023. These majestic whale sharks are migrating in the Gulf, with a few sightings over the past week in 100+ foot of water.',
  '2023-05-11'
);

-- Post 17
INSERT INTO blog_posts (category_id, author, title, slug, excerpt_text, short_blog_entry, content, published_date)
VALUES (
  get_blog_category('Whale Sharks in 60ft!!!!', 'We have been seeing a few whale sharks as shallow as 60 ft off Johns pass. The water temps are now in the 70''s in 50ft and a little...'),
  'suncoastdivecenter',
  'Whale Sharks in 60ft!!!!',
  'whale-sharks-in-60ft-17',
  'We have been seeing a few whale sharks as shallow as 60 ft off Johns pass. The water temps are now in the 70''s in 50ft and a little...',
  'Gentle giants have arrived! ''Whale Sharks in 60ft!!!!'' announced suncoastdivecenter on Apr 22, 2023. These majestic whale sharks are migrating in the Gulf, with sightings reported in waters as shallow as 60ft off Johns pass.',
  E'We have been seeing a few whale sharks as shallow as 60 ft off Johns pass. The water temps are now in the 70''s in 50ft and a little...\n\nGentle giants have arrived! ''Whale Sharks in 60ft!!!!'' announced suncoastdivecenter on Apr 22, 2023. These majestic whale sharks are migrating in the Gulf, with sightings reported in waters as shallow as 60ft off Johns pass.',
  '2023-04-22'
);

-- Post 18
INSERT INTO blog_posts (category_id, author, title, slug, excerpt_text, short_blog_entry, content, published_date)
VALUES (
  get_blog_category('Water and Temps are a go !! + Whale Shark ''s', 'This week we have had unseasonably warmer weather and calm water. The vis. is the best we have seen in 8 months. Water vis in 60 ft is...'),
  'suncoastdivecenter',
  'Water and Temps are a go !! + Whale Shark ''s',
  'water-and-temps-are-a-go-whale-shark-s-18',
  'This week we have had unseasonably warmer weather and calm water. The vis. is the best we have seen in 8 months. Water vis in 60 ft is...',
  'Gentle giants have arrived! ''Water and Temps are a go !! + Whale Shark ''s'' announced suncoastdivecenter on Apr 6, 2023. These majestic whale sharks are migrating in the Gulf, with unseasonably warmer weather bringing calm water and the best visibility seen in 8 months.',
  E'This week we have had unseasonably warmer weather and calm water. The vis. is the best we have seen in 8 months. Water vis in 60 ft is...\n\nGentle giants have arrived! ''Water and Temps are a go !! + Whale Shark ''s'' announced suncoastdivecenter on Apr 6, 2023. These majestic whale sharks are migrating in the Gulf, with unseasonably warmer weather bringing calm water and the best visibility seen in 8 months.',
  '2023-04-06'
);

-- Post 19
INSERT INTO blog_posts (category_id, author, title, slug, excerpt_text, short_blog_entry, content, published_date)
VALUES (
  get_blog_category('Great Whites in the gulf!!!', 'It''s that time of year where the great white sharks start to make thier migration south from the Gulf of Mexico around the Florida Keys...'),
  'suncoastdivecenter',
  'Great Whites in the gulf!!!',
  'great-whites-in-the-gulf-19',
  'It''s that time of year where the great white sharks start to make thier migration south from the Gulf of Mexico around the Florida Keys...',
  'A new update is here: ''Great Whites in the gulf!!!''! Posted on Mar 16, 2023 by suncoastdivecenter, the post''s excerpt says: ''It''s that time of year where the great white sharks start to make thier migration south from the Gulf of Mexico around the Florida Keys...'' Check out the full post for more details on the current dive conditions and news.',
  E'It''s that time of year where the great white sharks start to make thier migration south from the Gulf of Mexico around the Florida Keys...\n\nA new update is here: ''Great Whites in the gulf!!!''! Posted on Mar 16, 2023 by suncoastdivecenter, the post''s excerpt says: ''It''s that time of year where the great white sharks start to make thier migration south from the Gulf of Mexico around the Florida Keys...'' Check out the full post for more details on the current dive conditions and news.',
  '2023-03-16'
);

-- Post 20
INSERT INTO blog_posts (category_id, author, title, slug, excerpt_text, short_blog_entry, content, published_date)
VALUES (
  get_blog_category('It was fun while it lasted!', 'After this last weeks cold front visibility went from 40+ foot in the Gulf to less than a foot. With warmer temps and calmer weather...'),
  'suncoastdivecenter',
  'It was fun while it lasted!',
  'it-was-fun-while-it-lasted-20',
  'After this last weeks cold front visibility went from 40+ foot in the Gulf to less than a foot. With warmer temps and calmer weather...',
  'Weather conditions impact the dive! In the post ''It was fun while it lasted!'' from Feb 17, 2023, suncoastdivecenter discusses the effects of a hurricane or cold front. Visibility went from 40+ foot in the Gulf to less than a foot after the last cold front, but warmer temps are expected to help it recover.',
  E'After this last weeks cold front visibility went from 40+ foot in the Gulf to less than a foot. With warmer temps and calmer weather...\n\nWeather conditions impact the dive! In the post ''It was fun while it lasted!'' from Feb 17, 2023, suncoastdivecenter discusses the effects of a hurricane or cold front. Visibility went from 40+ foot in the Gulf to less than a foot after the last cold front, but warmer temps are expected to help it recover.',
  '2023-02-17'
);

-- Post 21
INSERT INTO blog_posts (category_id, author, title, slug, excerpt_text, short_blog_entry, content, published_date)
VALUES (
  get_blog_category('The water is Warming up.', 'The weather last week was nearly perfect. The water vis. was 40-60ft and 63 degrees. With a front moving in this weekend it will bring...'),
  'suncoastdivecenter',
  'The water is Warming up.',
  'the-water-is-warming-up-21',
  'The weather last week was nearly perfect. The water vis. was 40-60ft and 63 degrees. With a front moving in this weekend it will bring...',
  'The water conditions are changing! ''The water is Warming up.'' was the report from suncoastdivecenter on Feb 4, 2023. The weather last week was nearly perfect with 40-60ft visibility, though a new front is moving in. It''s time to dive!',
  E'The weather last week was nearly perfect. The water vis. was 40-60ft and 63 degrees. With a front moving in this weekend it will bring...\n\nThe water conditions are changing! ''The water is Warming up.'' was the report from suncoastdivecenter on Feb 4, 2023. The weather last week was nearly perfect with 40-60ft visibility, though a new front is moving in. It''s time to dive!',
  '2023-02-04'
);

-- Post 22
INSERT INTO blog_posts (category_id, author, title, slug, excerpt_text, short_blog_entry, content, published_date)
VALUES (
  get_blog_category('Water will warm up this week.', 'Most people do not realize that Florida has some brutal winter temps for us locals. The water right ranges this time of year between 55...'),
  'suncoastdivecenter',
  'Water will warm up this week.',
  'water-will-warm-up-this-week-22',
  'Most people do not realize that Florida has some brutal winter temps for us locals. The water right ranges this time of year between 55...',
  'The water conditions are changing! ''Water will warm up this week.'' was the report from suncoastdivecenter on Jan 20, 2023. This time of year brings brutal winter temps, with water right now ranging between 55-60 degrees. It''s time to dive!',
  E'Most people do not realize that Florida has some brutal winter temps for us locals. The water right ranges this time of year between 55...\n\nThe water conditions are changing! ''Water will warm up this week.'' was the report from suncoastdivecenter on Jan 20, 2023. This time of year brings brutal winter temps, with water right now ranging between 55-60 degrees. It''s time to dive!',
  '2023-01-20'
);

-- Post 23
INSERT INTO blog_posts (category_id, author, title, slug, excerpt_text, short_blog_entry, content, published_date)
VALUES (
  get_blog_category('Water Vis!!', 'Visibility in the Gulf has improved this week after the masssive cold front. In 60ft it was Top to bottom and 59 degrees. With the...'),
  'suncoastdivecenter',
  'Water Vis!!',
  'water-vis-23',
  'Visibility in the Gulf has improved this week after the masssive cold front. In 60ft it was Top to bottom and 59 degrees. With the...',
  'The water conditions are changing! ''Water Vis!!'' was the report from suncoastdivecenter on Jan 9, 2023. Visibility in the Gulf has improved after a massive cold front, showing ''Top to bottom'' in 60ft of water at 59 degrees. It''s time to dive!',
  E'Visibility in the Gulf has improved this week after the masssive cold front. In 60ft it was Top to bottom and 59 degrees. With the...\n\nThe water conditions are changing! ''Water Vis!!'' was the report from suncoastdivecenter on Jan 9, 2023. Visibility in the Gulf has improved after a massive cold front, showing ''Top to bottom'' in 60ft of water at 59 degrees. It''s time to dive!',
  '2023-01-09'
);

-- Post 24
INSERT INTO blog_posts (category_id, author, title, slug, excerpt_text, short_blog_entry, content, published_date)
VALUES (
  get_blog_category('Last Call.', 'With this weeks blistering cold front the red tide has subsided for now. The weather brought rough and cold conditions to Florida.'),
  'suncoastdivecenter',
  'Last Call.',
  'last-call-24',
  'With this weeks blistering cold front the red tide has subsided for now. The weather brought rough and cold conditions to Florida. ',
  'Beware of the red tide. On Dec 30, 2022, suncoastdivecenter warned in ''Last Call.'' that with the weeks blistering cold front, the red tide has subsided for now, though it brought rough and cold conditions to Florida.',
  E'With this weeks blistering cold front the red tide has subsided for now. The weather brought rough and cold conditions to Florida.\n\nBeware of the red tide. On Dec 30, 2022, suncoastdivecenter warned in ''Last Call.'' that with the weeks blistering cold front, the red tide has subsided for now, though it brought rough and cold conditions to Florida.',
  '2022-12-30'
);

-- Post 25
INSERT INTO blog_posts (category_id, author, title, slug, excerpt_text, short_blog_entry, content, published_date)
VALUES (
  get_blog_category('Red Tide is back!!!!', 'Unfortuatley red tide has reared it''s ugly head south of John''s Pass. If you are looking for visibility go North off of Clearwater.'),
  'suncoastdivecenter',
  'Red Tide is back!!!!',
  'red-tide-is-back-25',
  'Unfortuatley red tide has reared it''s ugly head south of John''s Pass. If you are looking for visibility go North off of Clearwater. ',
  'Beware of the red tide. On Dec 9, 2022, suncoastdivecenter warned in ''Red Tide is back!!!!'' that red tide had ''reared its ugly head south of John''s Pass,'' suggesting divers head north off of Clearwater for better visibility.',
  E'Unfortuatley red tide has reared it''s ugly head south of John''s Pass. If you are looking for visibility go North off of Clearwater.\n\nBeware of the red tide. On Dec 9, 2022, suncoastdivecenter warned in ''Red Tide is back!!!!'' that red tide had ''reared its ugly head south of John''s Pass,'' suggesting divers head north off of Clearwater for better visibility.',
  '2022-12-09'
);

-- Post 26
INSERT INTO blog_posts (category_id, author, title, slug, excerpt_text, short_blog_entry, content, published_date)
VALUES (
  get_blog_category('Visibility is starting to improve.', 'With all of the hurrricanes and cold front''s hitting us the visibility has been so so. This past week it has started to improve. At 45...'),
  'suncoastdivecenter',
  'Visibility is starting to improve.',
  'visibility-is-starting-to-improve-26',
  'With all of the hurrricanes and cold front''s hitting us the visibility has been so so. This past week it has started to improve. At 45...',
  'The water conditions are changing! ''Visibility is starting to improve.'' was the report from suncoastdivecenter on Dec 2, 2022. Visibility has been poor due to hurricanes and cold fronts but has started to improve, with 25-30ft vis at 45ft deep. It''s time to dive!',
  E'With all of the hurrricanes and cold front''s hitting us the visibility has been so so. This past week it has started to improve. At 45...\n\nThe water conditions are changing! ''Visibility is starting to improve.'' was the report from suncoastdivecenter on Dec 2, 2022. Visibility has been poor due to hurricanes and cold fronts but has started to improve, with 25-30ft vis at 45ft deep. It''s time to dive!',
  '2022-12-02'
);

-- Post 27
INSERT INTO blog_posts (category_id, author, title, slug, excerpt_text, short_blog_entry, content, published_date)
VALUES (
  get_blog_category('Visibility is starting to shape up after the hurricane.', 'The vis. has started improving this week after hurricane Nicole. The vis on Sat 11/17/2022 was less than a foot from 30ft-70ft. On...'),
  'suncoastdivecenter',
  'Visibility is starting to shape up after the hurricane.',
  'visibility-is-starting-to-shape-up-after-the-hurricane-27',
  'The vis. has started improving this week after hurricane Nicole. The vis on Sat 11/17/2022 was less than a foot from 30ft-70ft. On...',
  'Weather conditions impact the dive! In the post ''Visibility is starting to shape up after the hurricane.'' from Nov 17, 2022, suncoastdivecenter discusses the effects of a hurricane or cold front. The visibility has started improving this week after hurricane Nicole, showing a dramatic change from less than a foot to 15-20ft.',
  E'The vis. has started improving this week after hurricane Nicole. The vis on Sat 11/17/2022 was less than a foot from 30ft-70ft. On...\n\nWeather conditions impact the dive! In the post ''Visibility is starting to shape up after the hurricane.'' from Nov 17, 2022, suncoastdivecenter discusses the effects of a hurricane or cold front. The visibility has started improving this week after hurricane Nicole, showing a dramatic change from less than a foot to 15-20ft.',
  '2022-11-17'
);

-- Post 28
INSERT INTO blog_posts (category_id, author, title, slug, excerpt_text, short_blog_entry, content, published_date)
VALUES (
  get_blog_category('Visibility like the Caribbean.', 'We have been waiting along time for vis. like this. Last week we could see the boat in 60ft from the bottom. Anywhere inside of 60ft...'),
  'suncoastdivecenter',
  'Visibility like the Caribbean.',
  'visibility-like-the-caribbean-28',
  'We have been waiting along time for vis. like this. Last week we could see the boat in 60ft from the bottom. Anywhere inside of 60ft...',
  'The water conditions are changing! ''Visibility like the Caribbean.'' was the report from suncoastdivecenter on Nov 7, 2022. Divers have been waiting a long time for vis like this, with the ability to see the boat from the bottom in 60ft. It''s time to dive!',
  E'We have been waiting along time for vis. like this. Last week we could see the boat in 60ft from the bottom. Anywhere inside of 60ft...\n\nThe water conditions are changing! ''Visibility like the Caribbean.'' was the report from suncoastdivecenter on Nov 7, 2022. Divers have been waiting a long time for vis like this, with the ability to see the boat from the bottom in 60ft. It''s time to dive!',
  '2022-11-07'
);

-- Post 29
INSERT INTO blog_posts (category_id, author, title, slug, excerpt_text, short_blog_entry, content, published_date)
VALUES (
  get_blog_category('Vis is getting good', 'Friday was a great day out on the gulf in 50 ft with visibility being top to bottom. There are plenty of fish and the water looked like...'),
  'suncoastdivecenter',
  'Vis is getting good',
  'vis-is-getting-good-29',
  'Friday was a great day out on the gulf in 50 ft with visibility being top to bottom. There are plenty of fish and the water looked like...',
  'The water conditions are changing! ''Vis is getting good'' was the report from suncoastdivecenter on Oct 19, 2022. Friday was a great day with top-to-bottom visibility in 50 ft, with plenty of fish to be seen. It''s time to dive!',
  E'Friday was a great day out on the gulf in 50 ft with visibility being top to bottom. There are plenty of fish and the water looked like...\n\nThe water conditions are changing! ''Vis is getting good'' was the report from suncoastdivecenter on Oct 19, 2022. Friday was a great day with top-to-bottom visibility in 50 ft, with plenty of fish to be seen. It''s time to dive!',
  '2022-10-19'
);

-- Post 30
INSERT INTO blog_posts (category_id, author, title, slug, excerpt_text, short_blog_entry, content, published_date)
VALUES (
  get_blog_category('Thank You Ian', 'We hope everyone made it through Hurricane Ian ok. Our neighbours 50 miles south of us did not fair so well. We have been doing relief...'),
  'suncoastdivecenter',
  'Thank You Ian',
  'thank-you-ian-30',
  'We hope everyone made it through Hurricane Ian ok. Our neighbours 50 miles south of us did not fair so well. We have been doing relief...',
  'Weather conditions impact the dive! In the post ''Thank You Ian'' from Oct 7, 2022, suncoastdivecenter discusses the effects of a hurricane or cold front. They express well wishes for those affected by Hurricane Ian and note they have been assisting with relief efforts.',
  E'We hope everyone made it through Hurricane Ian ok. Our neighbours 50 miles south of us did not fair so well. We have been doing relief...\n\nWeather conditions impact the dive! In the post ''Thank You Ian'' from Oct 7, 2022, suncoastdivecenter discusses the effects of a hurricane or cold front. They express well wishes for those affected by Hurricane Ian and note they have been assisting with relief efforts.',
  '2022-10-07'
);

-- Post 31
INSERT INTO blog_posts (category_id, author, title, slug, excerpt_text, short_blog_entry, content, published_date)
VALUES (
  get_blog_category('Vis. in the gulf', 'The vis in the gulf can''t make up it''s mind. It hav varried from north, south, shallow and deep. There seems to be pockets of dirty...'),
  'suncoastdivecenter',
  'Vis. in the gulf',
  'vis-in-the-gulf-31',
  'The vis in the gulf can''t make up it''s mind. It hav varried from north, south, shallow and deep. There seems to be pockets of dirty...',
  'The water conditions are changing! ''Vis. in the gulf'' was the report from suncoastdivecenter on Sep 9, 2022. The visibility in the Gulf is unpredictable, varying from north to south and shallow to deep, with pockets of dirty water. It''s time to dive!',
  E'The vis in the gulf can''t make up it''s mind. It hav varried from north, south, shallow and deep. There seems to be pockets of dirty...\n\nThe water conditions are changing! ''Vis. in the gulf'' was the report from suncoastdivecenter on Sep 9, 2022. The visibility in the Gulf is unpredictable, varying from north to south and shallow to deep, with pockets of dirty water. It''s time to dive!',
  '2022-09-09'
);

-- Post 32
INSERT INTO blog_posts (category_id, author, title, slug, excerpt_text, short_blog_entry, content, published_date)
VALUES (
  get_blog_category('Vis is better North of Johns pass', 'The Visibility is getting better north of Johns pass. Out of Johns pass we have had anywhere from 5ft in 120 ft of water to 12 ft in...'),
  'suncoastdivecenter',
  'Vis is better North of Johns pass',
  'vis-is-better-north-of-johns-pass-32',
  'The Visibility is getting better north of Johns pass. Out of Johns pass we have had anywhere from 5ft in 120 ft of water to 12 ft in...',
  'The water conditions are changing! ''Vis is better North of Johns pass'' was the report from suncoastdivecenter on Aug 19, 2022. Visibility is improving north of Johns pass, while the area out of Johns pass has varied from 5ft to 12ft. It''s time to dive!',
  E'The Visibility is getting better north of Johns pass. Out of Johns pass we have had anywhere from 5ft in 120 ft of water to 12 ft in...\n\nThe water conditions are changing! ''Vis is better North of Johns pass'' was the report from suncoastdivecenter on Aug 19, 2022. Visibility is improving north of Johns pass, while the area out of Johns pass has varied from 5ft to 12ft. It''s time to dive!',
  '2022-08-19'
);

-- Post 33
INSERT INTO blog_posts (category_id, author, title, slug, excerpt_text, short_blog_entry, content, published_date)
VALUES (
  get_blog_category('It''s officially the start of lobster season.', 'Lobster season officially starts today Aug 6. After mini season it looks like a great year to be a diver. There is plenty of bugs...'),
  'suncoastdivecenter',
  'It''s officially the start of lobster season.',
  'its-officially-the-start-of-lobster-season-33',
  'Lobster season officially starts today Aug 6. After mini season it looks like a great year to be a diver. There is plenty of bugs...',
  'Get your nets ready for lobster season! According to suncoastdivecenter''s post, ''It''s officially the start of lobster season.'', on Aug 6, 2022, the season looks like a great year to be a diver, with plenty of bugs following the mini-season success.',
  E'Lobster season officially starts today Aug 6. After mini season it looks like a great year to be a diver. There is plenty of bugs...\n\nGet your nets ready for lobster season! According to suncoastdivecenter''s post, ''It''s officially the start of lobster season.'', on Aug 6, 2022, the season looks like a great year to be a diver, with plenty of bugs following the mini-season success.',
  '2022-08-06'
);

-- Post 34
INSERT INTO blog_posts (category_id, author, title, slug, excerpt_text, short_blog_entry, content, published_date)
VALUES (
  get_blog_category('Mini Season Success!', 'It has been a successful mini lobster season so far. Plenty of bugs in less than 5 ft of water; So the younger generation of lobster can...'),
  'suncoastdivecenter',
  'Mini Season Success!',
  'mini-season-success-34',
  'It has been a successful mini lobster season so far. Plenty of bugs in less than 5 ft of water; So the younger generation of lobster can...',
  'Get your nets ready for lobster season! According to suncoastdivecenter''s post, ''Mini Season Success!'', on Jul 28, 2022, the season is a ''full send'' and mini-season has been a huge success, with ''plenty of bugs in less than 5 ft of water''.',
  E'It has been a successful mini lobster season so far. Plenty of bugs in less than 5 ft of water; So the younger generation of lobster can...\n\nGet your nets ready for lobster season! According to suncoastdivecenter''s post, ''Mini Season Success!'', on Jul 28, 2022, the season is a ''full send'' and mini-season has been a huge success, with ''plenty of bugs in less than 5 ft of water''.',
  '2022-07-28'
);

-- Post 35
INSERT INTO blog_posts (category_id, author, title, slug, excerpt_text, short_blog_entry, content, published_date)
VALUES (
  get_blog_category('The Count Down to Lobster Mini Season', 'Mini season is approaching quickly. This year it falls on July 27 and 28th. There have been reports of numerous crustaceans crawling...'),
  'suncoastdivecenter',
  'The Count Down to Lobster Mini Season',
  'the-count-down-to-lobster-mini-season-35',
  'Mini season is approaching quickly. This year it falls on July 27 and 28th. There have been reports of numerous crustaceans crawling...',
  'Get your nets ready for lobster season! According to suncoastdivecenter''s post, ''The Count Down to Lobster Mini Season'', on Jul 23, 2022, the season is a ''full send'' and mini-season has been a huge success, with reports of numerous crustaceans crawling around as the July 27-28 mini-season approaches.',
  E'Mini season is approaching quickly. This year it falls on July 27 and 28th. There have been reports of numerous crustaceans crawling...\n\nGet your nets ready for lobster season! According to suncoastdivecenter''s post, ''The Count Down to Lobster Mini Season'', on Jul 23, 2022, the season is a ''full send'' and mini-season has been a huge success, with reports of numerous crustaceans crawling around as the July 27-28 mini-season approaches.',
  '2022-07-23'
);

-- Post 36
INSERT INTO blog_posts (category_id, author, title, slug, excerpt_text, short_blog_entry, content, published_date)
VALUES (
  get_blog_category('The best way to stay cool in this heat!!!!', 'It has been a fantastic week to be underwater cooling off from this heat. Visibility in depths greater than 60ft has been 25-70ft. With...'),
  'suncoastdivecenter',
  'The best way to stay cool in this heat!!!!',
  'the-best-way-to-stay-cool-in-this-heat-36',
  'It has been a fantastic week to be underwater cooling off from this heat. Visibility in depths greater than 60ft has been 25-70ft. With...',
  'The water conditions are changing! ''The best way to stay cool in this heat!!!!'' was the report from suncoastdivecenter on Jul 11, 2022. It has been a fantastic week to be underwater, with great visibility ranging from 25-70ft in depths greater than 60ft. It''s time to dive!',
  E'It has been a fantastic week to be underwater cooling off from this heat. Visibility in depths greater than 60ft has been 25-70ft. With...\n\nThe water conditions are changing! ''The best way to stay cool in this heat!!!!'' was the report from suncoastdivecenter on Jul 11, 2022. It has been a fantastic week to be underwater, with great visibility ranging from 25-70ft in depths greater than 60ft. It''s time to dive!',
  '2022-07-11'
);

-- Post 37
INSERT INTO blog_posts (category_id, author, title, slug, excerpt_text, short_blog_entry, content, published_date)
VALUES (
  get_blog_category('Scallop season to open', 'Scallop season is set to open in most areas Friday (check myfwc.com for boundaries). Some of the best times with the family and teaching...'),
  'suncoastdivecenter',
  'Scallop season to open',
  'scallop-season-to-open-37',
  'Scallop season is set to open in most areas Friday (check myfwc.com for boundaries). Some of the best times with the family and teaching...',
  'Dive in! Scallop season is in full swing. ''Scallop season to open''! As noted on Jun 30, 2022 by suncoastdivecenter, the waters are productive, with the season set to open in most areas on Friday, making for great family time.',
  E'Scallop season is set to open in most areas Friday (check myfwc.com for boundaries). Some of the best times with the family and teaching...\n\nDive in! Scallop season is in full swing. ''Scallop season to open''! As noted on Jun 30, 2022 by suncoastdivecenter, the waters are productive, with the season set to open in most areas on Friday, making for great family time.',
  '2022-06-30'
);

-- Post 38
INSERT INTO blog_posts (category_id, author, title, slug, excerpt_text, short_blog_entry, content, published_date)
VALUES (
  get_blog_category('Whale sharks Again and Opening of red snapper', 'The visibility varies out front . Down near the channel we have had 10 ft or less from 35ft-65ft. There are plenty of grouper and hogs...'),
  'suncoastdivecenter',
  'Whale sharks Again and Opening of red snapper',
  'whale-sharks-again-and-opening-of-red-snapper-38',
  'The visibility varies out front . Down near the channel we have had 10 ft or less from 35ft-65ft. There are plenty of grouper and hogs...',
  'Gentle giants have arrived! ''Whale sharks Again and Opening of red snapper'' announced suncoastdivecenter on Jun 16, 2022. These majestic whale sharks are migrating in the Gulf, with reports of varied visibility and plenty of grouper and hogs in the water.',
  E'The visibility varies out front . Down near the channel we have had 10 ft or less from 35ft-65ft. There are plenty of grouper and hogs...\n\nGentle giants have arrived! ''Whale sharks Again and Opening of red snapper'' announced suncoastdivecenter on Jun 16, 2022. These majestic whale sharks are migrating in the Gulf, with reports of varied visibility and plenty of grouper and hogs in the water.',
  '2022-06-16'
);

-- Post 39
INSERT INTO blog_posts (category_id, author, title, slug, excerpt_text, short_blog_entry, content, published_date)
VALUES (
  get_blog_category('Visibility Doesn''t Get Any Better', 'This past weekend showed us just why the Gulf of Mexico is one of the best places to dive. In 60 ft the water was top to bottom. When we...'),
  'suncoastdivecenter',
  'Visibility Doesn''t Get Any Better',
  'visibility-doesnt-get-any-better-39',
  'This past weekend showed us just why the Gulf of Mexico is one of the best places to dive. In 60 ft the water was top to bottom. When we...',
  'The water conditions are changing! ''Visibility Doesn''t Get Any Better'' was the report from suncoastdivecenter on Jun 2, 2022. This past weekend showed that the Gulf of Mexico is one of the best places to dive, with top-to-bottom water visibility in 60 ft.',
  E'This past weekend showed us just why the Gulf of Mexico is one of the best places to dive. In 60 ft the water was top to bottom. When we...\n\nThe water conditions are changing! ''Visibility Doesn''t Get Any Better'' was the report from suncoastdivecenter on Jun 2, 2022. This past weekend showed that the Gulf of Mexico is one of the best places to dive, with top-to-bottom water visibility in 60 ft.',
  '2022-06-02'
);

-- Post 40
INSERT INTO blog_posts (category_id, author, title, slug, excerpt_text, short_blog_entry, content, published_date)
VALUES (
  get_blog_category('Whale Sharks', 'The water has finally heated up to 77 degrees and the visibility couldn''t get any better. Visibility in 50 ft this past week has been top...'),
  'suncoastdivecenter',
  'Whale Sharks',
  'whale-sharks-40',
  'The water has finally heated up to 77 degrees and the visibility couldn''t get any better. Visibility in 50 ft this past week has been top...',
  'Gentle giants have arrived! ''Whale Sharks'' announced suncoastdivecenter on May 20, 2022. These majestic whale sharks are migrating in the Gulf, with the water finally heating up to 77 degrees and providing top visibility in 50 ft.',
  E'The water has finally heated up to 77 degrees and the visibility couldn''t get any better. Visibility in 50 ft this past week has been top...\n\nGentle giants have arrived! ''Whale Sharks'' announced suncoastdivecenter on May 20, 2022. These majestic whale sharks are migrating in the Gulf, with the water finally heating up to 77 degrees and providing top visibility in 50 ft.',
  '2022-05-20'
);

-- Post 41
INSERT INTO blog_posts (category_id, author, title, slug, excerpt_text, short_blog_entry, content, published_date)
VALUES (
  get_blog_category('50+ foot of visibility', 'The weather looks perfect for the weekend. Visibility has been improving and in 90 ft of water there was 50 plus foot of vis. The pool...'),
  'suncoastdivecenter',
  '50+ foot of visibility',
  '50-foot-of-visibility-41',
  'The weather looks perfect for the weekend. Visibility has been improving and in 90 ft of water there was 50 plus foot of vis. The pool...',
  'The water conditions are changing! ''50+ foot of visibility'' was the report from suncoastdivecenter on May 12, 2022. The weather looks perfect for the weekend, with improving visibility reaching 50+ feet in 90 ft of water. It''s time to dive!',
  E'The weather looks perfect for the weekend. Visibility has been improving and in 90 ft of water there was 50 plus foot of vis. The pool...\n\nThe water conditions are changing! ''50+ foot of visibility'' was the report from suncoastdivecenter on May 12, 2022. The weather looks perfect for the weekend, with improving visibility reaching 50+ feet in 90 ft of water. It''s time to dive!',
  '2022-05-12'
);

-- Post 42
INSERT INTO blog_posts (category_id, author, title, slug, excerpt_text, short_blog_entry, content, published_date)
VALUES (
  get_blog_category('Visibility 30 ft in 60 foot of water.', 'The Visibility has improved over the last week. In 60 ft of water we are getting over 30 foot of vis. The deeper the vis improves to...'),
  'suncoastdivecenter',
  'Visibility 30 ft in 60 foot of water.',
  'visibility-30-ft-in-60-foot-of-water-42',
  'The Visibility has improved over the last week. In 60 ft of water we are getting over 30 foot of vis. The deeper the vis improves to...',
  'The water conditions are changing! ''Visibility 30 ft in 60 foot of water.'' was the report from suncoastdivecenter on May 2, 2022. The visibility has improved over the last week, with over 30 foot of vis in 60 ft of water. It''s time to dive!',
  E'The Visibility has improved over the last week. In 60 ft of water we are getting over 30 foot of vis. The deeper the vis improves to...\n\nThe water conditions are changing! ''Visibility 30 ft in 60 foot of water.'' was the report from suncoastdivecenter on May 2, 2022. The visibility has improved over the last week, with over 30 foot of vis in 60 ft of water. It''s time to dive!',
  '2022-05-02'
);

-- Post 43
INSERT INTO blog_posts (category_id, author, title, slug, excerpt_text, short_blog_entry, content, published_date)
VALUES (
  get_blog_category('The KINGFISH are here!!!!', 'Yes as a diver this is very good news. Those of us that have been diving Pinellas county for awhile know that as these migratory fish...'),
  'suncoastdivecenter',
  'The KINGFISH are here!!!!',
  'the-kingfish-are-here-43',
  'Yes as a diver this is very good news. Those of us that have been diving Pinellas county for awhile know that as these migratory fish...',
  'A new update is here: ''The KINGFISH are here!!!!''! Posted on Apr 9, 2022 by suncoastdivecenter, the post''s excerpt says: ''Yes as a diver this is very good news. Those of us that have been diving Pinellas county for awhile know that as these migratory fish...'' Check out the full post for more details on the current dive conditions and news.',
  E'Yes as a diver this is very good news. Those of us that have been diving Pinellas county for awhile know that as these migratory fish...\n\nA new update is here: ''The KINGFISH are here!!!!''! Posted on Apr 9, 2022 by suncoastdivecenter, the post''s excerpt says: ''Yes as a diver this is very good news. Those of us that have been diving Pinellas county for awhile know that as these migratory fish...'' Check out the full post for more details on the current dive conditions and news.',
  '2022-04-09'
);

-- Post 44
INSERT INTO blog_posts (category_id, author, title, slug, excerpt_text, short_blog_entry, content, published_date)
VALUES (
  get_blog_category('3 degrees!!!! Getting Better', 'Water temp was 61 degrees and Visibility was nearly Top to Bottom from 60 foot to 100ft.'),
  'suncoastdivecenter',
  '3 degrees!!!! Getting Better',
  '3-degrees-getting-better-44',
  'Water temp was 61 degrees and Visibility was nearly Top to Bottom from 60 foot to 100ft.',
  'The water conditions are changing! ''3 degrees!!!! Getting Better'' was the report from suncoastdivecenter on Mar 4, 2022. The water temp was 61 degrees, and visibility was nearly Top to Bottom from 60 foot to 100ft. It''s time to dive!',
  E'Water temp was 61 degrees and Visibility was nearly Top to Bottom from 60 foot to 100ft.\n\nThe water conditions are changing! ''3 degrees!!!! Getting Better'' was the report from suncoastdivecenter on Mar 4, 2022. The water temp was 61 degrees, and visibility was nearly Top to Bottom from 60 foot to 100ft. It''s time to dive!',
  '2022-03-04'
);

-- Post 45
INSERT INTO blog_posts (category_id, author, title, slug, excerpt_text, short_blog_entry, content, published_date)
VALUES (
  get_blog_category('Water is heating up and the Visibility starting to improve!!!!', 'Spring time is approaching and the time to start getting ready is now. The visibility is starting to shape up from these winter time...'),
  'suncoastdivecenter',
  'Water is heating up and the Visibility starting to improve!!!!',
  'water-is-heating-up-and-the-visibility-starting-to-improve-45',
  'Spring time is approaching and the time to start getting ready is now. The visibility is starting to shape up from these winter time...',
  'The water conditions are changing! ''Water is heating up and the Visibility starting to improve!!!!'' was the report from suncoastdivecenter on Feb 18, 2022. Springtime is approaching, and visibility is starting to shape up after the winter. It''s time to dive!',
  E'Spring time is approaching and the time to start getting ready is now. The visibility is starting to shape up from these winter time...\n\nThe water conditions are changing! ''Water is heating up and the Visibility starting to improve!!!!'' was the report from suncoastdivecenter on Feb 18, 2022. Springtime is approaching, and visibility is starting to shape up after the winter. It''s time to dive!',
  '2022-02-18'
);

-- Drop the helper function as it's no longer needed
DROP FUNCTION IF EXISTS get_blog_category(TEXT, TEXT);

-- Create a view for convenient blog queries with category info
CREATE OR REPLACE VIEW blog_posts_with_categories AS
SELECT
  bp.*,
  bc.name as category_name,
  bc.slug as category_slug
FROM blog_posts bp
JOIN blog_categories bc ON bp.category_id = bc.id;
