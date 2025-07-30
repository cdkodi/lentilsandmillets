-- =============================================================================
-- ADD FEATURED IMAGE FIELD
-- Migration: 003_add_featured_image_field.sql
-- Adds structured featured_image JSONB field to cms_articles and cms_recipes
-- =============================================================================

-- Add featured_image field to cms_articles
ALTER TABLE cms_articles 
ADD COLUMN featured_image JSONB DEFAULT NULL;

-- Add featured_image field to cms_recipes
ALTER TABLE cms_recipes 
ADD COLUMN featured_image JSONB DEFAULT NULL;

-- Create indexes for better performance
CREATE INDEX idx_cms_articles_featured_image ON cms_articles USING GIN(featured_image);
CREATE INDEX idx_cms_recipes_featured_image ON cms_recipes USING GIN(featured_image);

-- Add comments
COMMENT ON COLUMN cms_articles.featured_image IS 'Structured featured image data from R2 storage: {"id": 123, "url": "...", "alt": "...", "filename": "..."}';
COMMENT ON COLUMN cms_recipes.featured_image IS 'Structured featured image data from R2 storage: {"id": 123, "url": "...", "alt": "...", "filename": "..."}';

-- Verification
SELECT 'Featured image field added successfully' as status;