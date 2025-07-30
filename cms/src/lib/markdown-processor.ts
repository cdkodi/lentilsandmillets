/**
 * Custom Markdown Extensions Processor
 * Handles custom image syntax: {image:filename:variant:alignment}
 */

import { R2_CONFIG, IMAGE_VARIANTS, ImageVariant } from './r2-client';

// Type definitions
interface ImageProcessingOptions {
  baseUrl?: string;
  defaultVariant?: ImageVariant;
  defaultAlignment?: string;
}

interface ProcessedImage {
  filename: string;
  variant: ImageVariant;
  alignment: string;
  url: string;
  cssClass: string;
  altText: string;
}

// Supported alignment options
const ALIGNMENT_CLASSES = {
  'center': 'flex justify-center my-8',
  'left': 'float-left mr-6 mb-4 max-w-sm',
  'right': 'float-right ml-6 mb-4 max-w-sm',
  'full-width': 'w-full my-12',
  'inline': 'inline-block mx-2 my-1'
} as const;

type AlignmentType = keyof typeof ALIGNMENT_CLASSES;

/**
 * Main markdown processor function
 * Converts custom image syntax to HTML
 */
export function processCustomMarkdown(content: string, options: ImageProcessingOptions = {}): string {
  // Regex to match {image:filename:variant:alignment} or {image:filename:variant:alignment|caption}
  const imageRegex = /\{image:([^:|\}]+):([^:|\}]+):([^|\}]+)(?:\|([^}]*))?\}/g;
  
  return content.replace(imageRegex, (match, filename, variant, alignment, caption) => {
    try {
      const processedImage = processImageTag(filename, variant, alignment, options);
      return generateImageHTML(processedImage, caption);
    } catch (error) {
      console.error('Error processing image tag:', match, error);
      // Return placeholder or original match on error
      return `<div class="bg-gray-100 p-4 text-center text-gray-500 rounded">
        <p>Image not found: ${filename}</p>
      </div>`;
    }
  });
}

/**
 * Process individual image tag
 */
function processImageTag(
  filename: string, 
  variant: string, 
  alignment: string, 
  options: ImageProcessingOptions
): ProcessedImage {
  // Validate variant
  const imageVariant = validateVariant(variant, options.defaultVariant);
  
  // Validate alignment
  const imageAlignment = validateAlignment(alignment);
  
  // Generate image URL
  const imageUrl = generateImageUrl(filename, imageVariant, options.baseUrl);
  
  // Generate CSS classes
  const cssClass = generateCSSClasses(imageAlignment, imageVariant);
  
  // Generate alt text
  const altText = generateAltText(filename);
  
  return {
    filename,
    variant: imageVariant,
    alignment: imageAlignment,
    url: imageUrl,
    cssClass,
    altText
  };
}

/**
 * Validate and return proper variant
 */
function validateVariant(variant: string, defaultVariant?: ImageVariant): ImageVariant {
  if (variant in IMAGE_VARIANTS) {
    return variant as ImageVariant;
  }
  
  console.warn(`Invalid image variant: ${variant}. Using default.`);
  return defaultVariant || 'card_medium';
}

/**
 * Validate and return proper alignment
 */
function validateAlignment(alignment: string): AlignmentType {
  if (alignment in ALIGNMENT_CLASSES) {
    return alignment as AlignmentType;
  }
  
  console.warn(`Invalid alignment: ${alignment}. Using center.`);
  return 'center';
}

/**
 * Generate image URL based on filename and variant
 */
function generateImageUrl(filename: string, variant: ImageVariant, baseUrl?: string): string {
  const config = IMAGE_VARIANTS[variant];
  const dimensions = `${config.width}x${config.height}`;
  
  // Clean filename (remove extension if present)
  const cleanFilename = filename.replace(/\.[^/.]+$/, "");
  
  // Use provided base URL or default R2 configuration
  const publicUrl = baseUrl || R2_CONFIG.PUBLIC_URL;
  
  // Generate the full URL
  return `${publicUrl}/articles/${cleanFilename}_${dimensions}.jpg`;
}

/**
 * Generate CSS classes for the image container
 */
function generateCSSClasses(alignment: AlignmentType, variant: ImageVariant): string {
  const alignmentClass = ALIGNMENT_CLASSES[alignment];
  const variantClass = getVariantCSSClass(variant);
  
  return `${alignmentClass} ${variantClass}`.trim();
}

/**
 * Get CSS classes specific to image variant
 */
function getVariantCSSClass(variant: ImageVariant): string {
  const variantClasses = {
    'hero_large': 'w-full max-w-6xl',
    'hero_recipe': 'w-full max-w-2xl',
    'card_medium': 'w-full max-w-xl',
    'thumbnail': 'w-full max-w-xs',
    'social': 'w-full max-w-4xl',
    'mobile': 'w-full max-w-2xl'
  };
  
  return variantClasses[variant] || 'w-full max-w-xl';
}

/**
 * Generate alt text from filename
 */
function generateAltText(filename: string): string {
  // Convert filename to readable alt text
  return filename
    .replace(/[-_]/g, ' ')
    .replace(/\.[^/.]+$/, '')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Generate final HTML for the image
 */
function generateImageHTML(processedImage: ProcessedImage, caption?: string): string {
  const { url, cssClass, altText, variant } = processedImage;
  
  // Get responsive image attributes
  const config = IMAGE_VARIANTS[variant];
  
  const imageElement = `
    <img 
      src="${url}" 
      alt="${altText}" 
      width="${config.width}"
      height="${config.height}"
      class="custom-article-image rounded-lg shadow-sm object-cover"
      loading="lazy"
      decoding="async"
    />
  `;
  
  // Wrap in container with optional caption
  if (caption) {
    return `
      <figure class="${cssClass}">
        ${imageElement}
        <figcaption class="text-sm text-gray-600 mt-2 text-center italic">
          ${caption}
        </figcaption>
      </figure>
    `;
  }
  
  return `
    <div class="${cssClass}">
      ${imageElement}
    </div>
  `;
}

/**
 * Utility function to extract all image references from content
 * Useful for preloading or validation
 */
export function extractImageReferences(content: string): ProcessedImage[] {
  const imageRegex = /\{image:([^:|\}]+):([^:|\}]+):([^|\}]+)(?:\|([^}]*))?\}/g;
  const images: ProcessedImage[] = [];
  let match;
  
  while ((match = imageRegex.exec(content)) !== null) {
    const [, filename, variant, alignment] = match;
    try {
      const processedImage = processImageTag(filename, variant, alignment, {});
      images.push(processedImage);
    } catch (error) {
      console.error('Error extracting image reference:', match[0], error);
    }
  }
  
  return images;
}

/**
 * Validate markdown content for image syntax errors
 */
export function validateImageSyntax(content: string): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  const imageRegex = /\{image:([^:|\}]+):([^:|\}]+):([^|\}]+)(?:\|([^}]*))?\}/g;
  let match;
  
  while ((match = imageRegex.exec(content)) !== null) {
    const [fullMatch, filename, variant, alignment] = match;
    
    // Check if variant exists
    if (!(variant in IMAGE_VARIANTS)) {
      errors.push(`Invalid variant "${variant}" in: ${fullMatch}`);
    }
    
    // Check if alignment exists
    if (!(alignment in ALIGNMENT_CLASSES)) {
      errors.push(`Invalid alignment "${alignment}" in: ${fullMatch}`);
    }
    
    // Check filename format
    if (!filename || filename.trim().length === 0) {
      errors.push(`Empty filename in: ${fullMatch}`);
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

// Export types for use in other components
export type { ImageProcessingOptions, ProcessedImage, AlignmentType };
export { ALIGNMENT_CLASSES, IMAGE_VARIANTS };