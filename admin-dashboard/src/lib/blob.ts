/**
 * Vercel Blob Storage client for image uploads
 */

import { put } from '@vercel/blob';
import sharp from 'sharp';

export interface UploadResult {
  url: string;
  width: number;
  height: number;
  blurDataURL: string;
}

/**
 * Upload and optimize an image to Vercel Blob Storage
 * @param file - File object or Buffer
 * @param filename - Desired filename
 * @returns Upload result with URL, dimensions, and blur placeholder
 */
export async function uploadImage(
  file: File | Buffer,
  filename: string
): Promise<UploadResult> {
  // Convert File to Buffer if needed
  const buffer = file instanceof File 
    ? Buffer.from(await file.arrayBuffer())
    : file;

  // Optimize image: resize to 1920x1440, convert to WebP, quality 85%
  const optimized = await sharp(buffer)
    .rotate() // Auto-rotate based on EXIF
    .resize(1920, 1440, {
      fit: 'inside',
      withoutEnlargement: true,
    })
    .webp({ quality: 85 })
    .toBuffer();

  // Generate blur placeholder (20x15 thumbnail, base64)
  const blurPlaceholder = await sharp(buffer)
    .resize(20, 15, { fit: 'cover' })
    .webp({ quality: 20 })
    .toBuffer();
  const blurDataURL = `data:image/webp;base64,${blurPlaceholder.toString('base64')}`;

  // Get image dimensions
  const metadata = await sharp(optimized).metadata();
  const width = metadata.width || 1920;
  const height = metadata.height || 1440;

  // Upload to Vercel Blob
  const blob = await put(filename, optimized, {
    access: 'public',
    contentType: 'image/webp',
  });

  return {
    url: blob.url,
    width,
    height,
    blurDataURL,
  };
}

