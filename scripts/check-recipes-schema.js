const { Pool } = require('pg')

async function checkRecipesSchema() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  })

  try {
    console.log('Connecting to database...')
    const client = await pool.connect()
    
    console.log('📊 Recipes table structure:')
    const columnsResult = await client.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'recipes'
      ORDER BY ordinal_position;
    `)
    columnsResult.rows.forEach(row => {
      console.log(`   - ${row.column_name}: ${row.data_type} ${row.is_nullable === 'NO' ? 'NOT NULL' : 'NULL'} ${row.column_default ? `DEFAULT ${row.column_default}` : ''}`)
    })
    
    // Check related tables
    console.log('\n🔗 Related tables:')
    const relatedTables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name LIKE '%recipes%'
      ORDER BY table_name;
    `)
    relatedTables.rows.forEach(row => {
      console.log(`   - ${row.table_name}`)
    })
    
    // Sample data from recipes_ingredients
    console.log('\n🥘 Sample ingredients data:')
    const ingredientsData = await client.query(`
      SELECT ri.id, ri._parent_id, ri.item, ri.amount, r.title
      FROM recipes_ingredients ri
      JOIN recipes r ON ri._parent_id = r.id
      LIMIT 5;
    `)
    ingredientsData.rows.forEach(row => {
      console.log(`   - ${row.title}: ${row.item} (${row.amount})`)
    })
    
    client.release()
  } catch (error) {
    console.error('❌ Error:', error.message)
  } finally {
    await pool.end()
  }
}

require('dotenv').config({ path: '.env.local' })
checkRecipesSchema().catch(console.error)