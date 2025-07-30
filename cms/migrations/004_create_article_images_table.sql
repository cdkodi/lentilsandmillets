-- =============================================================================
-- CREATE ARTICLE IMAGES TABLE
-- Migration: 004_create_article_images_table.sql
-- Tracks image references within article content for better management
-- =============================================================================

-- Create article_images table for tracking image usage in articles
CREATE TABLE IF NOT EXISTS article_images (
    id SERIAL PRIMARY KEY,
    article_id INTEGER NOT NULL REFERENCES cms_articles(id) ON DELETE CASCADE,
    filename VARCHAR(255) NOT NULL,
    variant VARCHAR(50) NOT NULL,
    alignment VARCHAR(20) NOT NULL DEFAULT 'center',
    r2_key VARCHAR(500) NOT NULL,
    alt_text TEXT,
    caption TEXT,
    position_in_article INTEGER,
    width INTEGER,
    height INTEGER,
    file_size INTEGER,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_article_images_article_id ON article_images(article_id);
CREATE INDEX idx_article_images_filename ON article_images(filename);
CREATE INDEX idx_article_images_variant ON article_images(variant);
CREATE INDEX idx_article_images_position ON article_images(article_id, position_in_article);

-- Create composite index for quick lookups
CREATE INDEX idx_article_images_lookup ON article_images(article_id, filename, variant);

-- Add constraints for valid variants (matching IMAGE_VARIANTS from r2-client.ts)
ALTER TABLE article_images 
ADD CONSTRAINT chk_valid_variant 
CHECK (variant IN ('hero_large', 'hero_recipe', 'card_medium', 'thumbnail', 'social', 'mobile'));

-- Add constraints for valid alignments (matching ALIGNMENT_CLASSES from markdown-processor.ts)
ALTER TABLE article_images 
ADD CONSTRAINT chk_valid_alignment 
CHECK (alignment IN ('center', 'left', 'right', 'full-width', 'inline'));

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_article_images_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_article_images_updated_at
    BEFORE UPDATE ON article_images
    FOR EACH ROW
    EXECUTE FUNCTION update_article_images_updated_at();

-- Add comments for documentation
COMMENT ON TABLE article_images IS 'Tracks image references within article content for custom markdown extensions';
COMMENT ON COLUMN article_images.filename IS 'Base filename without extension (e.g., "red-lentils-bowl")';
COMMENT ON COLUMN article_images.variant IS 'Image size variant from IMAGE_VARIANTS (e.g., "card_medium")';
COMMENT ON COLUMN article_images.alignment IS 'Image alignment in article layout (e.g., "center", "left", "right")';
COMMENT ON COLUMN article_images.r2_key IS 'Full R2 storage key for the image file';
COMMENT ON COLUMN article_images.position_in_article IS 'Approximate position of image in article (for ordering)';

-- Create a view for easy image lookup with article details
CREATE OR REPLACE VIEW article_images_with_details AS
SELECT 
    ai.*,
    ca.title as article_title,
    ca.slug as article_slug,
    ca.category as article_category,
    ca.status as article_status
FROM article_images ai
JOIN cms_articles ca ON ai.article_id = ca.id;

-- Function to extract and update image references from article content
CREATE OR REPLACE FUNCTION sync_article_images(p_article_id INTEGER)
RETURNS INTEGER AS $$
DECLARE
    article_content TEXT;
    image_count INTEGER := 0;
    image_match RECORD;
    position_counter INTEGER := 1;
BEGIN
    -- Get article content
    SELECT content INTO article_content 
    FROM cms_articles 
    WHERE id = p_article_id;
    
    IF article_content IS NULL THEN
        RETURN 0;
    END IF;
    
    -- Clear existing image references for this article
    DELETE FROM article_images WHERE article_id = p_article_id;
    
    -- Extract image references using regex
    -- Pattern matches: {image:filename:variant:alignment} or {image:filename:variant:alignment|caption}
    FOR image_match IN 
        SELECT 
            (regexp_matches(article_content, '\{image:([^:|\}]+):([^:|\}]+):([^|\}]+)(?:\|([^}]*))?\}', 'g'))[1] as filename,
            (regexp_matches(article_content, '\{image:([^:|\}]+):([^:|\}]+):([^|\}]+)(?:\|([^}]*))?\}', 'g'))[2] as variant,
            (regexp_matches(article_content, '\{image:([^:|\}]+):([^:|\}]+):([^|\}]+)(?:\|([^}]*))?\}', 'g'))[3] as alignment,
            (regexp_matches(article_content, '\{image:([^:|\}]+):([^:|\}]+):([^|\}]+)(?:\|([^}]*))?\}', 'g'))[4] as caption
    LOOP
        -- Insert image reference
        INSERT INTO article_images (
            article_id, 
            filename, 
            variant, 
            alignment,
            caption,
            r2_key,
            alt_text,
            position_in_article
        ) VALUES (
            p_article_id,
            image_match.filename,
            image_match.variant,
            image_match.alignment,
            image_match.caption,
            'articles/' || image_match.filename || '_' || 
                CASE 
                    WHEN image_match.variant = 'hero_large' THEN '1200x675'
                    WHEN image_match.variant = 'hero_recipe' THEN '800x1000'
                    WHEN image_match.variant = 'card_medium' THEN '600x400'
                    WHEN image_match.variant = 'thumbnail' THEN '300x200'
                    WHEN image_match.variant = 'social' THEN '1200x630'
                    WHEN image_match.variant = 'mobile' THEN '800x450'
                    ELSE '600x400'
                END || '.jpg',
            -- Generate alt text from filename
            regexp_replace(
                initcap(replace(replace(image_match.filename, '-', ' '), '_', ' ')),
                '\.[^.]*$', '', 'g'
            ),
            position_counter
        );
        
        image_count := image_count + 1;
        position_counter := position_counter + 1;
    END LOOP;
    
    RETURN image_count;
END;
$$ LANGUAGE plpgsql;

-- Verification
SELECT 'Article images table created successfully' as status;

-- Show table structure
\d article_images;