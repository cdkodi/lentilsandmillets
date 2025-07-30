const { Pool } = require('pg')
const fs = require('fs')
const path = require('path')

async function initDatabase() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  })

  try {
    console.log('Connecting to database...')
    const client = await pool.connect()
    
    console.log('Reading SQL script...')
    const sqlScript = fs.readFileSync(path.join(__dirname, 'init-database.sql'), 'utf8')
    
    console.log('Executing SQL script...')
    await client.query(sqlScript)
    
    console.log('✅ Database initialized successfully!')
    
    // Test the tables
    const articlesCount = await client.query('SELECT COUNT(*) FROM articles')
    const recipesCount = await client.query('SELECT COUNT(*) FROM recipes')
    
    console.log(`📊 Tables created:`)
    console.log(`   - Articles: ${articlesCount.rows[0].count} rows`)
    console.log(`   - Recipes: ${recipesCount.rows[0].count} rows`)
    
    client.release()
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message)
    console.error('Full error:', error)
  } finally {
    await pool.end()
  }
}

// Load environment variables
require('dotenv').config({ path: '.env.local' })

initDatabase().catch(console.error)