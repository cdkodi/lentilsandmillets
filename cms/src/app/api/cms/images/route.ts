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
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')
    
    const client = await pool.connect()
    
    let query = `
      SELECT id, filename, original_name, file_size, mime_type, width, height,
             public_url, variants, alt_text, category, created_at, updated_at
      FROM cms_images 
      WHERE 1=1
    `
    const queryParams: any[] = []
    let paramCount = 0
    
    if (category) {
      paramCount++
      query += ` AND category = $${paramCount}`
      queryParams.push(category)
    }
    
    if (search) {
      paramCount++
      query += ` AND (original_name ILIKE $${paramCount} OR alt_text ILIKE $${paramCount})`
      queryParams.push(`%${search}%`)
    }
    
    query += ` ORDER BY created_at DESC`
    
    if (limit > 0) {
      paramCount++
      query += ` LIMIT $${paramCount}`
      queryParams.push(limit)
    }
    
    if (offset > 0) {
      paramCount++
      query += ` OFFSET $${paramCount}`
      queryParams.push(offset)
    }
    
    const result = await client.query(query, queryParams)
    
    // Get total count for pagination
    let countQuery = 'SELECT COUNT(*) FROM cms_images WHERE 1=1'
    const countParams: any[] = []
    let countParamCount = 0
    
    if (category) {
      countParamCount++
      countQuery += ` AND category = $${countParamCount}`
      countParams.push(category)
    }
    
    if (search) {
      countParamCount++
      countQuery += ` AND (original_name ILIKE $${countParamCount} OR alt_text ILIKE $${countParamCount})`
      countParams.push(`%${search}%`)
    }
    
    const countResult = await client.query(countQuery, countParams)
    const totalCount = parseInt(countResult.rows[0].count)
    
    client.release()
    
    return NextResponse.json({
      success: true,
      data: {
        images: result.rows.map(row => ({
          id: row.id,
          filename: row.filename,
          original_name: row.original_name,
          file_size: row.file_size,
          mime_type: row.mime_type,
          width: row.width,
          height: row.height,
          public_url: row.public_url,
          variants: typeof row.variants === 'string' ? JSON.parse(row.variants) : row.variants,
          alt_text: row.alt_text,
          category: row.category,
          created_at: row.created_at,
          updated_at: row.updated_at
        })),
        pagination: {
          total: totalCount,
          limit,
          offset,
          has_more: (offset + limit) < totalCount
        }
      }
    })
    
  } catch (error) {
    console.error('Error fetching images:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch images' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const imageId = searchParams.get('id')
    
    if (!imageId) {
      return NextResponse.json(
        { error: 'Image ID is required' },
        { status: 400 }
      )
    }
    
    const client = await pool.connect()
    
    // Delete the image record from database
    const result = await client.query(
      'DELETE FROM cms_images WHERE id = $1 RETURNING *',
      [imageId]
    )
    
    if (result.rows.length === 0) {
      client.release()
      return NextResponse.json(
        { error: 'Image not found' },
        { status: 404 }
      )
    }
    
    client.release()
    
    // TODO: Also delete from R2 storage when implemented
    
    return NextResponse.json({
      success: true,
      message: 'Image deleted successfully'
    })
    
  } catch (error) {
    console.error('Error deleting image:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete image' },
      { status: 500 }
    )
  }
}