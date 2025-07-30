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
    let query = 'SELECT * FROM cms_articles ORDER BY created_at DESC'
    let queryParams: any[] = []
    
    if (status && status !== '') {
      query = 'SELECT * FROM cms_articles WHERE status = $1 ORDER BY created_at DESC'
      queryParams = [status]
    }
    
    const client = await pool.connect()
    const result = await client.query(query, queryParams)
    client.release()
    
    // Format response to match expected structure
    const articles = result.rows.map(row => ({
      id: row.id,
      title: row.title,
      slug: row.slug,
      content: row.content,
      excerpt: row.excerpt,
      status: row.status,
      category: row.category,
      card_position: row.card_position,
      author: row.author,
      meta_title: row.meta_title,
      meta_description: row.meta_description,
      featured_image: row.featured_image,
      factoid_data: row.factoid_data,
      created_at: row.created_at,
      updated_at: row.updated_at,
      published_at: row.published_at,
      productLine: row.category // Map category to productLine for UI
    }))
    
    return NextResponse.json({
      docs: articles,
      totalDocs: articles.length,
      limit: articles.length,
      page: 1,
      totalPages: 1,
      hasNextPage: false,
      hasPrevPage: false
    })
    
  } catch (error) {
    console.error('Error fetching articles:', error)
    return NextResponse.json(
      { error: 'Failed to fetch articles' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const client = await pool.connect()
    const result = await client.query(
      `INSERT INTO cms_articles 
       (title, slug, content, excerpt, status, category, card_position, author, meta_title, meta_description, featured_image, factoid_data, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW(), NOW())
       RETURNING *`,
      [
        body.title,
        body.slug,
        body.content,
        body.excerpt,
        body.status || 'draft',
        body.category || body.productLine || 'lentils',
        body.card_position,
        body.author || 'Admin',
        body.seo?.metaTitle || body.meta_title,
        body.seo?.metaDescription || body.meta_description,
        body.featuredImage ? JSON.stringify(body.featuredImage) : null,
        body.factoidData ? JSON.stringify(body.factoidData) : null
      ]
    )
    client.release()
    
    return NextResponse.json(result.rows[0])
    
  } catch (error) {
    console.error('Error creating article:', error)
    return NextResponse.json(
      { error: 'Failed to create article' },
      { status: 500 }
    )
  }
}