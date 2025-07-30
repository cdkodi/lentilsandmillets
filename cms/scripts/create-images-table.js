const { neon } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env.local' });

async function createImagesTable() {
  // Initialize database connection
  const sql = neon(process.env.DATABASE_URL);

  try {
    console.log('Creating cms_images table...');
    
    // Create the cms_images table
    await sql`
      CREATE TABLE IF NOT EXISTS cms_images (
        id SERIAL PRIMARY KEY,
        filename VARCHAR(255) NOT NULL,
        original_name VARCHAR(255) NOT NULL,
        file_size INTEGER NOT NULL,
        mime_type VARCHAR(100) NOT NULL,
        width INTEGER,
        height INTEGER,
        r2_key VARCHAR(500) NOT NULL UNIQUE,
        public_url TEXT NOT NULL,
        variants JSONB DEFAULT '{}',
        alt_text TEXT,
        category VARCHAR(50) DEFAULT 'general',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    
    console.log('✓ cms_images table created successfully');

    // Add indexes for better query performance
    await sql`CREATE INDEX IF NOT EXISTS idx_cms_images_category ON cms_images(category);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_cms_images_created_at ON cms_images(created_at);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_cms_images_r2_key ON cms_images(r2_key);`;
    
    console.log('✓ Database indexes created');

    // Add foreign key columns to existing tables (but don't require them yet for backward compatibility)
    try {
      await sql`ALTER TABLE cms_articles ADD COLUMN IF NOT EXISTS hero_image_id INTEGER REFERENCES cms_images(id);`;
      console.log('✓ Added hero_image_id to cms_articles');
    } catch (error) {
      if (!error.message.includes('already exists')) {
        console.warn('Warning adding hero_image_id to cms_articles:', error.message);
      }
    }

    try {
      await sql`ALTER TABLE cms_recipes ADD COLUMN IF NOT EXISTS hero_image_id INTEGER REFERENCES cms_images(id);`;
      console.log('✓ Added hero_image_id to cms_recipes'); 
    } catch (error) {
      if (!error.message.includes('already exists')) {
        console.warn('Warning adding hero_image_id to cms_recipes:', error.message);
      }
    }

    console.log('✓ Database schema setup complete');
    console.log('\n🎉 Image management database schema setup complete!');
    
    // Show table structure
    const tableInfo = await sql`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'cms_images' 
      ORDER BY ordinal_position;
    `;
    
    console.log('\n📋 Table Structure:');
    console.table(tableInfo);

  } catch (error) {
    console.error('❌ Error creating images table:', error);
    process.exit(1);
  }
}

createImagesTable();