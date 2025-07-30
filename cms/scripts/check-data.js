const { Pool } = require('pg')

async function checkData() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  })

  try {
    console.log('Connecting to database...')
    const client = await pool.connect()
    
    // Check recipes
    console.log('🥘 Recipes data:')
    const recipesData = await client.query('SELECT COUNT(*) as count FROM recipes')
    console.log(`   Total recipes: ${recipesData.rows[0].count}`)
    
    if (recipesData.rows[0].count > 0) {
      const sampleRecipes = await client.query('SELECT id, title, status FROM recipes LIMIT 3')
      sampleRecipes.rows.forEach(row => {
        console.log(`   - ${row.id}: ${row.title} (${row.status})`)
      })
    }
    
    // Check articles  
    console.log('\n📄 Articles data:')
    const articlesData = await client.query('SELECT COUNT(*) as count FROM articles')
    console.log(`   Total articles: ${articlesData.rows[0].count}`)
    
    if (articlesData.rows[0].count > 0) {
      const sampleArticles = await client.query('SELECT id, title, status FROM articles LIMIT 3')
      sampleArticles.rows.forEach(row => {
        console.log(`   - ${row.id}: ${row.title} (${row.status})`)
      })
    }
    
    // Add some test data if empty
    if (recipesData.rows[0].count === 0) {
      console.log('\n➕ Adding test recipe data...')
      await client.query(`
        INSERT INTO recipes (
          title, slug, product_line, description, cooking_time, difficulty, status
        ) VALUES 
        ('Simple Red Lentil Dal', 'simple-red-lentil-dal', 'lentils', 'A quick and nutritious lentil curry perfect for weeknight dinners', 25, 'easy', 'published'),
        ('Pearl Millet Breakfast Bowl', 'pearl-millet-breakfast-bowl', 'millets', 'Start your day with this protein-rich millet porridge', 15, 'easy', 'draft')
        ON CONFLICT (slug) DO NOTHING;
      `)
      console.log('   ✅ Test recipes added')
    }
    
    client.release()
  } catch (error) {
    console.error('❌ Error:', error.message)
  } finally {
    await pool.end()
  }
}

require('dotenv').config({ path: '.env.local' })
checkData().catch(console.error)