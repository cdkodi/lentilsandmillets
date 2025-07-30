import { NextApiRequest, NextApiResponse } from 'next';
import { IncomingForm, File } from 'formidable';
import { promises as fs } from 'fs';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { neon } from '@neondatabase/serverless';
import { r2Client, R2_CONFIG, generateR2Key, getR2PublicUrl, SUPPORTED_MIME_TYPES, MAX_FILE_SIZE } from '@/lib/r2-client';
import { processImageVariants, validateImage, generateBlurPlaceholder, getImageMetadata } from '@/lib/image-processor';
import path from 'path';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// Disable body parser to handle multipart/form-data
export const config = {
  api: {
    bodyParser: false,
  },
};

interface UploadedImageRecord {
  id: number;
  filename: string;
  original_name: string;
  file_size: number;
  mime_type: string;
  width: number;
  height: number;
  r2_key: string;
  public_url: string;
  variants: Record<string, any>;
  alt_text: string | null;
  category: string;
  created_at: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Initialize database connection
    const sql = neon(process.env.DATABASE_URL!);

    // Parse the multipart form data
    const form = new IncomingForm({
      maxFileSize: MAX_FILE_SIZE,
      allowEmptyFiles: false,
    });

    const { fields, files } = await new Promise<{ fields: any; files: any }>((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        else resolve({ fields, files });
      });
    });

    // Get the uploaded file
    const uploadedFile = Array.isArray(files.file) ? files.file[0] : files.file;
    
    if (!uploadedFile) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Get form fields
    const category = Array.isArray(fields.category) ? fields.category[0] : fields.category || 'general';
    const altText = Array.isArray(fields.alt_text) ? fields.alt_text[0] : fields.alt_text || '';

    // Validate file type
    if (!SUPPORTED_MIME_TYPES.includes(uploadedFile.mimetype as any)) {
      return res.status(400).json({ 
        error: `Unsupported file type. Supported types: ${SUPPORTED_MIME_TYPES.join(', ')}` 
      });
    }

    // Read the file buffer
    const fileBuffer = await fs.readFile(uploadedFile.filepath);

    // Validate the image
    const validation = await validateImage(fileBuffer, MAX_FILE_SIZE);
    if (!validation.isValid) {
      return res.status(400).json({ error: validation.error });
    }

    console.log(`Processing upload: ${uploadedFile.originalFilename} (${Math.round(fileBuffer.length / 1024)}KB)`);

    // Generate unique filename and R2 key
    const fileExtension = path.extname(uploadedFile.originalFilename || '').toLowerCase();
    const baseFilename = path.basename(uploadedFile.originalFilename || 'image', fileExtension);
    const uniqueFilename = `${baseFilename}_${Date.now()}${fileExtension}`;
    const r2Key = generateR2Key(uniqueFilename, category);

    // Get original image metadata
    const originalMetadata = await getImageMetadata(fileBuffer);

    // Generate image variants
    const variants = await processImageVariants(fileBuffer, ['hero_large', 'card_medium', 'thumbnail', 'social']);

    // Generate blur placeholder
    const blurPlaceholder = await generateBlurPlaceholder(fileBuffer);

    // Upload original and all variants to R2
    const uploadPromises: Promise<any>[] = [];
    const variantUrls: Record<string, string> = {};

    // Upload original image
    const originalKey = r2Key;
    uploadPromises.push(
      r2Client.send(new PutObjectCommand({
        Bucket: R2_CONFIG.BUCKET_NAME,
        Key: originalKey,
        Body: fileBuffer,
        ContentType: uploadedFile.mimetype || 'image/jpeg',
        CacheControl: 'public, max-age=31536000', // 1 year cache
      }))
    );
    variantUrls.original = getR2PublicUrl(originalKey);

    // Upload all variants
    for (const [variantName, variantData] of Object.entries(variants)) {
      const variantKey = `${r2Key.replace(fileExtension, '')}_${variantName}${variantData.format === 'webp' ? '.webp' : '.jpg'}`;
      
      uploadPromises.push(
        r2Client.send(new PutObjectCommand({
          Bucket: R2_CONFIG.BUCKET_NAME,
          Key: variantKey,
          Body: variantData.buffer,
          ContentType: variantData.format === 'webp' ? 'image/webp' : 'image/jpeg',
          CacheControl: 'public, max-age=31536000',
        }))
      );
      
      variantUrls[variantName] = getR2PublicUrl(variantKey);
    }

    // Wait for all uploads to complete
    await Promise.all(uploadPromises);
    console.log(`✓ Uploaded ${uploadPromises.length} files to R2`);

    // Prepare variants data for database
    const variantsData = {
      urls: variantUrls,
      metadata: Object.fromEntries(
        Object.entries(variants).map(([name, data]) => [
          name, 
          { 
            width: data.width, 
            height: data.height, 
            size: data.size,
            format: data.format 
          }
        ])
      ),
      blur_placeholder: blurPlaceholder,
    };

    // Save image record to database
    const [imageRecord] = await sql`
      INSERT INTO cms_images (
        filename, original_name, file_size, mime_type, width, height,
        r2_key, public_url, variants, alt_text, category
      ) VALUES (
        ${uniqueFilename}, ${uploadedFile.originalFilename}, ${originalMetadata.size},
        ${uploadedFile.mimetype}, ${originalMetadata.width}, ${originalMetadata.height},
        ${r2Key}, ${variantUrls.original}, ${JSON.stringify(variantsData)},
        ${altText}, ${category}
      )
      RETURNING *;
    `;

    console.log(`✓ Saved image record to database: ID ${imageRecord.id}`);

    // Clean up temporary file
    try {
      await fs.unlink(uploadedFile.filepath);
    } catch (error) {
      console.warn('Could not delete temporary file:', error);
    }

    // Return the created image record
    res.status(201).json({
      success: true,
      data: {
        id: imageRecord.id,
        filename: imageRecord.filename,
        original_name: imageRecord.original_name,
        file_size: imageRecord.file_size,
        mime_type: imageRecord.mime_type,
        width: imageRecord.width,
        height: imageRecord.height,
        public_url: imageRecord.public_url,
        variants: imageRecord.variants,
        alt_text: imageRecord.alt_text,
        category: imageRecord.category,
        created_at: imageRecord.created_at,
      } as UploadedImageRecord,
    });

  } catch (error) {
    console.error('Upload error:', error);
    
    // Return appropriate error message
    if (error instanceof Error) {
      return res.status(500).json({ 
        error: 'Upload failed', 
        details: error.message 
      });
    }
    
    return res.status(500).json({ 
      error: 'An unexpected error occurred during upload' 
    });
  }
}