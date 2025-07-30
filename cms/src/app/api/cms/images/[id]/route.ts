import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
})

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const client = await pool.connect()
    
    const result = await client.query(
      `SELECT id, filename, original_name, file_size, mime_type, width, height,
              public_url, variants, alt_text, category, created_at, updated_at
       FROM cms_images 
       WHERE id = $1`,
      [id]
    )
    
    client.release()
    
    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Image not found' },
        { status: 404 }
      )
    }
    
    const image = result.rows[0]
    
    return NextResponse.json({
      success: true,
      data: {
        id: image.id,
        filename: image.filename,
        original_name: image.original_name,
        file_size: image.file_size,
        mime_type: image.mime_type,
        width: image.width,
        height: image.height,
        public_url: image.public_url,
        variants: typeof image.variants === 'string' ? JSON.parse(image.variants) : image.variants,
        alt_text: image.alt_text,
        category: image.category,
        created_at: image.created_at,
        updated_at: image.updated_at
      }
    })
    
  } catch (error) {
    console.error('Error fetching image:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch image' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { alt_text, category } = body
    
    const client = await pool.connect()
    
    const result = await client.query(
      `UPDATE cms_images 
       SET alt_text = $1, category = $2, updated_at = NOW()
       WHERE id = $3
       RETURNING *`,
      [alt_text, category, id]
    )
    
    client.release()
    
    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Image not found' },
        { status: 404 }
      )
    }
    
    const image = result.rows[0]
    
    return NextResponse.json({
      success: true,
      data: {
        id: image.id,
        filename: image.filename,
        original_name: image.original_name,
        file_size: image.file_size,
        mime_type: image.mime_type,
        width: image.width,
        height: image.height,
        public_url: image.public_url,
        variants: typeof image.variants === 'string' ? JSON.parse(image.variants) : image.variants,
        alt_text: image.alt_text,
        category: image.category,
        created_at: image.created_at,
        updated_at: image.updated_at
      }
    })
    
  } catch (error) {
    console.error('Error updating image:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update image' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const client = await pool.connect()
    
    const result = await client.query(
      'DELETE FROM cms_images WHERE id = $1 RETURNING *',
      [id]
    )
    
    client.release()
    
    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Image not found' },
        { status: 404 }
      )
    }
    
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