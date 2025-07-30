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
    const status = searchParams.get('status')
    
    // Build query based on status filter
    let query = 'SELECT * FROM cms_recipes ORDER BY created_at DESC'
    let queryParams: any[] = []
    
    if (status && status !== '') {
      query = 'SELECT * FROM cms_recipes WHERE status = $1 ORDER BY created_at DESC'
      queryParams = [status]
    }
    
    const client = await pool.connect()
    const result = await client.query(query, queryParams)
    client.release()
    
    // Format response to match expected structure
    const recipes = result.rows.map(row => ({
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
      created_at: row.created_at,
      updated_at: row.updated_at,
      productLine: 'Recipes' // Default product line for recipes
    }))
    
    return NextResponse.json({
      docs: recipes,
      totalDocs: recipes.length,
      limit: recipes.length,
      page: 1,
      totalPages: 1,
      hasNextPage: false,
      hasPrevPage: false
    })
    
  } catch (error) {
    console.error('Error fetching recipes:', error)
    return NextResponse.json(
      { error: 'Failed to fetch recipes' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const client = await pool.connect()
    const result = await client.query(
      `INSERT INTO cms_recipes 
       (title, slug, description, prep_time, cook_time, servings, difficulty, ingredients, instructions, nutritional_highlights, dietary_tags, status, author, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, NOW(), NOW())
       RETURNING *`,
      [
        body.title,
        body.slug,
        body.description,
        body.prep_time || 15,
        body.cook_time || 30,
        body.servings || 4,
        body.difficulty || 'easy',
        JSON.stringify(body.ingredients || []),
        JSON.stringify(body.instructions || []),
        JSON.stringify(body.nutritional_highlights || []),
        JSON.stringify(body.dietary_tags || []),
        body.status || 'draft',
        body.author || 'Admin'
      ]
    )
    client.release()
    
    return NextResponse.json(result.rows[0])
    
  } catch (error) {
    console.error('Error creating recipe:', error)
    return NextResponse.json(
      { error: 'Failed to create recipe' },
      { status: 500 }
    )
  }
}