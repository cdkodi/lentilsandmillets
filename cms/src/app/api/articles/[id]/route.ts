import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
})

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const articleId = parseInt(params.id)
    
    if (isNaN(articleId)) {
      return NextResponse.json(
        { error: 'Invalid article ID' },
        { status: 400 }
      )
    }
    
    const client = await pool.connect()
    
    // Query the cms_articles table (which is where AI-generated articles are saved)
    const result = await client.query(
      'SELECT * FROM cms_articles WHERE id = $1',
      [articleId]
    )
    
    client.release()
    
    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      )
    }
    
    const article = result.rows[0]
    
    return NextResponse.json({
      success: true,
      data: {
        id: article.id,
        title: article.title,
        slug: article.slug,
        content: article.content,
        excerpt: article.excerpt,
        status: article.status,
        category: article.category,
        card_position: article.card_position,
        author: article.author,
        meta_title: article.meta_title,
        meta_description: article.meta_description,
        created_at: article.created_at,
        updated_at: article.updated_at,
        published_at: article.published_at
      }
    })
    
  } catch (error) {
    console.error('Error fetching article:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const articleId = parseInt(params.id)
    
    if (isNaN(articleId)) {
      return NextResponse.json(
        { error: 'Invalid article ID' },
        { status: 400 }
      )
    }
    
    const body = await request.json()
    const client = await pool.connect()
    
    // Update the article
    const result = await client.query(
      `UPDATE cms_articles SET 
         title = $1, slug = $2, content = $3, excerpt = $4, 
         status = $5, category = $6, author = $7, 
         meta_title = $8, meta_description = $9, 
         published_at = $10, updated_at = NOW()
       WHERE id = $11 
       RETURNING *`,
      [
        body.title,
        body.slug,
        body.content,
        body.excerpt,
        body.status,
        body.productLine, // Map productLine to category
        body.author,
        body.seo?.metaTitle || body.title,
        body.seo?.metaDescription || body.excerpt,
        body.status === 'published' ? body.publishedAt || new Date().toISOString() : null,
        articleId
      ]
    )
    
    client.release()
    
    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      data: result.rows[0]
    })
    
  } catch (error) {
    console.error('Error updating article:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const articleId = parseInt(params.id)
    
    if (isNaN(articleId)) {
      return NextResponse.json(
        { error: 'Invalid article ID' },
        { status: 400 }
      )
    }
    
    const client = await pool.connect()
    
    // Delete the article
    const result = await client.query(
      'DELETE FROM cms_articles WHERE id = $1 RETURNING id',
      [articleId]
    )
    
    client.release()
    
    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      message: 'Article deleted successfully'
    })
    
  } catch (error) {
    console.error('Error deleting article:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}