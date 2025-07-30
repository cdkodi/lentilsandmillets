import { S3Client } from '@aws-sdk/client-s3';

// Validate required environment variables
const requiredEnvVars = {
  R2_ACCESS_KEY_ID: process.env.R2_ACCESS_KEY_ID,
  R2_SECRET_ACCESS_KEY: process.env.R2_SECRET_ACCESS_KEY,
  R2_ACCOUNT_ID: process.env.R2_ACCOUNT_ID,
  R2_BUCKET_NAME: process.env.R2_BUCKET_NAME,
};

// Check for missing environment variables
const missingVars = Object.entries(requiredEnvVars)
  .filter(([_, value]) => !value)
  .map(([key]) => key);

if (missingVars.length > 0) {
  throw new Error(
    `Missing required Cloudflare R2 environment variables: ${missingVars.join(', ')}\n` +
    'Please add them to your .env.local file. See .env.local for template.'
  );
}

// Create and configure the S3 client for Cloudflare R2
export const r2Client = new S3Client({
  region: 'auto', // Cloudflare R2 uses 'auto' as the region
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
  // Additional configuration for better compatibility
  forcePathStyle: false, // Use virtual hosted-style URLs
});

// Export configuration constants
export const R2_CONFIG = {
  BUCKET_NAME: process.env.R2_BUCKET_NAME!,
  PUBLIC_URL: process.env.R2_PUBLIC_URL || `https://${process.env.R2_BUCKET_NAME}.${process.env.R2_ACCOUNT_ID}.r2.dev`,
  ACCOUNT_ID: process.env.R2_ACCOUNT_ID!,
} as const;

// Helper function to generate R2 object key
export function generateR2Key(filename: string, category: string = 'general'): string {
  const timestamp = Date.now();
  const sanitizedFilename = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
  return `${category}/${timestamp}_${sanitizedFilename}`;
}

// Helper function to get public URL for an R2 object
export function getR2PublicUrl(key: string): string {
  return `${R2_CONFIG.PUBLIC_URL}/${key}`;
}

// Supported image MIME types
export const SUPPORTED_MIME_TYPES = [
  'image/jpeg',
  'image/jpg', 
  'image/png',
  'image/webp',
  'image/gif',
] as const;

// Maximum file size (10MB)
export const MAX_FILE_SIZE = 10 * 1024 * 1024;

// Image variant configurations
export const IMAGE_VARIANTS = {
  hero_large: { width: 1200, height: 675, quality: 85 },
  hero_recipe: { width: 800, height: 1000, quality: 85 },
  card_medium: { width: 600, height: 400, quality: 80 },
  thumbnail: { width: 300, height: 200, quality: 75 },
  social: { width: 1200, height: 630, quality: 85 },
  mobile: { width: 800, height: 450, quality: 80 },
} as const;

export type ImageVariant = keyof typeof IMAGE_VARIANTS;