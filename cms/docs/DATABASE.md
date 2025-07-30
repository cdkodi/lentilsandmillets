# Database Schema Documentation
## Card-Based CMS System

---

## Schema Overview

The database uses two primary tables (`articles` and `recipes`) with distinct structures optimized for their respective content types. Card position assignments and validation rules are enforced at both database and application levels.

---

## Articles Table

### Purpose
Educational content, nutritional information, variety guides, and factoid displays.

### Schema
```sql
CREATE TABLE articles (
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
  updated_at TIMESTAMP DEFAULT NOW(),
  
  -- Indexes for performance
  CONSTRAINT articles_slug_key UNIQUE (slug),
  CONSTRAINT valid_card_position CHECK (
    card_position IS NULL OR 
    card_position ~ '^(H([0-9]|1[0-9])|L[1-8]|M[1-8])$'
  )
);

-- Indexes for query optimization
CREATE INDEX idx_articles_card_position ON articles(card_position);
CREATE INDEX idx_articles_category ON articles(category);
CREATE INDEX idx_articles_status ON articles(status);
CREATE INDEX idx_articles_published_at ON articles(published_at);
CREATE INDEX idx_articles_display_pages ON articles USING GIN(display_pages);
```

### Factoid Data Structure
```jsonb
{
  "primary_stat": {
    "value": "25g",
    "label": "Protein per 100g"
  },
  "secondary_stat": {
    "value": "15min",
    "label": "Cook Time"
  },
  "icon": "protein", -- "protein", "health", "nutrition", "sustainability"
  "highlights": [
    "Complete amino acid profile",
    "High in folate & iron",
    "Naturally gluten-free"
  ]
}
```

---

## Recipes Table

### Purpose
Cooking instructions with ingredients, nutritional data, health benefits, and cooking metadata.

### Schema
```sql
CREATE TABLE recipes (
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
  CONSTRAINT recipes_slug_key UNIQUE (slug),
  CONSTRAINT valid_card_position CHECK (
    card_position IS NULL OR 
    card_position ~ '^(H([0-3]|[7-9]|1[01]|1[5-9])|L[4-8]|M[4-8])$'
  ),
  CONSTRAINT valid_timing CHECK (
    prep_time IS NULL OR prep_time >= 0,
    cook_time IS NULL OR cook_time >= 0,
    total_time IS NULL OR total_time >= 0
  )
);

-- Indexes for query optimization
CREATE INDEX idx_recipes_card_position ON recipes(card_position);
CREATE INDEX idx_recipes_category ON recipes(category);
CREATE INDEX idx_recipes_status ON recipes(status);
CREATE INDEX idx_recipes_is_featured ON recipes(is_featured);
CREATE INDEX idx_recipes_meal_type ON recipes(meal_type);
CREATE INDEX idx_recipes_dietary_tags ON recipes USING GIN(dietary_tags);
CREATE INDEX idx_recipes_display_pages ON recipes USING GIN(display_pages);
CREATE INDEX idx_recipes_published_at ON recipes(published_at);
```

### Ingredients Data Structure
```jsonb
[
  {
    "item": "Red lentils",
    "amount": "1 cup",
    "notes": "rinsed and drained"
  },
  {
    "item": "Coconut oil",
    "amount": "2 tbsp",
    "notes": ""
  },
  {
    "item": "Yellow onion",
    "amount": "1 medium",
    "notes": "diced"
  }
]
```

### Instructions Data Structure
```jsonb
[
  {
    "step": 1,
    "instruction": "Heat coconut oil in a large pot over medium heat",
    "time": 2
  },
  {
    "step": 2,
    "instruction": "Add diced onion and cook until translucent",
    "time": 5
  },
  {
    "step": 3,
    "instruction": "Add lentils and stir to coat with oil",
    "time": 1
  }
]
```

---

## Card Position Validation

### Database-Level Constraints

```sql
-- Prevent invalid card position assignments for articles
ALTER TABLE articles ADD CONSTRAINT valid_article_card_assignment CHECK (
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
ALTER TABLE recipes ADD CONSTRAINT valid_recipe_card_assignment CHECK (
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
```

### Featured Recipe Limits

```sql
-- Prevent more than 2 featured lentil recipes on home page
CREATE UNIQUE INDEX idx_max_featured_lentils_home 
ON recipes (category, is_featured) 
WHERE card_position IN ('H10', 'H11') 
  AND is_featured = true 
  AND category = 'lentils' 
  AND status = 'published';

-- Prevent more than 2 featured millet recipes on home page  
CREATE UNIQUE INDEX idx_max_featured_millets_home
ON recipes (category, is_featured)
WHERE card_position IN ('H18', 'H19')
  AND is_featured = true
  AND category = 'millets'
  AND status = 'published';

-- Similar constraints for Lentils and Millets pages
CREATE UNIQUE INDEX idx_max_featured_lentils_page
ON recipes (category, is_featured)
WHERE card_position IN ('L7', 'L8')
  AND is_featured = true
  AND category = 'lentils'
  AND status = 'published';

CREATE UNIQUE INDEX idx_max_featured_millets_page
ON recipes (category, is_featured)
WHERE card_position IN ('M7', 'M8')
  AND is_featured = true
  AND category = 'millets'
  AND status = 'published';
```

---

## Triggers and Functions

### Auto-calculate Total Time
```sql
CREATE OR REPLACE FUNCTION calculate_total_time()
RETURNS TRIGGER AS $$
BEGIN
  NEW.total_time := COALESCE(NEW.prep_time, 0) + COALESCE(NEW.cook_time, 0);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_calculate_total_time
  BEFORE INSERT OR UPDATE ON recipes
  FOR EACH ROW
  EXECUTE FUNCTION calculate_total_time();
```

### Auto-update Timestamps
```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_articles_updated_at
  BEFORE UPDATE ON articles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_recipes_updated_at
  BEFORE UPDATE ON recipes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

---

## Sample Data

### Sample Article
```sql
INSERT INTO articles (
  title, slug, content, excerpt, hero_image_url, author, category,
  card_position, display_pages, factoid_data, meta_title, tags, status, published_at
) VALUES (
  'Red Lentils: Complete Nutritional Guide',
  'red-lentils-complete-nutritional-guide',
  'Red lentils are one of the most versatile and nutritious legumes...',
  'Discover the complete nutritional profile and health benefits of red lentils.',
  'https://images.unsplash.com/photo-1586201375761-83865001e31c',
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
);
```

### Sample Recipe
```sql
INSERT INTO recipes (
  title, slug, description, hero_image_url, prep_time, cook_time,
  servings, difficulty, ingredients, instructions, calories_per_serving,
  protein_grams, fiber_grams, nutritional_highlights, health_benefits,
  category, meal_type, dietary_tags, card_position, display_pages,
  is_featured, meta_title, status, published_at
) VALUES (
  'Spiced Red Lentil Curry',
  'spiced-red-lentil-curry',
  'A warming, protein-rich curry perfect for weeknight dinners.',
  'https://images.unsplash.com/photo-1606491956689-2ea866880c84',
  10, 25, 4, 'easy',
  '[
    {"item": "Red lentils", "amount": "1 cup", "notes": "rinsed and drained"},
    {"item": "Coconut oil", "amount": "2 tbsp", "notes": ""},
    {"item": "Yellow onion", "amount": "1 medium", "notes": "diced"}
  ]',
  '[
    {"step": 1, "instruction": "Heat coconut oil in a large pot over medium heat", "time": 2},
    {"step": 2, "instruction": "Add diced onion and cook until translucent", "time": 5},
    {"step": 3, "instruction": "Add lentils and stir to coat with oil", "time": 1}
  ]',
  245, 12.5, 8.2,
  ARRAY['High in plant-based protein', 'Rich in dietary fiber', 'Good source of folate'],
  ARRAY['Supports heart health', 'Aids in digestion', 'Helps stabilize blood sugar'],
  'lentils', 'dinner',
  ARRAY['vegan', 'gluten-free', 'high-protein'],
  'H10', ARRAY['home', 'lentils'], true,
  'Easy Spiced Red Lentil Curry Recipe | Lentils & Millets',
  'published', NOW()
);
```

---

## Query Examples

### Fetch All Home Page Content
```sql
-- Get all home page cards with content
SELECT 
  card_position,
  'article' as content_type,
  title,
  hero_image_url,
  factoid_data,
  slug
FROM articles 
WHERE 'home' = ANY(display_pages) 
  AND status = 'published'
  AND card_position LIKE 'H%'

UNION ALL

SELECT 
  card_position,
  'recipe' as content_type,
  title,
  hero_image_url,
  NULL as factoid_data,
  slug
FROM recipes 
WHERE 'home' = ANY(display_pages) 
  AND status = 'published'
  AND card_position LIKE 'H%'

ORDER BY card_position;
```

### Check Featured Recipe Availability
```sql
-- Check how many featured lentil recipe slots are available on home page
SELECT 
  COUNT(*) as used_slots,
  2 - COUNT(*) as available_slots
FROM recipes 
WHERE card_position IN ('H10', 'H11')
  AND is_featured = true
  AND category = 'lentils'
  AND status = 'published';
```

---

## Migration Strategy

### Initial Setup
1. Create tables with constraints
2. Add indexes for performance
3. Create triggers for auto-calculations
4. Insert sample data for testing

### Future Migrations
- Version controlled SQL migration files
- Rollback procedures documented
- Data migration scripts for content updates

---

*Database schema version: 1.0 | Last updated: January 2025*