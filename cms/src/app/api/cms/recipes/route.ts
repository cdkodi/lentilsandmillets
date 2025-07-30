import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || ''
    const limit = parseInt(searchParams.get('limit') || '10')
    
    const client = await pool.connect()
    
    let query = 'SELECT * FROM cms_recipes ORDER BY created_at DESC'
    let queryParams: any[] = []
    
    if (status && status !== '') {
      query = 'SELECT * FROM cms_recipes WHERE status = $1 ORDER BY created_at DESC LIMIT $2'
      queryParams = [status, limit]
    } else {
      query = 'SELECT * FROM cms_recipes ORDER BY created_at DESC LIMIT $1'
      queryParams = [limit]
    }
    
    const result = await client.query(query, queryParams)
    client.release()
    
    return NextResponse.json({
      success: true,
      data: {
        recipes: result.rows.map(row => ({
          id: row.id,
          title: row.title,
          slug: row.slug,
          description: row.description,
          prep_time: row.prep_time,
          cook_time: row.cook_time,
          servings: row.servings,
          difficulty: row.difficulty,
          ingredients: typeof row.ingredients === 'string' ? JSON.parse(row.ingredients) : row.ingredients,
          instructions: typeof row.instructions === 'string' ? JSON.parse(row.instructions) : row.instructions,
          nutritional_highlights: typeof row.nutritional_highlights === 'string' ? JSON.parse(row.nutritional_highlights) : row.nutritional_highlights,
          dietary_tags: typeof row.dietary_tags === 'string' ? JSON.parse(row.dietary_tags) : row.dietary_tags,
          status: row.status,
          author: row.author,
          card_position: row.card_position,
          is_featured: row.is_featured || false,
          created_at: row.created_at,
          updated_at: row.updated_at
        }))
      }
    })
    
  } catch (error) {
    console.error('Error fetching recipes:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch recipes' },
      { status: 500 }
    )
  }
}