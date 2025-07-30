-- Initialize Lentils & Millets Database Schema
-- Run this script to create the required tables

-- Articles table
CREATE TABLE IF NOT EXISTS articles (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  product_line VARCHAR(50) NOT NULL CHECK (product_line IN ('lentils', 'millets', 'general')),
  category VARCHAR(50) CHECK (category IN ('nutritional', 'variety', 'recipe', 'health', 'cooking', 'research')),
  featured BOOLEAN DEFAULT false,
  priority INTEGER DEFAULT 50 CHECK (priority >= 1 AND priority <= 100),
  tags JSONB DEFAULT '[]',
  excerpt TEXT NOT NULL,
  content TEXT,
  author VARCHAR(255) DEFAULT 'Lentils & Millets Team',
  reading_time INTEGER DEFAULT 5,
  
  -- SEO fields
  meta_title VARCHAR(255),
  meta_description TEXT,
  keywords TEXT,
  
  -- Nutritional data (for millets articles)
  nutritional_data JSONB,
  
  -- Publishing info
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  published_at TIMESTAMP WITH TIME ZONE,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Recipes table  
CREATE TABLE IF NOT EXISTS recipes (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  product_line VARCHAR(50) NOT NULL CHECK (product_line IN ('lentils', 'millets')),
  description TEXT NOT NULL,
  content TEXT,
  
  -- Recipe-specific fields
  ingredients JSONB DEFAULT '[]', -- Array of {item, amount}
  instructions JSONB DEFAULT '[]', -- Array of {step}
  cooking_time INTEGER, -- in minutes
  difficulty VARCHAR(20) CHECK (difficulty IN ('easy', 'medium', 'hard')),
  
  -- Nutritional info
  nutritional_info JSONB, -- {calories, protein, fiber, iron}
  
  -- Tags and categorization
  tags JSONB DEFAULT '[]', -- Array of strings
  
  -- Publishing info
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  published_at TIMESTAMP WITH TIME ZONE,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Media table (for images)
CREATE TABLE IF NOT EXISTS media (
  id SERIAL PRIMARY KEY,
  filename VARCHAR(255) NOT NULL,
  original_name VARCHAR(255) NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  file_size INTEGER NOT NULL,
  url TEXT NOT NULL,
  alt_text VARCHAR(255),
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_product_line ON articles(product_line);
CREATE INDEX IF NOT EXISTS idx_articles_status ON articles(status);
CREATE INDEX IF NOT EXISTS idx_articles_published_at ON articles(published_at);
CREATE INDEX IF NOT EXISTS idx_articles_featured ON articles(featured);
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category);

CREATE INDEX IF NOT EXISTS idx_recipes_slug ON recipes(slug);
CREATE INDEX IF NOT EXISTS idx_recipes_product_line ON recipes(product_line);
CREATE INDEX IF NOT EXISTS idx_recipes_status ON recipes(status);
CREATE INDEX IF NOT EXISTS idx_recipes_published_at ON recipes(published_at);
CREATE INDEX IF NOT EXISTS idx_recipes_difficulty ON recipes(difficulty);

-- Full-text search indexes
CREATE INDEX IF NOT EXISTS idx_articles_search ON articles USING gin(to_tsvector('english', title || ' ' || COALESCE(excerpt, '') || ' ' || COALESCE(content, '')));
CREATE INDEX IF NOT EXISTS idx_recipes_search ON recipes USING gin(to_tsvector('english', title || ' ' || COALESCE(description, '') || ' ' || COALESCE(content, '')));

-- Update timestamp triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_articles_updated_at BEFORE UPDATE ON articles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_recipes_updated_at BEFORE UPDATE ON recipes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_media_updated_at BEFORE UPDATE ON media FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample data
INSERT INTO articles (title, slug, product_line, category, excerpt, content, status) VALUES
('Benefits of Red Lentils', 'benefits-of-red-lentils', 'lentils', 'health', 'Discover the amazing health benefits of red lentils and why they should be part of your daily diet.', 'Red lentils are packed with protein, fiber, and essential nutrients...', 'published'),
('Pearl Millet: The Drought-Resistant Supercrop', 'pearl-millet-drought-resistant-supercrop', 'millets', 'nutritional', 'Learn why pearl millet is considered a climate-resilient superfood.', 'Pearl millet thrives in arid conditions and provides exceptional nutrition...', 'published')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO recipes (title, slug, product_line, description, ingredients, instructions, cooking_time, difficulty, status) VALUES
('Classic Dal Tadka', 'classic-dal-tadka', 'lentils', 'A traditional Indian lentil curry with aromatic spices.', 
'[{"item": "Red lentils", "amount": "1 cup"}, {"item": "Onion", "amount": "1 medium"}, {"item": "Tomato", "amount": "1 large"}]',
'[{"step": "Wash and soak lentils for 15 minutes"}, {"step": "Boil lentils until soft"}, {"step": "Prepare tempering with spices"}]',
30, 'easy', 'published'),
('Pearl Millet Porridge', 'pearl-millet-porridge', 'millets', 'A nutritious breakfast porridge made with pearl millet.',
'[{"item": "Pearl millet flour", "amount": "1/2 cup"}, {"item": "Milk", "amount": "2 cups"}, {"item": "Honey", "amount": "2 tbsp"}]',
'[{"step": "Heat milk in a saucepan"}, {"step": "Slowly add millet flour while stirring"}, {"step": "Cook until thickened"}]',
15, 'easy', 'published')
ON CONFLICT (slug) DO NOTHING;