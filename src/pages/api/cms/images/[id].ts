import { NextApiRequest, NextApiResponse } from 'next';
import { neon } from '@neondatabase/serverless';
import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import { r2Client, R2_CONFIG } from '@/lib/r2-client';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id || Array.isArray(id)) {
    return res.status(400).json({ error: 'Invalid image ID' });
  }

  if (req.method === 'DELETE') {
    return handleDelete(req, res, parseInt(id, 10));
  }

  if (req.method === 'GET') {
    return handleGet(req, res, parseInt(id, 10));
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

// Handle GET - fetch single image
async function handleGet(req: NextApiRequest, res: NextApiResponse, imageId: number) {
  try {
    const sql = neon(process.env.DATABASE_URL!);

    const [image] = await sql`
      SELECT 
        id, filename, original_name, file_size, mime_type, 
        width, height, r2_key, public_url, variants, 
        alt_text, category, created_at, updated_at
      FROM cms_images 
      WHERE id = ${imageId}
    `;

    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }

    res.status(200).json({
      success: true,
      image: {
        ...image,
        variants: typeof image.variants === 'string' 
          ? JSON.parse(image.variants) 
          : image.variants
      }
    });

  } catch (error) {
    console.error('Error fetching image:', error);
    
    return res.status(500).json({ 
      error: 'Failed to fetch image',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

// Handle DELETE - remove image and all its variants
async function handleDelete(req: NextApiRequest, res: NextApiResponse, imageId: number) {
  try {
    const sql = neon(process.env.DATABASE_URL!);

    // First, get the image record to get R2 keys for cleanup
    const [image] = await sql`
      SELECT r2_key, variants, filename
      FROM cms_images 
      WHERE id = ${imageId}
    `;

    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }

    console.log(`Deleting image: ${image.filename} (ID: ${imageId})`);

    // Parse variants to get all R2 keys that need to be deleted
    const variants = typeof image.variants === 'string' 
      ? JSON.parse(image.variants) 
      : image.variants;

    const keysToDelete: string[] = [image.r2_key]; // Original image key

    // Add all variant keys
    if (variants && variants.urls) {
      Object.values(variants.urls).forEach((url: any) => {
        if (typeof url === 'string') {
          // Extract the key from the URL
          const urlParts = url.split('/');
          const key = urlParts.slice(-2).join('/'); // Get "category/filename" part
          if (key && key !== image.r2_key) {
            keysToDelete.push(key);
          }
        }
      });
    }

    // Delete all files from R2
    const deletePromises = keysToDelete.map(key => 
      r2Client.send(new DeleteObjectCommand({
        Bucket: R2_CONFIG.BUCKET_NAME,
        Key: key,
      }))
    );

    try {
      await Promise.all(deletePromises);
      console.log(`✓ Deleted ${keysToDelete.length} files from R2`);
    } catch (r2Error) {
      console.warn('Some R2 files could not be deleted:', r2Error);
      // Continue with database deletion even if R2 cleanup partially fails
    }

    // Delete the database record
    await sql`
      DELETE FROM cms_images 
      WHERE id = ${imageId}
    `;

    console.log(`✓ Deleted image record from database: ID ${imageId}`);

    res.status(200).json({
      success: true,
      message: 'Image deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting image:', error);
    
    return res.status(500).json({ 
      error: 'Failed to delete image',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}