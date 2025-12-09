/**
 * Client-side image compression utility
 * Compresses images before upload to avoid Vercel 4.5MB body size limit
 */

export interface CompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number; // 0-1, default 0.85
  maxSizeMB?: number; // Target max size in MB
}

/**
 * Compress an image file
 * @param file - Original image file
 * @param options - Compression options
 * @returns Compressed File object
 */
export async function compressImage(
  file: File,
  options: CompressionOptions = {}
): Promise<File> {
  const {
    maxWidth = 1920,
    maxHeight = 1440,
    quality = 0.85,
    maxSizeMB = 4, // Vercel limit is 4.5MB, use 4MB to be safe
  } = options;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const img = new Image();
      
      img.onload = () => {
        // Calculate new dimensions while maintaining aspect ratio
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        // Create canvas and compress
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }

        // Draw image to canvas
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to blob with compression
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Failed to compress image'));
              return;
            }

            // If still too large, reduce quality further
            const blobSizeMB = blob.size / (1024 * 1024);
            if (blobSizeMB > maxSizeMB) {
              // Try with lower quality
              canvas.toBlob(
                (lowerQualityBlob) => {
                  if (!lowerQualityBlob) {
                    reject(new Error('Failed to compress image'));
                    return;
                  }
                  
                  const compressedFile = new File(
                    [lowerQualityBlob],
                    file.name.replace(/\.[^/.]+$/, '') + '.webp',
                    { type: 'image/webp' }
                  );
                  resolve(compressedFile);
                },
                'image/webp',
                Math.max(0.5, quality - 0.2) // Reduce quality by 0.2, minimum 0.5
              );
            } else {
              const compressedFile = new File(
                [blob],
                file.name.replace(/\.[^/.]+$/, '') + '.webp',
                { type: 'image/webp' }
              );
              resolve(compressedFile);
            }
          },
          'image/webp',
          quality
        );
      };

      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };

      img.src = e.target?.result as string;
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Compress multiple images
 * @param files - Array of File objects
 * @param options - Compression options
 * @returns Array of compressed File objects
 */
export async function compressImages(
  files: File[],
  options: CompressionOptions = {}
): Promise<File[]> {
  return Promise.all(files.map((file) => compressImage(file, options)));
}

/**
 * Check if file needs compression
 * @param file - File to check
 * @param maxSizeMB - Maximum size in MB before compression is needed
 * @returns true if file should be compressed
 */
export function shouldCompress(file: File, maxSizeMB: number = 4): boolean {
  const sizeMB = file.size / (1024 * 1024);
  return sizeMB > maxSizeMB;
}

