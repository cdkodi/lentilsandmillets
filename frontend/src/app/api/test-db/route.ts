import { NextResponse } from 'next/server'

// Force dynamic rendering to prevent static generation during build
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    // Test actual database connection
    const { Pool } = require('pg')
    
    console.log('Testing database connection...')
    const start = Date.now()
    
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 5000, // 5 second timeout
      query_timeout: 10000, // 10 second query timeout
    })

    const client = await pool.connect()
    const result = await client.query('SELECT NOW() as current_time, version() as pg_version')
    const connectTime = Date.now() - start
    
    client.release()
    await pool.end()

    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      connectionTime: `${connectTime}ms`,
      currentTime: result.rows[0].current_time,
      postgresVersion: result.rows[0].pg_version,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Database test error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}