const { Pool } = require('pg')

async function checkTables() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  })

  try {
    console.log('Connecting to database...')
    const client = await pool.connect()
    
    console.log('Checking existing tables...')
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `)
    
    console.log('📋 Existing tables:')
    tablesResult.rows.forEach(row => {
      console.log(`   - ${row.table_name}`)
    })
    
    // Check articles table structure if it exists
    if (tablesResult.rows.some(row => row.table_name === 'articles')) {
      console.log('\n📊 Articles table structure:')
      const columnsResult = await client.query(`
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns 
        WHERE table_name = 'articles'
        ORDER BY ordinal_position;
      `)
      columnsResult.rows.forEach(row => {
        console.log(`   - ${row.column_name}: ${row.data_type} ${row.is_nullable === 'NO' ? 'NOT NULL' : 'NULL'} ${row.column_default ? `DEFAULT ${row.column_default}` : ''}`)
      })
    }
    
    client.release()
  } catch (error) {
    console.error('❌ Error:', error.message)
  } finally {
    await pool.end()
  }
}

// Load environment variables
require('dotenv').config({ path: '.env.local' })

checkTables().catch(console.error)