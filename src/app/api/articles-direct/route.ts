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
        category,
        featured,
        priority,
        tags,
        excerpt,
        content,
        author,
        reading_time as "readingTime",
        meta_title as "metaTitle",
        meta_description as "metaDescription", 
        keywords,
        nutritional_data as "nutritionalData",
        status,
        published_at as "publishedAt",
        created_at as "createdAt",
        updated_at as "updatedAt"
      FROM articles
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
    let countQuery = 'SELECT COUNT(*) FROM articles'
    if (conditions.length > 0) {
      countQuery += ` WHERE ${conditions.join(' AND ')}`
    }
    
    const countResult = await client.query(countQuery, params.slice(0, -2)) // Remove limit/offset params
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
    console.error('Articles API error:', error)
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
    console.log('Received article data:', JSON.stringify(body, null, 2))
    
    const {
      title,
      slug,
      productLine,
      category,
      featured = false,
      priority = 50,
      tags = [],
      excerpt,
      content,
      author = 'Lentils & Millets Team',
      readingTime = 5,
      seo = {},
      nutritionalData,
      status = 'draft'
    } = body
    
    const client = await pool.connect()
    
    const result = await client.query(`
      INSERT INTO articles (
        title, slug, product_line, category, featured, priority, tags,
        excerpt, content, author, reading_time, meta_title, meta_description,
        keywords, nutritional_data, status, published_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17
      ) RETURNING *
    `, [
      title,
      slug,
      productLine,
      category,
      featured,
      priority,
      JSON.stringify(tags || []),
      excerpt,
      content ? JSON.stringify({ root: { children: [{ type: 'paragraph', children: [{ text: content }] }] } }) : null,
      author,
      readingTime,
      seo.metaTitle || title,
      seo.metaDescription || excerpt,
      seo.keywords,
      nutritionalData ? JSON.stringify(nutritionalData) : null,
      status,
      status === 'published' ? new Date() : null
    ])
    
    client.release()
    
    return NextResponse.json({
      doc: result.rows[0],
      message: 'Article created successfully'
    })
    
  } catch (error) {
    console.error('Create article error:', error)
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Failed to create article'
    }, { status: 500 })
  } finally {
    await pool.end()
  }
}