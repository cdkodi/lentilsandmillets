import { neon } from '@neondatabase/serverless'
import { config } from 'dotenv'

// Load environment variables
config({ path: '.env.local' })

async function checkDatabase() {
  try {
    console.log('🔍 Checking database connection and tables...')
    console.log('Database URL exists:', !!process.env.DATABASE_URL)
    
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL not found in environment variables')
    }
    
    const sql = neon(process.env.DATABASE_URL)
    
    // Check if database connection works
    const result = await sql`SELECT current_database(), current_user`
    console.log('✅ Database connected:', result[0])
    
    // List all tables
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `
    
    console.log('\n📋 Existing tables:')
    if (tables.length === 0) {
      console.log('   No tables found - database is empty')
    } else {
      tables.forEach(table => {
        console.log(`   - ${table.table_name}`)
      })
    }
    
    // Check for Payload-specific tables
    const payloadTables = tables.filter(t => 
      ['users', 'articles', 'recipes', 'media', 'pagelayouts', 'payload_migrations'].includes(t.table_name.toLowerCase())
    )
    
    console.log('\n🎯 Payload tables found:')
    if (payloadTables.length === 0) {
      console.log('   No Payload tables found - migrations needed')
    } else {
      payloadTables.forEach(table => {
        console.log(`   - ${table.table_name}`)
      })
    }
    
  } catch (error) {
    console.error('❌ Database check failed:', error.message)
  }
}

checkDatabase()