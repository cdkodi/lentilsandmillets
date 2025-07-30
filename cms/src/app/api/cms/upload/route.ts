import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
})

export async function POST(request: NextRequest) {
  try {
    // For now, return a placeholder response until we implement full R2 integration
    // This prevents the ImageManager from crashing
    
    const formData = await request.formData()
    const file = formData.get('file') as File
    const category = formData.get('category') as string || 'general'
    const altText = formData.get('alt_text') as string || ''
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      )
    }
    
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: `Unsupported file type. Supported types: ${allowedTypes.join(', ')}` },
        { status: 400 }
      )
    }
    
    // For now, create a placeholder database record without actual R2 upload
    const client = await pool.connect()
    
    const result = await client.query(
      `INSERT INTO cms_images (
        filename, original_name, file_size, mime_type, width, height,
        r2_key, public_url, variants, alt_text, category, created_at, updated_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW(), NOW()
      )
      RETURNING *`,
      [
        `${file.name}_${Date.now()}`,
        file.name,
        file.size,
        file.type,
        800,  // placeholder width
        600,  // placeholder height
        `placeholder/${file.name}`,
        `https://placeholder-images.com/800x600/${category}`,
        JSON.stringify({
          urls: {
            original: `https://placeholder-images.com/800x600/original`,
            hero_large: `https://placeholder-images.com/1200x675/hero`,
            card_medium: `https://placeholder-images.com/600x400/card`,
            thumbnail: `https://placeholder-images.com/300x200/thumb`
          },
          metadata: {
            hero_large: { width: 1200, height: 675 },
            card_medium: { width: 600, height: 400 },
            thumbnail: { width: 300, height: 200 }
          }
        }),
        altText,
        category
      ]
    )
    
    client.release()
    
    return NextResponse.json({
      success: true,
      data: {
        id: result.rows[0].id,
        filename: result.rows[0].filename,
        original_name: result.rows[0].original_name,
        file_size: result.rows[0].file_size,
        mime_type: result.rows[0].mime_type,
        width: result.rows[0].width,
        height: result.rows[0].height,
        public_url: result.rows[0].public_url,
        variants: result.rows[0].variants,
        alt_text: result.rows[0].alt_text,
        category: result.rows[0].category,
        created_at: result.rows[0].created_at
      }
    })
    
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Upload failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}