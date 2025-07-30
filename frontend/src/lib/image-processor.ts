import sharp from 'sharp';
import { IMAGE_VARIANTS, ImageVariant } from './r2-client';

export interface ProcessedImage {
  buffer: Buffer;
  width: number;
  height: number;
  size: number;
  format: string;
}

export interface ImageVariants {
  [key: string]: ProcessedImage;
}

/**
 * Process an image file and generate multiple variants
 * @param buffer - The original image buffer
 * @param variants - Array of variant names to generate
 * @returns Object containing all processed variants
 */
export async function processImageVariants(
  buffer: Buffer, 
  variants: ImageVariant[] = ['hero_large', 'card_medium', 'thumbnail']
): Promise<ImageVariants> {
  const results: ImageVariants = {};
  
  // Get original image metadata
  const originalImage = sharp(buffer);
  const metadata = await originalImage.metadata();
  
  console.log(`Processing image: ${metadata.width}x${metadata.height}, format: ${metadata.format}`);

  // Process each variant
  for (const variantName of variants) {
    const config = IMAGE_VARIANTS[variantName];
    
    try {
      const processed = await originalImage
        .clone()
        .resize(config.width, config.height, {
          fit: 'cover', // Crop to fill the dimensions
          position: 'center', // Center the crop
        })
        .jpeg({ 
          quality: config.quality,
          progressive: true // Enable progressive JPEG for better loading
        })
        .toBuffer({ resolveWithObject: true });

      results[variantName] = {
        buffer: processed.data,
        width: processed.info.width,
        height: processed.info.height,
        size: processed.data.length,
        format: 'jpeg'
      };

      console.log(`✓ Generated ${variantName}: ${processed.info.width}x${processed.info.height} (${Math.round(processed.data.length / 1024)}KB)`);
    } catch (error) {
      console.error(`Error processing variant ${variantName}:`, error);
      throw new Error(`Failed to process image variant: ${variantName}`);
    }
  }

  // Also generate WebP versions for modern browsers
  for (const variantName of variants) {
    const config = IMAGE_VARIANTS[variantName];
    const webpName = `${variantName}_webp`;
    
    try {
      const processed = await originalImage
        .clone()
        .resize(config.width, config.height, {
          fit: 'cover',
          position: 'center',
        })
        .webp({ 
          quality: Math.max(config.quality - 10, 70), // Slightly lower quality for WebP
          effort: 4 // Balance between file size and processing time
        })
        .toBuffer({ resolveWithObject: true });

      results[webpName] = {
        buffer: processed.data,
        width: processed.info.width,
        height: processed.info.height,
        size: processed.data.length,
        format: 'webp'
      };

      console.log(`✓ Generated ${webpName}: ${processed.info.width}x${processed.info.height} (${Math.round(processed.data.length / 1024)}KB)`);
    } catch (error) {
      console.warn(`Warning: Could not generate WebP variant ${webpName}:`, error.message);
      // Continue without WebP if it fails
    }
  }

  return results;
}

/**
 * Get image metadata without processing
 * @param buffer - Image buffer
 * @returns Image metadata
 */
export async function getImageMetadata(buffer: Buffer) {
  try {
    const image = sharp(buffer);
    const metadata = await image.metadata();
    
    return {
      width: metadata.width || 0,
      height: metadata.height || 0,
      format: metadata.format || 'unknown',
      size: buffer.length,
      hasAlpha: metadata.hasAlpha || false,
      channels: metadata.channels || 3,
    };
  } catch (error) {
    console.error('Error getting image metadata:', error);
    throw new Error('Invalid image file');
  }
}

/**
 * Validate image file
 * @param buffer - Image buffer
 * @param maxSizeBytes - Maximum allowed file size in bytes
 * @returns Validation result
 */
export async function validateImage(buffer: Buffer, maxSizeBytes: number = 10 * 1024 * 1024) {
  if (buffer.length > maxSizeBytes) {
    throw new Error(`Image file too large. Maximum size is ${Math.round(maxSizeBytes / 1024 / 1024)}MB`);
  }

  try {
    const metadata = await getImageMetadata(buffer);
    
    if (!metadata.width || !metadata.height) {
      throw new Error('Invalid image: Could not determine dimensions');
    }

    if (metadata.width > 5000 || metadata.height > 5000) {
      throw new Error('Image dimensions too large. Maximum is 5000x5000 pixels');
    }

    return {
      isValid: true,
      metadata,
    };
  } catch (error) {
    return {
      isValid: false,
      error: error instanceof Error ? error.message : 'Unknown validation error',
    };
  }
}

/**
 * Generate a blur placeholder for progressive loading
 * @param buffer - Original image buffer
 * @returns Base64 encoded blur placeholder
 */
export async function generateBlurPlaceholder(buffer: Buffer): Promise<string> {
  try {
    const placeholder = await sharp(buffer)
      .resize(20, 20, { fit: 'cover' })
      .blur(2)
      .jpeg({ quality: 50 })
      .toBuffer();
    
    return `data:image/jpeg;base64,${placeholder.toString('base64')}`;
  } catch (error) {
    console.warn('Could not generate blur placeholder:', error);
    // Return a simple gray placeholder if Sharp fails
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiBmaWxsPSIjRjNGNEY2Ii8+Cjwvc3ZnPgo=';
  }
}