import { NextApiRequest, NextApiResponse } from 'next';
import { neon } from '@neondatabase/serverless';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Initialize database connection
    const sql = neon(process.env.DATABASE_URL!);

    // Get query parameters
    const { category, search, limit = '50', offset = '0' } = req.query;

    // Build the query with proper Neon syntax
    let images;
    let total = 0;

    // Parse parameters
    const limitNum = parseInt(limit as string, 10);
    const offsetNum = parseInt(offset as string, 10);

    if (category && category !== 'all' && search) {
      // Filter by both category and search
      const searchPattern = `%${search}%`;
      images = await sql`
        SELECT 
          id, filename, original_name, file_size, mime_type, 
          width, height, r2_key, public_url, variants, 
          alt_text, category, created_at, updated_at
        FROM cms_images
        WHERE category = ${category}
          AND (original_name ILIKE ${searchPattern} 
               OR filename ILIKE ${searchPattern} 
               OR alt_text ILIKE ${searchPattern})
        ORDER BY created_at DESC 
        LIMIT ${limitNum} OFFSET ${offsetNum}
      `;
      
      const [{ count }] = await sql`
        SELECT COUNT(*) as count FROM cms_images
        WHERE category = ${category}
          AND (original_name ILIKE ${searchPattern} 
               OR filename ILIKE ${searchPattern} 
               OR alt_text ILIKE ${searchPattern})
      `;
      total = count;
      
    } else if (category && category !== 'all') {
      // Filter by category only
      images = await sql`
        SELECT 
          id, filename, original_name, file_size, mime_type, 
          width, height, r2_key, public_url, variants, 
          alt_text, category, created_at, updated_at
        FROM cms_images
        WHERE category = ${category}
        ORDER BY created_at DESC 
        LIMIT ${limitNum} OFFSET ${offsetNum}
      `;
      
      const [{ count }] = await sql`
        SELECT COUNT(*) as count FROM cms_images
        WHERE category = ${category}
      `;
      total = count;
      
    } else if (search) {
      // Filter by search only
      const searchPattern = `%${search}%`;
      images = await sql`
        SELECT 
          id, filename, original_name, file_size, mime_type, 
          width, height, r2_key, public_url, variants, 
          alt_text, category, created_at, updated_at
        FROM cms_images
        WHERE original_name ILIKE ${searchPattern} 
           OR filename ILIKE ${searchPattern} 
           OR alt_text ILIKE ${searchPattern}
        ORDER BY created_at DESC 
        LIMIT ${limitNum} OFFSET ${offsetNum}
      `;
      
      const [{ count }] = await sql`
        SELECT COUNT(*) as count FROM cms_images
        WHERE original_name ILIKE ${searchPattern} 
           OR filename ILIKE ${searchPattern} 
           OR alt_text ILIKE ${searchPattern}
      `;
      total = count;
      
    } else {
      // No filters - get all images
      images = await sql`
        SELECT 
          id, filename, original_name, file_size, mime_type, 
          width, height, r2_key, public_url, variants, 
          alt_text, category, created_at, updated_at
        FROM cms_images
        ORDER BY created_at DESC 
        LIMIT ${limitNum} OFFSET ${offsetNum}
      `;
      
      const [{ count }] = await sql`
        SELECT COUNT(*) as count FROM cms_images
      `;
      total = count;
    }

    // Return the results
    res.status(200).json({
      success: true,
      images: images.map(image => ({
        ...image,
        variants: typeof image.variants === 'string' 
          ? JSON.parse(image.variants) 
          : image.variants
      })),
      pagination: {
        total: total,
        limit: parseInt(limit as string, 10),
        offset: parseInt(offset as string, 10),
        hasMore: parseInt(offset as string, 10) + parseInt(limit as string, 10) < total
      }
    });

  } catch (error) {
    console.error('Error fetching images:', error);
    
    return res.status(500).json({ 
      error: 'Failed to fetch images',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}