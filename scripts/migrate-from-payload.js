const { Pool } = require('pg')

async function migrateFromPayload() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  })

  try {
    console.log('Connecting to database...')
    const client = await pool.connect()
    
    console.log('🔄 Migrating from Payload schema to simplified schema...')
    
    // Add missing columns to articles table
    console.log('Adding missing columns to articles table...')
    await client.query(`
      ALTER TABLE articles 
      ADD COLUMN IF NOT EXISTS category VARCHAR(50),
      ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false,
      ADD COLUMN IF NOT EXISTS priority INTEGER DEFAULT 50,
      ADD COLUMN IF NOT EXISTS tags JSONB DEFAULT '[]',
      ADD COLUMN IF NOT EXISTS meta_title VARCHAR(255),
      ADD COLUMN IF NOT EXISTS meta_description TEXT,
      ADD COLUMN IF NOT EXISTS keywords TEXT,
      ADD COLUMN IF NOT EXISTS nutritional_data JSONB;
    `)
    
    // Migrate SEO data to new columns if they don't exist
    console.log('Migrating SEO data...')
    await client.query(`
      UPDATE articles 
      SET 
        meta_title = seo_meta_title,
        meta_description = seo_meta_description,
        keywords = seo_keywords
      WHERE meta_title IS NULL;
    `)
    
    // Migrate nutritional data to JSONB
    console.log('Migrating nutritional data...')
    await client.query(`
      UPDATE articles 
      SET nutritional_data = jsonb_build_object(
        'metric1', jsonb_build_object(
          'value', nutritional_data_metric1_value,
          'label', nutritional_data_metric1_label
        ),
        'metric2', jsonb_build_object(
          'value', nutritional_data_metric2_value,
          'label', nutritional_data_metric2_label
        ),
        'keyBenefits', '[]'::jsonb
      )
      WHERE nutritional_data_metric1_value IS NOT NULL 
      AND nutritional_data IS NULL;
    `)
    
    // Check recipes table and add missing columns
    console.log('Checking recipes table...')
    const recipesColumns = await client.query(`
      SELECT column_name FROM information_schema.columns 
      WHERE table_name = 'recipes';
    `)
    
    const hasDescription = recipesColumns.rows.some(row => row.column_name === 'description')
    if (!hasDescription) {
      console.log('Adding description column to recipes...')
      await client.query(`ALTER TABLE recipes ADD COLUMN description TEXT;`)
    }
    
    // Create consolidated ingredients and instructions from related tables
    console.log('Consolidating recipe data...')
    
    // Get recipes with their ingredients
    const recipesWithIngredients = await client.query(`
      SELECT r.id, 
             COALESCE(array_agg(
               CASE WHEN ri.id IS NOT NULL THEN 
                 jsonb_build_object('item', ri.item, 'amount', ri.amount)
               END
             ) FILTER (WHERE ri.id IS NOT NULL), '[]') as ingredients
      FROM recipes r
      LEFT JOIN recipes_ingredients ri ON r.id = ri._parent_id
      GROUP BY r.id;
    `)
    
    // Update recipes with consolidated ingredients
    for (const recipe of recipesWithIngredients.rows) {
      await client.query(`
        UPDATE recipes 
        SET ingredients = $1 
        WHERE id = $2;
      `, [JSON.stringify(recipe.ingredients), recipe.id])
    }
    
    // Get recipes with their instructions
    const recipesWithInstructions = await client.query(`
      SELECT r.id,
             COALESCE(array_agg(
               CASE WHEN ri.id IS NOT NULL THEN 
                 jsonb_build_object('step', ri.step)
               END ORDER BY ri._order
             ) FILTER (WHERE ri.id IS NOT NULL), '[]') as instructions
      FROM recipes r
      LEFT JOIN recipes_instructions ri ON r.id = ri._parent_id
      GROUP BY r.id;
    `)
    
    // Update recipes with consolidated instructions  
    for (const recipe of recipesWithInstructions.rows) {
      await client.query(`
        UPDATE recipes 
        SET instructions = $1 
        WHERE id = $2;
      `, [JSON.stringify(recipe.instructions), recipe.id])
    }
    
    // Create indexes
    console.log('Creating indexes...')
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
      CREATE INDEX IF NOT EXISTS idx_articles_product_line ON articles(product_line);
      CREATE INDEX IF NOT EXISTS idx_articles_status ON articles(status);
      CREATE INDEX IF NOT EXISTS idx_articles_featured ON articles(featured);
      CREATE INDEX IF NOT EXISTS idx_recipes_slug ON recipes(slug);
      CREATE INDEX IF NOT EXISTS idx_recipes_product_line ON recipes(product_line);
      CREATE INDEX IF NOT EXISTS idx_recipes_status ON recipes(status);
    `)
    
    // Test the migration
    console.log('Testing migrated data...')
    const articlesCount = await client.query('SELECT COUNT(*) FROM articles')
    const recipesCount = await client.query('SELECT COUNT(*) FROM recipes')
    
    console.log('✅ Migration completed successfully!')
    console.log(`📊 Migrated data:`)
    console.log(`   - Articles: ${articlesCount.rows[0].count} rows`)
    console.log(`   - Recipes: ${recipesCount.rows[0].count} rows`)
    
    // Show sample data
    const sampleArticle = await client.query('SELECT title, slug, product_line, status FROM articles LIMIT 1')
    if (sampleArticle.rows.length > 0) {
      console.log(`📄 Sample article: "${sampleArticle.rows[0].title}" (${sampleArticle.rows[0].product_line})`)
    }
    
    client.release()
  } catch (error) {
    console.error('❌ Migration failed:', error.message)
    console.error('Full error:', error)
  } finally {
    await pool.end()
  }
}

// Load environment variables
require('dotenv').config({ path: '.env.local' })

migrateFromPayload().catch(console.error)