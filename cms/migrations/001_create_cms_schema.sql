-- =============================================================================
-- LENTILS & MILLETS CMS DATABASE SCHEMA
-- Migration: 001_create_cms_schema.sql
-- =============================================================================

-- =============================================================================
-- ARTICLES TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS articles (
  -- Primary key and identification
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  
  -- Content fields
  content TEXT,
  excerpt TEXT,
  hero_image_url VARCHAR(500),
  
  -- Author and categorization
  author VARCHAR(100),
  category VARCHAR(20) NOT NULL CHECK (category IN ('lentils', 'millets')),
  
  -- Card assignment system
  card_position VARCHAR(10), -- H4, L1, M3, etc.
  display_pages TEXT[] DEFAULT '{}', -- ['home', 'lentils', 'millets']
  
  -- Factoid display data (JSONB for flexible structure)
  factoid_data JSONB,
  
  -- SEO and metadata
  meta_title VARCHAR(255),
  meta_description TEXT,
  tags TEXT[] DEFAULT '{}',
  
  -- Publishing workflow
  status VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  published_at TIMESTAMP,
  
  -- Audit fields
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- =============================================================================
-- RECIPES TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS recipes (
  -- Primary key and identification
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  hero_image_url VARCHAR(500),
  
  -- Recipe timing and difficulty
  prep_time INTEGER, -- minutes
  cook_time INTEGER, -- minutes
  total_time INTEGER, -- auto-calculated: prep_time + cook_time
  servings INTEGER,
  difficulty VARCHAR(20) CHECK (difficulty IN ('easy', 'medium', 'hard')),
  
  -- Recipe content (JSONB for flexible structure)
  ingredients JSONB NOT NULL DEFAULT '[]',
  instructions JSONB NOT NULL DEFAULT '[]',
  
  -- Nutritional information
  calories_per_serving INTEGER,
  protein_grams DECIMAL(5,2),
  fiber_grams DECIMAL(5,2),
  nutritional_highlights TEXT[] DEFAULT '{}',
  health_benefits TEXT[] DEFAULT '{}',
  
  -- Categorization and tagging
  category VARCHAR(20) NOT NULL CHECK (category IN ('lentils', 'millets')),
  meal_type VARCHAR(20) CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
  dietary_tags TEXT[] DEFAULT '{}', -- ['vegan', 'gluten-free', 'high-protein', 'low-carb', 'keto-friendly']
  
  -- Card assignment system
  card_position VARCHAR(10), -- H10, L7, M8, etc.
  display_pages TEXT[] DEFAULT '{}', -- ['home', 'lentils', 'millets']
  is_featured BOOLEAN DEFAULT false,
  
  -- SEO and metadata
  meta_title VARCHAR(255),
  meta_description TEXT,
  
  -- Publishing workflow
  status VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  published_at TIMESTAMP,
  
  -- Audit fields
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT valid_timing CHECK (
    (prep_time IS NULL OR prep_time >= 0) AND
    (cook_time IS NULL OR cook_time >= 0) AND
    (total_time IS NULL OR total_time >= 0)
  )
);

-- =============================================================================
-- INDEXES FOR PERFORMANCE
-- =============================================================================

-- Articles indexes
CREATE INDEX IF NOT EXISTS idx_articles_card_position ON articles(card_position);
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category);
CREATE INDEX IF NOT EXISTS idx_articles_status ON articles(status);
CREATE INDEX IF NOT EXISTS idx_articles_published_at ON articles(published_at);
CREATE INDEX IF NOT EXISTS idx_articles_display_pages ON articles USING GIN(display_pages);
CREATE INDEX IF NOT EXISTS idx_articles_tags ON articles USING GIN(tags);

-- Recipes indexes
CREATE INDEX IF NOT EXISTS idx_recipes_card_position ON recipes(card_position);
CREATE INDEX IF NOT EXISTS idx_recipes_category ON recipes(category);
CREATE INDEX IF NOT EXISTS idx_recipes_status ON recipes(status);
CREATE INDEX IF NOT EXISTS idx_recipes_is_featured ON recipes(is_featured);
CREATE INDEX IF NOT EXISTS idx_recipes_meal_type ON recipes(meal_type);
CREATE INDEX IF NOT EXISTS idx_recipes_dietary_tags ON recipes USING GIN(dietary_tags);
CREATE INDEX IF NOT EXISTS idx_recipes_display_pages ON recipes USING GIN(display_pages);
CREATE INDEX IF NOT EXISTS idx_recipes_published_at ON recipes(published_at);

-- =============================================================================
-- CARD POSITION VALIDATION CONSTRAINTS
-- =============================================================================

-- Prevent invalid card position assignments for articles
ALTER TABLE articles ADD CONSTRAINT IF NOT EXISTS valid_article_card_assignment CHECK (
  card_position IS NULL OR
  (
    -- Home page: H0-H3 (any), H4-H6 (lentils only), H7-H9 (lentils only), H12-H14 (millets only), H15-H17 (millets only)
    (card_position IN ('H0','H1','H2','H3')) OR
    (card_position IN ('H4','H5','H6') AND category = 'lentils') OR
    (card_position IN ('H7','H8','H9') AND category = 'lentils') OR
    (card_position IN ('H12','H13','H14') AND category = 'millets') OR
    (card_position IN ('H15','H16','H17') AND category = 'millets') OR
    -- Lentils page: L1-L6 (lentils only)
    (card_position IN ('L1','L2','L3','L4','L5','L6') AND category = 'lentils') OR
    -- Millets page: M1-M6 (millets only)
    (card_position IN ('M1','M2','M3','M4','M5','M6') AND category = 'millets')
  )
);

-- Prevent invalid card position assignments for recipes
ALTER TABLE recipes ADD CONSTRAINT IF NOT EXISTS valid_recipe_card_assignment CHECK (
  card_position IS NULL OR
  (
    -- Home page: H0-H3 (any), H7-H9 (lentils only), H10-H11 (lentils featured), H15-H17 (millets only), H18-H19 (millets featured)
    (card_position IN ('H0','H1','H2','H3')) OR
    (card_position IN ('H7','H8','H9') AND category = 'lentils') OR
    (card_position IN ('H10','H11') AND category = 'lentils' AND is_featured = true) OR
    (card_position IN ('H15','H16','H17') AND category = 'millets') OR
    (card_position IN ('H18','H19') AND category = 'millets' AND is_featured = true) OR
    -- Lentils page: L4-L8 (lentils only)
    (card_position IN ('L4','L5','L6','L7','L8') AND category = 'lentils') OR
    -- Millets page: M4-M8 (millets only)
    (card_position IN ('M4','M5','M6','M7','M8') AND category = 'millets')
  )
);

-- =============================================================================
-- UNIQUE CONSTRAINTS FOR FEATURED RECIPES
-- =============================================================================

-- Prevent more than 1 recipe per card position
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_card_position_articles 
ON articles (card_position) 
WHERE card_position IS NOT NULL AND status = 'published';

CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_card_position_recipes 
ON recipes (card_position) 
WHERE card_position IS NOT NULL AND status = 'published';

-- =============================================================================
-- TRIGGERS AND FUNCTIONS
-- =============================================================================

-- Auto-calculate total time for recipes
CREATE OR REPLACE FUNCTION calculate_total_time()
RETURNS TRIGGER AS $$
BEGIN
  NEW.total_time := COALESCE(NEW.prep_time, 0) + COALESCE(NEW.cook_time, 0);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_calculate_total_time ON recipes;
CREATE TRIGGER trigger_calculate_total_time
  BEFORE INSERT OR UPDATE ON recipes
  FOR EACH ROW
  EXECUTE FUNCTION calculate_total_time();

-- Auto-update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_articles_updated_at ON articles;
CREATE TRIGGER trigger_articles_updated_at
  BEFORE UPDATE ON articles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_recipes_updated_at ON recipes;
CREATE TRIGGER trigger_recipes_updated_at
  BEFORE UPDATE ON recipes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- SAMPLE DATA FOR TESTING
-- =============================================================================

-- Sample article with factoid data
INSERT INTO articles (
  title, slug, content, excerpt, hero_image_url, author, category,
  card_position, display_pages, factoid_data, meta_title, tags, status, published_at
) VALUES (
  'Red Lentils: Complete Nutritional Guide',
  'red-lentils-complete-nutritional-guide',
  'Red lentils are one of the most versatile and nutritious legumes available. Rich in protein, fiber, and essential nutrients, they cook quickly and absorb flavors beautifully. This comprehensive guide covers everything you need to know about red lentils, from their nutritional profile to cooking techniques and health benefits.',
  'Discover the complete nutritional profile and health benefits of red lentils, plus cooking tips and recipe ideas.',
  'https://images.unsplash.com/photo-1586201375761-83865001e31c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'Dr. Sarah Johnson',
  'lentils',
  'H4',
  ARRAY['home', 'lentils'],
  '{
    "primary_stat": {"value": "25g", "label": "Protein per 100g"},
    "secondary_stat": {"value": "15min", "label": "Cook Time"},
    "icon": "protein",
    "highlights": [
      "Complete amino acid profile",
      "High in folate & iron",
      "Naturally gluten-free"
    ]
  }',
  'Red Lentils: Complete Nutritional Guide | Lentils & Millets',
  ARRAY['red lentils', 'nutrition', 'protein', 'cooking'],
  'published',
  NOW()
) ON CONFLICT (slug) DO NOTHING;

-- Sample recipe with ingredients and instructions
INSERT INTO recipes (
  title, slug, description, hero_image_url, prep_time, cook_time,
  servings, difficulty, ingredients, instructions, calories_per_serving,
  protein_grams, fiber_grams, nutritional_highlights, health_benefits,
  category, meal_type, dietary_tags, card_position, display_pages,
  is_featured, meta_title, status, published_at
) VALUES (
  'Spiced Red Lentil Curry',
  'spiced-red-lentil-curry',
  'A warming, protein-rich curry perfect for weeknight dinners. This aromatic dish combines red lentils with fragrant spices and coconut milk for a satisfying and nutritious meal.',
  'https://images.unsplash.com/photo-1606491956689-2ea866880c84?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  10, 25, 4, 'easy',
  '[
    {"item": "Red lentils", "amount": "1 cup", "notes": "rinsed and drained"},
    {"item": "Coconut oil", "amount": "2 tbsp", "notes": ""},
    {"item": "Yellow onion", "amount": "1 medium", "notes": "diced"},
    {"item": "Garlic cloves", "amount": "3", "notes": "minced"},
    {"item": "Fresh ginger", "amount": "1 inch", "notes": "grated"},
    {"item": "Curry powder", "amount": "2 tsp", "notes": ""},
    {"item": "Coconut milk", "amount": "1 can", "notes": "full-fat"},
    {"item": "Vegetable broth", "amount": "2 cups", "notes": ""},
    {"item": "Salt", "amount": "to taste", "notes": ""},
    {"item": "Fresh cilantro", "amount": "1/4 cup", "notes": "chopped, for garnish"}
  ]',
  '[
    {"step": 1, "instruction": "Heat coconut oil in a large pot over medium heat", "time": 2},
    {"step": 2, "instruction": "Add diced onion and cook until translucent", "time": 5},
    {"step": 3, "instruction": "Add minced garlic, grated ginger, and curry powder. Cook until fragrant", "time": 1},
    {"step": 4, "instruction": "Add red lentils and stir to coat with oil and spices", "time": 1},
    {"step": 5, "instruction": "Pour in coconut milk and vegetable broth. Bring to a boil", "time": 3},
    {"step": 6, "instruction": "Reduce heat and simmer until lentils are tender and creamy", "time": 15},
    {"step": 7, "instruction": "Season with salt to taste and garnish with fresh cilantro", "time": 1}
  ]',
  245, 12.5, 8.2,
  ARRAY['High in plant-based protein', 'Rich in dietary fiber', 'Good source of folate'],
  ARRAY['Supports heart health', 'Aids in digestion', 'Helps stabilize blood sugar'],
  'lentils', 'dinner',
  ARRAY['vegan', 'gluten-free', 'high-protein'],
  'H10', ARRAY['home', 'lentils'], true,
  'Easy Spiced Red Lentil Curry Recipe | Lentils & Millets',
  'published', NOW()
) ON CONFLICT (slug) DO NOTHING;

-- =============================================================================
-- VERIFICATION QUERIES
-- =============================================================================

-- Verify tables were created
SELECT 
  table_name, 
  table_type 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('articles', 'recipes')
ORDER BY table_name;

-- Verify sample data was inserted
SELECT 
  'articles' as table_name,
  count(*) as record_count
FROM articles
WHERE status = 'published'

UNION ALL

SELECT 
  'recipes' as table_name,
  count(*) as record_count  
FROM recipes
WHERE status = 'published';

-- Show card assignments
SELECT 
  card_position,
  'article' as content_type,
  title,
  category
FROM articles 
WHERE card_position IS NOT NULL

UNION ALL

SELECT 
  card_position,
  'recipe' as content_type,
  title,
  category
FROM recipes 
WHERE card_position IS NOT NULL

ORDER BY card_position;