import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

async function getDbConnection() {
  const { Pool } = require('pg')
  return new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 5000,
    query_timeout: 10000,
  })
}

export async function GET(request: NextRequest) {
  const pool = await getDbConnection()
  
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')
    const status = searchParams.get('status') || 'published'
    const productLine = searchParams.get('productLine')
    
    let query = `
      SELECT 
        id,
        title,
        slug,
        product_line as "productLine",
        description,
        content,
        cooking_time as "cookingTime",
        difficulty,
        jsonb_build_object(
          'calories', nutritional_info_calories,
          'protein', nutritional_info_protein,
          'fiber', nutritional_info_fiber,
          'iron', nutritional_info_iron
        ) as "nutritionalInfo",
        status,
        published_at as "publishedAt",
        created_at as "createdAt",
        updated_at as "updatedAt"
      FROM recipes
    `
    
    const conditions = []
    const params = []
    let paramCount = 0
    
    if (status) {
      conditions.push(`status = $${++paramCount}`)
      params.push(status)
    }
    
    if (productLine) {
      conditions.push(`product_line = $${++paramCount}`)
      params.push(productLine)
    }
    
    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(' AND ')}`
    }
    
    query += ` ORDER BY created_at DESC LIMIT $${++paramCount} OFFSET $${++paramCount}`
    params.push(limit, offset)
    
    const client = await pool.connect()
    const result = await client.query(query, params)
    
    // Get total count for pagination
    let countQuery = 'SELECT COUNT(*) FROM recipes'
    if (conditions.length > 0) {
      countQuery += ` WHERE ${conditions.join(' AND ')}`
    }
    
    const countResult = await client.query(countQuery, params.slice(0, -2))
    const totalCount = parseInt(countResult.rows[0].count)
    
    client.release()
    
    return NextResponse.json({
      docs: result.rows,
      totalDocs: totalCount,
      limit,
      offset,
      totalPages: Math.ceil(totalCount / limit),
      page: Math.floor(offset / limit) + 1,
      hasNextPage: offset + limit < totalCount,
      hasPrevPage: offset > 0
    })
    
  } catch (error) {
    console.error('Recipes API error:', error)
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Database error'
    }, { status: 500 })
  } finally {
    await pool.end()
  }
}

export async function POST(request: NextRequest) {
  const pool = await getDbConnection()
  
  try {
    const body = await request.json()
    const {
      title,
      slug,
      productLine,
      description,
      content,
      ingredients = [],
      instructions = [],
      cookingTime,
      difficulty,
      nutritionalInfo,
      tags = [],
      status = 'draft'
    } = body
    
    const client = await pool.connect()
    
    const result = await client.query(`
      INSERT INTO recipes (
        title, slug, product_line, description, content, ingredients,
        instructions, cooking_time, difficulty, nutritional_info, tags,
        status, published_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13
      ) RETURNING *
    `, [
      title,
      slug,
      productLine,
      description,
      content,
      JSON.stringify(ingredients),
      JSON.stringify(instructions),
      cookingTime,
      difficulty,
      nutritionalInfo ? JSON.stringify(nutritionalInfo) : null,
      JSON.stringify(tags),
      status,
      status === 'published' ? new Date() : null
    ])
    
    client.release()
    
    return NextResponse.json({
      doc: result.rows[0],
      message: 'Recipe created successfully'
    })
    
  } catch (error) {
    console.error('Create recipe error:', error)
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Failed to create recipe'
    }, { status: 500 })
  } finally {
    await pool.end()
  }
}